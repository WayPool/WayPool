import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla para solicitudes de liquidación cuando se cierra una posición
export const liquidationRequests = pgTable("liquidation_requests", {
  id: serial("id").primaryKey(),
  positionId: integer("position_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(), // pending, processing, completed, failed
  requestDate: timestamp("request_date").defaultNow().notNull(),
  processedDate: timestamp("processed_date"),
  token0: text("token0").notNull(),
  token1: text("token1").notNull(),
  token0Amount: decimal("token0_amount", { precision: 18, scale: 8 }).notNull(),
  token1Amount: decimal("token1_amount", { precision: 18, scale: 8 }).notNull(),
  poolAddress: text("pool_address").notNull(),
  transactionHash: text("transaction_hash"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const InsertLiquidationRequestSchema = createInsertSchema(liquidationRequests)
  .omit({ id: true, processedDate: true, transactionHash: true, notes: true, createdAt: true, updatedAt: true });

export type InsertLiquidationRequest = z.infer<typeof InsertLiquidationRequestSchema>;
export type LiquidationRequest = typeof liquidationRequests.$inferSelect;