/**
 * WayBank v6.0 Schema - Sistema Paralelo
 *
 * IMPORTANTE: Este schema es completamente independiente del schema.ts existente.
 * No modifica ni interactúa con las tablas existentes.
 *
 * Diseñado para gestionar NFTs creados por el sistema WayPoolPositionCreator existente.
 */

import { pgTable, serial, text, timestamp, integer, boolean, decimal, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============ TABLA PRINCIPAL: Posiciones Gestionadas por v6 ============

/**
 * Posiciones NFT registradas en WayBank v6.0 para gestión automatizada.
 * Esta tabla almacena referencias a NFTs creados por el sistema existente.
 */
export const v6ManagedPositions = pgTable("v6_managed_positions", {
  id: serial("id").primaryKey(),

  // Identificación del NFT (creado por WayPoolPositionCreator existente)
  tokenId: text("token_id").notNull().unique(),

  // Propietario original del NFT
  ownerAddress: text("owner_address").notNull(),

  // Información del pool
  poolAddress: text("pool_address").notNull(),
  token0Address: text("token0_address").notNull(),
  token1Address: text("token1_address").notNull(),
  feeTier: integer("fee_tier").notNull(), // 500, 3000, 10000

  // Rango de la posición
  tickLower: integer("tick_lower").notNull(),
  tickUpper: integer("tick_upper").notNull(),

  // Liquidez actual
  currentLiquidity: text("current_liquidity").notNull().default("0"),

  // Estado de gestión
  isActive: boolean("is_active").notNull().default(true),
  isAutoRebalance: boolean("is_auto_rebalance").notNull().default(false),

  // Configuración de rebalanceo
  rebalanceThresholdBps: integer("rebalance_threshold_bps").default(500), // 5% por defecto
  targetRangeWidthTicks: integer("target_range_width_ticks").default(2000),

  // Red
  chainId: integer("chain_id").notNull().default(137), // Polygon

  // Timestamps
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  lastUpdatedAt: timestamp("last_updated_at").notNull().defaultNow(),
  lastRebalancedAt: timestamp("last_rebalanced_at"),

  // Metadatos adicionales
  metadata: jsonb("metadata"),
}, (table) => ({
  ownerAddressIdx: index("v6_managed_positions_owner_idx").on(table.ownerAddress),
  poolAddressIdx: index("v6_managed_positions_pool_idx").on(table.poolAddress),
  isActiveIdx: index("v6_managed_positions_active_idx").on(table.isActive),
}));

// ============ TABLA: Historial de Colección de Fees ============

/**
 * Historial de fees recolectados de posiciones gestionadas.
 */
export const v6FeeCollections = pgTable("v6_fee_collections", {
  id: serial("id").primaryKey(),

  // Referencia a la posición
  positionId: integer("position_id").notNull(),
  tokenId: text("token_id").notNull(),

  // Fees recolectados
  amount0Collected: text("amount0_collected").notNull(),
  amount1Collected: text("amount1_collected").notNull(),

  // Fees del vault (comisión)
  vaultFee0: text("vault_fee0").notNull().default("0"),
  vaultFee1: text("vault_fee1").notNull().default("0"),

  // Monto neto para el usuario
  netAmount0: text("net_amount0").notNull(),
  netAmount1: text("net_amount1").notNull(),

  // Hash de transacción
  txHash: text("tx_hash").notNull(),

  // Timestamp
  collectedAt: timestamp("collected_at").notNull().defaultNow(),

  // Precios al momento de colección (para cálculos históricos)
  token0PriceUsd: decimal("token0_price_usd", { precision: 18, scale: 8 }),
  token1PriceUsd: decimal("token1_price_usd", { precision: 18, scale: 8 }),

  // Valor total en USD
  totalValueUsd: decimal("total_value_usd", { precision: 18, scale: 2 }),
}, (table) => ({
  positionIdIdx: index("v6_fee_collections_position_idx").on(table.positionId),
  tokenIdIdx: index("v6_fee_collections_token_idx").on(table.tokenId),
  collectedAtIdx: index("v6_fee_collections_date_idx").on(table.collectedAt),
}));

// ============ TABLA: Historial de Rebalanceos ============

/**
 * Historial de rebalanceos ejecutados en posiciones.
 */
export const v6RebalanceHistory = pgTable("v6_rebalance_history", {
  id: serial("id").primaryKey(),

  // Referencia a la posición
  positionId: integer("position_id").notNull(),
  tokenId: text("token_id").notNull(),

  // Estado anterior
  previousTickLower: integer("previous_tick_lower").notNull(),
  previousTickUpper: integer("previous_tick_upper").notNull(),
  previousLiquidity: text("previous_liquidity").notNull(),

  // Nuevo estado
  newTickLower: integer("new_tick_lower").notNull(),
  newTickUpper: integer("new_tick_upper").notNull(),
  newLiquidity: text("new_liquidity").notNull(),

  // Tick actual del pool al momento del rebalanceo
  currentPoolTick: integer("current_pool_tick").notNull(),

  // Razón del rebalanceo
  reason: varchar("reason", { length: 50 }).notNull(), // 'out_of_range', 'scheduled', 'manual', 'apr_optimization'

  // Transacciones
  decreaseLiquidityTxHash: text("decrease_liquidity_tx_hash"),
  mintNewPositionTxHash: text("mint_new_position_tx_hash"),

  // Costos de gas
  totalGasUsed: text("total_gas_used"),
  gasPriceGwei: decimal("gas_price_gwei", { precision: 10, scale: 2 }),

  // Resultado
  success: boolean("success").notNull().default(false),
  errorMessage: text("error_message"),

  // Timestamp
  executedAt: timestamp("executed_at").notNull().defaultNow(),
}, (table) => ({
  positionIdIdx: index("v6_rebalance_history_position_idx").on(table.positionId),
  executedAtIdx: index("v6_rebalance_history_date_idx").on(table.executedAt),
  reasonIdx: index("v6_rebalance_history_reason_idx").on(table.reason),
}));

// ============ TABLA: Análisis de Pools ============

/**
 * Datos de análisis de pools para toma de decisiones de APR.
 */
export const v6PoolAnalytics = pgTable("v6_pool_analytics", {
  id: serial("id").primaryKey(),

  // Identificación del pool
  poolAddress: text("pool_address").notNull(),
  token0Address: text("token0_address").notNull(),
  token1Address: text("token1_address").notNull(),
  feeTier: integer("fee_tier").notNull(),

  // Datos del pool
  currentTick: integer("current_tick").notNull(),
  currentLiquidity: text("current_liquidity").notNull(),
  sqrtPriceX96: text("sqrt_price_x96").notNull(),

  // APR estimado (en basis points)
  estimatedAprBps: integer("estimated_apr_bps").notNull(),

  // Volumen 24h
  volume24hUsd: decimal("volume_24h_usd", { precision: 18, scale: 2 }),

  // TVL
  tvlUsd: decimal("tvl_usd", { precision: 18, scale: 2 }),

  // Fees 24h
  fees24hUsd: decimal("fees_24h_usd", { precision: 18, scale: 2 }),

  // Red
  chainId: integer("chain_id").notNull().default(137),

  // Timestamp del análisis
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
}, (table) => ({
  poolAddressIdx: index("v6_pool_analytics_pool_idx").on(table.poolAddress),
  analyzedAtIdx: index("v6_pool_analytics_date_idx").on(table.analyzedAt),
  aprIdx: index("v6_pool_analytics_apr_idx").on(table.estimatedAprBps),
}));

// ============ TABLA: Configuración del Vault ============

/**
 * Configuración global del WayBank v6.0 Vault.
 */
export const v6VaultConfig = pgTable("v6_vault_config", {
  id: serial("id").primaryKey(),

  // Direcciones de contratos desplegados
  vaultAddress: text("vault_address"),
  poolAnalyzerAddress: text("pool_analyzer_address"),
  swapExecutorAddress: text("swap_executor_address"),

  // Configuración de fees
  vaultFeeBps: integer("vault_fee_bps").notNull().default(100), // 1%
  treasuryAddress: text("treasury_address"),

  // Configuración de rebalanceo
  autoRebalanceEnabled: boolean("auto_rebalance_enabled").notNull().default(false),
  rebalanceIntervalHours: integer("rebalance_interval_hours").notNull().default(24),

  // Operadores autorizados
  authorizedOperators: jsonb("authorized_operators").$type<string[]>().default([]),

  // Red
  chainId: integer("chain_id").notNull().default(137),

  // Estado
  isActive: boolean("is_active").notNull().default(true),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============ TABLA: Operaciones Pendientes ============

/**
 * Cola de operaciones pendientes para ejecución por el backend.
 */
export const v6PendingOperations = pgTable("v6_pending_operations", {
  id: serial("id").primaryKey(),

  // Tipo de operación
  operationType: varchar("operation_type", { length: 30 }).notNull(), // 'collect_fees', 'rebalance', 'register_position'

  // Referencia a la posición (si aplica)
  positionId: integer("position_id"),
  tokenId: text("token_id"),

  // Datos de la operación
  operationData: jsonb("operation_data").notNull(),

  // Estado
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'processing', 'completed', 'failed'

  // Prioridad (1 = más alta)
  priority: integer("priority").notNull().default(5),

  // Intentos
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(3),

  // Resultado
  resultTxHash: text("result_tx_hash"),
  errorMessage: text("error_message"),

  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  statusIdx: index("v6_pending_operations_status_idx").on(table.status),
  priorityIdx: index("v6_pending_operations_priority_idx").on(table.priority),
  typeIdx: index("v6_pending_operations_type_idx").on(table.operationType),
}));

// ============ TABLA: Estadísticas del Vault ============

/**
 * Estadísticas agregadas del vault para dashboard.
 */
export const v6VaultStats = pgTable("v6_vault_stats", {
  id: serial("id").primaryKey(),

  // Fecha del snapshot
  snapshotDate: timestamp("snapshot_date").notNull(),

  // Conteos
  totalManagedPositions: integer("total_managed_positions").notNull().default(0),
  activePositions: integer("active_positions").notNull().default(0),

  // Valores totales
  totalValueLockedUsd: decimal("total_value_locked_usd", { precision: 18, scale: 2 }),
  totalFeesCollectedUsd: decimal("total_fees_collected_usd", { precision: 18, scale: 2 }),
  totalVaultFeesUsd: decimal("total_vault_fees_usd", { precision: 18, scale: 2 }),

  // Operaciones
  totalRebalances: integer("total_rebalances").notNull().default(0),
  totalFeeCollections: integer("total_fee_collections").notNull().default(0),

  // Red
  chainId: integer("chain_id").notNull().default(137),

  // Timestamp
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  snapshotDateIdx: index("v6_vault_stats_date_idx").on(table.snapshotDate),
}));

// ============ RELACIONES ============

export const v6ManagedPositionsRelations = relations(v6ManagedPositions, ({ many }) => ({
  feeCollections: many(v6FeeCollections),
  rebalanceHistory: many(v6RebalanceHistory),
}));

export const v6FeeCollectionsRelations = relations(v6FeeCollections, ({ one }) => ({
  position: one(v6ManagedPositions, {
    fields: [v6FeeCollections.positionId],
    references: [v6ManagedPositions.id],
  }),
}));

export const v6RebalanceHistoryRelations = relations(v6RebalanceHistory, ({ one }) => ({
  position: one(v6ManagedPositions, {
    fields: [v6RebalanceHistory.positionId],
    references: [v6ManagedPositions.id],
  }),
}));

// ============ TIPOS TYPESCRIPT ============

export type V6ManagedPosition = typeof v6ManagedPositions.$inferSelect;
export type V6ManagedPositionInsert = typeof v6ManagedPositions.$inferInsert;

export type V6FeeCollection = typeof v6FeeCollections.$inferSelect;
export type V6FeeCollectionInsert = typeof v6FeeCollections.$inferInsert;

export type V6RebalanceHistory = typeof v6RebalanceHistory.$inferSelect;
export type V6RebalanceHistoryInsert = typeof v6RebalanceHistory.$inferInsert;

export type V6PoolAnalytics = typeof v6PoolAnalytics.$inferSelect;
export type V6PoolAnalyticsInsert = typeof v6PoolAnalytics.$inferInsert;

export type V6VaultConfig = typeof v6VaultConfig.$inferSelect;
export type V6VaultConfigInsert = typeof v6VaultConfig.$inferInsert;

export type V6PendingOperation = typeof v6PendingOperations.$inferSelect;
export type V6PendingOperationInsert = typeof v6PendingOperations.$inferInsert;

export type V6VaultStats = typeof v6VaultStats.$inferSelect;
export type V6VaultStatsInsert = typeof v6VaultStats.$inferInsert;
