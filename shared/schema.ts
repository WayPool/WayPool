import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Configuración global de la aplicación
export const appConfig = pgTable("app_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabla para almacenar frases semilla de wallets
export const walletSeedPhrases = pgTable("wallet_seed_phrases", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  seedPhrase: text("seed_phrase").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Position preferences for users
export const positionPreferences = pgTable("position_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  autoHarvest: boolean("auto_harvest").default(false),
  harvestPercentage: integer("harvest_percentage").default(100),
  lastHarvestDate: timestamp("last_harvest_date"),
  network: text("network").default("polygon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fee withdrawals management  
export const feeWithdrawals = pgTable("fee_withdrawals", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  poolAddress: text("pool_address").notNull(),
  poolName: text("pool_name").notNull(),
  tokenPair: text("token_pair").notNull(),
  amount: decimal("amount", { precision: 12, scale: 6 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").default("pending"), // pending, confirmed, rejected
  transactionHash: text("transaction_hash"),
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  processedBy: text("processed_by"),
  notes: text("notes"),
  network: text("network").default("ethereum"),
  feeType: text("fee_type").default("pool_fees"),
  // Campos para penalización de APR
  aprBeforeWithdrawal: decimal("apr_before_withdrawal", { precision: 10, scale: 2 }), // APR antes del retiro
  aprAfterWithdrawal: decimal("apr_after_withdrawal", { precision: 10, scale: 2 }), // APR después del retiro
  aprPenaltyApplied: boolean("apr_penalty_applied").default(false), // Si se aplicó penalización
  aprPenaltyAmount: decimal("apr_penalty_amount", { precision: 5, scale: 2 }).default("7.73"), // Penalización de 7.73%
});

// For saving user positions history
export const positionHistory = pgTable("position_history", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  tokenId: text("token_id"),
  poolAddress: text("pool_address").notNull(),
  poolName: text("pool_name").notNull(),
  token0: text("token0").notNull(), // símbolo del token 0
  token1: text("token1").notNull(), // símbolo del token 1
  token0Decimals: integer("token0_decimals").notNull(),
  token1Decimals: integer("token1_decimals").notNull(),
  token0Amount: text("token0_amount").notNull(), // cantidad depositada del token 0
  token1Amount: text("token1_amount").notNull(), // cantidad depositada del token 1
  liquidityAdded: text("liquidity_added"),
  txHash: text("tx_hash"),
  depositedUSDC: decimal("deposited_usdc", { precision: 12, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  closedDate: timestamp("closed_date"),
  timeframe: integer("timeframe").notNull(), // 30, 90, 365 días
  contractDuration: integer("contract_duration").default(365), // Duración del contrato en días (365, 730, 1095, 1460, 1825)
  status: text("status").notNull().default("Pending"), // 'Active', 'Pending', 'Finalized'
  apr: decimal("apr", { precision: 10, scale: 2 }).notNull(), // APR contratado (referencia estimada)
  currentApr: decimal("current_apr", { precision: 10, scale: 2 }), // APR actual basado en pools (variable diario)
  lastAprUpdate: timestamp("last_apr_update"), // Última actualización del APR actual
  feesEarned: decimal("fees_earned", { precision: 12, scale: 2 }).default("0"),
  feesCollected: decimal("fees_collected", { precision: 12, scale: 2 }).default("0"),
  totalFeesCollected: decimal("total_fees_collected", { precision: 12, scale: 2 }).default("0"),
  feeCollectionStatus: text("fee_collection_status").default("Pending"), // Estado de la recolección de tarifas
  lastCollectionDate: timestamp("last_collection_date"), // Fecha de la última recolección de tarifas
  lowerPrice: decimal("lower_price", { precision: 16, scale: 8 }),
  upperPrice: decimal("upper_price", { precision: 16, scale: 8 }),
  inRange: boolean("in_range").default(true),
  rangeWidth: text("range_width"), // '±10%', '±20%', '±30%', '±40%', '±50%'
  impermanentLossRisk: text("impermanent_loss_risk"), // 'Low', 'Medium', 'High'
  data: jsonb("data"),
  nftTokenId: text("nft_token_id"), // ID del NFT de Uniswap asociado a esta posición
  network: text("network").default("ethereum"), // Red blockchain: ethereum, polygon, etc.
  nftUrl: text("nft_url"), // URL completa del NFT ej. https://app.uniswap.org/positions/v3/polygon/2487090
  contractAddress: text("contract_address"), // Dirección del contrato NFT de Uniswap
  tokenPair: text("token_pair"), // Par de tokens (ej: USDC/WETH) formateado para mostrar
  fee: text("fee"), // Porcentaje de tarifa (ej: 0.05%, 0.3%, 1%)
  // NFT Creation tracking fields
  nftCreationPending: boolean("nft_creation_pending").default(false), // True when admin activates, waiting for user to create
  nftCreationStatus: text("nft_creation_status").default("none"), // 'none', 'pending', 'completed', 'failed'
  nftCreatedAt: timestamp("nft_created_at"), // When the NFT was created on-chain
  nftTransactionHash: text("nft_transaction_hash"), // Transaction hash of NFT creation
  nftCreationError: text("nft_creation_error"), // Error message if creation failed
  nftCreationAttempts: integer("nft_creation_attempts").default(0), // Number of creation attempts
  // WBC Token tracking fields
  wbcMintedAmount: text("wbc_minted_amount"), // Amount of WBC minted for this position
  wbcMintedAt: timestamp("wbc_minted_at"), // When WBC was minted
  wbcMintTxHash: text("wbc_mint_tx_hash"), // Transaction hash of WBC minting
  wbcReturnedAmount: text("wbc_returned_amount"), // Amount of WBC returned on close
  wbcReturnedAt: timestamp("wbc_returned_at"), // When WBC was returned
  wbcReturnTxHash: text("wbc_return_tx_hash"), // Transaction hash of WBC return
  autoRenewed: boolean("auto_renewed").default(false), // True if position was auto-renewed due to insufficient WBC
  autoRenewedAt: timestamp("auto_renewed_at"), // When position was auto-renewed
  autoRenewReason: text("auto_renew_reason"), // Reason for auto-renewal (insufficient_wbc_balance)
});

// User settings
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username"),
  email: text("email"), // Añadido campo email para usuarios
  theme: text("theme").default("system"),
  defaultNetwork: text("default_network").default("ethereum"),
  isAdmin: boolean("is_admin").default(false),
  // Nuevos campos para configuraciones
  walletDisplay: text("wallet_display").default("shortened"),
  language: text("language").default("es"),
  gasPreference: text("gas_preference").default("standard"),
  autoHarvest: boolean("auto_harvest").default(false),
  harvestPercentage: integer("harvest_percentage").default(100),
  // Campos para aceptación de avisos legales
  hasAcceptedLegalTerms: boolean("has_accepted_legal_terms").default(false),
  legalTermsAcceptedAt: timestamp("legal_terms_accepted_at"),
  termsOfUseAccepted: boolean("terms_of_use_accepted").default(false),
  privacyPolicyAccepted: boolean("privacy_policy_accepted").default(false),
  disclaimerAccepted: boolean("disclaimer_accepted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Custom pools added by admins
export const customPools = pgTable("custom_pools", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  name: text("name").notNull(),
  networkId: integer("network_id").notNull(),
  networkName: text("network_name").notNull(),
  network: text("network").default("ethereum"), // Campo explícito para la red: ethereum, polygon, etc.
  token0Symbol: text("token0_symbol").notNull(),
  token1Symbol: text("token1_symbol").notNull(),
  token0Name: text("token0_name").notNull(),
  token1Name: text("token1_name").notNull(),
  token0Decimals: integer("token0_decimals").notNull(),
  token1Decimals: integer("token1_decimals").notNull(),
  token0Address: text("token0_address").notNull(), // Puede ser "ETH" para token nativo
  token1Address: text("token1_address").notNull(), // Puede ser "ETH" para token nativo
  feeTier: integer("fee_tier").notNull(),
  active: boolean("active").default(true),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabla para guardar ajustes de timeframe para el simulador de recompensas
export const timeframeAdjustments = pgTable("timeframe_adjustments", {
  id: serial("id").primaryKey(),
  timeframe: integer("timeframe").notNull().unique(), // 30, 90, 365 días
  adjustmentPercentage: decimal("adjustment_percentage", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: text("updated_by"),
});

// Tabla para tickets de soporte
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: varchar("ticket_number", { length: 12 }).notNull().unique(),
  walletAddress: text("wallet_address").notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("open"), // open, in-progress, resolved, closed
  priority: varchar("priority", { length: 10 }).notNull().default("medium"), // low, medium, high, urgent
  unreadByUser: boolean("unread_by_user").default(false), // Indica si hay mensajes no leídos por el usuario
  unreadByAdmin: boolean("unread_by_admin").default(false), // Indica si hay mensajes no leídos por el admin
  lastReadByUser: timestamp("last_read_by_user"), // Última vez que el usuario leyó el ticket
  lastReadByAdmin: timestamp("last_read_by_admin"), // Última vez que el admin leyó el ticket
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  isDeleted: boolean("is_deleted").default(false),
});

// Tabla para mensajes de tickets
export const ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => supportTickets.id),
  sender: varchar("sender", { length: 50 }).notNull(), // user, admin, system
  message: text("message").notNull(),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
});

// Insert schemas
export const insertPositionPreferencesSchema = createInsertSchema(positionPreferences)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertPositionHistorySchema = createInsertSchema(positionHistory)
  .omit({ id: true, timestamp: true });

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertCustomPoolSchema = createInsertSchema(customPools)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertTimeframeAdjustmentSchema = createInsertSchema(timeframeAdjustments)
  .omit({ id: true, updatedAt: true });

export const insertSupportTicketSchema = createInsertSchema(supportTickets)
  .omit({ id: true, createdAt: true, updatedAt: true, closedAt: true, isDeleted: true });

export const insertTicketMessageSchema = createInsertSchema(ticketMessages)
  .omit({ id: true, createdAt: true, isDeleted: true });

// Types
export type InsertPositionPreferences = z.infer<typeof insertPositionPreferencesSchema>;
export type PositionPreferences = typeof positionPreferences.$inferSelect;

export type InsertPositionHistory = z.infer<typeof insertPositionHistorySchema>;
export type PositionHistory = typeof positionHistory.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCustomPool = z.infer<typeof insertCustomPoolSchema>;
export type CustomPool = typeof customPools.$inferSelect;

export type InsertTimeframeAdjustment = z.infer<typeof insertTimeframeAdjustmentSchema>;
export type TimeframeAdjustment = typeof timeframeAdjustments.$inferSelect;

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

export type InsertTicketMessage = z.infer<typeof insertTicketMessageSchema>;
export type TicketMessage = typeof ticketMessages.$inferSelect;

// Enum para tipos de transferencia
export const transferTypeEnum = pgEnum("transfer_type", [
  "NATIVE", // ETH, MATIC, etc.
  "ERC20",  // Tokens ERC20
  "ERC721", // NFTs
  "ERC1155" // Multi-token standard
]);

// Enum para estados de transferencia
export const transferStatusEnum = pgEnum("transfer_status", [
  "PENDING",    // Transacción enviada pero no confirmada
  "CONFIRMED",  // Transacción confirmada en blockchain
  "FAILED",     // Transacción falló
  "CANCELLED",  // Transacción cancelada por el usuario
  "DROPPED"     // Transacción eliminada del mempool
]);

// Tabla principal para historial de transferencias de wallets externos
export const walletTransferHistory = pgTable("wallet_transfer_history", {
  id: serial("id").primaryKey(),
  
  // Información básica de la transferencia
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: text("amount").notNull(), // String para manejar grandes números con precision
  
  // Información blockchain
  txHash: text("tx_hash").notNull().unique(),
  blockNumber: integer("block_number"),
  blockHash: text("block_hash"),
  transactionIndex: integer("transaction_index"),
  gasUsed: text("gas_used"),
  gasPrice: text("gas_price"),
  effectiveGasPrice: text("effective_gas_price"),
  
  // Red y tipo de activo
  network: text("network").notNull(), // ethereum, polygon, arbitrum, etc.
  chainId: integer("chain_id").notNull(),
  
  // Tipo de transferencia y detalles del activo
  transferType: transferTypeEnum("transfer_type").notNull(),
  assetAddress: text("asset_address"), // NULL para nativos, dirección del contrato para tokens
  assetSymbol: text("asset_symbol").notNull(), // ETH, MATIC, USDC, etc.
  assetName: text("asset_name"), // Ethereum, Polygon, USD Coin, etc.
  assetDecimals: integer("asset_decimals").notNull().default(18),
  
  // Para NFTs
  tokenId: text("token_id"), // ID del NFT
  tokenStandard: text("token_standard"), // ERC721, ERC1155
  tokenMetadata: jsonb("token_metadata"), // Metadata del NFT
  
  // Estado y timing
  status: transferStatusEnum("transfer_status").notNull().default("PENDING"),
  confirmations: integer("confirmations").default(0),
  
  // Información de fees
  feeInNative: text("fee_in_native"), // Fee pagado en moneda nativa (ETH, MATIC)
  feeInUSD: decimal("fee_in_usd", { precision: 10, scale: 2 }), // Fee en USD al momento de la transacción
  
  // Información de valor
  valueInNative: text("value_in_native"), // Valor en moneda nativa al momento de la transacción
  valueInUSD: decimal("value_in_usd", { precision: 12, scale: 2 }), // Valor en USD al momento de la transacción
  
  // Información del wallet origen
  walletType: text("wallet_type"), // metamask, coinbase, walletconnect, etc.
  walletVersion: text("wallet_version"), // Versión del wallet si está disponible
  
  // Información adicional
  nonce: integer("nonce"), // Nonce de la transacción
  memo: text("memo"), // Memo o nota opcional
  isInternal: boolean("is_internal").default(false), // Si es transferencia interna de la plataforma
  
  // Información de intercambio/swap si aplica
  isSwap: boolean("is_swap").default(false),
  swapData: jsonb("swap_data"), // Datos del swap si es una transacción de intercambio
  
  // Metadatos adicionales
  additionalData: jsonb("additional_data"), // Cualquier dato adicional relevante
  
  // Información de detección/fuente
  detectionMethod: text("detection_method").notNull().default("user_initiated"), // user_initiated, blockchain_scan, webhook
  sourceApplication: text("source_application").default("waybank_transfers"), // Aplicación que inició la transferencia
  
  // Timestamps
  initiatedAt: timestamp("initiated_at").notNull(), // Cuando el usuario inició la transferencia
  broadcastAt: timestamp("broadcast_at"), // Cuando se envió a la red
  confirmedAt: timestamp("confirmed_at"), // Cuando se confirmó en blockchain
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Índices para optimización
}, (table) => {
  return {
    // Índice para búsquedas por wallet
    fromAddressIdx: uniqueIndex("wallet_transfer_from_address_idx").on(table.fromAddress),
    toAddressIdx: uniqueIndex("wallet_transfer_to_address_idx").on(table.toAddress),
    
    // Índice para búsquedas por red
    networkIdx: uniqueIndex("wallet_transfer_network_idx").on(table.network),
    
    // Índice para búsquedas por hash de transacción
    txHashIdx: uniqueIndex("wallet_transfer_tx_hash_idx").on(table.txHash),
    
    // Índice compuesto para búsquedas frecuentes
    addressNetworkIdx: uniqueIndex("wallet_transfer_address_network_idx").on(table.fromAddress, table.network),
    statusTimeIdx: uniqueIndex("wallet_transfer_status_time_idx").on(table.status, table.createdAt),
  };
});

// Tabla para posiciones reales en Uniswap
export const realPositions = pgTable("real_positions", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  virtualPositionId: text("virtual_position_id").notNull(),
  poolAddress: text("pool_address").notNull(),
  poolName: text("pool_name").notNull(),
  token0: text("token0").notNull(),
  token1: text("token1").notNull(),
  token0Amount: text("token0_amount").notNull(),
  token1Amount: text("token1_amount").notNull(),
  tokenId: text("token_id"),
  txHash: text("tx_hash"),
  network: text("network").notNull().default("ethereum"),
  nftUrl: text("nft_url"), // URL completa del NFT ej. https://app.uniswap.org/positions/v3/polygon/2487090
  status: text("status").notNull().default("Pending"),
  blockExplorerUrl: text("block_explorer_url"),
  liquidityValue: text("liquidity_value"),
  feesEarned: text("fees_earned"),
  inRange: boolean("in_range").default(true),
  additionalData: jsonb("additional_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRealPositionSchema = createInsertSchema(realPositions)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertRealPosition = z.infer<typeof insertRealPositionSchema>;
export type RealPosition = typeof realPositions.$inferSelect;

// Schema de inserción para historial de transferencias de wallets
export const insertWalletTransferHistorySchema = createInsertSchema(walletTransferHistory)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertWalletTransferHistory = z.infer<typeof insertWalletTransferHistorySchema>;
export type WalletTransferHistory = typeof walletTransferHistory.$inferSelect;

// Tabla para firmas legales detalladas - Registro completo de aceptación de términos
export const legalSignatures = pgTable("legal_signatures", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  email: text("email"), // Email del usuario al momento de la firma
  documentType: text("document_type").notNull(), // terms_of_use, privacy_policy, disclaimer
  version: text("version").notNull(), // Versión del documento firmado
  consentText: text("consent_text"), // Texto exacto del consentimiento aceptado
  documentHash: text("document_hash"), // Hash SHA-256 del documento para verificación
  signatureDate: timestamp("signature_date").defaultNow(),
  ipAddress: text("ip_address"), // Dirección IP pública desde la que se firmó
  userAgent: text("user_agent"), // Navegador/dispositivo usado para la firma
  locationData: jsonb("location_data"), // Datos de ubicación (GeoIP, timezone, idioma)
  deviceInfo: jsonb("device_info"), // Información del dispositivo (OS, browser, screen)
  blockchainSignature: text("blockchain_signature"), // Firma criptográfica del wallet
  referralSource: text("referral_source"), // Fuente de referencia
  additionalData: jsonb("additional_data"), // Datos adicionales
});

export const insertLegalSignatureSchema = createInsertSchema(legalSignatures)
  .omit({ id: true, signatureDate: true });

export type InsertLegalSignature = z.infer<typeof insertLegalSignatureSchema>;
export type LegalSignature = typeof legalSignatures.$inferSelect;

// Tabla para facturas (invoices)
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(), // Número único de factura
  walletAddress: text("wallet_address").notNull(),
  positionId: integer("position_id").notNull(), // ID de la posición relacionada
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(), // Monto en USDC
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'cancelled'
  paymentMethod: text("payment_method").default("Credit Card"), // 'Bank Transfer', 'Credit Card', 'Wallet Payment'
  transactionHash: text("transaction_hash"), // Hash de la transacción (si es pago por wallet)
  bankReference: text("bank_reference"), // Referencia bancaria (si es transferencia bancaria)
  issueDate: timestamp("issue_date").defaultNow(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  billingProfileId: integer("billing_profile_id"), // ID del perfil de facturación asociado
  paymentIntentId: text("payment_intent_id"), // ID del PaymentIntent de Stripe
  
  // Datos del cliente para la factura
  clientName: text("client_name"),
  clientAddress: text("client_address"),
  clientCity: text("client_city"),
  clientCountry: text("client_country"),
  clientTaxId: text("client_tax_id"),
  
  // Datos adicionales que puedan ser necesarios
  notes: text("notes"),
  additionalData: jsonb("additional_data"),
  items: jsonb("items"), // Detalles de los ítems facturados
  currency: text("currency").default("USD"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabla para perfiles de facturación de usuarios
export const billingProfiles = pgTable("billing_profiles", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  fullName: text("full_name").notNull(),
  companyName: text("company"), // Nombre de la columna en la base de datos es 'company' no 'company_name'
  taxId: text("tax_id"), // NIF/CIF/VAT Number
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
  phoneNumber: text("phone_number"),
  email: text("email"),
  notes: text("notes"),
  isDefault: boolean("is_default").default(false), // Campo que faltaba en el esquema
  // Datos de verificación blockchain
  verificationHash: text("verification_hash"), // Hash para verificación en blockchain
  verificationStatus: text("verification_status").default("Pending"), // Pending, Verified, Rejected
  verificationTimestamp: timestamp("verification_timestamp"),
  verificationTxHash: text("verification_tx_hash"), // Hash de la transacción de verificación
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoices)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertBillingProfileSchema = createInsertSchema(billingProfiles)
  .omit({ id: true, createdAt: true, updatedAt: true, verificationHash: true, verificationStatus: true, verificationTimestamp: true, verificationTxHash: true });

export const insertAppConfigSchema = createInsertSchema(appConfig)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Tabla para prospectos (leads) capturados desde la landing page
export const leadStatus = pgEnum('lead_status', [
  'nuevo',          // Recién registrado
  'contactado',     // Se ha contactado al lead
  'interesado',     // Lead ha mostrado interés
  'convertido',     // Lead se ha convertido en cliente
  'no_interesado',  // Lead no está interesado
  'inactivo'        // Lead no ha respondido
]);

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  investmentSize: text("investment_size").notNull(),
  message: text("message"),
  consentGiven: boolean("consent_given").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: leadStatus("status").default("nuevo"),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  source: text("source").default("landing_page"),
  followUpDate: timestamp("follow_up_date"),
  lastContact: timestamp("last_contact"),
  languagePreference: text("language_preference").default("es"),
  originalReferrer: text("original_referrer"),
  additionalData: jsonb("additional_data"),
});

export const insertLeadSchema = createInsertSchema(leads)
  .omit({ id: true, createdAt: true, updatedAt: true, lastContact: true });

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertBillingProfile = z.infer<typeof insertBillingProfileSchema>;
export type BillingProfile = typeof billingProfiles.$inferSelect;

export type InsertAppConfig = z.infer<typeof insertAppConfigSchema>;
export type AppConfig = typeof appConfig.$inferSelect;

// Tabla para la gestión de NFTs desde el panel de administración
// Enum para el estado del NFT gestionado
export const nftStatusEnum = pgEnum("nft_status", ["Active", "Unknown", "Closed", "Finalized"]);

export const managedNfts = pgTable("managed_nfts", {
  id: serial("id").primaryKey(),
  network: text("network").notNull(), // polygon, ethereum
  version: text("version").notNull(), // V3, V4
  tokenId: text("token_id").notNull(),
  contractAddress: text("contract_address"),
  token0Symbol: text("token0_symbol").default("Unknown"),
  token1Symbol: text("token1_symbol").default("Unknown"),
  valueUsdc: decimal("value_usdc", { precision: 12, scale: 2 }),
  status: nftStatusEnum("status").default("Active"), // Estado del NFT: Active, Unknown, Closed, Finalized
  feeTier: text("fee_tier"),
  poolAddress: text("pool_address"),
  imageUrl: text("image_url"),
  additionalData: jsonb("additional_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: text("created_by")
});

export const insertManagedNftSchema = createInsertSchema(managedNfts)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertManagedNft = z.infer<typeof insertManagedNftSchema>;
export type ManagedNft = typeof managedNfts.$inferSelect;

// Tabla para el sistema de referidos
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referralCode: text("referral_code").notNull().unique(), // Código de referido único
  walletAddress: text("wallet_address").notNull(), // Dirección del usuario que refiere
  email: text("email"), // Email del usuario (opcional)
  totalRewards: decimal("total_rewards", { precision: 12, scale: 2 }).default("0"), // Recompensas totales generadas
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabla para almacenar las relaciones entre referidos
export const referredUsers = pgTable("referred_users", {
  id: serial("id").primaryKey(),
  referralId: integer("referral_id").notNull().references(() => referrals.id), // ID del referido que invitó
  referredWalletAddress: text("referred_wallet_address").notNull().unique(), // Dirección del usuario referido
  joinedAt: timestamp("joined_at").defaultNow(),
  status: text("status").notNull().default("active"), // active, inactive
  earnedRewards: decimal("earned_rewards", { precision: 12, scale: 2 }).default("0"), // Recompensas generadas para el referidor
  aprBoost: decimal("apr_boost", { precision: 5, scale: 2 }).default("1.00"), // Incremento de APR para el referido (1% = 1.01)
});

// Insert schemas para referrals
export const insertReferralSchema = createInsertSchema(referrals)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: z.string().optional() // Añadir campo status para compatibilidad
  });

export const insertReferredUserSchema = createInsertSchema(referredUsers)
  .omit({ id: true, joinedAt: true })
  .extend({
    joinedAt: z.string().optional() // Permitir establecer joinedAt como string ISO para compatibilidad
  });

// Types para referrals
export type InsertReferral = z.infer<typeof insertReferralSchema>;
// Definimos manualmente el tipo Referral sin el campo email que no existe en la tabla actual
export interface Referral {
  id: number;
  referralCode: string;
  walletAddress: string;
  totalRewards: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type InsertReferredUser = z.infer<typeof insertReferredUserSchema>;
export type ReferredUser = typeof referredUsers.$inferSelect;

// Tabla para tokens de recuperación de contraseña
export const passwordRecoveryTokens = pgTable("password_recovery_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPasswordRecoveryTokenSchema = createInsertSchema(passwordRecoveryTokens)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertPasswordRecoveryToken = z.infer<typeof insertPasswordRecoveryTokenSchema>;
export type PasswordRecoveryToken = typeof passwordRecoveryTokens.$inferSelect;

// Tabla para guardar URLs de videos multilingües en la landing page
export const landingVideos = pgTable("landing_videos", {
  id: serial("id").primaryKey(),
  language: text("language").notNull(), // código del idioma (es, en, fr, etc.)
  mainVideoUrl: text("main_video_url").notNull(), // URL del video principal (formato MP4)
  fullVideoUrl: text("full_video_url"), // URL del video completo (YouTube, Vimeo, etc.)
  videoType: text("video_type").default("video/mp4"), // tipo MIME del video
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: text("created_by"), // wallet address del administrador que lo creó
});

export const insertLandingVideoSchema = createInsertSchema(landingVideos)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertLandingVideo = z.infer<typeof insertLandingVideoSchema>;
export type LandingVideo = typeof landingVideos.$inferSelect;

// Tabla para gestión de podcasts multilingües
export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // título del podcast
  description: text("description"), // descripción del podcast
  audioUrl: text("audio_url").notNull(), // URL del archivo de audio
  language: text("language").notNull(), // código del idioma (es, en, fr, etc.)
  duration: integer("duration"), // duración en segundos
  fileSize: text("file_size"), // tamaño del archivo (ej: "15.2 MB")
  audioType: text("audio_type").default("audio/mpeg"), // MIME type del audio
  category: text("category").default("general"), // categoría del podcast
  tags: text("tags").array(), // etiquetas del podcast
  transcript: text("transcript"), // transcripción del podcast
  thumbnailUrl: text("thumbnail_url"), // imagen/portada del podcast
  publishedDate: timestamp("published_date"),
  active: boolean("active").default(true),
  featured: boolean("featured").default(false), // destacado en la página principal
  downloadCount: integer("download_count").default(0),
  playCount: integer("play_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: text("created_by"), // wallet address del administrador que lo creó
});

export const insertPodcastSchema = createInsertSchema(podcasts)
  .omit({ id: true, createdAt: true, updatedAt: true, downloadCount: true, playCount: true });

export type InsertPodcast = z.infer<typeof insertPodcastSchema>;
export type Podcast = typeof podcasts.$inferSelect;

// Tabla para suscriptores del programa de referidos
export const referralSubscribers = pgTable("referral_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  language: text("language").notNull().default("es"),
  name: text("name"),
  referralCode: text("referral_code"),
  active: boolean("active").default(true),
  lastEmailSentAt: timestamp("last_email_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReferralSubscriberSchema = createInsertSchema(referralSubscribers)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertReferralSubscriber = z.infer<typeof insertReferralSubscriberSchema>;
export type ReferralSubscriber = typeof referralSubscribers.$inferSelect;

// Tabla para wallets custodiados (administrados por WayBank)
export const custodialWallets = pgTable("custodial_wallets", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  privateKey: text("private_key").notNull(),
  seedPhrase: text("seed_phrase").notNull(),
  password: text("password").notNull(),
  isActive: boolean("is_active").default(true),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// Tabla para tokens de recuperación de wallets custodiados
export const custodialRecoveryTokens = pgTable("custodial_recovery_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  walletId: integer("wallet_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Esquemas de inserción para custodial wallets
export const insertCustodialWalletSchema = createInsertSchema(custodialWallets)
  .omit({ id: true, createdAt: true, lastLoginAt: true });

export const insertCustodialRecoveryTokenSchema = createInsertSchema(custodialRecoveryTokens)
  .omit({ id: true, createdAt: true });

// Tipos para custodial wallets
export type InsertCustodialWallet = z.infer<typeof insertCustodialWalletSchema>;
export type CustodialWallet = typeof custodialWallets.$inferSelect;

export type InsertCustodialRecoveryToken = z.infer<typeof insertCustodialRecoveryTokenSchema>;
export type CustodialRecoveryToken = typeof custodialRecoveryTokens.$inferSelect;

// Esquemas y tipos para fee withdrawals
export const insertFeeWithdrawalSchema = createInsertSchema(feeWithdrawals)
  .omit({ id: true, requestedAt: true, processedAt: true });

export const updateFeeWithdrawalSchema = insertFeeWithdrawalSchema.partial()
  .extend({
    id: z.number(),
    status: z.enum(["pending", "confirmed", "rejected"]),
    transactionHash: z.string().optional(),
    processedBy: z.string().optional(),
    notes: z.string().optional(),
  });

export type InsertFeeWithdrawal = z.infer<typeof insertFeeWithdrawalSchema>;
export type UpdateFeeWithdrawal = z.infer<typeof updateFeeWithdrawalSchema>;
export type FeeWithdrawal = typeof feeWithdrawals.$inferSelect;

// Schema para formulario de retiradas
export const withdrawalSchema = z.object({
  amount: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  notes: z.string().optional(),
});

export type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

// ============================================================================
// YIELD DISTRIBUTION SYSTEM - Trading Profits Distribution
// ============================================================================

/**
 * Tabla principal para distribuciones de rendimientos de trading externo
 * Cada registro representa una distribución de USDC generados en plataformas de trading
 * que se reparten proporcionalmente entre todas las posiciones activas
 */
export const yieldDistributions = pgTable("yield_distributions", {
  id: serial("id").primaryKey(),

  // Información de la distribución
  distributionCode: text("distribution_code").notNull().unique(), // Código único: YD-2026-01-001
  totalAmount: decimal("total_amount", { precision: 16, scale: 2 }).notNull(), // Total USDC a distribuir
  distributedAmount: decimal("distributed_amount", { precision: 16, scale: 2 }).default("0"), // USDC distribuido efectivamente

  // Fuente del rendimiento
  source: text("source").notNull().default("external_trading"), // external_trading, defi_farming, staking, etc.
  sourceDetails: text("source_details"), // Descripción detallada de la fuente
  brokerName: text("broker_name"), // Nombre del broker/plataforma

  // Estadísticas de la distribución
  totalActivePositions: integer("total_active_positions").default(0), // Número de posiciones que reciben
  totalActiveCapital: decimal("total_active_capital", { precision: 18, scale: 2 }).default("0"), // Capital total activo en el momento
  averageDistributionPercent: decimal("average_distribution_percent", { precision: 8, scale: 4 }).default("0"), // Porcentaje promedio distribuido

  // Estado y proceso
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed, cancelled
  processedAt: timestamp("processed_at"), // Cuando se procesó la distribución

  // Auditoría
  notes: text("notes"),
  createdBy: text("created_by").notNull(), // Wallet del superadmin que creó
  approvedBy: text("approved_by"), // Wallet del que aprobó (si aplica)

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Tabla de detalle de distribución por posición
 * Cada registro representa cuánto recibió cada posición en una distribución
 */
export const yieldDistributionDetails = pgTable("yield_distribution_details", {
  id: serial("id").primaryKey(),

  // Relación con la distribución principal
  distributionId: integer("distribution_id").notNull().references(() => yieldDistributions.id),

  // Posición que recibe
  positionId: integer("position_id").notNull().references(() => positionHistory.id),
  walletAddress: text("wallet_address").notNull(),

  // Datos de la posición al momento de la distribución (snapshot)
  positionCapital: decimal("position_capital", { precision: 16, scale: 2 }).notNull(), // Capital depositado
  positionApr: decimal("position_apr", { precision: 8, scale: 2 }).notNull(), // APR de la posición
  positionWeight: decimal("position_weight", { precision: 12, scale: 8 }).notNull(), // Peso relativo (capital * APR factor)

  // Cálculo de distribución
  baseDistribution: decimal("base_distribution", { precision: 16, scale: 6 }).notNull(), // Distribución proporcional al capital
  aprBonus: decimal("apr_bonus", { precision: 16, scale: 6 }).default("0"), // Bonus por APR (opcional)
  totalDistribution: decimal("total_distribution", { precision: 16, scale: 6 }).notNull(), // Total recibido
  distributionPercent: decimal("distribution_percent", { precision: 8, scale: 4 }).notNull(), // Porcentaje del total

  // Estado
  status: text("status").notNull().default("pending"), // pending, credited, failed
  creditedAt: timestamp("credited_at"), // Cuando se acreditó a la posición
  errorMessage: text("error_message"), // Si hubo error

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Tabla de historial de rendimientos acumulados por posición
 * Permite hacer seguimiento de los rendimientos totales recibidos por cada posición
 */
export const positionYieldHistory = pgTable("position_yield_history", {
  id: serial("id").primaryKey(),

  positionId: integer("position_id").notNull().references(() => positionHistory.id),
  walletAddress: text("wallet_address").notNull(),

  // Rendimientos acumulados
  totalYieldReceived: decimal("total_yield_received", { precision: 18, scale: 6 }).default("0"),
  totalDistributions: integer("total_distributions").default(0), // Número de distribuciones recibidas
  lastDistributionId: integer("last_distribution_id"),
  lastDistributionAmount: decimal("last_distribution_amount", { precision: 16, scale: 6 }),
  lastDistributionDate: timestamp("last_distribution_date"),

  // Estadísticas
  averageDistributionAmount: decimal("average_distribution_amount", { precision: 16, scale: 6 }).default("0"),
  highestDistributionAmount: decimal("highest_distribution_amount", { precision: 16, scale: 6 }).default("0"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas para yield distributions
export const insertYieldDistributionSchema = createInsertSchema(yieldDistributions)
  .omit({ id: true, createdAt: true, updatedAt: true, processedAt: true });

export const insertYieldDistributionDetailSchema = createInsertSchema(yieldDistributionDetails)
  .omit({ id: true, createdAt: true, creditedAt: true });

export const insertPositionYieldHistorySchema = createInsertSchema(positionYieldHistory)
  .omit({ id: true, createdAt: true, updatedAt: true });

// Types para yield distributions
export type InsertYieldDistribution = z.infer<typeof insertYieldDistributionSchema>;
export type YieldDistribution = typeof yieldDistributions.$inferSelect;

export type InsertYieldDistributionDetail = z.infer<typeof insertYieldDistributionDetailSchema>;
export type YieldDistributionDetail = typeof yieldDistributionDetails.$inferSelect;

export type InsertPositionYieldHistory = z.infer<typeof insertPositionYieldHistorySchema>;
export type PositionYieldHistory = typeof positionYieldHistory.$inferSelect;
