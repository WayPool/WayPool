/**
 * Migration: Add current_apr and last_apr_update fields to position_history
 *
 * This migration adds:
 * - current_apr: Variable APR based on daily pool calculations
 * - last_apr_update: Timestamp of last APR update
 *
 * The original 'apr' field remains as the "contracted APR" (estimated reference)
 */

import { pool } from '../db';

export async function addCurrentAprFieldMigration() {
  const client = await pool.connect();

  try {
    console.log('[Migration] Starting: Add current_apr field to position_history...');

    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'position_history'
      AND column_name = 'current_apr'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('[Migration] Column current_apr already exists, skipping...');
      return true;
    }

    // Add current_apr column
    await client.query(`
      ALTER TABLE position_history
      ADD COLUMN IF NOT EXISTS current_apr DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS last_apr_update TIMESTAMP
    `);

    console.log('[Migration] Added current_apr and last_apr_update columns');

    // Initialize current_apr with the value of apr for active positions
    const updateResult = await client.query(`
      UPDATE position_history
      SET current_apr = apr,
          last_apr_update = NOW()
      WHERE status = 'Active' AND current_apr IS NULL
    `);

    console.log(`[Migration] Initialized current_apr for ${updateResult.rowCount} active positions`);

    console.log('[Migration] Completed: current_apr field added successfully');
    return true;

  } catch (error) {
    console.error('[Migration] Error adding current_apr field:', error);
    return false;
  } finally {
    client.release();
  }
}

export default addCurrentAprFieldMigration;
