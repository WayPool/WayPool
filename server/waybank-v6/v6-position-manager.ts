/**
 * WayBank v6.0 Position Manager Service
 *
 * IMPORTANTE: Este servicio gestiona NFTs creados por el sistema WayPoolPositionCreator EXISTENTE.
 * No modifica ni interactúa con el sistema de creación de NFTs actual.
 *
 * Funcionalidades:
 * - Registrar posiciones NFT existentes para gestión automatizada
 * - Consultar estado de posiciones
 * - Verificar si posiciones están en rango
 * - Obtener fees pendientes
 */

import { ethers } from "ethers";
import {
  V6_NETWORKS,
  V6_ABIS,
  V6_DEFAULT_CONFIG,
  isPositionInRange,
  calculateOutOfRangeBps,
} from "./v6-config";

// ============ TYPES ============

export interface PositionData {
  tokenId: string;
  owner: string;
  token0: string;
  token1: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  tokensOwed0: string;
  tokensOwed1: string;
}

export interface PositionStatus {
  tokenId: string;
  isInRange: boolean;
  outOfRangeBps: number;
  currentTick: number;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  pendingFees: {
    token0: string;
    token1: string;
  };
}

export interface RegisterPositionParams {
  tokenId: string;
  ownerAddress: string;
  enableAutoRebalance?: boolean;
  rebalanceThresholdBps?: number;
  targetRangeWidthTicks?: number;
}

// ============ V6 POSITION MANAGER SERVICE ============

export class V6PositionManagerService {
  private provider: ethers.JsonRpcProvider;
  private positionManager: ethers.Contract;
  private factory: ethers.Contract;
  private chainId: number;

  constructor(chainId: number = 137) {
    this.chainId = chainId;
    const network = V6_NETWORKS.polygon; // Default to Polygon

    this.provider = new ethers.JsonRpcProvider(network.rpcUrl);

    this.positionManager = new ethers.Contract(
      network.contracts.positionManager,
      V6_ABIS.positionManager,
      this.provider
    );

    this.factory = new ethers.Contract(
      network.contracts.factory,
      V6_ABIS.factory,
      this.provider
    );
  }

  // ============ READ METHODS ============

  /**
   * Get position data from the NFT
   * This reads from the existing NFT created by WayPoolPositionCreator
   */
  async getPositionData(tokenId: string): Promise<PositionData> {
    try {
      const [owner, position] = await Promise.all([
        this.positionManager.ownerOf(tokenId),
        this.positionManager.positions(tokenId),
      ]);

      return {
        tokenId,
        owner,
        token0: position.token0,
        token1: position.token1,
        fee: Number(position.fee),
        tickLower: Number(position.tickLower),
        tickUpper: Number(position.tickUpper),
        liquidity: position.liquidity.toString(),
        feeGrowthInside0LastX128: position.feeGrowthInside0LastX128.toString(),
        feeGrowthInside1LastX128: position.feeGrowthInside1LastX128.toString(),
        tokensOwed0: position.tokensOwed0.toString(),
        tokensOwed1: position.tokensOwed1.toString(),
      };
    } catch (error) {
      console.error(`[V6 Position Manager] Error getting position ${tokenId}:`, error);
      throw new Error(`Failed to get position data for tokenId ${tokenId}`);
    }
  }

  /**
   * Get the pool address for a token pair
   */
  async getPoolAddress(token0: string, token1: string, fee: number): Promise<string> {
    try {
      const poolAddress = await this.factory.getPool(token0, token1, fee);
      if (poolAddress === ethers.ZeroAddress) {
        throw new Error("Pool does not exist");
      }
      return poolAddress;
    } catch (error) {
      console.error(`[V6 Position Manager] Error getting pool address:`, error);
      throw error;
    }
  }

  /**
   * Get current tick from pool
   */
  async getCurrentPoolTick(poolAddress: string): Promise<number> {
    try {
      const pool = new ethers.Contract(poolAddress, V6_ABIS.pool, this.provider);
      const slot0 = await pool.slot0();
      return Number(slot0.tick);
    } catch (error) {
      console.error(`[V6 Position Manager] Error getting pool tick:`, error);
      throw error;
    }
  }

  /**
   * Get full position status including range check
   */
  async getPositionStatus(tokenId: string): Promise<PositionStatus> {
    try {
      const position = await this.getPositionData(tokenId);

      // Get pool address and current tick
      const poolAddress = await this.getPoolAddress(
        position.token0,
        position.token1,
        position.fee
      );
      const currentTick = await this.getCurrentPoolTick(poolAddress);

      // Calculate range status
      const inRange = isPositionInRange(
        currentTick,
        position.tickLower,
        position.tickUpper
      );
      const outOfRangeBps = calculateOutOfRangeBps(
        currentTick,
        position.tickLower,
        position.tickUpper
      );

      return {
        tokenId,
        isInRange: inRange,
        outOfRangeBps,
        currentTick,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        liquidity: position.liquidity,
        pendingFees: {
          token0: position.tokensOwed0,
          token1: position.tokensOwed1,
        },
      };
    } catch (error) {
      console.error(`[V6 Position Manager] Error getting position status:`, error);
      throw error;
    }
  }

  /**
   * Check if a position needs rebalancing
   */
  async needsRebalance(
    tokenId: string,
    thresholdBps: number = V6_DEFAULT_CONFIG.rebalanceThresholdBps
  ): Promise<{ needsRebalance: boolean; reason: string | null }> {
    try {
      const status = await this.getPositionStatus(tokenId);

      if (status.liquidity === "0") {
        return { needsRebalance: false, reason: "No liquidity in position" };
      }

      if (!status.isInRange) {
        if (status.outOfRangeBps >= thresholdBps) {
          return {
            needsRebalance: true,
            reason: `Position is ${status.outOfRangeBps / 100}% out of range`,
          };
        }
      }

      return { needsRebalance: false, reason: null };
    } catch (error) {
      console.error(`[V6 Position Manager] Error checking rebalance need:`, error);
      throw error;
    }
  }

  /**
   * Get pending fees for a position
   */
  async getPendingFees(tokenId: string): Promise<{
    token0: string;
    token1: string;
    token0Address: string;
    token1Address: string;
  }> {
    try {
      const position = await this.getPositionData(tokenId);
      return {
        token0: position.tokensOwed0,
        token1: position.tokensOwed1,
        token0Address: position.token0,
        token1Address: position.token1,
      };
    } catch (error) {
      console.error(`[V6 Position Manager] Error getting pending fees:`, error);
      throw error;
    }
  }

  /**
   * Verify ownership of an NFT position
   */
  async verifyOwnership(tokenId: string, expectedOwner: string): Promise<boolean> {
    try {
      const actualOwner = await this.positionManager.ownerOf(tokenId);
      return actualOwner.toLowerCase() === expectedOwner.toLowerCase();
    } catch (error) {
      console.error(`[V6 Position Manager] Error verifying ownership:`, error);
      return false;
    }
  }

  /**
   * Get multiple positions status (batch operation)
   */
  async getMultiplePositionsStatus(tokenIds: string[]): Promise<PositionStatus[]> {
    const results: PositionStatus[] = [];

    for (const tokenId of tokenIds) {
      try {
        const status = await this.getPositionStatus(tokenId);
        results.push(status);
      } catch (error) {
        console.error(`[V6 Position Manager] Error getting status for ${tokenId}:`, error);
        // Continue with next position
      }
    }

    return results;
  }

  /**
   * Get positions that need rebalancing from a list
   */
  async getPositionsNeedingRebalance(
    tokenIds: string[],
    thresholdBps: number = V6_DEFAULT_CONFIG.rebalanceThresholdBps
  ): Promise<{ tokenId: string; reason: string }[]> {
    const needRebalance: { tokenId: string; reason: string }[] = [];

    for (const tokenId of tokenIds) {
      try {
        const result = await this.needsRebalance(tokenId, thresholdBps);
        if (result.needsRebalance && result.reason) {
          needRebalance.push({ tokenId, reason: result.reason });
        }
      } catch (error) {
        console.error(`[V6 Position Manager] Error checking ${tokenId}:`, error);
      }
    }

    return needRebalance;
  }

  /**
   * Get total pending fees across multiple positions
   */
  async getTotalPendingFees(tokenIds: string[]): Promise<{
    byToken: Map<string, bigint>;
    positions: { tokenId: string; token0: string; token1: string }[];
  }> {
    const byToken = new Map<string, bigint>();
    const positions: { tokenId: string; token0: string; token1: string }[] = [];

    for (const tokenId of tokenIds) {
      try {
        const fees = await this.getPendingFees(tokenId);

        // Accumulate by token address
        const current0 = byToken.get(fees.token0Address) || BigInt(0);
        byToken.set(fees.token0Address, current0 + BigInt(fees.token0));

        const current1 = byToken.get(fees.token1Address) || BigInt(0);
        byToken.set(fees.token1Address, current1 + BigInt(fees.token1));

        positions.push({
          tokenId,
          token0: fees.token0,
          token1: fees.token1,
        });
      } catch (error) {
        console.error(`[V6 Position Manager] Error getting fees for ${tokenId}:`, error);
      }
    }

    return { byToken, positions };
  }

  // ============ UTILITY METHODS ============

  /**
   * Format token amount with decimals
   */
  formatTokenAmount(amount: string, decimals: number): string {
    return ethers.formatUnits(amount, decimals);
  }

  /**
   * Get token info (symbol and decimals)
   */
  async getTokenInfo(tokenAddress: string): Promise<{ symbol: string; decimals: number }> {
    try {
      const token = new ethers.Contract(tokenAddress, V6_ABIS.erc20, this.provider);
      const [symbol, decimals] = await Promise.all([
        token.symbol(),
        token.decimals(),
      ]);
      return { symbol, decimals: Number(decimals) };
    } catch (error) {
      console.error(`[V6 Position Manager] Error getting token info:`, error);
      throw error;
    }
  }

  /**
   * Get pool liquidity
   */
  async getPoolLiquidity(poolAddress: string): Promise<string> {
    try {
      const pool = new ethers.Contract(poolAddress, V6_ABIS.pool, this.provider);
      const liquidity = await pool.liquidity();
      return liquidity.toString();
    } catch (error) {
      console.error(`[V6 Position Manager] Error getting pool liquidity:`, error);
      throw error;
    }
  }
}

// ============ SINGLETON INSTANCE ============

let v6PositionManagerInstance: V6PositionManagerService | null = null;

export function getV6PositionManager(chainId: number = 137): V6PositionManagerService {
  if (!v6PositionManagerInstance || v6PositionManagerInstance["chainId"] !== chainId) {
    v6PositionManagerInstance = new V6PositionManagerService(chainId);
  }
  return v6PositionManagerInstance;
}

export default V6PositionManagerService;
