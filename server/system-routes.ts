/**
 * System Routes - Health checks, monitoring, and system management
 */

import { Express, Request, Response } from 'express';
import { getRedundancyManager } from './db-redundancy-manager';

/**
 * Register system management routes
 */
export function registerSystemRoutes(app: Express): void {
  console.log('[System Routes] Registering system management endpoints...');

  /**
   * GET /api/system/health
   * Overall system health status
   */
  app.get('/api/system/health', async (_req: Request, res: Response) => {
    try {
      const startTime = Date.now();

      // Basic health check
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        responseTime: 0
      };

      health.responseTime = Date.now() - startTime;

      res.json(health);
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: String(error),
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * GET /api/system/db-health
   * Database redundancy health status
   */
  app.get('/api/system/db-health', async (_req: Request, res: Response) => {
    try {
      // Check if redundancy manager is available
      if (process.env.DATABASE_URL_SECONDARY) {
        const manager = await getRedundancyManager();
        const healthStatus = manager.getHealthStatus();

        res.json({
          success: true,
          redundancyEnabled: true,
          ...healthStatus
        });
      } else {
        // Single database mode
        res.json({
          success: true,
          redundancyEnabled: false,
          message: 'Running in single-database mode (no secondary configured)',
          status: 'healthy'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error),
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * POST /api/system/db-sync
   * Trigger manual database sync (admin only)
   */
  app.post('/api/system/db-sync', async (req: Request, res: Response) => {
    try {
      // TODO: Add admin authentication check here
      const adminWallet = req.body.walletAddress;

      if (!adminWallet) {
        return res.status(401).json({
          success: false,
          message: 'Admin authentication required'
        });
      }

      if (!process.env.DATABASE_URL_SECONDARY) {
        return res.status(400).json({
          success: false,
          message: 'Database redundancy not configured'
        });
      }

      const manager = await getRedundancyManager();
      await manager.forceSync();

      res.json({
        success: true,
        message: 'Database sync completed',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  /**
   * POST /api/system/db-failover
   * Trigger manual failover (admin only - emergency use)
   */
  app.post('/api/system/db-failover', async (req: Request, res: Response) => {
    try {
      const adminWallet = req.body.walletAddress;

      if (!adminWallet) {
        return res.status(401).json({
          success: false,
          message: 'Admin authentication required'
        });
      }

      if (!process.env.DATABASE_URL_SECONDARY) {
        return res.status(400).json({
          success: false,
          message: 'Database redundancy not configured'
        });
      }

      console.log(`[System] Manual failover triggered by ${adminWallet}`);

      const manager = await getRedundancyManager();
      await manager.forceFailover();

      res.json({
        success: true,
        message: 'Failover completed - now using secondary database',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  /**
   * POST /api/system/db-failback
   * Trigger manual failback (admin only)
   */
  app.post('/api/system/db-failback', async (req: Request, res: Response) => {
    try {
      const adminWallet = req.body.walletAddress;

      if (!adminWallet) {
        return res.status(401).json({
          success: false,
          message: 'Admin authentication required'
        });
      }

      if (!process.env.DATABASE_URL_SECONDARY) {
        return res.status(400).json({
          success: false,
          message: 'Database redundancy not configured'
        });
      }

      console.log(`[System] Manual failback triggered by ${adminWallet}`);

      const manager = await getRedundancyManager();
      await manager.forceFailback();

      res.json({
        success: true,
        message: 'Failback completed - now using primary database',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: String(error)
      });
    }
  });

  /**
   * GET /api/system/version
   * Get application version
   */
  app.get('/api/system/version', (_req: Request, res: Response) => {
    res.json({
      name: 'WayBank',
      version: process.env.APP_VERSION || '1.1.3',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    });
  });

  console.log('[System Routes] System management endpoints registered');
}
