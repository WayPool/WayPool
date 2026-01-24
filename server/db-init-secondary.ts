/**
 * Initialize Secondary Database (CockroachDB)
 * Creates all required tables and performs initial data sync
 */

import { Pool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Table definitions for CockroachDB (PostgreSQL compatible)
const TABLE_DEFINITIONS = [
  // Users table
  `CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL UNIQUE,
    theme TEXT DEFAULT 'system',
    default_network TEXT DEFAULT 'polygon',
    is_admin BOOLEAN DEFAULT FALSE,
    email TEXT,
    has_accepted_legal_terms BOOLEAN DEFAULT FALSE,
    legal_terms_accepted_at TIMESTAMP,
    terms_of_use_accepted BOOLEAN DEFAULT FALSE,
    privacy_policy_accepted BOOLEAN DEFAULT FALSE,
    disclaimer_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Custom pools table
  `CREATE TABLE IF NOT EXISTS public.custom_pools (
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
    network_id INTEGER NOT NULL,
    network_name TEXT NOT NULL,
    network TEXT DEFAULT 'ethereum',
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Timeframe adjustments
  `CREATE TABLE IF NOT EXISTS public.timeframe_adjustments (
    id SERIAL PRIMARY KEY,
    timeframe INTEGER NOT NULL UNIQUE,
    adjustment_percentage DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT
  )`,

  // Position preferences
  `CREATE TABLE IF NOT EXISTS public.position_preferences (
    id SERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    default_slippage DECIMAL(5, 2) DEFAULT 0.5,
    auto_compound BOOLEAN DEFAULT FALSE,
    price_range_width INTEGER DEFAULT 20,
    default_timeframe INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Position history
  `CREATE TABLE IF NOT EXISTS public.position_history (
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
    total_fees_collected DECIMAL(12, 2) DEFAULT 0,
    fee_collection_status TEXT DEFAULT 'Pending',
    last_collection_date TIMESTAMP,
    current_apr DECIMAL(10, 2)
  )`,

  // Real positions
  `CREATE TABLE IF NOT EXISTS public.real_positions (
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
  )`,

  // Invoices
  `CREATE TABLE IF NOT EXISTS public.invoices (
    id SERIAL PRIMARY KEY,
    invoice_number TEXT NOT NULL UNIQUE,
    wallet_address TEXT NOT NULL,
    position_id INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
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
    billing_profile_id INTEGER,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Billing profiles
  `CREATE TABLE IF NOT EXISTS public.billing_profiles (
    id SERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    profile_name TEXT NOT NULL,
    company_name TEXT,
    tax_id TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    email TEXT,
    phone TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Legal signatures
  `CREATE TABLE IF NOT EXISTS public.legal_signatures (
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
  )`,

  // App config
  `CREATE TABLE IF NOT EXISTS public.app_config (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Referrals
  `CREATE TABLE IF NOT EXISTS public.referrals (
    id SERIAL PRIMARY KEY,
    referral_code TEXT NOT NULL UNIQUE,
    wallet_address TEXT NOT NULL,
    total_rewards DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Referred users
  `CREATE TABLE IF NOT EXISTS public.referred_users (
    id SERIAL PRIMARY KEY,
    referral_id INTEGER NOT NULL,
    referred_wallet_address TEXT NOT NULL UNIQUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'active',
    earned_rewards DECIMAL(12, 2) DEFAULT 0,
    apr_boost DECIMAL(5, 2) DEFAULT 1.00
  )`,

  // Referral subscribers
  `CREATE TABLE IF NOT EXISTS public.referral_subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    language TEXT NOT NULL DEFAULT 'es',
    name TEXT,
    referral_code TEXT,
    active BOOLEAN DEFAULT TRUE,
    last_email_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Managed NFTs
  `CREATE TABLE IF NOT EXISTS public.managed_nfts (
    id SERIAL PRIMARY KEY,
    network TEXT NOT NULL,
    version TEXT NOT NULL,
    token_id TEXT NOT NULL,
    contract_address TEXT,
    token0_symbol TEXT DEFAULT 'Unknown',
    token1_symbol TEXT DEFAULT 'Unknown',
    value_usdc DECIMAL(12, 2),
    status TEXT DEFAULT 'Active',
    fee_tier TEXT,
    pool_address TEXT,
    image_url TEXT,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT
  )`,

  // Leads
  `CREATE TABLE IF NOT EXISTS public.leads (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    investment_size TEXT NOT NULL,
    message TEXT,
    consent_given BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'nuevo',
    assigned_to TEXT,
    notes TEXT,
    source TEXT DEFAULT 'landing_page',
    follow_up_date TIMESTAMP,
    last_contact TIMESTAMP,
    language_preference TEXT DEFAULT 'es',
    original_referrer TEXT,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Landing videos
  `CREATE TABLE IF NOT EXISTS public.landing_videos (
    id SERIAL PRIMARY KEY,
    language TEXT NOT NULL,
    main_video_url TEXT NOT NULL,
    full_video_url TEXT,
    video_type TEXT DEFAULT 'video/mp4',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT
  )`
];

async function initializeSecondaryDatabase() {
  console.log('='.repeat(60));
  console.log('WayBank Secondary Database Initialization');
  console.log('='.repeat(60));

  // Check for secondary database URL
  const secondaryUrl = process.env.DATABASE_URL_SECONDARY;
  if (!secondaryUrl) {
    console.error('ERROR: DATABASE_URL_SECONDARY environment variable not set');
    console.log('\nPlease set the CockroachDB connection string:');
    console.log('export DATABASE_URL_SECONDARY="postgresql://user:pass@host:26257/db?sslmode=verify-full"');
    process.exit(1);
  }

  // Connect to secondary database
  console.log('\n[1/4] Connecting to CockroachDB...');
  const secondaryPool = new Pool({
    connectionString: secondaryUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await secondaryPool.query('SELECT 1');
    console.log('      ✅ Connected to CockroachDB');
  } catch (error) {
    console.error('      ❌ Failed to connect to CockroachDB:', error);
    process.exit(1);
  }

  // Create tables
  console.log('\n[2/4] Creating tables...');
  for (const tableDef of TABLE_DEFINITIONS) {
    const tableNameMatch = tableDef.match(/CREATE TABLE IF NOT EXISTS public\.(\w+)/);
    const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown';

    try {
      await secondaryPool.query(tableDef);
      console.log(`      ✅ ${tableName}`);
    } catch (error: any) {
      console.error(`      ❌ ${tableName}: ${error.message}`);
    }
  }

  // Connect to primary database for sync
  console.log('\n[3/4] Connecting to primary database (Neon)...');
  let primaryUrl = process.env.DATABASE_URL ||
    'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require';

  if (primaryUrl.includes('-pooler')) {
    primaryUrl = primaryUrl.replace('-pooler', '');
  }

  const primaryPool = new NeonPool({ connectionString: primaryUrl });

  try {
    await primaryPool.query('SELECT 1');
    console.log('      ✅ Connected to Neon');
  } catch (error) {
    console.error('      ❌ Failed to connect to Neon:', error);
    console.log('      Skipping initial sync...');
    await secondaryPool.end();
    process.exit(0);
  }

  // Perform initial sync
  console.log('\n[4/4] Performing initial sync...');

  const tablesToSync = [
    'users',
    'custom_pools',
    'timeframe_adjustments',
    'position_history',
    'real_positions',
    'invoices',
    'app_config',
    'referrals',
    'referred_users',
    'referral_subscribers',
    'managed_nfts',
    'leads',
    'landing_videos'
  ];

  let totalSynced = 0;

  for (const table of tablesToSync) {
    try {
      // Get records from primary
      const result = await primaryPool.query(`SELECT * FROM public.${table}`);

      if (result.rows.length === 0) {
        console.log(`      ⏭️  ${table}: 0 records (empty)`);
        continue;
      }

      // Get column names
      const columns = Object.keys(result.rows[0]);
      const columnList = columns.join(', ');
      const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(', ');

      // Sync each record
      let synced = 0;
      for (const row of result.rows) {
        try {
          const values = columns.map(col => row[col]);

          await secondaryPool.query(
            `INSERT INTO public.${table} (${columnList})
             VALUES (${valuePlaceholders})
             ON CONFLICT (id) DO UPDATE SET
             ${columns.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(', ')}`,
            values
          );
          synced++;
        } catch (rowError: any) {
          // Skip duplicate key errors, log others
          if (!rowError.message.includes('duplicate key')) {
            console.error(`      Error syncing row in ${table}:`, rowError.message);
          }
        }
      }

      console.log(`      ✅ ${table}: ${synced}/${result.rows.length} records synced`);
      totalSynced += synced;
    } catch (error: any) {
      console.error(`      ❌ ${table}: ${error.message}`);
    }
  }

  // Cleanup
  await primaryPool.end();
  await secondaryPool.end();

  console.log('\n' + '='.repeat(60));
  console.log(`Initialization complete! Total records synced: ${totalSynced}`);
  console.log('='.repeat(60));
  console.log('\nNext steps:');
  console.log('1. Verify data in CockroachDB dashboard');
  console.log('2. Enable redundancy in .env: DATABASE_URL_SECONDARY=<your_url>');
  console.log('3. Restart the application');
}

// Run if called directly
initializeSecondaryDatabase().catch(console.error);

export { initializeSecondaryDatabase };
