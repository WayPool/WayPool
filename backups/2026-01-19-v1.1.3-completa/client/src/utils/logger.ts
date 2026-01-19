/**
 * Utilidad para gestionar logs de manera centralizada
 * 
 * En producción, solo muestra errores y advertencias mientras que
 * en desarrollo muestra todos los logs para facilitar la depuración
 */

// Detectar si estamos en producción basado en variables de entorno
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Logger centralizado que controla la visualización de logs según el entorno
 */
const logger = {
  /**
   * Log informativo - solo visible en desarrollo
   */
  info: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  
  /**
   * Log de debug con mayor detalle - solo visible en desarrollo
   */
  debug: (...args: any[]) => {
    if (!isProduction) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  /**
   * Log de advertencia - visible en todos los entornos
   */
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  
  /**
   * Log de error - visible en todos los entornos
   */
  error: (...args: any[]) => {
    console.error(...args);
  },
  
  /**
   * Log de operaciones críticas (transacciones, etc.) - visible en todos los entornos
   */
  critical: (...args: any[]) => {
    console.error('[CRITICAL]', ...args);
  },
  
  /**
   * Grupos de logs (solo visible en desarrollo)
   */
  group: (label: string) => {
    if (!isProduction) {
      console.group(label);
    }
  },
  
  /**
   * Finalizar grupo de logs
   */
  groupEnd: () => {
    if (!isProduction) {
      console.groupEnd();
    }
  },
  
  /**
   * Medir tiempo de operaciones (solo en desarrollo)
   */
  time: (label: string) => {
    if (!isProduction) {
      console.time(label);
    }
  },
  
  /**
   * Finalizar medición de tiempo
   */
  timeEnd: (label: string) => {
    if (!isProduction) {
      console.timeEnd(label);
    }
  }
};

export default logger;