# WayBank v6.0 - Sistema Paralelo de Gestión de Liquidez

## IMPORTANTE

Este sistema es **completamente independiente** del sistema existente. **NO modifica ningún archivo existente**.

- ✅ Compatible con NFTs creados por `WayPoolPositionCreator.sol`
- ✅ Coexiste con el sistema actual sin conflictos
- ✅ Usa tablas de base de datos separadas (prefijo `v6_`)
- ✅ Usa rutas API separadas (prefijo `/api/v6/`)

## Estructura de Archivos

```
contracts/waybank-v6/          # Contratos nuevos (NO toca WayPoolPositionCreator.sol)
├── WayBankVault.sol           # Vault principal para gestión
├── PoolAnalyzer.sol           # Análisis de pools y APR
└── SwapExecutor.sol           # Ejecución de swaps

server/waybank-v6/             # Servicios backend nuevos
├── index.ts                   # Punto de entrada
├── v6-config.ts               # Configuración
├── v6-position-manager.ts     # Gestión de posiciones
├── v6-apr-service.ts          # Servicio de APR
├── v6-nft-manager.ts          # Gestión de NFTs
└── v6-routes.ts               # Rutas API

shared/
├── schema.ts                  # NO TOCADO - Schema existente
└── waybank-v6-schema.ts       # NUEVO - Schema para v6
```

## Integración (Sin Modificar Archivos Existentes)

Para activar el sistema v6, añade estas líneas en un **nuevo archivo** o en la sección de inicialización:

```typescript
// En un nuevo archivo, ej: server/v6-init.ts
import { initializeV6System } from './waybank-v6';
import { db } from '../db'; // Tu instancia de base de datos

export function setupV6(app: Express) {
  const v6 = initializeV6System(db);
  app.use('/api/v6', v6.router);
  console.log('WayBank v6.0 activado');
}
```

## API Endpoints

### Registro de Posiciones

```bash
# Registrar un NFT existente para gestión v6
POST /api/v6/positions/register
{
  "tokenId": "123456",
  "ownerAddress": "0x...",
  "enableAutoRebalance": true
}

# Desregistrar
POST /api/v6/positions/unregister
{
  "tokenId": "123456",
  "ownerAddress": "0x..."
}
```

### Consultas de Posiciones

```bash
# Obtener posiciones de un owner
GET /api/v6/positions/0x...

# Obtener posición con estado
GET /api/v6/position/123456

# Obtener estado en tiempo real
GET /api/v6/position/123456/status
```

### APR y Pools

```bash
# Top pools por APR
GET /api/v6/apr/top-pools?limit=10

# Pools USDC/WETH
GET /api/v6/apr/usdc-weth

# APR de un pool específico
GET /api/v6/apr/pool/0x...
```

### Blockchain Directo

```bash
# Leer NFT directamente del blockchain (funciona con cualquier NFT)
GET /api/v6/blockchain/position/123456

# Verificar si necesita rebalanceo
GET /api/v6/blockchain/position/123456/needs-rebalance
```

## Tablas de Base de Datos (Separadas)

- `v6_managed_positions` - Posiciones registradas para gestión
- `v6_fee_collections` - Historial de colección de fees
- `v6_rebalance_history` - Historial de rebalanceos
- `v6_pool_analytics` - Análisis de pools
- `v6_vault_config` - Configuración del vault
- `v6_pending_operations` - Operaciones pendientes
- `v6_vault_stats` - Estadísticas

## Migraciones

Ejecutar para crear las tablas v6:

```bash
npx drizzle-kit generate:pg --schema=./shared/waybank-v6-schema.ts
npx drizzle-kit push:pg
```

## Flujo de Uso

1. Usuario crea NFT con sistema actual (`WayPoolPositionCreator`)
2. Usuario registra NFT en v6 para gestión automatizada
3. v6 monitorea la posición y puede:
   - Colectar fees automáticamente
   - Detectar cuando está fuera de rango
   - Ejecutar rebalanceos (si está habilitado)

## Notas de Seguridad

- Los contratos v6 requieren aprobación del NFT para operar
- El usuario mantiene propiedad del NFT en todo momento
- El sistema v6 solo tiene permisos de lectura por defecto
- Las operaciones de escritura requieren firma del usuario
