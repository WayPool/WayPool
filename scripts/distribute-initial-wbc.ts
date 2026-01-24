/**
 * Initial WBC Distribution Script
 *
 * Distributes WBC tokens to all users with active positions
 * based on their deposited USDC + accumulated fees (if positive)
 *
 * Usage:
 *   npx tsx scripts/distribute-initial-wbc.ts
 *   npx tsx scripts/distribute-initial-wbc.ts --dry-run  (preview only)
 */

import { ethers } from 'ethers';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// WBC Token ABI (simplified)
const WBC_TOKEN_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function sendToUser(address to, uint256 amount, uint256 positionId, string reason)',
  'function owner() view returns (address)'
];

interface PositionForDistribution {
  id: number;
  walletAddress: string;
  depositedUSDC: string;
  feesEarned: string;
  status: string;
}

async function main() {
  console.log('='.repeat(60));
  console.log('WBC Initial Distribution');
  console.log('='.repeat(60));

  const isDryRun = process.argv.includes('--dry-run');
  if (isDryRun) {
    console.log('\n*** DRY RUN MODE - No transactions will be sent ***\n');
  }

  // Connect to database
  let primaryUrl = process.env.DATABASE_URL ||
    'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require';

  if (primaryUrl.includes('-pooler')) {
    primaryUrl = primaryUrl.replace('-pooler', '');
  }

  const dbPool = new Pool({ connectionString: primaryUrl });

  console.log('[1/5] Loading WBC configuration...');

  // Load WBC config
  const configResult = await dbPool.query(`
    SELECT key, value FROM public.wbc_config
  `);

  const config: Record<string, string> = {};
  for (const row of configResult.rows) {
    config[row.key] = row.value;
  }

  if (!config.contract_address) {
    console.error('ERROR: WBC Token contract not deployed. Deploy first with:');
    console.error('  npx hardhat run scripts/deploy-wbc-token.ts --network polygon');
    process.exit(1);
  }

  console.log(`   Contract: ${config.contract_address}`);
  console.log(`   Network: ${config.network} (Chain ID: ${config.chain_id})`);

  // Connect to blockchain
  console.log('\n[2/5] Connecting to blockchain...');

  const rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.error('ERROR: DEPLOYER_PRIVATE_KEY not set');
    process.exit(1);
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`   Owner wallet: ${wallet.address}`);

  const contract = new ethers.Contract(config.contract_address, WBC_TOKEN_ABI, wallet);

  // Verify owner
  const contractOwner = await contract.owner();
  if (contractOwner.toLowerCase() !== wallet.address.toLowerCase()) {
    console.error('ERROR: Wallet is not the contract owner');
    console.error(`   Expected: ${contractOwner}`);
    console.error(`   Got: ${wallet.address}`);
    process.exit(1);
  }

  // Check owner balance
  const ownerBalance = await contract.balanceOf(wallet.address);
  console.log(`   Owner WBC balance: ${ethers.formatUnits(ownerBalance, 6)} WBC`);

  // Get active positions
  console.log('\n[3/5] Loading active positions...');

  const positionsResult = await dbPool.query(`
    SELECT
      id,
      wallet_address,
      deposited_usdc,
      fees_earned,
      status,
      wbc_minted_amount
    FROM public.position_history
    WHERE status = 'Active'
    AND (wbc_minted_amount IS NULL OR wbc_minted_amount = '' OR wbc_minted_amount = '0')
    ORDER BY id
  `);

  const positions: PositionForDistribution[] = positionsResult.rows.map(row => ({
    id: row.id,
    walletAddress: row.wallet_address,
    depositedUSDC: row.deposited_usdc || '0',
    feesEarned: row.fees_earned || '0',
    status: row.status
  }));

  console.log(`   Found ${positions.length} positions pending WBC distribution`);

  if (positions.length === 0) {
    console.log('\nNo positions require WBC distribution. Exiting.');
    await dbPool.end();
    process.exit(0);
  }

  // Calculate distribution
  console.log('\n[4/5] Calculating distribution...');

  interface DistributionItem {
    positionId: number;
    walletAddress: string;
    capital: number;
    fees: number;
    totalWBC: number;
  }

  const distribution: DistributionItem[] = [];
  let totalWBCToDistribute = 0;

  for (const position of positions) {
    const capital = parseFloat(position.depositedUSDC);
    const fees = parseFloat(position.feesEarned);
    const totalWBC = capital + Math.max(0, fees); // Only add positive fees

    if (totalWBC > 0) {
      distribution.push({
        positionId: position.id,
        walletAddress: position.walletAddress,
        capital,
        fees,
        totalWBC
      });
      totalWBCToDistribute += totalWBC;
    }
  }

  console.log(`   Positions to process: ${distribution.length}`);
  console.log(`   Total WBC to distribute: ${totalWBCToDistribute.toLocaleString()} WBC`);

  // Check if owner has enough balance
  const requiredBalance = ethers.parseUnits(totalWBCToDistribute.toFixed(6), 6);
  if (ownerBalance < requiredBalance) {
    console.error('\nERROR: Owner does not have enough WBC balance');
    console.error(`   Required: ${totalWBCToDistribute.toLocaleString()} WBC`);
    console.error(`   Available: ${ethers.formatUnits(ownerBalance, 6)} WBC`);
    process.exit(1);
  }

  // Show preview
  console.log('\n--- DISTRIBUTION PREVIEW ---');
  console.log('Position ID | Wallet | Capital | Fees | Total WBC');
  console.log('-'.repeat(80));

  for (const item of distribution.slice(0, 10)) {
    console.log(
      `${item.positionId.toString().padStart(11)} | ` +
      `${item.walletAddress.slice(0, 10)}... | ` +
      `$${item.capital.toFixed(2).padStart(10)} | ` +
      `$${item.fees.toFixed(2).padStart(8)} | ` +
      `${item.totalWBC.toFixed(2)} WBC`
    );
  }

  if (distribution.length > 10) {
    console.log(`... and ${distribution.length - 10} more positions`);
  }
  console.log('-'.repeat(80));

  if (isDryRun) {
    console.log('\n*** DRY RUN COMPLETE - No transactions sent ***');
    await dbPool.end();
    process.exit(0);
  }

  // Execute distribution
  console.log('\n[5/5] Executing distribution...');

  let successCount = 0;
  let failCount = 0;
  let totalGasUsed = BigInt(0);

  for (let i = 0; i < distribution.length; i++) {
    const item = distribution[i];

    try {
      process.stdout.write(`   [${i + 1}/${distribution.length}] Position ${item.positionId}... `);

      const amount = ethers.parseUnits(item.totalWBC.toFixed(6), 6);

      const tx = await contract.sendToUser(
        item.walletAddress,
        amount,
        item.positionId,
        'initial_distribution'
      );

      const receipt = await tx.wait();
      totalGasUsed += receipt.gasUsed;

      // Update database
      await dbPool.query(`
        UPDATE public.position_history
        SET
          wbc_minted_amount = $1,
          wbc_minted_at = NOW(),
          wbc_mint_tx_hash = $2
        WHERE id = $3
      `, [item.totalWBC.toString(), tx.hash, item.positionId]);

      // Log transaction
      await dbPool.query(`
        INSERT INTO public.wbc_transactions
        (tx_hash, from_address, to_address, amount, position_id, transaction_type, status, block_number, gas_used, confirmed_at)
        VALUES ($1, $2, $3, $4, $5, 'initial_distribution', 'confirmed', $6, $7, NOW())
      `, [tx.hash, wallet.address, item.walletAddress, item.totalWBC.toString(), item.positionId, receipt.blockNumber, receipt.gasUsed.toString()]);

      console.log(`✅ ${item.totalWBC.toFixed(2)} WBC`);
      successCount++;

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.log(`❌ Error: ${error.message?.slice(0, 50)}`);
      failCount++;

      // Log failed transaction
      await dbPool.query(`
        INSERT INTO public.wbc_transactions
        (tx_hash, from_address, to_address, amount, position_id, transaction_type, status, error_message)
        VALUES ($1, $2, $3, $4, $5, 'initial_distribution', 'failed', $6)
      `, [`failed_${Date.now()}_${item.positionId}`, wallet.address, item.walletAddress, item.totalWBC.toString(), item.positionId, error.message]);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('DISTRIBUTION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total WBC distributed: ${totalWBCToDistribute.toLocaleString()} WBC`);
  console.log(`Total gas used: ${ethers.formatUnits(totalGasUsed, 'gwei')} gwei`);
  console.log('='.repeat(60));

  await dbPool.end();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
