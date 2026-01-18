/**
 * Daily APR Distribution Cron Job
 *
 * Este módulo configura la ejecución automática diaria de la distribución de APR.
 * Se ejecuta todos los días a la medianoche UTC.
 *
 * También proporciona funciones para ejecutar manualmente y verificar el estado.
 */

import { executeDailyAprDistribution, previewDailyDistribution, getAprSystemInfo } from './daily-apr-distribution-service';
import { db } from './db';
import { eq } from 'drizzle-orm';

// Logging helper
function log(message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [DailyAPR-Cron] [${level}] ${message}`);
}

// Variable para almacenar el estado del último run
let lastRunInfo: {
  date: string;
  success: boolean;
  totalDistributed: number;
  positionsUpdated: number;
  error?: string;
} | null = null;

// Timer reference para poder cancelar
let cronTimer: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Calcula los milisegundos hasta la próxima medianoche UTC
 */
function msUntilMidnightUTC(): number {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ));
  return tomorrow.getTime() - now.getTime();
}

/**
 * Ejecuta la distribución diaria
 */
async function runDailyDistribution(): Promise<void> {
  if (isRunning) {
    log('Distribución ya en ejecución, saltando...', 'WARN');
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    log('=== Iniciando distribución diaria programada ===');

    const result = await executeDailyAprDistribution('cron-system');

    lastRunInfo = {
      date: result.date,
      success: result.success,
      totalDistributed: result.totalDistributed,
      positionsUpdated: result.totalPositionsUpdated,
      error: result.errorMessage,
    };

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (result.success) {
      log(`Distribución completada exitosamente en ${duration}s`);
      log(`  - Posiciones actualizadas: ${result.totalPositionsUpdated}`);
      log(`  - Total distribuido: $${result.totalDistributed.toFixed(2)}`);
      log(`  - APR promedio pools: ${result.averagePoolApr}%`);
    } else {
      log(`Distribución falló: ${result.errorMessage}`, 'ERROR');
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    log(`Error crítico en distribución: ${errorMsg}`, 'ERROR');

    lastRunInfo = {
      date: new Date().toISOString().split('T')[0],
      success: false,
      totalDistributed: 0,
      positionsUpdated: 0,
      error: errorMsg,
    };
  } finally {
    isRunning = false;
  }
}

/**
 * Programa la próxima ejecución a medianoche UTC
 */
function scheduleNextRun(): void {
  const msUntilRun = msUntilMidnightUTC();
  const hoursUntilRun = (msUntilRun / (1000 * 60 * 60)).toFixed(2);

  log(`Próxima distribución programada en ${hoursUntilRun} horas (medianoche UTC)`);

  cronTimer = setTimeout(async () => {
    await runDailyDistribution();
    // Re-programar para el día siguiente
    scheduleNextRun();
  }, msUntilRun);
}

/**
 * Inicia el sistema de cron
 */
export function startDailyAprCron(): void {
  log('Iniciando sistema de distribución diaria de APR...');

  // Verificar si el servicio está habilitado
  const enabled = process.env.DAILY_APR_DISTRIBUTION_ENABLED !== 'false';

  if (!enabled) {
    log('Sistema de distribución diaria DESHABILITADO por configuración', 'WARN');
    return;
  }

  // Programar la primera ejecución
  scheduleNextRun();

  log('Sistema de distribución diaria de APR iniciado correctamente');
}

/**
 * Detiene el sistema de cron
 */
export function stopDailyAprCron(): void {
  if (cronTimer) {
    clearTimeout(cronTimer);
    cronTimer = null;
    log('Sistema de distribución diaria detenido');
  }
}

/**
 * Ejecuta la distribución manualmente (para uso desde API)
 */
export async function executeManualDistribution(executedBy: string): Promise<{
  success: boolean;
  result: any;
  error?: string;
}> {
  try {
    log(`Ejecución manual solicitada por: ${executedBy}`);
    const result = await executeDailyAprDistribution(executedBy);

    lastRunInfo = {
      date: result.date,
      success: result.success,
      totalDistributed: result.totalDistributed,
      positionsUpdated: result.totalPositionsUpdated,
      error: result.errorMessage,
    };

    return { success: result.success, result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { success: false, result: null, error: errorMsg };
  }
}

/**
 * Obtiene el estado actual del sistema de cron
 */
export function getCronStatus(): {
  enabled: boolean;
  isRunning: boolean;
  lastRun: typeof lastRunInfo;
  nextRunIn: string;
} {
  const msUntil = msUntilMidnightUTC();
  const hours = Math.floor(msUntil / (1000 * 60 * 60));
  const minutes = Math.floor((msUntil % (1000 * 60 * 60)) / (1000 * 60));

  return {
    enabled: cronTimer !== null,
    isRunning,
    lastRun: lastRunInfo,
    nextRunIn: `${hours}h ${minutes}m`,
  };
}

/**
 * Obtiene una vista previa de la distribución sin ejecutarla
 */
export async function getDistributionPreview() {
  return previewDailyDistribution();
}

/**
 * Obtiene información completa del sistema de APR
 */
export async function getSystemInfo() {
  return getAprSystemInfo();
}

export default {
  startDailyAprCron,
  stopDailyAprCron,
  executeManualDistribution,
  getCronStatus,
  getDistributionPreview,
  getSystemInfo,
};
