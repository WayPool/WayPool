import { ethers } from 'ethers';
import { pool } from '../db';
import { custodialWalletService } from './service';
import crypto from 'crypto';

// ERC20 ABI mínimo necesario para transferencias
const ERC20_ABI = [
  // Función transfer
  'function transfer(address to, uint256 amount) returns (bool)',
  // Función balanceOf
  'function balanceOf(address owner) view returns (uint256)',
  // Función decimals
  'function decimals() view returns (uint8)',
  // Función symbol
  'function symbol() view returns (string)',
  // Función name
  'function name() view returns (string)',
];

// ERC721 ABI mínimo necesario para transferencias de NFTs
const ERC721_ABI = [
  // Función transferFrom
  'function transferFrom(address from, address to, uint256 tokenId)',
  // Función safeTransferFrom
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  // Función ownerOf
  'function ownerOf(uint256 tokenId) view returns (address)',
  // Función tokenURI
  'function tokenURI(uint256 tokenId) view returns (string)',
];

/**
 * Servicio de transferencia de activos para billeteras custodiadas
 */
export class CustodialTransferService {
  // Proveedores para diferentes redes
  private providers: Record<string, ethers.JsonRpcProvider> = {
    ethereum: new ethers.JsonRpcProvider(
      process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY
    ),
    polygon: new ethers.JsonRpcProvider(
      process.env.POLYGON_RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY
    ),
  };

  constructor() {
    console.log('Inicializando servicio de transferencia para billeteras custodiadas');
  }

  /**
   * Obtener el proveedor para una red específica
   */
  private getProvider(network: string): ethers.JsonRpcProvider {
    const provider = this.providers[network.toLowerCase()];
    if (!provider) {
      throw new Error(`Red no soportada: ${network}`);
    }
    return provider;
  }

  /**
   * Verificar sesión y permiso para operar con una billetera
   * @param walletAddress Dirección de la billetera a verificar
   * @param sessionToken Token de sesión
   * @param options Opciones adicionales para la verificación
   */
  async verifySession(
    walletAddress: string, 
    sessionToken: string | undefined,
    options?: { 
      skipThrow?: boolean, // No lanzar error si es true
      readOnly?: boolean // Modo de solo lectura si es true
    }
  ): Promise<boolean> {
    const opts = {
      skipThrow: false,
      readOnly: false,
      ...options
    };
    
    // Si no hay token y estamos en modo solo lectura, podemos permitir el acceso
    if (!sessionToken) {
      console.warn(`Verificación de sesión: No hay token para ${walletAddress}, readOnly=${opts.readOnly}`);
      
      if (opts.readOnly && opts.skipThrow) {
        return false; // No hay sesión pero continuamos
      }
      
      if (opts.skipThrow) {
        return false;
      }
      
      throw new Error('Token de sesión no proporcionado');
    }
    
    try {
      // Intentar verificar la sesión con el token proporcionado
      const session = await custodialWalletService.verifySession(sessionToken);
      
      // Verificar que la sesión es válida y corresponde a la dirección
      if (!session) {
        console.error(`Sesión no encontrada para token: ${sessionToken.substring(0, 10)}...`);
        if (opts.skipThrow) return false;
        throw new Error('Sesión inválida o expirada');
      }
      
      // Verificar que la sesión corresponde a la billetera
      if (session.address !== walletAddress) {
        console.error(`La sesión (${session.address}) no corresponde a la billetera solicitada (${walletAddress})`);
        if (opts.skipThrow) return false;
        throw new Error('No tienes permiso para operar con esta billetera');
      }
      
      console.log(`Sesión verificada correctamente para wallet ${walletAddress}`);
      return true;
    } catch (error: any) {
      console.error('Error al verificar sesión:', error);
      
      if (opts.skipThrow) {
        return false;
      }
      
      throw new Error(`Sesión inválida: ${error.message || 'Error desconocido'}`);
    }
  }
  
  /**
   * Obtener la clave privada de una billetera
   */
  private async getWalletPrivateKey(walletAddress: string, sessionToken: string): Promise<string> {
    try {
      // Verificar sesión
      await this.verifySession(walletAddress, sessionToken);

      // Caso especial para billetera de prueba
      if (walletAddress.toLowerCase() === '0xc2dd65af9fed4a01fb8764d65c591077f02c6497') {
        console.log('[getWalletPrivateKey] Retornando clave de prueba para wallet de demo');
        // Clave privada de prueba (no se usa en producción, solo para demo)
        return '0x0123456789012345678901234567890123456789012345678901234567890123';
      }

      // Obtener datos de la billetera
      const walletResult = await pool.query(
        `SELECT encrypted_private_key, encryption_iv, salt, password_hash
         FROM custodial_wallets
         WHERE address = $1 AND active = true`,
        [walletAddress]
      );

      if (walletResult.rowCount === 0) {
        throw new Error('Billetera no encontrada');
      }

      const walletData = walletResult.rows[0];
      
      // Obtener la clave maestra del sistema desde variables de entorno
      const masterKey = process.env.WALLET_MASTER_KEY;
      if (!masterKey) {
        console.error('[getWalletPrivateKey] Error crítico: Clave maestra no configurada');
        throw new Error('Error de configuración del sistema');
      }

      // Usar la clave maestra para descifrar las claves privadas
      // En un entorno de producción real, deberíamos usar un HSM para esto
      console.log('[getWalletPrivateKey] Iniciando descifrado de clave privada');
      
      // Obtener los datos necesarios para el descifrado
      const encryptedPrivateKey = walletData.encrypted_private_key;
      const ivHex = walletData.encryption_iv;
      const iv = Buffer.from(ivHex, 'hex');
      
      // Usar crypto para descifrar
      // Convertir la clave maestra a un buffer de 32 bytes
      const keyBuffer = crypto.createHash('sha256').update(masterKey).digest();
      
      try {
        // Separar datos cifrados y authTag
        const parts = encryptedPrivateKey.split(':');
        if (parts.length !== 2) {
          throw new Error('Formato de datos cifrados incorrecto');
        }
        
        const [encryptedKey, authTagHex] = parts;
        const authTag = Buffer.from(authTagHex, 'hex');
        
        // Algoritmo AES-256-GCM
        const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        console.log('[getWalletPrivateKey] Clave privada descifrada correctamente');
        
        return decrypted;
      } catch (decryptError) {
        console.error('[getWalletPrivateKey] Error al descifrar la clave privada:', decryptError);
        throw new Error('Error al acceder a la información del wallet');
      }
    } catch (error) {
      console.error('[getWalletPrivateKey] Error al obtener clave privada:', error);
      throw new Error('No se pudo acceder a la billetera');
    }
  }

  /**
   * Transferir ETH nativo desde una billetera custodiada
   */
  async transferETH(
    fromAddress: string,
    toAddress: string,
    amount: string,
    network: string,
    sessionToken: string
  ) {
    try {
      const provider = this.getProvider(network);
      
      // Obtener clave privada (esto debe implementarse de forma segura)
      const privateKey = await this.getWalletPrivateKey(fromAddress, sessionToken);
      
      // Crear instancia de billetera
      const wallet = new ethers.Wallet(privateKey, provider);
      
      // Verificar saldo
      const balance = await provider.getBalance(fromAddress);
      const etherAmount = ethers.parseEther(amount);
      
      if (balance < etherAmount) {
        throw new Error('Saldo insuficiente para completar la transferencia');
      }
      
      // Estimar gas para la transacción
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
      const gasLimit = 21000n; // Valor estándar para transferencias de ETH
      const gasCost = gasPrice * gasLimit;
      
      // Verificar que hay suficiente para cubrir el gas
      if (balance < (etherAmount + gasCost)) {
        throw new Error('Saldo insuficiente para cubrir la transferencia y las tarifas de gas');
      }
      
      // Crear transacción
      const tx = {
        to: toAddress,
        value: etherAmount,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        nonce: await provider.getTransactionCount(fromAddress, 'latest'),
        chainId: (await provider.getNetwork()).chainId,
      };
      
      // Firmar y enviar transacción
      // En ethers v6, podemos usar directamente wallet.sendTransaction en lugar de
      // firmar primero y luego enviar con provider.sendTransaction
      const txResponse = await wallet.sendTransaction(tx);
      
      // Registrar la transferencia en la base de datos
      await this.logTransfer({
        fromAddress,
        toAddress,
        amount,
        txHash: txResponse.hash,
        network,
        assetType: 'NATIVE',
        assetAddress: null,
        tokenId: null
      });
      
      return {
        success: true,
        txHash: txResponse.hash,
        fromAddress,
        toAddress,
        amount,
        network,
        assetType: 'NATIVE',
        gasUsed: gasLimit.toString(),
        status: 'PENDING'
      };
    } catch (error: any) {
      console.error('Error al transferir ETH:', error);
      throw new Error(`No se pudo transferir ETH: ${error.message || error}`);
    }
  }

  /**
   * Transferir tokens ERC20 desde una billetera custodiada
   */
  async transferERC20(
    fromAddress: string,
    toAddress: string,
    tokenAddress: string,
    amount: string,
    network: string,
    sessionToken: string
  ) {
    try {
      const provider = this.getProvider(network);
      
      // Obtener clave privada (esto debe implementarse de forma segura)
      const privateKey = await this.getWalletPrivateKey(fromAddress, sessionToken);
      
      // Crear instancia de billetera
      const wallet = new ethers.Wallet(privateKey, provider);
      
      // Crear instancia de contrato ERC20
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
      
      // Obtener información del token
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      
      // Verificar saldo
      const balance = await contract.balanceOf(fromAddress);
      const tokenAmount = ethers.parseUnits(amount, decimals);
      
      if (balance < tokenAmount) {
        throw new Error(`Saldo insuficiente de ${symbol} para completar la transferencia`);
      }
      
      // Estimar gas
      // Use el método adecuado para ethers.js v6
      const gasEstimate = BigInt(await contract.estimateGas.transfer(toAddress, tokenAmount));
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
      
      // Verificar que hay suficiente ETH para cubrir el gas
      const ethBalance = await provider.getBalance(fromAddress);
      const gasCost = gasPrice * gasEstimate;
      
      if (ethBalance < gasCost) {
        throw new Error('Saldo insuficiente de ETH para cubrir las tarifas de gas');
      }
      
      // Transferir tokens
      const tx = await contract.transfer(toAddress, tokenAmount, {
        gasLimit: gasEstimate * 120n / 100n, // Agregar 20% de margen
        gasPrice
      });
      
      // Registrar la transferencia en la base de datos
      await this.logTransfer({
        fromAddress,
        toAddress,
        amount,
        txHash: tx.hash,
        network,
        assetType: 'ERC20',
        assetAddress: tokenAddress,
        tokenId: null
      });
      
      return {
        success: true,
        txHash: tx.hash,
        fromAddress,
        toAddress,
        amount,
        tokenSymbol: symbol,
        tokenAddress,
        network,
        assetType: 'ERC20',
        gasUsed: gasEstimate.toString(),
        status: 'PENDING'
      };
    } catch (error: any) {
      console.error('Error al transferir tokens ERC20:', error);
      throw new Error(`No se pudo transferir tokens: ${error.message || error}`);
    }
  }

  /**
   * Transferir NFT desde una billetera custodiada
   */
  async transferNFT(
    fromAddress: string,
    toAddress: string,
    nftAddress: string,
    tokenId: string,
    network: string,
    sessionToken: string
  ) {
    try {
      const provider = this.getProvider(network);
      
      // Obtener clave privada (esto debe implementarse de forma segura)
      const privateKey = await this.getWalletPrivateKey(fromAddress, sessionToken);
      
      // Crear instancia de billetera
      const wallet = new ethers.Wallet(privateKey, provider);
      
      // Crear instancia de contrato ERC721
      const contract = new ethers.Contract(nftAddress, ERC721_ABI, wallet);
      
      // Verificar propiedad
      const owner = await contract.ownerOf(tokenId);
      if (owner.toLowerCase() !== fromAddress.toLowerCase()) {
        throw new Error('No eres el propietario de este NFT');
      }
      
      // Estimar gas - preferimos safeTransferFrom pero caemos a transferFrom si es necesario
      let gasEstimate;
      let useSafeTransfer = true;
      
      try {
        gasEstimate = BigInt(await contract.estimateGas.safeTransferFrom(fromAddress, toAddress, tokenId));
      } catch (error) {
        // Si safeTransferFrom falla, intentamos con transferFrom
        useSafeTransfer = false;
        try {
          gasEstimate = BigInt(await contract.estimateGas.transferFrom(fromAddress, toAddress, tokenId));
        } catch (transferError: any) {
          throw new Error(`No se pudo estimar el gas para la transferencia: ${transferError.message}`);
        }
      }
      
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
      
      // Verificar que hay suficiente ETH para cubrir el gas
      const ethBalance = await provider.getBalance(fromAddress);
      const gasCost = gasPrice * gasEstimate;
      
      if (ethBalance < gasCost) {
        throw new Error('Saldo insuficiente de ETH para cubrir las tarifas de gas');
      }
      
      // Transferir NFT
      let tx;
      const gasLimit = gasEstimate * 120n / 100n; // Agregar 20% de margen
      
      if (useSafeTransfer) {
        tx = await contract.safeTransferFrom(fromAddress, toAddress, tokenId, {
          gasLimit,
          gasPrice
        });
      } else {
        tx = await contract.transferFrom(fromAddress, toAddress, tokenId, {
          gasLimit,
          gasPrice
        });
      }
      
      // Registrar la transferencia en la base de datos
      await this.logTransfer({
        fromAddress,
        toAddress,
        amount: '1',
        txHash: tx.hash,
        network,
        assetType: 'NFT',
        assetAddress: nftAddress,
        tokenId
      });
      
      return {
        success: true,
        txHash: tx.hash,
        fromAddress,
        toAddress,
        tokenId,
        nftAddress,
        network,
        assetType: 'NFT',
        transferMethod: useSafeTransfer ? 'safeTransferFrom' : 'transferFrom',
        gasUsed: gasEstimate.toString(),
        status: 'PENDING'
      };
    } catch (error: any) {
      console.error('Error al transferir NFT:', error);
      throw new Error(`No se pudo transferir el NFT: ${error.message || error}`);
    }
  }

  /**
   * Obtener el historial de transferencias de una billetera
   */
  async getTransferHistory(address: string, sessionToken: string) {
    try {
      // Verificar sesión
      const session = await custodialWalletService.verifySession(sessionToken);
      if (!session || session.address !== address) {
        throw new Error('Sesión inválida o no tienes permiso para esta billetera');
      }
      
      // Obtener historial de transferencias
      const result = await pool.query(
        `SELECT * FROM custodial_transfers
         WHERE from_address = $1 OR to_address = $1
         ORDER BY created_at DESC
         LIMIT 50`,
        [address]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error al obtener historial de transferencias:', error);
      throw new Error(`No se pudo obtener el historial: ${error.message}`);
    }
  }

  /**
   * Registrar una transferencia en la base de datos
   */
  private async logTransfer(transfer: {
    fromAddress: string,
    toAddress: string,
    amount: string,
    txHash: string,
    network: string,
    assetType: 'NATIVE' | 'ERC20' | 'NFT',
    assetAddress: string | null,
    tokenId: string | null
  }) {
    try {
      await pool.query(
        `INSERT INTO custodial_transfers
         (from_address, to_address, amount, tx_hash, network, asset_type, asset_address, token_id, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          transfer.fromAddress,
          transfer.toAddress,
          transfer.amount,
          transfer.txHash,
          transfer.network,
          transfer.assetType,
          transfer.assetAddress,
          transfer.tokenId,
          'PENDING'
        ]
      );
    } catch (error) {
      console.error('Error al registrar transferencia:', error);
      // No lanzamos error para no interrumpir el flujo principal
    }
  }

  /**
   * Obtener saldos de la billetera (ETH/MATIC y tokens ERC20 comunes)
   */
  async getWalletBalances(address: string, network: string) {
    try {
      console.log(`Iniciando consulta de saldos para ${address} en red ${network} usando Alchemy`);
      
      // Validar la dirección Ethereum
      if (!ethers.isAddress(address)) {
        throw new Error('La dirección de wallet no es válida');
      }
      
      const provider = this.getProvider(network);
      
      // Obtener saldo de ETH/MATIC nativo con manejo de errores mejorado
      let nativeBalance: bigint;
      try {
        nativeBalance = await provider.getBalance(address);
        console.log(`Saldo nativo obtenido para ${address} en ${network}: ${ethers.formatEther(nativeBalance)}`);
      } catch (error) {
        console.error(`Error crítico al obtener saldo nativo en ${network}:`, error);
        throw new Error(`Error al consultar la blockchain para obtener saldo nativo: ${error.message}`);
      }
      
      // Lista de tokens ERC20 comunes para verificar, dependiendo de la red
      const tokenList: Array<{symbol: string, address: string, decimals: number}> = [];
      
      if (network === 'ethereum') {
        tokenList.push(
          { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
          { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
          { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
          { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 }
        );
      } else if (network === 'polygon') {
        tokenList.push(
          { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
          { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
          { symbol: 'DAI', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18 },
          { symbol: 'WMATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', decimals: 18 }
        );
      } else {
        console.warn(`Red no reconocida para tokens predefinidos: ${network}, usando solo saldo nativo`);
      }
      
      console.log(`Consultando ${tokenList.length} tokens ERC20 para ${address} en ${network}`);
      
      // Obtener saldos de tokens ERC20 con tiempo límite para cada solicitud
      const tokenBalances = await Promise.all(
        tokenList.map(async (token) => {
          try {
            // Crear instancia del contrato con tiempo límite de 5 segundos para cada llamada
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            
            // Usar Promise.race para establecer un tiempo límite
            const balancePromise = contract.balanceOf(address);
            const timeoutPromise = new Promise<bigint>((_, reject) => 
              setTimeout(() => reject(new Error(`Tiempo agotado al obtener saldo de ${token.symbol}`)), 5000)
            );
            
            // Esperar la primera promesa que se resuelva (o la que falle primero)
            const balance = await Promise.race([balancePromise, timeoutPromise]) as bigint;
            
            const formattedBalance = ethers.formatUnits(balance, token.decimals);
            console.log(`Saldo de ${token.symbol} obtenido: ${formattedBalance}`);
            
            return {
              symbol: token.symbol,
              address: token.address,
              balance: formattedBalance,
              rawBalance: balance.toString(),
              decimals: token.decimals
            };
          } catch (error) {
            console.error(`Error al obtener saldo de ${token.symbol}:`, error);
            return {
              symbol: token.symbol,
              address: token.address,
              balance: '0',
              rawBalance: '0',
              decimals: token.decimals,
              error: true
            };
          }
        })
      );
      
      // Construir y devolver el objeto de respuesta
      const response = {
        nativeBalance: {
          symbol: network.toLowerCase() === 'ethereum' ? 'ETH' : 'MATIC',
          balance: ethers.formatEther(nativeBalance),
          rawBalance: nativeBalance.toString(),
          decimals: 18
        },
        tokenBalances: tokenBalances.filter(token => !token.error || parseFloat(token.balance) > 0)
      };
      
      console.log(`Consulta de saldos completada exitosamente para ${address}`);
      return response;
    } catch (error) {
      console.error('Error al obtener saldos de la billetera:', error);
      throw new Error(`No se pudo obtener los saldos: ${error.message || 'Error desconocido'}`);
    }
  }

  /**
   * Obtener NFTs de la billetera
   */
  async getWalletNFTs(address: string, network: string) {
    try {
      // En una implementación completa, aquí se consultaría una API como Alchemy o Moralis
      // para obtener todos los NFTs de la billetera
      
      // Para simplificar, este método será un marcador de posición
      // que podría reemplazarse con una integración real
      
      // Ejemplo de estructura de respuesta
      return {
        total: 0,
        nfts: []
      };
    } catch (error) {
      console.error('Error al obtener NFTs de la billetera:', error);
      throw new Error(`No se pudo obtener los NFTs: ${error.message}`);
    }
  }
}

// Exportar instancia del servicio
export const custodialTransferService = new CustodialTransferService();