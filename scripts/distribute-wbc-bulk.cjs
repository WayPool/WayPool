/**
 * WBC Token Bulk Distribution Script
 *
 * Distributes WBC tokens to users based on their deposited + fees collected
 * Records all transactions in wbc_transactions table
 */

const hre = require('hardhat');
const { Pool } = require('pg');

// Database connection
const DATABASE_URL = 'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require';

// WBC Contract
const WBC_ADDRESS = '0xf79e7330eF4DA9C567B8811845Ce9b0B75064456';
const OWNER_ADDRESS = '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F';

// Distribution type for logging
const DISTRIBUTION_TYPE = 'bulk_distribution';

async function main() {
  console.log('='.repeat(60));
  console.log('WBC Token Bulk Distribution - Polygon Mainnet');
  console.log('='.repeat(60));

  // Initialize database connection
  const pool = new Pool({ connectionString: DATABASE_URL });

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log(`\nNetwork: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer (owner)
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Owner: ${deployer.address}`);

  // Check MATIC balance for gas
  const maticBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`MATIC Balance: ${hre.ethers.formatEther(maticBalance)} MATIC`);

  if (maticBalance < hre.ethers.parseEther('1')) {
    console.error('\n⚠️  WARNING: Low MATIC balance. May not complete all transfers.');
  }

  // Get WBC contract
  const wbc = await hre.ethers.getContractAt('WBCToken', WBC_ADDRESS);

  // Check WBC balance
  const wbcBalance = await wbc.balanceOf(deployer.address);
  console.log(`WBC Balance: ${hre.ethers.formatUnits(wbcBalance, 6)} WBC`);

  // Fetch distribution data from database
  console.log('\n[1/4] Fetching distribution data from database...');

  const result = await pool.query(`
    SELECT
      wallet_address,
      SUM(COALESCE(deposited_usdc, 0)) as total_deposited,
      SUM(COALESCE(total_fees_collected, 0)) as total_fees_collected,
      SUM(COALESCE(deposited_usdc, 0)) + SUM(COALESCE(total_fees_collected, 0)) as total_wbc
    FROM position_history
    WHERE status = 'Active'
    GROUP BY wallet_address
    HAVING SUM(COALESCE(deposited_usdc, 0)) + SUM(COALESCE(total_fees_collected, 0)) > 0
    ORDER BY total_wbc DESC
  `);

  // Get already completed distributions
  console.log('   Checking for already completed distributions...');
  const completedResult = await pool.query(`
    SELECT LOWER(to_address) as wallet
    FROM wbc_transactions
    WHERE transaction_type = 'bulk_distribution'
    AND status = 'confirmed'
  `);
  const completedWallets = new Set(completedResult.rows.map(r => r.wallet));
  console.log(`   Found ${completedWallets.size} wallets already received WBC`);

  // Filter out owner wallet, invalid addresses, and already completed
  const distributions = result.rows.filter(row => {
    const wallet = row.wallet_address.toLowerCase();
    // Skip owner wallet (can't send to self)
    if (wallet === OWNER_ADDRESS.toLowerCase()) {
      console.log(`   Skipping owner wallet: ${row.wallet_address}`);
      return false;
    }
    // Skip invalid addresses (must be 42 chars and start with 0x)
    if (!wallet.match(/^0x[a-f0-9]{40}$/)) {
      console.log(`   Skipping invalid address: ${row.wallet_address}`);
      return false;
    }
    // Skip already completed distributions
    if (completedWallets.has(wallet)) {
      console.log(`   Skipping (already sent): ${row.wallet_address.substring(0, 12)}... (${parseFloat(row.total_wbc).toLocaleString()} WBC)`);
      return false;
    }
    return true;
  });

  console.log(`   Found ${distributions.length} wallets to distribute to`);

  // Calculate total to distribute
  const totalToDistribute = distributions.reduce((sum, d) => sum + parseFloat(d.total_wbc), 0);
  console.log(`   Total WBC to distribute: ${totalToDistribute.toLocaleString()} WBC`);

  // Verify we have enough balance
  const totalRequired = hre.ethers.parseUnits(totalToDistribute.toFixed(6), 6);
  if (wbcBalance < totalRequired) {
    console.error(`\n❌ ERROR: Insufficient WBC balance!`);
    console.error(`   Has: ${hre.ethers.formatUnits(wbcBalance, 6)} WBC`);
    console.error(`   Needs: ${totalToDistribute} WBC`);
    process.exit(1);
  }

  // Confirm before proceeding
  console.log('\n[2/4] Distribution Preview:');
  console.log('-'.repeat(60));
  distributions.slice(0, 10).forEach((d, i) => {
    console.log(`   ${i + 1}. ${d.wallet_address.substring(0, 10)}... -> ${parseFloat(d.total_wbc).toLocaleString()} WBC`);
  });
  if (distributions.length > 10) {
    console.log(`   ... and ${distributions.length - 10} more wallets`);
  }
  console.log('-'.repeat(60));
  console.log(`   Total: ${distributions.length} wallets, ${totalToDistribute.toLocaleString()} WBC`);

  // Start distribution
  console.log('\n[3/4] Starting distribution...');

  let successCount = 0;
  let failCount = 0;
  let totalGasUsed = BigInt(0);

  for (let i = 0; i < distributions.length; i++) {
    const d = distributions[i];
    const amount = hre.ethers.parseUnits(parseFloat(d.total_wbc).toFixed(6), 6);

    console.log(`\n   [${i + 1}/${distributions.length}] Sending ${parseFloat(d.total_wbc).toFixed(2)} WBC to ${d.wallet_address.substring(0, 10)}...`);

    try {
      // Send transaction
      const tx = await wbc.transfer(d.wallet_address, amount);
      console.log(`      TX: ${tx.hash}`);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`      ✅ Confirmed in block ${receipt.blockNumber}`);

      totalGasUsed += receipt.gasUsed;
      successCount++;

      // Log to database
      await pool.query(`
        INSERT INTO wbc_transactions
        (tx_hash, from_address, to_address, amount, position_id, transaction_type, status, block_number, gas_used, confirmed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (tx_hash) DO NOTHING
      `, [
        tx.hash,
        deployer.address,
        d.wallet_address,
        parseFloat(d.total_wbc).toFixed(6),
        0, // No specific position
        DISTRIBUTION_TYPE,
        'confirmed',
        receipt.blockNumber,
        receipt.gasUsed.toString()
      ]);

    } catch (error) {
      console.log(`      ❌ Failed: ${error.message}`);

      // If rate limited, wait and retry once
      if (error.message.includes('rate limit') || error.message.includes('Too many requests')) {
        console.log(`      ⏳ Rate limited, waiting 15s and retrying...`);
        await new Promise(r => setTimeout(r, 15000));

        try {
          const retryTx = await wbc.transfer(d.wallet_address, amount);
          console.log(`      Retry TX: ${retryTx.hash}`);
          const retryReceipt = await retryTx.wait();
          console.log(`      ✅ Retry confirmed in block ${retryReceipt.blockNumber}`);

          totalGasUsed += retryReceipt.gasUsed;
          successCount++;

          await pool.query(`
            INSERT INTO wbc_transactions
            (tx_hash, from_address, to_address, amount, position_id, transaction_type, status, block_number, gas_used, confirmed_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            ON CONFLICT (tx_hash) DO NOTHING
          `, [
            retryTx.hash,
            deployer.address,
            d.wallet_address,
            parseFloat(d.total_wbc).toFixed(6),
            0,
            DISTRIBUTION_TYPE,
            'confirmed',
            retryReceipt.blockNumber,
            retryReceipt.gasUsed.toString()
          ]);

          // Wait after successful retry
          await new Promise(r => setTimeout(r, 3000));
          continue;
        } catch (retryError) {
          console.log(`      ❌ Retry also failed: ${retryError.message}`);
        }
      }

      failCount++;

      // Log failed transaction
      await pool.query(`
        INSERT INTO wbc_transactions
        (tx_hash, from_address, to_address, amount, position_id, transaction_type, status, error_message)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (tx_hash) DO NOTHING
      `, [
        `failed_${Date.now()}_${i}`,
        deployer.address,
        d.wallet_address,
        parseFloat(d.total_wbc).toFixed(6),
        0,
        DISTRIBUTION_TYPE,
        'failed',
        error.message
      ]);

      // Add a longer delay after failure
      await new Promise(r => setTimeout(r, 5000));
    }

    // Add longer delay between transactions to avoid rate limiting (8 seconds)
    await new Promise(r => setTimeout(r, 8000));
  }

  // Final summary
  console.log('\n[4/4] Distribution Complete!');
  console.log('='.repeat(60));
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Total Gas Used: ${totalGasUsed.toString()}`);

  // Get new owner balance
  const newBalance = await wbc.balanceOf(deployer.address);
  console.log(`   Owner WBC Balance: ${hre.ethers.formatUnits(newBalance, 6)} WBC`);

  const newMaticBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`   Owner MATIC Balance: ${hre.ethers.formatEther(newMaticBalance)} MATIC`);

  console.log('='.repeat(60));

  // Close database connection
  await pool.end();
}

main()
  .then(() => {
    console.log('\n✅ Distribution script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Distribution failed:', error);
    process.exit(1);
  });
