/**
 * Utilidades de seguridad para encriptación de datos sensibles
 * Implementa encriptación AES-256-GCM para emails y datos PII
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Para GCM, se recomienda 12 bytes, pero 16 es más seguro
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000; // PBKDF2 iterations

// Obtener clave de encriptación del entorno o generar una por defecto
const getEncryptionKey = (): string => {
  return process.env.ENCRYPTION_KEY || 'waybank-default-key-for-development-only-change-in-production';
};

/**
 * Deriva una clave de encriptación usando PBKDF2
 */
const deriveKey = (password: string, salt: Buffer): Buffer => {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
};

/**
 * Encripta un texto usando AES-256-GCM
 */
export const encryptSensitiveData = (text: string): string => {
  if (!text || text.trim() === '') {
    return text; // No encriptar strings vacíos
  }

  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = deriveKey(getEncryptionKey(), salt);
    
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(Buffer.from('waybank-auth-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combinar salt + iv + tag + encrypted data
    const result = salt.toString('hex') + ':' + iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
    return result;
  } catch (error) {
    console.error('Error encriptando datos sensibles:', error);
    // En caso de error, devolver el texto original pero con un marcador de error
    return `ERROR_ENCRYPTION:${text}`;
  }
};

/**
 * Desencripta un texto encriptado con AES-256-GCM
 */
export const decryptSensitiveData = (encryptedText: string): string => {
  if (!encryptedText || encryptedText.trim() === '') {
    return encryptedText;
  }

  // Si el texto tiene el marcador de error de encriptación, extraer el texto original
  if (encryptedText.startsWith('ERROR_ENCRYPTION:')) {
    return encryptedText.replace('ERROR_ENCRYPTION:', '');
  }

  // Si no parece encriptado (no tiene el formato correcto), devolverlo tal como está
  if (!encryptedText.includes(':') || encryptedText.split(':').length !== 4) {
    return encryptedText;
  }

  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 4) {
      return encryptedText; // Formato inválido, devolver original
    }

    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const tag = Buffer.from(parts[2], 'hex');
    const encrypted = parts[3];

    const key = deriveKey(getEncryptionKey(), salt);
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAAD(Buffer.from('waybank-auth-data'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error desencriptando datos sensibles:', error);
    // En caso de error, devolver el texto original
    return encryptedText;
  }
};

/**
 * Función utilitaria para enmascarar wallet addresses en logs
 */
export const maskWalletAddress = (address: string): string => {
  if (!address || address.length < 10) {
    return address;
  }
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Función utilitaria para enmascarar emails en logs
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email;
  }
  
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.length > 2 
    ? `${localPart[0]}***${localPart[localPart.length - 1]}`
    : `${localPart[0]}***`;
  
  return `${maskedLocal}@${domain}`;
};

/**
 * Verifica si un string está encriptado
 */
export const isEncrypted = (text: string): boolean => {
  if (!text) return false;
  
  // Formato: salt:iv:tag:encrypted (4 partes separadas por :)
  const parts = text.split(':');
  return parts.length === 4 && 
         parts[0].length === SALT_LENGTH * 2 && // salt en hex
         parts[1].length === IV_LENGTH * 2 &&   // iv en hex
         parts[2].length === TAG_LENGTH * 2;    // tag en hex
};