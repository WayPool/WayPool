# WBC Token System - Documentación Completa

## Resumen

WayBank Coin (WBC) es un token ERC-20 desplegado en Polygon Mainnet que funciona como sistema de garantía para las posiciones de liquidez en WayPool. Los usuarios reciben WBC cuando cobran intereses diarios y deben devolverlos cuando cierran sus posiciones.

---

## Enlaces Importantes

### PolygonScan
| Recurso | Enlace |
|---------|--------|
| **Contrato WBC** | [0xf79e7330eF4DA9C567B8811845Ce9b0B75064456](https://polygonscan.com/address/0xf79e7330eF4DA9C567B8811845Ce9b0B75064456) |
| **Código Verificado** | [Ver Código Fuente](https://polygonscan.com/address/0xf79e7330eF4DA9C567B8811845Ce9b0B75064456#code) |
| **Token Tracker** | [WayBank Coin (WBC)](https://polygonscan.com/token/0xf79e7330eF4DA9C567B8811845Ce9b0B75064456) |
| **TX Despliegue** | [0x345e36795a50296ab43895363e932616e031617c9393f43f3ad1f6e364d70ca7](https://polygonscan.com/tx/0x345e36795a50296ab43895363e932616e031617c9393f43f3ad1f6e364d70ca7) |
| **TX Mint Inicial** | [0x2dc91eb294e725e052b68ba1ee8d3c4ad83a408b6e00c290ae7a8f0870851a23](https://polygonscan.com/tx/0x2dc91eb294e725e052b68ba1ee8d3c4ad83a408b6e00c290ae7a8f0870851a23) |

### Wallet Owner
| Recurso | Enlace |
|---------|--------|
| **Wallet Owner** | [0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F](https://polygonscan.com/address/0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F) |

---

## Especificaciones del Token

| Parámetro | Valor |
|-----------|-------|
| **Nombre** | WayBank Coin |
| **Símbolo** | WBC |
| **Decimales** | 6 (igual que USDC) |
| **Red** | Polygon Mainnet |
| **Chain ID** | 137 |
| **Estándar** | ERC-20 (con restricciones) |
| **Supply Inicial** | 3,000,000 WBC |
| **Supply Máximo** | Ilimitado (minteable por owner) |

---

## Arquitectura del Sistema

### Flujo de Tokens

```
┌─────────────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA WBC                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. COBRO DE INTERESES DIARIOS                                  │
│     ┌──────────┐    mint()    ┌──────────┐                      │
│     │  Owner   │ ──────────►  │  Usuario │                      │
│     │  Wallet  │              │  Wallet  │                      │
│     └──────────┘              └──────────┘                      │
│         WBC ────────────────────► WBC                           │
│     (Supply Pool)           (Balance Usuario)                   │
│                                                                 │
│  2. CIERRE DE POSICIÓN                                          │
│     ┌──────────┐  transfer()  ┌──────────┐                      │
│     │  Usuario │ ──────────►  │  Owner   │                      │
│     │  Wallet  │              │  Wallet  │                      │
│     └──────────┘              └──────────┘                      │
│         WBC ────────────────────► WBC                           │
│     (Devuelve WBC)          (Recupera WBC)                      │
│                                                                 │
│  3. AUTO-RENOVACIÓN (si no tiene WBC suficiente)                │
│     ┌──────────┐              ┌──────────┐                      │
│     │  Usuario │    ✖         │ Posición │                      │
│     │ sin WBC  │ ──────────►  │ Renovada │                      │
│     └──────────┘              └──────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Restricciones del Contrato

El contrato WBC tiene restricciones especiales que lo diferencian de un ERC-20 estándar:

1. **Transferencias Restringidas**: Solo se permiten transferencias entre el owner y usuarios
   - Owner → Usuario: Permitido (mint/send)
   - Usuario → Owner: Permitido (return/burn)
   - Usuario → Usuario: **BLOQUEADO**

2. **Sin Approvals**: La función `approve()` está deshabilitada
3. **Sin TransferFrom**: La función `transferFrom()` está deshabilitada

Esto garantiza que los tokens WBC no puedan ser vendidos o transferidos a terceros.

---

## Integración con WayPool

### Archivos Principales

| Archivo | Descripción |
|---------|-------------|
| `contracts/WBCToken.sol` | Smart contract Solidity |
| `server/wbc-token-service.ts` | Servicio backend para interactuar con el contrato |
| `server/daily-apr-distribution-service.ts` | Integración con distribución diaria de APR |
| `server/routes.ts` | Endpoints API para WBC |
| `server/migrations/wbc-token-migration.ts` | Migración de base de datos |

### Tablas de Base de Datos

#### `wbc_config`
Almacena la configuración del sistema WBC.

```sql
CREATE TABLE wbc_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Valores configurados:
| Key | Value |
|-----|-------|
| contract_address | 0xf79e7330eF4DA9C567B8811845Ce9b0B75064456 |
| owner_wallet | 0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F |
| network | polygon |
| chain_id | 137 |
| decimals | 6 |
| initial_supply | 3000000 |
| deploy_tx_hash | 0x345e36795a50296ab43895363e932616e031617c9393f43f3ad1f6e364d70ca7 |
| deploy_date | 2026-01-24T21:09:40.000Z |
| is_active | true |

#### `wbc_transactions`
Registra todas las transacciones de WBC.

```sql
CREATE TABLE wbc_transactions (
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
);
```

#### Campos WBC en `position_history`
```sql
ALTER TABLE position_history ADD COLUMN
  wbc_minted_amount VARCHAR(50),
  wbc_minted_at TIMESTAMP,
  wbc_mint_tx_hash VARCHAR(100),
  wbc_returned_amount VARCHAR(50),
  wbc_returned_at TIMESTAMP,
  wbc_return_tx_hash VARCHAR(100),
  auto_renewed BOOLEAN DEFAULT FALSE,
  auto_renewed_at TIMESTAMP,
  auto_renew_reason VARCHAR(255);
```

---

## Panel de Administracion

Accede al historial completo de transacciones WBC desde el panel de administracion:

**URL:** `/admin/wbc-transactions`

### Funcionalidades:
- Vista de todas las transacciones WBC (envios y devoluciones)
- Filtros por tipo (activacion, fee diario, cobro, cierre), estado y wallet
- Estadisticas en tiempo real (total enviado, devuelto, neto)
- Enlaces directos a PolygonScan para cada transaccion
- Copia rapida de direcciones y hashes
- Paginacion y ordenacion

### Acceso:
1. Ir a `/admin` con un wallet administrador conectado
2. Clic en el boton "WBC Token" (color morado) en la barra de navegacion
3. O acceder directamente a `/admin/wbc-transactions`

---

## API Endpoints

### GET `/api/admin/wbc/transactions`
Obtiene el historial de transacciones WBC con filtros y paginacion (requiere admin).

**Query Parameters:**
- `page`: Numero de pagina (default: 1)
- `limit`: Registros por pagina (default: 50)
- `type`: Tipo de transaccion (activation, daily_fee, fee_collection, position_close)
- `status`: Estado (confirmed, pending, failed)
- `walletAddress`: Filtrar por wallet

**Response:**
```json
{
  "transactions": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### GET `/api/admin/wbc/stats`
Obtiene estadisticas del sistema WBC (requiere admin).

**Response:**
```json
{
  "config": {
    "contractAddress": "0x...",
    "isActive": true
  },
  "stats": {
    "totalTransactions": 100,
    "totalSent": 5000.00,
    "totalReturned": 1000.00,
    "netDistributed": 4000.00
  }
}
```

### GET `/api/wbc/balance/:address`
Obtiene el balance WBC de una dirección.

**Response:**
```json
{
  "address": "0x...",
  "balance": "1234.567890",
  "balanceRaw": "1234567890"
}
```

### GET `/api/wbc/validate/:positionId`
Valida si un usuario puede cerrar una posición.

**Response:**
```json
{
  "canCollect": true,
  "canClose": true,
  "balance": 1234.56,
  "required": 1000.00,
  "wbcActive": true
}
```

### GET `/api/wbc/config`
Obtiene la configuración del sistema WBC.

**Response:**
```json
{
  "contractAddress": "0xf79e7330eF4DA9C567B8811845Ce9b0B75064456",
  "ownerWallet": "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F",
  "network": "polygon",
  "chainId": "137",
  "decimals": "6",
  "isActive": true
}
```

---

## Métodos del Servicio WBC

### `sendTokensOnDailyFees(positionId, userWallet, amount)`
Envía WBC al usuario cuando cobra intereses diarios.

### `validatePositionClose(positionId, userWallet, totalFeesEarned)`
Valida si el usuario tiene suficiente WBC para cerrar una posición.

### `collectWBCOnClose(positionId, userWallet, amount)`
Recoge los WBC del usuario cuando cierra una posición.

### `getBalance(address)`
Obtiene el balance WBC de una dirección.

### `isActive()`
Verifica si el sistema WBC está activo.

### `isReady()`
Verifica si el servicio está completamente inicializado.

---

## Casos de Uso

### 1. Usuario Cobra Intereses Diarios

```
Distribución APR Diaria
         │
         ▼
┌─────────────────────────┐
│ dailyYield > 0?         │
└──────────┬──────────────┘
           │ Sí
           ▼
┌─────────────────────────┐
│ wbcService.sendTokens   │
│ OnDailyFees()           │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Owner wallet envía WBC  │
│ al usuario              │
└─────────────────────────┘
```

### 2. Usuario Cierra Posición

```
Usuario solicita cerrar
         │
         ▼
┌─────────────────────────┐
│ validatePositionClose() │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ ¿Tiene suficiente WBC?  │
└──────────┬──────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
   [Sí]        [No]
     │           │
     ▼           ▼
┌─────────┐  ┌─────────────┐
│ Cerrar  │  │ Auto-Renovar│
│ Posición│  │ Posición    │
└─────────┘  └─────────────┘
```

### 3. Auto-Renovación

Cuando un usuario intenta cerrar una posición pero no tiene suficiente WBC:

1. El sistema detecta balance insuficiente
2. La posición se auto-renueva por el mismo período
3. Se registra el motivo: "Insufficient WBC balance"
4. El usuario sigue acumulando intereses
5. Se le notifica de la renovación automática

---

## Seguridad

### Claves Privadas
- La clave privada del deployer está almacenada en `.env`
- **NUNCA** compartir o exponer esta clave
- Se usa la misma wallet que para los NFTs de Uniswap

### Permisos del Contrato
- Solo el owner puede mintear nuevos tokens
- Solo el owner puede pausar/despausar el contrato
- Las funciones críticas requieren `onlyOwner`

### Redundancia de Datos
El sistema WBC está configurado en ambas bases de datos:
- **Neon (Primary)**: Base de datos principal
- **CockroachDB (Secondary)**: Backup de redundancia

---

## Comandos Útiles

### Verificar Balance On-Chain
```bash
npx hardhat run scripts/check-wbc-balance.cjs --network polygon
```

### Verificar Contrato en PolygonScan
```bash
npx hardhat verify --network polygon 0xf79e7330eF4DA9C567B8811845Ce9b0B75064456
```

### Consultar Configuración en DB
```sql
SELECT * FROM wbc_config;
```

### Consultar Transacciones WBC
```sql
SELECT * FROM wbc_transactions ORDER BY created_at DESC LIMIT 10;
```

---

## Troubleshooting

### El servicio WBC no está listo (isReady: false)
**Causa**: La variable de entorno `DEPLOYER_PRIVATE_KEY` no está configurada.
**Solución**: Asegurar que `.env` contiene la clave privada con prefijo `0x`.

### Transferencia fallida
**Causa posible**: Gas insuficiente en la wallet owner.
**Solución**: Asegurar que la wallet owner tiene MATIC suficiente para gas.

### Balance WBC incorrecto
**Causa posible**: La transacción aún no está confirmada.
**Solución**: Esperar confirmaciones o verificar en PolygonScan.

---

## Historial de Despliegue

| Fecha | Evento | TX Hash |
|-------|--------|---------|
| 2026-01-24 | Despliegue contrato | [0x345e3679...](https://polygonscan.com/tx/0x345e36795a50296ab43895363e932616e031617c9393f43f3ad1f6e364d70ca7) |
| 2026-01-24 | Mint inicial 3M WBC | [0x2dc91eb2...](https://polygonscan.com/tx/0x2dc91eb294e725e052b68ba1ee8d3c4ad83a408b6e00c290ae7a8f0870851a23) |
| 2026-01-24 | Verificación código | [Ver código](https://polygonscan.com/address/0xf79e7330eF4DA9C567B8811845Ce9b0B75064456#code) |

---

## Contacto y Soporte

Para problemas técnicos con el sistema WBC, revisar:
1. Logs del servidor (`[WBC]` prefix)
2. Transacciones en PolygonScan
3. Configuración en base de datos (`wbc_config`)
4. Balance de MATIC en wallet owner

---

*Documentación actualizada: 2026-01-24*
*Versión del sistema: WayPool v6 + WBC Token v1.0*
