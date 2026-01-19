/**
 * Rutas API para manejo de transferencias de wallets externos
 * Integración con MetaMask, Coinbase Wallet y otros wallets Web3
 */

import { Router } from 'express';
import { walletTransferService } from './wallet-transfer-service.js';
import type { TransferData, TransferReceipt } from './wallet-transfer-service.js';

export const walletTransferRouter = Router();

/**
 * Registrar el inicio de una transferencia
 * POST /api/wallet-transfers/record
 */
walletTransferRouter.post('/record', async (req, res) => {
  try {
    const transferData: TransferData = req.body;
    
    // Validaciones básicas
    if (!transferData.txHash || !transferData.fromAddress || !transferData.toAddress) {
      return res.status(400).json({
        error: 'Datos de transferencia incompletos',
        details: 'Se requieren txHash, fromAddress y toAddress'
      });
    }

    if (!transferData.amount || !transferData.network || !transferData.assetSymbol) {
      return res.status(400).json({
        error: 'Datos de transferencia incompletos',
        details: 'Se requieren amount, network y assetSymbol'
      });
    }

    const transferId = await walletTransferService.recordTransferInitiation(transferData);
    
    res.status(201).json({
      success: true,
      transferId,
      message: 'Transferencia registrada exitosamente'
    });
  } catch (error) {
    console.error('Error registrando transferencia:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * Actualizar el estado de una transferencia
 * PUT /api/wallet-transfers/:txHash/status
 */
walletTransferRouter.put('/:txHash/status', async (req, res) => {
  try {
    const { txHash } = req.params;
    const receipt: TransferReceipt = req.body;
    
    if (!receipt.status) {
      return res.status(400).json({
        error: 'Estado de transferencia requerido',
        details: 'Se requiere el campo status'
      });
    }

    await walletTransferService.updateTransferStatus(txHash, receipt);
    
    res.json({
      success: true,
      message: 'Estado de transferencia actualizado'
    });
  } catch (error) {
    console.error('Error actualizando transferencia:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * Obtener historial de transferencias de una wallet
 * GET /api/wallet-transfers/:address/history
 */
walletTransferRouter.get('/:address/history', async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const transfers = await walletTransferService.getWalletTransferHistory(address, limit, offset);
    
    res.json({
      success: true,
      transfers,
      count: transfers.length
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * Obtener transferencias por red
 * GET /api/wallet-transfers/network/:network
 */
walletTransferRouter.get('/network/:network', async (req, res) => {
  try {
    const { network } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;
    
    const transfers = await walletTransferService.getTransfersByNetwork(network, limit);
    
    res.json({
      success: true,
      transfers,
      network,
      count: transfers.length
    });
  } catch (error) {
    console.error('Error obteniendo transferencias por red:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * Obtener transferencias pendientes
 * GET /api/wallet-transfers/pending
 */
walletTransferRouter.get('/pending', async (req, res) => {
  try {
    const transfers = await walletTransferService.getPendingTransfers();
    
    res.json({
      success: true,
      transfers,
      count: transfers.length
    });
  } catch (error) {
    console.error('Error obteniendo transferencias pendientes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * Verificar estado de una transacción en blockchain
 * GET /api/wallet-transfers/:txHash/verify/:network
 */
walletTransferRouter.get('/:txHash/verify/:network', async (req, res) => {
  try {
    const { txHash, network } = req.params;
    
    const receipt = await walletTransferService.checkTransactionStatus(txHash, network);
    
    if (!receipt) {
      return res.status(404).json({
        error: 'Transacción no encontrada',
        details: `No se pudo verificar la transacción ${txHash} en la red ${network}`
      });
    }
    
    res.json({
      success: true,
      receipt,
      txHash,
      network
    });
  } catch (error) {
    console.error('Error verificando transacción:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * Sincronizar transferencias pendientes
 * POST /api/wallet-transfers/sync
 */
walletTransferRouter.post('/sync', async (req, res) => {
  try {
    await walletTransferService.syncPendingTransfers();
    
    res.json({
      success: true,
      message: 'Sincronización de transferencias completada'
    });
  } catch (error) {
    console.error('Error en sincronización:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * Obtener estadísticas de transferencias
 * GET /api/wallet-transfers/stats
 * GET /api/wallet-transfers/stats/:address
 */
walletTransferRouter.get('/stats/:address?', async (req, res) => {
  try {
    const { address } = req.params;
    
    const stats = await walletTransferService.getTransferStats(address);
    
    res.json({
      success: true,
      stats,
      walletAddress: address || 'global'
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default walletTransferRouter;