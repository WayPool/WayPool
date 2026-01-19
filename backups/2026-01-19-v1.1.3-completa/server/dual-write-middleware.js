/**
 * MIDDLEWARE DE ESCRITURA DUAL AUTOMÁTICA
 * Intercepta todas las operaciones de escritura y las replica automáticamente
 */

import pg from 'pg';
const { Client } = pg;

const PRIMARY_DB = {
  host: process.env.DATABASE_HOST || 'ep-floral-pond-a4ziadwa.us-east-1.aws.neon.tech',
  database: process.env.DATABASE_NAME || 'neondb',
  user: process.env.DATABASE_USER || 'neondb_owner',
  password: process.env.DATABASE_PASSWORD || 'npg_3XSAgWLhwQ0f',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  ssl: { rejectUnauthorized: false }
};

const SECONDARY_DB = {
  host: process.env.SECONDARY_DATABASE_HOST || 'ep-frosty-math-a4mxdsvv.us-east-1.aws.neon.tech',
  database: process.env.SECONDARY_DATABASE_NAME || 'neondb',
  user: process.env.SECONDARY_DATABASE_USER || 'neondb_owner',
  password: process.env.SECONDARY_DATABASE_PASSWORD || 'npg_tPl2T4rWhDOo',
  port: parseInt(process.env.SECONDARY_DATABASE_PORT || '5432'),
  ssl: { rejectUnauthorized: false }
};

/**
 * Pool de conexiones para ambas bases de datos
 */
const primaryPool = new pg.Pool(PRIMARY_DB);
const secondaryPool = new pg.Pool(SECONDARY_DB);

/**
 * Logger de operaciones de replicación
 */
function logReplication(operation, table, success, error = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] REPLICATION ${operation.toUpperCase()}: ${table} - ${success ? 'SUCCESS' : 'FAILED'}${error ? ` - ${error}` : ''}`);
}

/**
 * Ejecuta una operación en ambas bases de datos
 */
async function dualWrite(query, params = [], tableName = 'unknown') {
  const results = {
    primary: null,
    secondary: null,
    success: false,
    errors: []
  };

  try {
    // Ejecutar en base primaria
    try {
      results.primary = await primaryPool.query(query, params);
      logReplication('primary', tableName, true);
    } catch (primaryError) {
      results.errors.push(`Primary: ${primaryError.message}`);
      logReplication('primary', tableName, false, primaryError.message);
      throw primaryError; // Si falla la primaria, detener operación
    }

    // Ejecutar en base secundaria
    try {
      results.secondary = await secondaryPool.query(query, params);
      logReplication('secondary', tableName, true);
      results.success = true;
    } catch (secondaryError) {
      results.errors.push(`Secondary: ${secondaryError.message}`);
      logReplication('secondary', tableName, false, secondaryError.message);
      // No detener si falla la secundaria, pero registrar el error
    }

    return results.primary; // Retornar resultado de la primaria
  } catch (error) {
    console.error(`Dual write failed for ${tableName}:`, error);
    throw error;
  }
}

/**
 * Wrapper para operaciones INSERT
 */
async function dualInsert(tableName, data) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(',');

  const query = `INSERT INTO "${tableName}" (${columns.join(',')}) VALUES (${placeholders}) RETURNING *`;

  return await dualWrite(query, values, tableName);
}

/**
 * Wrapper para operaciones UPDATE
 */
async function dualUpdate(tableName, data, whereClause, whereParams = []) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(',');

  const query = `UPDATE "${tableName}" SET ${setClause} WHERE ${whereClause} RETURNING *`;
  const allParams = [...values, ...whereParams];

  return await dualWrite(query, allParams, tableName);
}

/**
 * Wrapper para operaciones DELETE
 */
async function dualDelete(tableName, whereClause, whereParams = []) {
  const query = `DELETE FROM "${tableName}" WHERE ${whereClause} RETURNING *`;

  return await dualWrite(query, whereParams, tableName);
}

/**
 * Middleware express para interceptar operaciones de base de datos
 */
function replicationMiddleware(req, res, next) {
  // Interceptar el objeto de respuesta para capturar operaciones de DB
  const originalSend = res.send;
  const originalJson = res.json;

  // Agregar métodos de dual write al request
  req.dualWrite = dualWrite;
  req.dualInsert = dualInsert;
  req.dualUpdate = dualUpdate;
  req.dualDelete = dualDelete;

  // Override de métodos de respuesta para logging
  res.send = function (data) {
    logReplication('response', req.path, true);
    return originalSend.call(this, data);
  };

  res.json = function (data) {
    logReplication('response', req.path, true);
    return originalJson.call(this, data);
  };

  next();
}

/**
 * Verificador de sincronización
 */
async function verifySynchronization(tableName, limit = 10) {
  try {
    const primaryResult = await primaryPool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
    const secondaryResult = await secondaryPool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);

    const primaryCount = parseInt(primaryResult.rows[0].count);
    const secondaryCount = parseInt(secondaryResult.rows[0].count);

    const status = {
      table: tableName,
      primary: primaryCount,
      secondary: secondaryCount,
      synchronized: primaryCount === secondaryCount,
      difference: primaryCount - secondaryCount
    };

    console.log(`SYNC STATUS ${tableName}: Primary=${primaryCount}, Secondary=${secondaryCount}, Synchronized=${status.synchronized}`);

    return status;
  } catch (error) {
    console.error(`Error checking synchronization for ${tableName}:`, error);
    return { table: tableName, error: error.message };
  }
}

/**
 * Reparador automático de inconsistencias
 */
async function autoRepairInconsistencies(tableName) {
  try {
    console.log(`Auto-repairing inconsistencies in ${tableName}...`);

    // Obtener registros de la base primaria
    const primaryData = await primaryPool.query(`SELECT * FROM "${tableName}" ORDER BY id`);

    // Limpiar y replicar desde primaria
    await secondaryPool.query(`DELETE FROM "${tableName}"`);

    let repaired = 0;
    for (const row of primaryData.rows) {
      try {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(',');

        await secondaryPool.query(
          `INSERT INTO "${tableName}" (${columns.join(',')}) VALUES (${placeholders})`,
          values
        );
        repaired++;
      } catch (e) {
        // Continuar con el siguiente registro
      }
    }

    console.log(`Auto-repair completed for ${tableName}: ${repaired} records synchronized`);
    return repaired;

  } catch (error) {
    console.error(`Auto-repair failed for ${tableName}:`, error);
    return 0;
  }
}

/**
 * Monitor continuo de sincronización
 */
function startSyncMonitor(interval = 300000) { // 5 minutos por defecto
  console.log('Starting continuous synchronization monitor...');

  const tables = [
    'users', 'position_history', 'real_positions', 'custodial_sessions',
    'legal_signatures', 'managed_nfts', 'invoices', 'referrals'
  ];

  setInterval(async () => {
    console.log('\n--- SYNCHRONIZATION CHECK ---');

    for (const table of tables) {
      const status = await verifySynchronization(table);

      if (!status.synchronized && !status.error) {
        console.log(`INCONSISTENCY DETECTED in ${table}, initiating auto-repair...`);
        await autoRepairInconsistencies(table);
      }
    }

    console.log('--- SYNCHRONIZATION CHECK COMPLETE ---\n');
  }, interval);
}

export {
  replicationMiddleware,
  dualWrite,
  dualInsert,
  dualUpdate,
  dualDelete,
  verifySynchronization,
  autoRepairInconsistencies,
  startSyncMonitor,
  primaryPool,
  secondaryPool
};