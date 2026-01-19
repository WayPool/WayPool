/**
 * Balanceador de carga inteligente para distribución automática de consultas
 * Optimiza el rendimiento dirigiendo lecturas a la base secundaria y escrituras a la primaria
 */
import { Pool } from 'pg';

// Configuración de las bases de datos
const primaryPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3XSAgWLhwQ0f@ep-floral-pond-a4ziadwa.us-east-1.aws.neon.tech/neondb',
  ssl: { rejectUnauthorized: false },
  max: 20, // Máximo de conexiones
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const secondaryPool = new Pool({
  connectionString: process.env.SECONDARY_DATABASE_URL || 'postgresql://neondb_owner:npg_tPl2T4rWhDOo@ep-frosty-math-a4mxdsvv.us-east-1.aws.neon.tech/neondb',
  ssl: { rejectUnauthorized: false },
  max: 15, // Menos conexiones para la secundaria
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Estadísticas del balanceador
let loadBalancerStats = {
  readOperations: 0,
  writeOperations: 0,
  primaryLoad: 0,
  secondaryLoad: 0,
  failoverCount: 0,
  lastFailover: 'Nunca',
  totalRequests: 0,
  avgResponseTime: 0,
  responseTimeHistory: []
};

// Estado de salud de las bases
let databaseHealth = {
  primary: { online: true, responseTime: 0, connections: 0 },
  secondary: { online: true, responseTime: 0, connections: 0 }
};

/**
 * Determina si una consulta es de lectura
 */
function isReadQuery(query) {
  const normalizedQuery = query.trim().toLowerCase();
  return normalizedQuery.startsWith('select') ||
    normalizedQuery.startsWith('show') ||
    normalizedQuery.startsWith('explain') ||
    normalizedQuery.startsWith('describe');
}

/**
 * Determina si una consulta es crítica (siempre va a primaria)
 */
function isCriticalQuery(query) {
  const normalizedQuery = query.trim().toLowerCase();
  return normalizedQuery.includes('users') ||
    normalizedQuery.includes('custodial_sessions') ||
    normalizedQuery.includes('position_history') ||
    normalizedQuery.includes('invoices');
}

/**
 * Verifica el estado de salud de las bases de datos
 */
async function checkDatabaseHealth() {
  const healthCheck = async (pool, type) => {
    const startTime = Date.now();
    try {
      await pool.query('SELECT 1');
      const responseTime = Date.now() - startTime;

      const poolStats = pool.totalCount || 0;

      databaseHealth[type] = {
        online: true,
        responseTime,
        connections: poolStats
      };

      return true;
    } catch (error) {
      console.error(`[LOAD BALANCER] Error en health check ${type}:`, error.message);
      databaseHealth[type] = {
        online: false,
        responseTime: -1,
        connections: 0
      };
      return false;
    }
  };

  await Promise.all([
    healthCheck(primaryPool, 'primary'),
    healthCheck(secondaryPool, 'secondary')
  ]);

  // Actualizar estadísticas de carga
  const totalConnections = databaseHealth.primary.connections + databaseHealth.secondary.connections;
  if (totalConnections > 0) {
    loadBalancerStats.primaryLoad = Math.round((databaseHealth.primary.connections / totalConnections) * 100);
    loadBalancerStats.secondaryLoad = 100 - loadBalancerStats.primaryLoad;
  }
}

/**
 * Ejecuta una consulta con balanceador de carga inteligente
 */
async function executeQuery(query, params = []) {
  const startTime = Date.now();
  loadBalancerStats.totalRequests++;

  try {
    let targetPool;
    let poolType;

    // Determinar qué pool usar basado en la lógica de balanceo
    if (isCriticalQuery(query) || !isReadQuery(query)) {
      // Consultas críticas o de escritura van a primaria
      targetPool = primaryPool;
      poolType = 'primary';
      loadBalancerStats.writeOperations++;
    } else if (isReadQuery(query) && databaseHealth.secondary.online) {
      // Consultas de lectura van a secundaria si está disponible
      targetPool = secondaryPool;
      poolType = 'secondary';
      loadBalancerStats.readOperations++;
    } else {
      // Fallback a primaria
      targetPool = primaryPool;
      poolType = 'primary';
      loadBalancerStats.readOperations++;
    }

    // Ejecutar la consulta
    const result = await targetPool.query(query, params);

    // Registrar tiempo de respuesta
    const responseTime = Date.now() - startTime;
    loadBalancerStats.responseTimeHistory.push({
      timestamp: new Date(),
      responseTime,
      pool: poolType,
      success: true
    });

    // Mantener solo los últimos 100 registros
    if (loadBalancerStats.responseTimeHistory.length > 100) {
      loadBalancerStats.responseTimeHistory = loadBalancerStats.responseTimeHistory.slice(-100);
    }

    // Calcular tiempo promedio
    const avgTime = loadBalancerStats.responseTimeHistory.reduce((sum, record) => sum + record.responseTime, 0) / loadBalancerStats.responseTimeHistory.length;
    loadBalancerStats.avgResponseTime = Math.round(avgTime);

    console.log(`[LOAD BALANCER] Query ejecutada en ${poolType}: ${responseTime}ms`);

    return result;

  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Si falla la secundaria, intentar con primaria
    if (targetPool === secondaryPool && databaseHealth.primary.online) {
      console.log(`[LOAD BALANCER] Failover automático: secundaria -> primaria`);
      loadBalancerStats.failoverCount++;
      loadBalancerStats.lastFailover = new Date().toLocaleString('es-ES');

      try {
        const result = await primaryPool.query(query, params);
        loadBalancerStats.responseTimeHistory.push({
          timestamp: new Date(),
          responseTime: Date.now() - startTime,
          pool: 'primary',
          success: true,
          failover: true
        });
        return result;
      } catch (failoverError) {
        console.error('[LOAD BALANCER] Error en failover:', failoverError.message);
        throw failoverError;
      }
    }

    // Registrar el error
    loadBalancerStats.responseTimeHistory.push({
      timestamp: new Date(),
      responseTime,
      pool: poolType,
      success: false,
      error: error.message
    });

    throw error;
  }
}

/**
 * Obtiene estadísticas del balanceador de carga
 */
function getLoadBalancerStats() {
  return {
    ...loadBalancerStats,
    databaseHealth,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
}

/**
 * Reinicia las estadísticas del balanceador
 */
function resetStats() {
  loadBalancerStats = {
    readOperations: 0,
    writeOperations: 0,
    primaryLoad: 0,
    secondaryLoad: 0,
    failoverCount: 0,
    lastFailover: 'Nunca',
    totalRequests: 0,
    avgResponseTime: 0,
    responseTimeHistory: []
  };
  console.log('[LOAD BALANCER] Estadísticas reiniciadas');
}

/**
 * Inicializa el monitoreo de salud automático
 */
function startHealthMonitoring() {
  // Health check cada 30 segundos
  setInterval(checkDatabaseHealth, 30000);

  // Health check inicial
  checkDatabaseHealth();

  console.log('[LOAD BALANCER] Monitoreo de salud iniciado');
}

/**
 * Cierra las conexiones del balanceador
 */
async function shutdown() {
  try {
    await Promise.all([
      primaryPool.end(),
      secondaryPool.end()
    ]);
    console.log('[LOAD BALANCER] Conexiones cerradas correctamente');
  } catch (error) {
    console.error('[LOAD BALANCER] Error cerrando conexiones:', error.message);
  }
}

export {
  executeQuery,
  getLoadBalancerStats,
  resetStats,
  startHealthMonitoring,
  shutdown,
  checkDatabaseHealth,
  primaryPool,
  secondaryPool
};