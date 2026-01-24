/**
 * WayBank v6.0 API Routes
 *
 * IMPORTANTE: Estas rutas son completamente independientes de las rutas existentes.
 * Todas las rutas usan el prefijo /api/v6/ para evitar conflictos.
 *
 * NO modifica ni interactúa con las rutas existentes del proyecto.
 */

import { Router, Request, Response } from "express";
import { createV6NftManager, V6NftManagerService } from "./v6-nft-manager";
import { getV6PositionManager } from "./v6-position-manager";
import { getV6AprService } from "./v6-apr-service";

// ============ CREATE ROUTER ============

export function createV6Routes(db: any): Router {
  const router = Router();
  const nftManager = createV6NftManager(db);
  const positionManager = getV6PositionManager();
  const aprService = getV6AprService();

  // ============ HEALTH CHECK ============

  /**
   * GET /api/v6/health
   * Health check for v6 system
   */
  router.get("/health", async (_req: Request, res: Response) => {
    try {
      res.json({
        status: "ok",
        system: "waybank-v6",
        timestamp: new Date().toISOString(),
        message: "WayBank v6.0 is running",
      });
    } catch (error) {
      res.status(500).json({ error: "Health check failed" });
    }
  });

  // ============ POSITION REGISTRATION ============

  /**
   * POST /api/v6/positions/register
   * Register an existing NFT position for v6 management
   */
  router.post("/positions/register", async (req: Request, res: Response) => {
    try {
      const { tokenId, ownerAddress, enableAutoRebalance, rebalanceThresholdBps, targetRangeWidthTicks } = req.body;

      if (!tokenId || !ownerAddress) {
        return res.status(400).json({
          success: false,
          error: "tokenId and ownerAddress are required",
        });
      }

      const result = await nftManager.registerPosition(tokenId, ownerAddress, {
        enableAutoRebalance,
        rebalanceThresholdBps,
        targetRangeWidthTicks,
      });

      if (result.success) {
        res.json({
          success: true,
          positionId: result.positionId,
          message: `Position ${tokenId} registered successfully`,
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      console.error("[V6 Routes] Error registering position:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * POST /api/v6/positions/unregister
   * Unregister a position from v6 management
   */
  router.post("/positions/unregister", async (req: Request, res: Response) => {
    try {
      const { tokenId, ownerAddress } = req.body;

      if (!tokenId || !ownerAddress) {
        return res.status(400).json({
          success: false,
          error: "tokenId and ownerAddress are required",
        });
      }

      const success = await nftManager.unregisterPosition(tokenId, ownerAddress);

      if (success) {
        res.json({ success: true, message: `Position ${tokenId} unregistered` });
      } else {
        res.status(400).json({ success: false, error: "Failed to unregister position" });
      }
    } catch (error: any) {
      console.error("[V6 Routes] Error unregistering position:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ POSITION QUERIES ============

  /**
   * GET /api/v6/positions/:ownerAddress
   * Get all managed positions for an owner
   */
  router.get("/positions/:ownerAddress", async (req: Request, res: Response) => {
    try {
      const { ownerAddress } = req.params;
      const positions = await nftManager.getPositionsByOwner(ownerAddress);

      res.json({
        success: true,
        count: positions.length,
        positions,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting positions:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * GET /api/v6/position/:tokenId
   * Get a single position with live status
   */
  router.get("/position/:tokenId", async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.params;
      const position = await nftManager.getPositionWithStatus(tokenId);

      if (!position) {
        return res.status(404).json({
          success: false,
          error: `Position ${tokenId} not found`,
        });
      }

      res.json({
        success: true,
        position,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting position:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * GET /api/v6/position/:tokenId/status
   * Get live status from blockchain for a position
   */
  router.get("/position/:tokenId/status", async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.params;
      const status = await positionManager.getPositionStatus(tokenId);

      res.json({
        success: true,
        status,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting position status:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ POSITION SETTINGS ============

  /**
   * PUT /api/v6/position/:tokenId/settings
   * Update position settings
   */
  router.put("/position/:tokenId/settings", async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.params;
      const { ownerAddress, isAutoRebalance, rebalanceThresholdBps, targetRangeWidthTicks } = req.body;

      if (!ownerAddress) {
        return res.status(400).json({
          success: false,
          error: "ownerAddress is required",
        });
      }

      const success = await nftManager.updatePositionSettings(tokenId, ownerAddress, {
        isAutoRebalance,
        rebalanceThresholdBps,
        targetRangeWidthTicks,
      });

      if (success) {
        res.json({ success: true, message: "Settings updated" });
      } else {
        res.status(400).json({ success: false, error: "Failed to update settings" });
      }
    } catch (error: any) {
      console.error("[V6 Routes] Error updating settings:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ FEE HISTORY ============

  /**
   * GET /api/v6/position/:tokenId/fees
   * Get fee collection history for a position
   */
  router.get("/position/:tokenId/fees", async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const history = await nftManager.getFeeHistory(tokenId, limit);

      res.json({
        success: true,
        count: history.length,
        history,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting fee history:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ REBALANCE HISTORY ============

  /**
   * GET /api/v6/position/:tokenId/rebalances
   * Get rebalance history for a position
   */
  router.get("/position/:tokenId/rebalances", async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      const history = await nftManager.getRebalanceHistory(tokenId, limit);

      res.json({
        success: true,
        count: history.length,
        history,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting rebalance history:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ APR DATA ============

  /**
   * GET /api/v6/apr/top-pools
   * Get top pools by APR
   */
  router.get("/apr/top-pools", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await aprService.getTopPoolsByAPR(limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting top pools:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * GET /api/v6/apr/usdc-weth
   * Get USDC/WETH pools APR data
   */
  router.get("/apr/usdc-weth", async (req: Request, res: Response) => {
    try {
      const pools = await aprService.getUsdcWethPools();

      res.json({
        success: true,
        count: pools.length,
        pools,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting USDC/WETH pools:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * GET /api/v6/apr/pool/:poolAddress
   * Get APR data for a specific pool
   */
  router.get("/apr/pool/:poolAddress", async (req: Request, res: Response) => {
    try {
      const { poolAddress } = req.params;
      const poolData = await aprService.getPoolDataFromSubgraph(poolAddress);

      if (!poolData) {
        return res.status(404).json({
          success: false,
          error: "Pool not found",
        });
      }

      res.json({
        success: true,
        pool: poolData,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting pool APR:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ BLOCKCHAIN READS (Direct from existing NFTs) ============

  /**
   * GET /api/v6/blockchain/position/:tokenId
   * Get position data directly from blockchain (works with any NFT)
   */
  router.get("/blockchain/position/:tokenId", async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.params;
      const positionData = await positionManager.getPositionData(tokenId);

      res.json({
        success: true,
        position: positionData,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting blockchain position:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * GET /api/v6/blockchain/position/:tokenId/needs-rebalance
   * Check if a position needs rebalancing
   */
  router.get("/blockchain/position/:tokenId/needs-rebalance", async (req: Request, res: Response) => {
    try {
      const { tokenId } = req.params;
      const thresholdBps = parseInt(req.query.threshold as string) || 500;

      const result = await positionManager.needsRebalance(tokenId, thresholdBps);

      res.json({
        success: true,
        tokenId,
        ...result,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error checking rebalance need:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============ VAULT STATISTICS ============

  /**
   * GET /api/v6/stats
   * Get vault statistics
   */
  router.get("/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await nftManager.getVaultStats();

      res.json({
        success: true,
        stats,
      });
    } catch (error: any) {
      console.error("[V6 Routes] Error getting stats:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}

export default createV6Routes;
