# WayBank Database Redundancy System

## Architecture Overview

```
                    ┌─────────────────┐
                    │   Application   │
                    │   (WayBank)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  DB Redundancy  │
                    │    Manager      │
                    └───┬─────────┬───┘
                        │         │
         ┌──────────────▼─┐     ┌─▼──────────────┐
         │   PRIMARY      │     │   SECONDARY    │
         │   Neon DB      │────▶│  CockroachDB   │
         │   (Azure)      │sync │  (Serverless)  │
         └────────────────┘     └────────────────┘
```

## Components

### 1. Primary Database (Neon)
- **Provider**: Neon Serverless PostgreSQL
- **Region**: Azure (ep-jolly-butterfly)
- **Role**: Main read/write database

### 2. Secondary Database (CockroachDB)
- **Provider**: CockroachDB Serverless (Free Tier)
- **Storage**: 10GB free
- **Role**: Backup, failover target

### 3. Redundancy Manager
- Manages connections to both databases
- Performs health checks every 30 seconds
- Automatic failover when primary fails
- Automatic failback when primary recovers

### 4. Sync Service
- Periodic sync every 5 minutes
- Incremental sync based on `updated_at` timestamps
- Full sync on demand

---

## Setup Instructions

### Step 1: Create CockroachDB Serverless Cluster

1. Go to https://cockroachlabs.cloud/
2. Sign up for free account
3. Create a new **Serverless** cluster
   - Name: `waybank-backup`
   - Cloud Provider: Any (AWS recommended)
   - Region: Closest to your users
4. Create SQL user:
   - Username: `waybank_user`
   - Password: (save securely)
5. Get connection string:
   - Format: `postgresql://waybank_user:<password>@<host>:26257/defaultdb?sslmode=verify-full`
6. Download CA certificate if required

### Step 2: Configure Environment Variables

Add to `.env.production`:

```env
# Primary Database (Neon)
DATABASE_URL="postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require"

# Secondary Database (CockroachDB)
DATABASE_URL_SECONDARY="postgresql://waybank_user:<password>@<host>:26257/defaultdb?sslmode=verify-full"

# Redundancy Settings
DB_SYNC_INTERVAL_MS=300000          # 5 minutes
DB_HEALTH_CHECK_INTERVAL_MS=30000   # 30 seconds
DB_FAILOVER_THRESHOLD=3             # failures before failover
DB_FAILBACK_THRESHOLD=5             # successes before failback
```

### Step 3: Initialize Secondary Database

Run the initialization script:

```bash
npm run db:init-secondary
```

This will:
1. Create all tables in CockroachDB
2. Perform initial full sync from Neon
3. Verify data integrity

---

## Failover Behavior

### Automatic Failover
1. Health check fails 3 consecutive times
2. System switches to secondary database
3. All reads/writes go to CockroachDB
4. Alert logged (can integrate with monitoring)

### Automatic Failback
1. Primary health check succeeds 5 consecutive times
2. Quick sync of any changes made during failover
3. System switches back to primary
4. Normal operation resumes

### Manual Failover
```bash
# Force failover to secondary
npm run db:failover

# Force failback to primary
npm run db:failback
```

---

## Sync Strategy

### Tables Synced
- `users`
- `custom_pools`
- `position_history`
- `real_positions`
- `invoices`
- `billing_profiles`
- `referrals`
- `referred_users`
- `leads`
- `managed_nfts`
- `app_config`
- `timeframe_adjustments`

### Sync Method
- **Incremental**: Uses `updated_at` column to sync only changed records
- **Upsert**: INSERT ON CONFLICT UPDATE to handle both new and updated records
- **Batch**: Processes 1000 records at a time to avoid memory issues

### Conflict Resolution
- Last-write-wins based on `updated_at` timestamp
- Primary database is always the source of truth during normal operation

---

## Monitoring

### Health Status Endpoint
```
GET /api/system/db-health
```

Response:
```json
{
  "status": "healthy",
  "primary": {
    "connected": true,
    "latency": 45,
    "lastCheck": "2026-01-24T20:00:00Z"
  },
  "secondary": {
    "connected": true,
    "latency": 120,
    "lastCheck": "2026-01-24T20:00:00Z"
  },
  "activeDatabase": "primary",
  "lastSync": "2026-01-24T19:55:00Z",
  "syncStatus": "healthy"
}
```

### Logs
All redundancy events are logged with prefix `[DB-Redundancy]`:
- `[DB-Redundancy] Health check failed for primary`
- `[DB-Redundancy] Initiating failover to secondary`
- `[DB-Redundancy] Sync completed: 150 records updated`

---

## Limitations

### Free Tier Constraints
| Provider | Constraint | Impact |
|----------|------------|--------|
| Neon | 3GB storage, 100 hours compute | Primary may pause if inactive |
| CockroachDB | 10GB storage, 50M RUs/month | Secondary has more storage |

### Sync Delay
- Maximum 5 minutes of data loss in worst case
- Can reduce sync interval but increases load

### CockroachDB Differences
- Some PostgreSQL features may not be supported
- SERIAL columns work differently (use UUID or INT with DEFAULT)
- Some data types may need adaptation

---

## Recovery Procedures

### If Both Databases Fail
1. Check Neon dashboard for issues
2. Check CockroachDB dashboard for issues
3. If data corruption, restore from last backup
4. Contact support if needed

### Manual Data Recovery
```bash
# Export from working database
npm run db:export --source=primary --output=backup.sql

# Import to failed database
npm run db:import --target=secondary --input=backup.sql
```

---

## Cost Estimation

| Component | Free Tier Limit | Estimated Monthly Use |
|-----------|-----------------|----------------------|
| Neon | 3GB, 100 compute hours | ~50 hours |
| CockroachDB | 10GB, 50M RUs | ~10M RUs |
| **Total** | **$0** | **$0** |

Both providers offer generous free tiers that should cover WayBank's current usage.
