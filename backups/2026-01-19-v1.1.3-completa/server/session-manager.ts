import { Request, Response, NextFunction } from 'express';

interface SessionData {
  walletAddress: string;
  isAdmin: boolean;
  loginTime: number;
  lastActivity: number;
  sessionId: string;
}

// Almacén de sesiones en memoria (mejorado)
const activeSessions = new Map<string, SessionData>();

// Configuración de sesiones
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días en millisegundos
const ACTIVITY_UPDATE_INTERVAL = 5 * 60 * 1000; // Actualizar actividad cada 5 minutos

/**
 * Crear una nueva sesión para un wallet
 */
export function createSession(walletAddress: string, isAdmin: boolean = false): string {
  const sessionId = generateSessionId();
  const now = Date.now();
  
  const sessionData: SessionData = {
    walletAddress: walletAddress.toLowerCase(),
    isAdmin,
    loginTime: now,
    lastActivity: now,
    sessionId
  };
  
  activeSessions.set(sessionId, sessionData);
  console.log(`✅ Sesión creada para ${walletAddress} - ID: ${sessionId.substring(0, 8)}... (Duración: 7 días)`);
  
  return sessionId;
}

/**
 * Verificar si una sesión es válida
 */
export function validateSession(sessionId: string): SessionData | null {
  if (!sessionId) return null;
  
  const session = activeSessions.get(sessionId);
  if (!session) return null;
  
  const now = Date.now();
  const sessionAge = now - session.loginTime;
  
  // Verificar si la sesión ha expirado
  if (sessionAge > SESSION_DURATION) {
    activeSessions.delete(sessionId);
    console.log(`❌ Sesión expirada para ${session.walletAddress} - ID: ${sessionId.substring(0, 8)}...`);
    return null;
  }
  
  // Actualizar última actividad si ha pasado suficiente tiempo
  if (now - session.lastActivity > ACTIVITY_UPDATE_INTERVAL) {
    session.lastActivity = now;
    activeSessions.set(sessionId, session);
  }
  
  return session;
}

/**
 * Renovar una sesión existente
 */
export function renewSession(sessionId: string): boolean {
  const session = activeSessions.get(sessionId);
  if (!session) return false;
  
  const now = Date.now();
  session.lastActivity = now;
  session.loginTime = now; // Renovar también el tiempo de login
  
  activeSessions.set(sessionId, session);
  console.log(`🔄 Sesión renovada para ${session.walletAddress} - ID: ${sessionId.substring(0, 8)}...`);
  
  return true;
}

/**
 * Eliminar una sesión
 */
export function destroySession(sessionId: string): boolean {
  const session = activeSessions.get(sessionId);
  if (!session) return false;
  
  activeSessions.delete(sessionId);
  console.log(`🗑️ Sesión eliminada para ${session.walletAddress} - ID: ${sessionId.substring(0, 8)}...`);
  
  return true;
}

/**
 * Obtener sesión por wallet address
 */
export function getSessionByWallet(walletAddress: string): SessionData | null {
  const normalizedAddress = walletAddress.toLowerCase();
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.walletAddress === normalizedAddress) {
      return validateSession(sessionId);
    }
  }
  
  return null;
}

/**
 * Generar un ID de sesión único
 */
function generateSessionId(): string {
  return require('crypto').randomBytes(32).toString('hex');
}

/**
 * Middleware para validar sesiones automáticamente
 */
export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  // Buscar sessionId en múltiples lugares
  const sessionId = 
    req.cookies?.sessionId ||
    req.headers['x-session-id'] ||
    req.headers['authorization']?.replace('Bearer ', '') ||
    req.query.sessionId;
  
  if (sessionId) {
    const session = validateSession(sessionId as string);
    if (session) {
      // Agregar información de sesión al request
      (req as any).userSession = session;
      (req as any).sessionId = sessionId;
      
      // También mantener compatibilidad con el sistema anterior
      if (!req.session) {
        req.session = {} as any;
      }
      req.session.user = {
        walletAddress: session.walletAddress,
        isAdmin: session.isAdmin
      };
    }
  }
  
  next();
}

/**
 * Middleware para rutas que requieren autenticación
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = (req as any).userSession;
  
  if (!session) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'No hay sesión válida'
    });
  }
  
  next();
}

/**
 * Middleware para rutas que requieren permisos de administrador
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = (req as any).userSession;
  
  if (!session) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'No hay sesión válida'
    });
  }
  
  if (!session.isAdmin) {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'Se requieren permisos de administrador'
    });
  }
  
  next();
}

/**
 * Limpiar sesiones expiradas periódicamente
 */
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [sessionId, session] of activeSessions.entries()) {
    const sessionAge = now - session.loginTime;
    if (sessionAge > SESSION_DURATION) {
      activeSessions.delete(sessionId);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Limpieza automática: ${cleanedCount} sesiones expiradas eliminadas`);
  }
}, 60 * 60 * 1000); // Limpiar cada hora

/**
 * Obtener estadísticas de sesiones activas
 */
export function getSessionStats() {
  const now = Date.now();
  const sessions = Array.from(activeSessions.values());
  
  return {
    totalSessions: sessions.length,
    adminSessions: sessions.filter(s => s.isAdmin).length,
    recentSessions: sessions.filter(s => now - s.lastActivity < 30 * 60 * 1000).length, // Últimos 30 min
    oldestSession: sessions.length > 0 ? Math.min(...sessions.map(s => s.loginTime)) : null
  };
}