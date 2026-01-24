import { db, pool } from './db';
import { timeframeAdjustments, users, customPools, realPositions, invoices } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Initialize timeframe adjustments for the rewards simulator
 */
export async function initializeTimeframeAdjustments() {
  console.log('Initializing timeframe adjustments...');
  
  try {
    // Check if records already exist
    const existingAdjustments = await db.select().from(timeframeAdjustments);
    
    if (existingAdjustments.length === 0) {
      console.log('No existing timeframe adjustments found, creating default values...');
      
      // Insert default values for each timeframe separately
      await db.insert(timeframeAdjustments).values({
        timeframe: 30, // 1 month
        adjustmentPercentage: '-24.56',
        description: 'Adjustment for 1 month timeframe',
        updatedBy: 'system'
      });
      
      await db.insert(timeframeAdjustments).values({
        timeframe: 90, // 3 months
        adjustmentPercentage: '-17.37',
        description: 'Adjustment for 3 months timeframe',
        updatedBy: 'system'
      });
      
      await db.insert(timeframeAdjustments).values({
        timeframe: 365, // 1 year
        adjustmentPercentage: '-4.52',
        description: 'Adjustment for 1 year timeframe',
        updatedBy: 'system'
      });
      
      console.log('Timeframe adjustments initialized successfully');
    } else {
      console.log(`Found ${existingAdjustments.length} existing timeframe adjustments, no initialization required`);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing timeframe adjustments:', error);
    return false;
  }
}

/**
 * Get all timeframe adjustments
 */
export async function getTimeframeAdjustments() {
  try {
    return await db.select().from(timeframeAdjustments).orderBy(timeframeAdjustments.timeframe);
  } catch (error) {
    console.error('Error getting timeframe adjustments:', error);
    return [];
  }
}

/**
 * Get a specific timeframe adjustment
 */
export async function getTimeframeAdjustment(timeframeValue: number) {
  try {
    const [adjustment] = await db
      .select()
      .from(timeframeAdjustments)
      .where(eq(timeframeAdjustments.timeframe, timeframeValue));
    
    return adjustment;
  } catch (error) {
    console.error(`Error getting adjustment for timeframe ${timeframeValue}:`, error);
    return null;
  }
}

/**
 * Update a timeframe adjustment
 */
export async function updateTimeframeAdjustment(
  timeframeValue: number,
  adjustmentPercentage: number,
  updatedBy: string
) {
  try {
    await db
      .update(timeframeAdjustments)
      .set({
        adjustmentPercentage: adjustmentPercentage.toString(),
        updatedBy,
        updatedAt: new Date()
      })
      .where(eq(timeframeAdjustments.timeframe, timeframeValue));
    
    return true;
  } catch (error) {
    console.error(`Error updating adjustment for timeframe ${timeframeValue}:`, error);
    return false;
  }
}

/**
 * Run network column migration for custom_pools table
 */
export async function addNetworkColumnMigration() {
  try {
    console.log('Adding network column to custom_pools table...');

    // First check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'custom_pools'
      );
    `);

    if (!tableExists.rows || !tableExists.rows[0]?.exists) {
      console.log('custom_pools table does not exist yet, will be created in main migration');
      return true;
    }

    // Add network column and update existing records - use explicit public schema
    await db.execute(sql`
      -- Añadir columna network a la tabla custom_pools
      ALTER TABLE public.custom_pools ADD COLUMN IF NOT EXISTS network TEXT DEFAULT 'ethereum';
    `);

    await db.execute(sql`
      -- Actualizar columna network basado en network_name para registros existentes
      UPDATE public.custom_pools
      SET network =
        CASE
          WHEN LOWER(network_name) LIKE '%ethereum%' THEN 'ethereum'
          WHEN LOWER(network_name) LIKE '%polygon%' THEN 'polygon'
          WHEN LOWER(network_name) LIKE '%optimism%' THEN 'optimism'
          WHEN LOWER(network_name) LIKE '%arbitrum%' THEN 'arbitrum'
          WHEN LOWER(network_name) LIKE '%base%' THEN 'base'
          ELSE 'ethereum' -- Valor por defecto
        END
      WHERE network IS NULL OR network = '';
    `);

    console.log('Network column added and updated successfully');
    return true;
  } catch (error) {
    console.error('Error adding network column to custom_pools:', error);
    return false;
  }
}

/**
 * Migración para crear la tabla de facturas (invoices)
 */
export async function addInvoicesTableMigration() {
  console.log('Running invoices table migration...');

  try {
    // Verificar si la tabla de facturas ya existe
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'invoices'
      );
    `);

    // Si la tabla ya existe, omitir la migración
    if (result.rows && result.rows.length > 0 && result.rows[0].exists) {
      console.log('Invoices table already exists, skipping migration');
      return true;
    }

    // Crear la tabla de facturas - use explicit public schema
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.invoices (
        id SERIAL PRIMARY KEY,
        invoice_number TEXT NOT NULL UNIQUE,
        wallet_address TEXT NOT NULL,
        position_id INTEGER NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        payment_method TEXT NOT NULL,
        transaction_hash TEXT,
        bank_reference TEXT,
        issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP,
        paid_date TIMESTAMP,
        client_name TEXT,
        client_address TEXT,
        client_city TEXT,
        client_country TEXT,
        client_tax_id TEXT,
        notes TEXT,
        additional_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Invoices table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating invoices table:', error);
    return false;
  }
}

/**
 * Migración para agregar columnas de aceptación legal a la tabla de usuarios
 */
export async function addLegalAcceptanceColumnsMigration() {
  console.log('Running legal acceptance columns migration...');

  try {
    // Check if the columns already exist to prevent errors
    const result = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'has_accepted_legal_terms';
    `);

    // If the column already exists, skip this migration
    if (result.rows && result.rows.length > 0) {
      console.log('Legal acceptance columns already exist, skipping migration');
      return true;
    }

    // Add new columns to the users table - use explicit public schema
    await db.execute(sql`
      ALTER TABLE public.users
      ADD COLUMN IF NOT EXISTS has_accepted_legal_terms BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS legal_terms_accepted_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS terms_of_use_accepted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS privacy_policy_accepted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS disclaimer_accepted BOOLEAN DEFAULT FALSE;
    `);

    console.log('Added legal acceptance columns to users table');

    // Create the legal_signatures table if it doesn't exist - use explicit public schema
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.legal_signatures (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        wallet_address TEXT NOT NULL,
        document_type TEXT NOT NULL,
        version TEXT NOT NULL,
        signature_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT,
        location_data JSONB,
        device_info JSONB,
        blockchain_signature TEXT,
        referral_source TEXT,
        additional_data JSONB
      );
    `);

    console.log('Created legal_signatures table');
    return true;

  } catch (error) {
    console.error('Error in legal acceptance columns migration:', error);
    return false;
  }
}

/**
 * Run database migration
 */
export async function runMigration() {
  try {
    console.log('Starting database migration...');

    // CRITICAL: Set search_path first before any queries
    // This is required for Neon serverless which doesn't honor pool.on('connect')
    console.log('Setting search_path to public schema...');
    try {
      await pool.query('SET search_path TO public');
      console.log('search_path set via pool.query');
    } catch (e) {
      console.log('pool.query failed, trying db.execute...');
      await db.execute(sql`SET search_path TO public`);
    }
    console.log('search_path set successfully');

    // Create users table if it doesn't exist - use explicit public schema
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL UNIQUE,
        theme TEXT DEFAULT 'system',
        default_network TEXT DEFAULT 'polygon',
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create custom pools table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.custom_pools (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL UNIQUE,
        fee_tier INTEGER NOT NULL,
        token0_address TEXT NOT NULL,
        token0_symbol TEXT NOT NULL,
        token0_name TEXT NOT NULL,
        token0_decimals INTEGER NOT NULL,
        token1_address TEXT NOT NULL,
        token1_symbol TEXT NOT NULL,
        token1_name TEXT NOT NULL,
        token1_decimals INTEGER NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        network_id INTEGER NOT NULL,
        network_name TEXT NOT NULL,
        created_by TEXT NOT NULL
      );
    `);

    // Add network column to custom_pools if needed (after table exists)
    await addNetworkColumnMigration();

    // Create timeframe adjustments table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.timeframe_adjustments (
        id SERIAL PRIMARY KEY,
        timeframe INTEGER NOT NULL UNIQUE,
        adjustment_percentage DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by TEXT
      );
    `);

    // Create position preferences table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.position_preferences (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        default_slippage DECIMAL(5, 2) DEFAULT 0.5,
        auto_compound BOOLEAN DEFAULT FALSE,
        price_range_width INTEGER DEFAULT 20,
        default_timeframe INTEGER DEFAULT 30,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create position history table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.position_history (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        token_id TEXT,
        pool_address TEXT NOT NULL,
        pool_name TEXT NOT NULL,
        token0 TEXT NOT NULL,
        token1 TEXT NOT NULL,
        token0_decimals INTEGER NOT NULL,
        token1_decimals INTEGER NOT NULL,
        token0_amount TEXT NOT NULL,
        token1_amount TEXT NOT NULL,
        liquidity_added TEXT,
        tx_hash TEXT,
        deposited_usdc DECIMAL(12, 2) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        timeframe INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        apr DECIMAL(10, 2) NOT NULL,
        fees_earned DECIMAL(12, 2) DEFAULT 0,
        lower_price DECIMAL(16, 8),
        upper_price DECIMAL(16, 8),
        in_range BOOLEAN DEFAULT TRUE,
        data JSONB,
        nft_token_id TEXT,
        network TEXT DEFAULT 'ethereum',
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        range_width TEXT,
        impermanent_loss_risk TEXT,
        fees_collected DECIMAL(12, 2) DEFAULT 0,
        total_fees_collected DECIMAL(12, 2) DEFAULT 0
      );
    `);

    // Create real positions table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.real_positions (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        virtual_position_id TEXT NOT NULL,
        pool_address TEXT NOT NULL,
        pool_name TEXT NOT NULL,
        token0 TEXT NOT NULL,
        token1 TEXT NOT NULL,
        token0_amount TEXT NOT NULL,
        token1_amount TEXT NOT NULL,
        token_id TEXT,
        tx_hash TEXT,
        network TEXT NOT NULL DEFAULT 'ethereum',
        status TEXT NOT NULL DEFAULT 'Pending',
        block_explorer_url TEXT,
        liquidity_value TEXT,
        fees_earned TEXT,
        in_range BOOLEAN DEFAULT TRUE,
        additional_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Table migration completed. Initializing data...');

    // Create default admin if it doesn't exist
    const adminAddress = "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F";

    // Create default admin
    console.log('Creating default administrator...');
    try {
      await db.execute(sql`
        INSERT INTO public.users (wallet_address, is_admin)
        VALUES (${adminAddress}, TRUE)
        ON CONFLICT (wallet_address)
        DO UPDATE SET is_admin = TRUE;
      `);
    } catch (error) {
      console.error('Error creating administrator:', error);
    }

    // Create default pools
    try {
      // ETH-DAI pool (0.05%)
      await db.execute(sql`
        INSERT INTO public.custom_pools (
          name, address, fee_tier,
          token0_address, token0_symbol, token0_name, token0_decimals,
          token1_address, token1_symbol, token1_name, token1_decimals,
          active, network_id, network_name, created_by
        ) VALUES (
          'ETH-DAI', '0x60594a405d53811d3bc4766596efd80fd545a270', 500,
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 'ETH', 'Ethereum', 18,
          '0x6B175474E89094C44Da98b954EedeAC495271d0F', 'DAI', 'Dai Stablecoin', 18,
          TRUE, 1, 'Ethereum', 'system'
        )
        ON CONFLICT (address) DO NOTHING;
      `);

      // USDT-ETH pool (0.30%)
      await db.execute(sql`
        INSERT INTO public.custom_pools (
          name, address, fee_tier,
          token0_address, token0_symbol, token0_name, token0_decimals,
          token1_address, token1_symbol, token1_name, token1_decimals,
          active, network_id, network_name, created_by
        ) VALUES (
          'USDT-ETH', '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36', 3000,
          '0xdAC17F958D2ee523a2206206994597C13D831ec7', 'USDT', 'Tether USD', 6,
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 'ETH', 'Ethereum', 18,
          TRUE, 1, 'Ethereum', 'system'
        )
        ON CONFLICT (address) DO NOTHING;
      `);
    } catch (error) {
      console.error('Error creating pools:', error);
    }
    
    // Initialize default timeframe data
    await initializeTimeframeAdjustments();
    
    // Add legal acceptance columns to users table
    await addLegalAcceptanceColumnsMigration();
    
    // Create invoices table
    await addInvoicesTableMigration();
    
    // Add billing_profile_id column to invoices table
    const { addBillingProfileIdColumnMigration } = await import('./add-billing-profile-id-migration');
    await addBillingProfileIdColumnMigration();
    
    // Migrar tabla app_config para versiones de la aplicación
    const { migrateAppConfigTable } = await import('./app-config-migration');
    await migrateAppConfigTable();
    
    // Migrar tablas de referidos
    const { addReferralTablesMigration, addReferralSubscribersTableMigration } = await import('./referral-migration');
    await addReferralTablesMigration();
    
    // Migrar tabla de suscriptores de referidos
    await addReferralSubscribersTableMigration();
    
    // Migrar tabla de NFTs administrados
    const { runManagedNftsMigration } = await import('./migrations/managed-nfts-migration');
    await runManagedNftsMigration(pool);
    
    // Migrar tabla de leads
    const { runLeadsMigration } = await import('./migrations/leads-migration');
    await runLeadsMigration(pool);
    
    // Migrar tabla de landing_videos
    const { migrateLandingVideosTable } = await import('./migrations/landing-videos-migration');
    await migrateLandingVideosTable();
    
    // Añadir columnas para fee collection status
    const { addFeeCollectionStatusMigration } = await import('./migrations/add-fee-collection-status');
    await addFeeCollectionStatusMigration();
    
    console.log('Migration process completed successfully');
    return true;
  } catch (error) {
    console.error('Error during migration:', error);
    return false;
  }
}