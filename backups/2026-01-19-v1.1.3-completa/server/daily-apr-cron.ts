/**
 * Daily APR Distribution Cron Job
 *
 * Este módulo configura la ejecución automática diaria de la distribución de APR.
 * Se ejecuta todos los días a la medianoche UTC.
 *
 * También proporciona funciones para ejecutar manualmente y verificar el estado.
 * Incluye sistema de alertas por email para éxitos y fallos.
 */

import { executeDailyAprDistribution, previewDailyDistribution, getAprSystemInfo } from './daily-apr-distribution-service';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { emailService } from './email-service';

// Email de alertas
const ALERT_EMAIL = 'lballanti.lb@gmail.com';

// Logging helper
function log(message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [DailyAPR-Cron] [${level}] ${message}`);
}

/**
 * Envía alerta por email sobre el resultado de la distribución
 */
async function sendDistributionAlert(
  success: boolean,
  data: {
    date: string;
    positionsUpdated: number;
    totalDistributed: number;
    averagePoolApr?: number;
    poolsData?: Array<{ name: string; apr: number; tvl: number }>;
    error?: string;
    executedBy?: string;
  }
): Promise<void> {
  try {
    const dateTime = new Date().toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Europe/Madrid'
    });

    const statusColor = success ? '#22c55e' : '#ef4444';
    const statusText = success ? 'EXITOSA' : 'FALLIDA';
    const statusEmoji = success ? '✅' : '❌';

    let poolsHtml = '';
    if (data.poolsData && data.poolsData.length > 0) {
      poolsHtml = `
        <tr>
          <td style="padding: 20px 24px;">
            <h3 style="color: #e2e8f0; margin: 0 0 12px 0; font-size: 14px;">APR de Pools:</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 8px;">
              <tr style="border-bottom: 1px solid #334155;">
                <th style="padding: 10px; text-align: left; color: #94a3b8; font-size: 12px;">Pool</th>
                <th style="padding: 10px; text-align: right; color: #94a3b8; font-size: 12px;">APR</th>
                <th style="padding: 10px; text-align: right; color: #94a3b8; font-size: 12px;">TVL</th>
              </tr>
              ${data.poolsData.map(p => `
                <tr style="border-bottom: 1px solid #334155;">
                  <td style="padding: 10px; color: #e2e8f0; font-size: 13px;">${p.name}</td>
                  <td style="padding: 10px; text-align: right; color: #22c55e; font-size: 13px;">${p.apr.toFixed(2)}%</td>
                  <td style="padding: 10px; text-align: right; color: #94a3b8; font-size: 13px;">$${p.tvl.toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr>
                <td style="padding: 10px; color: #e2e8f0; font-size: 13px; font-weight: 600;">PROMEDIO</td>
                <td style="padding: 10px; text-align: right; color: #3b82f6; font-size: 13px; font-weight: 600;">${data.averagePoolApr?.toFixed(2)}%</td>
                <td style="padding: 10px;"></td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    }

    const errorHtml = data.error ? `
      <tr>
        <td style="padding: 0 24px 20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #450a0a; border-radius: 8px; border-left: 3px solid #ef4444;">
            <tr>
              <td style="padding: 16px;">
                <p style="color: #fca5a5; font-size: 12px; font-weight: 600; margin: 0 0 8px 0;">ERROR:</p>
                <p style="color: #fecaca; font-size: 13px; margin: 0; font-family: monospace;">${data.error}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    ` : '';

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta APR Distribution - WayPool</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${statusColor} 0%, ${success ? '#16a34a' : '#dc2626'} 100%); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">${statusEmoji} Distribución APR ${statusText}</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">WayPool - Sistema Automático</p>
            </td>
          </tr>
          <!-- Summary -->
          <tr>
            <td style="padding: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px; background-color: #0f172a; border-radius: 8px; text-align: center;">
                    <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; margin: 0 0 4px 0;">Fecha</p>
                    <p style="color: #e2e8f0; font-size: 14px; margin: 0; font-weight: 600;">${data.date}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Stats -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 8px;">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; margin: 0 0 4px 0;">Posiciones</p>
                          <p style="color: #3b82f6; font-size: 28px; margin: 0; font-weight: 700;">${data.positionsUpdated}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" style="padding-left: 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 8px;">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; margin: 0 0 4px 0;">Distribuido</p>
                          <p style="color: #22c55e; font-size: 28px; margin: 0; font-weight: 700;">$${data.totalDistributed.toFixed(2)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${poolsHtml}
          ${errorHtml}
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px 24px; border-top: 1px solid #334155;">
              <p style="color: #64748b; font-size: 11px; margin: 0; text-align: center;">
                Ejecutado: ${dateTime}${data.executedBy ? ` por ${data.executedBy}` : ' (Automático)'}<br>
                WayPool - Sistema de Distribución APR
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await emailService.sendEmail({
      to: ALERT_EMAIL,
      subject: `${statusEmoji} WayPool APR Distribution ${statusText} - ${data.date}`,
      html
    });

    log(`Alerta enviada a ${ALERT_EMAIL}`);
  } catch (error) {
    log(`Error enviando alerta por email: ${error}`, 'ERROR');
  }
}

/**
 * Envía alerta de prueba
 */
export async function sendTestAlert(): Promise<boolean> {
  try {
    await sendDistributionAlert(true, {
      date: new Date().toISOString().split('T')[0],
      positionsUpdated: 133,
      totalDistributed: 2086.68,
      averagePoolApr: 34.50,
      poolsData: [
        { name: 'ETH-DAI', apr: 31.80, tvl: 1692566.44 },
        { name: 'USDC/ETH', apr: 59.70, tvl: 77068619.30 },
        { name: 'USDT-ETH', apr: 38.30, tvl: 116633404.73 },
        { name: 'WBTC/USDC', apr: 8.20, tvl: 46649611.81 }
      ],
      executedBy: 'test-manual'
    });
    return true;
  } catch (error) {
    log(`Error enviando alerta de prueba: ${error}`, 'ERROR');
    return false;
  }
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

      // Enviar alerta de éxito
      await sendDistributionAlert(true, {
        date: result.date,
        positionsUpdated: result.totalPositionsUpdated,
        totalDistributed: result.totalDistributed,
        averagePoolApr: result.averagePoolApr,
        poolsData: result.poolsData,
        executedBy: 'cron-system'
      });
    } else {
      log(`Distribución falló: ${result.errorMessage}`, 'ERROR');

      // Enviar alerta de error
      await sendDistributionAlert(false, {
        date: result.date,
        positionsUpdated: 0,
        totalDistributed: 0,
        error: result.errorMessage,
        executedBy: 'cron-system'
      });
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

    // Enviar alerta de error crítico
    await sendDistributionAlert(false, {
      date: new Date().toISOString().split('T')[0],
      positionsUpdated: 0,
      totalDistributed: 0,
      error: `Error crítico: ${errorMsg}`,
      executedBy: 'cron-system'
    });
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
  sendTestAlert,
};
