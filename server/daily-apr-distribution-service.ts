/**
 * Daily APR Distribution Service
 *
 * Este servicio calcula el APR promedio de los 4 pools de Uniswap,
 * aplica el descuento según el timeframe de cada posición,
 * y distribuye los rendimientos diariamente a todas las posiciones activas.
 *
 * Fórmula:
 * 1. APR_promedio = (APR_pool1 + APR_pool2 + APR_pool3 + APR_pool4) / 4
 * 2. APR_ajustado = APR_promedio - timeframe_adjustment
 * 3. Rendimiento_diario = (Capital * APR_ajustado) / 365
 *
 * Si APR_ajustado es negativo, se resta de feesEarned.
 */

import { db } from './db';
import { positionHistory, timeframeAdjustments } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';
import { getUniswapPoolData } from './uniswap-data-service';
import { storage } from './storage';
import { getWBCTokenService } from './wbc-token-service';

// Delay between WBC token sends to avoid RPC rate limiting (15 seconds)
const WBC_SEND_DELAY_MS = 15000;

/**
 * Helper function to wait for a specified time
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Logging helper
function log(message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [DailyAPR] [${level}] ${message}`);
}

/**
 * Interface para el resultado de la distribución diaria
 */
interface DailyDistributionResult {
  success: boolean;
  date: string;
  averagePoolApr: number;
  poolsData: Array<{
    name: string;
    apr: number;
    tvl: number;
  }>;
  distributionsByTimeframe: {
    [timeframe: number]: {
      adjustmentApplied: number;
      adjustedApr: number;
      positionsUpdated: number;
      totalDistributed: number;
    };
  };
  totalPositionsUpdated: number;
  totalDistributed: number;
  errorMessage?: string;
}

/**
 * Interface para el historial de distribuciones
 */
interface DailyAprDistributionRecord {
  date: string;
  averagePoolApr: number;
  poolsSnapshot: Array<{ name: string; apr: number }>;
  distributionDetails: {
    timeframe: number;
    adjustment: number;
    adjustedApr: number;
    positionsCount: number;
    totalDistributed: number;
  }[];
  totalDistributed: number;
  executedAt: string;
  executedBy: string;
}

/**
 * Obtiene el APR real de todos los pools activos
 */
export async function getPoolsApr(): Promise<Array<{ name: string; apr: number; tvl: number; address: string }>> {
  try {
    const pools = await storage.getActiveCustomPools();

    const poolsWithApr = await Promise.all(
      pools.map(async (pool) => {
        try {
          const poolData = await getUniswapPoolData(pool.address, pool.network || 'ethereum');
          return {
            name: pool.name,
            address: pool.address,
            apr: poolData.apr || 0,
            tvl: poolData.tvl || 0,
          };
        } catch (error) {
          log(`Error obteniendo APR para pool ${pool.name}: ${error}`, 'ERROR');
          return {
            name: pool.name,
            address: pool.address,
            apr: 0,
            tvl: 0,
          };
        }
      })
    );

    return poolsWithApr;
  } catch (error) {
    log(`Error obteniendo pools: ${error}`, 'ERROR');
    return [];
  }
}

/**
 * Calcula el APR promedio de todos los pools
 */
export async function calculateAveragePoolApr(): Promise<{ average: number; pools: Array<{ name: string; apr: number; tvl: number }> }> {
  const pools = await getPoolsApr();

  if (pools.length === 0) {
    return { average: 0, pools: [] };
  }

  const totalApr = pools.reduce((sum, pool) => sum + pool.apr, 0);
  const averageApr = totalApr / pools.length;

  log(`APR promedio de ${pools.length} pools: ${averageApr.toFixed(2)}%`);
  pools.forEach(p => log(`  - ${p.name}: ${p.apr.toFixed(2)}% (TVL: $${p.tvl.toLocaleString()})`));

  return {
    average: parseFloat(averageApr.toFixed(2)),
    pools: pools.map(p => ({ name: p.name, apr: p.apr, tvl: p.tvl })),
  };
}

/**
 * Obtiene los ajustes de timeframe de la base de datos
 */
export async function getTimeframeAdjustmentsMap(): Promise<Map<number, number>> {
  try {
    const adjustments = await db.select().from(timeframeAdjustments);
    const adjustmentMap = new Map<number, number>();

    adjustments.forEach(adj => {
      adjustmentMap.set(adj.timeframe, parseFloat(adj.adjustmentPercentage));
    });

    log(`Ajustes de timeframe cargados: ${adjustments.length}`);
    adjustments.forEach(adj => {
      log(`  - ${adj.timeframe} días: ${adj.adjustmentPercentage}%`);
    });

    return adjustmentMap;
  } catch (error) {
    log(`Error cargando ajustes de timeframe: ${error}`, 'ERROR');
    // Valores por defecto
    const defaultMap = new Map<number, number>();
    defaultMap.set(30, -24.56);
    defaultMap.set(90, -17.37);
    defaultMap.set(365, -4.52);
    return defaultMap;
  }
}

/**
 * Calcula el APR ajustado según el timeframe
 * @param baseApr APR base (promedio de pools)
 * @param timeframe Timeframe de la posición (30, 90, 365)
 * @param adjustmentMap Mapa de ajustes por timeframe
 * @returns APR ajustado (puede ser negativo)
 */
export function calculateAdjustedApr(
  baseApr: number,
  timeframe: number,
  adjustmentMap: Map<number, number>
): number {
  // Obtener el ajuste para el timeframe (negativo = descuento)
  const adjustment = adjustmentMap.get(timeframe) || 0;

  // El ajuste ya es negativo (ej: -24.56), así que sumamos
  // baseApr + adjustment = baseApr - |adjustment|
  const adjustedApr = baseApr + adjustment;

  return parseFloat(adjustedApr.toFixed(4));
}

/**
 * Calcula el rendimiento diario para una posición
 * @param capital Capital depositado en USDC
 * @param annualApr APR anual ajustado (puede ser negativo)
 * @returns Rendimiento diario (puede ser negativo)
 */
export function calculateDailyYield(capital: number, annualApr: number): number {
  // Rendimiento diario = (Capital * APR%) / 365
  const dailyYield = (capital * annualApr / 100) / 365;
  return parseFloat(dailyYield.toFixed(6));
}

/**
 * Obtiene todas las posiciones activas
 */
async function getActivePositions() {
  try {
    return await db
      .select()
      .from(positionHistory)
      .where(eq(positionHistory.status, 'Active'));
  } catch (error) {
    log(`Error obteniendo posiciones activas: ${error}`, 'ERROR');
    return [];
  }
}

/**
 * Actualiza el feesEarned y currentApr de una posición
 */
async function updatePositionFeesAndApr(
  positionId: number,
  newFeesEarned: number,
  currentApr: number
): Promise<boolean> {
  try {
    await db
      .update(positionHistory)
      .set({
        feesEarned: newFeesEarned.toFixed(2),
        currentApr: currentApr.toFixed(2),
        lastAprUpdate: new Date(),
      })
      .where(eq(positionHistory.id, positionId));
    return true;
  } catch (error) {
    log(`Error actualizando fees/APR de posición ${positionId}: ${error}`, 'ERROR');
    return false;
  }
}

/**
 * Ejecuta la distribución diaria de APR
 * @param executedBy Wallet del administrador que ejecuta (para auditoría)
 * @param dryRun Si es true, solo calcula sin actualizar la base de datos
 */
export async function executeDailyAprDistribution(
  executedBy: string = 'system',
  dryRun: boolean = false
): Promise<DailyDistributionResult> {
  const today = new Date().toISOString().split('T')[0];
  log(`=== Iniciando distribución diaria de APR para ${today} ===`);

  if (dryRun) {
    log('MODO DRY RUN - No se actualizará la base de datos');
  }

  const result: DailyDistributionResult = {
    success: false,
    date: today,
    averagePoolApr: 0,
    poolsData: [],
    distributionsByTimeframe: {},
    totalPositionsUpdated: 0,
    totalDistributed: 0,
  };

  try {
    // 1. Obtener APR promedio de los pools
    const { average, pools } = await calculateAveragePoolApr();
    result.averagePoolApr = average;
    result.poolsData = pools;

    if (pools.length === 0) {
      result.errorMessage = 'No se encontraron pools activos';
      log(result.errorMessage, 'ERROR');
      return result;
    }

    // 2. Obtener ajustes de timeframe
    const adjustmentMap = await getTimeframeAdjustmentsMap();

    // 3. Obtener posiciones activas
    const activePositions = await getActivePositions();
    log(`Posiciones activas encontradas: ${activePositions.length}`);

    if (activePositions.length === 0) {
      result.success = true;
      result.errorMessage = 'No hay posiciones activas para distribuir';
      log(result.errorMessage, 'WARN');
      return result;
    }

    // 4. Procesar cada posición
    const timeframeStats: { [timeframe: number]: { positions: number; totalYield: number; adjustedApr: number } } = {};

    for (const position of activePositions) {
      const timeframe = position.timeframe || 365;
      const capital = parseFloat(position.depositedUSDC) || 0;
      const currentFees = parseFloat(position.feesEarned || '0');

      // Calcular APR ajustado para este timeframe
      const adjustedApr = calculateAdjustedApr(average, timeframe, adjustmentMap);

      // Calcular rendimiento diario
      const dailyYield = calculateDailyYield(capital, adjustedApr);

      // Calcular nuevos fees (puede ser menor si el APR es negativo)
      const newFeesEarned = currentFees + dailyYield;

      // No permitir fees negativos
      const finalFeesEarned = Math.max(0, newFeesEarned);

      // Log detallado
      log(`  Posición #${position.id}: Capital=$${capital.toLocaleString()}, Timeframe=${timeframe}d, APR=${adjustedApr.toFixed(2)}%, Yield=${dailyYield.toFixed(4)}, Fees: ${currentFees.toFixed(2)} -> ${finalFeesEarned.toFixed(2)}`);

      // Actualizar stats por timeframe
      if (!timeframeStats[timeframe]) {
        timeframeStats[timeframe] = {
          positions: 0,
          totalYield: 0,
          adjustedApr: adjustedApr,
        };
      }
      timeframeStats[timeframe].positions++;
      timeframeStats[timeframe].totalYield += dailyYield;

      // Actualizar en base de datos (si no es dry run)
      if (!dryRun) {
        const updated = await updatePositionFeesAndApr(position.id, finalFeesEarned, adjustedApr);
        if (updated) {
          result.totalPositionsUpdated++;

          // WBC Token: Send WBC tokens for positive daily yield
          if (dailyYield > 0) {
            try {
              const wbcService = getWBCTokenService();

              // Check if WBC is active before adding delay
              if (wbcService.isActive()) {
                log(`  ⏳ WBC: Waiting ${WBC_SEND_DELAY_MS / 1000}s before sending to avoid rate limiting...`);
                await delay(WBC_SEND_DELAY_MS);
              }

              const wbcResult = await wbcService.sendTokensOnDailyFees(
                position.id,
                position.walletAddress,
                dailyYield
              );

              if (wbcResult.success) {
                log(`  ✅ WBC: Sent ${dailyYield.toFixed(6)} WBC to ${position.walletAddress.substring(0, 10)}...`);
              } else if (wbcResult.skipped) {
                // WBC not active, skip silently
              } else {
                log(`  ⚠️ WBC: Failed to send tokens for position ${position.id}: ${wbcResult.error}`, 'WARN');
              }
            } catch (wbcError) {
              // Don't block distribution if WBC fails
              log(`  ⚠️ WBC error for position ${position.id}: ${wbcError}`, 'WARN');
            }
          }
        }
      } else {
        result.totalPositionsUpdated++;
      }

      result.totalDistributed += dailyYield;
    }

    // 5. Compilar resultado por timeframe
    for (const [timeframe, stats] of Object.entries(timeframeStats)) {
      const tf = parseInt(timeframe);
      const adjustment = adjustmentMap.get(tf) || 0;

      result.distributionsByTimeframe[tf] = {
        adjustmentApplied: adjustment,
        adjustedApr: stats.adjustedApr,
        positionsUpdated: stats.positions,
        totalDistributed: parseFloat(stats.totalYield.toFixed(6)),
      };
    }

    result.success = true;

    // Log resumen
    log(`=== Distribución completada ===`);
    log(`  APR promedio pools: ${result.averagePoolApr}%`);
    log(`  Posiciones actualizadas: ${result.totalPositionsUpdated}`);
    log(`  Total distribuido: $${result.totalDistributed.toFixed(2)}`);

    for (const [tf, data] of Object.entries(result.distributionsByTimeframe)) {
      log(`  Timeframe ${tf}d: APR ajustado ${data.adjustedApr.toFixed(2)}%, ${data.positionsUpdated} posiciones, $${data.totalDistributed.toFixed(2)}`);
    }

    return result;

  } catch (error) {
    result.errorMessage = `Error ejecutando distribución: ${error}`;
    log(result.errorMessage, 'ERROR');
    return result;
  }
}

/**
 * Obtiene una vista previa de la distribución sin ejecutarla
 */
export async function previewDailyDistribution(): Promise<DailyDistributionResult> {
  return executeDailyAprDistribution('preview', true);
}

/**
 * Información actual del sistema de APR
 */
export async function getAprSystemInfo(): Promise<{
  pools: Array<{ name: string; apr: number; tvl: number }>;
  averageApr: number;
  timeframeAdjustments: Array<{ timeframe: number; adjustment: number; adjustedApr: number }>;
  activePositionsCount: number;
  totalActiveCapital: number;
}> {
  const { average, pools } = await calculateAveragePoolApr();
  const adjustmentMap = await getTimeframeAdjustmentsMap();
  const activePositions = await getActivePositions();

  const totalCapital = activePositions.reduce((sum, p) => sum + parseFloat(p.depositedUSDC || '0'), 0);

  const adjustments = Array.from(adjustmentMap.entries()).map(([timeframe, adjustment]) => ({
    timeframe,
    adjustment,
    adjustedApr: calculateAdjustedApr(average, timeframe, adjustmentMap),
  }));

  return {
    pools,
    averageApr: average,
    timeframeAdjustments: adjustments,
    activePositionsCount: activePositions.length,
    totalActiveCapital: totalCapital,
  };
}

export default {
  executeDailyAprDistribution,
  previewDailyDistribution,
  getAprSystemInfo,
  calculateAveragePoolApr,
  getPoolsApr,
};
