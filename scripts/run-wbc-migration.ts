/**
 * WBC Token Migration Runner
 * Runs migration on both primary (Neon) and secondary (CockroachDB) databases
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

const NEON_URL = 'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require';
const COCKROACH_URL = 'postgresql://lorenzo:AfSURSZLAWd7zTS-9XimwA@maxed-serpent-12009.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full';

async function runMigration(pool: Pool | PgPool, dbName: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[Migration] Starting WBC migration on ${dbName}...`);
  console.log('='.repeat(60));

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log(`[${dbName}] ✅ Connected`);

    // ============ Add WBC fields to position_history ============
    const checkColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'position_history'
      AND column_name = 'wbc_minted_amount'
    `);

    if (checkColumn.rows.length === 0) {
      console.log(`[${dbName}] Adding WBC fields to position_history...`);

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
        ADD COLUMN IF NOT EXISTS auto_renew_reason VARCHAR(255)
      `);

      console.log(`[${dbName}] ✅ WBC fields added to position_history`);
    } else {
      console.log(`[${dbName}] ⏭️ WBC fields already exist in position_history`);
    }

    // ============ Create wbc_transactions table ============
    const checkTxTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'wbc_transactions'
      )
    `);

    if (!checkTxTable.rows[0].exists) {
      console.log(`[${dbName}] Creating wbc_transactions table...`);

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
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_wbc_tx_position ON public.wbc_transactions(position_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_wbc_tx_type ON public.wbc_transactions(transaction_type)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_wbc_tx_from ON public.wbc_transactions(from_address)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_wbc_tx_to ON public.wbc_transactions(to_address)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_wbc_tx_status ON public.wbc_transactions(status)`);

      console.log(`[${dbName}] ✅ wbc_transactions table created`);
    } else {
      console.log(`[${dbName}] ⏭️ wbc_transactions table already exists`);
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
      console.log(`[${dbName}] Creating wbc_config table...`);

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

      console.log(`[${dbName}] ✅ wbc_config table created with default values`);
    } else {
      console.log(`[${dbName}] ⏭️ wbc_config table already exists`);
    }

    // ============ Create indexes on position_history ============
    try {
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_position_history_wbc_mint ON public.position_history(wbc_mint_tx_hash)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_position_history_auto_renewed ON public.position_history(auto_renewed)`);
      console.log(`[${dbName}] ✅ Indexes created`);
    } catch (err) {
      console.log(`[${dbName}] ⏭️ Indexes may already exist`);
    }

    console.log(`[${dbName}] ✅ Migration completed successfully!`);
    return true;

  } catch (error) {
    console.error(`[${dbName}] ❌ Migration failed:`, error);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('WBC TOKEN MIGRATION - DUAL DATABASE');
  console.log('='.repeat(60));

  let neonSuccess = false;
  let cockroachSuccess = false;

  // ============ Migrate Neon (Primary) ============
  try {
    const neonPool = new Pool({ connectionString: NEON_URL });
    neonSuccess = await runMigration(neonPool, 'Neon (Primary)');
    await neonPool.end();
  } catch (error) {
    console.error('[Neon] ❌ Connection failed:', error);
  }

  // ============ Migrate CockroachDB (Secondary) ============
  try {
    const cockroachPool = new PgPool({
      connectionString: COCKROACH_URL,
      ssl: { rejectUnauthorized: false }
    });
    cockroachSuccess = await runMigration(cockroachPool, 'CockroachDB (Secondary)');
    await cockroachPool.end();
  } catch (error) {
    console.error('[CockroachDB] ❌ Connection failed:', error);
  }

  // ============ Summary ============
  console.log('\n' + '='.repeat(60));
  console.log('MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Neon (Primary):      ${neonSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`CockroachDB (Secondary): ${cockroachSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log('='.repeat(60));

  if (neonSuccess && cockroachSuccess) {
    console.log('\n✅ All migrations completed successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some migrations failed. Please check the logs above.');
    process.exit(1);
  }
}

main();
