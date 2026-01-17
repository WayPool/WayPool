/**
 * DefiLlama APR Service
 * Obtiene APR real de pools de Uniswap desde DefiLlama API
 */

interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number;
  apy: number;
  pool: string;
  poolMeta: string;
  underlyingTokens: string[];
  volumeUsd1d: number;
  volumeUsd7d: number;
}

interface PoolAPRData {
  poolAddress: string;
  poolName: string;
  apr: number;
  tvl: number;
  volume24h: number;
  volume7d: number;
  feeTier: string;
  chain: string;
  lastUpdated: Date;
}

// Cache para evitar llamadas excesivas a DefiLlama
let cachedData: DefiLlamaPool[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene todos los pools de Uniswap V3 desde DefiLlama
 */
async function fetchDefiLlamaData(): Promise<DefiLlamaPool[]> {
  const now = Date.now();

  // Usar cache si es válido
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('[DefiLlama] Usando datos en cache');
    return cachedData;
  }

  try {
    console.log('[DefiLlama] Obteniendo datos frescos...');
    const response = await fetch('https://yields.llama.fi/pools');

    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`);
    }

    const data = await response.json();

    // Filtrar solo pools de Uniswap V3
    cachedData = data.data.filter((pool: DefiLlamaPool) =>
      pool.project === 'uniswap-v3'
    );

    cacheTimestamp = now;
    console.log(`[DefiLlama] Cargados ${cachedData.length} pools de Uniswap V3`);

    return cachedData;
  } catch (error) {
    console.error('[DefiLlama] Error fetching data:', error);
    // Devolver cache aunque esté expirado si hay error
    return cachedData || [];
  }
}

/**
 * Mapea fee tier de la base de datos a formato DefiLlama
 */
function mapFeeTier(feeTier: number): string {
  const feeMap: Record<number, string> = {
    100: '0.01%',
    500: '0.05%',
    3000: '0.3%',
    10000: '1%'
  };
  return feeMap[feeTier] || '0.3%';
}

/**
 * Busca el APR de un pool específico por sus tokens subyacentes
 */
export async function getPoolAPR(
  token0Address: string,
  token1Address: string,
  feeTier: number,
  chain: string = 'Ethereum'
): Promise<PoolAPRData | null> {
  const pools = await fetchDefiLlamaData();

  const token0Lower = token0Address.toLowerCase();
  const token1Lower = token1Address.toLowerCase();
  const targetFeeTier = mapFeeTier(feeTier);
  const targetChain = chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();

  // Buscar pool que coincida con los tokens y fee tier
  const matchingPool = pools.find(pool => {
    if (pool.chain !== targetChain) return false;
    if (pool.poolMeta !== targetFeeTier) return false;

    const poolTokens = pool.underlyingTokens.map(t => t.toLowerCase());

    // Los tokens pueden estar en cualquier orden
    const hasToken0 = poolTokens.some(t => t === token0Lower);
    const hasToken1 = poolTokens.some(t => t === token1Lower);

    return hasToken0 && hasToken1;
  });

  if (!matchingPool) {
    console.log(`[DefiLlama] No se encontro pool para ${token0Address}/${token1Address} ${targetFeeTier} en ${targetChain}`);
    return null;
  }

  return {
    poolAddress: matchingPool.pool,
    poolName: matchingPool.symbol,
    apr: matchingPool.apy || matchingPool.apyBase || 0,
    tvl: matchingPool.tvlUsd || 0,
    volume24h: matchingPool.volumeUsd1d || 0,
    volume7d: matchingPool.volumeUsd7d || 0,
    feeTier: matchingPool.poolMeta,
    chain: matchingPool.chain,
    lastUpdated: new Date()
  };
}

/**
 * Obtiene APR para múltiples pools
 */
export async function getMultiplePoolsAPR(
  pools: Array<{
    token0Address: string;
    token1Address: string;
    feeTier: number;
    network: string;
    name: string;
  }>
): Promise<Record<string, PoolAPRData | null>> {
  const result: Record<string, PoolAPRData | null> = {};

  // Pre-cargar datos de DefiLlama
  await fetchDefiLlamaData();

  for (const pool of pools) {
    const aprData = await getPoolAPR(
      pool.token0Address,
      pool.token1Address,
      pool.feeTier,
      pool.network
    );

    result[pool.name] = aprData;
  }

  return result;
}

/**
 * Fuerza actualización del cache
 */
export function invalidateCache(): void {
  cachedData = null;
  cacheTimestamp = 0;
  console.log('[DefiLlama] Cache invalidado');
}

export default {
  getPoolAPR,
  getMultiplePoolsAPR,
  invalidateCache
};
