const hre = require("hardhat");

async function main() {
  console.log("Deploying WayPoolPositionCreator to Polygon...\n");

  // Uniswap V3 NonfungiblePositionManager address (same on all networks)
  const POSITION_MANAGER_ADDRESS = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

  if (balance < hre.ethers.parseEther("0.1")) {
    console.warn("WARNING: Low balance. You may need more MATIC for deployment.\n");
  }

  // Deploy the contract
  console.log("Deploying WayPoolPositionCreator...");
  const WayPoolPositionCreator = await hre.ethers.getContractFactory("WayPoolPositionCreator");
  const contract = await WayPoolPositionCreator.deploy(POSITION_MANAGER_ADDRESS);

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("\nWayPoolPositionCreator deployed to:", contractAddress);

  // Get deployment transaction
  const deploymentTx = contract.deploymentTransaction();
  console.log("Deployment transaction hash:", deploymentTx.hash);

  // Wait for a few confirmations
  console.log("\nWaiting for confirmations...");
  await deploymentTx.wait(3);
  console.log("Confirmed!");

  // Verify contract configuration
  console.log("\n=== Contract Configuration ===");
  const config = await contract.getDefaultConfig();
  console.log("Token0 (USDC):", config.token0);
  console.log("Token1 (WETH):", config.token1);
  console.log("Fee Tier:", config.fee.toString(), "(0.05%)");
  console.log("Min Amount0:", config.minAmt0.toString(), "wei");
  console.log("Min Amount1:", config.minAmt1.toString(), "wei");
  console.log("Position Manager:", await contract.positionManager());

  // Print verification command
  console.log("\n=== Verification ===");
  console.log("To verify on PolygonScan, run:");
  console.log(`npx hardhat verify --network polygon ${contractAddress} ${POSITION_MANAGER_ADDRESS}`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: contractAddress,
    positionManagerAddress: POSITION_MANAGER_ADDRESS,
    deployer: deployer.address,
    transactionHash: deploymentTx.hash,
    timestamp: new Date().toISOString(),
    config: {
      token0: config.token0,
      token1: config.token1,
      fee: config.fee.toString(),
      minAmount0: config.minAmt0.toString(),
      minAmount1: config.minAmt1.toString(),
    },
  };

  console.log("\n=== Deployment Info ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Write deployment info to file
  const fs = require("fs");
  const path = require("path");
  const deploymentsDir = path.join(__dirname, "..", "deployments");

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`\nDeployment info saved to: deployments/${filename}`);

  return contractAddress;
}

main()
  .then((address) => {
    console.log("\nDeployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
