/**
 * NFT Pool Creation Service
 *
 * This service handles the creation of Uniswap V3 positions through the
 * WayPoolPositionCreator smart contract on Polygon.
 *
 * Flow for External Wallets (MetaMask, etc.):
 * 1. Admin activates a position (Pending -> Active)
 * 2. Position is marked as "nftCreationPending: true"
 * 3. When user connects wallet, frontend checks for pending NFT creations
 * 4. User signs transaction to create the pool (minimal gas only)
 * 5. NFT is created and registered in managed_nfts table
 *
 * Flow for Custodial Wallets (WayPool internal):
 * 1. Admin activates a position (Pending -> Active)
 * 2. System automatically creates NFT using deployer wallet
 * 3. NFT is sent to the user's custodial wallet address
 * 4. NFT is registered in managed_nfts table
 */

import { ethers } from 'ethers';
import { storage } from './storage';
import { custodialWalletService } from './custodial-wallet/service';

// WayPoolPositionCreator contract address on Polygon
export const WAYPOOL_CREATOR_ADDRESS = '0xf81938F926714f114D07b68dfc3b0E3bC501167B';

// Uniswap V3 Position Manager
export const POSITION_MANAGER_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';

// Token addresses on Polygon
export const POLYGON_TOKENS = {
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
};

// Contract ABI for WayPoolPositionCreator
export const WAYPOOL_CREATOR_ABI = [
  'function createMinimalPosition(int24 tickLower, int24 tickUpper) external returns (uint256 tokenId, uint128 liquidity)',
  'function createPosition(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0, uint256 amount1) external returns (uint256 tokenId, uint128 liquidity)',
  'function getDefaultConfig() external view returns (address token0, address token1, uint24 fee, uint256 minAmt0, uint256 minAmt1)',
  'function minAmount0() external view returns (uint256)',
  'function minAmount1() external view returns (uint256)',
  'event PositionCreated(address indexed user, uint256 indexed tokenId, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 amount0, uint256 amount1)',
];

// USDC/WETH Pool address on Polygon (0.05% fee tier)
export const USDC_WETH_POOL_ADDRESS = '0x45dDa9cb7c25131DF268515131f647d726f50608';

// Pool ABI for getting current tick
export const POOL_ABI = [
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function tickSpacing() external view returns (int24)',
];

// Tick spacing for 0.05% fee tier
const TICK_SPACING = 10;

// Range around current price (in ticks) - ~50% price range each direction
// Each tick represents ~0.01% price change, so 5000 ticks = ~50% range
const TICK_RANGE_HALF = 5000;

/**
 * Get current tick from the USDC/WETH pool and calculate a reasonable range
 * This ensures the NFT tokenURI works correctly (avoids SafeMath overflow)
 */
export async function getDynamicTickRange(): Promise<{ tickLower: number; tickUpper: number }> {
  try {
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const pool = new ethers.Contract(USDC_WETH_POOL_ADDRESS, POOL_ABI, provider);

    const slot0 = await pool.slot0();
    const currentTick = Number(slot0.tick);

    console.log(`[NFT-Service] Current pool tick: ${currentTick}`);

    // Calculate range centered around current tick, rounded to tick spacing
    const tickLower = Math.floor((currentTick - TICK_RANGE_HALF) / TICK_SPACING) * TICK_SPACING;
    const tickUpper = Math.ceil((currentTick + TICK_RANGE_HALF) / TICK_SPACING) * TICK_SPACING;

    console.log(`[NFT-Service] Dynamic tick range: [${tickLower}, ${tickUpper}]`);

    return { tickLower, tickUpper };
  } catch (error) {
    console.error('[NFT-Service] Error getting dynamic tick range, using fallback:', error);
    // Fallback to a reasonable static range around typical ETH/USDC prices
    // Current tick is around 195615, so we use a range around that
    return {
      tickLower: 190000,
      tickUpper: 201000,
    };
  }
}

// Legacy constant for backwards compatibility (will be replaced by dynamic calculation)
export const DEFAULT_TICK_RANGE = {
  tickLower: 190000,  // ~$2500 ETH
  tickUpper: 201000,  // ~$4000 ETH
};

// Fee tiers
export const FEE_TIERS = {
  LOWEST: 100,   // 0.01%
  LOW: 500,      // 0.05%
  MEDIUM: 3000,  // 0.30%
  HIGH: 10000,   // 1.00%
};

// Polygon RPC URL
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';

// Deployer private key for custodial transactions
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';

// Extended ABI for createPositionFor function (creates position for a specific address)
export const WAYPOOL_CREATOR_ABI_EXTENDED = [
  ...WAYPOOL_CREATOR_ABI,
  'function createPositionFor(address recipient, int24 tickLower, int24 tickUpper) external returns (uint256 tokenId, uint128 liquidity)',
];

// ERC20 ABI for token approvals
export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
];

// Uniswap V3 Position Manager ABI for transferring NFTs and minting
export const POSITION_MANAGER_TRANSFER_ABI = [
  'function safeTransferFrom(address from, address to, uint256 tokenId) external',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function approve(address to, uint256 tokenId) external',
];

// Full Position Manager ABI for minting positions directly
export const POSITION_MANAGER_MINT_ABI = [
  'function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline) params) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)',
  'function safeTransferFrom(address from, address to, uint256 tokenId) external',
];

// Minimum amounts for creating positions (need to be high enough to generate liquidity)
// Using smaller amounts that still generate non-zero liquidity
// 0.01 USDC = 10000 (6 decimals)
// 0.000000001 WETH = 1000000000 (18 decimals) - very small but should work with full-range
export const MINIMUM_POSITION_AMOUNTS = {
  USDC: BigInt('10000'),     // 0.01 USDC
  WETH: BigInt('1000000000'), // 0.000000001 WETH (~$0.000003 at $3300 ETH)
};

/**
 * Interface for position creation result
 */
export interface NFTCreationResult {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  error?: string;
  polygonScanUrl?: string;
  uniswapUrl?: string;
}

/**
 * Interface for pending NFT creation data
 */
export interface PendingNFTCreation {
  positionId: number;
  walletAddress: string;
  valueUsdc: string;
  poolAddress?: string;
  token0?: string;
  token1?: string;
  fee?: number;
  tickLower?: number;
  tickUpper?: number;
}

/**
 * Mark a position as pending NFT creation
 * Called when admin changes position status from Pending to Active
 */
export async function markPositionForNFTCreation(positionId: number): Promise<boolean> {
  try {
    console.log(`[NFT-Service] Marking position ${positionId} for NFT creation`);

    // Update the position with nftCreationPending flag
    const updated = await storage.updatePositionHistory(positionId, {
      nftCreationPending: true,
      nftCreationStatus: 'pending',
    });

    if (updated) {
      console.log(`[NFT-Service] Position ${positionId} marked for NFT creation`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`[NFT-Service] Error marking position for NFT creation:`, error);
    return false;
  }
}

/**
 * Get all positions pending NFT creation for a wallet
 */
export async function getPendingNFTCreations(walletAddress: string): Promise<PendingNFTCreation[]> {
  try {
    console.log(`[NFT-Service] Getting pending NFT creations for wallet: ${walletAddress}`);

    // Get all positions for this wallet that are Active and pending NFT creation
    const positions = await storage.getPositionHistoryByWalletAddress(walletAddress);

    // Get dynamic tick range based on current pool price
    const tickRange = await getDynamicTickRange();

    const pendingCreations = positions
      .filter((pos: any) =>
        pos.status === 'Active' &&
        pos.nftCreationPending === true &&
        !pos.nftTokenId // No NFT created yet
      )
      .map((pos: any) => ({
        positionId: pos.id,
        walletAddress: pos.walletAddress,
        valueUsdc: pos.depositedUSDC?.toString() || '0',
        poolAddress: pos.poolAddress,
        token0: pos.token0,
        token1: pos.token1,
        fee: pos.fee ? parseInt(pos.fee) : FEE_TIERS.LOW,
        tickLower: tickRange.tickLower,
        tickUpper: tickRange.tickUpper,
      }));

    console.log(`[NFT-Service] Found ${pendingCreations.length} pending NFT creations`);
    return pendingCreations;
  } catch (error) {
    console.error(`[NFT-Service] Error getting pending NFT creations:`, error);
    return [];
  }
}

/**
 * Register a newly created NFT in the system
 * Called after the user creates the NFT via the smart contract
 */
export async function registerCreatedNFT(
  positionId: number,
  tokenId: string,
  transactionHash: string,
  walletAddress: string,
  valueUsdc: string
): Promise<boolean> {
  try {
    console.log(`[NFT-Service] Registering NFT ${tokenId} for position ${positionId}`);

    // Get the position details
    const position = await storage.getPositionHistoryById(positionId);

    if (!position) {
      console.error(`[NFT-Service] Position ${positionId} not found`);
      return false;
    }

    // 1. Update the position with the NFT token ID
    await storage.updatePositionHistory(positionId, {
      nftTokenId: tokenId,
      nftCreationPending: false,
      nftCreationStatus: 'completed',
      nftCreatedAt: new Date(),
      nftTransactionHash: transactionHash,
      network: 'polygon',
      contractAddress: POSITION_MANAGER_ADDRESS,
    });

    // 2. Create a managed NFT entry
    const managedNftData = {
      network: 'polygon',
      version: 'V3',
      tokenId: tokenId,
      contractAddress: POSITION_MANAGER_ADDRESS,
      token0Symbol: position.token0 || 'USDC',
      token1Symbol: position.token1 || 'WETH',
      feeTier: position.fee || '0.05%',
      poolAddress: position.poolAddress || '',
      valueUsdc: valueUsdc,
      status: 'Active',
      imageUrl: `https://app.uniswap.org/nfts/asset/${POSITION_MANAGER_ADDRESS}/${tokenId}`,
      createdBy: 'system',
      additionalData: JSON.stringify({
        owner: walletAddress,
        linkedPositionId: positionId,
        createdViaWayPool: true,
        transactionHash: transactionHash,
        createdAt: new Date().toISOString(),
      }),
    };

    const managedNft = await storage.createManagedNft(managedNftData);

    if (managedNft) {
      console.log(`[NFT-Service] Created managed NFT entry with ID: ${managedNft.id}`);
    }

    console.log(`[NFT-Service] Successfully registered NFT ${tokenId} for position ${positionId}`);
    return true;
  } catch (error) {
    console.error(`[NFT-Service] Error registering NFT:`, error);
    return false;
  }
}

/**
 * Mark NFT creation as failed
 */
export async function markNFTCreationFailed(
  positionId: number,
  errorMessage: string
): Promise<boolean> {
  try {
    console.log(`[NFT-Service] Marking NFT creation as failed for position ${positionId}`);

    await storage.updatePositionHistory(positionId, {
      nftCreationStatus: 'failed',
      nftCreationError: errorMessage,
      nftCreationAttempts: 1, // Could increment if retrying
    });

    return true;
  } catch (error) {
    console.error(`[NFT-Service] Error marking NFT creation as failed:`, error);
    return false;
  }
}

/**
 * Check if a wallet address is a custodial (internal) wallet
 */
export async function isWalletCustodial(walletAddress: string): Promise<boolean> {
  try {
    return await custodialWalletService.isWalletCustodial(walletAddress);
  } catch (error) {
    console.error(`[NFT-Service] Error checking if wallet is custodial:`, error);
    return false;
  }
}

/**
 * Create NFT position for a custodial wallet
 * This is called automatically by the backend when a position is activated
 * for a user with an internal WayPool wallet.
 *
 * Flow:
 * 1. Create position using deployer wallet (pays gas + minimal tokens)
 * 2. Transfer the NFT to the user's custodial wallet address
 * 3. Register the NFT in the system
 */
export async function createNFTForCustodialWallet(
  positionId: number,
  recipientAddress: string,
  valueUsdc: string
): Promise<NFTCreationResult> {
  try {
    console.log(`[NFT-Service] Creating NFT for custodial wallet ${recipientAddress}, position ${positionId}`);

    // Verify this is actually a custodial wallet
    const isCustodial = await isWalletCustodial(recipientAddress);
    if (!isCustodial) {
      console.warn(`[NFT-Service] Wallet ${recipientAddress} is not custodial, skipping automatic creation`);
      return {
        success: false,
        error: 'Wallet is not custodial - user must create NFT manually',
      };
    }

    // Verify we have the deployer private key
    if (!DEPLOYER_PRIVATE_KEY) {
      console.error('[NFT-Service] DEPLOYER_PRIVATE_KEY not configured');
      return {
        success: false,
        error: 'Server configuration error: deployer key not set',
      };
    }

    // Update status to "creating"
    await storage.updatePositionHistory(positionId, {
      nftCreationStatus: 'creating',
    });

    // Connect to Polygon
    console.log('[NFT-Service] Connecting to Polygon network...');
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const deployerWallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    console.log(`[NFT-Service] Deployer address: ${deployerWallet.address}`);

    // Check deployer MATIC balance for gas
    const maticBalance = await provider.getBalance(deployerWallet.address);
    console.log(`[NFT-Service] Deployer MATIC balance: ${ethers.formatEther(maticBalance)} MATIC`);

    if (maticBalance < ethers.parseEther('0.01')) {
      console.error('[NFT-Service] Insufficient MATIC for gas');
      await markNFTCreationFailed(positionId, 'Insufficient MATIC for gas');
      return {
        success: false,
        error: 'Insufficient MATIC for gas fees',
      };
    }

    // Create contract instances
    const waypoolCreator = new ethers.Contract(
      WAYPOOL_CREATOR_ADDRESS,
      WAYPOOL_CREATOR_ABI,
      deployerWallet
    );

    const usdc = new ethers.Contract(POLYGON_TOKENS.USDC, ERC20_ABI, deployerWallet);
    const weth = new ethers.Contract(POLYGON_TOKENS.WETH, ERC20_ABI, deployerWallet);

    // Check token balances
    const usdcBalance = await usdc.balanceOf(deployerWallet.address);
    const wethBalance = await weth.balanceOf(deployerWallet.address);
    console.log(`[NFT-Service] Deployer token balances - USDC: ${usdcBalance}, WETH: ${wethBalance}`);

    // Approve tokens if needed (minimal amounts)
    const minAmount = 1n; // 1 wei of each token

    const usdcAllowance = await usdc.allowance(deployerWallet.address, WAYPOOL_CREATOR_ADDRESS);
    if (usdcAllowance < minAmount) {
      console.log('[NFT-Service] Approving USDC...');
      const approveTx = await usdc.approve(WAYPOOL_CREATOR_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
      console.log('[NFT-Service] USDC approved');
    }

    const wethAllowance = await weth.allowance(deployerWallet.address, WAYPOOL_CREATOR_ADDRESS);
    if (wethAllowance < minAmount) {
      console.log('[NFT-Service] Approving WETH...');
      const approveTx = await weth.approve(WAYPOOL_CREATOR_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
      console.log('[NFT-Service] WETH approved');
    }

    // Get dynamic tick range based on current pool price
    const tickRange = await getDynamicTickRange();

    // Create the position
    console.log(`[NFT-Service] Creating minimal position with ticks [${tickRange.tickLower}, ${tickRange.tickUpper}]...`);
    const createTx = await waypoolCreator.createMinimalPosition(
      tickRange.tickLower,
      tickRange.tickUpper,
      { gasLimit: 500000 }
    );

    console.log(`[NFT-Service] Transaction sent: ${createTx.hash}`);
    const receipt = await createTx.wait();
    console.log(`[NFT-Service] Transaction confirmed in block ${receipt.blockNumber}`);

    // Parse the PositionCreated event to get the tokenId
    const positionCreatedEvent = parsePositionCreatedEvent(receipt.logs);

    if (!positionCreatedEvent) {
      console.error('[NFT-Service] Could not parse PositionCreated event');
      await markNFTCreationFailed(positionId, 'Could not parse PositionCreated event');
      return {
        success: false,
        error: 'Failed to parse transaction events',
      };
    }

    const tokenId = positionCreatedEvent.tokenId;
    console.log(`[NFT-Service] Position created with tokenId: ${tokenId}`);

    // Now transfer the NFT to the user's custodial wallet
    console.log(`[NFT-Service] Transferring NFT ${tokenId} to ${recipientAddress}...`);
    const positionManager = new ethers.Contract(
      POSITION_MANAGER_ADDRESS,
      POSITION_MANAGER_TRANSFER_ABI,
      deployerWallet
    );

    const transferTx = await positionManager.safeTransferFrom(
      deployerWallet.address,
      recipientAddress,
      tokenId,
      { gasLimit: 150000 }
    );

    console.log(`[NFT-Service] Transfer transaction sent: ${transferTx.hash}`);
    const transferReceipt = await transferTx.wait();
    console.log(`[NFT-Service] Transfer confirmed in block ${transferReceipt.blockNumber}`);

    // Register the NFT in the system
    const registered = await registerCreatedNFT(
      positionId,
      tokenId,
      createTx.hash,
      recipientAddress,
      valueUsdc
    );

    if (!registered) {
      console.warn('[NFT-Service] NFT created but failed to register in database');
    }

    const urls = getNFTUrls(tokenId);

    console.log(`[NFT-Service] Successfully created and transferred NFT ${tokenId} to ${recipientAddress}`);

    return {
      success: true,
      tokenId,
      transactionHash: createTx.hash,
      polygonScanUrl: urls.polygonScan,
      uniswapUrl: urls.uniswap,
    };

  } catch (error: any) {
    console.error(`[NFT-Service] Error creating NFT for custodial wallet:`, error);

    const errorMessage = error.message || 'Unknown error';
    await markNFTCreationFailed(positionId, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Create NFT for ANY wallet (custodial or external) using deployer wallet
 * This allows admins to create NFTs on behalf of users who don't have tokens
 *
 * Flow:
 * 1. Create position directly via Uniswap V3 Position Manager (deployer wallet pays gas + tokens)
 * 2. Position NFT goes directly to user's wallet (no transfer needed)
 * 3. Register the NFT in the system
 */
export async function createNFTForAnyWallet(
  positionId: number,
  recipientAddress: string,
  valueUsdc: string
): Promise<NFTCreationResult> {
  try {
    console.log(`[NFT-Service] Admin creating NFT for wallet ${recipientAddress}, position ${positionId}`);

    // Verify we have the deployer private key
    if (!DEPLOYER_PRIVATE_KEY) {
      console.error('[NFT-Service] DEPLOYER_PRIVATE_KEY not configured');
      return {
        success: false,
        error: 'Server configuration error: deployer key not set',
      };
    }

    // Update status to "creating"
    await storage.updatePositionHistory(positionId, {
      nftCreationStatus: 'creating',
    });

    // Connect to Polygon
    console.log('[NFT-Service] Connecting to Polygon network...');
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const deployerWallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    console.log(`[NFT-Service] Deployer address: ${deployerWallet.address}`);

    // Check deployer MATIC balance for gas
    const maticBalance = await provider.getBalance(deployerWallet.address);
    console.log(`[NFT-Service] Deployer MATIC balance: ${ethers.formatEther(maticBalance)} MATIC`);

    if (maticBalance < ethers.parseEther('0.05')) {
      console.error('[NFT-Service] Insufficient MATIC for gas');
      await markNFTCreationFailed(positionId, 'Insufficient MATIC for gas');
      return {
        success: false,
        error: 'Insufficient MATIC for gas fees. Please fund deployer wallet with at least 0.05 MATIC.',
      };
    }

    // Create token contract instances
    const usdc = new ethers.Contract(POLYGON_TOKENS.USDC, ERC20_ABI, deployerWallet);
    const weth = new ethers.Contract(POLYGON_TOKENS.WETH, ERC20_ABI, deployerWallet);

    // Check token balances - need enough for position creation
    const usdcBalance = await usdc.balanceOf(deployerWallet.address);
    const wethBalance = await weth.balanceOf(deployerWallet.address);
    console.log(`[NFT-Service] Deployer token balances - USDC: ${ethers.formatUnits(usdcBalance, 6)}, WETH: ${ethers.formatEther(wethBalance)}`);

    // Check if we have enough tokens (1 USDC and 0.0003 WETH minimum)
    const requiredUsdc = MINIMUM_POSITION_AMOUNTS.USDC;
    const requiredWeth = MINIMUM_POSITION_AMOUNTS.WETH;

    if (usdcBalance < requiredUsdc) {
      console.error(`[NFT-Service] Insufficient USDC: have ${usdcBalance}, need ${requiredUsdc}`);
      await markNFTCreationFailed(positionId, 'Insufficient USDC tokens');
      return {
        success: false,
        error: `Deployer wallet needs at least 1 USDC. Current balance: ${ethers.formatUnits(usdcBalance, 6)} USDC`,
      };
    }

    if (wethBalance < requiredWeth) {
      console.error(`[NFT-Service] Insufficient WETH: have ${wethBalance}, need ${requiredWeth}`);
      await markNFTCreationFailed(positionId, 'Insufficient WETH tokens');
      return {
        success: false,
        error: `Deployer wallet needs at least 0.0003 WETH. Current balance: ${ethers.formatEther(wethBalance)} WETH`,
      };
    }

    // Approve tokens to Position Manager if needed
    const usdcAllowance = await usdc.allowance(deployerWallet.address, POSITION_MANAGER_ADDRESS);
    if (usdcAllowance < requiredUsdc) {
      console.log('[NFT-Service] Approving USDC to Position Manager...');
      const approveTx = await usdc.approve(POSITION_MANAGER_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
      console.log('[NFT-Service] USDC approved');
    }

    const wethAllowance = await weth.allowance(deployerWallet.address, POSITION_MANAGER_ADDRESS);
    if (wethAllowance < requiredWeth) {
      console.log('[NFT-Service] Approving WETH to Position Manager...');
      const approveTx = await weth.approve(POSITION_MANAGER_ADDRESS, ethers.MaxUint256);
      await approveTx.wait();
      console.log('[NFT-Service] WETH approved');
    }

    // Create position directly via Uniswap V3 Position Manager
    // This sends the NFT directly to the recipient
    console.log('[NFT-Service] Creating position via Uniswap V3 Position Manager...');

    const positionManager = new ethers.Contract(
      POSITION_MANAGER_ADDRESS,
      POSITION_MANAGER_MINT_ABI,
      deployerWallet
    );

    // Get dynamic tick range based on current pool price
    const tickRange = await getDynamicTickRange();

    // Sort tokens (Uniswap requires token0 < token1)
    const token0 = POLYGON_TOKENS.USDC.toLowerCase() < POLYGON_TOKENS.WETH.toLowerCase()
      ? POLYGON_TOKENS.USDC
      : POLYGON_TOKENS.WETH;
    const token1 = POLYGON_TOKENS.USDC.toLowerCase() < POLYGON_TOKENS.WETH.toLowerCase()
      ? POLYGON_TOKENS.WETH
      : POLYGON_TOKENS.USDC;
    const amount0 = POLYGON_TOKENS.USDC.toLowerCase() < POLYGON_TOKENS.WETH.toLowerCase()
      ? requiredUsdc
      : requiredWeth;
    const amount1 = POLYGON_TOKENS.USDC.toLowerCase() < POLYGON_TOKENS.WETH.toLowerCase()
      ? requiredWeth
      : requiredUsdc;

    console.log(`[NFT-Service] Tokens sorted: token0=${token0}, token1=${token1}`);
    console.log(`[NFT-Service] Amounts: amount0=${amount0}, amount1=${amount1}`);

    const mintParams = {
      token0: token0,
      token1: token1,
      fee: FEE_TIERS.LOW, // 0.05% fee tier
      tickLower: tickRange.tickLower,
      tickUpper: tickRange.tickUpper,
      amount0Desired: amount0,
      amount1Desired: amount1,
      amount0Min: 0n, // Accept any amount
      amount1Min: 0n,
      recipient: recipientAddress, // NFT goes directly to user!
      deadline: BigInt(Math.floor(Date.now() / 1000) + 600), // 10 minute deadline
    };

    console.log('[NFT-Service] Mint params:', JSON.stringify(mintParams, (_, v) => typeof v === 'bigint' ? v.toString() : v));

    const createTx = await positionManager.mint(mintParams, { gasLimit: 600000 });

    console.log(`[NFT-Service] Transaction sent: ${createTx.hash}`);
    const receipt = await createTx.wait();
    console.log(`[NFT-Service] Transaction confirmed in block ${receipt.blockNumber}`);

    // Parse the IncreaseLiquidity event to get the tokenId
    // The Position Manager emits IncreaseLiquidity(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
    // and Transfer(address from, address to, uint256 tokenId) events
    let tokenId: string | null = null;

    const transferEventTopic = ethers.id('Transfer(address,address,uint256)');

    for (const log of receipt.logs) {
      if (log.address.toLowerCase() === POSITION_MANAGER_ADDRESS.toLowerCase()) {
        if (log.topics[0] === transferEventTopic && log.topics.length >= 4) {
          // Transfer event: Transfer(from, to, tokenId)
          // topics[1] = from (padded), topics[2] = to (padded), topics[3] = tokenId
          tokenId = BigInt(log.topics[3]).toString();
          console.log(`[NFT-Service] Found tokenId from Transfer event: ${tokenId}`);
          break;
        }
      }
    }

    if (!tokenId) {
      console.error('[NFT-Service] Could not find tokenId in transaction events');
      await markNFTCreationFailed(positionId, 'Could not parse tokenId from events');
      return {
        success: false,
        error: 'Failed to parse transaction events',
      };
    }

    console.log(`[NFT-Service] Position created with tokenId: ${tokenId}, sent directly to ${recipientAddress}`);

    // Register the NFT in the system
    const registered = await registerCreatedNFT(
      positionId,
      tokenId,
      createTx.hash,
      recipientAddress,
      valueUsdc
    );

    if (!registered) {
      console.warn('[NFT-Service] NFT created but failed to register in database');
    }

    const urls = getNFTUrls(tokenId);

    console.log(`[NFT-Service] Successfully created NFT ${tokenId} for ${recipientAddress}`);

    return {
      success: true,
      tokenId,
      transactionHash: createTx.hash,
      polygonScanUrl: urls.polygonScan,
      uniswapUrl: urls.uniswap,
    };

  } catch (error: any) {
    console.error(`[NFT-Service] Error creating NFT:`, error);

    const errorMessage = error.message || 'Unknown error';
    await markNFTCreationFailed(positionId, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Automatically create NFT when a position is activated for a custodial wallet
 * This should be called when admin changes position status from Pending to Active
 */
export async function handlePositionActivation(
  positionId: number,
  walletAddress: string,
  valueUsdc: string
): Promise<NFTCreationResult | null> {
  try {
    console.log(`[NFT-Service] Handling position activation for position ${positionId}`);

    // Check if this is a custodial wallet
    const isCustodial = await isWalletCustodial(walletAddress);

    if (isCustodial) {
      console.log(`[NFT-Service] Wallet ${walletAddress} is custodial, creating NFT automatically`);
      return await createNFTForCustodialWallet(positionId, walletAddress, valueUsdc);
    } else {
      console.log(`[NFT-Service] Wallet ${walletAddress} is external, marking for manual creation`);
      await markPositionForNFTCreation(positionId);
      return null; // User will create manually via frontend
    }
  } catch (error) {
    console.error(`[NFT-Service] Error handling position activation:`, error);
    return null;
  }
}

/**
 * Get transaction data for creating a minimal position
 * This returns the encoded function call data that the user's wallet will sign
 * Note: tickLower and tickUpper should be provided from getDynamicTickRange()
 */
export function getCreatePositionTxData(
  tickLower: number,
  tickUpper: number
): string {
  const iface = new ethers.Interface(WAYPOOL_CREATOR_ABI);
  return iface.encodeFunctionData('createMinimalPosition', [tickLower, tickUpper]);
}

/**
 * Parse PositionCreated event from transaction receipt
 */
export function parsePositionCreatedEvent(logs: any[]): {
  tokenId: string;
  liquidity: string;
} | null {
  try {
    const iface = new ethers.Interface(WAYPOOL_CREATOR_ABI);

    for (const log of logs) {
      try {
        const parsed = iface.parseLog({
          topics: log.topics,
          data: log.data,
        });

        if (parsed?.name === 'PositionCreated') {
          return {
            tokenId: parsed.args.tokenId.toString(),
            liquidity: parsed.args.liquidity.toString(),
          };
        }
      } catch {
        // Not our event, continue
      }
    }

    return null;
  } catch (error) {
    console.error('[NFT-Service] Error parsing PositionCreated event:', error);
    return null;
  }
}

/**
 * Get URLs for the NFT
 */
export function getNFTUrls(tokenId: string): {
  polygonScan: string;
  uniswap: string;
} {
  return {
    polygonScan: `https://polygonscan.com/nft/${POSITION_MANAGER_ADDRESS}/${tokenId}`,
    uniswap: `https://app.uniswap.org/positions/v3/polygon/${tokenId}`,
  };
}

export default {
  WAYPOOL_CREATOR_ADDRESS,
  POSITION_MANAGER_ADDRESS,
  POLYGON_TOKENS,
  WAYPOOL_CREATOR_ABI,
  DEFAULT_TICK_RANGE,
  FEE_TIERS,
  markPositionForNFTCreation,
  getPendingNFTCreations,
  registerCreatedNFT,
  markNFTCreationFailed,
  getCreatePositionTxData,
  parsePositionCreatedEvent,
  getNFTUrls,
  isWalletCustodial,
  createNFTForCustodialWallet,
  createNFTForAnyWallet,
  handlePositionActivation,
};
