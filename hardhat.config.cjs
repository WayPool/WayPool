require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load environment variables
// Use Alchemy RPC for better rate limits
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "KaVqN2ssq8kWchnWv9pw0";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    // Local development network
    hardhat: {
      chainId: 31337,
      forking: {
        url: POLYGON_RPC_URL,
        enabled: false, // Enable when testing with mainnet fork
      },
    },
    // Polygon Mainnet
    polygon: {
      url: POLYGON_RPC_URL,
      chainId: 137,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
    // Polygon Amoy Testnet (formerly Mumbai)
    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
