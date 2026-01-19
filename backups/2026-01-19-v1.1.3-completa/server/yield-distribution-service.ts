/**
 * Yield Distribution Service
 *
 * This service handles the distribution of trading profits (USDC) from external
 * trading platforms to all active positions proportionally based on:
 * 1. Capital deposited (main factor)
 * 2. APR percentage (optional weighting factor)
 *
 * Flow:
 * 1. SuperAdmin enters total USDC generated from external trading
 * 2. System calculates proportional distribution for each active position
 * 3. Distribution is processed and credited to each position's feesEarned
 * 4. Complete audit trail is maintained
 */

import { pool } from './db';
import { storage } from './storage';

// Types
export interface ActivePosition {
  id: number;
  walletAddress: string;
  depositedUSDC: string;
  apr: string;
  status: string;
  poolName: string;
  token0: string;
  token1: string;
}

export interface DistributionCalculation {
  positionId: number;
  walletAddress: string;
  capital: number;
  apr: number;
  weight: number;
  baseDistribution: number;
  aprBonus: number;
  totalDistribution: number;
  distributionPercent: number;
}

export interface DistributionPreview {
  totalAmount: number;
  totalPositions: number;
  totalActiveCapital: number;
  averageDistributionPercent: number;
  distributions: DistributionCalculation[];
}

export interface DistributionResult {
  success: boolean;
  distributionId?: number;
  distributionCode?: string;
  totalDistributed?: number;
  positionsUpdated?: number;
  error?: string;
}

/**
 * Generate a unique distribution code
 */
export function generateDistributionCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `YD-${year}-${month}-${random}`;
}

/**
 * Get all active positions eligible for yield distribution
 */
export async function getActivePositionsForDistribution(): Promise<ActivePosition[]> {
  try {
    const result = await pool.query(`
      SELECT
        id,
        wallet_address as "walletAddress",
        deposited_usdc as "depositedUSDC",
        apr,
        status,
        pool_name as "poolName",
        token0,
        token1
      FROM position_history
      WHERE status = 'Active'
        AND deposited_usdc > 0
      ORDER BY deposited_usdc DESC
    `);

    return result.rows;
  } catch (error) {
    console.error('[YieldDistribution] Error fetching active positions:', error);
    throw error;
  }
}

/**
 * Calculate distribution for each position
 *
 * Distribution formula:
 * - Base distribution = (position capital / total capital) * total amount
 * - APR bonus (optional) = Additional weighting based on APR tier
 *
 * @param totalAmount - Total USDC to distribute
 * @param positions - List of active positions
 * @param includeAprBonus - Whether to apply APR-based bonus weighting
 */
export function calculateDistribution(
  totalAmount: number,
  positions: ActivePosition[],
  includeAprBonus: boolean = false
): DistributionPreview {
  if (positions.length === 0) {
    return {
      totalAmount,
      totalPositions: 0,
      totalActiveCapital: 0,
      averageDistributionPercent: 0,
      distributions: [],
    };
  }

  // Calculate total capital
  const totalCapital = positions.reduce((sum, pos) => {
    return sum + parseFloat(pos.depositedUSDC || '0');
  }, 0);

  if (totalCapital === 0) {
    return {
      totalAmount,
      totalPositions: positions.length,
      totalActiveCapital: 0,
      averageDistributionPercent: 0,
      distributions: [],
    };
  }

  // Calculate APR weights if bonus is enabled
  // Higher APR positions get a small bonus (up to 10% extra)
  const getAprMultiplier = (apr: number): number => {
    if (!includeAprBonus) return 1;
    // APR bonus: 0-10% APR = 1x, 10-20% = 1.02x, 20-30% = 1.05x, 30%+ = 1.10x
    if (apr >= 30) return 1.10;
    if (apr >= 20) return 1.05;
    if (apr >= 10) return 1.02;
    return 1;
  };

  // Calculate weighted capital (capital * APR multiplier)
  const positionsWithWeights = positions.map(pos => {
    const capital = parseFloat(pos.depositedUSDC || '0');
    const apr = parseFloat(pos.apr || '0');
    const multiplier = getAprMultiplier(apr);
    const weight = capital * multiplier;
    return { ...pos, capital, apr, weight, multiplier };
  });

  const totalWeight = positionsWithWeights.reduce((sum, p) => sum + p.weight, 0);

  // Calculate distribution for each position
  const distributions: DistributionCalculation[] = positionsWithWeights.map(pos => {
    const capitalShare = pos.capital / totalCapital;
    const weightShare = pos.weight / totalWeight;

    // Base distribution (pure capital proportion)
    const baseDistribution = totalAmount * capitalShare;

    // APR bonus (difference from weighted distribution)
    const weightedDistribution = totalAmount * weightShare;
    const aprBonus = includeAprBonus ? weightedDistribution - baseDistribution : 0;

    // Total distribution
    const totalDistribution = baseDistribution + aprBonus;
    const distributionPercent = (totalDistribution / totalAmount) * 100;

    return {
      positionId: pos.id,
      walletAddress: pos.walletAddress,
      capital: pos.capital,
      apr: pos.apr,
      weight: pos.weight,
      baseDistribution: Math.round(baseDistribution * 1000000) / 1000000, // 6 decimal precision
      aprBonus: Math.round(aprBonus * 1000000) / 1000000,
      totalDistribution: Math.round(totalDistribution * 1000000) / 1000000,
      distributionPercent: Math.round(distributionPercent * 10000) / 10000,
    };
  });

  // Calculate average distribution percent
  const avgPercent = distributions.length > 0
    ? distributions.reduce((sum, d) => sum + d.distributionPercent, 0) / distributions.length
    : 0;

  return {
    totalAmount,
    totalPositions: positions.length,
    totalActiveCapital: totalCapital,
    averageDistributionPercent: Math.round(avgPercent * 10000) / 10000,
    distributions,
  };
}

/**
 * Preview distribution without executing
 */
export async function previewDistribution(
  totalAmount: number,
  includeAprBonus: boolean = false
): Promise<DistributionPreview> {
  const positions = await getActivePositionsForDistribution();
  return calculateDistribution(totalAmount, positions, includeAprBonus);
}

/**
 * Execute the distribution and save to database
 */
export async function executeDistribution(
  totalAmount: number,
  createdBy: string,
  options: {
    includeAprBonus?: boolean;
    source?: string;
    sourceDetails?: string;
    brokerName?: string;
    notes?: string;
  } = {}
): Promise<DistributionResult> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get active positions
    const positions = await getActivePositionsForDistribution();

    if (positions.length === 0) {
      await client.query('ROLLBACK');
      return {
        success: false,
        error: 'No hay posiciones activas para distribuir',
      };
    }

    // Calculate distribution
    const preview = calculateDistribution(totalAmount, positions, options.includeAprBonus || false);

    // Generate distribution code
    const distributionCode = generateDistributionCode();

    // Create main distribution record
    const distributionResult = await client.query(`
      INSERT INTO yield_distributions (
        distribution_code,
        total_amount,
        distributed_amount,
        source,
        source_details,
        broker_name,
        total_active_positions,
        total_active_capital,
        average_distribution_percent,
        status,
        notes,
        created_by,
        processed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING id
    `, [
      distributionCode,
      totalAmount,
      totalAmount, // Will be updated if there are errors
      options.source || 'external_trading',
      options.sourceDetails || null,
      options.brokerName || null,
      preview.totalPositions,
      preview.totalActiveCapital,
      preview.averageDistributionPercent,
      'processing',
      options.notes || null,
      createdBy,
    ]);

    const distributionId = distributionResult.rows[0].id;
    let successCount = 0;
    let totalDistributed = 0;

    // Process each distribution
    for (const dist of preview.distributions) {
      try {
        // Insert distribution detail
        await client.query(`
          INSERT INTO yield_distribution_details (
            distribution_id,
            position_id,
            wallet_address,
            position_capital,
            position_apr,
            position_weight,
            base_distribution,
            apr_bonus,
            total_distribution,
            distribution_percent,
            status,
            credited_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'credited', NOW())
        `, [
          distributionId,
          dist.positionId,
          dist.walletAddress,
          dist.capital,
          dist.apr,
          dist.weight,
          dist.baseDistribution,
          dist.aprBonus,
          dist.totalDistribution,
          dist.distributionPercent,
        ]);

        // Update position's fees_earned
        await client.query(`
          UPDATE position_history
          SET fees_earned = COALESCE(fees_earned, 0) + $1,
              updated_at = NOW()
          WHERE id = $2
        `, [dist.totalDistribution, dist.positionId]);

        // Update or create position yield history
        await client.query(`
          INSERT INTO position_yield_history (
            position_id,
            wallet_address,
            total_yield_received,
            total_distributions,
            last_distribution_id,
            last_distribution_amount,
            last_distribution_date
          ) VALUES ($1, $2, $3, 1, $4, $5, NOW())
          ON CONFLICT (position_id) DO UPDATE SET
            total_yield_received = position_yield_history.total_yield_received + $3,
            total_distributions = position_yield_history.total_distributions + 1,
            last_distribution_id = $4,
            last_distribution_amount = $5,
            last_distribution_date = NOW(),
            updated_at = NOW()
        `, [
          dist.positionId,
          dist.walletAddress,
          dist.totalDistribution,
          distributionId,
          dist.totalDistribution,
        ]);

        successCount++;
        totalDistributed += dist.totalDistribution;

      } catch (detailError) {
        console.error(`[YieldDistribution] Error processing position ${dist.positionId}:`, detailError);

        // Record failed distribution detail
        await client.query(`
          INSERT INTO yield_distribution_details (
            distribution_id,
            position_id,
            wallet_address,
            position_capital,
            position_apr,
            position_weight,
            base_distribution,
            apr_bonus,
            total_distribution,
            distribution_percent,
            status,
            error_message
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'failed', $11)
        `, [
          distributionId,
          dist.positionId,
          dist.walletAddress,
          dist.capital,
          dist.apr,
          dist.weight,
          dist.baseDistribution,
          dist.aprBonus,
          dist.totalDistribution,
          dist.distributionPercent,
          (detailError as Error).message,
        ]);
      }
    }

    // Update main distribution with final status
    const finalStatus = successCount === preview.distributions.length ? 'completed' : 'completed_with_errors';
    await client.query(`
      UPDATE yield_distributions
      SET status = $1,
          distributed_amount = $2,
          updated_at = NOW()
      WHERE id = $3
    `, [finalStatus, totalDistributed, distributionId]);

    await client.query('COMMIT');

    console.log(`[YieldDistribution] Distribution ${distributionCode} completed: ${successCount}/${preview.distributions.length} positions, ${totalDistributed.toFixed(2)} USDC`);

    return {
      success: true,
      distributionId,
      distributionCode,
      totalDistributed,
      positionsUpdated: successCount,
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[YieldDistribution] Error executing distribution:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  } finally {
    client.release();
  }
}

/**
 * Get distribution history with pagination
 */
export async function getDistributionHistory(
  page: number = 1,
  limit: number = 20
): Promise<{
  distributions: any[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM yield_distributions');
    const total = parseInt(countResult.rows[0].count);

    // Get distributions
    const result = await pool.query(`
      SELECT
        id,
        distribution_code as "distributionCode",
        total_amount as "totalAmount",
        distributed_amount as "distributedAmount",
        source,
        source_details as "sourceDetails",
        broker_name as "brokerName",
        total_active_positions as "totalActivePositions",
        total_active_capital as "totalActiveCapital",
        average_distribution_percent as "averageDistributionPercent",
        status,
        notes,
        created_by as "createdBy",
        processed_at as "processedAt",
        created_at as "createdAt"
      FROM yield_distributions
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return {
      distributions: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('[YieldDistribution] Error getting history:', error);
    throw error;
  }
}

/**
 * Get distribution details by ID
 */
export async function getDistributionDetails(distributionId: number): Promise<{
  distribution: any;
  details: any[];
} | null> {
  try {
    // Get main distribution
    const distResult = await pool.query(`
      SELECT
        id,
        distribution_code as "distributionCode",
        total_amount as "totalAmount",
        distributed_amount as "distributedAmount",
        source,
        source_details as "sourceDetails",
        broker_name as "brokerName",
        total_active_positions as "totalActivePositions",
        total_active_capital as "totalActiveCapital",
        average_distribution_percent as "averageDistributionPercent",
        status,
        notes,
        created_by as "createdBy",
        processed_at as "processedAt",
        created_at as "createdAt"
      FROM yield_distributions
      WHERE id = $1
    `, [distributionId]);

    if (distResult.rows.length === 0) {
      return null;
    }

    // Get details
    const detailsResult = await pool.query(`
      SELECT
        ydd.id,
        ydd.position_id as "positionId",
        ydd.wallet_address as "walletAddress",
        ydd.position_capital as "positionCapital",
        ydd.position_apr as "positionApr",
        ydd.position_weight as "positionWeight",
        ydd.base_distribution as "baseDistribution",
        ydd.apr_bonus as "aprBonus",
        ydd.total_distribution as "totalDistribution",
        ydd.distribution_percent as "distributionPercent",
        ydd.status,
        ydd.error_message as "errorMessage",
        ydd.credited_at as "creditedAt",
        ph.pool_name as "poolName",
        ph.token0,
        ph.token1
      FROM yield_distribution_details ydd
      LEFT JOIN position_history ph ON ydd.position_id = ph.id
      WHERE ydd.distribution_id = $1
      ORDER BY ydd.total_distribution DESC
    `, [distributionId]);

    return {
      distribution: distResult.rows[0],
      details: detailsResult.rows,
    };
  } catch (error) {
    console.error('[YieldDistribution] Error getting distribution details:', error);
    throw error;
  }
}

/**
 * Get yield statistics for dashboard
 */
export async function getYieldStatistics(): Promise<{
  totalDistributed: number;
  totalDistributions: number;
  averageDistribution: number;
  lastDistributionDate: Date | null;
  topPositionsByYield: any[];
}> {
  try {
    // Total distributed and count
    const statsResult = await pool.query(`
      SELECT
        COALESCE(SUM(distributed_amount), 0) as total,
        COUNT(*) as count,
        MAX(processed_at) as last_date
      FROM yield_distributions
      WHERE status IN ('completed', 'completed_with_errors')
    `);

    const stats = statsResult.rows[0];

    // Top positions by total yield received
    const topResult = await pool.query(`
      SELECT
        pyh.position_id as "positionId",
        pyh.wallet_address as "walletAddress",
        pyh.total_yield_received as "totalYieldReceived",
        pyh.total_distributions as "totalDistributions",
        ph.pool_name as "poolName",
        ph.deposited_usdc as "depositedUsdc"
      FROM position_yield_history pyh
      LEFT JOIN position_history ph ON pyh.position_id = ph.id
      ORDER BY pyh.total_yield_received DESC
      LIMIT 10
    `);

    return {
      totalDistributed: parseFloat(stats.total || '0'),
      totalDistributions: parseInt(stats.count || '0'),
      averageDistribution: stats.count > 0 ? parseFloat(stats.total) / parseInt(stats.count) : 0,
      lastDistributionDate: stats.last_date,
      topPositionsByYield: topResult.rows,
    };
  } catch (error) {
    console.error('[YieldDistribution] Error getting statistics:', error);
    throw error;
  }
}

export default {
  generateDistributionCode,
  getActivePositionsForDistribution,
  calculateDistribution,
  previewDistribution,
  executeDistribution,
  getDistributionHistory,
  getDistributionDetails,
  getYieldStatistics,
};
