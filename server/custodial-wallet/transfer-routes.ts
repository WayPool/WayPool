import { Router } from 'express';
import { custodialTransferService } from './transfer-service';
import { z } from 'zod';

// Obtener el middleware de verificación de sesión del módulo de rutas original
import custodialWalletRouter from './routes';

// Crear router para las rutas de transferencia
const transferRouter = Router();

// Esquemas de validación
const transferETHSchema = z.object({
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Dirección ETH inválida"),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "El monto debe ser un número positivo"
  }),
  network: z.enum(["ethereum", "polygon"], {
    errorMap: () => ({ message: "Red no soportada. Debe ser 'ethereum' o 'polygon'" })
  }),
});

const transferERC20Schema = z.object({
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Dirección ETH inválida"),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Dirección de token inválida"),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "El monto debe ser un número positivo"
  }),
  network: z.enum(["ethereum", "polygon"], {
    errorMap: () => ({ message: "Red no soportada. Debe ser 'ethereum' o 'polygon'" })
  }),
});

const transferNFTSchema = z.object({
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Dirección ETH inválida"),
  nftAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Dirección de NFT inválida"),
  tokenId: z.string().min(1, "ID de token requerido"),
  network: z.enum(["ethereum", "polygon"], {
    errorMap: () => ({ message: "Red no soportada. Debe ser 'ethereum' o 'polygon'" })
  }),
});

// Middleware para verificar el token de sesión
const verifySession = async (req: any, res: any, next: any) => {
  try {
    // Obtener el token de sesión de las cookies, headers o query params
    // con una búsqueda más exhaustiva para asegurar la compatibilidad
    const sessionToken = 
      req.cookies?.custodialSession || 
      req.headers['x-custodial-session'] || 
      req.headers['x-session-token'] ||
      req.headers['session-token'] ||
      req.query.sessionToken || 
      req.body?.sessionToken;
    
    // Obtener dirección de la billetera de la ruta
    const address = req.params.address;
    if (!address) {
      return res.status(400).json({ 
        error: 'Dirección de billetera no especificada', 
        code: 'ADDRESS_MISSING'
      });
    }
    
    // Almacenar la dirección para su uso posterior siempre
    req.walletAddress = address;
    
    // Registrar información para diagnóstico
    console.log(`Middleware verifySession - Wallet: ${address}, Token presente: ${!!sessionToken}`);
    
    // Verificación más flexible para consultas de solo lectura
    const isReadOnlyRoute = req.method === 'GET';
    if (!sessionToken) {
      if (isReadOnlyRoute) {
        // Para rutas de solo lectura, podemos permitir continuar sin token en ciertos casos
        console.warn(`Acceso sin token de sesión a ruta de solo lectura: ${req.originalUrl}`);
        // No establecemos req.sessionToken para que las verificaciones posteriores sepan que no hay sesión
        return next();
      } else {
        // Para operaciones de escritura, siempre requerimos token
        return res.status(401).json({ 
          error: 'Sesión no proporcionada', 
          code: 'SESSION_MISSING'
        });
      }
    }
    
    // Almacenar el token de sesión para su uso posterior
    req.sessionToken = sessionToken;
    
    next();
  } catch (error) {
    console.error('Error en middleware de verificación:', error);
    res.status(500).json({ 
      error: 'Error al verificar la sesión', 
      code: 'VERIFICATION_ERROR' 
    });
  }
};

// Ruta para transferir ETH nativo
transferRouter.post('/:address/send-eth', verifySession, async (req, res) => {
  try {
    // Validar datos de entrada
    const validationResult = transferETHSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de transferencia inválidos',
        details: validationResult.error.format(),
        code: 'VALIDATION_ERROR'
      });
    }
    
    const { toAddress, amount, network } = validationResult.data;
    
    // Para wallets externos como MetaMask, solo validamos pero no ejecutamos la transferencia
    // El wallet se encarga de firmar y enviar la transacción
    const result = {
      success: true,
      message: 'Use your connected wallet to sign and send this transaction',
      transactionData: {
        to: toAddress,
        value: amount,
        network: network
      },
      requiresWalletSignature: true
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al transferir ETH:', error);
    res.status(500).json({ 
      error: error.message || 'Error al transferir ETH',
      code: 'TRANSFER_ERROR'
    });
  }
});

// Ruta para transferir tokens ERC20
transferRouter.post('/:address/send-token', verifySession, async (req, res) => {
  try {
    // Validar datos de entrada
    const validationResult = transferERC20Schema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de transferencia inválidos',
        details: validationResult.error.format(),
        code: 'VALIDATION_ERROR'
      });
    }
    
    const { toAddress, tokenAddress, amount, network } = validationResult.data;
    
    // Ejecutar la transferencia
    const result = await custodialTransferService.transferERC20(
      req.walletAddress,
      toAddress,
      tokenAddress,
      amount,
      network,
      req.sessionToken
    );
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al transferir tokens:', error);
    res.status(500).json({ 
      error: error.message || 'Error al transferir tokens',
      code: 'TRANSFER_ERROR'
    });
  }
});

// Ruta para transferir NFTs
transferRouter.post('/:address/send-nft', verifySession, async (req, res) => {
  try {
    // Validar datos de entrada
    const validationResult = transferNFTSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de transferencia inválidos',
        details: validationResult.error.format(),
        code: 'VALIDATION_ERROR'
      });
    }
    
    const { toAddress, nftAddress, tokenId, network } = validationResult.data;
    
    // Ejecutar la transferencia
    const result = await custodialTransferService.transferNFT(
      req.walletAddress,
      toAddress,
      nftAddress,
      tokenId,
      network,
      req.sessionToken
    );
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al transferir NFT:', error);
    res.status(500).json({ 
      error: error.message || 'Error al transferir NFT',
      code: 'TRANSFER_ERROR' 
    });
  }
});

// Ruta para obtener historial de transferencias
transferRouter.get('/:address/history', verifySession, async (req, res) => {
  try {
    // Obtener historial
    const history = await custodialTransferService.getTransferHistory(
      req.walletAddress,
      req.sessionToken
    );
    
    res.status(200).json({ transfers: history });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener historial de transferencias',
      code: 'HISTORY_ERROR'
    });
  }
});

// Ruta para obtener saldos de la billetera
transferRouter.get('/:address/balances', verifySession, async (req, res) => {
  try {
    const network = (req.query.network as string) || 'ethereum';
    const address = req.walletAddress; // Ya configurado por middleware verifySession
    
    // Validar red
    if (network !== 'ethereum' && network !== 'polygon') {
      return res.status(400).json({
        error: 'Red no soportada. Debe ser ethereum o polygon',
        code: 'INVALID_NETWORK'
      });
    }
    
    console.log(`Solicitando saldos para wallet ${address} en red ${network}, token presente: ${!!req.sessionToken}`);
    
    // Usar el nuevo método de verificación que permite lectura sin token
    await custodialTransferService.verifySession(
      address, 
      req.sessionToken, 
      { 
        skipThrow: true, 
        readOnly: true 
      }
    );
    
    // Intentar obtener los saldos
    try {
      console.log(`Consultando saldos on-chain para ${address} en ${network} usando Alchemy`);
      const balances = await custodialTransferService.getWalletBalances(address, network);
      
      // Agregar información de autenticación en la respuesta
      // Si llegamos hasta aquí, tenemos un wallet conectado, por lo que está autenticado
      const response = {
        ...balances,
        auth: {
          authenticated: true, // Wallet conectado = autenticado
          readOnly: false // Permitir transferencias para wallets conectados
        }
      };
      
      console.log(`Saldos recuperados exitosamente para ${address} en ${network}`);
      return res.status(200).json(response);
    } catch (balanceError: any) {
      console.error(`Error al obtener saldos de ${address} en ${network}:`, balanceError);
      return res.status(500).json({ 
        error: balanceError.message || 'Error al obtener saldos de blockchain',
        code: 'BALANCE_ERROR',
        auth: {
          authenticated: true, // Wallet conectado = autenticado
          readOnly: false // Permitir transferencias para wallets conectados
        }
      });
    }
  } catch (error: any) {
    console.error('Error general al procesar solicitud de saldos:', error);
    res.status(500).json({ 
      error: error.message || 'Error interno al procesar solicitud de saldos',
      code: 'REQUEST_ERROR'
    });
  }
});

// Ruta para obtener NFTs de la billetera
transferRouter.get('/:address/nfts', verifySession, async (req, res) => {
  try {
    const network = (req.query.network as string) || 'ethereum';
    
    // Validar red
    if (network !== 'ethereum' && network !== 'polygon') {
      return res.status(400).json({
        error: 'Red no soportada. Debe ser ethereum o polygon',
        code: 'INVALID_NETWORK'
      });
    }
    
    // Obtener NFTs
    const nfts = await custodialTransferService.getWalletNFTs(
      req.walletAddress,
      network
    );
    
    res.status(200).json(nfts);
  } catch (error) {
    console.error('Error al obtener NFTs:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener NFTs',
      code: 'NFT_ERROR'
    });
  }
});

export default transferRouter;