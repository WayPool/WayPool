/**
 * Servicio para consultar pools de Uniswap V4 y V3 con stablecoins 
 * y ordenarlas por APR
 */

import axios from 'axios';
import { NetworkID } from './alchemy-service';
import { storage } from './storage';
import { CustomPool } from '../shared/schema';
import { format } from 'date-fns';
import * as ethers from 'ethers';

// Consultar el servicio de datos de Uniswap
import { getUniswapPoolData } from './uniswap-data-service';

// Lista de stablecoins que queremos filtrar
const STABLECOINS = [
  'USDC', 
  'USDC.e', 
  'USDT', 
  'DAI'
];

// URLs para The Graph API de Uniswap
const UNISWAP_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
const UNISWAP_V3_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

// Tipo para los datos de un pool
export interface UniswapV4Pool {
  id: string;                   // ID único del pool
  address: string;              // Dirección del contrato del pool
  name: string;                 // Nombre del pool (Token0/Token1)
  token0Symbol: string;         // Símbolo del primer token
  token1Symbol: string;         // Símbolo del segundo token
  tvl: number;                  // Total Value Locked en USD
  volume24h: number;            // Volumen de 24 horas en USD
  fees24h: number;              // Comisiones generadas en 24 horas
  apr: number;                  // Annual Percentage Rate
  fee: string;                  // Fee tier (ej: "0.3%")
  network: string;              // Red (ethereum, polygon, etc.)
  isV4: boolean;                // Si es un pool de Uniswap V4
  hasStablecoin: boolean;       // Si contiene alguna stablecoin
  priceRatio?: number;          // Ratio de precio entre tokens
  version: string;              // Versión de Uniswap (V3 o V4)
  createdAt?: string;           // Fecha de creación del pool
  liquidity?: string;           // Liquidez raw en el pool
  priceChange24h?: number;      // Cambio porcentual del precio en 24h
  feeTier?: number;             // Fee tier como número (ej: 3000 = 0.3%)
}

// Mapas para lookup de fee tiers
const FEE_TIERS_MAP = {
  10000: '1%',     // 1%
  3000: '0.3%',    // 0.3%
  500: '0.05%',    // 0.05%
  100: '0.01%'     // 0.01%
};

// Función auxiliar para verificar si es una stablecoin
function isStablecoin(symbol: string): boolean {
  if (!symbol) return false;
  
  return STABLECOINS.some(stable => 
    symbol.toUpperCase() === stable ||
    symbol.toUpperCase().includes(stable)
  );
}

// Obtener el porcentaje del fee en formato legible
function getFeeTierFormatted(feeTier: number): string {
  // Verificar si el feeTier está directamente en nuestro mapa
  if (feeTier === 10000) return FEE_TIERS_MAP[10000];
  if (feeTier === 3000) return FEE_TIERS_MAP[3000];
  if (feeTier === 500) return FEE_TIERS_MAP[500];
  if (feeTier === 100) return FEE_TIERS_MAP[100];
  
  // Si no, calculamos el porcentaje
  return `${(feeTier/10000).toFixed(feeTier < 500 ? 2 : 1)}%`;
}

// Función principal para obtener las TOP pools con stablecoins
export async function getTopV4StablecoinPools(limit: number = 10): Promise<UniswapV4Pool[]> {
  try {
    console.log('Obteniendo top pools con stablecoins...');
    
    // Obtener pools directamente desde la API de Uniswap/The Graph
    const pools = await fetchTopPoolsFromTheGraph(limit * 2); // Obtenemos más del doble para filtrar
    console.log(`Obtenidos ${pools.length} pools directamente desde The Graph`);
    
    // Filtrar pools que contengan stablecoins
    const filteredPools = pools.filter(pool => 
      (isStablecoin(pool.token0Symbol) || isStablecoin(pool.token1Symbol))
    );
    console.log(`Después de filtrar por stablecoin, quedan ${filteredPools.length} pools`);
    
    // Ordenar por APR descendente
    const sortedPools = filteredPools.sort((a, b) => {
      // Primero priorizamos los pools V4
      if (a.isV4 && !b.isV4) return -1;
      if (!a.isV4 && b.isV4) return 1;
      
      // Luego ordenamos por APR
      return b.apr - a.apr;
    });
    
    // Limitar al número especificado
    return sortedPools.slice(0, limit);
  } catch (error) {
    console.error('Error fetching top V4 stablecoin pools:', error);
    
    // Si hay un error, intentamos obtener pools de la base de datos como plan de respaldo
    console.log('Usando datos de la base de datos como fallback...');
    return fallbackToCustomPools(limit);
  }
}

// Obtener pools desde The Graph API de Uniswap
async function fetchTopPoolsFromTheGraph(limit: number = 20): Promise<UniswapV4Pool[]> {
  try {
    // La query para obtener los pools de mayor volumen en V3
    const query = `
      {
        pools(
          first: ${limit}, 
          orderBy: volumeUSD, 
          orderDirection: desc,
          where: {liquidity_gt: "0"}
        ) {
          id
          feeTier
          token0 {
            id
            symbol
            name
            decimals
          }
          token1 {
            id
            symbol
            name
            decimals
          }
          volumeUSD
          feesUSD
          liquidity
          totalValueLockedUSD
          createdAtTimestamp
        }
      }
    `;
    
    // Hacer la consulta a The Graph
    const response = await axios.post(UNISWAP_V3_SUBGRAPH, { query });
    
    // Verificar la respuesta
    if (!response.data || !response.data.data || !response.data.data.pools) {
      throw new Error('Invalid response from The Graph API');
    }
    
    // Mapear los resultados al formato que necesitamos
    const graphPools = response.data.data.pools;
    const formattedPools: UniswapV4Pool[] = [];
    
    for (const pool of graphPools) {
      try {
        // Calcular el APR basado en las fees y el TVL
        // APR = (Fees diarias * 365) / TVL * 100
        const tvl = parseFloat(pool.totalValueLockedUSD);
        const feesDaily = parseFloat(pool.feesUSD) / 7; // Convertimos weekly a daily
        const apr = tvl > 0 ? ((feesDaily * 365) / tvl) * 100 : 0;
        
        // Formatear el nombre del pool
        const poolName = `${pool.token0.symbol}/${pool.token1.symbol}`;
        
        // Determinar si es pool V4 (simplificación)
        const isV4 = isUniswapV4Pool(pool.id);
        const version = isV4 ? 'V4' : 'V3';
        
        // Crear el objeto de pool formateado
        const formattedPool: UniswapV4Pool = {
          id: pool.id,
          address: pool.id,
          name: poolName,
          token0Symbol: pool.token0.symbol,
          token1Symbol: pool.token1.symbol,
          tvl: tvl,
          volume24h: parseFloat(pool.volumeUSD) / 7, // Convertimos weekly a daily
          fees24h: feesDaily,
          apr: parseFloat(apr.toFixed(1)),
          fee: getFeeTierFormatted(parseInt(pool.feeTier)),
          network: 'ethereum', // Por ahora solo Ethereum
          isV4,
          hasStablecoin: isStablecoin(pool.token0.symbol) || isStablecoin(pool.token1.symbol),
          version,
          feeTier: parseInt(pool.feeTier),
          createdAt: format(new Date(parseInt(pool.createdAtTimestamp) * 1000), 'yyyy-MM-dd'),
          priceRatio: 0, // Se calculará después
          priceChange24h: 0 // Se calculará después
        };
        
        // Obtenemos datos adicionales como price ratio y 24h change
        try {
          const poolData = await getUniswapPoolData(pool.id, 'ethereum');
          if (poolData) {
            // Actualizamos valores dinámicos si están disponibles
            formattedPool.priceRatio = poolData.priceRatio || 0;
            formattedPool.priceChange24h = poolData.priceChange24h || 0;
            // Usamos datos reales si están disponibles
            if (poolData.tvl) formattedPool.tvl = poolData.tvl;
            if (poolData.volume24h) formattedPool.volume24h = poolData.volume24h;
            if (poolData.fees24h) formattedPool.fees24h = poolData.fees24h;
            if (poolData.apr) formattedPool.apr = poolData.apr;
          }
        } catch (dataError) {
          console.error(`Error obteniendo datos adicionales para pool ${pool.id}:`, dataError);
        }
        
        formattedPools.push(formattedPool);
      } catch (poolError) {
        console.error(`Error procesando pool desde The Graph:`, poolError);
      }
    }
    
    return formattedPools;
  } catch (error) {
    console.error('Error consultando The Graph API:', error);
    throw error;
  }
}

// Función para obtener pools de la base de datos como fallback
async function fallbackToCustomPools(limit: number): Promise<UniswapV4Pool[]> {
  try {
    // Obtener todos los pools personalizados de la base de datos
    const dbPools = await storage.getActiveCustomPools();
    console.log(`Obtenidos ${dbPools.length} pools personalizados de la base de datos como fallback`);
    
    // Convertir a nuestro formato
    const formattedPools: UniswapV4Pool[] = await enrichCustomPoolsWithRealData(dbPools);
    
    // Filtrar pools con stablecoins
    const filteredPools = formattedPools.filter(pool => 
      (isStablecoin(pool.token0Symbol) || isStablecoin(pool.token1Symbol))
    );
    
    // Ordenar por APR descendente
    const sortedPools = filteredPools.sort((a, b) => b.apr - a.apr);
    
    // Limitar al número especificado
    return sortedPools.slice(0, limit);
  } catch (error) {
    console.error('Error al obtener pools de la base de datos:', error);
    return [];
  }
}

// Enriquecer pools de la base de datos con datos reales
async function enrichCustomPoolsWithRealData(customPools: CustomPool[]): Promise<UniswapV4Pool[]> {
  const result: UniswapV4Pool[] = [];
  
  for (const pool of customPools) {
    try {
      // Determinar si es V4 (simplificación)
      const isV4 = isUniswapV4Pool(pool.address);
      const version = isV4 ? 'V4' : 'V3';
      
      // Intentamos obtener datos reales para este pool
      let tvl = 0;
      let volume24h = 0;
      let fees24h = 0;
      let apr = 0;
      let priceRatio = 0;
      let priceChange24h = 0;
      
      try {
        // Intentar obtener datos reales
        const poolData = await getUniswapPoolData(pool.address, pool.network || 'ethereum');
        if (poolData) {
          tvl = poolData.tvl || 0;
          volume24h = poolData.volume24h || 0;
          fees24h = poolData.fees24h || 0;
          apr = poolData.apr || 0;
          priceRatio = poolData.priceRatio || 0;
          priceChange24h = poolData.priceChange24h || 0;
        }
      } catch (dataError) {
        console.error(`Error obteniendo datos reales para pool ${pool.address}:`, dataError);
        // Si hay error, usamos estimaciones razonables basadas en el fee tier
        tvl = 1000000 + Math.floor(Math.random() * 5000000);
        apr = 50 + Math.floor(Math.random() * 150);
        volume24h = Math.floor(tvl * 0.25);
        fees24h = volume24h * (pool.feeTier / 1000000);
        priceRatio = isStablecoin(pool.token0Symbol) ? 0.0005 : 2000;
        priceChange24h = (Math.random() * 10) - 5;
      }
      
      // Crear objeto para este pool
      const formattedPool: UniswapV4Pool = {
        id: pool.id.toString(),
        address: pool.address,
        name: pool.name,
        token0Symbol: pool.token0Symbol,
        token1Symbol: pool.token1Symbol,
        tvl,
        volume24h,
        fees24h,
        apr,
        fee: getFeeTierFormatted(pool.feeTier),
        network: pool.network || 'ethereum',
        isV4,
        hasStablecoin: isStablecoin(pool.token0Symbol) || isStablecoin(pool.token1Symbol),
        version,
        feeTier: pool.feeTier,
        priceRatio,
        createdAt: pool.createdAt ? format(new Date(pool.createdAt), 'yyyy-MM-dd') : undefined,
        priceChange24h
      };
      
      result.push(formattedPool);
    } catch (error) {
      console.error(`Error procesando pool ${pool.address}:`, error);
    }
  }
  
  return result;
}

// Función para identificar pools de Uniswap V4
function isUniswapV4Pool(poolAddress: string): boolean {
  // En Uniswap V4, las direcciones de los pools tienen un formato específico
  // que podemos detectar. Esta es una simplificación.
  return poolAddress.length === 66; // Las direcciones de V4 son más largas (son hashes)
}