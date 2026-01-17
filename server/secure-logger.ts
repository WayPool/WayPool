/**
 * Sistema de logging seguro para proteger información sensible
 * Reemplaza console.log con versión que enmascara datos PII
 */

import { maskWalletAddress, maskEmail } from './security-utils';

interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
  SECURITY: 'security';
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn', 
  ERROR: 'error',
  SECURITY: 'security'
};

/**
 * Patrones para detectar información sensible
 */
const SENSITIVE_PATTERNS = {
  WALLET_ADDRESS: /0x[a-fA-F0-9]{40}/g,
  EMAIL: /[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g,
  PHONE: /(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
  CREDIT_CARD: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  IP_ADDRESS: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  PRIVATE_KEY: /[a-fA-F0-9]{64}/g,
  SEED_PHRASE: /(\b\w+\s+){11,23}\w+\b/g
};

/**
 * Sanitiza texto removiendo o enmascarando información sensible
 */
const sanitizeText = (text: string): string => {
  let sanitized = text;
  
  // Enmascarar wallet addresses
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.WALLET_ADDRESS, (match) => {
    return maskWalletAddress(match);
  });
  
  // Enmascarar emails
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.EMAIL, (match) => {
    return maskEmail(match);
  });
  
  // Enmascarar números de teléfono
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.PHONE, (match) => {
    return `***${match.slice(-4)}`;
  });
  
  // Enmascarar tarjetas de crédito
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.CREDIT_CARD, () => {
    return '**** **** **** ****';
  });
  
  // Enmascarar IPs (excepto localhost)
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.IP_ADDRESS, (match) => {
    if (match.startsWith('127.') || match === '::1' || match.startsWith('192.168.')) {
      return match; // Mantener IPs locales
    }
    return '***.' + match.split('.').slice(-1)[0];
  });
  
  // Remover completamente claves privadas
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.PRIVATE_KEY, () => {
    return '[PRIVATE_KEY_REDACTED]';
  });
  
  // Remover frases semilla
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.SEED_PHRASE, () => {
    return '[SEED_PHRASE_REDACTED]';
  });
  
  return sanitized;
};

/**
 * Sanitiza objetos recursivamente
 */
const sanitizeObject = (obj: any, depth: number = 0): any => {
  if (depth > 10) return '[MAX_DEPTH_REACHED]'; // Prevenir recursión infinita
  
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Enmascarar campos sensibles por nombre
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('email')) {
        sanitized[key] = typeof value === 'string' ? maskEmail(value) : value;
      } else if (lowerKey.includes('wallet') || lowerKey.includes('address')) {
        sanitized[key] = typeof value === 'string' ? maskWalletAddress(value) : value;
      } else if (lowerKey.includes('password') || lowerKey.includes('secret') || lowerKey.includes('key')) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeObject(value, depth + 1);
      }
    }
    
    return sanitized;
  }
  
  return obj;
};

/**
 * Formatea timestamp para logs
 */
const getTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Logger seguro que reemplaza console.log
 */
class SecureLogger {
  private isProduction = process.env.NODE_ENV === 'production';
  
  /**
   * Log de depuración (solo en desarrollo)
   */
  debug(...args: any[]): void {
    if (!this.isProduction) {
      const sanitizedArgs = args.map(arg => sanitizeObject(arg));
      console.log(`[${getTimestamp()}] [DEBUG]`, ...sanitizedArgs);
    }
  }
  
  /**
   * Log de información general
   */
  info(...args: any[]): void {
    const sanitizedArgs = args.map(arg => sanitizeObject(arg));
    console.log(`[${getTimestamp()}] [INFO]`, ...sanitizedArgs);
  }
  
  /**
   * Log de advertencias
   */
  warn(...args: any[]): void {
    const sanitizedArgs = args.map(arg => sanitizeObject(arg));
    console.warn(`[${getTimestamp()}] [WARN]`, ...sanitizedArgs);
  }
  
  /**
   * Log de errores
   */
  error(...args: any[]): void {
    const sanitizedArgs = args.map(arg => sanitizeObject(arg));
    console.error(`[${getTimestamp()}] [ERROR]`, ...sanitizedArgs);
  }
  
  /**
   * Log de eventos de seguridad (siempre se registra)
   */
  security(...args: any[]): void {
    const sanitizedArgs = args.map(arg => sanitizeObject(arg));
    console.log(`[${getTimestamp()}] [SECURITY]`, ...sanitizedArgs);
  }
  
  /**
   * Log específico para administración con extra protección
   */
  admin(action: string, walletAddress: string, details?: any): void {
    const sanitizedDetails = details ? sanitizeObject(details) : undefined;
    console.log(`[${getTimestamp()}] [ADMIN] ${action} by ${maskWalletAddress(walletAddress)}`, sanitizedDetails);
  }
  
  /**
   * Log de eventos de autenticación
   */
  auth(event: string, identifier: string, success: boolean, details?: any): void {
    const maskedIdentifier = identifier.includes('@') ? maskEmail(identifier) : maskWalletAddress(identifier);
    const sanitizedDetails = details ? sanitizeObject(details) : undefined;
    
    console.log(`[${getTimestamp()}] [AUTH] ${event} for ${maskedIdentifier}: ${success ? 'SUCCESS' : 'FAILED'}`, sanitizedDetails);
  }
  
  /**
   * Log de transacciones financieras
   */
  transaction(type: string, walletAddress: string, amount?: string, details?: any): void {
    const sanitizedDetails = details ? sanitizeObject(details) : undefined;
    console.log(`[${getTimestamp()}] [TRANSACTION] ${type} by ${maskWalletAddress(walletAddress)} amount: ${amount || 'N/A'}`, sanitizedDetails);
  }
  
  /**
   * Log para auditoría (máximo nivel de sanitización)
   */
  audit(action: string, actor: string, resource: string, outcome: 'SUCCESS' | 'FAILED', details?: any): void {
    const maskedActor = actor.includes('@') ? maskEmail(actor) : maskWalletAddress(actor);
    const sanitizedDetails = details ? sanitizeObject(details) : undefined;
    
    console.log(`[${getTimestamp()}] [AUDIT] ${action} on ${resource} by ${maskedActor}: ${outcome}`, sanitizedDetails);
  }
}

// Crear instancia global del logger
export const logger = new SecureLogger();

// Función para reemplazar console.log existentes de forma gradual
export const secureLog = (...args: any[]): void => {
  logger.info(...args);
};

// Función para logs de desarrollo que se eliminan en producción
export const devLog = (...args: any[]): void => {
  logger.debug(...args);
};

// Exportar tipos para uso en otros archivos
export { LOG_LEVELS };
export type { LogLevel };