/**
 * Servicio de transferencias para wallets externos
 * Registra y monitorea transferencias de MetaMask, Coinbase Wallet, etc.
 */

import { pool } from '../db';
import type { WalletTransferHistory, InsertWalletTransferHistory } from '../../shared/schema.js';
import { ethers } from 'ethers';

export interface TransferData {
  txHash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  network: string;
  chainId: number;
  transferType: 'NATIVE' | 'ERC20' | 'ERC721' | 'ERC1155';
  assetAddress?: string;
  assetSymbol: string;
  assetName?: string;
  assetDecimals?: number;
  tokenId?: string;
  tokenStandard?: string;
  walletType?: string;
  memo?: string;
  isSwap?: boolean;
  swapData?: any;
}

export interface TransferReceipt {
  blockNumber?: number;
  blockHash?: string;
  transactionIndex?: number;
  gasUsed?: string;
  gasPrice?: string;
  effectiveGasPrice?: string;
  confirmations?: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED' | 'DROPPED';
}

export class WalletTransferService {
  private providers: Record<string, ethers.JsonRpcProvider> = {};

  constructor() {
    // Configurar proveedores para diferentes redes
    this.setupProviders();
  }

  /**
   * Configurar proveedores RPC para diferentes redes
   */
  private setupProviders() {
    const alchemyKey = process.env.ALCHEMY_API_KEY;
    
    if (alchemyKey) {
      this.providers.ethereum = new ethers.JsonRpcProvider(
        `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
      );
      this.providers.polygon = new ethers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`
      );
    }
  }

  /**
   * Registrar una nueva transferencia iniciada por el usuario
   */
  async recordTransferInitiation(transferData: TransferData): Promise<number> {
    try {
      console.log(`📝 Registrando inicio de transferencia: ${transferData.txHash}`);
      
      const transferRecord: InsertWalletTransferHistory = {
        fromAddress: transferData.fromAddress.toLowerCase(),
        toAddress: transferData.toAddress.toLowerCase(),
        amount: transferData.amount,
        txHash: transferData.txHash,
        network: transferData.network,
        chainId: transferData.chainId,
        transferType: transferData.transferType,
        assetAddress: transferData.assetAddress?.toLowerCase() || null,
        assetSymbol: transferData.assetSymbol,
        assetName: transferData.assetName || null,
        assetDecimals: transferData.assetDecimals || 18,
        tokenId: transferData.tokenId || null,
        tokenStandard: transferData.tokenStandard || null,
        status: 'PENDING',
        confirmations: 0,
        walletType: transferData.walletType || null,
        memo: transferData.memo || null,
        isInternal: false,
        isSwap: transferData.isSwap || false,
        swapData: transferData.swapData || null,
        detectionMethod: 'user_initiated',
        sourceApplication: 'waybank_transfers',
        initiatedAt: new Date(),
        broadcastAt: new Date()
      };

      const query = `
        INSERT INTO wallet_transfer_history (
          tx_hash, from_address, to_address, amount, network, chain_id,
          transfer_type, asset_address, asset_symbol, asset_name, asset_decimals,
          token_id, token_standard, wallet_type, memo, is_internal, is_swap, 
          swap_data, detection_method, source_application, initiated_at, broadcast_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING id
      `;

      const values = [
        transferRecord.txHash,
        transferRecord.fromAddress,
        transferRecord.toAddress,
        transferRecord.amount,
        transferRecord.network,
        transferRecord.chainId,
        transferRecord.transferType,
        transferRecord.assetAddress,
        transferRecord.assetSymbol,
        transferRecord.assetName,
        transferRecord.assetDecimals,
        transferRecord.tokenId,
        transferRecord.tokenStandard,
        transferRecord.walletType,
        transferRecord.memo,
        transferRecord.isInternal,
        transferRecord.isSwap,
        transferRecord.swapData ? JSON.stringify(transferRecord.swapData) : null,
        transferRecord.detectionMethod,
        transferRecord.sourceApplication,
        transferRecord.initiatedAt,
        transferRecord.broadcastAt
      ];

      const result = await pool.query(query, values);
      const transferId = result.rows[0].id;
      console.log(`✅ Transferencia registrada con ID: ${transferId}`);
      
      return transferId;
    } catch (error) {
      console.error('❌ Error registrando transferencia:', error);
      throw new Error('Error al registrar la transferencia en la base de datos');
    }
  }

  /**
   * Actualizar el estado de una transferencia con datos del recibo
   */
  async updateTransferStatus(txHash: string, receipt: TransferReceipt): Promise<void> {
    try {
      console.log(`🔄 Actualizando estado de transferencia: ${txHash}`);
      
      const updateData: any = {
        status: receipt.status,
        confirmations: receipt.confirmations || 0,
        updatedAt: new Date()
      };

      if (receipt.blockNumber) {
        updateData.blockNumber = receipt.blockNumber;
        updateData.blockHash = receipt.blockHash;
        updateData.transactionIndex = receipt.transactionIndex;
        updateData.gasUsed = receipt.gasUsed;
        updateData.gasPrice = receipt.gasPrice;
        updateData.effectiveGasPrice = receipt.effectiveGasPrice;
      }

      if (receipt.status === 'CONFIRMED') {
        updateData.confirmedAt = new Date();
      }

      const updateQuery = `
        UPDATE wallet_transfer_history 
        SET status = $1, confirmations = $2, updated_at = $3,
            block_number = $4, block_hash = $5, transaction_index = $6,
            gas_used = $7, gas_price = $8, effective_gas_price = $9,
            confirmed_at = $10
        WHERE tx_hash = $11
      `;
      
      const updateValues = [
        updateData.status,
        updateData.confirmations,
        updateData.updatedAt,
        updateData.blockNumber || null,
        updateData.blockHash || null,
        updateData.transactionIndex || null,
        updateData.gasUsed || null,
        updateData.gasPrice || null,
        updateData.effectiveGasPrice || null,
        updateData.confirmedAt || null,
        txHash
      ];

      await pool.query(updateQuery, updateValues);

      console.log(`✅ Estado de transferencia actualizado: ${receipt.status}`);
    } catch (error) {
      console.error('❌ Error actualizando transferencia:', error);
      throw new Error('Error al actualizar el estado de la transferencia');
    }
  }

  /**
   * Obtener el historial de transferencias de una wallet
   */
  async getWalletTransferHistory(
    walletAddress: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<WalletTransferHistory[]> {
    try {
      const address = walletAddress.toLowerCase();
      
      const query = `
        SELECT * FROM wallet_transfer_history 
        WHERE from_address = $1 OR to_address = $2
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
      `;
      
      const result = await pool.query(query, [address, address, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      throw new Error('Error al obtener el historial de transferencias');
    }
  }

  /**
   * Obtener transferencias por red
   */
  async getTransfersByNetwork(
    network: string, 
    limit: number = 100
  ): Promise<WalletTransferHistory[]> {
    try {
      const query = `
        SELECT * FROM wallet_transfer_history 
        WHERE network = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;
      
      const result = await pool.query(query, [network, limit]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error obteniendo transferencias por red:', error);
      throw new Error(`Error al obtener transferencias de la red ${network}`);
    }
  }

  /**
   * Obtener transferencias pendientes de confirmación
   */
  async getPendingTransfers(): Promise<WalletTransferHistory[]> {
    try {
      const query = `
        SELECT * FROM wallet_transfer_history 
        WHERE status = 'PENDING'
        ORDER BY initiated_at ASC
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('❌ Error obteniendo transferencias pendientes:', error);
      throw new Error('Error al obtener transferencias pendientes');
    }
  }

  /**
   * Verificar el estado de una transferencia en blockchain
   */
  async checkTransactionStatus(txHash: string, network: string): Promise<TransferReceipt | null> {
    try {
      const provider = this.providers[network];
      if (!provider) {
        console.warn(`⚠️ No hay proveedor configurado para la red: ${network}`);
        return null;
      }

      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) {
        return { status: 'PENDING' };
      }

      const currentBlock = await provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      return {
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        transactionIndex: receipt.index,
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: receipt.gasPrice?.toString(),
        effectiveGasPrice: receipt.gasPrice?.toString(),
        confirmations,
        status: receipt.status === 1 ? 'CONFIRMED' : 'FAILED'
      };
    } catch (error) {
      console.error(`❌ Error verificando transacción ${txHash}:`, error);
      return null;
    }
  }

  /**
   * Sincronizar transferencias pendientes
   */
  async syncPendingTransfers(): Promise<void> {
    try {
      const pendingTransfers = await this.getPendingTransfers();
      console.log(`🔄 Sincronizando ${pendingTransfers.length} transferencias pendientes`);

      for (const transfer of pendingTransfers) {
        const receipt = await this.checkTransactionStatus(transfer.txHash, transfer.network);
        if (receipt && receipt.status !== 'PENDING') {
          await this.updateTransferStatus(transfer.txHash, receipt);
        }
      }

      console.log('✅ Sincronización de transferencias completada');
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
    }
  }

  /**
   * Obtener estadísticas de transferencias
   */
  async getTransferStats(walletAddress?: string): Promise<any> {
    try {
      let transfers: WalletTransferHistory[];
      
      if (walletAddress) {
        transfers = await this.getWalletTransferHistory(walletAddress, 1000);
      } else {
        const query = `SELECT * FROM wallet_transfer_history`;
        const result = await pool.query(query);
        transfers = result.rows;
      }

      const stats = {
        total: transfers.length,
        confirmed: transfers.filter(t => t.status === 'CONFIRMED').length,
        pending: transfers.filter(t => t.status === 'PENDING').length,
        failed: transfers.filter(t => t.status === 'FAILED').length,
        byNetwork: {} as Record<string, number>,
        byAsset: {} as Record<string, number>
      };

      transfers.forEach(transfer => {
        stats.byNetwork[transfer.network] = (stats.byNetwork[transfer.network] || 0) + 1;
        stats.byAsset[transfer.assetSymbol] = (stats.byAsset[transfer.assetSymbol] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw new Error('Error al obtener estadísticas de transferencias');
    }
  }
}

// Instancia singleton del servicio
export const walletTransferService = new WalletTransferService();