/**
 * Optimizador de consultas para eliminar problemas N+1
 * Implementa consultas batch y cache inteligente
 */

import { db } from "./db";
import { positionHistory, users, billingProfiles } from "@shared/schema";
import { eq, inArray, and, desc, asc, sql } from "drizzle-orm";
import { maskWalletAddress, maskEmail } from "./security-utils";

interface OptimizedPositionData {
  id: number;
  walletAddress: string;
  username?: string;
  email?: string;
  depositedUSDC: string;
  feesEarned: string;
  apr: string;
  status: string;
  startDate: Date | null;
  timestamp: Date | null;
  token0: string;
  token1: string;
  timeframe: number;
  contractDuration: number | null;
}

interface BatchUserData {
  walletAddress: string;
  username?: string;
  email?: string;
  isAdmin: boolean;
}

interface PaginationOptions {
  limit: number;
  offset: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface FilterOptions {
  status?: string[];
  walletAddress?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Cache simple en memoria para consultas frecuentes
 */
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const CACHE_TTL = {
  USERS: 30000,      // 30 segundos para datos de usuarios
  POSITIONS: 15000,  // 15 segundos para posiciones
  BILLING: 60000     // 1 minuto para perfiles de facturación
};

/**
 * Obtiene datos del cache si están disponibles y válidos
 */
const getFromCache = (key: string): any | null => {
  const cached = queryCache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    queryCache.delete(key);
    return null;
  }
  
  return cached.data;
};

/**
 * Guarda datos en el cache
 */
const setCache = (key: string, data: any, ttl: number): void => {
  queryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

/**
 * Obtiene múltiples usuarios de una vez (elimina consultas N+1)
 */
export const batchGetUsers = async (walletAddresses: string[]): Promise<Map<string, BatchUserData>> => {
  if (walletAddresses.length === 0) {
    return new Map();
  }

  const cacheKey = `users_batch_${walletAddresses.sort().join(',')}`;
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[QueryOptimizer] Cache hit para ${walletAddresses.length} usuarios`);
    return new Map(cached);
  }

  try {
    const uniqueAddresses = [...new Set(walletAddresses)];
    
    const usersData = await db
      .select({
        walletAddress: users.walletAddress,
        username: users.username,
        email: users.email,
        isAdmin: users.isAdmin
      })
      .from(users)
      .where(inArray(users.walletAddress, uniqueAddresses));

    const userMap = new Map<string, BatchUserData>();
    
    usersData.forEach(user => {
      userMap.set(user.walletAddress, {
        walletAddress: user.walletAddress,
        username: user.username || undefined,
        email: user.email || undefined,
        isAdmin: user.isAdmin || false
      });
    });

    // Cachear resultado
    setCache(cacheKey, Array.from(userMap.entries()), CACHE_TTL.USERS);
    
    console.log(`[QueryOptimizer] Cargados ${usersData.length} usuarios en una consulta batch`);
    return userMap;
  } catch (error) {
    console.error('[QueryOptimizer] Error en batchGetUsers:', error);
    return new Map();
  }
};

/**
 * Obtiene posiciones optimizadas con join único
 */
export const getOptimizedPositions = async (
  filters: FilterOptions = {},
  pagination: PaginationOptions = { limit: 50, offset: 0 }
): Promise<{ positions: OptimizedPositionData[]; total: number; metrics: any }> => {
  
  try {
    // Construir condiciones WHERE dinámicamente
    const conditions = [];
    const params: any[] = [];

    if (filters.status && filters.status.length > 0) {
      conditions.push(`ph.status = ANY($${params.length + 1})`);
      params.push(filters.status);
    }

    if (filters.walletAddress) {
      conditions.push(`ph.wallet_address ILIKE $${params.length + 1}`);
      params.push(`%${filters.walletAddress}%`);
    }

    if (filters.startDateFrom) {
      conditions.push(`ph.start_date >= $${params.length + 1}`);
      params.push(filters.startDateFrom);
    }

    if (filters.startDateTo) {
      conditions.push(`ph.start_date <= $${params.length + 1}`);
      params.push(filters.startDateTo);
    }

    if (filters.minAmount) {
      conditions.push(`ph.deposited_usdc >= $${params.length + 1}`);
      params.push(filters.minAmount);
    }

    if (filters.maxAmount) {
      conditions.push(`ph.deposited_usdc <= $${params.length + 1}`);
      params.push(filters.maxAmount);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Determinar orden
    const sortColumn = pagination.sortBy === 'amount' ? 'ph.deposited_usdc' :
                      pagination.sortBy === 'date' ? 'ph.start_date' :
                      pagination.sortBy === 'status' ? 'ph.status' :
                      'ph.timestamp';
    
    const sortDirection = pagination.sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Consulta optimizada con JOIN para evitar N+1
    const positionsQuery = `
      SELECT 
        ph.id,
        ph.wallet_address,
        ph.deposited_usdc,
        ph.fees_earned,
        ph.apr,
        ph.status,
        ph.start_date,
        ph.timestamp,
        ph.token0,
        ph.token1,
        ph.timeframe,
        ph.contract_duration,
        u.username,
        u.email
      FROM position_history ph
      LEFT JOIN users u ON ph.wallet_address = u.wallet_address
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(pagination.limit, pagination.offset);

    // Consulta para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM position_history ph
      LEFT JOIN users u ON ph.wallet_address = u.wallet_address
      ${whereClause}
    `;

    // Consulta para métricas agregadas
    const metricsQuery = `
      SELECT 
        COUNT(*) as total_positions,
        COUNT(DISTINCT ph.wallet_address) as unique_users,
        SUM(ph.deposited_usdc) as total_deposited,
        SUM(ph.fees_earned) as total_fees,
        AVG(ph.apr) as avg_apr,
        COUNT(CASE WHEN ph.status = 'Active' THEN 1 END) as active_positions,
        COUNT(CASE WHEN ph.status = 'Pending' THEN 1 END) as pending_positions,
        COUNT(CASE WHEN ph.status = 'Finalized' THEN 1 END) as finalized_positions
      FROM position_history ph
      LEFT JOIN users u ON ph.wallet_address = u.wallet_address
      ${whereClause}
    `;

    // Ejecutar consultas en paralelo para mejor performance
    const [positionsResult, countResult, metricsResult] = await Promise.all([
      db.execute(sql.raw(positionsQuery, params)),
      db.execute(sql.raw(countQuery, params.slice(0, -2))),
      db.execute(sql.raw(metricsQuery, params.slice(0, -2)))
    ]);

    const positions: OptimizedPositionData[] = positionsResult.rows.map((row: any) => ({
      id: row.id,
      walletAddress: row.wallet_address,
      username: row.username,
      email: row.email,
      depositedUSDC: row.deposited_usdc,
      feesEarned: row.fees_earned,
      apr: row.apr,
      status: row.status,
      startDate: row.start_date,
      timestamp: row.timestamp,
      token0: row.token0,
      token1: row.token1,
      timeframe: row.timeframe,
      contractDuration: row.contract_duration
    }));

    const total = parseInt(countResult.rows[0]?.total || '0');
    const metrics = metricsResult.rows[0] || {};

    console.log(`[QueryOptimizer] Consulta optimizada ejecutada: ${positions.length} posiciones cargadas`);
    console.log(`[QueryOptimizer] Usuarios únicos en logs: ${positions.map(p => maskWalletAddress(p.walletAddress)).join(', ')}`);

    return {
      positions,
      total,
      metrics: {
        totalPositions: parseInt(metrics.total_positions || '0'),
        uniqueUsers: parseInt(metrics.unique_users || '0'),
        totalDeposited: parseFloat(metrics.total_deposited || '0'),
        totalFees: parseFloat(metrics.total_fees || '0'),
        avgApr: parseFloat(metrics.avg_apr || '0'),
        activePositions: parseInt(metrics.active_positions || '0'),
        pendingPositions: parseInt(metrics.pending_positions || '0'),
        finalizedPositions: parseInt(metrics.finalized_positions || '0')
      }
    };

  } catch (error) {
    console.error('[QueryOptimizer] Error en getOptimizedPositions:', error);
    throw error;
  }
};

/**
 * Obtiene perfiles de facturación en batch
 */
export const batchGetBillingProfiles = async (walletAddresses: string[]): Promise<Map<string, any>> => {
  if (walletAddresses.length === 0) {
    return new Map();
  }

  const cacheKey = `billing_batch_${walletAddresses.sort().join(',')}`;
  const cached = getFromCache(cacheKey);
  if (cached) {
    return new Map(cached);
  }

  try {
    const uniqueAddresses = [...new Set(walletAddresses)];
    
    const billingData = await db
      .select()
      .from(billingProfiles)
      .where(inArray(billingProfiles.walletAddress, uniqueAddresses));

    const billingMap = new Map();
    billingData.forEach(profile => {
      billingMap.set(profile.walletAddress, profile);
    });

    setCache(cacheKey, Array.from(billingMap.entries()), CACHE_TTL.BILLING);
    
    console.log(`[QueryOptimizer] Cargados ${billingData.length} perfiles de facturación en batch`);
    return billingMap;
  } catch (error) {
    console.error('[QueryOptimizer] Error en batchGetBillingProfiles:', error);
    return new Map();
  }
};

/**
 * Limpia el cache automáticamente
 */
export const clearExpiredCache = (): void => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  for (const [key, value] of queryCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => queryCache.delete(key));
  
  if (keysToDelete.length > 0) {
    console.log(`[QueryOptimizer] Limpiadas ${keysToDelete.length} entradas expiradas del cache`);
  }
};

/**
 * Invalida cache específico
 */
export const invalidateCache = (pattern: string): void => {
  const keysToDelete: string[] = [];
  
  for (const key of queryCache.keys()) {
    if (key.includes(pattern)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => queryCache.delete(key));
  
  if (keysToDelete.length > 0) {
    console.log(`[QueryOptimizer] Invalidadas ${keysToDelete.length} entradas del cache con patrón: ${pattern}`);
  }
};

// Limpiar cache automáticamente cada 5 minutos
setInterval(clearExpiredCache, 5 * 60 * 1000);