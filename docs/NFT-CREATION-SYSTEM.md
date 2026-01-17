# Sistema de Creación de NFT - WayPool

## Resumen

Este documento describe el flujo de creación de NFTs de posiciones de liquidez en Uniswap V3 a través del contrato `WayPoolPositionCreator` en la red Polygon.

## Contrato Desplegado

| Campo | Valor |
|-------|-------|
| **Red** | Polygon Mainnet (Chain ID: 137) |
| **Contrato** | `WayPoolPositionCreator` |
| **Dirección** | `0xf81938F926714f114D07b68dfc3b0E3bC501167B` |
| **Position Manager** | `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` |
| **Deployer** | `0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F` |
| **PolygonScan** | [Ver contrato](https://polygonscan.com/address/0xf81938F926714f114D07b68dfc3b0E3bC501167B) |

## Tokens Configurados

| Token | Dirección | Decimales |
|-------|-----------|-----------|
| USDC (Native) | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` | 6 |
| WETH | `0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619` | 18 |

## Flujos de Creación

### 1. Wallets Externos (MetaMask, Coinbase Wallet, etc.)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Admin Panel    │────▶│  Position DB    │────▶│   Frontend      │
│  Activa posición│     │  nftCreation    │     │   Banner NFT    │
│  Pending→Active │     │  Pending=true   │     │   aparece       │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  managed_nfts   │◀────│  Smart Contract │◀────│  Usuario firma  │
│  NFT registrado │     │  Crea posición  │     │  con su wallet  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Pasos:**
1. Admin cambia estado de posición de `Pending` a `Active` en `/admin?tab=positions`
2. Sistema marca la posición con `nftCreationPending: true`
3. Cuando el usuario conecta su wallet, aparece un **banner** en el dashboard
4. Usuario hace clic en "Activar posiciones"
5. Usuario **firma la transacción** con su wallet externo
6. Usuario **paga el gas** en MATIC (~0.1-0.2 MATIC)
7. NFT se crea y se registra en `managed_nfts`

### 2. Wallets Custodiales (WayPool Internos)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Admin Panel    │────▶│  Backend detecta│────▶│  Deployer wallet│
│  Activa posición│     │  wallet custodial│    │  firma y paga   │
│  Pending→Active │     │                 │     │  gas            │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  managed_nfts   │◀────│  NFT transferido│◀────│  Smart Contract │
│  NFT registrado │     │  al usuario     │     │  Crea posición  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Pasos:**
1. Admin cambia estado de posición de `Pending` a `Active`
2. Sistema detecta que es un wallet custodial (`custodialWalletService.isWalletCustodial()`)
3. **Backend crea NFT automáticamente**:
   - Usa la wallet del deployer para firmar la transacción
   - Deployer paga gas (MATIC) + tokens mínimos (1 wei USDC/WETH)
   - Crea la posición en el contrato `WayPoolPositionCreator`
   - Transfiere el NFT al wallet custodial del usuario
4. NFT se registra en `managed_nfts`
5. **Usuario no necesita hacer nada** - el NFT aparece automáticamente

## Requisitos del Deployer

Para que el sistema funcione con wallets custodiales, la wallet del deployer necesita:

| Recurso | Cantidad Mínima | Uso |
|---------|-----------------|-----|
| MATIC | ~0.1-0.2 por posición | Gas para transacciones |
| USDC | 1 wei (0.000001 USDC) | Liquidez mínima requerida |
| WETH | 1 wei | Liquidez mínima requerida |

> **Nota:** Los tokens se aprueban una vez con allowance infinito. Luego solo se gastan las cantidades mínimas por cada posición.

## Archivos Clave

| Archivo | Descripción |
|---------|-------------|
| `server/nft-pool-creation-service.ts` | Servicio principal de creación de NFT |
| `server/routes.ts` | Rutas API para NFT creation |
| `client/src/hooks/use-nft-pool-creation.ts` | Hook React para el frontend |
| `client/src/components/nft-pool-creation-banner.tsx` | Banner UI para activar NFTs |
| `contracts/WayPoolPositionCreator.sol` | Smart contract en Polygon |
| `deployments/polygon-mainnet.json` | Info del deployment |

## API Endpoints

### GET `/api/nft-creation/config`
Retorna la configuración del contrato.

```json
{
  "success": true,
  "contractAddress": "0xf81938F926714f114D07b68dfc3b0E3bC501167B",
  "positionManagerAddress": "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  "tokens": {
    "USDC": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    "WETH": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
  },
  "defaultTickRange": {
    "tickLower": -887220,
    "tickUpper": 887220
  },
  "network": "polygon",
  "chainId": 137
}
```

### GET `/api/nft-creation/pending/:walletAddress`
Retorna las posiciones pendientes de creación de NFT para un wallet.

```json
{
  "success": true,
  "pendingCreations": [
    {
      "positionId": 123,
      "walletAddress": "0x...",
      "valueUsdc": "1000.00",
      "tickLower": -887220,
      "tickUpper": 887220
    }
  ]
}
```

### POST `/api/nft-creation/register`
Registra un NFT creado en el sistema.

```json
{
  "positionId": 123,
  "tokenId": "12345",
  "transactionHash": "0x...",
  "walletAddress": "0x...",
  "valueUsdc": "1000.00"
}
```

### POST `/api/nft-creation/failed`
Marca una creación de NFT como fallida.

```json
{
  "positionId": 123,
  "error": "User rejected transaction"
}
```

## Variables de Entorno

```bash
# Polygon Network Configuration
POLYGON_RPC_URL="https://polygon-rpc.com"
DEPLOYER_PRIVATE_KEY="your-deployer-private-key"
```

## Campos de Base de Datos

La tabla `position_history` incluye estos campos para tracking de NFT:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nft_creation_pending` | boolean | Si está pendiente de crear NFT |
| `nft_creation_status` | text | Estado: `none`, `pending`, `creating`, `completed`, `failed` |
| `nft_token_id` | text | ID del NFT en Uniswap V3 |
| `nft_created_at` | timestamp | Fecha de creación del NFT |
| `nft_transaction_hash` | text | Hash de la transacción de creación |
| `nft_creation_error` | text | Mensaje de error si falló |
| `nft_creation_attempts` | integer | Número de intentos |

## Troubleshooting

### El banner no aparece
- Verificar que la posición tiene `status = 'Active'` y `nftCreationPending = true`
- Verificar que el wallet está conectado correctamente
- Revisar logs del servidor para errores en `/api/nft-creation/pending`

### Error "Insufficient MATIC for gas"
- El deployer wallet necesita más MATIC
- Enviar MATIC a `0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F`

### Error "Insufficient token balance"
- El deployer necesita al menos 1 wei de USDC y WETH
- Estos tokens solo se necesitan la primera vez (luego se reutilizan)

### NFT creado pero no aparece en managed_nfts
- Revisar logs del servidor para errores en `registerCreatedNFT`
- Verificar conexión a la base de datos

---

# Sistema de Distribución de Rendimientos - WayPool

## Resumen

Este sistema permite al SuperAdmin distribuir rendimientos generados en plataformas de trading externas a todas las posiciones activas de WayPool de forma proporcional.

## Flujo de Distribución

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  SuperAdmin     │────▶│  Preview        │────▶│  Confirmación   │
│  Ingresa USDC   │     │  Cálculo        │     │  y Ejecución    │
│  generados      │     │  proporcional   │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Historial      │◀────│  Actualiza      │◀────│  Distribución   │
│  Registrado     │     │  fees_earned    │     │  por posición   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Fórmula de Distribución

### Distribución Base (proporcional al capital)

```
Distribución = (Capital Posición / Capital Total) × Monto Total
```

**Ejemplo:**
- Monto a distribuir: 10,000 USDC
- 3 posiciones activas de 100,000 USDC cada una
- Capital total: 300,000 USDC
- Cada posición recibe: (100,000 / 300,000) × 10,000 = **3,333.33 USDC**

### Bonus por APR (opcional)

Si está habilitado, se aplica un multiplicador basado en el APR de la posición:

| APR | Multiplicador |
|-----|---------------|
| 0-10% | 1.00x |
| 10-20% | 1.02x |
| 20-30% | 1.05x |
| 30%+ | 1.10x |

## Acceso

**Solo accesible por SuperAdmin** en:
- Panel Admin → Tab "Rendimientos"
- URL directa: `/admin?tab=yield-distribution`

## Características

### 1. Vista Previa
- Muestra cálculo detallado antes de ejecutar
- Lista todas las posiciones con sus montos calculados
- Muestra porcentaje de distribución por posición

### 2. Ejecución
- Confirma antes de procesar
- Actualiza automáticamente `fees_earned` de cada posición
- Genera código único de distribución (YD-2026-01-001)

### 3. Historial
- Registro completo de todas las distribuciones
- Detalles por posición
- Estado de cada acreditación

### 4. Estadísticas
- Total distribuido históricamente
- Promedio por distribución
- Top posiciones por rendimiento recibido

## API Endpoints (SuperAdmin only)

### GET `/api/superadmin/yield-distribution/positions`
Obtiene posiciones activas elegibles.

### POST `/api/superadmin/yield-distribution/preview`
Calcula vista previa de distribución.

```json
{
  "totalAmount": 10000,
  "includeAprBonus": false
}
```

### POST `/api/superadmin/yield-distribution/execute`
Ejecuta la distribución.

```json
{
  "totalAmount": 10000,
  "includeAprBonus": false,
  "source": "external_trading",
  "brokerName": "Interactive Brokers",
  "notes": "Rendimientos Q1 2026"
}
```

### GET `/api/superadmin/yield-distribution/history`
Historial de distribuciones con paginación.

### GET `/api/superadmin/yield-distribution/:id`
Detalles de una distribución específica.

### GET `/api/superadmin/yield-distribution/stats`
Estadísticas globales de rendimientos.

## Tablas de Base de Datos

### `yield_distributions`
Registro principal de cada distribución.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `distribution_code` | text | Código único (YD-YYYY-MM-NNN) |
| `total_amount` | decimal | Total USDC a distribuir |
| `distributed_amount` | decimal | Total efectivamente distribuido |
| `source` | text | Fuente del rendimiento |
| `broker_name` | text | Nombre del broker/plataforma |
| `total_active_positions` | integer | Posiciones que reciben |
| `total_active_capital` | decimal | Capital total activo |
| `status` | text | pending/processing/completed/failed |
| `created_by` | text | Wallet del SuperAdmin |

### `yield_distribution_details`
Detalle por posición de cada distribución.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `distribution_id` | integer | FK a yield_distributions |
| `position_id` | integer | FK a position_history |
| `position_capital` | decimal | Capital al momento de distribución |
| `position_apr` | decimal | APR de la posición |
| `base_distribution` | decimal | Distribución base |
| `apr_bonus` | decimal | Bonus por APR |
| `total_distribution` | decimal | Total recibido |
| `status` | text | pending/credited/failed |

### `position_yield_history`
Acumulado de rendimientos por posición.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `position_id` | integer | FK a position_history |
| `total_yield_received` | decimal | Total acumulado |
| `total_distributions` | integer | Número de distribuciones |
| `last_distribution_amount` | decimal | Última cantidad recibida |

## Archivos del Sistema

| Archivo | Descripción |
|---------|-------------|
| `server/yield-distribution-service.ts` | Servicio principal |
| `server/routes.ts` | Rutas API (sección SuperAdmin) |
| `client/src/components/admin/yield-distribution-manager.tsx` | UI del panel |
| `shared/schema.ts` | Definición de tablas |

## Notas de Seguridad

- Solo accesible con wallet de SuperAdmin
- Requiere confirmación antes de ejecutar
- Mantiene auditoría completa de todas las operaciones
- No se puede deshacer una distribución ejecutada
