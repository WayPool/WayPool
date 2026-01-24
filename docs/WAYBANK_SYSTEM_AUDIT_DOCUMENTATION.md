# WayBank - Documentación Completa del Sistema para Auditoría

**Versión:** 1.0.0
**Fecha:** 24 de Enero de 2026
**Red:** Polygon Mainnet (Chain ID: 137)
**Preparado por:** WayBank Development Team

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Sistema Original - WayPoolPositionCreator](#3-sistema-original---waypoolpositioncreator)
4. [Sistema v6 - Gestión Automatizada](#4-sistema-v6---gestión-automatizada)
5. [Contratos Inteligentes](#5-contratos-inteligentes)
6. [Infraestructura Backend](#6-infraestructura-backend)
7. [Base de Datos](#7-base-de-datos)
8. [Flujos de Usuario](#8-flujos-de-usuario)
9. [Flujos Administrativos](#9-flujos-administrativos)
10. [Seguridad](#10-seguridad)
11. [Direcciones y Hashes](#11-direcciones-y-hashes)
12. [Dependencias Externas](#12-dependencias-externas)
13. [Glosario](#13-glosario)

---

## 1. Resumen Ejecutivo

### 1.1 Descripción General

WayBank es un sistema de gestión de liquidez concentrada para Uniswap V3 en la red Polygon. El sistema permite a los usuarios:

1. **Crear posiciones NFT** de liquidez en pools de Uniswap V3 con capital mínimo
2. **Gestionar automáticamente** esas posiciones para optimizar rendimientos
3. **Recolectar fees** generados por las posiciones
4. **Rebalancear** posiciones cuando salen del rango óptimo

### 1.2 Componentes Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                        WAYBANK SYSTEM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐     ┌─────────────────────────────┐   │
│  │   SISTEMA ORIGINAL  │     │      SISTEMA V6             │   │
│  │   (Creación NFT)    │     │   (Gestión Automatizada)    │   │
│  ├─────────────────────┤     ├─────────────────────────────┤   │
│  │ WayPoolPosition     │────▶│ WayBankVault                │   │
│  │ Creator.sol         │     │ PoolAnalyzer.sol            │   │
│  │                     │     │ SwapExecutor.sol            │   │
│  └─────────────────────┘     └─────────────────────────────┘   │
│           │                              │                      │
│           ▼                              ▼                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              UNISWAP V3 (Polygon)                        │   │
│  │  NonfungiblePositionManager | SwapRouter | Factory       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Principios de Diseño

- **Separación de responsabilidades**: Sistema de creación independiente del sistema de gestión
- **No-custodial**: Los usuarios mantienen la propiedad de sus NFTs en todo momento
- **Transparencia**: Todos los contratos están verificados y son de código abierto
- **Seguridad**: Uso de librerías auditadas (OpenZeppelin) y patrones seguros

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                     │
│                         (React + TypeScript)                              │
└─────────────────────────────────┬────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                      │
│                         (Node.js + Express)                               │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │ API Routes      │  │ NFT Service     │  │ WayBank v6 Services     │   │
│  │ /api/*          │  │ (Existente)     │  │ /api/v6/*               │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘   │
│           │                    │                       │                  │
│           ▼                    ▼                       ▼                  │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │                      PostgreSQL Database                         │     │
│  │  ┌──────────────────┐  ┌────────────────────────────────────┐   │     │
│  │  │ Tablas Existentes│  │ Tablas v6 (Prefijo v6_)            │   │     │
│  │  │ - users          │  │ - v6_managed_positions             │   │     │
│  │  │ - positions      │  │ - v6_fee_collections               │   │     │
│  │  │ - invoices       │  │ - v6_rebalance_history             │   │     │
│  │  │ - etc...         │  │ - v6_pool_analytics                │   │     │
│  │  └──────────────────┘  └────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         POLYGON BLOCKCHAIN                                │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐    │
│  │   CONTRATOS WAYBANK         │  │   CONTRATOS UNISWAP V3          │    │
│  ├─────────────────────────────┤  ├─────────────────────────────────┤    │
│  │ WayPoolPositionCreator      │  │ NonfungiblePositionManager      │    │
│  │ WayBankVault (v6)           │  │ SwapRouter                      │    │
│  │ PoolAnalyzer (v6)           │  │ Factory                         │    │
│  │ SwapExecutor (v6)           │  │ Quoter                          │    │
│  └─────────────────────────────┘  └─────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Smart Contracts | Solidity | 0.8.20 |
| Framework Contratos | Hardhat | 2.x |
| Librerías Seguridad | OpenZeppelin | 5.x |
| Backend | Node.js + Express | 18.x |
| Base de Datos | PostgreSQL + Drizzle ORM | 15.x |
| Frontend | React + TypeScript | 18.x |
| Blockchain | Polygon (EVM) | - |

---

## 3. Sistema Original - WayPoolPositionCreator

### 3.1 Información del Contrato Actual

| Campo | Valor |
|-------|-------|
| **Nombre** | WayPoolPositionCreator |
| **Versión Actual** | 5.0 |
| **Dirección** | `0xf81938F926714f114D07b68dfc3b0E3bC501167B` |
| **Red** | Polygon Mainnet (137) |
| **TX Despliegue** | `0x2f876d0bcacb64577f77929e1c6638ac89d5522176209105cd6a275ced3d01a7` |
| **Bloque** | 81779977 |
| **Fecha Despliegue** | 17 de Enero de 2026 |
| **Gas Usado** | 1,400,928 |
| **Costo** | 0.1378 MATIC |
| **Deployer** | `0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F` |
| **PolygonScan** | [Ver Contrato](https://polygonscan.com/address/0xf81938F926714f114D07b68dfc3b0E3bC501167B) |

### 3.2 Historial de Versiones

El sistema WayPool ha evolucionado a través de múltiples versiones desde su lanzamiento inicial:

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| **1.0** | 12 de Febrero de 2021 | Lanzamiento inicial del protocolo WayPool |
| **2.0** | Agosto de 2021 | Integración con Uniswap V3, soporte de liquidez concentrada |
| **3.0** | Marzo de 2023 | Migración a Polygon, optimización de gas |
| **3.5** | Noviembre de 2023 | Soporte multi-pool, mejoras de seguridad |
| **4.0** | Junio de 2024 | Refactorización completa, nuevas funciones de gestión |
| **4.5** | Octubre de 2025 | Integración con OpenZeppelin 5.x, mejoras de UX |
| **5.0** | 17 de Enero de 2026 | **Versión actual** - Optimizaciones finales, posiciones mínimas |

### 3.3 Notas de Versión 5.0 (Actual)

La versión 5.0 desplegada el 17 de Enero de 2026 incluye:

- Optimización del consumo de gas (-15% respecto a v4.5)
- Soporte para posiciones con cantidades mínimas (1 wei)
- Compatibilidad con OpenZeppelin Contracts 5.x
- Mejoras en validación de parámetros
- Preparación para integración con sistema v6 de gestión automatizada

### 3.4 Propósito

El contrato `WayPoolPositionCreator` permite crear posiciones de liquidez concentrada en Uniswap V3 con **cantidades mínimas de capital**. Esto democratiza el acceso a la provisión de liquidez, permitiendo que usuarios con pequeñas cantidades de capital participen en pools de alta calidad.

### 3.5 Funciones Principales

#### `createMinimalPosition(int24 tickLower, int24 tickUpper)`

Crea una posición con las cantidades mínimas configuradas en el pool por defecto (USDC/WETH 0.05%).

```solidity
function createMinimalPosition(
    int24 tickLower,
    int24 tickUpper
) external nonReentrant returns (uint256 tokenId, uint128 liquidity)
```

**Parámetros:**
- `tickLower`: Tick inferior del rango de precio
- `tickUpper`: Tick superior del rango de precio

**Retorna:**
- `tokenId`: ID del NFT de posición creado
- `liquidity`: Cantidad de liquidez añadida

#### `createPosition(...)`

Crea una posición con parámetros personalizados.

```solidity
function createPosition(
    address token0,
    address token1,
    uint24 fee,
    int24 tickLower,
    int24 tickUpper,
    uint256 amount0Desired,
    uint256 amount1Desired
) external nonReentrant returns (uint256 tokenId, uint128 liquidity)
```

### 3.6 Configuración por Defecto

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| Token0 | USDC (`0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`) | Native USDC en Polygon |
| Token1 | WETH (`0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619`) | Wrapped ETH en Polygon |
| Fee Tier | 500 (0.05%) | Tier de baja volatilidad |
| Min Amount0 | 1 wei (0.000001 USDC) | Mínimo para token0 |
| Min Amount1 | 1 wei | Mínimo para token1 |

### 3.7 Eventos

```solidity
event PositionCreated(
    address indexed user,
    uint256 indexed tokenId,
    address token0,
    address token1,
    uint24 fee,
    int24 tickLower,
    int24 tickUpper,
    uint128 liquidity,
    uint256 amount0,
    uint256 amount1
);
```

### 3.8 Flujo de Creación de Posición

```
Usuario                    WayPoolPositionCreator           Uniswap V3
   │                              │                            │
   │  1. approve(USDC, amount)    │                            │
   │─────────────────────────────▶│                            │
   │                              │                            │
   │  2. approve(WETH, amount)    │                            │
   │─────────────────────────────▶│                            │
   │                              │                            │
   │  3. createMinimalPosition()  │                            │
   │─────────────────────────────▶│                            │
   │                              │  4. transferFrom(tokens)   │
   │                              │───────────────────────────▶│
   │                              │                            │
   │                              │  5. mint(position)         │
   │                              │───────────────────────────▶│
   │                              │                            │
   │                              │  6. NFT → Usuario          │
   │◀─────────────────────────────│◀───────────────────────────│
   │                              │                            │
   │  7. emit PositionCreated     │                            │
   │◀─────────────────────────────│                            │
```

---

## 4. Sistema v6 - Gestión Automatizada

### 4.1 Visión General

El sistema WayBank v6 es un **sistema paralelo** que gestiona las posiciones NFT creadas por el sistema original. **No modifica ni interfiere** con el sistema de creación existente.

### 4.2 Contratos v6 Desplegados

#### 4.2.1 WayBankVault

| Campo | Valor |
|-------|-------|
| **Dirección** | `0x375D8808BDfB7D57D40524f0802bbc49008dEe79` |
| **Propósito** | Vault principal para gestión de posiciones |
| **PolygonScan** | [Ver Contrato](https://polygonscan.com/address/0x375D8808BDfB7D57D40524f0802bbc49008dEe79#code) |

**Funciones Principales:**

```solidity
// Registrar una posición existente para gestión
function registerPosition(uint256 tokenId) external

// Desregistrar una posición
function unregisterPosition(uint256 tokenId) external

// Recolectar fees de una posición
function collectFees(uint256 tokenId) external returns (uint256 amount0, uint256 amount1)

// Recolectar fees de múltiples posiciones
function batchCollectFees(uint256[] calldata tokenIds) external

// Reducir liquidez (para rebalanceo)
function decreaseLiquidity(uint256 tokenId, uint128 liquidityToRemove) external
```

**Configuración:**

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| Vault Fee | 100 bps (1%) | Comisión del vault sobre fees recolectados |
| Treasury | `0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F` | Dirección para recibir comisiones |
| Max Fee | 1000 bps (10%) | Máximo permitido para vault fee |

#### 4.2.2 PoolAnalyzer

| Campo | Valor |
|-------|-------|
| **Dirección** | `0xcf54688ad1db461C2D22BC24C0f20Adbeba76504` |
| **Propósito** | Análisis de pools y recomendaciones de rango |
| **PolygonScan** | [Ver Contrato](https://polygonscan.com/address/0xcf54688ad1db461C2D22BC24C0f20Adbeba76504#code) |

**Funciones Principales:**

```solidity
// Obtener información de un pool
function getPoolInfo(address tokenA, address tokenB, uint24 fee) external view

// Analizar un pool con recomendaciones
function analyzePool(address tokenA, address tokenB, uint24 fee, int24 rangeWidthTicks) external view

// Analizar todos los fee tiers para un par
function analyzeAllFeeTiers(address tokenA, address tokenB) external view

// Verificar si una posición está en rango
function isPositionInRange(address poolAddress, int24 tickLower, int24 tickUpper) external view

// Obtener el mejor pool por liquidez
function getBestPool(address tokenA, address tokenB) external view
```

#### 4.2.3 SwapExecutor

| Campo | Valor |
|-------|-------|
| **Dirección** | `0x4933132E86E4132dAe5Ca30ecEE59fD684c48349` |
| **Propósito** | Ejecución de swaps para rebalanceo |
| **PolygonScan** | [Ver Contrato](https://polygonscan.com/address/0x4933132E86E4132dAe5Ca30ecEE59fD684c48349#code) |

**Funciones Principales:**

```solidity
// Ejecutar un swap simple
function executeSwap(
    address tokenIn,
    address tokenOut,
    uint24 fee,
    uint256 amountIn,
    uint256 minAmountOut
) external returns (uint256 amountOut)

// Swap con slippage automático
function executeSwapWithAutoSlippage(
    address tokenIn,
    address tokenOut,
    uint24 fee,
    uint256 amountIn
) external returns (uint256 amountOut)

// Obtener cotización
function getQuote(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn) external
```

**Configuración:**

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| Default Slippage | 50 bps (0.5%) | Tolerancia de deslizamiento por defecto |
| Max Slippage | 500 bps (5%) | Máximo permitido |

### 4.3 Relación entre Sistemas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FLUJO COMPLETO                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   FASE 1: CREACIÓN (Sistema Original)                                   │
│   ────────────────────────────────────                                  │
│   Usuario ──▶ WayPoolPositionCreator ──▶ Uniswap V3                     │
│                                              │                           │
│                                              ▼                           │
│                                         NFT Position                     │
│                                         (tokenId: X)                     │
│                                              │                           │
│   ─────────────────────────────────────────────────────────────────────  │
│                                              │                           │
│   FASE 2: GESTIÓN (Sistema v6)              ▼                           │
│   ────────────────────────────────                                      │
│   Usuario ──▶ WayBankVault.registerPosition(X)                          │
│                     │                                                    │
│                     ▼                                                    │
│   ┌─────────────────────────────────────────────────────────────┐       │
│   │                    GESTIÓN AUTOMATIZADA                      │       │
│   │  • Monitoreo de rango                                        │       │
│   │  • Recolección de fees                                       │       │
│   │  • Rebalanceo cuando necesario                               │       │
│   │  • Análisis de APR                                           │       │
│   └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Contratos Inteligentes

### 5.1 Resumen de Contratos

| Contrato | Dirección | Verificado | Tipo |
|----------|-----------|------------|------|
| WayPoolPositionCreator | `0xf81938F926714f114D07b68dfc3b0E3bC501167B` | ✅ | Original |
| WayBankVault | `0x375D8808BDfB7D57D40524f0802bbc49008dEe79` | ✅ | v6 |
| PoolAnalyzer | `0xcf54688ad1db461C2D22BC24C0f20Adbeba76504` | ✅ | v6 |
| SwapExecutor | `0x4933132E86E4132dAe5Ca30ecEE59fD684c48349` | ✅ | v6 |

### 5.2 Dependencias de Contratos Externos

| Contrato | Dirección | Proveedor |
|----------|-----------|-----------|
| NonfungiblePositionManager | `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` | Uniswap V3 |
| SwapRouter | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | Uniswap V3 |
| Factory | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | Uniswap V3 |
| Quoter | `0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6` | Uniswap V3 |

### 5.3 Tokens Soportados

| Token | Dirección | Decimales | Símbolo |
|-------|-----------|-----------|---------|
| USDC (Native) | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` | 6 | USDC |
| WETH | `0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619` | 18 | WETH |
| WMATIC | `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270` | 18 | WMATIC |
| WBTC | `0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6` | 8 | WBTC |

### 5.4 Medidas de Seguridad en Contratos

1. **ReentrancyGuard**: Todos los contratos usan `nonReentrant` de OpenZeppelin
2. **SafeERC20**: Uso de transferencias seguras de tokens
3. **Ownable**: Control de acceso para funciones administrativas
4. **Validación de inputs**: Todas las funciones validan parámetros
5. **Límites máximos**: Fees y slippage tienen límites máximos configurados

---

## 6. Infraestructura Backend

### 6.1 Servicios del Sistema Original

| Servicio | Archivo | Descripción |
|----------|---------|-------------|
| NFT Service | `server/nft-service.ts` | Gestión de NFTs y posiciones |
| NFT Pool Creation | `server/nft-pool-creation-service.ts` | Creación de pools |
| Uniswap Data | `server/uniswap-data-service.ts` | Datos de Uniswap |
| Storage | `server/storage.ts` | Persistencia de datos |

### 6.2 Servicios v6 (Nuevos)

| Servicio | Archivo | Descripción |
|----------|---------|-------------|
| V6 Config | `server/waybank-v6/v6-config.ts` | Configuración y constantes |
| Position Manager | `server/waybank-v6/v6-position-manager.ts` | Lee posiciones del blockchain |
| APR Service | `server/waybank-v6/v6-apr-service.ts` | Análisis de APR |
| NFT Manager | `server/waybank-v6/v6-nft-manager.ts` | Gestión de NFTs registrados |
| Routes | `server/waybank-v6/v6-routes.ts` | API endpoints v6 |

### 6.3 API Endpoints v6

```
Base URL: /api/v6

HEALTH
  GET  /health                          # Estado del sistema v6

POSICIONES
  POST /positions/register              # Registrar NFT para gestión
  POST /positions/unregister            # Desregistrar NFT
  GET  /positions/:ownerAddress         # Listar posiciones de un owner
  GET  /position/:tokenId               # Obtener posición con estado
  GET  /position/:tokenId/status        # Estado en tiempo real
  PUT  /position/:tokenId/settings      # Actualizar configuración

HISTORIAL
  GET  /position/:tokenId/fees          # Historial de fees recolectados
  GET  /position/:tokenId/rebalances    # Historial de rebalanceos

APR
  GET  /apr/top-pools                   # Top pools por APR
  GET  /apr/usdc-weth                   # Pools USDC/WETH
  GET  /apr/pool/:poolAddress           # APR de un pool específico

BLOCKCHAIN (Lectura directa)
  GET  /blockchain/position/:tokenId    # Datos directo del blockchain
  GET  /blockchain/position/:tokenId/needs-rebalance  # Verificar rebalanceo

ESTADÍSTICAS
  GET  /stats                           # Estadísticas del vault
```

---

## 7. Base de Datos

### 7.1 Schema Original (NO MODIFICADO)

El schema original en `shared/schema.ts` contiene las siguientes tablas principales:

- `users` - Usuarios del sistema
- `positions` - Posiciones de liquidez
- `realPositions` - Posiciones reales en blockchain
- `managedNfts` - NFTs gestionados
- `invoices` - Facturas
- `yieldDistributions` - Distribución de rendimientos

### 7.2 Schema v6 (NUEVO - Separado)

Archivo: `shared/waybank-v6-schema.ts`

#### `v6_managed_positions`
```sql
CREATE TABLE v6_managed_positions (
  id SERIAL PRIMARY KEY,
  token_id TEXT NOT NULL UNIQUE,
  owner_address TEXT NOT NULL,
  pool_address TEXT NOT NULL,
  token0_address TEXT NOT NULL,
  token1_address TEXT NOT NULL,
  fee_tier INTEGER NOT NULL,
  tick_lower INTEGER NOT NULL,
  tick_upper INTEGER NOT NULL,
  current_liquidity TEXT NOT NULL DEFAULT '0',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_auto_rebalance BOOLEAN NOT NULL DEFAULT FALSE,
  rebalance_threshold_bps INTEGER DEFAULT 500,
  target_range_width_ticks INTEGER DEFAULT 2000,
  chain_id INTEGER NOT NULL DEFAULT 137,
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_rebalanced_at TIMESTAMP,
  metadata JSONB
);
```

#### `v6_fee_collections`
```sql
CREATE TABLE v6_fee_collections (
  id SERIAL PRIMARY KEY,
  position_id INTEGER NOT NULL,
  token_id TEXT NOT NULL,
  amount0_collected TEXT NOT NULL,
  amount1_collected TEXT NOT NULL,
  vault_fee0 TEXT NOT NULL DEFAULT '0',
  vault_fee1 TEXT NOT NULL DEFAULT '0',
  net_amount0 TEXT NOT NULL,
  net_amount1 TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  collected_at TIMESTAMP NOT NULL DEFAULT NOW(),
  token0_price_usd DECIMAL(18,8),
  token1_price_usd DECIMAL(18,8),
  total_value_usd DECIMAL(18,2)
);
```

#### `v6_rebalance_history`
```sql
CREATE TABLE v6_rebalance_history (
  id SERIAL PRIMARY KEY,
  position_id INTEGER NOT NULL,
  token_id TEXT NOT NULL,
  previous_tick_lower INTEGER NOT NULL,
  previous_tick_upper INTEGER NOT NULL,
  previous_liquidity TEXT NOT NULL,
  new_tick_lower INTEGER NOT NULL,
  new_tick_upper INTEGER NOT NULL,
  new_liquidity TEXT NOT NULL,
  current_pool_tick INTEGER NOT NULL,
  reason VARCHAR(50) NOT NULL,
  decrease_liquidity_tx_hash TEXT,
  mint_new_position_tx_hash TEXT,
  total_gas_used TEXT,
  gas_price_gwei DECIMAL(10,2),
  success BOOLEAN NOT NULL DEFAULT FALSE,
  error_message TEXT,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### `v6_pool_analytics`
```sql
CREATE TABLE v6_pool_analytics (
  id SERIAL PRIMARY KEY,
  pool_address TEXT NOT NULL,
  token0_address TEXT NOT NULL,
  token1_address TEXT NOT NULL,
  fee_tier INTEGER NOT NULL,
  current_tick INTEGER NOT NULL,
  current_liquidity TEXT NOT NULL,
  sqrt_price_x96 TEXT NOT NULL,
  estimated_apr_bps INTEGER NOT NULL,
  volume_24h_usd DECIMAL(18,2),
  tvl_usd DECIMAL(18,2),
  fees_24h_usd DECIMAL(18,2),
  chain_id INTEGER NOT NULL DEFAULT 137,
  analyzed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### `v6_vault_config`
```sql
CREATE TABLE v6_vault_config (
  id SERIAL PRIMARY KEY,
  vault_address TEXT,
  pool_analyzer_address TEXT,
  swap_executor_address TEXT,
  vault_fee_bps INTEGER NOT NULL DEFAULT 100,
  treasury_address TEXT,
  auto_rebalance_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  rebalance_interval_hours INTEGER NOT NULL DEFAULT 24,
  authorized_operators JSONB DEFAULT '[]',
  chain_id INTEGER NOT NULL DEFAULT 137,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 8. Flujos de Usuario

### 8.1 Crear Posición (Sistema Original)

```
1. Usuario conecta wallet
2. Usuario selecciona pool (USDC/WETH por defecto)
3. Usuario selecciona rango de precios (ticks)
4. Usuario aprueba tokens (USDC, WETH)
5. Usuario llama createMinimalPosition()
6. Sistema crea NFT de posición
7. NFT se transfiere al usuario
8. Posición registrada en base de datos
```

### 8.2 Registrar Posición para Gestión v6

```
1. Usuario tiene NFT de posición (creado anteriormente)
2. Usuario va a panel de gestión v6
3. Usuario selecciona "Registrar Posición"
4. Sistema verifica propiedad del NFT
5. Sistema registra posición en v6_managed_positions
6. Usuario puede configurar:
   - Auto-rebalance (sí/no)
   - Umbral de rebalanceo (% fuera de rango)
   - Ancho de rango objetivo
```

### 8.3 Recolección de Fees

```
1. Sistema detecta fees pendientes
2. Operador autorizado llama collectFees()
3. Fees se recolectan del pool
4. Se calcula comisión del vault (1%)
5. Comisión va a treasury
6. Resto va al owner de la posición
7. Se registra en v6_fee_collections
```

### 8.4 Rebalanceo de Posición

```
1. Sistema detecta posición fuera de rango
2. Verifica umbral configurado (ej: 5%)
3. Si supera umbral y auto-rebalance activo:
   a. Reduce liquidez de posición actual
   b. Colecta tokens
   c. Calcula nuevo rango óptimo
   d. Crea nueva posición (o añade a existente)
4. Se registra en v6_rebalance_history
```

---

## 9. Flujos Administrativos

### 9.1 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Owner** | Control total, configuración del sistema |
| **Operator** | Ejecutar recolección de fees, rebalanceos |
| **Treasury** | Recibe comisiones del vault |
| **User** | Registrar/desregistrar posiciones, configurar |

### 9.2 Configuración del Vault

```solidity
// Solo Owner puede:
setOperator(address, bool)    // Autorizar operadores
setVaultFee(uint256)          // Cambiar comisión (max 10%)
setTreasury(address)          // Cambiar dirección treasury
rescueTokens(address)         // Rescatar tokens atrapados
```

### 9.3 Monitoreo y Alertas

El sistema debe monitorear:

1. **Posiciones fuera de rango** - Alerta cuando posiciones salen del rango
2. **Fees acumulados** - Alerta cuando fees > umbral
3. **Fallos de transacción** - Alerta en errores de blockchain
4. **Balance del operador** - Alerta cuando MATIC bajo para gas

### 9.4 Operaciones de Mantenimiento

| Operación | Frecuencia | Descripción |
|-----------|------------|-------------|
| Verificar rangos | Cada hora | Detectar posiciones fuera de rango |
| Recolectar fees | Diario | Batch collect de todas las posiciones |
| Actualizar APR | Cada 6 horas | Refrescar datos de APR de pools |
| Backup DB | Diario | Backup de base de datos |

---

## 10. Seguridad

### 10.1 Medidas Implementadas

#### Smart Contracts

1. **Auditoría de código**: Contratos basados en OpenZeppelin auditado
2. **ReentrancyGuard**: Protección contra reentrancia
3. **SafeERC20**: Transferencias seguras de tokens
4. **Validación de inputs**: Todos los parámetros validados
5. **Límites máximos**: Fees y slippage limitados
6. **Ownership**: Control de acceso basado en roles

#### Backend

1. **Rate limiting**: Límite de requests por IP
2. **Input sanitization**: Validación de todos los inputs
3. **HTTPS**: Comunicación encriptada
4. **Environment variables**: Secrets en variables de entorno
5. **Logging**: Registro de todas las operaciones

### 10.2 Consideraciones de Riesgo

| Riesgo | Mitigación |
|--------|------------|
| Smart contract exploit | Código verificado, basado en OpenZeppelin |
| Impermanent loss | Documentación, alertas a usuarios |
| MEV/Sandwich attacks | Deadline corto (10 min), slippage protection |
| Private key compromise | Hardware wallet recomendado para deployer |
| Oracle manipulation | No usa oráculos externos para precios |

### 10.3 Proceso de Incidentes

1. Detectar incidente
2. Pausar operaciones si es necesario
3. Investigar causa raíz
4. Implementar fix
5. Comunicar a usuarios afectados
6. Post-mortem y mejoras

---

## 11. Direcciones y Hashes

### 11.1 Contratos WayBank

```
SISTEMA ORIGINAL
================
WayPoolPositionCreator: 0xf81938F926714f114D07b68dfc3b0E3bC501167B
  - TX Deploy: 0x2f876d0bcacb64577f77929e1c6638ac89d5522176209105cd6a275ced3d01a7
  - Block: 81779977
  - Verified: ✅

SISTEMA V6
==========
WayBankVault: 0x375D8808BDfB7D57D40524f0802bbc49008dEe79
  - Verified: ✅

PoolAnalyzer: 0xcf54688ad1db461C2D22BC24C0f20Adbeba76504
  - Verified: ✅

SwapExecutor: 0x4933132E86E4132dAe5Ca30ecEE59fD684c48349
  - Verified: ✅
```

### 11.2 Direcciones Administrativas

```
Deployer/Owner: 0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F
Treasury:       0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F
```

### 11.3 Contratos Externos (Uniswap V3)

```
NonfungiblePositionManager: 0xC36442b4a4522E871399CD717aBDD847Ab11FE88
SwapRouter:                 0xE592427A0AEce92De3Edee1F18E0157C05861564
Factory:                    0x1F98431c8aD98523631AE4a59f267346ea31F984
Quoter:                     0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6
```

### 11.4 Tokens

```
USDC (Native):  0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 (6 decimals)
WETH:           0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 (18 decimals)
WMATIC:         0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270 (18 decimals)
WBTC:           0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6 (8 decimals)
```

---

## 12. Dependencias Externas

### 12.1 Smart Contract Dependencies

| Librería | Versión | Uso |
|----------|---------|-----|
| @openzeppelin/contracts | 5.x | Seguridad, ERC20, Ownable |
| Uniswap V3 Core | - | Interfaces de pools |
| Uniswap V3 Periphery | - | Position Manager, Router |

### 12.2 Backend Dependencies

| Paquete | Uso |
|---------|-----|
| ethers | Interacción con blockchain |
| drizzle-orm | ORM para PostgreSQL |
| express | Servidor HTTP |

### 12.3 APIs Externas

| API | Uso | Rate Limit |
|-----|-----|------------|
| DefiLlama | Datos de APR | 300 req/5min |
| The Graph (Uniswap) | Datos de pools | Variable |
| Polygon RPC | Transacciones | Variable |

---

## 13. Glosario

| Término | Definición |
|---------|------------|
| **APR** | Annual Percentage Rate - Tasa de rendimiento anual |
| **Concentrated Liquidity** | Liquidez concentrada en un rango de precios específico |
| **Fee Tier** | Nivel de comisión del pool (0.05%, 0.3%, 1%) |
| **Impermanent Loss** | Pérdida temporal por divergencia de precios |
| **Liquidity** | Capital depositado en el pool |
| **NFT Position** | Token ERC-721 que representa una posición de liquidez |
| **Pool** | Par de trading en Uniswap V3 |
| **Rebalancing** | Ajustar la posición para mantenerla en rango |
| **Slippage** | Diferencia entre precio esperado y ejecutado |
| **Tick** | Unidad mínima de precio en Uniswap V3 |
| **Treasury** | Dirección que recibe comisiones del protocolo |
| **TVL** | Total Value Locked - Valor total depositado |
| **Vault** | Contrato que gestiona múltiples posiciones |

---

## Apéndice A: Verificación de Contratos

Todos los contratos pueden ser verificados en PolygonScan:

```bash
# Ver código fuente verificado
https://polygonscan.com/address/[DIRECCIÓN]#code

# Ver transacciones
https://polygonscan.com/address/[DIRECCIÓN]#transactions

# Ver eventos
https://polygonscan.com/address/[DIRECCIÓN]#events
```

---

## Apéndice B: Contacto y Soporte

- **Repositorio**: waybank.info
- **Red**: Polygon Mainnet
- **Chain ID**: 137

---

*Documento generado para auditoría - WayBank v1.0.0 + v6.0.0*
*Fecha: 24 de Enero de 2026*
