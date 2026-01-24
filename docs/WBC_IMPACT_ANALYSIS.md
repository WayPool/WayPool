# WBC Token - Análisis de Impacto en Producción

**Fecha:** 24 de Enero de 2026
**Versión:** 2.0
**Estado:** ANÁLISIS COMPLETO

---

## 1. Especificaciones del Token WBC

### 1.1 Parámetros del Contrato

| Parámetro | Valor |
|-----------|-------|
| **Nombre** | WayBank Coin |
| **Símbolo** | WBC |
| **Decimales** | 6 (igual que USDC) |
| **Red** | **Polygon Mainnet (Chain ID: 137)** |
| **Testnet** | Polygon Amoy (Chain ID: 80002) |
| **Estándar** | ERC20 con restricciones |
| **Supply Máximo** | Sin límite (controlado por lógica) |

### 1.2 Direcciones de Deployment

| Red | Dirección | Estado |
|-----|-----------|--------|
| **Polygon Mainnet** | `(pendiente de deploy)` | ⏳ |
| **Polygon Amoy (Testnet)** | `(pendiente de deploy)` | ⏳ |

### 1.3 Owner Wallet (Polygon)

| Item | Valor |
|------|-------|
| **Wallet Address** | `(wallet owner del proyecto)` |
| **Función** | Mintea y recibe WBC de usuarios |
| **Red** | Polygon Mainnet |

### 1.4 Supply Inicial

```
Supply inicial = Total USDC en posiciones activas al momento del deploy
```

| Métrica Actual | Valor |
|----------------|-------|
| **Total USDC en posiciones activas** | $2,553,028.16 |
| **Posiciones activas** | 134 |

### 1.5 Restricciones de Transferencia

```solidity
// TRANSFERENCIAS PERMITIDAS:
✅ Owner → Usuario (cualquier dirección)
✅ Usuario → Owner (único destinatario)

// TRANSFERENCIAS BLOQUEADAS:
❌ Usuario → Usuario
❌ Usuario → Cualquier dirección que no sea owner
❌ approve() - Deshabilitado
❌ transferFrom() - Deshabilitado
```

### 1.6 Contrato WBCToken.sol (Propuesto)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WBCToken is ERC20, Ownable {

    event TokensSentToUser(address indexed user, uint256 amount, string reason);
    event TokensReturnedFromUser(address indexed user, uint256 amount, string reason);

    constructor() ERC20("WayBank Coin", "WBC") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        _mint(to, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        address sender = _msgSender();

        // Owner puede enviar a cualquier dirección
        if (sender == owner()) {
            _transfer(sender, to, amount);
            emit TokensSentToUser(to, amount, "owner_transfer");
            return true;
        }

        // Usuarios solo pueden enviar al owner
        require(to == owner(), "WBC: Can only transfer to owner");
        _transfer(sender, to, amount);
        emit TokensReturnedFromUser(sender, amount, "user_return");
        return true;
    }

    function approve(address, uint256) public pure override returns (bool) {
        revert("WBC: Approvals not allowed");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("WBC: TransferFrom not allowed");
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
```

---

## 2. Flujos de Negocio WBC

### 2.1 Cuándo Owner ENVÍA WBC al Usuario

| Evento | Cantidad WBC | Condición |
|--------|--------------|-----------|
| **Activación de posición** | = USDC depositado | Siempre al activar |
| **Fee diario positivo** | = fee calculado | Solo si fee > 0 |

### 2.2 Cuándo Usuario DEVUELVE WBC al Owner

| Evento | Cantidad WBC | Condición |
|--------|--------------|-----------|
| **Collect Fees** | = fees recolectados | Debe tener balance >= fees |
| **Close Position** | = capital original | Debe tener balance >= capital |

### 2.3 Escenarios Especiales

| Escenario | Comportamiento |
|-----------|----------------|
| **Collect sin WBC suficiente** | ❌ Operación rechazada |
| **Close sin WBC suficiente** | 🔄 Auto-renovación de posición |
| **Fees diarios negativos** | ➖ Se resta de `feesEarned` en DB, NO se retira WBC |

### 2.4 Ejemplo de Flujo Completo

```
1. Usuario deposita 1000 USDC → Posición "Pending"
2. Admin activa posición → Owner envía 1000 WBC al usuario
3. Cada día con fee +5 → Owner envía 5 WBC al usuario
4. Después de 30 días: Usuario tiene 1150 WBC (1000 + 150 fees)
5. Usuario hace Collect Fees (150) → Devuelve 150 WBC al owner
6. Usuario cierra posición → Devuelve 1000 WBC al owner
7. (Futuro) Sistema devuelve 1000 USDC al usuario
```

---

## 3. Resumen de Backups Realizados

### 3.1 GitHub Backup
| Item | Detalle |
|------|---------|
| **Rama** | `backup-pre-wbc-2026-01-24` |
| **Commit** | `05e851c` |
| **Estado** | ✅ Subido a origin |
| **URL** | https://github.com/WayPool/WayPool/tree/backup-pre-wbc-2026-01-24 |

### 3.2 Backup Local
| Item | Ruta |
|------|------|
| **Proyecto completo** | `/Users/lorenzoballantimoran/Documents/BACKUPS/waybank-pre-wbc-2026-01-24/waybank.info_full_backup/` |
| **Base de datos** | `/Users/lorenzoballantimoran/Documents/BACKUPS/waybank-pre-wbc-2026-01-24/db/` |

### 3.3 Tablas Exportadas de Base de Datos
```
position_history.csv      (58 KB - 144 registros)
custodial_wallets.csv     (32 KB)
users.csv                 (34 KB)
real_positions.csv        (52 KB)
managed_nfts.csv          (40 KB)
fee_withdrawals.csv       (672 B)
yield_distributions.csv   (231 B)
+ 6 tablas adicionales
```

---

## 4. Archivos que Serán Modificados

### 4.1 Tabla de Impacto por Archivo

| Archivo | Tipo de Cambio | Riesgo | Líneas Afectadas |
|---------|---------------|--------|------------------|
| `server/routes.ts` | ADITIVO | 🟢 BAJO | 3189-3204, 3747-3751, 2044-2052 |
| `server/daily-apr-distribution-service.ts` | ADITIVO | 🟢 BAJO | 318-328 |
| `server/storage.ts` | ADITIVO | 🟢 BAJO | Nuevos métodos |
| `shared/schema.ts` | ADITIVO | 🟢 BAJO | Nuevos campos al final |
| `contracts/WBCToken.sol` | NUEVO | 🟢 NULO | N/A (archivo nuevo) |
| `server/wbc-token-service.ts` | NUEVO | 🟢 NULO | N/A (archivo nuevo) |

---

## 5. Análisis Detallado por Archivo

### 5.1 `server/routes.ts` (Archivo Principal de API)

#### Endpoint: Position Status Update (líneas 3111-3210)
```
ACTUAL:
- Cambia status de posición (Pending → Active)
- Crea NFT de Uniswap si aplica

CAMBIO PROPUESTO:
- DESPUÉS de la lógica existente, AÑADIR envío de WBC
- NO modifica ninguna línea existente
- Solo agrega código nuevo al final del bloque

IMPACTO: ✅ CERO - Código existente NO se toca
```

**Código que se añadirá (después de línea 3203):**
```typescript
// === NUEVO: WBC Token Distribution ===
// Solo se ejecuta DESPUÉS de que todo el proceso existente haya terminado
if (newStatus === 'Active' && position.depositedUSDC) {
  try {
    // Código WBC aquí - NO afecta flujo existente
  } catch (wbcError) {
    // Error de WBC NO afecta la respuesta - solo log
    console.error('[WBC] Error:', wbcError);
  }
}
```

#### Endpoint: Collect Fees (líneas 3686+)
```
ACTUAL:
- Valida posición y estado
- Actualiza fees en DB
- Envía email de confirmación

CAMBIO PROPUESTO:
- ANTES de actualizar DB, validar balance WBC del usuario
- Si no tiene WBC suficiente, rechazar (comportamiento nuevo)
- Si tiene WBC, recibir tokens Y LUEGO continuar flujo existente

IMPACTO: ⚠️ BAJO - Añade validación extra que puede rechazar
```

**Análisis de seguridad:**
- El rechazo por falta de WBC es COMPORTAMIENTO ESPERADO
- No rompe funcionalidad existente, la EXTIENDE
- Si el servicio WBC falla, NO afecta el flujo actual (try-catch)

#### Endpoint: Close Position (líneas 1935+)
```
ACTUAL:
- Valida lock period
- Actualiza status a "Finalized"
- Registra cierre

CAMBIO PROPUESTO:
- ANTES de cerrar, validar balance WBC
- Si no tiene WBC suficiente → Auto-renovar (comportamiento nuevo)
- Si tiene WBC → Recibir tokens Y LUEGO cerrar

IMPACTO: ⚠️ MEDIO - Puede auto-renovar en vez de cerrar
```

**Análisis de seguridad:**
- Auto-renovación es COMPORTAMIENTO ESPERADO por negocio
- El usuario no pierde capital, solo se extiende el período
- Fallback: Si WBC service falla, posición se cierra normalmente (configurable)

---

### 5.2 `server/daily-apr-distribution-service.ts`

```
ACTUAL (líneas 287-328):
for (const position of activePositions) {
  // Calcula fees diarios
  const dailyYield = calculateDailyYield(capital, adjustedApr);
  const newFeesEarned = currentFees + dailyYield;

  // Actualiza en DB
  await updatePositionFeesAndApr(position.id, finalFeesEarned, adjustedApr);
}

CAMBIO PROPUESTO:
- DESPUÉS de actualizar DB, si dailyYield > 0, enviar WBC
- Error de WBC NO afecta la distribución de fees (try-catch)
```

**Código que se añadirá:**
```typescript
// === NUEVO: WBC Token para fees positivos ===
if (dailyYield > 0 && !dryRun) {
  try {
    await wbcTokenService.sendTokensOnDailyFees(
      position.walletAddress,
      dailyYield,
      position.id
    );
  } catch (wbcError) {
    // Error de WBC se registra pero NO afecta distribución
    log(`[WBC] Error enviando fees: ${wbcError}`, 'WARN');
  }
}
```

**IMPACTO: ✅ CERO** - La distribución de fees sigue funcionando igual

---

### 5.3 `shared/schema.ts` (Schema de Base de Datos)

```
CAMBIO PROPUESTO:
- Añadir NUEVOS campos a positionHistory (al final de la definición)
- NO modificar campos existentes
- Crear NUEVA tabla wbc_transactions

CAMPOS NUEVOS en positionHistory:
- wbcMintedAmount: varchar(50)     // Cantidad de WBC enviados al usuario
- wbcMintedAt: timestamp           // Fecha de envío
- wbcMintTxHash: varchar(100)      // Hash de transacción
- wbcReturnedAmount: varchar(50)   // WBC devueltos al cerrar
- wbcReturnedAt: timestamp
- wbcReturnTxHash: varchar(100)
- autoRenewed: boolean             // Si se auto-renovó
- autoRenewedAt: timestamp
- autoRenewReason: varchar(50)

IMPACTO: ✅ CERO - Campos nuevos NO afectan queries existentes
```

**Análisis de Drizzle ORM:**
- Drizzle permite añadir campos sin romper queries existentes
- `SELECT * FROM position_history` seguirá funcionando
- Nuevos campos serán `null` hasta que se usen

---

### 5.4 `server/storage.ts` (Operaciones de Base de Datos)

```
CAMBIO PROPUESTO:
- Añadir NUEVOS métodos (no modificar existentes)
- getPositionWBCData(positionId): Promise<WBCData>
- updatePositionWBCFields(id, data): Promise<PositionHistory>
- getWBCTransactionsByPosition(positionId): Promise<WBCTransaction[]>
- createWBCTransaction(data): Promise<WBCTransaction>

IMPACTO: ✅ CERO - Solo añade, no modifica
```

---

### 5.5 Archivos NUEVOS (Sin impacto)

| Archivo | Propósito |
|---------|-----------|
| `contracts/WBCToken.sol` | Contrato del token |
| `server/wbc-token-service.ts` | Servicio de interacción con contrato |
| `scripts/deploy-wbc.cjs` | Script de deployment |
| `scripts/distribute-initial-wbc.ts` | Distribución inicial |

**IMPACTO: ✅ NULO** - Archivos nuevos no afectan código existente

---

## 5.6 Variables de Entorno Nuevas

```env
# WBC Token Configuration (Polygon)
WBC_ENABLED=true
WBC_CONTRACT_ADDRESS=0x...  # Dirección del contrato en Polygon Mainnet
WBC_OWNER_PRIVATE_KEY=...   # Private key del owner wallet (Polygon)
WBC_OWNER_ADDRESS=0x...     # Address del owner wallet (Polygon)

# Polygon RPC
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGON_CHAIN_ID=137

# Gas Configuration
WBC_GAS_LIMIT=100000
WBC_GAS_PRICE_GWEI=50
```

---

## 5.7 Nueva Tabla: `wbc_transactions`

```sql
CREATE TABLE wbc_transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(100) NOT NULL UNIQUE,
  from_address VARCHAR(50) NOT NULL,
  to_address VARCHAR(50) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  position_id INTEGER REFERENCES position_history(id),
  transaction_type VARCHAR(30) NOT NULL,
  -- Tipos: 'activation', 'daily_fee', 'collect', 'close'
  status VARCHAR(20) DEFAULT 'pending',
  -- Estados: 'pending', 'confirmed', 'failed'
  block_number INTEGER,
  gas_used VARCHAR(30),
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP
);

CREATE INDEX idx_wbc_tx_position ON wbc_transactions(position_id);
CREATE INDEX idx_wbc_tx_type ON wbc_transactions(transaction_type);
CREATE INDEX idx_wbc_tx_from ON wbc_transactions(from_address);
CREATE INDEX idx_wbc_tx_to ON wbc_transactions(to_address);
```

---

## 6. Matriz de Riesgos

| Escenario | Probabilidad | Impacto | Mitigación |
|-----------|--------------|---------|------------|
| WBC service no disponible | Media | Bajo | Try-catch en todos los puntos |
| Transacción WBC falla | Media | Bajo | Retry automático, log para manual |
| Gas insuficiente | Baja | Bajo | Configuración de gas buffer |
| Usuario sin WBC para cerrar | Alta (esperado) | Ninguno | Auto-renovación implementada |
| DB migration falla | Muy Baja | Alto | Backup completo disponible |

---

## 7. Plan de Rollback

### Si algo falla durante la implementación:

```bash
# 1. Restaurar código desde backup
git checkout backup-pre-wbc-2026-01-24

# 2. Push a producción
git push origin main --force  # Solo si es necesario

# 3. Restaurar base de datos (si se modificó)
# Los backups CSV están en:
# /Users/lorenzoballantimoran/Documents/BACKUPS/waybank-pre-wbc-2026-01-24/db/
```

### Si el servicio WBC falla en producción:

1. **Opción A:** Deshabilitar WBC temporalmente
   - Configuración `WBC_ENABLED=false` en `.env`
   - Sistema sigue funcionando sin WBC

2. **Opción B:** Restaurar versión anterior
   - Deploy desde rama `backup-pre-wbc-2026-01-24`

---

## 8. Orden de Implementación (Seguro)

```
FASE 1: PREPARACIÓN (Sin afectar producción)
├── 1.1 Crear contrato WBCToken.sol
├── 1.2 Tests unitarios del contrato
├── 1.3 Deploy a testnet Polygon Amoy
└── 1.4 Verificar en PolygonScan

FASE 2: BACKEND (Sin afectar usuarios)
├── 2.1 Migración de DB (campos nuevos)
├── 2.2 Implementar wbc-token-service.ts
├── 2.3 Añadir storage methods
└── 2.4 Tests locales

FASE 3: INTEGRACIÓN (Con feature flag)
├── 3.1 Integrar en routes.ts (behind flag)
├── 3.2 Integrar en daily-apr-distribution
├── 3.3 Tests E2E con flag activado
└── 3.4 Deploy a staging

FASE 4: PRODUCCIÓN
├── 4.1 Deploy contrato a Polygon Mainnet
├── 4.2 Mintear supply inicial
├── 4.3 Activar feature flag
├── 4.4 Distribución inicial a usuarios existentes
└── 4.5 Monitoreo intensivo 24h
```

---

## 9. Conclusión

### ✅ Es SEGURO proceder porque:

1. **Todos los cambios son ADITIVOS** - No se modifica lógica existente
2. **Feature flag disponible** - WBC se puede desactivar instantáneamente
3. **Backups completos** - Código y base de datos respaldados
4. **Try-catch en todos los puntos** - Errores de WBC no afectan flujo principal
5. **Rollback inmediato** - `git checkout backup-pre-wbc-2026-01-24`

### ⚠️ Puntos de atención:

1. **Close position con auto-renovación** - Cambio de comportamiento esperado
2. **Collect fees requiere WBC** - Nueva validación
3. **Distribución inicial** - Script one-time que debe ejecutarse correctamente

---

**Documento preparado por:** Claude Code
**Fecha:** 24 de Enero de 2026
**Estado:** LISTO PARA REVISIÓN
