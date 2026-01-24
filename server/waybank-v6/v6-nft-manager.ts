/**
 * WayBank v6.0 NFT Manager Service
 *
 * IMPORTANTE: Este servicio gestiona el registro y seguimiento de NFTs
 * creados por el sistema WayPoolPositionCreator EXISTENTE.
 *
 * NO MODIFICA el sistema de creación de NFTs.
 * Solo lee y gestiona posiciones ya existentes.
 */

import { eq, and, desc, sql } from "drizzle-orm";
import { getV6PositionManager, PositionData, PositionStatus } from "./v6-position-manager";
import { V6_DEFAULT_CONFIG } from "./v6-config";
import {
  v6ManagedPositions,
  v6FeeCollections,
  v6RebalanceHistory,
  v6PendingOperations,
  v6VaultStats,
  type V6ManagedPosition,
  type V6ManagedPositionInsert,
  type V6FeeCollectionInsert,
  type V6RebalanceHistoryInsert,
  type V6PendingOperationInsert,
} from "../../shared/waybank-v6-schema";

// ============ TYPES ============

export interface RegisterPositionResult {
  success: boolean;
  positionId?: number;
  error?: string;
}

export interface ManagedPositionWithStatus extends V6ManagedPosition {
  status?: PositionStatus;
}

// ============ V6 NFT MANAGER SERVICE ============

export class V6NftManagerService {
  private db: any; // Database instance - will be injected
  private positionManager: ReturnType<typeof getV6PositionManager>;

  constructor(db: any, chainId: number = 137) {
    this.db = db;
    this.positionManager = getV6PositionManager(chainId);
  }

  // ============ REGISTRATION METHODS ============

  /**
   * Register an existing NFT position for v6 management
   * This reads the NFT from the blockchain and stores it in our v6 tables
   */
  async registerPosition(
    tokenId: string,
    ownerAddress: string,
    options: {
      enableAutoRebalance?: boolean;
      rebalanceThresholdBps?: number;
      targetRangeWidthTicks?: number;
    } = {}
  ): Promise<RegisterPositionResult> {
    try {
      // Verify the position exists and get its data
      const positionData = await this.positionManager.getPositionData(tokenId);

      // Verify ownership
      const isOwner = await this.positionManager.verifyOwnership(tokenId, ownerAddress);
      if (!isOwner) {
        return {
          success: false,
          error: `Address ${ownerAddress} does not own NFT ${tokenId}`,
        };
      }

      // Check if already registered
      const existing = await this.db
        .select()
        .from(v6ManagedPositions)
        .where(eq(v6ManagedPositions.tokenId, tokenId))
        .limit(1);

      if (existing.length > 0) {
        return {
          success: false,
          error: `Position ${tokenId} is already registered`,
        };
      }

      // Get pool address
      const poolAddress = await this.positionManager.getPoolAddress(
        positionData.token0,
        positionData.token1,
        positionData.fee
      );

      // Insert into v6_managed_positions
      const insertData: V6ManagedPositionInsert = {
        tokenId,
        ownerAddress: ownerAddress.toLowerCase(),
        poolAddress,
        token0Address: positionData.token0,
        token1Address: positionData.token1,
        feeTier: positionData.fee,
        tickLower: positionData.tickLower,
        tickUpper: positionData.tickUpper,
        currentLiquidity: positionData.liquidity,
        isActive: true,
        isAutoRebalance: options.enableAutoRebalance ?? false,
        rebalanceThresholdBps: options.rebalanceThresholdBps ?? V6_DEFAULT_CONFIG.rebalanceThresholdBps,
        targetRangeWidthTicks: options.targetRangeWidthTicks ?? V6_DEFAULT_CONFIG.defaultRangeWidthTicks,
        chainId: 137, // Polygon
      };

      const result = await this.db
        .insert(v6ManagedPositions)
        .values(insertData)
        .returning({ id: v6ManagedPositions.id });

      console.log(`[V6 NFT Manager] Registered position ${tokenId} with ID ${result[0].id}`);

      return {
        success: true,
        positionId: result[0].id,
      };
    } catch (error: any) {
      console.error(`[V6 NFT Manager] Error registering position ${tokenId}:`, error);
      return {
        success: false,
        error: error.message || "Failed to register position",
      };
    }
  }

  /**
   * Unregister a position from v6 management
   */
  async unregisterPosition(tokenId: string, ownerAddress: string): Promise<boolean> {
    try {
      // Verify ownership
      const position = await this.db
        .select()
        .from(v6ManagedPositions)
        .where(
          and(
            eq(v6ManagedPositions.tokenId, tokenId),
            eq(v6ManagedPositions.ownerAddress, ownerAddress.toLowerCase())
          )
        )
        .limit(1);

      if (position.length === 0) {
        console.error(`[V6 NFT Manager] Position ${tokenId} not found for owner ${ownerAddress}`);
        return false;
      }

      // Mark as inactive (soft delete)
      await this.db
        .update(v6ManagedPositions)
        .set({
          isActive: false,
          lastUpdatedAt: new Date(),
        })
        .where(eq(v6ManagedPositions.tokenId, tokenId));

      console.log(`[V6 NFT Manager] Unregistered position ${tokenId}`);
      return true;
    } catch (error) {
      console.error(`[V6 NFT Manager] Error unregistering position:`, error);
      return false;
    }
  }

  // ============ QUERY METHODS ============

  /**
   * Get all managed positions for an owner
   */
  async getPositionsByOwner(ownerAddress: string): Promise<V6ManagedPosition[]> {
    try {
      return await this.db
        .select()
        .from(v6ManagedPositions)
        .where(
          and(
            eq(v6ManagedPositions.ownerAddress, ownerAddress.toLowerCase()),
            eq(v6ManagedPositions.isActive, true)
          )
        )
        .orderBy(desc(v6ManagedPositions.registeredAt));
    } catch (error) {
      console.error(`[V6 NFT Manager] Error getting positions by owner:`, error);
      return [];
    }
  }

  /**
   * Get a single managed position with live status
   */
  async getPositionWithStatus(tokenId: string): Promise<ManagedPositionWithStatus | null> {
    try {
      const positions = await this.db
        .select()
        .from(v6ManagedPositions)
        .where(eq(v6ManagedPositions.tokenId, tokenId))
        .limit(1);

      if (positions.length === 0) {
        return null;
      }

      const position = positions[0];

      // Get live status from blockchain
      const status = await this.positionManager.getPositionStatus(tokenId);

      return {
        ...position,
        status,
      };
    } catch (error) {
      console.error(`[V6 NFT Manager] Error getting position with status:`, error);
      return null;
    }
  }

  /**
   * Get all active positions (for cron jobs)
   */
  async getAllActivePositions(): Promise<V6ManagedPosition[]> {
    try {
      return await this.db
        .select()
        .from(v6ManagedPositions)
        .where(eq(v6ManagedPositions.isActive, true));
    } catch (error) {
      console.error(`[V6 NFT Manager] Error getting active positions:`, error);
      return [];
    }
  }

  /**
   * Get positions that have auto-rebalance enabled
   */
  async getAutoRebalancePositions(): Promise<V6ManagedPosition[]> {
    try {
      return await this.db
        .select()
        .from(v6ManagedPositions)
        .where(
          and(
            eq(v6ManagedPositions.isActive, true),
            eq(v6ManagedPositions.isAutoRebalance, true)
          )
        );
    } catch (error) {
      console.error(`[V6 NFT Manager] Error getting auto-rebalance positions:`, error);
      return [];
    }
  }

  // ============ UPDATE METHODS ============

  /**
   * Update position settings
   */
  async updatePositionSettings(
    tokenId: string,
    ownerAddress: string,
    settings: {
      isAutoRebalance?: boolean;
      rebalanceThresholdBps?: number;
      targetRangeWidthTicks?: number;
    }
  ): Promise<boolean> {
    try {
      const result = await this.db
        .update(v6ManagedPositions)
        .set({
          ...settings,
          lastUpdatedAt: new Date(),
        })
        .where(
          and(
            eq(v6ManagedPositions.tokenId, tokenId),
            eq(v6ManagedPositions.ownerAddress, ownerAddress.toLowerCase())
          )
        );

      return result.rowCount > 0;
    } catch (error) {
      console.error(`[V6 NFT Manager] Error updating position settings:`, error);
      return false;
    }
  }

  /**
   * Update position liquidity from blockchain
   */
  async syncPositionFromBlockchain(tokenId: string): Promise<boolean> {
    try {
      const positionData = await this.positionManager.getPositionData(tokenId);

      await this.db
        .update(v6ManagedPositions)
        .set({
          currentLiquidity: positionData.liquidity,
          tickLower: positionData.tickLower,
          tickUpper: positionData.tickUpper,
          lastUpdatedAt: new Date(),
        })
        .where(eq(v6ManagedPositions.tokenId, tokenId));

      return true;
    } catch (error) {
      console.error(`[V6 NFT Manager] Error syncing position:`, error);
      return false;
    }
  }

  // ============ FEE COLLECTION HISTORY ============

  /**
   * Record a fee collection event
   */
  async recordFeeCollection(data: V6FeeCollectionInsert): Promise<number | null> {
    try {
      const result = await this.db
        .insert(v6FeeCollections)
        .values(data)
        .returning({ id: v6FeeCollections.id });

      return result[0].id;
    } catch (error) {
      console.error(`[V6 NFT Manager] Error recording fee collection:`, error);
      return null;
    }
  }

  /**
   * Get fee collection history for a position
   */
  async getFeeHistory(tokenId: string, limit: number = 50): Promise<any[]> {
    try {
      return await this.db
        .select()
        .from(v6FeeCollections)
        .where(eq(v6FeeCollections.tokenId, tokenId))
        .orderBy(desc(v6FeeCollections.collectedAt))
        .limit(limit);
    } catch (error) {
      console.error(`[V6 NFT Manager] Error getting fee history:`, error);
      return [];
    }
  }

  // ============ REBALANCE HISTORY ============

  /**
   * Record a rebalance event
   */
  async recordRebalance(data: V6RebalanceHistoryInsert): Promise<number | null> {
    try {
      const result = await this.db
        .insert(v6RebalanceHistory)
        .values(data)
        .returning({ id: v6RebalanceHistory.id });

      // Update position's last rebalance time
      await this.db
        .update(v6ManagedPositions)
        .set({
          lastRebalancedAt: new Date(),
          lastUpdatedAt: new Date(),
        })
        .where(eq(v6ManagedPositions.tokenId, data.tokenId));

      return result[0].id;
    } catch (error) {
      console.error(`[V6 NFT Manager] Error recording rebalance:`, error);
      return null;
    }
  }

  /**
   * Get rebalance history for a position
   */
  async getRebalanceHistory(tokenId: string, limit: number = 20): Promise<any[]> {
    try {
      return await this.db
        .select()
        .from(v6RebalanceHistory)
        .where(eq(v6RebalanceHistory.tokenId, tokenId))
        .orderBy(desc(v6RebalanceHistory.executedAt))
        .limit(limit);
    } catch (error) {
      console.error(`[V6 NFT Manager] Error getting rebalance history:`, error);
      return [];
    }
  }

  // ============ PENDING OPERATIONS ============

  /**
   * Queue a pending operation
   */
  async queueOperation(data: V6PendingOperationInsert): Promise<number | null> {
    try {
      const result = await this.db
        .insert(v6PendingOperations)
        .values(data)
        .returning({ id: v6PendingOperations.id });

      return result[0].id;
    } catch (error) {
      console.error(`[V6 NFT Manager] Error queuing operation:`, error);
      return null;
    }
  }

  /**
   * Get pending operations
   */
  async getPendingOperations(limit: number = 100): Promise<any[]> {
    try {
      return await this.db
        .select()
        .from(v6PendingOperations)
        .where(eq(v6PendingOperations.status, "pending"))
        .orderBy(v6PendingOperations.priority, v6PendingOperations.createdAt)
        .limit(limit);
    } catch (error) {
      console.error(`[V6 NFT Manager] Error getting pending operations:`, error);
      return [];
    }
  }

  /**
   * Update operation status
   */
  async updateOperationStatus(
    operationId: number,
    status: "processing" | "completed" | "failed",
    result?: { txHash?: string; error?: string }
  ): Promise<boolean> {
    try {
      await this.db
        .update(v6PendingOperations)
        .set({
          status,
          resultTxHash: result?.txHash,
          errorMessage: result?.error,
          processedAt: status === "processing" ? new Date() : undefined,
          completedAt: status === "completed" || status === "failed" ? new Date() : undefined,
          attempts: sql`${v6PendingOperations.attempts} + 1`,
        })
        .where(eq(v6PendingOperations.id, operationId));

      return true;
    } catch (error) {
      console.error(`[V6 NFT Manager] Error updating operation status:`, error);
      return false;
    }
  }

  // ============ STATISTICS ============

  /**
   * Get vault statistics
   */
  async getVaultStats(): Promise<{
    totalPositions: number;
    activePositions: number;
    totalFeeCollections: number;
    totalRebalances: number;
  }> {
    try {
      const [positionsCount, activeCount, feeCount, rebalanceCount] = await Promise.all([
        this.db.select({ count: sql`count(*)` }).from(v6ManagedPositions),
        this.db
          .select({ count: sql`count(*)` })
          .from(v6ManagedPositions)
          .where(eq(v6ManagedPositions.isActive, true)),
        this.db.select({ count: sql`count(*)` }).from(v6FeeCollections),
        this.db.select({ count: sql`count(*)` }).from(v6RebalanceHistory),
      ]);

      return {
        totalPositions: Number(positionsCount[0]?.count || 0),
        activePositions: Number(activeCount[0]?.count || 0),
        totalFeeCollections: Number(feeCount[0]?.count || 0),
        totalRebalances: Number(rebalanceCount[0]?.count || 0),
      };
    } catch (error) {
      console.error(`[V6 NFT Manager] Error getting vault stats:`, error);
      return {
        totalPositions: 0,
        activePositions: 0,
        totalFeeCollections: 0,
        totalRebalances: 0,
      };
    }
  }
}

// ============ FACTORY FUNCTION ============

export function createV6NftManager(db: any, chainId: number = 137): V6NftManagerService {
  return new V6NftManagerService(db, chainId);
}

export default V6NftManagerService;
