/**
 * Database Backup Script
 * Exports all data from both Neon and CockroachDB databases
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import ws from 'ws';
import fs from 'fs';
import path from 'path';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

const BACKUP_DIR = process.argv[2] || '/Users/lorenzoballantimoran/Documents/BACKUPS/waybank_latest';

const TABLES_TO_BACKUP = [
  'users',
  'custom_pools',
  'timeframe_adjustments',
  'position_preferences',
  'position_history',
  'real_positions',
  'invoices',
  'billing_profiles',
  'legal_signatures',
  'app_config',
  'referrals',
  'referred_users',
  'referral_subscribers',
  'managed_nfts',
  'leads',
  'landing_videos'
];

async function backupDatabase(connectionString: string, dbName: string): Promise<object> {
  console.log(`\n[Backup] Starting backup of ${dbName}...`);

  const isNeon = dbName === 'neon';
  let pool: Pool | PgPool;

  if (isNeon) {
    let url = connectionString;
    if (url.includes('-pooler')) {
      url = url.replace('-pooler', '');
    }
    pool = new Pool({ connectionString: url });
  } else {
    pool = new PgPool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }

  const backup: Record<string, any[]> = {};
  let totalRecords = 0;

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log(`[Backup] Connected to ${dbName}`);

    for (const table of TABLES_TO_BACKUP) {
      try {
        const result = await pool.query(`SELECT * FROM public.${table}`);
        backup[table] = result.rows;
        totalRecords += result.rows.length;
        console.log(`  ✅ ${table}: ${result.rows.length} records`);
      } catch (error: any) {
        if (error.message.includes('does not exist')) {
          console.log(`  ⏭️  ${table}: table does not exist`);
          backup[table] = [];
        } else {
          console.error(`  ❌ ${table}: ${error.message}`);
          backup[table] = [];
        }
      }
    }

    console.log(`[Backup] ${dbName} completed: ${totalRecords} total records`);
  } finally {
    await pool.end();
  }

  return {
    database: dbName,
    timestamp: new Date().toISOString(),
    totalRecords,
    tables: backup
  };
}

async function main() {
  console.log('='.repeat(60));
  console.log('WayBank Database Backup');
  console.log('='.repeat(60));
  console.log(`Backup directory: ${BACKUP_DIR}`);

  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const neonUrl = process.env.DATABASE_URL ||
    'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require';

  const cockroachUrl = process.env.DATABASE_URL_SECONDARY ||
    'postgresql://lorenzo:AfSURSZLAWd7zTS-9XimwA@maxed-serpent-12009.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full';

  // Backup Neon (Primary)
  try {
    const neonBackup = await backupDatabase(neonUrl, 'neon');
    const neonPath = path.join(BACKUP_DIR, 'neon_backup.json');
    fs.writeFileSync(neonPath, JSON.stringify(neonBackup, null, 2));
    console.log(`\n✅ Neon backup saved to: ${neonPath}`);
  } catch (error) {
    console.error('\n❌ Neon backup failed:', error);
  }

  // Backup CockroachDB (Secondary)
  try {
    const cockroachBackup = await backupDatabase(cockroachUrl, 'cockroachdb');
    const cockroachPath = path.join(BACKUP_DIR, 'cockroachdb_backup.json');
    fs.writeFileSync(cockroachPath, JSON.stringify(cockroachBackup, null, 2));
    console.log(`✅ CockroachDB backup saved to: ${cockroachPath}`);
  } catch (error) {
    console.error('\n❌ CockroachDB backup failed:', error);
  }

  // Create combined backup info
  const backupInfo = {
    timestamp: new Date().toISOString(),
    version: '1.1.3',
    backupDir: BACKUP_DIR,
    databases: ['neon', 'cockroachdb']
  };

  fs.writeFileSync(
    path.join(BACKUP_DIR, 'backup_info.json'),
    JSON.stringify(backupInfo, null, 2)
  );

  console.log('\n' + '='.repeat(60));
  console.log('Backup completed successfully!');
  console.log('='.repeat(60));
}

main().catch(console.error);
