const { Pool } = require("pg");
const pool = new Pool({ connectionString: "postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require" });

async function report() {
  // Contratos MENSUALES (timeframe = 30 días)
  console.log("==========================================");
  console.log("  CONTRATOS MENSUALES (30 días)");
  console.log("==========================================");

  const monthly = await pool.query(`
    SELECT
      wallet_address,
      COUNT(*) as num_posiciones,
      SUM(CAST(deposited_usdc AS DECIMAL)) as total_usdc,
      STRING_AGG(DISTINCT pool_name, ', ') as pools
    FROM position_history
    WHERE timeframe = 30 AND status = 'Active'
    GROUP BY wallet_address
    ORDER BY total_usdc DESC
  `);

  console.log("\nWallets con contratos mensuales:", monthly.rows.length);
  console.table(monthly.rows);

  // Contratos ANUALES (timeframe = 365 días)
  console.log("\n==========================================");
  console.log("  CONTRATOS ANUALES (365 días)");
  console.log("==========================================");

  const annual = await pool.query(`
    SELECT
      wallet_address,
      COUNT(*) as num_posiciones,
      SUM(CAST(deposited_usdc AS DECIMAL)) as total_usdc,
      STRING_AGG(DISTINCT pool_name, ', ') as pools
    FROM position_history
    WHERE timeframe = 365 AND status = 'Active'
    GROUP BY wallet_address
    ORDER BY total_usdc DESC
  `);

  console.log("\nWallets con contratos anuales:", annual.rows.length);
  console.table(annual.rows);

  // Otros timeframes
  console.log("\n==========================================");
  console.log("  OTROS TIMEFRAMES");
  console.log("==========================================");

  const others = await pool.query(`
    SELECT
      timeframe,
      COUNT(*) as num_posiciones,
      COUNT(DISTINCT wallet_address) as num_wallets,
      SUM(CAST(deposited_usdc AS DECIMAL)) as total_usdc
    FROM position_history
    WHERE status = 'Active' AND timeframe NOT IN (30, 365)
    GROUP BY timeframe
    ORDER BY timeframe
  `);

  console.log("\nOtros timeframes:");
  console.table(others.rows);

  // Resumen total
  console.log("\n==========================================");
  console.log("  RESUMEN GENERAL");
  console.log("==========================================");

  const summary = await pool.query(`
    SELECT
      CASE
        WHEN timeframe = 30 THEN 'Mensual'
        WHEN timeframe = 90 THEN 'Trimestral'
        WHEN timeframe = 365 THEN 'Anual'
        WHEN timeframe = 1095 THEN '3 Anos'
        WHEN timeframe = 1825 THEN '5 Anos'
        ELSE 'Otro'
      END as tipo_contrato,
      timeframe as dias,
      COUNT(*) as posiciones,
      COUNT(DISTINCT wallet_address) as wallets,
      SUM(CAST(deposited_usdc AS DECIMAL)) as total_usdc
    FROM position_history
    WHERE status = 'Active'
    GROUP BY timeframe
    ORDER BY timeframe
  `);

  console.table(summary.rows);

  pool.end();
}

report().catch(console.error);
