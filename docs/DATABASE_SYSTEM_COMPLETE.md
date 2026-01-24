# WayBank/WayPool - Sistema Completo de Bases de Datos

## Resumen del Sistema

El sistema utiliza un esquema de redundancia activo-pasivo con failover automático entre dos proveedores de base de datos PostgreSQL:

| Rol | Proveedor | Región | Estado |
|-----|-----------|--------|--------|
| **Primaria** | Neon Serverless PostgreSQL | Azure (Europa) | Activa |
| **Secundaria** | CockroachDB Serverless | GCP Europe West 1 | Standby |

---

## Base de Datos Primaria: Neon

### Información General

| Campo | Valor |
|-------|-------|
| **Proveedor** | Neon Serverless PostgreSQL |
| **Dashboard** | https://console.neon.tech/ |
| **Proyecto** | neondb |
| **Endpoint** | ep-jolly-butterfly-a9adjssi |
| **Región** | Azure (gwc.azure.neon.tech) |
| **Plan** | Free Tier |

### Credenciales

```
Usuario: neondb_owner
Password: npg_AGK3v2utzVxf
Database: neondb
```

### Connection Strings

**Pooler (para conexiones frecuentes):**
```
postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require
```

**Direct (para operaciones DDL y search_path):**
```
postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require
```

### Límites del Free Tier

| Recurso | Límite |
|---------|--------|
| Almacenamiento | 3 GB |
| Compute Hours | 100 horas/mes |
| Branches | 10 |
| Conexiones (pooler) | 100 |

### Acceso al Dashboard

1. Ir a https://console.neon.tech/
2. Login con cuenta de Google/GitHub
3. Seleccionar proyecto "neondb"

---

## Base de Datos Secundaria: CockroachDB

### Información General

| Campo | Valor |
|-------|-------|
| **Proveedor** | CockroachDB Serverless |
| **Dashboard** | https://cockroachlabs.cloud/ |
| **Cluster** | maxed-serpent-12009 |
| **ID del Cluster** | 38caa522-e820-4fdb-be1d-0e0e5f7ac594 |
| **Región** | GCP Europe West 1 |
| **Plan** | Free Tier (Serverless) |

### Credenciales

```
Usuario: lorenzo
Password: AfSURSZLAWd7zTS-9XimwA
Database: defaultdb
```

### Connection String

```
postgresql://lorenzo:AfSURSZLAWd7zTS-9XimwA@maxed-serpent-12009.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
```

### Certificado SSL

Para conexiones que requieren certificado:
```bash
curl --create-dirs -o $HOME/.postgresql/root.crt 'https://cockroachlabs.cloud/clusters/38caa522-e820-4fdb-be1d-0e0e5f7ac594/cert'
```

### Límites del Free Tier

| Recurso | Límite |
|---------|--------|
| Almacenamiento | 10 GB |
| Request Units | 50 millones RU/mes |
| Burst | 10K RU/s |

### Acceso al Dashboard

1. Ir a https://cockroachlabs.cloud/
2. Login con cuenta registrada
3. Seleccionar cluster "maxed-serpent-12009"

---

## Configuración de Redundancia

### Variables de Entorno

Archivo: `.env.production`

```env
# Base de datos primaria (Neon)
DATABASE_URL="postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require"

# Base de datos secundaria (CockroachDB)
DATABASE_URL_SECONDARY="postgresql://lorenzo:AfSURSZLAWd7zTS-9XimwA@maxed-serpent-12009.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"

# Configuración de redundancia
DB_SYNC_INTERVAL_MS=3600000          # Sincronización cada 1 hora
DB_HEALTH_CHECK_INTERVAL_MS=300000   # Health check cada 5 minutos
DB_FAILOVER_THRESHOLD=3              # Failover después de 3 fallos
DB_FAILBACK_THRESHOLD=5              # Failback después de 5 éxitos
```

### Configuración en Producción

Archivo: `/var/www/vhosts/waypool.net/WayPool.net/ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [{
    name: 'waypool',
    script: 'dist/index.js',
    cwd: '/var/www/vhosts/waypool.net/WayPool.net',
    env: {
      NODE_ENV: 'production',
      PORT: 5001,
      DATABASE_URL: 'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require',
      DATABASE_URL_SECONDARY: 'postgresql://lorenzo:AfSURSZLAWd7zTS-9XimwA@maxed-serpent-12009.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
      DB_SYNC_INTERVAL_MS: '3600000',
      DB_HEALTH_CHECK_INTERVAL_MS: '300000',
      DB_FAILOVER_THRESHOLD: '3',
      DB_FAILBACK_THRESHOLD: '5',
      // ... otras variables
    }
  }]
};
```

---

## API de Gestión de Redundancia

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/system/health` | Estado general del servidor |
| GET | `/api/system/db-health` | Estado de redundancia de BD |
| POST | `/api/system/db-sync` | Sincronización manual |
| POST | `/api/system/db-failover` | Forzar failover a secundaria |
| POST | `/api/system/db-failback` | Forzar failback a primaria |
| GET | `/api/system/version` | Versión de la aplicación |

### Ejemplos de Uso

#### Verificar estado de salud
```bash
curl https://waypool.net/api/system/db-health
```

**Respuesta:**
```json
{
  "success": true,
  "redundancyEnabled": true,
  "status": "healthy",
  "primary": {
    "connected": true,
    "latency": 209,
    "lastCheck": "2026-01-24T20:34:43.910Z",
    "consecutiveFailures": 0
  },
  "secondary": {
    "connected": true,
    "latency": 341,
    "lastCheck": "2026-01-24T20:34:44.252Z",
    "consecutiveFailures": 0
  },
  "activeDatabase": "primary",
  "syncStatus": {
    "lastSync": null,
    "recordsSynced": 0,
    "status": "healthy"
  }
}
```

#### Forzar sincronización
```bash
curl -X POST https://waypool.net/api/system/db-sync \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "admin"}'
```

#### Forzar failover
```bash
curl -X POST https://waypool.net/api/system/db-failover \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "admin"}'
```

#### Forzar failback
```bash
curl -X POST https://waypool.net/api/system/db-failback \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "admin"}'
```

---

## Scripts de Gestión

### Comandos NPM

```bash
# Inicializar base de datos secundaria (crear tablas y sincronizar)
npm run db:init-secondary

# Sincronizar manualmente
npm run db:sync

# Forzar failover a secundaria
npm run db:failover

# Forzar failback a primaria
npm run db:failback
```

### Ejecución Manual en Servidor

```bash
# Conectar al servidor
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 waypool.net_732ap8wrgob@waypool.net

# En el servidor:
cd /var/www/vhosts/waypool.net/WayPool.net
export PATH=$PATH:/opt/plesk/node/22/bin

# Ver logs
npx pm2 logs waypool --lines 50

# Reiniciar servidor
npx pm2 restart waypool --update-env
```

---

## Tablas Sincronizadas

El sistema sincroniza las siguientes 13 tablas:

| Tabla | Registros | Descripción |
|-------|-----------|-------------|
| `users` | 174 | Usuarios del sistema |
| `custom_pools` | 4 | Pools personalizados |
| `timeframe_adjustments` | 4 | Ajustes de timeframe |
| `position_history` | 144 | Historial de posiciones |
| `real_positions` | 114 | Posiciones reales |
| `invoices` | 42 | Facturas |
| `billing_profiles` | - | Perfiles de facturación |
| `app_config` | 11 | Configuración de app |
| `referrals` | 119 | Sistema de referidos |
| `referred_users` | 126 | Usuarios referidos |
| `referral_subscribers` | 37 | Suscriptores de referidos |
| `managed_nfts` | 7 | NFTs gestionados |
| `leads` | 4 | Leads de ventas |
| `landing_videos` | - | Videos de landing |
| `legal_signatures` | - | Firmas legales |

**Total sincronizado:** ~782 registros

---

## Comportamiento de Failover

### Failover Automático

1. Health check falla en primaria
2. Contador de fallos consecutivos aumenta
3. Al llegar a 3 fallos → **FAILOVER**
4. Sistema cambia a usar secundaria (CockroachDB)
5. Log: `[DB-Redundancy] ⚠️ INITIATING FAILOVER TO SECONDARY DATABASE`

### Failback Automático

1. Health check detecta que primaria está disponible
2. Contador de éxitos consecutivos aumenta
3. Al llegar a 5 éxitos → **FAILBACK**
4. Sistema sincroniza cambios de vuelta
5. Sistema cambia a usar primaria (Neon)
6. Log: `[DB-Redundancy] 🔄 INITIATING FAILBACK TO PRIMARY DATABASE`

---

## Panel de Administración

El estado de las bases de datos se puede monitorear desde:

**URL:** https://waypool.net/superadmin → Base de Datos

### Funciones del Panel

- Ver estado de ambas bases de datos (online/offline)
- Ver latencia de cada base de datos
- Botón "Sincronizar" para sync manual
- Botón "Failover" para cambiar a secundaria
- Botón "Failback" para volver a primaria
- Gráficos de rendimiento histórico

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     WayPool Application                      │
│                     (waypool.net:5001)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DatabaseRedundancyManager                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │  Health Check   │  │   Sync Service   │  │  Failover  │ │
│  │  (cada 5 min)   │  │   (cada 1 hora)  │  │  Handler   │ │
│  └────────┬────────┘  └────────┬─────────┘  └──────┬─────┘ │
└───────────┼────────────────────┼───────────────────┼───────┘
            │                    │                   │
            ▼                    ▼                   ▼
┌───────────────────────┐  ┌───────────────────────────────┐
│   PRIMARY DATABASE    │  │     SECONDARY DATABASE        │
│   ─────────────────   │  │     ──────────────────        │
│   Neon PostgreSQL     │◄─│     CockroachDB               │
│   Azure Europe        │  │     GCP Europe West 1         │
│                       │  │                               │
│   Latencia: ~209ms    │  │     Latencia: ~341ms          │
│   Status: ACTIVE      │  │     Status: STANDBY           │
└───────────────────────┘  └───────────────────────────────┘
```

---

## Solución de Problemas

### Error: "relation does not exist"

**Causa:** Neon serverless requiere `SET search_path TO public` o usar prefijo `public.` en las consultas.

**Solución:** El sistema de redundancia usa conexión directa (sin pooler) y establece search_path automáticamente.

### Error de conexión a CockroachDB

**Verificar:**
1. Certificado SSL descargado
2. Firewall permite puerto 26257
3. Credenciales correctas

```bash
# Test de conexión
psql "postgresql://lorenzo:AfSURSZLAWd7zTS-9XimwA@maxed-serpent-12009.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full" -c "SELECT 1"
```

### Sincronización no funciona

**Verificar logs:**
```bash
npx pm2 logs waypool --lines 100 | grep -i "DB-Redundancy\|sync"
```

### Ambas bases de datos offline

**Procedimiento de emergencia:**
1. Verificar conectividad de red
2. Verificar estado en dashboards de Neon y CockroachDB
3. Contactar soporte si persiste

---

## Contactos de Soporte

| Servicio | Soporte |
|----------|---------|
| Neon | https://neon.tech/docs/introduction/support |
| CockroachDB | https://support.cockroachlabs.com/ |
| WayPool | info@waypool.net |

---

## Historial de Cambios

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2026-01-24 | 1.0.0 | Sistema de redundancia implementado |
| 2026-01-24 | 1.0.0 | 782 registros sincronizados inicialmente |
| 2026-01-24 | 1.0.0 | Intervalos optimizados (sync: 1h, health: 5min) |

---

**Última actualización:** 2026-01-24
**Autor:** Claude Opus 4.5 / Lorenzo Ballanti
