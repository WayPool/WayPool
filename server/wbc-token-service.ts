/**
 * WBC Token Service
 * Handles all WBC token operations on Polygon network
 *
 * Operations:
 * - sendTokensOnActivation: Owner → User when position is activated
 * - sendTokensOnDailyFees: Owner → User for daily fee distributions
 * - validateCollectFees: Check if user can collect fees
 * - validateClosePosition: Check if user can close position
 * - recordTokensReturned: Record WBC return from user
 */

import { ethers } from 'ethers';
import { pool } from './db';

// WBC Token Contract ABI (simplified for our operations)
const WBC_TOKEN_ABI = [
  // Read functions
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function owner() view returns (address)',
  'function getStats() view returns (uint256, uint256, uint256, uint256, uint256)',
  'function getPositionNetWBC(uint256 positionId) view returns (uint256)',

  // Owner functions
  'function mint(address to, uint256 amount)',
  'function sendToUser(address to, uint256 amount, uint256 positionId, string reason)',

  // User functions
  'function transfer(address to, uint256 amount) returns (bool)',
  'function returnToOwner(uint256 amount, uint256 positionId, string reason)',

  // Events
  'event TokensSentToUser(address indexed user, uint256 amount, uint256 positionId, string reason)',
  'event TokensReturnedFromUser(address indexed user, uint256 amount, uint256 positionId, string reason)',
  'event TokensMinted(address indexed to, uint256 amount)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

// Transaction result interface
export interface WBCTransferResult {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  txHash?: string;
  error?: string;
  amount?: number;
  blockNumber?: number;
  gasUsed?: string;
}

// Validation result interface
export interface WBCValidationResult {
  canCollect: boolean;
  canClose: boolean;
  balance: number;
  required: number;
  reason?: string;
  wbcActive: boolean;
}

// WBC Config interface
interface WBCConfig {
  contractAddress: string;
  ownerWallet: string;
  network: string;
  chainId: number;
  decimals: number;
  isActive: boolean;
}

// Singleton instance
let wbcServiceInstance: WBCTokenService | null = null;
let initializationPromise: Promise<void> | null = null;

export class WBCTokenService {
  private provider: ethers.JsonRpcProvider | null = null;
  private ownerWallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;
  private config: WBCConfig | null = null;
  private initialized: boolean = false;
  private initError: string | null = null;

  constructor() {
    // Configuration will be loaded from database
  }

  /**
   * Initialize the WBC Token Service
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    try {
      console.log('[WBC] Initializing WBC Token Service...');

      // Load config from database
      await this.loadConfig();

      if (!this.config?.isActive) {
        console.log('[WBC] WBC Token system is not active');
        this.initError = 'WBC system not active';
        return false;
      }

      if (!this.config?.contractAddress) {
        console.log('[WBC] WBC Token contract not deployed yet');
        this.initError = 'Contract not deployed';
        return false;
      }

      // Initialize provider
      const rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Initialize owner wallet
      const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
      if (!privateKey) {
        console.error('[WBC] DEPLOYER_PRIVATE_KEY not set');
        this.initError = 'Private key not configured';
        return false;
      }

      this.ownerWallet = new ethers.Wallet(privateKey, this.provider);

      // Initialize contract
      this.contract = new ethers.Contract(
        this.config.contractAddress,
        WBC_TOKEN_ABI,
        this.ownerWallet
      );

      this.initialized = true;
      console.log('[WBC] WBC Token Service initialized successfully');
      console.log('[WBC] Contract:', this.config.contractAddress);
      console.log('[WBC] Owner:', this.ownerWallet.address);

      return true;

    } catch (error: any) {
      console.error('[WBC] Failed to initialize:', error);
      this.initError = error.message;
      return false;
    }
  }

  /**
   * Load configuration from database
   */
  private async loadConfig(): Promise<void> {
    try {
      const result = await pool.query(`
        SELECT key, value FROM public.wbc_config
      `);

      const configMap: Record<string, string> = {};
      for (const row of result.rows) {
        configMap[row.key] = row.value;
      }

      this.config = {
        contractAddress: configMap.contract_address || '',
        ownerWallet: configMap.owner_wallet || '',
        network: configMap.network || 'polygon',
        chainId: parseInt(configMap.chain_id || '137'),
        decimals: parseInt(configMap.decimals || '6'),
        isActive: configMap.is_active === 'true'
      };

    } catch (error) {
      // Table might not exist yet - this is OK
      console.log('[WBC] Config table not found or empty, WBC system disabled');
      this.config = {
        contractAddress: '',
        ownerWallet: '',
        network: 'polygon',
        chainId: 137,
        decimals: 6,
        isActive: false
      };
    }
  }

  /**
   * Check if service is ready for blockchain operations
   */
  isReady(): boolean {
    return this.initialized && this.contract !== null && this.ownerWallet !== null;
  }

  /**
   * Check if WBC system is active (config-level)
   */
  isActive(): boolean {
    return this.config?.isActive || false;
  }

  /**
   * Convert USDC amount to WBC amount (both have 6 decimals)
   */
  private toWBCAmount(usdcAmount: number): bigint {
    return ethers.parseUnits(usdcAmount.toFixed(6), 6);
  }

  /**
   * Format WBC amount for display
   */
  private formatWBC(amount: bigint): number {
    return parseFloat(ethers.formatUnits(amount, 6));
  }

  // ============ OWNER → USER OPERATIONS ============

  /**
   * Send WBC to user when position is activated
   * @param positionId Position ID
   * @param userWallet User's wallet address
   * @param amountUSDC Amount in USDC (= WBC)
   */
  async sendTokensOnActivation(
    positionId: number,
    userWallet: string,
    amountUSDC: number
  ): Promise<WBCTransferResult> {
    return this.sendToUser(positionId, userWallet, amountUSDC, 'activation');
  }

  /**
   * Send WBC to user for daily fee distribution
   * @param positionId Position ID
   * @param userWallet User's wallet address
   * @param feeAmount Fee amount in USDC (= WBC)
   */
  async sendTokensOnDailyFees(
    positionId: number,
    userWallet: string,
    feeAmount: number
  ): Promise<WBCTransferResult> {
    return this.sendToUser(positionId, userWallet, feeAmount, 'daily_fee');
  }

  /**
   * Generic send tokens from owner to user
   */
  private async sendToUser(
    positionId: number,
    userWallet: string,
    amount: number,
    reason: string
  ): Promise<WBCTransferResult> {
    // Check if WBC system is active
    if (!this.config?.isActive) {
      return {
        success: false,
        skipped: true,
        reason: 'WBC system not active'
      };
    }

    if (!this.isReady()) {
      console.log(`[WBC] System not ready. Would send ${amount} WBC to ${userWallet} for ${reason}`);
      return {
        success: false,
        skipped: true,
        reason: 'WBC service not initialized'
      };
    }

    try {
      const wbcAmount = this.toWBCAmount(amount);

      console.log(`[WBC] Sending ${amount} WBC to ${userWallet} (${reason})`);

      // Check owner balance
      const ownerBalance = await this.contract!.balanceOf(this.ownerWallet!.address);
      if (ownerBalance < wbcAmount) {
        return {
          success: false,
          error: `Insufficient owner balance. Has: ${this.formatWBC(ownerBalance)}, Needs: ${amount}`
        };
      }

      // Send tokens using sendToUser function (with tracking)
      const tx = await this.contract!.sendToUser(
        userWallet,
        wbcAmount,
        positionId,
        reason
      );

      console.log(`[WBC] Transaction sent: ${tx.hash}`);

      // Wait for confirmation
      const receipt = await tx.wait();

      // Log to database
      await this.logTransaction({
        txHash: tx.hash,
        fromAddress: this.ownerWallet!.address,
        toAddress: userWallet,
        amount: amount.toString(),
        positionId,
        transactionType: reason,
        status: 'confirmed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });

      console.log(`[WBC] Confirmed: ${amount} WBC sent to ${userWallet}`);

      return {
        success: true,
        txHash: tx.hash,
        amount: amount,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error: any) {
      console.error(`[WBC] Send failed:`, error);

      // Log failed transaction
      await this.logTransaction({
        txHash: `failed_${Date.now()}`,
        fromAddress: this.ownerWallet?.address || 'unknown',
        toAddress: userWallet,
        amount: amount.toString(),
        positionId,
        transactionType: reason,
        status: 'failed',
        errorMessage: error.message
      });

      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  // ============ VALIDATION OPERATIONS ============

  /**
   * Validate that user can collect fees (has enough WBC)
   * @param userWallet User's wallet address
   * @param feeAmount Amount of fees to collect
   */
  async validateCollectFees(
    userWallet: string,
    feeAmount: number
  ): Promise<WBCValidationResult> {
    // If WBC system not active, allow the operation
    if (!this.config?.isActive) {
      return {
        canCollect: true,
        canClose: true,
        balance: 0,
        required: feeAmount,
        wbcActive: false,
        reason: 'WBC system not active'
      };
    }

    if (!this.isReady()) {
      return {
        canCollect: true,
        canClose: true,
        balance: 0,
        required: feeAmount,
        wbcActive: false,
        reason: 'WBC service not ready'
      };
    }

    try {
      const balance = await this.contract!.balanceOf(userWallet);
      const balanceNumber = this.formatWBC(balance);
      const requiredAmount = this.toWBCAmount(feeAmount);
      const hasEnough = balance >= requiredAmount;

      return {
        canCollect: hasEnough,
        canClose: hasEnough,
        balance: balanceNumber,
        required: feeAmount,
        wbcActive: true,
        reason: hasEnough ? undefined : `Insufficient WBC: has ${balanceNumber}, needs ${feeAmount}`
      };

    } catch (error: any) {
      console.error('[WBC] Validation error:', error);
      // On error, allow the operation (don't block)
      return {
        canCollect: true,
        canClose: true,
        balance: 0,
        required: feeAmount,
        wbcActive: false,
        reason: `Validation error: ${error.message}`
      };
    }
  }

  /**
   * Validate that user can close position (has enough WBC)
   * @param userWallet User's wallet address
   * @param totalAmount Total amount required (capital + fees)
   */
  async validateClosePosition(
    userWallet: string,
    totalAmount: number
  ): Promise<WBCValidationResult> {
    return this.validateCollectFees(userWallet, totalAmount);
  }

  /**
   * Record that user returned WBC (legacy - creates pending record)
   * @param positionId Position ID
   * @param userWallet User's wallet address
   * @param amount Amount returned
   * @param reason Reason for return ('fee_collection' or 'position_close')
   */
  async recordTokensReturned(
    positionId: number,
    userWallet: string,
    amount: number,
    reason: string
  ): Promise<WBCTransferResult> {
    // If WBC system not active, skip
    if (!this.config?.isActive) {
      return {
        success: false,
        skipped: true,
        reason: 'WBC system not active'
      };
    }

    try {
      // Generate a placeholder txHash since the actual transaction
      // would be initiated by the user on the frontend
      const txHash = `wbc_return_${positionId}_${Date.now()}`;

      // Log to database
      await this.logTransaction({
        txHash,
        fromAddress: userWallet,
        toAddress: this.config?.ownerWallet || 'owner',
        amount: amount.toString(),
        positionId,
        transactionType: reason,
        status: 'pending_confirmation'
      });

      console.log(`[WBC] Recorded return: ${amount} WBC from ${userWallet} (${reason})`);

      return {
        success: true,
        txHash,
        amount: amount
      };

    } catch (error: any) {
      console.error('[WBC] Failed to record return:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Record verified WBC return with actual blockchain txHash
   * @param txHash The actual blockchain transaction hash
   * @param positionId Position ID
   * @param userWallet User's wallet address
   * @param amount Amount returned
   * @param reason Reason for return ('fee_collection' or 'position_close')
   */
  async recordVerifiedReturn(
    txHash: string,
    positionId: number,
    userWallet: string,
    amount: number,
    reason: string
  ): Promise<WBCTransferResult> {
    // If WBC system not active, skip
    if (!this.config?.isActive) {
      return {
        success: false,
        skipped: true,
        reason: 'WBC system not active'
      };
    }

    try {
      // Verify the transaction on Polygon (optional - can be done async)
      let blockNumber: number | undefined;

      if (this.provider && txHash.startsWith('0x')) {
        try {
          const receipt = await this.provider.getTransactionReceipt(txHash);
          if (receipt) {
            blockNumber = receipt.blockNumber;
            console.log(`[WBC] Verified tx ${txHash} in block ${blockNumber}`);
          }
        } catch (verifyError) {
          console.warn(`[WBC] Could not verify tx ${txHash}:`, verifyError);
          // Continue anyway - tx might not be indexed yet
        }
      }

      // Log to database with confirmed status
      await this.logTransaction({
        txHash,
        fromAddress: userWallet,
        toAddress: this.config?.ownerWallet || 'owner',
        amount: amount.toString(),
        positionId,
        transactionType: reason,
        status: 'confirmed',
        blockNumber,
      });

      console.log(`[WBC] Recorded verified return: ${amount} WBC from ${userWallet} (${reason}) tx: ${txHash}`);

      return {
        success: true,
        txHash,
        amount: amount,
        blockNumber,
      };

    } catch (error: any) {
      console.error('[WBC] Failed to record verified return:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============ QUERY FUNCTIONS ============

  /**
   * Get WBC balance for a wallet
   */
  async getBalance(walletAddress: string): Promise<number> {
    if (!this.isReady()) {
      return 0;
    }

    try {
      const balance = await this.contract!.balanceOf(walletAddress);
      return this.formatWBC(balance);
    } catch (error) {
      console.error('[WBC] Failed to get balance:', error);
      return 0;
    }
  }

  /**
   * Check if user has enough WBC balance
   */
  async hasEnoughBalance(walletAddress: string, requiredAmount: number): Promise<boolean> {
    if (!this.config?.isActive) {
      return true; // If WBC not active, don't block operations
    }

    if (!this.isReady()) {
      return true; // If not ready, don't block
    }

    try {
      const balance = await this.contract!.balanceOf(walletAddress);
      const required = this.toWBCAmount(requiredAmount);
      return balance >= required;
    } catch (error) {
      console.error('[WBC] Failed to check balance:', error);
      return true; // On error, don't block
    }
  }

  /**
   * Get WBC token stats
   */
  async getStats(): Promise<{
    totalSupply: number;
    ownerBalance: number;
    distributedToUsers: number;
    returnedFromUsers: number;
    netDistributed: number;
  } | null> {
    if (!this.isReady()) {
      return null;
    }

    try {
      const stats = await this.contract!.getStats();
      return {
        totalSupply: this.formatWBC(stats[0]),
        ownerBalance: this.formatWBC(stats[1]),
        distributedToUsers: this.formatWBC(stats[2]),
        returnedFromUsers: this.formatWBC(stats[3]),
        netDistributed: this.formatWBC(stats[4])
      };
    } catch (error) {
      console.error('[WBC] Failed to get stats:', error);
      return null;
    }
  }

  /**
   * Get configuration
   */
  getConfig(): WBCConfig | null {
    return this.config;
  }

  // ============ DATABASE OPERATIONS ============

  /**
   * Log transaction to database
   */
  private async logTransaction(data: {
    txHash: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    positionId: number;
    transactionType: string;
    status: string;
    blockNumber?: number;
    gasUsed?: string;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await pool.query(`
        INSERT INTO public.wbc_transactions
        (tx_hash, from_address, to_address, amount, position_id,
         transaction_type, status, block_number, gas_used, error_message,
         confirmed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (tx_hash) DO UPDATE SET
          status = EXCLUDED.status,
          block_number = EXCLUDED.block_number,
          gas_used = EXCLUDED.gas_used,
          error_message = EXCLUDED.error_message,
          confirmed_at = EXCLUDED.confirmed_at
      `, [
        data.txHash,
        data.fromAddress,
        data.toAddress,
        data.amount,
        data.positionId,
        data.transactionType,
        data.status,
        data.blockNumber || null,
        data.gasUsed || null,
        data.errorMessage || null,
        data.status === 'confirmed' ? new Date() : null
      ]);
    } catch (error) {
      // Table might not exist yet - log but don't fail
      console.log('[WBC] Could not log transaction (table may not exist yet)');
    }
  }

  /**
   * Update WBC config in database
   */
  async updateConfig(key: string, value: string): Promise<boolean> {
    try {
      await pool.query(`
        UPDATE public.wbc_config
        SET value = $1, updated_at = NOW()
        WHERE key = $2
      `, [value, key]);

      // Reload config
      await this.loadConfig();
      return true;
    } catch (error) {
      console.error('[WBC] Failed to update config:', error);
      return false;
    }
  }

  /**
   * Set contract address after deployment
   */
  async setContractAddress(address: string, txHash: string): Promise<boolean> {
    try {
      await this.updateConfig('contract_address', address);
      await this.updateConfig('deploy_tx_hash', txHash);
      await this.updateConfig('deploy_date', new Date().toISOString());
      await this.updateConfig('owner_wallet', this.ownerWallet?.address || '');

      // Reinitialize with new contract
      this.initialized = false;
      return await this.initialize();
    } catch (error) {
      console.error('[WBC] Failed to set contract address:', error);
      return false;
    }
  }

  /**
   * Activate WBC system
   */
  async activate(): Promise<boolean> {
    return this.updateConfig('is_active', 'true');
  }

  /**
   * Deactivate WBC system
   */
  async deactivate(): Promise<boolean> {
    return this.updateConfig('is_active', 'false');
  }
}

// ============ SINGLETON GETTER (SYNCHRONOUS) ============

/**
 * Get the WBC Token Service instance (synchronous - returns cached instance)
 * The service initializes itself lazily on first actual use
 */
export function getWBCTokenService(): WBCTokenService {
  if (!wbcServiceInstance) {
    wbcServiceInstance = new WBCTokenService();
    // Start initialization in background
    initializationPromise = wbcServiceInstance.initialize().then(() => {
      console.log('[WBC] Background initialization complete');
    }).catch(err => {
      console.error('[WBC] Background initialization failed:', err);
    });
  }
  return wbcServiceInstance;
}

/**
 * Initialize WBC service and wait for completion
 */
export async function initializeWBCService(): Promise<WBCTokenService> {
  const service = getWBCTokenService();
  if (initializationPromise) {
    await initializationPromise;
  }
  return service;
}

/**
 * Check if WBC system is ready
 */
export function isWBCReady(): boolean {
  if (!wbcServiceInstance) {
    return false;
  }
  return wbcServiceInstance.isReady();
}

/**
 * Check if WBC system is active (config-level)
 */
export function isWBCActive(): boolean {
  if (!wbcServiceInstance) {
    return false;
  }
  return wbcServiceInstance.isActive();
}
