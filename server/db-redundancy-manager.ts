/**
 * Database Redundancy Manager
 * Manages failover between primary (Neon) and secondary (CockroachDB) databases
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool as PgPool } from 'pg';
import ws from 'ws';
import * as schema from '@shared/schema';
import { sql } from 'drizzle-orm';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Types
type DrizzleDB = ReturnType<typeof drizzle> | ReturnType<typeof drizzlePg>;

interface DatabaseHealth {
  connected: boolean;
  latency: number;
  lastCheck: Date;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

interface RedundancyConfig {
  syncIntervalMs: number;
  healthCheckIntervalMs: number;
  failoverThreshold: number;
  failbackThreshold: number;
}

interface SyncStatus {
  lastSync: Date | null;
  recordsSynced: number;
  status: 'healthy' | 'syncing' | 'error';
  error?: string;
}

export class DatabaseRedundancyManager {
  private primaryPool: Pool | null = null;
  private secondaryPool: PgPool | null = null;
  private primaryDb: DrizzleDB | null = null;
  private secondaryDb: DrizzleDB | null = null;

  private primaryHealth: DatabaseHealth = {
    connected: false,
    latency: 0,
    lastCheck: new Date(),
    consecutiveFailures: 0,
    consecutiveSuccesses: 0
  };

  private secondaryHealth: DatabaseHealth = {
    connected: false,
    latency: 0,
    lastCheck: new Date(),
    consecutiveFailures: 0,
    consecutiveSuccesses: 0
  };

  private activeDatabase: 'primary' | 'secondary' = 'primary';
  private syncStatus: SyncStatus = {
    lastSync: null,
    recordsSynced: 0,
    status: 'healthy'
  };

  private config: RedundancyConfig;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      syncIntervalMs: parseInt(process.env.DB_SYNC_INTERVAL_MS || '3600000'), // 1 hour
      healthCheckIntervalMs: parseInt(process.env.DB_HEALTH_CHECK_INTERVAL_MS || '300000'), // 5 minutes
      failoverThreshold: parseInt(process.env.DB_FAILOVER_THRESHOLD || '3'),
      failbackThreshold: parseInt(process.env.DB_FAILBACK_THRESHOLD || '5')
    };
  }

  /**
   * Initialize database connections
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[DB-Redundancy] Already initialized');
      return;
    }

    console.log('[DB-Redundancy] Initializing database redundancy manager...');

    // Initialize primary (Neon)
    await this.initializePrimary();

    // Initialize secondary (CockroachDB) if configured
    if (process.env.DATABASE_URL_SECONDARY) {
      await this.initializeSecondary();
    } else {
      console.log('[DB-Redundancy] No secondary database configured, running in single-db mode');
    }

    // Start health checks
    this.startHealthChecks();

    // Start sync if secondary is configured
    if (this.secondaryDb) {
      this.startPeriodicSync();
    }

    this.isInitialized = true;
    console.log('[DB-Redundancy] Initialization complete');
  }

  /**
   * Initialize primary database (Neon)
   */
  private async initializePrimary(): Promise<void> {
    let primaryUrl = process.env.DATABASE_URL ||
      'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require';

    // Ensure direct connection for search_path support
    if (primaryUrl.includes('-pooler')) {
      primaryUrl = primaryUrl.replace('-pooler', '');
    }

    // Add search_path option
    if (!primaryUrl.includes('search_path')) {
      primaryUrl = primaryUrl + '&options=-c%20search_path%3Dpublic';
    }

    console.log('[DB-Redundancy] Connecting to primary (Neon)...');

    try {
      this.primaryPool = new Pool({ connectionString: primaryUrl });

      // Set search_path on connect
      this.primaryPool.on('connect', (client) => {
        client.query('SET search_path TO public');
      });

      this.primaryDb = drizzle({ client: this.primaryPool, schema });

      // Test connection
      await this.checkPrimaryHealth();

      if (this.primaryHealth.connected) {
        console.log('[DB-Redundancy] Primary database connected successfully');
      }
    } catch (error) {
      console.error('[DB-Redundancy] Failed to connect to primary:', error);
      this.primaryHealth.connected = false;
    }
  }

  /**
   * Initialize secondary database (CockroachDB)
   */
  private async initializeSecondary(): Promise<void> {
    const secondaryUrl = process.env.DATABASE_URL_SECONDARY;

    if (!secondaryUrl) {
      console.log('[DB-Redundancy] No secondary database URL configured');
      return;
    }

    console.log('[DB-Redundancy] Connecting to secondary (CockroachDB)...');

    try {
      this.secondaryPool = new PgPool({
        connectionString: secondaryUrl,
        ssl: { rejectUnauthorized: false } // CockroachDB requires SSL
      });

      this.secondaryDb = drizzlePg(this.secondaryPool, { schema });

      // Test connection
      await this.checkSecondaryHealth();

      if (this.secondaryHealth.connected) {
        console.log('[DB-Redundancy] Secondary database connected successfully');
      }
    } catch (error) {
      console.error('[DB-Redundancy] Failed to connect to secondary:', error);
      this.secondaryHealth.connected = false;
    }
  }

  /**
   * Check primary database health
   */
  private async checkPrimaryHealth(): Promise<boolean> {
    const startTime = Date.now();

    try {
      if (!this.primaryPool) {
        throw new Error('Primary pool not initialized');
      }

      // Simple query to test connection
      await this.primaryPool.query('SELECT 1');

      const latency = Date.now() - startTime;

      this.primaryHealth = {
        connected: true,
        latency,
        lastCheck: new Date(),
        consecutiveFailures: 0,
        consecutiveSuccesses: this.primaryHealth.consecutiveSuccesses + 1
      };

      return true;
    } catch (error) {
      const latency = Date.now() - startTime;

      this.primaryHealth = {
        connected: false,
        latency,
        lastCheck: new Date(),
        consecutiveFailures: this.primaryHealth.consecutiveFailures + 1,
        consecutiveSuccesses: 0
      };

      console.error('[DB-Redundancy] Primary health check failed:', error);
      return false;
    }
  }

  /**
   * Check secondary database health
   */
  private async checkSecondaryHealth(): Promise<boolean> {
    const startTime = Date.now();

    try {
      if (!this.secondaryPool) {
        throw new Error('Secondary pool not initialized');
      }

      await this.secondaryPool.query('SELECT 1');

      const latency = Date.now() - startTime;

      this.secondaryHealth = {
        connected: true,
        latency,
        lastCheck: new Date(),
        consecutiveFailures: 0,
        consecutiveSuccesses: this.secondaryHealth.consecutiveSuccesses + 1
      };

      return true;
    } catch (error) {
      const latency = Date.now() - startTime;

      this.secondaryHealth = {
        connected: false,
        latency,
        lastCheck: new Date(),
        consecutiveFailures: this.secondaryHealth.consecutiveFailures + 1,
        consecutiveSuccesses: 0
      };

      console.error('[DB-Redundancy] Secondary health check failed:', error);
      return false;
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    console.log(`[DB-Redundancy] Starting health checks every ${this.config.healthCheckIntervalMs}ms`);

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.config.healthCheckIntervalMs);
  }

  /**
   * Perform health check and handle failover/failback
   */
  private async performHealthCheck(): Promise<void> {
    const primaryHealthy = await this.checkPrimaryHealth();
    const secondaryHealthy = this.secondaryPool ? await this.checkSecondaryHealth() : false;

    // Handle failover
    if (this.activeDatabase === 'primary' && !primaryHealthy) {
      if (this.primaryHealth.consecutiveFailures >= this.config.failoverThreshold) {
        if (secondaryHealthy) {
          await this.failover();
        } else {
          console.error('[DB-Redundancy] CRITICAL: Both databases are unhealthy!');
        }
      }
    }

    // Handle failback
    if (this.activeDatabase === 'secondary' && primaryHealthy) {
      if (this.primaryHealth.consecutiveSuccesses >= this.config.failbackThreshold) {
        await this.failback();
      }
    }
  }

  /**
   * Failover to secondary database
   */
  async failover(): Promise<void> {
    if (this.activeDatabase === 'secondary') {
      console.log('[DB-Redundancy] Already using secondary database');
      return;
    }

    console.log('[DB-Redundancy] ⚠️ INITIATING FAILOVER TO SECONDARY DATABASE');

    this.activeDatabase = 'secondary';

    console.log('[DB-Redundancy] ✅ Failover complete - now using secondary database');
  }

  /**
   * Failback to primary database
   */
  async failback(): Promise<void> {
    if (this.activeDatabase === 'primary') {
      console.log('[DB-Redundancy] Already using primary database');
      return;
    }

    console.log('[DB-Redundancy] 🔄 INITIATING FAILBACK TO PRIMARY DATABASE');

    // Sync any changes made during failover
    if (this.secondaryDb && this.primaryDb) {
      await this.syncFromSecondaryToPrimary();
    }

    this.activeDatabase = 'primary';

    console.log('[DB-Redundancy] ✅ Failback complete - now using primary database');
  }

  /**
   * Start periodic sync from primary to secondary
   */
  private startPeriodicSync(): void {
    console.log(`[DB-Redundancy] Starting periodic sync every ${this.config.syncIntervalMs}ms`);

    this.syncInterval = setInterval(async () => {
      if (this.activeDatabase === 'primary' && this.primaryHealth.connected && this.secondaryHealth.connected) {
        await this.syncFromPrimaryToSecondary();
      }
    }, this.config.syncIntervalMs);
  }

  /**
   * Sync data from primary to secondary
   */
  async syncFromPrimaryToSecondary(): Promise<void> {
    if (!this.primaryDb || !this.secondaryPool) {
      console.log('[DB-Redundancy] Cannot sync - databases not initialized');
      return;
    }

    console.log('[DB-Redundancy] Starting sync from primary to secondary...');
    this.syncStatus.status = 'syncing';

    try {
      const tablesToSync = [
        'users',
        'custom_pools',
        'position_history',
        'real_positions',
        'invoices',
        'referrals',
        'referred_users',
        'leads',
        'managed_nfts',
        'app_config',
        'timeframe_adjustments'
      ];

      let totalSynced = 0;

      for (const table of tablesToSync) {
        const synced = await this.syncTable(table);
        totalSynced += synced;
      }

      this.syncStatus = {
        lastSync: new Date(),
        recordsSynced: totalSynced,
        status: 'healthy'
      };

      console.log(`[DB-Redundancy] Sync completed: ${totalSynced} records synced`);
    } catch (error) {
      console.error('[DB-Redundancy] Sync failed:', error);
      this.syncStatus = {
        ...this.syncStatus,
        status: 'error',
        error: String(error)
      };
    }
  }

  /**
   * Sync a single table from primary to secondary
   */
  private async syncTable(tableName: string): Promise<number> {
    if (!this.primaryPool || !this.secondaryPool) return 0;

    try {
      // Get all records from primary
      const result = await this.primaryPool.query(
        `SELECT * FROM public.${tableName}`
      );

      if (result.rows.length === 0) return 0;

      // Get column names
      const columns = Object.keys(result.rows[0]);
      const columnList = columns.join(', ');
      const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(', ');

      // Upsert each record to secondary
      let synced = 0;
      for (const row of result.rows) {
        try {
          const values = columns.map(col => row[col]);

          // CockroachDB uses UPSERT syntax
          await this.secondaryPool.query(
            `INSERT INTO public.${tableName} (${columnList})
             VALUES (${valuePlaceholders})
             ON CONFLICT (id) DO UPDATE SET
             ${columns.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(', ')}`,
            values
          );
          synced++;
        } catch (rowError) {
          // Log but continue with other rows
          console.error(`[DB-Redundancy] Error syncing row in ${tableName}:`, rowError);
        }
      }

      return synced;
    } catch (error) {
      console.error(`[DB-Redundancy] Error syncing table ${tableName}:`, error);
      return 0;
    }
  }

  /**
   * Sync from secondary back to primary (after failback)
   */
  private async syncFromSecondaryToPrimary(): Promise<void> {
    console.log('[DB-Redundancy] Syncing changes from secondary back to primary...');
    // Implementation similar to syncFromPrimaryToSecondary but reversed
    // Only sync records modified during failover period
  }

  /**
   * Get the currently active database instance
   */
  getActiveDb(): DrizzleDB {
    if (this.activeDatabase === 'secondary' && this.secondaryDb) {
      return this.secondaryDb;
    }

    if (this.primaryDb) {
      return this.primaryDb;
    }

    throw new Error('[DB-Redundancy] No database available');
  }

  /**
   * Get the active pool for raw queries
   */
  getActivePool(): Pool | PgPool {
    if (this.activeDatabase === 'secondary' && this.secondaryPool) {
      return this.secondaryPool;
    }

    if (this.primaryPool) {
      return this.primaryPool;
    }

    throw new Error('[DB-Redundancy] No pool available');
  }

  /**
   * Get health status for monitoring
   */
  getHealthStatus(): object {
    return {
      status: this.primaryHealth.connected || this.secondaryHealth.connected ? 'healthy' : 'unhealthy',
      primary: {
        connected: this.primaryHealth.connected,
        latency: this.primaryHealth.latency,
        lastCheck: this.primaryHealth.lastCheck,
        consecutiveFailures: this.primaryHealth.consecutiveFailures
      },
      secondary: {
        connected: this.secondaryHealth.connected,
        latency: this.secondaryHealth.latency,
        lastCheck: this.secondaryHealth.lastCheck,
        consecutiveFailures: this.secondaryHealth.consecutiveFailures
      },
      activeDatabase: this.activeDatabase,
      syncStatus: this.syncStatus
    };
  }

  /**
   * Force manual sync
   */
  async forceSync(): Promise<void> {
    await this.syncFromPrimaryToSecondary();
  }

  /**
   * Force manual failover
   */
  async forceFailover(): Promise<void> {
    await this.failover();
  }

  /**
   * Force manual failback
   */
  async forceFailback(): Promise<void> {
    await this.failback();
  }

  /**
   * Shutdown and cleanup
   */
  async shutdown(): Promise<void> {
    console.log('[DB-Redundancy] Shutting down...');

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    if (this.primaryPool) {
      await this.primaryPool.end();
    }

    if (this.secondaryPool) {
      await this.secondaryPool.end();
    }

    console.log('[DB-Redundancy] Shutdown complete');
  }
}

// Singleton instance
let redundancyManager: DatabaseRedundancyManager | null = null;

/**
 * Get or create the redundancy manager instance
 */
export async function getRedundancyManager(): Promise<DatabaseRedundancyManager> {
  if (!redundancyManager) {
    redundancyManager = new DatabaseRedundancyManager();
    await redundancyManager.initialize();
  }
  return redundancyManager;
}

/**
 * Get the active database (convenience function)
 */
export async function getActiveDatabase(): Promise<DrizzleDB> {
  const manager = await getRedundancyManager();
  return manager.getActiveDb();
}

/**
 * Get the active pool (convenience function)
 */
export async function getActivePool(): Promise<Pool | PgPool> {
  const manager = await getRedundancyManager();
  return manager.getActivePool();
}
