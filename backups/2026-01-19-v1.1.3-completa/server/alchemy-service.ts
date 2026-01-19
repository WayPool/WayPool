/**
 * Servicio para interactuar con la API de Alchemy
 * Proporciona funciones para consultar balances de tokens y otras operaciones
 */

import { config } from 'dotenv';
config();

// Red IDs soportadas
export enum NetworkID {
  ETHEREUM = '1',
  POLYGON = '137',
}

// Tipo de token
export enum TokenType {
  ERC20 = 'erc20',
  ERC721 = 'erc721',
}

// Interfaces para las respuestas de Alchemy
interface TokenBalance {
  contractAddress: string;
  tokenBalance: string;
  error?: string;
}

interface TokenBalancesResponse {
  jsonrpc: string;
  id: number;
  result: {
    address: string;
    tokenBalances: TokenBalance[];
  };
}

// Direcciones de contratos de stablecoins
export const STABLECOIN_ADDRESSES = {
  // USDC y USDT en varias redes
  [NetworkID.ETHEREUM]: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  [NetworkID.POLYGON]: {
    USDC_BRIDGED: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC.e (bridged)
    USDC_NATIVE: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC nativo
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
};

// Decimales por token y red
export const TOKEN_DECIMALS = {
  USDC: 6,
  USDT: 6,
};

/**
 * Obtiene el balance de un token para una dirección
 * 
 * @param walletAddress Dirección de la wallet a consultar
 * @param tokenAddress Dirección del contrato del token
 * @param networkId ID de la red (1 para Ethereum, 137 para Polygon)
 * @param decimals Número de decimales del token (por defecto 6 para USDC/USDT)
 * @returns Balance formateado y datos asociados
 */
export async function getTokenBalance(
  walletAddress: string,
  tokenAddress: string,
  networkId: NetworkID,
  decimals: number = 6
): Promise<{
  address: string;
  tokenAddress: string;
  balance: string;
  rawBalance: string;
  decimals: number;
  network: string;
  networkId: string;
  timestamp: string;
}> {
  const API_KEY = process.env.ALCHEMY_API_KEY;
  
  if (!API_KEY) {
    throw new Error('Alchemy API key no configurada');
  }
  
  // Determinar la URL de la API según la red
  const baseUrl = networkId === NetworkID.ETHEREUM
    ? `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`
    : `https://polygon-mainnet.g.alchemy.com/v2/${API_KEY}`;
  
  console.log(`Consultando balance del token ${tokenAddress} para ${walletAddress} en red ${networkId}`);
  
  try {
    // Crear payload para la consulta a la API de Alchemy
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getTokenBalances',
      params: [walletAddress, [tokenAddress]],
    };
    
    // Realizar la petición a la API
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en la petición a Alchemy: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Parsear la respuesta
    const data = await response.json() as TokenBalancesResponse;
    
    // Verificar si hay errores en la respuesta
    if (data.result.tokenBalances[0].error) {
      throw new Error(`Error en la respuesta de Alchemy: ${data.result.tokenBalances[0].error}`);
    }
    
    // Extraer el balance en formato hex
    const rawBalance = data.result.tokenBalances[0].tokenBalance;
    
    // Convertir el balance a formato decimal
    const balance = parseInt(rawBalance, 16) / Math.pow(10, decimals);
    
    console.log(`Balance obtenido desde Alchemy: ${balance} (${rawBalance})`);
    
    return {
      address: walletAddress,
      tokenAddress,
      balance: balance.toString(),
      rawBalance: parseInt(rawBalance, 16).toString(),
      decimals,
      network: networkId === NetworkID.ETHEREUM ? 'ethereum' : 'polygon',
      networkId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error al consultar el balance con Alchemy:', error);
    throw error;
  }
}

/**
 * Obtiene el balance total de USDC en Polygon (sumando USDC.e y USDC nativo)
 * 
 * @param walletAddress Dirección de la wallet a consultar
 * @returns Balance total de USDC en Polygon
 */
export async function getTotalUSDCBalanceInPolygon(walletAddress: string): Promise<{
  address: string;
  token: string;
  network: string;
  networkId: string;
  balance: string;
  nativeBalance: string;
  bridgedBalance: string;
  decimals: number;
  timestamp: string;
}> {
  try {
    // Obtener balance de USDC.e (bridged)
    const bridgedBalance = await getTokenBalance(
      walletAddress,
      STABLECOIN_ADDRESSES[NetworkID.POLYGON].USDC_BRIDGED,
      NetworkID.POLYGON,
      TOKEN_DECIMALS.USDC
    ).catch(error => {
      console.warn('Error al obtener USDC.e (bridged):', error);
      return {
        balance: '0',
        rawBalance: '0',
      };
    });
    
    // Obtener balance de USDC nativo
    const nativeBalance = await getTokenBalance(
      walletAddress,
      STABLECOIN_ADDRESSES[NetworkID.POLYGON].USDC_NATIVE,
      NetworkID.POLYGON,
      TOKEN_DECIMALS.USDC
    ).catch(error => {
      console.warn('Error al obtener USDC nativo:', error);
      return {
        balance: '0',
        rawBalance: '0',
      };
    });
    
    // Calcular el balance total (USDC.e + USDC nativo)
    const totalBalance = parseFloat(bridgedBalance.balance || '0') + parseFloat(nativeBalance.balance || '0');
    
    console.log(`Balance total USDC en Polygon: ${totalBalance} (${parseFloat(nativeBalance.balance || '0')} nativo + ${parseFloat(bridgedBalance.balance || '0')} bridged)`);
    
    return {
      address: walletAddress,
      token: 'USDC',
      network: 'polygon',
      networkId: NetworkID.POLYGON,
      balance: totalBalance.toString(),
      nativeBalance: nativeBalance.balance || '0',
      bridgedBalance: bridgedBalance.balance || '0',
      decimals: TOKEN_DECIMALS.USDC,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error al obtener el balance total de USDC en Polygon:', error);
    throw error;
  }
}