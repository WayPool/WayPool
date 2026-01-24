/**
 * WayBank v6.0 APR Service
 *
 * IMPORTANTE: Este servicio es completamente independiente de los servicios existentes.
 * Proporciona análisis de APR para pools de Uniswap V3.
 *
 * Funcionalidades:
 * - Obtener APR de pools desde DefiLlama y The Graph
 * - Analizar top pools por APR
 * - Calcular APR estimado basado en volumen y fees
 */

import { V6_API_ENDPOINTS, V6_FEE_TIERS, V6_NETWORKS } from "./v6-config";

// ============ TYPES ============

export interface PoolAPRData {
  poolAddress: string;
  token0: string;
  token1: string;
  token0Symbol: string;
  token1Symbol: string;
  feeTier: number;
  tvlUsd: number;
  volume24hUsd: number;
  fees24hUsd: number;
  aprBase: number; // APR from fees
  aprReward: number; // APR from rewards (if any)
  aprTotal: number;
  chainId: number;
}

export interface TopPoolsResult {
  pools: PoolAPRData[];
  updatedAt: Date;
  source: string;
}

// ============ V6 APR SERVICE ============

export class V6AprService {
  private chainId: number;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes

  constructor(chainId: number = 137) {
    this.chainId = chainId;
  }

  // ============ PUBLIC METHODS ============

  /**
   * Get top pools by APR from DefiLlama
   */
  async getTopPoolsByAPR(limit: number = 10): Promise<TopPoolsResult> {
    try {
      const cacheKey = `top_pools_${this.chainId}_${limit}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(V6_API_ENDPOINTS.defiLlama.pools);
      if (!response.ok) {
        throw new Error(`DefiLlama API error: ${response.status}`);
      }

      const data = await response.json();

      // Filter for Uniswap V3 pools on our chain
      const chainName = this.getChainName();
      const uniV3Pools = data.data.filter(
        (pool: any) =>
          pool.project === "uniswap-v3" &&
          pool.chain.toLowerCase() === chainName.toLowerCase()
      );

      // Sort by APY and take top N
      const sortedPools = uniV3Pools
        .sort((a: any, b: any) => (b.apy || 0) - (a.apy || 0))
        .slice(0, limit);

      // Map to our format
      const pools: PoolAPRData[] = sortedPools.map((pool: any) => ({
        poolAddress: pool.pool || "",
        token0: "",
        token1: "",
        token0Symbol: pool.symbol?.split("-")[0] || "",
        token1Symbol: pool.symbol?.split("-")[1] || "",
        feeTier: this.extractFeeTier(pool.symbol),
        tvlUsd: pool.tvlUsd || 0,
        volume24hUsd: 0, // DefiLlama doesn't provide volume directly
        fees24hUsd: 0,
        aprBase: pool.apyBase || 0,
        aprReward: pool.apyReward || 0,
        aprTotal: pool.apy || 0,
        chainId: this.chainId,
      }));

      const result: TopPoolsResult = {
        pools,
        updatedAt: new Date(),
        source: "defillama",
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("[V6 APR Service] Error fetching top pools:", error);
      throw error;
    }
  }

  /**
   * Get pool data from The Graph
   */
  async getPoolDataFromSubgraph(poolAddress: string): Promise<PoolAPRData | null> {
    try {
      const query = `
        {
          pool(id: "${poolAddress.toLowerCase()}") {
            id
            token0 {
              id
              symbol
              decimals
            }
            token1 {
              id
              symbol
              decimals
            }
            feeTier
            liquidity
            sqrtPrice
            tick
            totalValueLockedUSD
            volumeUSD
            feesUSD
          }
        }
      `;

      const response = await fetch(V6_API_ENDPOINTS.theGraph.polygon, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Subgraph error: ${response.status}`);
      }

      const data = await response.json();
      const pool = data.data?.pool;

      if (!pool) {
        return null;
      }

      // Estimate APR based on fees and TVL (simplified)
      const estimatedApr = this.calculateEstimatedAPR(
        parseFloat(pool.feesUSD),
        parseFloat(pool.totalValueLockedUSD)
      );

      return {
        poolAddress: pool.id,
        token0: pool.token0.id,
        token1: pool.token1.id,
        token0Symbol: pool.token0.symbol,
        token1Symbol: pool.token1.symbol,
        feeTier: parseInt(pool.feeTier),
        tvlUsd: parseFloat(pool.totalValueLockedUSD),
        volume24hUsd: 0, // Would need historical query
        fees24hUsd: 0,
        aprBase: estimatedApr,
        aprReward: 0,
        aprTotal: estimatedApr,
        chainId: this.chainId,
      };
    } catch (error) {
      console.error("[V6 APR Service] Error fetching pool from subgraph:", error);
      return null;
    }
  }

  /**
   * Get top pools for USDC/WETH pair
   */
  async getUsdcWethPools(): Promise<PoolAPRData[]> {
    try {
      const cacheKey = `usdc_weth_pools_${this.chainId}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const network = V6_NETWORKS.polygon;
      const pools: PoolAPRData[] = [];

      // Query each fee tier
      for (const feeTier of Object.values(V6_FEE_TIERS)) {
        const query = `
          {
            pools(
              where: {
                token0_in: ["${network.tokens.USDC.address.toLowerCase()}", "${network.tokens.WETH.address.toLowerCase()}"],
                token1_in: ["${network.tokens.USDC.address.toLowerCase()}", "${network.tokens.WETH.address.toLowerCase()}"],
                feeTier: "${feeTier}"
              }
              first: 1
            ) {
              id
              token0 { id symbol }
              token1 { id symbol }
              feeTier
              totalValueLockedUSD
              volumeUSD
              feesUSD
            }
          }
        `;

        const response = await fetch(V6_API_ENDPOINTS.theGraph.polygon, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (response.ok) {
          const data = await response.json();
          const pool = data.data?.pools?.[0];
          if (pool) {
            const estimatedApr = this.calculateEstimatedAPR(
              parseFloat(pool.feesUSD),
              parseFloat(pool.totalValueLockedUSD)
            );

            pools.push({
              poolAddress: pool.id,
              token0: pool.token0.id,
              token1: pool.token1.id,
              token0Symbol: pool.token0.symbol,
              token1Symbol: pool.token1.symbol,
              feeTier: parseInt(pool.feeTier),
              tvlUsd: parseFloat(pool.totalValueLockedUSD),
              volume24hUsd: 0,
              fees24hUsd: 0,
              aprBase: estimatedApr,
              aprReward: 0,
              aprTotal: estimatedApr,
              chainId: this.chainId,
            });
          }
        }
      }

      this.setCache(cacheKey, pools);
      return pools;
    } catch (error) {
      console.error("[V6 APR Service] Error fetching USDC/WETH pools:", error);
      return [];
    }
  }

  /**
   * Analyze a position's potential APR
   */
  async analyzePositionAPR(
    poolAddress: string,
    tickLower: number,
    tickUpper: number,
    liquidityUsd: number
  ): Promise<{
    estimatedAPR: number;
    inRangeEstimate: number;
    outOfRangeRisk: number;
  }> {
    try {
      const poolData = await this.getPoolDataFromSubgraph(poolAddress);

      if (!poolData) {
        return {
          estimatedAPR: 0,
          inRangeEstimate: 0,
          outOfRangeRisk: 0,
        };
      }

      // Simplified APR calculation
      // In reality, this would need current tick and price data
      const rangeWidth = tickUpper - tickLower;
      const concentrationFactor = 2000 / rangeWidth; // Narrower range = more concentration

      const estimatedAPR = poolData.aprBase * concentrationFactor;
      const inRangeEstimate = 0.7; // Placeholder - would need historical analysis
      const outOfRangeRisk = rangeWidth < 1000 ? 0.4 : rangeWidth < 2000 ? 0.2 : 0.1;

      return {
        estimatedAPR: Math.min(estimatedAPR, 200), // Cap at 200% APR
        inRangeEstimate,
        outOfRangeRisk,
      };
    } catch (error) {
      console.error("[V6 APR Service] Error analyzing position APR:", error);
      return { estimatedAPR: 0, inRangeEstimate: 0, outOfRangeRisk: 0 };
    }
  }

  // ============ PRIVATE METHODS ============

  private getChainName(): string {
    switch (this.chainId) {
      case 137:
        return "Polygon";
      case 1:
        return "Ethereum";
      case 42161:
        return "Arbitrum";
      default:
        return "Polygon";
    }
  }

  private extractFeeTier(symbol: string): number {
    if (symbol?.includes("0.01%")) return 100;
    if (symbol?.includes("0.05%")) return 500;
    if (symbol?.includes("0.3%")) return 3000;
    if (symbol?.includes("1%")) return 10000;
    return 3000; // Default
  }

  private calculateEstimatedAPR(totalFeesUsd: number, tvlUsd: number): number {
    if (tvlUsd === 0) return 0;

    // Rough estimate: assume total fees are accumulated over 1 year
    // This is very simplified - real APR calculation needs volume data
    const aprEstimate = (totalFeesUsd / tvlUsd) * 100;
    return Math.min(aprEstimate, 500); // Cap at 500%
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

// ============ SINGLETON INSTANCE ============

let v6AprServiceInstance: V6AprService | null = null;

export function getV6AprService(chainId: number = 137): V6AprService {
  if (!v6AprServiceInstance || v6AprServiceInstance["chainId"] !== chainId) {
    v6AprServiceInstance = new V6AprService(chainId);
  }
  return v6AprServiceInstance;
}

export default V6AprService;
