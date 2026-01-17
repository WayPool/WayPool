export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Network {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: NativeCurrency;
  isTestnet: boolean;
  logoUrl: string;
}

export const NETWORKS: Record<string, Network> = {
  ETHEREUM: {
    name: "Ethereum",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/",
    blockExplorerUrl: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    isTestnet: false,
    logoUrl: "/src/assets/ethereum-icon.svg",
  },
  POLYGON: {
    name: "Polygon",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    blockExplorerUrl: "https://polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    isTestnet: false,
    logoUrl: "/src/assets/polygon-icon.svg",
  },
  UNICHAIN: {
    name: "Unichain",
    chainId: 8899,
    rpcUrl: "https://rpc.unichain.network",
    blockExplorerUrl: "https://explorer.unichain.network",
    nativeCurrency: {
      name: "UNI",
      symbol: "UNI",
      decimals: 18,
    },
    isTestnet: false,
    logoUrl: "/assets/networks/unichain-logo.svg",
  },
};

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl: string;
  color: string;
}

export const TOKENS: Record<string, Record<string, Token>> = {
  ETHEREUM: {
    ETH: {
      symbol: "ETH",
      name: "Ether",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      logoUrl: "/src/assets/ethereum-icon.svg",
      color: "#627EEA",
    },
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      color: "#2775CA",
    },
    WBTC: {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
      logoUrl: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png",
      color: "#F7931A",
    },
  },
  POLYGON: {
    MATIC: {
      symbol: "MATIC",
      name: "MATIC",
      address: "0x0000000000000000000000000000000000001010",
      decimals: 18,
      logoUrl: "/src/assets/polygon-icon.svg",
      color: "#8247E5",
    },
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      color: "#2775CA",
    },
    ETH: {
      symbol: "ETH",
      name: "Ether",
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      logoUrl: "/src/assets/ethereum-icon.svg",
      color: "#627EEA",
    },
  },
  UNICHAIN: {
    UNI: {
      symbol: "UNI",
      name: "Unichain",
      address: "0x0000000000000000000000000000000000001010",
      decimals: 18,
      logoUrl: "/assets/networks/unichain-logo.svg",
      color: "#E926C3",
    },
    USDC: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      decimals: 6,
      logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      color: "#2775CA",
    },
    ETH: {
      symbol: "ETH",
      name: "Ether",
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      decimals: 18,
      logoUrl: "/src/assets/ethereum-icon.svg",
      color: "#627EEA",
    },
  },
};

// Predefined pool addresses
export const POOLS = {
  ETHEREUM: {
    "USDC-ETH": {
      address: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640", // USDC-ETH 0.3% Uniswap V3 Pool
      feeTier: 3000, // 0.3%
    },
  },
  POLYGON: {
    "USDC-MATIC": {
      address: "0xA374094527e1673A86dE625aa59517c5dE346d32", // Example address
      feeTier: 3000, // 0.3%
    },
    "ETH-USDC": {
      address: "0x45dDa9cb7c25131DF268515131f647d726f50608", // Example address
      feeTier: 500, // 0.05%
    },
  },
  UNICHAIN: {
    "USDC-ETH": {
      address: "0x4529a01c7a0410167c5740c487a8de60232617bf", // Unichain V4 Pool
      feeTier: 3000, // 0.3%
    },
  },
};

// Wallet address for deposits
export const DEFAULT_WALLET_ADDRESS = "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F";

// Common APR estimation constants
export const APR_ESTIMATION = {
  DAILY_VOLUME_MULTIPLIER: 0.002, // 0.2% daily volume fluctuation
  ANNUAL_DAYS: 365,
};
