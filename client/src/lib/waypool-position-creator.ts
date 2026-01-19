/**
 * WayPool Position Creator - Frontend Integration
 *
 * This module provides functions to interact with the WayPoolPositionCreator
 * smart contract deployed on Polygon network.
 */

import { ethers } from 'ethers';

// Contract address on Polygon Mainnet
export const WAYPOOL_CREATOR_ADDRESS = "0xf81938F926714f114D07b68dfc3b0E3bC501167B";

// Token addresses on Polygon
export const POLYGON_TOKENS = {
  USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // Native USDC on Polygon
  USDC_BRIDGED: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Bridged USDC.e
  WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // WETH on Polygon
  MATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // Wrapped MATIC
};

// Uniswap V3 Position Manager
export const POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

// Contract ABI (minimal interface for the functions we need)
export const WAYPOOL_CREATOR_ABI = [
  // Read functions
  "function positionManager() external view returns (address)",
  "function minAmount0() external view returns (uint256)",
  "function minAmount1() external view returns (uint256)",
  "function positionsCreated() external view returns (uint256)",
  "function getDefaultConfig() external view returns (address token0, address token1, uint24 fee, uint256 minAmt0, uint256 minAmt1)",
  "function owner() external view returns (address)",

  // Write functions
  "function createMinimalPosition(int24 tickLower, int24 tickUpper) external returns (uint256 tokenId, uint128 liquidity)",
  "function createPosition(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0, uint256 amount1) external returns (uint256 tokenId, uint128 liquidity)",

  // Events
  "event PositionCreated(address indexed user, uint256 indexed tokenId, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 amount0, uint256 amount1)",
];

// ERC20 ABI for approvals
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
];

// Types
export interface PositionCreatedEvent {
  user: string;
  tokenId: string;
  token0: string;
  token1: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  amount0: string;
  amount1: string;
  transactionHash: string;
}

export interface CreatePositionParams {
  tickLower: number;
  tickUpper: number;
  token0?: string;
  token1?: string;
  fee?: number;
  amount0?: string;
  amount1?: string;
}

export interface ContractConfig {
  token0: string;
  token1: string;
  fee: number;
  minAmount0: string;
  minAmount1: string;
  positionsCreated: number;
}

/**
 * Get the WayPoolPositionCreator contract instance
 */
export function getWayPoolCreatorContract(signerOrProvider: ethers.Signer | ethers.Provider): ethers.Contract {
  return new ethers.Contract(WAYPOOL_CREATOR_ADDRESS, WAYPOOL_CREATOR_ABI, signerOrProvider);
}

/**
 * Get the contract configuration
 */
export async function getContractConfig(provider: ethers.Provider): Promise<ContractConfig> {
  const contract = getWayPoolCreatorContract(provider);
  const config = await contract.getDefaultConfig();
  const positionsCreated = await contract.positionsCreated();

  return {
    token0: config.token0,
    token1: config.token1,
    fee: Number(config.fee),
    minAmount0: config.minAmt0.toString(),
    minAmount1: config.minAmt1.toString(),
    positionsCreated: Number(positionsCreated),
  };
}

/**
 * Check if tokens are approved for the contract
 */
export async function checkTokenApprovals(
  signer: ethers.Signer,
  token0Amount: bigint,
  token1Amount: bigint
): Promise<{ token0Approved: boolean; token1Approved: boolean }> {
  const userAddress = await signer.getAddress();

  const usdc = new ethers.Contract(POLYGON_TOKENS.USDC, ERC20_ABI, signer);
  const weth = new ethers.Contract(POLYGON_TOKENS.WETH, ERC20_ABI, signer);

  const [usdcAllowance, wethAllowance] = await Promise.all([
    usdc.allowance(userAddress, WAYPOOL_CREATOR_ADDRESS),
    weth.allowance(userAddress, WAYPOOL_CREATOR_ADDRESS),
  ]);

  return {
    token0Approved: usdcAllowance >= token0Amount,
    token1Approved: wethAllowance >= token1Amount,
  };
}

/**
 * Approve tokens for the WayPool contract
 */
export async function approveTokens(
  signer: ethers.Signer,
  token0Amount: bigint = 1n,
  token1Amount: bigint = 1n
): Promise<{ tx0?: ethers.TransactionResponse; tx1?: ethers.TransactionResponse }> {
  const results: { tx0?: ethers.TransactionResponse; tx1?: ethers.TransactionResponse } = {};

  const usdc = new ethers.Contract(POLYGON_TOKENS.USDC, ERC20_ABI, signer);
  const weth = new ethers.Contract(POLYGON_TOKENS.WETH, ERC20_ABI, signer);

  // Approve USDC
  if (token0Amount > 0n) {
    console.log(`Approving ${token0Amount} USDC for WayPoolPositionCreator...`);
    results.tx0 = await usdc.approve(WAYPOOL_CREATOR_ADDRESS, token0Amount);
    await results.tx0.wait();
    console.log("USDC approved!");
  }

  // Approve WETH
  if (token1Amount > 0n) {
    console.log(`Approving ${token1Amount} WETH for WayPoolPositionCreator...`);
    results.tx1 = await weth.approve(WAYPOOL_CREATOR_ADDRESS, token1Amount);
    await results.tx1.wait();
    console.log("WETH approved!");
  }

  return results;
}

/**
 * Create a minimal position (uses contract defaults)
 * @param signer - The user's signer
 * @param tickLower - Lower tick of the price range
 * @param tickUpper - Upper tick of the price range
 * @returns The created position details
 */
export async function createMinimalPosition(
  signer: ethers.Signer,
  tickLower: number,
  tickUpper: number
): Promise<PositionCreatedEvent> {
  console.log("Creating minimal position...");
  console.log(`Tick range: [${tickLower}, ${tickUpper}]`);

  // First, ensure tokens are approved
  const { token0Approved, token1Approved } = await checkTokenApprovals(signer, 1n, 1n);

  if (!token0Approved || !token1Approved) {
    console.log("Approving tokens...");
    await approveTokens(signer, 1n, 1n);
  }

  // Create the position
  const contract = getWayPoolCreatorContract(signer);

  console.log("Sending createMinimalPosition transaction...");
  const tx = await contract.createMinimalPosition(tickLower, tickUpper);

  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();

  // Parse the PositionCreated event
  const event = receipt.logs
    .map((log: ethers.Log) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((parsed: ethers.LogDescription | null) => parsed?.name === "PositionCreated");

  if (!event) {
    throw new Error("PositionCreated event not found in transaction");
  }

  const result: PositionCreatedEvent = {
    user: event.args.user,
    tokenId: event.args.tokenId.toString(),
    token0: event.args.token0,
    token1: event.args.token1,
    fee: Number(event.args.fee),
    tickLower: Number(event.args.tickLower),
    tickUpper: Number(event.args.tickUpper),
    liquidity: event.args.liquidity.toString(),
    amount0: event.args.amount0.toString(),
    amount1: event.args.amount1.toString(),
    transactionHash: receipt.hash,
  };

  console.log("Position created successfully!");
  console.log("Token ID:", result.tokenId);

  return result;
}

/**
 * Create a custom position with specified amounts
 */
export async function createCustomPosition(
  signer: ethers.Signer,
  params: CreatePositionParams
): Promise<PositionCreatedEvent> {
  const {
    tickLower,
    tickUpper,
    token0 = POLYGON_TOKENS.USDC,
    token1 = POLYGON_TOKENS.WETH,
    fee = 500,
    amount0 = "1",
    amount1 = "1",
  } = params;

  console.log("Creating custom position...");
  console.log("Params:", { token0, token1, fee, tickLower, tickUpper, amount0, amount1 });

  const amount0BN = BigInt(amount0);
  const amount1BN = BigInt(amount1);

  // Approve tokens
  const token0Contract = new ethers.Contract(token0, ERC20_ABI, signer);
  const token1Contract = new ethers.Contract(token1, ERC20_ABI, signer);

  const userAddress = await signer.getAddress();
  const [allowance0, allowance1] = await Promise.all([
    token0Contract.allowance(userAddress, WAYPOOL_CREATOR_ADDRESS),
    token1Contract.allowance(userAddress, WAYPOOL_CREATOR_ADDRESS),
  ]);

  if (allowance0 < amount0BN) {
    console.log("Approving token0...");
    const approveTx0 = await token0Contract.approve(WAYPOOL_CREATOR_ADDRESS, amount0BN);
    await approveTx0.wait();
  }

  if (allowance1 < amount1BN) {
    console.log("Approving token1...");
    const approveTx1 = await token1Contract.approve(WAYPOOL_CREATOR_ADDRESS, amount1BN);
    await approveTx1.wait();
  }

  // Create position
  const contract = getWayPoolCreatorContract(signer);

  const tx = await contract.createPosition(
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    amount0BN,
    amount1BN
  );

  console.log("Transaction hash:", tx.hash);
  const receipt = await tx.wait();

  // Parse event
  const event = receipt.logs
    .map((log: ethers.Log) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((parsed: ethers.LogDescription | null) => parsed?.name === "PositionCreated");

  if (!event) {
    throw new Error("PositionCreated event not found");
  }

  return {
    user: event.args.user,
    tokenId: event.args.tokenId.toString(),
    token0: event.args.token0,
    token1: event.args.token1,
    fee: Number(event.args.fee),
    tickLower: Number(event.args.tickLower),
    tickUpper: Number(event.args.tickUpper),
    liquidity: event.args.liquidity.toString(),
    amount0: event.args.amount0.toString(),
    amount1: event.args.amount1.toString(),
    transactionHash: receipt.hash,
  };
}

/**
 * Calculate tick values for a given price range
 * @param currentPrice - Current price of token1 in terms of token0
 * @param lowerPricePercent - Percentage below current price for lower bound (e.g., 10 for -10%)
 * @param upperPricePercent - Percentage above current price for upper bound (e.g., 10 for +10%)
 * @param token0Decimals - Decimals of token0 (default: 6 for USDC)
 * @param token1Decimals - Decimals of token1 (default: 18 for WETH)
 * @returns Tick values for the price range
 */
export function calculateTicksFromPriceRange(
  currentPrice: number,
  lowerPricePercent: number,
  upperPricePercent: number,
  token0Decimals: number = 6,
  token1Decimals: number = 18
): { tickLower: number; tickUpper: number } {
  const lowerPrice = currentPrice * (1 - lowerPricePercent / 100);
  const upperPrice = currentPrice * (1 + upperPricePercent / 100);

  // Convert prices to ticks
  // tick = log(price * 10^(token0Decimals - token1Decimals)) / log(1.0001)
  const decimalAdjustment = Math.pow(10, token0Decimals - token1Decimals);

  const tickLower = Math.floor(
    Math.log(lowerPrice * decimalAdjustment) / Math.log(1.0001)
  );
  const tickUpper = Math.ceil(
    Math.log(upperPrice * decimalAdjustment) / Math.log(1.0001)
  );

  // Round to nearest valid tick (tick spacing for 0.05% fee = 10)
  const tickSpacing = 10;
  const roundedTickLower = Math.floor(tickLower / tickSpacing) * tickSpacing;
  const roundedTickUpper = Math.ceil(tickUpper / tickSpacing) * tickSpacing;

  return {
    tickLower: roundedTickLower,
    tickUpper: roundedTickUpper,
  };
}

/**
 * Get the Uniswap NFT URL for a position
 */
export function getUniswapPositionUrl(tokenId: string, network: string = "polygon"): string {
  return `https://app.uniswap.org/positions/v3/${network}/${tokenId}`;
}

/**
 * Get the PolygonScan NFT URL for a position
 */
export function getPolygonScanNftUrl(tokenId: string): string {
  return `https://polygonscan.com/nft/${POSITION_MANAGER_ADDRESS}/${tokenId}`;
}

/**
 * Check user's token balances
 */
export async function checkUserBalances(
  provider: ethers.Provider,
  userAddress: string
): Promise<{ usdc: string; weth: string; matic: string }> {
  const usdc = new ethers.Contract(POLYGON_TOKENS.USDC, ERC20_ABI, provider);
  const weth = new ethers.Contract(POLYGON_TOKENS.WETH, ERC20_ABI, provider);

  const [usdcBalance, wethBalance, maticBalance] = await Promise.all([
    usdc.balanceOf(userAddress),
    weth.balanceOf(userAddress),
    provider.getBalance(userAddress),
  ]);

  return {
    usdc: ethers.formatUnits(usdcBalance, 6),
    weth: ethers.formatUnits(wethBalance, 18),
    matic: ethers.formatEther(maticBalance),
  };
}

// Export default configuration
// Updated to use ticks near current pool price to avoid tokenURI overflow errors
// The server will provide the actual dynamic ticks based on current pool price
export const DEFAULT_TICK_RANGE = {
  // For USDC/WETH at ~$3300 ETH price (current tick ~195615)
  // Using ~50% range each direction (5000 ticks = ~50% price change)
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
