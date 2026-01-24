/**
 * WayBank v6.0 - Sistema Paralelo de Gestión de Liquidez
 *
 * IMPORTANTE: Este módulo es completamente independiente del sistema existente.
 * No modifica ni interfiere con ningún archivo o funcionalidad existente.
 *
 * Diseñado para gestionar NFTs creados por WayPoolPositionCreator.
 *
 * Uso:
 * ```typescript
 * import { createV6Routes, createV6NftManager, getV6PositionManager } from './server/waybank-v6';
 *
 * // En tu archivo de servidor principal (sin modificar el existente):
 * // app.use('/api/v6', createV6Routes(db));
 * ```
 */

// ============ CONFIGURATION ============
export {
  V6_NETWORKS,
  V6_FEE_TIERS,
  V6_TICK_SPACING,
  V6_DEFAULT_CONFIG,
  V6_API_ENDPOINTS,
  V6_ABIS,
  getNetworkConfig,
  getTickSpacing,
  roundTickDown,
  roundTickUp,
  calculateTickRange,
  isPositionInRange,
  calculateOutOfRangeBps,
} from "./v6-config";

// ============ SERVICES ============
export {
  V6PositionManagerService,
  getV6PositionManager,
  type PositionData,
  type PositionStatus,
} from "./v6-position-manager";

export {
  V6AprService,
  getV6AprService,
  type PoolAPRData,
  type TopPoolsResult,
} from "./v6-apr-service";

export {
  V6NftManagerService,
  createV6NftManager,
  type RegisterPositionResult,
  type ManagedPositionWithStatus,
} from "./v6-nft-manager";

// ============ ROUTES ============
export { createV6Routes } from "./v6-routes";

// ============ SCHEMA ============
// Re-export from shared for convenience
export {
  v6ManagedPositions,
  v6FeeCollections,
  v6RebalanceHistory,
  v6PoolAnalytics,
  v6VaultConfig,
  v6PendingOperations,
  v6VaultStats,
  type V6ManagedPosition,
  type V6ManagedPositionInsert,
  type V6FeeCollection,
  type V6FeeCollectionInsert,
  type V6RebalanceHistory,
  type V6RebalanceHistoryInsert,
  type V6PoolAnalytics,
  type V6PoolAnalyticsInsert,
  type V6VaultConfig,
  type V6VaultConfigInsert,
  type V6PendingOperation,
  type V6PendingOperationInsert,
  type V6VaultStats,
  type V6VaultStatsInsert,
} from "../../shared/waybank-v6-schema";

// ============ VERSION INFO ============
export const V6_VERSION = {
  version: "6.0.0",
  name: "WayBank v6.0",
  description: "Parallel Liquidity Management System",
  compatibility: {
    wayPoolPositionCreator: true,
    existingNfts: true,
    polygon: true,
  },
};

/**
 * Initialize WayBank v6.0 System
 *
 * This function provides a simple way to initialize all v6 services.
 * It does NOT modify any existing services or routes.
 *
 * @example
 * ```typescript
 * const v6System = initializeV6System(db);
 * app.use('/api/v6', v6System.router);
 * ```
 */
export function initializeV6System(db: any, chainId: number = 137) {
  const positionManager = getV6PositionManager(chainId);
  const aprService = getV6AprService(chainId);
  const nftManager = createV6NftManager(db, chainId);
  const router = createV6Routes(db);

  console.log(`[WayBank v6] System initialized for chainId ${chainId}`);
  console.log(`[WayBank v6] Routes available at /api/v6/*`);

  return {
    positionManager,
    aprService,
    nftManager,
    router,
    version: V6_VERSION,
  };
}
