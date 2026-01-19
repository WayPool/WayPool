import { pgTable, serial, text, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

/**
 * Schema for real Uniswap positions created for users
 * This is separate from the virtual positions system
 */
export const realPositions = pgTable('real_positions', {
  id: serial('id').primaryKey(),
  walletAddress: text('wallet_address').notNull(),
  virtualPositionId: numeric('virtual_position_id').notNull(), // Reference to virtual position
  poolAddress: text('pool_address').notNull(),
  poolName: text('pool_name').notNull(),
  token0: text('token0').notNull(),
  token1: text('token1').notNull(),
  token0Amount: numeric('token0_amount', { precision: 18, scale: 8 }).notNull(),
  token1Amount: numeric('token1_amount', { precision: 18, scale: 8 }).notNull(),
  tokenId: text('token_id'), // Uniswap NFT token ID
  txHash: text('tx_hash'),  // Transaction hash
  network: text('network').default('ethereum'),
  nftUrl: text('nft_url'), // URL completa del NFT ej. https://app.uniswap.org/positions/v3/polygon/2487090
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  blockExplorerUrl: text('block_explorer_url'), // Link to Etherscan/Polygonscan
  liquidityValue: numeric('liquidity_value', { precision: 18, scale: 2 }), // Value in USD
  feesEarned: numeric('fees_earned', { precision: 18, scale: 2 }).default('0'),
  inRange: boolean('in_range').default(true),
  additionalData: text('additional_data'), // JSON string for flexible data storage
  contractAddress: text('contract_address'), // Dirección del contrato NFT de Uniswap
  tokenPair: text('token_pair'), // Par de tokens (ej: USDC/WETH) formateado para mostrar
  fee: text('fee') // Porcentaje de tarifa (ej: 0.05%, 0.3%, 1%)
});

export const realPositionInsertSchema = createInsertSchema(realPositions).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

export type InsertRealPosition = typeof realPositions.$inferInsert;
export type RealPosition = typeof realPositions.$inferSelect;