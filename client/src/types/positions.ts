/**
 * Tipos para posiciones en Uniswap (virtuales y reales)
 */

// Posición virtual en WayBank
export interface Position {
  id: number;
  walletAddress: string;
  poolAddress: string;
  poolName: string;
  token0: string;
  token1: string;
  token0Decimals: number;
  token1Decimals: number;
  token0Amount: string;
  token1Amount: string;
  depositedUSDC: string;
  apr: string;
  feesEarned: string;
  timeframe: number;
  status: string;
  timestamp: string;
  startDate?: string;
  endDate?: string;
  tokenId?: string;
  data?: string;
  range?: {
    lowerTick: number;
    upperTick: number;
  };
}

// Posición real en Uniswap
export interface RealPosition {
  id: number;
  walletAddress: string;
  virtualPositionId: string;
  poolAddress: string;
  poolName: string;
  token0: string;
  token1: string;
  token0Amount: string | number;
  token1Amount: string | number;
  tokenId?: string;
  txHash?: string;
  network: string;
  status: string;
  createdAt?: string;
  lastUpdated?: string;
  blockExplorerUrl?: string;
  liquidityValue?: string | number;
  feesEarned?: string | number;
  inRange: boolean;
  additionalData?: string;
}