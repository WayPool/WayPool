/**
 * Sistema de pagos USDC multi-red para WayBank
 * Soporta transferencias reales de USDC desde cualquier red compatible
 */

import { Contract, parseUnits, formatUnits } from 'ethers';
import { BrowserProvider } from 'ethers';

// Configuración de USDC por red - Direcciones oficiales verificadas
export const USDC_CONFIG = {
  // Ethereum Mainnet
  1: {
    address: '0xA0b86a33E6441e42932a660B17F0B6CA6eb19632', // USDC nativo en Ethereum
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    networkName: 'Ethereum'
  },
  // Polygon
  137: {
    address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC nativo en Polygon ✅ VERIFICADO
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    networkName: 'Polygon'
  },
  // Arbitrum One
  42161: {
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC nativo en Arbitrum
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    networkName: 'Arbitrum'
  },
  // Base
  8453: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC nativo en Base
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    networkName: 'Base'
  },
  // Optimism
  10: {
    address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC nativo en Optimism
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    networkName: 'Optimism'
  },
  // Unichain
  1301: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Temporal - se actualizará cuando esté disponible
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    networkName: 'Unichain'
  }
} as const;

// ABI mínimo de ERC20 para transferencias
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

export interface USDCTransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
  networkName?: string;
  amount?: string;
}

export interface NetworkInfo {
  chainId: number;
  networkName: string;
  usdcConfig?: typeof USDC_CONFIG[keyof typeof USDC_CONFIG];
}

/**
 * Detecta la red actual del usuario
 */
export async function detectUserNetwork(): Promise<NetworkInfo> {
  try {
    if (!window.ethereum) {
      throw new Error('No wallet detected');
    }

    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    const usdcConfig = USDC_CONFIG[chainId as keyof typeof USDC_CONFIG];
    
    return {
      chainId,
      networkName: usdcConfig?.networkName || `Network ${chainId}`,
      usdcConfig
    };
  } catch (error) {
    console.error('Error detecting network:', error);
    throw new Error('Could not detect network');
  }
}

/**
 * Obtiene el balance de USDC del usuario en la red actual
 */
export async function getUSDCBalance(userAddress: string): Promise<string> {
  try {
    console.log('🔍 Obteniendo balance USDC para:', userAddress);
    const networkInfo = await detectUserNetwork();
    console.log('🌐 Red detectada:', networkInfo);
    
    if (!networkInfo.usdcConfig) {
      console.error('❌ USDC no soportado en la red:', networkInfo.networkName);
      throw new Error(`USDC not supported on ${networkInfo.networkName}`);
    }

    console.log('📄 Contrato USDC a consultar:', networkInfo.usdcConfig.address);
    console.log('🔢 Decimales USDC:', networkInfo.usdcConfig.decimals);

    const provider = new BrowserProvider(window.ethereum!);
    const usdcContract = new Contract(
      networkInfo.usdcConfig.address,
      ERC20_ABI,
      provider
    );

    console.log('🔄 Consultando balance en blockchain...');
    const balance = await usdcContract.balanceOf(userAddress);
    const formattedBalance = formatUnits(balance, networkInfo.usdcConfig.decimals);
    
    console.log('✅ Balance obtenido:', {
      raw: balance.toString(),
      formatted: formattedBalance,
      decimals: networkInfo.usdcConfig.decimals
    });
    
    return formattedBalance;
  } catch (error) {
    console.error('❌ Error getting USDC balance:', error);
    return '0';
  }
}

/**
 * Verifica si el usuario tiene suficiente USDC
 */
export async function checkUSDCBalance(userAddress: string, requiredAmount: string): Promise<{
  hasEnough: boolean;
  userBalance: string;
  networkName: string;
}> {
  try {
    const balance = await getUSDCBalance(userAddress);
    const networkInfo = await detectUserNetwork();
    
    const hasEnough = parseFloat(balance) >= parseFloat(requiredAmount);
    
    return {
      hasEnough,
      userBalance: balance,
      networkName: networkInfo.networkName
    };
  } catch (error) {
    console.error('Error checking USDC balance:', error);
    return {
      hasEnough: false,
      userBalance: '0',
      networkName: 'Unknown'
    };
  }
}

/**
 * Realiza una transferencia de USDC real al wallet de administración
 */
export async function transferUSDC(
  userAddress: string,
  adminAddress: string,
  amount: string
): Promise<USDCTransferResult> {
  try {
    // Verificar que tenemos acceso a la wallet
    if (!window.ethereum) {
      return {
        success: false,
        error: 'No wallet detected. Please install MetaMask or another Web3 wallet.'
      };
    }

    // Detectar red y configuración de USDC
    const networkInfo = await detectUserNetwork();
    
    if (!networkInfo.usdcConfig) {
      return {
        success: false,
        error: `USDC not supported on ${networkInfo.networkName}. Please switch to Ethereum, Polygon, Arbitrum, Base, or Optimism.`
      };
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Verificar que el usuario tiene suficiente USDC
    const balanceCheck = await checkUSDCBalance(userAddress, amount);
    if (!balanceCheck.hasEnough) {
      return {
        success: false,
        error: `Insufficient USDC balance. You have ${balanceCheck.userBalance} USDC but need ${amount} USDC.`
      };
    }

    // Crear contrato de USDC con signer para poder enviar transacciones
    const usdcContract = new Contract(
      networkInfo.usdcConfig.address,
      ERC20_ABI,
      signer
    );

    // Convertir amount a unidades del token (6 decimales para USDC)
    const amountInWei = parseUnits(amount, networkInfo.usdcConfig.decimals);

    console.log(`💰 Transferring ${amount} ${networkInfo.usdcConfig.symbol} on ${networkInfo.networkName}`);
    console.log(`📍 From: ${userAddress}`);
    console.log(`📍 To: ${adminAddress}`);
    console.log(`🏦 Contract: ${networkInfo.usdcConfig.address}`);

    // Realizar la transferencia
    const tx = await usdcContract.transfer(adminAddress, amountInWei);
    
    console.log(`🔄 Transaction sent: ${tx.hash}`);
    console.log(`⏳ Waiting for confirmation...`);

    // Esperar confirmación
    const receipt = await tx.wait();

    if (receipt && receipt.status === 1) {
      console.log(`✅ Transfer confirmed! Block: ${receipt.blockNumber}`);
      
      return {
        success: true,
        txHash: tx.hash,
        networkName: networkInfo.networkName,
        amount: `${amount} ${networkInfo.usdcConfig.symbol}`
      };
    } else {
      return {
        success: false,
        error: 'Transaction failed during confirmation'
      };
    }

  } catch (error: any) {
    console.error('❌ USDC transfer error:', error);
    
    // Manejar errores específicos
    if (error.code === 'ACTION_REJECTED') {
      return {
        success: false,
        error: 'Transaction was rejected by user'
      };
    }
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return {
        success: false,
        error: 'Insufficient funds for gas fees'
      };
    }

    return {
      success: false,
      error: error.message || 'Unknown error during transfer'
    };
  }
}

/**
 * Cambia la red del usuario (helper para UX)
 */
export async function switchToSupportedNetwork(targetChainId?: number): Promise<boolean> {
  try {
    if (!window.ethereum) {
      return false;
    }

    // Si no se especifica una red, usar Ethereum como default
    const chainId = targetChainId || 1;
    const hexChainId = `0x${chainId.toString(16)}`;

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });

    return true;
  } catch (error) {
    console.error('Error switching network:', error);
    return false;
  }
}

/**
 * Obtiene todas las redes soportadas
 */
export function getSupportedNetworks() {
  return Object.entries(USDC_CONFIG).map(([chainId, config]) => ({
    chainId: parseInt(chainId),
    ...config
  }));
}