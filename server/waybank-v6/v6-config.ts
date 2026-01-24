/**
 * WayBank v6.0 Configuration
 *
 * IMPORTANTE: Este archivo es completamente independiente de la configuración existente.
 * Contiene únicamente la configuración para el sistema v6 paralelo.
 */

// ============ NETWORK CONFIGURATION ============

export const V6_NETWORKS = {
  polygon: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",

    // Uniswap V3 Addresses on Polygon
    contracts: {
      positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
      swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
      factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    },

    // WayBank v6 Deployed Contracts (Polygon Mainnet - Jan 2026)
    v6Contracts: {
      poolAnalyzer: "0xcf54688ad1db461C2D22BC24C0f20Adbeba76504",
      swapExecutor: "0x4933132E86E4132dAe5Ca30ecEE59fD684c48349",
      wayBankVault: "0x375D8808BDfB7D57D40524f0802bbc49008dEe79",
    },

    // Common Tokens on Polygon
    tokens: {
      USDC: {
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        decimals: 6,
        symbol: "USDC",
      },
      WETH: {
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        decimals: 18,
        symbol: "WETH",
      },
      WMATIC: {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        decimals: 18,
        symbol: "WMATIC",
      },
      WBTC: {
        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        decimals: 8,
        symbol: "WBTC",
      },
    },

    // Block explorer
    explorer: "https://polygonscan.com",
  },
} as const;

// ============ FEE TIERS ============

export const V6_FEE_TIERS = {
  LOW: 500, // 0.05%
  MEDIUM: 3000, // 0.3%
  HIGH: 10000, // 1%
} as const;

// ============ TICK SPACING ============

export const V6_TICK_SPACING = {
  [V6_FEE_TIERS.LOW]: 10,
  [V6_FEE_TIERS.MEDIUM]: 60,
  [V6_FEE_TIERS.HIGH]: 200,
} as const;

// ============ DEFAULT CONFIGURATION ============

export const V6_DEFAULT_CONFIG = {
  // Fee configuration
  vaultFeeBps: 100, // 1% vault fee

  // Rebalance configuration
  rebalanceThresholdBps: 500, // 5% out of range threshold
  defaultRangeWidthTicks: 2000,
  minRebalanceIntervalHours: 1,
  autoRebalanceIntervalHours: 24,

  // Slippage configuration
  defaultSlippageBps: 50, // 0.5%
  maxSlippageBps: 500, // 5%

  // Gas configuration
  maxGasPriceGwei: 500,
  gasLimitMultiplier: 1.2,

  // Operation timeouts
  transactionDeadlineMinutes: 10,
  operationTimeoutMs: 300000, // 5 minutes

  // Retry configuration
  maxRetries: 3,
  retryDelayMs: 5000,
} as const;

// ============ API ENDPOINTS ============

export const V6_API_ENDPOINTS = {
  // DefiLlama for APR data
  defiLlama: {
    pools: "https://yields.llama.fi/pools",
    chart: "https://yields.llama.fi/chart",
  },

  // The Graph (Uniswap V3 Polygon Subgraph)
  theGraph: {
    polygon: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
  },

  // CoinGecko for price data
  coinGecko: {
    prices: "https://api.coingecko.com/api/v3/simple/price",
  },
} as const;

// ============ CONTRACT ABIS (Simplified) ============

export const V6_ABIS = {
  // NonfungiblePositionManager - Key functions
  positionManager: [
    "function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "function collect(tuple(uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max) params) external returns (uint256 amount0, uint256 amount1)",
    "function decreaseLiquidity(tuple(uint256 tokenId, uint128 liquidity, uint256 amount0Min, uint256 amount1Min, uint256 deadline) params) external returns (uint256 amount0, uint256 amount1)",
    "function increaseLiquidity(tuple(uint256 tokenId, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, uint256 deadline) params) external returns (uint128 liquidity, uint256 amount0, uint256 amount1)",
    "function mint(tuple(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline) params) external returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)",
    "event DecreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)",
    "event Collect(uint256 indexed tokenId, address recipient, uint256 amount0, uint256 amount1)",
  ],

  // Pool - Key functions
  pool: [
    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
    "function liquidity() external view returns (uint128)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function fee() external view returns (uint24)",
    "function tickSpacing() external view returns (int24)",
  ],

  // Factory - Key functions
  factory: [
    "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
  ],

  // SwapRouter - Key functions
  swapRouter: [
    "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) external payable returns (uint256 amountOut)",
  ],

  // Quoter - Key functions
  quoter: [
    "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)",
  ],

  // ERC20 - Basic functions
  erc20: [
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
  ],
} as const;

// ============ HELPER FUNCTIONS ============

/**
 * Get network configuration by chain ID
 */
export function getNetworkConfig(chainId: number) {
  const network = Object.values(V6_NETWORKS).find((n) => n.chainId === chainId);
  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return network;
}

/**
 * Get tick spacing for a fee tier
 */
export function getTickSpacing(fee: number): number {
  const spacing = V6_TICK_SPACING[fee as keyof typeof V6_TICK_SPACING];
  if (!spacing) {
    throw new Error(`Invalid fee tier: ${fee}`);
  }
  return spacing;
}

/**
 * Round tick down to tick spacing
 */
export function roundTickDown(tick: number, tickSpacing: number): number {
  const compressed = Math.floor(tick / tickSpacing);
  if (tick < 0 && tick % tickSpacing !== 0) {
    return (compressed - 1) * tickSpacing;
  }
  return compressed * tickSpacing;
}

/**
 * Round tick up to tick spacing
 */
export function roundTickUp(tick: number, tickSpacing: number): number {
  const compressed = Math.ceil(tick / tickSpacing);
  return compressed * tickSpacing;
}

/**
 * Calculate recommended tick range centered on current tick
 */
export function calculateTickRange(
  currentTick: number,
  rangeWidthTicks: number,
  tickSpacing: number
): { tickLower: number; tickUpper: number } {
  const halfRange = Math.floor(rangeWidthTicks / 2);
  const tickLower = roundTickDown(currentTick - halfRange, tickSpacing);
  const tickUpper = roundTickUp(currentTick + halfRange, tickSpacing);
  return { tickLower, tickUpper };
}

/**
 * Check if a position is in range
 */
export function isPositionInRange(
  currentTick: number,
  tickLower: number,
  tickUpper: number
): boolean {
  return currentTick >= tickLower && currentTick < tickUpper;
}

/**
 * Calculate how far out of range a position is (in basis points)
 */
export function calculateOutOfRangeBps(
  currentTick: number,
  tickLower: number,
  tickUpper: number
): number {
  if (isPositionInRange(currentTick, tickLower, tickUpper)) {
    return 0;
  }

  const rangeWidth = tickUpper - tickLower;
  if (currentTick < tickLower) {
    const distance = tickLower - currentTick;
    return Math.floor((distance / rangeWidth) * 10000);
  } else {
    const distance = currentTick - tickUpper;
    return Math.floor((distance / rangeWidth) * 10000);
  }
}
