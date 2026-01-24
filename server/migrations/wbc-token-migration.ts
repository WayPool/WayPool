/**
 * WBC Token Migration
 * Adds WBC tracking fields to position_history and creates wbc_transactions table
 */

import { pool } from '../db';

export async function wbcTokenMigration() {
  console.log('[Migration] Starting WBC Token migration...');

  try {
    // ============ Add WBC fields to position_history ============

    // Check if wbc_minted_amount column already exists
    const checkColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'position_history'
      AND column_name = 'wbc_minted_amount'
    `);

    if (checkColumn.rows.length === 0) {
      console.log('[Migration] Adding WBC fields to position_history...');

      await pool.query(`
        ALTER TABLE public.position_history
        ADD COLUMN IF NOT EXISTS wbc_minted_amount VARCHAR(50),
        ADD COLUMN IF NOT EXISTS wbc_minted_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS wbc_mint_tx_hash VARCHAR(100),
        ADD COLUMN IF NOT EXISTS wbc_returned_amount VARCHAR(50),
        ADD COLUMN IF NOT EXISTS wbc_returned_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS wbc_return_tx_hash VARCHAR(100),
        ADD COLUMN IF NOT EXISTS auto_renewed BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS auto_renewed_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS auto_renew_reason VARCHAR(50)
      `);

      console.log('[Migration] WBC fields added to position_history');
    } else {
      console.log('[Migration] WBC fields already exist in position_history');
    }

    // ============ Create wbc_transactions table ============

    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'wbc_transactions'
      )
    `);

    if (!checkTable.rows[0].exists) {
      console.log('[Migration] Creating wbc_transactions table...');

      await pool.query(`
        CREATE TABLE public.wbc_transactions (
          id SERIAL PRIMARY KEY,
          tx_hash VARCHAR(100) NOT NULL UNIQUE,
          from_address VARCHAR(50) NOT NULL,
          to_address VARCHAR(50) NOT NULL,
          amount VARCHAR(50) NOT NULL,
          position_id INTEGER,
          transaction_type VARCHAR(30) NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          block_number INTEGER,
          gas_used VARCHAR(30),
          error_message TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          confirmed_at TIMESTAMP
        )
      `);

      // Create indexes
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_wbc_tx_position ON public.wbc_transactions(position_id);
        CREATE INDEX IF NOT EXISTS idx_wbc_tx_type ON public.wbc_transactions(transaction_type);
        CREATE INDEX IF NOT EXISTS idx_wbc_tx_from ON public.wbc_transactions(from_address);
        CREATE INDEX IF NOT EXISTS idx_wbc_tx_to ON public.wbc_transactions(to_address);
        CREATE INDEX IF NOT EXISTS idx_wbc_tx_status ON public.wbc_transactions(status);
      `);

      console.log('[Migration] wbc_transactions table created');
    } else {
      console.log('[Migration] wbc_transactions table already exists');
    }

    // ============ Create wbc_config table ============

    const checkConfigTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'wbc_config'
      )
    `);

    if (!checkConfigTable.rows[0].exists) {
      console.log('[Migration] Creating wbc_config table...');

      await pool.query(`
        CREATE TABLE public.wbc_config (
          id SERIAL PRIMARY KEY,
          key VARCHAR(50) NOT NULL UNIQUE,
          value TEXT NOT NULL,
          description TEXT,
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Insert default config values
      await pool.query(`
        INSERT INTO public.wbc_config (key, value, description)
        VALUES
          ('contract_address', '', 'WBC Token contract address on Polygon'),
          ('owner_wallet', '', 'Owner wallet address that holds WBC supply'),
          ('network', 'polygon', 'Network where WBC is deployed'),
          ('chain_id', '137', 'Chain ID (137 = Polygon Mainnet)'),
          ('decimals', '6', 'Token decimals (same as USDC)'),
          ('initial_supply', '0', 'Initial WBC supply minted'),
          ('deploy_tx_hash', '', 'Contract deployment transaction hash'),
          ('deploy_date', '', 'Contract deployment date'),
          ('is_active', 'false', 'Whether WBC system is active')
        ON CONFLICT (key) DO NOTHING
      `);

      console.log('[Migration] wbc_config table created with default values');
    } else {
      console.log('[Migration] wbc_config table already exists');
    }

    // ============ Create indexes on position_history ============

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_position_history_wbc_mint
      ON public.position_history(wbc_mint_tx_hash);

      CREATE INDEX IF NOT EXISTS idx_position_history_auto_renewed
      ON public.position_history(auto_renewed);
    `);

    console.log('[Migration] WBC Token migration completed successfully');
    return true;

  } catch (error) {
    console.error('[Migration] WBC Token migration failed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  wbcTokenMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
