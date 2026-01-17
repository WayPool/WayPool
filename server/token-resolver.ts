/**
 * Servicio para resolver tokens "Unknown" y obtener datos auténticos
 * Soluciona el problema identificado en la auditoría del panel admin
 */

import axios from 'axios';
import { ethers } from 'ethers';

interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
}

interface ResolvedPool {
  token0Symbol: string;
  token1Symbol: string;
  token0Name: string;
  token1Name: string;
  poolAddress: string;
  fee: string;
  network: string;
}

// Cache para tokens resueltos
const tokenCache = new Map<string, TokenInfo>();
const poolCache = new Map<string, ResolvedPool>();

// Proveedores RPC para diferentes redes usando la clave real de Alchemy
const RPC_ENDPOINTS = {
  ethereum: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  polygon: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
};

// ABI mínima para contratos ERC20
const ERC20_ABI = [
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function decimals() view returns (uint8)'
];

// ABI para pool de Uniswap V3
const UNISWAP_V3_POOL_ABI = [
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function fee() view returns (uint24)',
  'function liquidity() view returns (uint128)'
];

/**
 * Resuelve información de un token usando su dirección de contrato
 */
async function resolveTokenInfo(tokenAddress: string, network: string = 'ethereum'): Promise<TokenInfo | null> {
  const cacheKey = `${network}_${tokenAddress.toLowerCase()}`;
  
  // Verificar cache primero
  if (tokenCache.has(cacheKey)) {
    return tokenCache.get(cacheKey)!;
  }

  try {
    // Obtener provider para la red específica
    const rpcUrl = RPC_ENDPOINTS[network as keyof typeof RPC_ENDPOINTS];
    if (!rpcUrl) {
      console.error(`Red no soportada: ${network}`);
      return null;
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    // Obtener información del token
    const [symbol, name, decimals] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.name(),
      tokenContract.decimals()
    ]);

    const tokenInfo: TokenInfo = {
      symbol: symbol || 'UNKNOWN',
      name: name || 'Unknown Token',
      decimals: Number(decimals) || 18,
      address: tokenAddress.toLowerCase()
    };

    // Guardar en cache
    tokenCache.set(cacheKey, tokenInfo);
    
    console.log(`✅ Token resuelto: ${tokenInfo.symbol} (${tokenInfo.name}) en ${network}`);
    return tokenInfo;

  } catch (error) {
    console.error(`❌ Error resolviendo token ${tokenAddress} en ${network}:`, error);
    return null;
  }
}

/**
 * Resuelve información completa de un pool usando su dirección
 */
export async function resolvePoolInfo(poolAddress: string, network: string = 'ethereum'): Promise<ResolvedPool | null> {
  const cacheKey = `${network}_${poolAddress.toLowerCase()}`;
  
  // Verificar cache primero
  if (poolCache.has(cacheKey)) {
    return poolCache.get(cacheKey)!;
  }

  try {
    console.log(`🔍 Resolviendo pool ${poolAddress} en ${network}...`);
    
    // Obtener provider para la red específica
    const rpcUrl = RPC_ENDPOINTS[network as keyof typeof RPC_ENDPOINTS];
    if (!rpcUrl) {
      console.error(`Red no soportada: ${network}`);
      return null;
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const poolContract = new ethers.Contract(poolAddress, UNISWAP_V3_POOL_ABI, provider);

    // Obtener direcciones de tokens y fee del pool
    const [token0Address, token1Address, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee()
    ]);

    // Resolver información de ambos tokens
    const [token0Info, token1Info] = await Promise.all([
      resolveTokenInfo(token0Address, network),
      resolveTokenInfo(token1Address, network)
    ]);

    if (!token0Info || !token1Info) {
      console.error(`❌ No se pudieron resolver los tokens del pool ${poolAddress}`);
      return null;
    }

    // Formatear fee como porcentaje
    const feePercentage = formatFeeAsPercentage(Number(fee));

    const poolInfo: ResolvedPool = {
      token0Symbol: token0Info.symbol,
      token1Symbol: token1Info.symbol,
      token0Name: token0Info.name,
      token1Name: token1Info.name,
      poolAddress: poolAddress.toLowerCase(),
      fee: feePercentage,
      network
    };

    // Guardar en cache
    poolCache.set(cacheKey, poolInfo);
    
    console.log(`✅ Pool resuelto: ${poolInfo.token0Symbol}/${poolInfo.token1Symbol} (${poolInfo.fee}) en ${network}`);
    return poolInfo;

  } catch (error) {
    console.error(`❌ Error resolviendo pool ${poolAddress} en ${network}:`, error);
    return null;
  }
}

/**
 * Convierte fee numérico a formato de porcentaje legible
 */
function formatFeeAsPercentage(fee: number): string {
  const percentage = fee / 10000; // Los fees de Uniswap están en basis points
  
  if (percentage < 0.01) {
    return `${percentage.toFixed(3)}%`;
  } else if (percentage < 0.1) {
    return `${percentage.toFixed(2)}%`;
  } else {
    return `${percentage.toFixed(1)}%`;
  }
}

/**
 * Resuelve múltiples posiciones "Unknown" de una vez
 */
export async function resolveUnknownPositions(positions: any[]): Promise<any[]> {
  console.log(`🔧 Resolviendo ${positions.length} posiciones con tokens Unknown...`);
  
  const resolvedPositions = await Promise.all(positions.map(async (position) => {
    // Si ya tiene tokens válidos, no necesita resolución
    if (position.token0 !== 'Unknown' && position.token1 !== 'Unknown') {
      return position;
    }

    // Intentar resolver usando la dirección del pool
    if (position.poolAddress) {
      const poolInfo = await resolvePoolInfo(position.poolAddress, position.network || 'ethereum');
      
      if (poolInfo) {
        console.log(`✅ Posición ${position.id} resuelta: ${poolInfo.token0Symbol}/${poolInfo.token1Symbol}`);
        
        return {
          ...position,
          token0: poolInfo.token0Symbol,
          token1: poolInfo.token1Symbol,
          fee: poolInfo.fee
        };
      }
    }

    // Si no se pudo resolver, intentar con NFT token ID
    if (position.nftTokenId) {
      console.log(`🔍 Intentando resolver posición ${position.id} usando NFT ${position.nftTokenId}...`);
      // Aquí podríamos integrar con la API de OpenSea o Alchemy NFT para obtener metadatos
    }

    console.log(`⚠️ No se pudo resolver la posición ${position.id}`);
    return position;
  }));

  const resolvedCount = resolvedPositions.filter(p => 
    p.token0 !== 'Unknown' && p.token1 !== 'Unknown'
  ).length;

  console.log(`✅ Se resolvieron ${resolvedCount} de ${positions.length} posiciones Unknown`);
  
  return resolvedPositions;
}

/**
 * Función para actualizar posiciones Unknown en la base de datos
 */
export async function updateUnknownPositionsInDatabase(storage: any): Promise<void> {
  try {
    console.log('🔄 Iniciando actualización masiva de posiciones Unknown...');
    
    // Obtener todas las posiciones con tokens Unknown
    const unknownPositions = await storage.getPositionsWithUnknownTokens();
    console.log(`📊 Encontradas ${unknownPositions.length} posiciones con tokens Unknown`);
    
    if (unknownPositions.length === 0) {
      console.log('✅ No hay posiciones Unknown para actualizar');
      return;
    }

    // Resolver las posiciones
    const resolvedPositions = await resolveUnknownPositions(unknownPositions);
    
    // Actualizar en la base de datos
    let updatedCount = 0;
    for (const position of resolvedPositions) {
      if (position.token0 !== 'Unknown' && position.token1 !== 'Unknown') {
        await storage.updatePositionTokens(position.id, {
          token0: position.token0,
          token1: position.token1,
          fee: position.fee
        });
        updatedCount++;
      }
    }
    
    console.log(`✅ Actualizadas ${updatedCount} posiciones en la base de datos`);
    
  } catch (error) {
    console.error('❌ Error actualizando posiciones Unknown:', error);
    throw error;
  }
}

/**
 * Función de utilidad para limpiar cache
 */
export function clearTokenCache(): void {
  tokenCache.clear();
  poolCache.clear();
  console.log('🧹 Cache de tokens limpiado');
}

export { resolveTokenInfo };