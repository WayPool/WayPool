/**
 * WayBank v6.0 Deployment Script
 *
 * Despliega los contratos del sistema v6 en Polygon.
 * NO modifica ni interactúa con WayPoolPositionCreator existente.
 *
 * Uso:
 *   npx hardhat run scripts/deploy-waybank-v6.cjs --network polygon
 *
 * Variables de entorno requeridas:
 *   - DEPLOYER_PRIVATE_KEY
 *   - POLYGON_RPC_URL
 *   - POLYGONSCAN_API_KEY (para verificación)
 */

const hre = require("hardhat");

// Polygon Mainnet Addresses
const POLYGON_ADDRESSES = {
  // Uniswap V3 Contracts
  positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  quoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
};

// Helper function to wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("========================================");
  console.log("WayBank v6.0 Deployment Script");
  console.log("========================================\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "MATIC\n");

  if (balance < hre.ethers.parseEther("0.1")) {
    console.error("ERROR: Insufficient balance. Need at least 0.1 MATIC for deployment.");
    process.exit(1);
  }

  // Treasury address (usar el deployer como treasury por defecto)
  const treasury = deployer.address;
  console.log("Treasury address:", treasury);
  console.log("");

  // ========================================
  // Deploy PoolAnalyzer
  // ========================================
  console.log("1. Deploying PoolAnalyzer...");
  const PoolAnalyzer = await hre.ethers.getContractFactory("PoolAnalyzer");
  const poolAnalyzer = await PoolAnalyzer.deploy(POLYGON_ADDRESSES.factory);
  await poolAnalyzer.waitForDeployment();
  const poolAnalyzerAddress = await poolAnalyzer.getAddress();
  console.log("   PoolAnalyzer deployed to:", poolAnalyzerAddress);
  console.log("   Waiting 15 seconds to avoid rate limit...");
  await sleep(15000);
  console.log("");

  // ========================================
  // Deploy SwapExecutor
  // ========================================
  console.log("2. Deploying SwapExecutor...");
  const SwapExecutor = await hre.ethers.getContractFactory("SwapExecutor");
  const swapExecutor = await SwapExecutor.deploy(
    POLYGON_ADDRESSES.swapRouter,
    POLYGON_ADDRESSES.quoter
  );
  await swapExecutor.waitForDeployment();
  const swapExecutorAddress = await swapExecutor.getAddress();
  console.log("   SwapExecutor deployed to:", swapExecutorAddress);
  console.log("   Waiting 15 seconds to avoid rate limit...");
  await sleep(15000);
  console.log("");

  // ========================================
  // Deploy WayBankVault
  // ========================================
  console.log("3. Deploying WayBankVault...");
  const WayBankVault = await hre.ethers.getContractFactory("WayBankVault");
  const wayBankVault = await WayBankVault.deploy(
    POLYGON_ADDRESSES.positionManager,
    POLYGON_ADDRESSES.swapRouter,
    treasury
  );
  await wayBankVault.waitForDeployment();
  const wayBankVaultAddress = await wayBankVault.getAddress();
  console.log("   WayBankVault deployed to:", wayBankVaultAddress);
  console.log("");

  // ========================================
  // Summary
  // ========================================
  console.log("========================================");
  console.log("DEPLOYMENT COMPLETE!");
  console.log("========================================\n");

  console.log("Contract Addresses:");
  console.log("-------------------");
  console.log("PoolAnalyzer:  ", poolAnalyzerAddress);
  console.log("SwapExecutor:  ", swapExecutorAddress);
  console.log("WayBankVault:  ", wayBankVaultAddress);
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    treasury: treasury,
    timestamp: new Date().toISOString(),
    contracts: {
      PoolAnalyzer: poolAnalyzerAddress,
      SwapExecutor: swapExecutorAddress,
      WayBankVault: wayBankVaultAddress,
    },
    dependencies: POLYGON_ADDRESSES,
  };

  // Write deployment info to file
  const fs = require("fs");
  const path = require("path");
  const deploymentsDir = path.join(__dirname, "..", "deployments");

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `waybank-v6-${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`Deployment info saved to: deployments/${filename}`);
  console.log("");

  // ========================================
  // Verification Instructions
  // ========================================
  console.log("========================================");
  console.log("VERIFICATION COMMANDS:");
  console.log("========================================\n");

  console.log("Run these commands to verify on PolygonScan:\n");

  console.log(`npx hardhat verify --network polygon ${poolAnalyzerAddress} "${POLYGON_ADDRESSES.factory}"`);
  console.log("");

  console.log(`npx hardhat verify --network polygon ${swapExecutorAddress} "${POLYGON_ADDRESSES.swapRouter}" "${POLYGON_ADDRESSES.quoter}"`);
  console.log("");

  console.log(`npx hardhat verify --network polygon ${wayBankVaultAddress} "${POLYGON_ADDRESSES.positionManager}" "${POLYGON_ADDRESSES.swapRouter}" "${treasury}"`);
  console.log("");

  return deploymentInfo;
}

main()
  .then((result) => {
    console.log("\n✅ Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
