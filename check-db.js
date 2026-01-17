
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function checkWallets() {
    try {
        console.log('Checking custodial_wallets table...');
        const result = await pool.query('SELECT id, email, address, active FROM custodial_wallets LIMIT 10');
        console.log('Total wallets found:', result.rowCount);
        console.table(result.rows);

        // Check if test account exists
        const testAccount = await pool.query("SELECT * FROM custodial_wallets WHERE email = 'test@waybank.com'");
        console.log('Test account exists in DB:', testAccount.rowCount > 0);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkWallets();
