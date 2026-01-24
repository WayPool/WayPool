# WBC Token Implementation Plan

## Documento de Planificación - WayBank Coin (WBC)

**Fecha:** 24 de Enero de 2026
**Versión:** 2.0
**Estado:** BORRADOR - Pendiente de Aprobación Final

---

## 1. Resumen Ejecutivo

### 1.1 Objetivo

Implementar un sistema de tokens WBC (WayBank Coin) que:
- Represente 1:1 el valor en USDC de las posiciones de liquidez
- Se transfiera SOLO entre el wallet owner y los usuarios (no entre usuarios)
- Funcione como sistema de contabilidad on-chain del capital y fees

### 1.2 Principio Fundamental

```
1 WBC = 1 USDC (siempre)
```

**IMPORTANTE:** Los USDC depositados NO se mueven en este proceso. El sistema WBC es una capa de contabilidad paralela. El movimiento de USDC se implementará en una fase posterior.

---

## 2. Flujo Completo de WBC

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLUJO COMPLETO DE WBC                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    OWNER WALLET                                      │   │
│  │              (Supply inicial de WBC)                                 │   │
│  └───────────────────────────┬─────────────────────────────────────────┘   │
│                              │                                              │
│         ┌────────────────────┼────────────────────┐                        │
│         │                    │                    │                        │
│         ▼                    ▼                    ▼                        │
│  ┌─────────────┐     ┌─────────────┐      ┌─────────────┐                  │
│  │ ACTIVAR     │     │ FEES        │      │ (futuro)    │                  │
│  │ POSICIÓN    │     │ DIARIOS     │      │             │                  │
│  │             │     │             │      │             │                  │
│  │ Owner envía │     │ Owner envía │      │             │                  │
│  │ WBC = USDC  │     │ WBC = fees  │      │             │                  │
│  │ depositado  │     │ generados   │      │             │                  │
│  └──────┬──────┘     └──────┬──────┘      └─────────────┘                  │
│         │                   │                                               │
│         └─────────┬─────────┘                                               │
│                   ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      USER WALLET                                     │   │
│  │                                                                      │   │
│  │   Balance WBC = Capital inicial + Fees acumulados                   │   │
│  │                                                                      │   │
│  │   Ejemplo: Posición 1000 USDC + 150 fees = 1150 WBC                 │   │
│  │                                                                      │   │
│  └───────────────────────────┬─────────────────────────────────────────┘   │
│                              │                                              │
│         ┌────────────────────┼────────────────────┐                        │
│         │                    │                    │                        │
│         ▼                    ▼                    ▼                        │
│  ┌─────────────┐     ┌─────────────┐      ┌─────────────┐                  │
│  │ COLLECT     │     │ CLOSE       │      │ SIN WBC     │                  │
│  │ FEES        │     │ POSITION    │      │ SUFICIENTE  │                  │
│  │             │     │             │      │             │                  │
│  │ User envía  │     │ User envía  │      │ No puede    │                  │
│  │ WBC = fees  │     │ WBC = todo  │      │ cerrar      │                  │
│  │ collected   │     │ el capital  │      │ → Renueva   │                  │
│  └──────┬──────┘     └──────┬──────┘      └─────────────┘                  │
│         │                   │                                               │
│         └─────────┬─────────┘                                               │
│                   ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    OWNER WALLET                                      │   │
│  │              (Recibe WBC de vuelta)                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Escenarios Detallados

### 3.1 Activación de Posición

| Paso | Acción | WBC |
|------|--------|-----|
| 1 | Admin crea posición con 1000 USDC (status: Pending) | - |
| 2 | Admin cambia status a "Active" | - |
| 3 | Sistema crea NFT de Uniswap (existente) | - |
| 4 | **NUEVO:** Owner transfiere 1000 WBC al user wallet | Owner: -1000 / User: +1000 |

**Resultado:** Usuario tiene 1000 WBC representando su capital.

### 3.2 Distribución de Fees Diarios

El sistema existente (`daily-apr-distribution-service.ts`) calcula fees diarios.

| Paso | Acción | WBC |
|------|--------|-----|
| 1 | Cron ejecuta a medianoche UTC | - |
| 2 | Calcula APR promedio de pools | - |
| 3 | Aplica ajuste por timeframe | - |
| 4 | Calcula: `daily_fee = (capital × APR_ajustado) / 365` | - |
| 5 | Actualiza `fees_earned` en DB (puede ser negativo) | - |
| 6 | **NUEVO:** Si fee > 0: Owner transfiere WBC al usuario | Owner: -fee / User: +fee |
| 7 | **NUEVO:** Si fee < 0: Se resta del balance WBC virtual* | (ver nota) |

**Nota sobre fees negativos:**
- Los fees negativos reducen el `fees_earned` en la DB
- NO se transfieren WBC del usuario al owner por fees negativos diarios
- El balance WBC del usuario NO disminuye automáticamente por fees negativos
- Solo al hacer collect/close se valida si tiene WBC suficiente

### 3.3 Collect Fees

Usuario solicita recolectar sus fees acumulados.

| Paso | Acción | WBC |
|------|--------|-----|
| 1 | Usuario tiene 1000 (capital) + 150 (fees) = 1150 WBC | User: 1150 |
| 2 | Usuario hace "Collect Fees" de 150 USDC | - |
| 3 | Sistema valida: user balance >= 150 WBC | ✓ |
| 4 | Usuario transfiere 150 WBC al owner | User: -150 / Owner: +150 |
| 5 | Sistema registra fee collection | - |
| 6 | Sistema resetea `fees_earned = 0` | - |

**Resultado:** Usuario tiene 1000 WBC (capital), Owner recupera 150 WBC.

### 3.4 Close Position (Caso Exitoso)

Usuario cierra posición con balance suficiente.

| Paso | Acción | WBC |
|------|--------|-----|
| 1 | Usuario tiene 1000 WBC (capital original) | User: 1000 |
| 2 | Usuario solicita "Close Position" | - |
| 3 | Sistema valida: user balance >= 1000 WBC | ✓ |
| 4 | Usuario transfiere 1000 WBC al owner | User: -1000 / Owner: +1000 |
| 5 | Sistema actualiza status a "Finalized" | - |
| 6 | (Futuro) Sistema devuelve USDC al usuario | - |

**Resultado:** Posición cerrada exitosamente.

### 3.5 Close Position (Balance Insuficiente)

Usuario intenta cerrar pero no tiene WBC suficiente.

| Paso | Acción | WBC |
|------|--------|-----|
| 1 | Usuario tiene 800 WBC (perdió 200 por fees negativos acumulados) | User: 800 |
| 2 | Usuario solicita "Close Position" (capital: 1000 USDC) | - |
| 3 | Sistema valida: user balance (800) < 1000 WBC | ✗ |
| 4 | Sistema rechaza cierre | - |
| 5 | Posición se AUTO-RENUEVA por otro período | - |
| 6 | Usuario debe acumular más fees hasta tener 1000 WBC | - |

**Resultado:** Posición renovada, usuario debe esperar a tener balance suficiente.

---

## 4. Especificaciones del Token WBC

### 4.1 Parámetros del Contrato

| Parámetro | Valor |
|-----------|-------|
| **Nombre** | WayBank Coin |
| **Símbolo** | WBC |
| **Decimales** | 6 (igual que USDC) |
| **Red** | Polygon Mainnet (Chain ID: 137) |
| **Supply Inicial** | Calculado dinámicamente (total USDC en posiciones activas) |
| **Supply Máximo** | Sin límite (controlado por lógica) |
| **Estándar** | ERC20 con restricciones de transferencia |

### 4.2 Restricciones de Transferencia

```
SOLO SE PERMITEN TRANSFERENCIAS:
- Owner → Usuario (cualquiera)
- Usuario → Owner (único destinatario permitido)

NO SE PERMITEN:
- Usuario → Usuario
- Usuario → Cualquier dirección que no sea owner
```

### 4.3 Contrato Propuesto

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WBCToken
 * @notice WayBank Coin - Token de representación de capital en posiciones
 * @dev ERC20 con transferencias restringidas a owner↔user únicamente
 */
contract WBCToken is ERC20, Ownable {

    // Eventos personalizados
    event TokensSentToUser(address indexed user, uint256 amount, string reason);
    event TokensReturnedFromUser(address indexed user, uint256 amount, string reason);

    constructor() ERC20("WayBank Coin", "WBC") Ownable(msg.sender) {}

    /**
     * @notice Mintea tokens WBC (solo owner)
     * @param to Dirección del destinatario
     * @param amount Cantidad de tokens (6 decimales)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        _mint(to, amount);
    }

    /**
     * @notice Override de transfer con restricciones
     * @dev Solo permite: owner→user o user→owner
     */
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

    /**
     * @notice Deshabilitamos approve para prevenir transferencias delegadas
     */
    function approve(address, uint256) public pure override returns (bool) {
        revert("WBC: Approvals not allowed");
    }

    /**
     * @notice Deshabilitamos transferFrom
     */
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("WBC: TransferFrom not allowed");
    }

    /**
     * @notice Devuelve 6 decimales (igual que USDC)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
```

---

## 5. Sistemas a Modificar

### 5.1 Archivos Identificados

| Sistema | Archivo | Modificación |
|---------|---------|--------------|
| **Daily APR Distribution** | `server/daily-apr-distribution-service.ts` | Añadir transferencia WBC al calcular fees positivos |
| **Position Activation** | `server/routes.ts` (líneas 3111-3210) | Añadir transferencia WBC al activar |
| **Collect Fees** | `server/routes.ts` (líneas 3686+) | Validar y recibir WBC del usuario |
| **Close Position** | `server/routes.ts` (líneas 1935+) | Validar WBC, recibir, o auto-renovar |
| **Storage** | `server/storage.ts` | Añadir campos WBC |
| **Schema** | `shared/schema.ts` | Añadir campos WBC a position_history |

### 5.2 Nuevo Servicio: `wbc-token-service.ts`

```typescript
// server/wbc-token-service.ts

export interface WBCTokenService {

  // ===== OWNER → USER =====

  /**
   * Enviar WBC al activar una posición
   * @param userWallet Wallet del usuario
   * @param amountUSDC Capital depositado en USDC
   * @param positionId ID de la posición
   */
  sendTokensOnActivation(
    userWallet: string,
    amountUSDC: number,
    positionId: number
  ): Promise<TransferResult>;

  /**
   * Enviar WBC por fees diarios positivos
   * @param userWallet Wallet del usuario
   * @param feeAmount Cantidad de fees en USDC
   * @param positionId ID de la posición
   */
  sendTokensOnDailyFees(
    userWallet: string,
    feeAmount: number,
    positionId: number
  ): Promise<TransferResult>;

  // ===== USER → OWNER =====

  /**
   * Recibir WBC al recolectar fees
   * @param userWallet Wallet del usuario
   * @param feeAmount Cantidad de fees recolectados
   * @param positionId ID de la posición
   */
  receiveTokensOnCollect(
    userWallet: string,
    feeAmount: number,
    positionId: number
  ): Promise<TransferResult>;

  /**
   * Recibir WBC al cerrar posición
   * @param userWallet Wallet del usuario
   * @param capitalAmount Capital original de la posición
   * @param positionId ID de la posición
   */
  receiveTokensOnClose(
    userWallet: string,
    capitalAmount: number,
    positionId: number
  ): Promise<TransferResult>;

  // ===== CONSULTAS =====

  /**
   * Consultar balance WBC de un usuario
   * @param walletAddress Dirección del wallet
   */
  getBalance(walletAddress: string): Promise<string>;

  /**
   * Verificar si usuario tiene WBC suficiente
   * @param walletAddress Dirección del wallet
   * @param requiredAmount Cantidad requerida
   */
  hasEnoughBalance(walletAddress: string, requiredAmount: number): Promise<boolean>;
}

interface TransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
  amount?: string;
}
```

---

## 6. Modificaciones por Endpoint

### 6.1 Activación de Posición

**Archivo:** `server/routes.ts` - `PATCH /api/admin/positions/:id/status`

```typescript
// Añadir después de la creación del NFT (línea ~3195)

if (newStatus === 'Active') {
  // ... código existente de NFT ...

  // NUEVO: Enviar WBC al usuario
  const depositedUSDC = parseFloat(position.depositedUSDC || '0');

  if (depositedUSDC > 0) {
    const wbcResult = await wbcTokenService.sendTokensOnActivation(
      position.walletAddress,
      depositedUSDC,
      positionId
    );

    if (wbcResult.success) {
      console.log(`[WBC] Enviados ${depositedUSDC} WBC a ${position.walletAddress}`);
      await storage.updatePositionHistory(positionId, {
        wbcMintedAmount: depositedUSDC.toString(),
        wbcMintTxHash: wbcResult.txHash,
        wbcMintedAt: new Date()
      });
    } else {
      console.error(`[WBC] Error enviando tokens: ${wbcResult.error}`);
    }
  }
}
```

### 6.2 Distribución Diaria de Fees

**Archivo:** `server/daily-apr-distribution-service.ts` - función `executeDistribution()`

```typescript
// Añadir después de actualizar fees_earned (dentro del loop de posiciones)

// Solo enviar WBC si el fee es positivo
if (dailyYield > 0) {
  const wbcResult = await wbcTokenService.sendTokensOnDailyFees(
    position.walletAddress,
    dailyYield,
    position.id
  );

  if (wbcResult.success) {
    log(`[WBC] Enviados ${dailyYield.toFixed(6)} WBC a ${position.walletAddress}`);
  } else {
    log(`[WBC] Error enviando fees: ${wbcResult.error}`, 'ERROR');
  }
}
// Si dailyYield es negativo, NO se transfiere WBC
// El fee negativo ya está registrado en fees_earned
```

### 6.3 Collect Fees

**Archivo:** `server/routes.ts` - `POST /api/fees/collect`

```typescript
// Añadir al inicio del endpoint, después de validaciones existentes

// NUEVO: Validar que usuario tiene WBC suficiente
const hasBalance = await wbcTokenService.hasEnoughBalance(walletAddress, amount);

if (!hasBalance) {
  const currentBalance = await wbcTokenService.getBalance(walletAddress);
  return res.status(400).json({
    success: false,
    error: 'Insufficient WBC balance',
    message: `No tienes suficientes WBC para recolectar estos fees. Necesitas ${amount} WBC pero solo tienes ${currentBalance} WBC.`,
    requiredWBC: amount,
    currentWBC: parseFloat(currentBalance)
  });
}

// NUEVO: Recibir WBC del usuario
const wbcResult = await wbcTokenService.receiveTokensOnCollect(
  walletAddress,
  amount,
  positionId
);

if (!wbcResult.success) {
  return res.status(500).json({
    success: false,
    error: 'WBC transfer failed',
    message: wbcResult.error
  });
}

console.log(`[WBC] Recibidos ${amount} WBC de ${walletAddress} (collect fees)`);

// Continuar con lógica existente...
```

### 6.4 Close Position

**Archivo:** `server/routes.ts` - `POST /api/positions/close`

```typescript
// Añadir después de validaciones de lock period

const capitalAmount = parseFloat(position.depositedUSDC || '0');

// NUEVO: Validar que usuario tiene WBC suficiente para el capital
const hasBalance = await wbcTokenService.hasEnoughBalance(
  position.walletAddress,
  capitalAmount
);

if (!hasBalance) {
  // AUTO-RENOVACIÓN: No puede cerrar, extender posición
  const currentEndDate = new Date(position.endDate);
  const newEndDate = new Date(currentEndDate);
  newEndDate.setDate(newEndDate.getDate() + (position.timeframe || 30));

  await storage.updatePositionHistory(positionId, {
    endDate: newEndDate,
    autoRenewed: true,
    autoRenewedAt: new Date(),
    autoRenewReason: 'insufficient_wbc_balance'
  });

  const userBalance = await wbcTokenService.getBalance(position.walletAddress);

  return res.status(400).json({
    success: false,
    error: 'Insufficient WBC balance',
    message: `No puedes cerrar la posición. Necesitas ${capitalAmount} WBC pero solo tienes ${userBalance} WBC. La posición ha sido renovada automáticamente.`,
    autoRenewed: true,
    newEndDate: newEndDate.toISOString(),
    requiredWBC: capitalAmount,
    currentWBC: parseFloat(userBalance)
  });
}

// NUEVO: Recibir WBC del usuario (capital completo)
const wbcResult = await wbcTokenService.receiveTokensOnClose(
  position.walletAddress,
  capitalAmount,
  positionId
);

if (!wbcResult.success) {
  return res.status(500).json({
    success: false,
    error: 'WBC transfer failed',
    message: wbcResult.error
  });
}

await storage.updatePositionHistory(positionId, {
  wbcReturnedAmount: capitalAmount.toString(),
  wbcReturnTxHash: wbcResult.txHash,
  wbcReturnedAt: new Date()
});

console.log(`[WBC] Recibidos ${capitalAmount} WBC de ${position.walletAddress} (close position)`);

// Continuar con lógica existente de close...
```

---

## 7. Campos de Base de Datos

### 7.1 Nuevos Campos en `position_history`

```sql
-- Migration: add_wbc_fields.sql

ALTER TABLE position_history ADD COLUMN wbc_minted_amount VARCHAR(50);
ALTER TABLE position_history ADD COLUMN wbc_minted_at TIMESTAMP;
ALTER TABLE position_history ADD COLUMN wbc_mint_tx_hash VARCHAR(100);

ALTER TABLE position_history ADD COLUMN wbc_returned_amount VARCHAR(50);
ALTER TABLE position_history ADD COLUMN wbc_returned_at TIMESTAMP;
ALTER TABLE position_history ADD COLUMN wbc_return_tx_hash VARCHAR(100);

ALTER TABLE position_history ADD COLUMN auto_renewed BOOLEAN DEFAULT FALSE;
ALTER TABLE position_history ADD COLUMN auto_renewed_at TIMESTAMP;
ALTER TABLE position_history ADD COLUMN auto_renew_reason VARCHAR(50);

CREATE INDEX idx_position_history_wbc_mint ON position_history(wbc_mint_tx_hash);
CREATE INDEX idx_position_history_auto_renewed ON position_history(auto_renewed);
```

### 7.2 Nueva Tabla: `wbc_transactions`

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

## 8. Supply Inicial y Distribución

### 8.1 Datos Actuales

| Métrica | Valor |
|---------|-------|
| **Total USDC en posiciones activas** | $2,553,028.16 |
| **Total posiciones activas** | 134 |

### 8.2 Supply Inicial a Mintear

El supply inicial se minteará al wallet owner basándose en el total de USDC en posiciones activas al momento del despliegue.

### 8.3 Distribución Inicial a Usuarios Existentes

Después del despliegue, se ejecutará un script que:

1. Obtenga todas las posiciones con status "Active"
2. Para cada posición, calcule:
   - Capital: `depositedUSDC`
   - Fees acumulados: `feesEarned` (solo si > 0)
   - Total WBC a enviar: `capital + max(0, fees)`
3. Transfiera WBC del owner a cada usuario

```typescript
// scripts/distribute-initial-wbc.ts

async function distributeInitialWBC() {
  const activePositions = await storage.getActivePositions();

  for (const position of activePositions) {
    const capital = parseFloat(position.depositedUSDC || '0');
    const fees = parseFloat(position.feesEarned || '0');
    const totalWBC = capital + Math.max(0, fees);

    if (totalWBC > 0) {
      await wbcTokenService.sendTokensOnActivation(
        position.walletAddress,
        totalWBC,
        position.id
      );

      console.log(`[WBC] Distributed ${totalWBC} WBC to ${position.walletAddress}`);
    }
  }
}
```

---

## 9. Consideraciones de Seguridad

### 9.1 Validaciones Críticas

| Operación | Validaciones |
|-----------|--------------|
| Enviar WBC (owner→user) | Balance owner >= amount, dirección válida |
| Recibir WBC (user→owner) | Balance user >= amount, posición existe |
| Collect Fees | Balance user >= fees a recolectar |
| Close Position | Balance user >= capital original |

### 9.2 Manejo de Errores

| Error | Comportamiento |
|-------|----------------|
| Gas insuficiente | Retry hasta 3 veces, luego log error |
| Balance insuficiente (owner) | Bloquear operación, alertar admin |
| Balance insuficiente (user collect) | Rechazar collect |
| Balance insuficiente (user close) | Auto-renovar posición |
| Timeout de transacción | Retry con gas incrementado |

---

## 10. Plan de Despliegue

### 10.1 Fases

| # | Fase | Dependencias |
|---|------|--------------|
| 1 | Crear contrato `WBCToken.sol` | - |
| 2 | Tests unitarios del contrato | Fase 1 |
| 3 | Desplegar a Polygon Testnet (Amoy) | Fase 2 |
| 4 | Testing completo en testnet | Fase 3 |
| 5 | Desplegar a Polygon Mainnet | Fase 4 |
| 6 | Verificar en PolygonScan | Fase 5 |
| 7 | Mintear supply inicial al owner | Fase 5 |
| 8 | Implementar `wbc-token-service.ts` | Fase 5 |
| 9 | Migración de base de datos | - |
| 10 | Modificar `daily-apr-distribution-service.ts` | Fase 8 |
| 11 | Modificar endpoints en `routes.ts` | Fase 8 |
| 12 | Testing E2E en producción | Fases 10-11 |
| 13 | Distribución inicial a usuarios existentes | Fase 12 |

---

## 11. Resumen de Lógica Final

### ¿Cuándo Owner ENVÍA WBC al usuario?

| Evento | Cantidad WBC | Condición |
|--------|--------------|-----------|
| Activación de posición | = USDC depositado | Siempre |
| Fee diario positivo | = fee calculado | Solo si fee > 0 |

### ¿Cuándo Usuario DEVUELVE WBC al owner?

| Evento | Cantidad WBC | Condición |
|--------|--------------|-----------|
| Collect Fees | = fees recolectados | Debe tener balance >= fees |
| Close Position | = capital original | Debe tener balance >= capital |

### ¿Qué pasa si usuario no tiene WBC suficiente?

| Evento | Resultado |
|--------|-----------|
| Collect Fees | **Operación rechazada** - No puede recolectar |
| Close Position | **Auto-renovación** - Posición se extiende automáticamente |

### Comportamiento de Fees Negativos

- Fees negativos se registran en `fees_earned` (puede ser negativo)
- **NO** se retiran WBC del usuario automáticamente
- El usuario puede acumular "deuda" en fees que reduce su balance efectivo
- Al hacer close, si `fees_earned < 0`, el usuario necesita más WBC acumulado para cubrir el capital

---

## 12. Checklist de Aprobación

Antes de proceder con la implementación, confirmar:

- [ ] Lógica de flujos correcta (activar, fees diarios, collect, close)
- [ ] Contrato WBC con restricciones de transferencia correctas
- [ ] Auto-renovación en cierre sin WBC suficiente
- [ ] Fees negativos NO retiran WBC automáticamente
- [ ] Supply inicial calculado correctamente
- [ ] Orden de fases de despliegue correcto

---

**Documento preparado por:** Claude Code
**Fecha de actualización:** 24 de Enero de 2026
**Versión:** 2.0
**Estado:** Pendiente de aprobación final

