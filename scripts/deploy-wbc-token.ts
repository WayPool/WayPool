/**
 * WBC Token Deployment Script
 *
 * This script deploys the WBCToken contract to Polygon network
 * and updates the database configuration.
 *
 * Usage:
 *   npx hardhat run scripts/deploy-wbc-token.ts --network polygon
 *   npx hardhat run scripts/deploy-wbc-token.ts --network polygonAmoy (testnet)
 */

import { ethers } from 'hardhat';
import { Pool } from 'pg';

async function main() {
  console.log('='.repeat(60));
  console.log('WBC Token Deployment');
  console.log('='.repeat(60));

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log(`\nNetwork: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} MATIC`);

  if (balance < ethers.parseEther('0.1')) {
    console.error('\nERROR: Insufficient MATIC for deployment. Need at least 0.1 MATIC');
    process.exit(1);
  }

  // Deploy WBCToken
  console.log('\n[1/4] Deploying WBCToken contract...');

  const WBCToken = await ethers.getContractFactory('WBCToken');
  const wbcToken = await WBCToken.deploy();

  await wbcToken.waitForDeployment();
  const contractAddress = await wbcToken.getAddress();
  const deploymentTx = wbcToken.deploymentTransaction();

  console.log(`✅ WBCToken deployed to: ${contractAddress}`);
  console.log(`   Transaction: ${deploymentTx?.hash}`);

  // Verify deployment
  console.log('\n[2/4] Verifying deployment...');

  const name = await wbcToken.name();
  const symbol = await wbcToken.symbol();
  const decimals = await wbcToken.decimals();
  const owner = await wbcToken.owner();

  console.log(`   Name: ${name}`);
  console.log(`   Symbol: ${symbol}`);
  console.log(`   Decimals: ${decimals}`);
  console.log(`   Owner: ${owner}`);

  // Calculate initial supply based on active positions
  console.log('\n[3/4] Calculating initial supply...');

  let initialSupply = BigInt(0);
  let dbConnected = false;

  try {
    // Connect to database
    const dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Get total USDC in active positions
    const result = await dbPool.query(`
      SELECT COALESCE(SUM(CAST(deposited_usdc AS DECIMAL)), 0) as total_usdc
      FROM public.position_history
      WHERE status = 'Active'
    `);

    const totalUsdc = parseFloat(result.rows[0].total_usdc || '0');
    console.log(`   Total USDC in active positions: $${totalUsdc.toLocaleString()}`);

    // Add 10% buffer for fees
    const supplyWithBuffer = totalUsdc * 1.1;
    initialSupply = ethers.parseUnits(supplyWithBuffer.toFixed(6), 6);

    console.log(`   Initial supply to mint: ${ethers.formatUnits(initialSupply, 6)} WBC`);

    await dbPool.end();
    dbConnected = true;

  } catch (error) {
    console.log('   Could not connect to database. Using default supply.');
    // Default: 3 million WBC (covers ~$2.5M in positions)
    initialSupply = ethers.parseUnits('3000000', 6);
  }

  // Mint initial supply
  console.log('\n[4/4] Minting initial supply...');

  if (initialSupply > BigInt(0)) {
    const mintTx = await wbcToken.mint(deployer.address, initialSupply);
    await mintTx.wait();
    console.log(`✅ Minted ${ethers.formatUnits(initialSupply, 6)} WBC to owner`);

    const ownerBalance = await wbcToken.balanceOf(deployer.address);
    console.log(`   Owner balance: ${ethers.formatUnits(ownerBalance, 6)} WBC`);
  }

  // Update database config if connected
  if (dbConnected) {
    try {
      const dbPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      await dbPool.query(`
        UPDATE public.wbc_config SET value = $1, updated_at = NOW() WHERE key = 'contract_address'
      `, [contractAddress]);

      await dbPool.query(`
        UPDATE public.wbc_config SET value = $1, updated_at = NOW() WHERE key = 'owner_wallet'
      `, [deployer.address]);

      await dbPool.query(`
        UPDATE public.wbc_config SET value = $1, updated_at = NOW() WHERE key = 'deploy_tx_hash'
      `, [deploymentTx?.hash || '']);

      await dbPool.query(`
        UPDATE public.wbc_config SET value = $1, updated_at = NOW() WHERE key = 'deploy_date'
      `, [new Date().toISOString()]);

      await dbPool.query(`
        UPDATE public.wbc_config SET value = $1, updated_at = NOW() WHERE key = 'initial_supply'
      `, [ethers.formatUnits(initialSupply, 6)]);

      await dbPool.query(`
        UPDATE public.wbc_config SET value = $1, updated_at = NOW() WHERE key = 'chain_id'
      `, [network.chainId.toString()]);

      await dbPool.end();
      console.log('\n✅ Database configuration updated');

    } catch (error) {
      console.log('\nWARNING: Could not update database config');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('DEPLOYMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Owner Address: ${deployer.address}`);
  console.log(`Initial Supply: ${ethers.formatUnits(initialSupply, 6)} WBC`);
  console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log(`Transaction: ${deploymentTx?.hash}`);
  console.log('='.repeat(60));

  // Verification instructions
  console.log('\nNEXT STEPS:');
  console.log('1. Verify contract on PolygonScan:');
  console.log(`   npx hardhat verify --network polygon ${contractAddress}`);
  console.log('\n2. Activate WBC system in admin panel or run:');
  console.log('   UPDATE wbc_config SET value = \'true\' WHERE key = \'is_active\';');
  console.log('\n3. Run initial distribution to existing users:');
  console.log('   npx tsx scripts/distribute-initial-wbc.ts');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
