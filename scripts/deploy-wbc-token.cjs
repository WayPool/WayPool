/**
 * WBC Token Deployment Script
 *
 * Deploys the WBCToken contract to Polygon Mainnet
 */

const hre = require('hardhat');

async function main() {
  console.log('='.repeat(60));
  console.log('WBC Token Deployment - Polygon Mainnet');
  console.log('='.repeat(60));

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`\nNetwork: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${hre.ethers.formatEther(balance)} MATIC`);

  if (balance < hre.ethers.parseEther('0.1')) {
    console.error('\nERROR: Insufficient MATIC for deployment. Need at least 0.1 MATIC');
    process.exit(1);
  }

  // Deploy WBCToken
  console.log('\n[1/3] Deploying WBCToken contract...');

  const WBCToken = await hre.ethers.getContractFactory('WBCToken');
  const wbcToken = await WBCToken.deploy();

  await wbcToken.waitForDeployment();
  const contractAddress = await wbcToken.getAddress();
  const deploymentTx = wbcToken.deploymentTransaction();

  console.log(`✅ WBCToken deployed to: ${contractAddress}`);
  console.log(`   Transaction: ${deploymentTx?.hash}`);

  // Verify deployment
  console.log('\n[2/3] Verifying deployment...');

  const name = await wbcToken.name();
  const symbol = await wbcToken.symbol();
  const decimals = await wbcToken.decimals();
  const owner = await wbcToken.owner();

  console.log(`   Name: ${name}`);
  console.log(`   Symbol: ${symbol}`);
  console.log(`   Decimals: ${decimals}`);
  console.log(`   Owner: ${owner}`);

  // Calculate initial supply based on active positions (default: 3 million)
  console.log('\n[3/3] Minting initial supply...');

  // Default: 3 million WBC (covers ~$2.5M in positions)
  const initialSupply = hre.ethers.parseUnits('3000000', 6);

  const mintTx = await wbcToken.mint(deployer.address, initialSupply);
  await mintTx.wait();
  console.log(`✅ Minted ${hre.ethers.formatUnits(initialSupply, 6)} WBC to owner`);

  const ownerBalance = await wbcToken.balanceOf(deployer.address);
  console.log(`   Owner balance: ${hre.ethers.formatUnits(ownerBalance, 6)} WBC`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('DEPLOYMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Owner Address: ${deployer.address}`);
  console.log(`Initial Supply: ${hre.ethers.formatUnits(initialSupply, 6)} WBC`);
  console.log(`Network: Polygon Mainnet (Chain ID: ${network.chainId})`);
  console.log(`Transaction: ${deploymentTx?.hash}`);
  console.log('='.repeat(60));

  // Output for database update
  console.log('\n📋 DATABASE UPDATE COMMANDS:');
  console.log(`UPDATE wbc_config SET value = '${contractAddress}' WHERE key = 'contract_address';`);
  console.log(`UPDATE wbc_config SET value = '${deployer.address}' WHERE key = 'owner_wallet';`);
  console.log(`UPDATE wbc_config SET value = '${deploymentTx?.hash}' WHERE key = 'deploy_tx_hash';`);
  console.log(`UPDATE wbc_config SET value = '${new Date().toISOString()}' WHERE key = 'deploy_date';`);
  console.log(`UPDATE wbc_config SET value = '3000000' WHERE key = 'initial_supply';`);

  // Return deployment info
  return {
    contractAddress,
    ownerAddress: deployer.address,
    initialSupply: '3000000',
    txHash: deploymentTx?.hash,
    chainId: network.chainId.toString()
  };
}

main()
  .then((result) => {
    console.log('\n✅ Deployment completed successfully!');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });
