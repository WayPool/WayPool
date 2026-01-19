/**
 * Rutas para monitorear la salud del sistema y verificar estado de bases de datos
 */

import express, { Request, Response } from 'express';
import { checkDatabasesAndFailover, failoverState } from './failover-db';

const router = express.Router();

/**
 * Endpoint para verificar el estado del sistema
 * Responde con 200 OK si todo está bien y 503 Service Unavailable si hay problemas
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    // Verificar estado de las bases de datos
    const status = await checkDatabasesAndFailover();
    
    // Si ambas bases de datos están caídas, responder con error
    if (!status.primaryStatus && !status.secondaryStatus) {
      return res.status(503).json({
        status: 'error',
        message: 'Todas las bases de datos están inaccesibles',
        details: {
          primary: false,
          secondary: false,
          activeDb: failoverState.activeDb,
          lastCheck: failoverState.lastCheckTime
        }
      });
    }
    
    // Si estamos en modo failover (usando la secundaria)
    if (failoverState.inFailoverMode) {
      return res.status(207).json({
        status: 'degraded',
        message: 'Sistema funcionando en modo de respaldo (base de datos secundaria)',
        details: {
          primary: status.primaryStatus,
          secondary: status.secondaryStatus,
          activeDb: failoverState.activeDb,
          lastPrimaryFailure: failoverState.lastPrimaryFailure,
          primaryRecovered: failoverState.primaryRecovered,
          lastSwitchTime: failoverState.lastSwitchTime,
          lastCheck: failoverState.lastCheckTime
        }
      });
    }
    
    // Estado normal - usando la base de datos principal
    return res.status(200).json({
      status: 'healthy',
      message: 'Sistema funcionando correctamente (base de datos principal)',
      details: {
        primary: status.primaryStatus,
        secondary: status.secondaryStatus,
        activeDb: failoverState.activeDb,
        lastCheck: failoverState.lastCheckTime
      }
    });
  } catch (error) {
    console.error('Error al verificar estado del sistema:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al verificar estado del sistema',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Endpoint detallado con información completa del sistema de alta disponibilidad
 * Solo accesible para administradores
 */
router.get('/health/detailed', async (req: Request, res: Response) => {
  try {
    // Verificar si el usuario es administrador
    const user = req.session?.user;
    if (!user?.isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado'
      });
    }
    
    // Verificar estado de las bases de datos
    const status = await checkDatabasesAndFailover();
    
    // Responder con detalles completos
    return res.status(200).json({
      status: 'success',
      message: 'Información detallada del sistema de alta disponibilidad',
      system: {
        state: failoverState.inFailoverMode ? 'failover' : 'normal',
        activeDb: failoverState.activeDb
      },
      databases: {
        primary: {
          status: status.primaryStatus ? 'online' : 'offline',
          region: 'us-east',
          failedAttempts: failoverState.primaryFailedAttempts,
          lastFailure: failoverState.lastPrimaryFailure,
          recovered: failoverState.primaryRecovered
        },
        secondary: {
          status: status.secondaryStatus ? 'online' : 'offline',
          region: 'eu-central',
          failedAttempts: failoverState.secondaryFailedAttempts,
          lastFailure: failoverState.lastSecondaryFailure,
          recovered: failoverState.secondaryRecovered
        }
      },
      history: {
        lastSwitchTime: failoverState.lastSwitchTime,
        lastCheckTime: failoverState.lastCheckTime
      }
    });
  } catch (error) {
    console.error('Error al obtener información detallada:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al obtener información detallada',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Registra las rutas en la aplicación Express
 */
export function registerHealthRoutes(app: express.Express) {
  app.use('/api', router);
}

export default router;