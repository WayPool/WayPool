# Sistema de Distribución Diaria de APR - WayPool

## Resumen

Este sistema calcula el APR promedio de los 4 pools de Uniswap configurados, aplica un descuento según el timeframe de cada posición, y distribuye automáticamente los rendimientos diarios a todas las posiciones activas.

## Fórmula de Cálculo

### 1. APR Promedio de Pools
```
APR_promedio = (APR_pool1 + APR_pool2 + APR_pool3 + APR_pool4) / 4
```

**Pools actuales:**
- USDT-ETH (0.3% tier)
- USDC/ETH (0.05% tier)
- ETH-DAI (0.3% tier)
- WBTC/USDC (0.3% tier)

### 2. Ajuste por Timeframe
Cada posición tiene un timeframe (30, 90 o 365 días) que aplica un descuento al APR:

| Timeframe | Descuento | Ejemplo (APR base 11%) |
|-----------|-----------|------------------------|
| 30 días   | -24.56%   | 11% - 24.56% = -13.56% |
| 90 días   | -17.37%   | 11% - 17.37% = -6.37%  |
| 365 días  | -4.52%    | 11% - 4.52% = 6.48%    |

```
APR_ajustado = APR_promedio + adjustment_percentage
```

> **Nota:** Los ajustes son negativos, por lo que se restan del APR base.

### 3. Rendimiento Diario
```
Rendimiento_diario = (Capital × APR_ajustado) / 365
```

**Ejemplo:**
- Capital: $10,000 USDC
- APR ajustado: 6.48% (365 días)
- Rendimiento diario: (10,000 × 0.0648) / 365 = **$1.77/día**

### 4. APR Negativo
Si el APR ajustado es negativo, el rendimiento diario se resta del `feesEarned` de la posición. El sistema no permite que `feesEarned` sea menor que 0.

## Arquitectura

### Archivos Principales

| Archivo | Descripción |
|---------|-------------|
| `server/daily-apr-distribution-service.ts` | Servicio principal de cálculo y distribución |
| `server/daily-apr-cron.ts` | Sistema de programación (cron) para ejecución automática |
| `server/routes.ts` | Endpoints API para gestión del sistema |

### Base de Datos

#### Tabla `position_history`
Campo actualizado: `fees_earned` - Se suma/resta el rendimiento diario calculado.

#### Tabla `timeframe_adjustments`
Contiene los porcentajes de ajuste por timeframe:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `timeframe` | integer | Días (30, 90, 365) |
| `adjustment_percentage` | decimal | Porcentaje de ajuste |
| `description` | text | Descripción del ajuste |
| `updated_at` | timestamp | Última actualización |
| `updated_by` | text | Wallet del admin que modificó |

## API Endpoints

### GET `/api/superadmin/daily-apr/status`
Obtiene el estado actual del sistema de distribución diaria.

**Respuesta:**
```json
{
  "success": true,
  "cron": {
    "enabled": true,
    "isRunning": false,
    "lastRun": {
      "date": "2026-01-18",
      "success": true,
      "totalDistributed": 125.43,
      "positionsUpdated": 15
    },
    "nextRunIn": "8h 23m"
  },
  "system": {
    "pools": [...],
    "averageApr": 11.03,
    "timeframeAdjustments": [...],
    "activePositionsCount": 15,
    "totalActiveCapital": 150000
  }
}
```

### GET `/api/superadmin/daily-apr/preview`
Vista previa de la distribución sin ejecutarla (dry run).

**Respuesta:**
```json
{
  "success": true,
  "preview": {
    "date": "2026-01-18",
    "averagePoolApr": 11.03,
    "poolsData": [
      {"name": "USDT-ETH", "apr": 8.7, "tvl": 32000000},
      {"name": "USDC/ETH", "apr": 23.5, "tvl": 150000000},
      ...
    ],
    "distributionsByTimeframe": {
      "30": {
        "adjustmentApplied": -24.56,
        "adjustedApr": -13.53,
        "positionsUpdated": 3,
        "totalDistributed": -12.34
      },
      "90": {...},
      "365": {...}
    },
    "totalPositionsUpdated": 15,
    "totalDistributed": 85.67
  }
}
```

### POST `/api/superadmin/daily-apr/execute`
Ejecuta la distribución manualmente.

**Respuesta:**
```json
{
  "success": true,
  "result": {
    "date": "2026-01-18",
    "totalPositionsUpdated": 15,
    "totalDistributed": 125.43,
    "averagePoolApr": 11.03
  }
}
```

### GET `/api/superadmin/daily-apr/pools`
Obtiene información de los APR de los pools.

**Respuesta:**
```json
{
  "success": true,
  "averageApr": 11.03,
  "pools": [
    {"name": "USDT-ETH", "apr": 8.7, "tvl": 32000000},
    {"name": "USDC/ETH", "apr": 23.5, "tvl": 150000000},
    {"name": "ETH-DAI", "apr": 11.2, "tvl": 45000000},
    {"name": "WBTC/USDC", "apr": 0.7, "tvl": 28000000}
  ]
}
```

### POST `/api/superadmin/daily-apr/cron/:action`
Controla el sistema de cron (start/stop).

**Parámetros:**
- `action`: `start` o `stop`

**Respuesta:**
```json
{
  "success": true,
  "message": "Daily APR cron started"
}
```

## Ejecución Automática

El sistema se ejecuta automáticamente a **medianoche UTC** cada día.

### Iniciar/Detener

#### Mediante API
```bash
# Iniciar
curl -X POST "/api/superadmin/daily-apr/cron/start" \
  -H "X-Wallet-Address: 0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F"

# Detener
curl -X POST "/api/superadmin/daily-apr/cron/stop" \
  -H "X-Wallet-Address: 0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F"
```

#### Mediante Variable de Entorno
```bash
# Deshabilitar al iniciar
DAILY_APR_DISTRIBUTION_ENABLED=false npm start
```

## Flujo de Ejecución

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Medianoche UTC │────▶│  Obtener APR    │────▶│  Calcular       │
│  (Cron trigger) │     │  de los 4 pools │     │  promedio       │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Actualizar     │◀────│  Calcular       │◀────│  Obtener        │
│  feesEarned     │     │  rendimiento    │     │  posiciones     │
│  por posición   │     │  diario         │     │  activas        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Logs

El sistema genera logs detallados:

```
[2026-01-18T00:00:00.000Z] [DailyAPR] [INFO] === Iniciando distribución diaria de APR para 2026-01-18 ===
[2026-01-18T00:00:01.234Z] [DailyAPR] [INFO] APR promedio de 4 pools: 11.03%
[2026-01-18T00:00:01.235Z] [DailyAPR] [INFO]   - USDT-ETH: 8.70% (TVL: $32,000,000)
[2026-01-18T00:00:01.236Z] [DailyAPR] [INFO]   - USDC/ETH: 23.50% (TVL: $150,000,000)
[2026-01-18T00:00:01.237Z] [DailyAPR] [INFO]   - ETH-DAI: 11.20% (TVL: $45,000,000)
[2026-01-18T00:00:01.238Z] [DailyAPR] [INFO]   - WBTC/USDC: 0.70% (TVL: $28,000,000)
[2026-01-18T00:00:02.345Z] [DailyAPR] [INFO] Posiciones activas encontradas: 15
[2026-01-18T00:00:02.456Z] [DailyAPR] [INFO]   Posición #1: Capital=$10,000, Timeframe=365d, APR=6.51%, Yield=1.7836
[2026-01-18T00:00:02.567Z] [DailyAPR] [INFO]   Posición #2: Capital=$5,000, Timeframe=90d, APR=-6.34%, Yield=-0.8685
...
[2026-01-18T00:00:05.678Z] [DailyAPR] [INFO] === Distribución completada ===
[2026-01-18T00:00:05.679Z] [DailyAPR] [INFO]   APR promedio pools: 11.03%
[2026-01-18T00:00:05.680Z] [DailyAPR] [INFO]   Posiciones actualizadas: 15
[2026-01-18T00:00:05.681Z] [DailyAPR] [INFO]   Total distribuido: $125.43
```

## Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DAILY_APR_DISTRIBUTION_ENABLED` | Habilitar/deshabilitar el cron | `true` |

### Ajustes de Timeframe

Los ajustes se pueden modificar desde el panel de administración:
`/admin?tab=timeframe-adjustments`

O mediante API:
```bash
curl -X PUT "/api/admin/timeframe-adjustments/365" \
  -H "Content-Type: application/json" \
  -H "X-Wallet-Address: 0x..." \
  -d '{"adjustmentPercentage": -4.52}'
```

## Consideraciones de Seguridad

1. **Solo SuperAdmin** puede ejecutar manualmente la distribución
2. **Auditoría completa** de todas las ejecuciones en logs
3. **No permite fees negativos** - el mínimo es 0
4. **Validación de datos** antes de cada distribución

## Troubleshooting

### El cron no se ejecuta
1. Verificar que `DAILY_APR_DISTRIBUTION_ENABLED` no sea `false`
2. Revisar logs del servidor para errores
3. Verificar que el servidor esté activo a medianoche UTC

### APR de pools incorrectos
1. Verificar conexión con DexScreener API
2. Revisar que los pools estén activos en la tabla `custom_pools`
3. Verificar que las direcciones de los pools sean correctas

### Distribución no actualiza posiciones
1. Verificar que existan posiciones con `status = 'Active'`
2. Revisar permisos de escritura en la base de datos
3. Verificar que `depositedUSDC` tenga valores válidos

---

*Sistema implementado: 2026-01-18*
*Última actualización: 2026-01-18*
