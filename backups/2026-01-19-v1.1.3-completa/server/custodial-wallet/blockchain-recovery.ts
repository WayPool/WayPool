import { createHash, randomBytes } from 'crypto';
import { storage } from '../storage';
import { APP_NAME } from '../seo';

/**
 * Sistema de recuperación de contraseña inspirado en blockchain
 * Utiliza técnicas de hash, pares de claves y códigos comprometidos
 * para garantizar la seguridad y verificabilidad
 */

interface RecoveryKeyPair {
  publicKey: string;
  privateKey: string;
  expiresAt: Date;
}

/**
 * Genera un par de recuperación único para el usuario
 * - privateKey: Clave secreta que el usuario usará para recuperación
 * - publicKey: Clave verificable almacenada en el servidor
 */
export function generateRecoveryKeyPair(): RecoveryKeyPair {
  // Generar código alfanumérico fácil de usar (sólo letras mayúsculas y números) 
  const charset = "ABCDEFGHIJKLMNPQRSTUVWXYZ23456789"; // Excluimos caracteres ambiguos
  
  // Generar 10 caracteres aleatorios para el código de recuperación
  let privateKey = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    privateKey += charset.charAt(randomIndex);
  }
  
  // Generar un valor hash para la clave pública basado en la privada
  // Esto permite verificación sin almacenar la clave privada
  const publicKey = createHash('sha256').update(privateKey).digest('hex');
  
  // Establecer expiración de 24 horas
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  return {
    privateKey,  // Código que se enviará al usuario (ej: "A7B3X9P2D5")
    publicKey,   // Hash que se almacenará en BD (sha256 del código)
    expiresAt    // Fecha de expiración
  };
}

/**
 * Almacena un código de recuperación para un usuario
 */
export async function storeRecoveryCode(userId: number): Promise<RecoveryKeyPair> {
  const keyPair = generateRecoveryKeyPair();
  
  // Guardar código comprometido (solo la clave pública y expiración)
  await storage.savePasswordRecoveryToken(userId, {
    token: keyPair.publicKey,
    expiresAt: keyPair.expiresAt,
    used: false
  });
  
  return keyPair;
}

/**
 * Verifica la validez de un código de recuperación
 * Confirma si el código proporcionado coincide con el hash almacenado
 */
export async function verifyRecoveryCode(
  email: string, 
  recoveryCode: string
): Promise<{isValid: boolean, userId?: number, token?: string}> {
  // Buscar usuario por email
  const user = await storage.getUserByEmail(email);
  if (!user) {
    console.log(`[BlockchainRecovery] Usuario no encontrado: ${email}`);
    return { isValid: false };
  }
  
  // Obtener todos los tokens activos para el usuario
  const allTokens = await storage.getAllRecoveryTokensForUser(user.id);
  if (!allTokens || allTokens.length === 0) {
    console.log(`[BlockchainRecovery] No hay tokens de recuperación para usuario: ${user.id}`);
    return { isValid: false };
  }
  
  // Generar hash del código ingresado para comparar con los almacenados
  const inputHash = createHash('sha256').update(recoveryCode).digest('hex');
  console.log(`[BlockchainRecovery] Verificando código. Hash calculado: ${inputHash.substring(0, 8)}...`);
  
  // Buscar un token que coincida con el hash calculado
  const validToken = allTokens.find(token => {
    // Verificar que no esté usado
    if (token.used) {
      console.log(`[BlockchainRecovery] Token ${token.token.substring(0, 8)}... ya utilizado`);
      return false;
    }
    
    // Verificar que no haya expirado
    const now = new Date();
    if (now > token.expiresAt) {
      console.log(`[BlockchainRecovery] Token ${token.token.substring(0, 8)}... expirado`);
      return false;
    }
    
    // Comparar hash almacenado con hash calculado del código ingresado
    const isMatch = token.token === inputHash;
    if (isMatch) {
      console.log(`[BlockchainRecovery] Hash coincidente encontrado: ${token.token.substring(0, 8)}...`);
    }
    
    return isMatch;
  });
  
  if (validToken) {
    return {
      isValid: true,
      userId: user.id,
      token: validToken.token
    };
  }
  
  return { isValid: false };
}

/**
 * Genera un email plano con el código de recuperación
 * Utilizamos formato extremadamente simple para evitar problemas con el envío
 */
export function generateRecoveryEmail(code: string): string {
  return `
Tu código de recuperación para ${APP_NAME}:

${code}

Este código expira en 24 horas.
Introducelo en la página de recuperación para restablecer tu contraseña.

--
${APP_NAME}
Blockchain Financial Services
support@elysiumdubai.net
`;
}

/**
 * Genera un email HTML con el código de recuperación destacado
 * Diseño simple pero efectivo para minimizar problemas
 */
export function generateRecoveryEmailHtml(code: string): string {
  const escapedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Código de Recuperación ${APP_NAME}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 8px; padding: 30px; border: 1px solid #3b82f6;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #ffffff; margin-bottom: 5px;">${APP_NAME}</h1>
      <p style="color: #94a3b8; margin-top: 0;">Código de Recuperación</p>
    </div>
    
    <p style="color: #e2e8f0; line-height: 1.5;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. A continuación está tu código de recuperación:</p>
    
    <div style="background-color: #111827; border: 2px solid #3b82f6; color: #ffffff; text-align: center; padding: 20px; border-radius: 6px; margin: 25px 0; font-family: monospace; font-size: 24px; letter-spacing: 2px;">
      ${escapedCode}
    </div>
    
    <p style="color: #e2e8f0; line-height: 1.5;">Este código expira en 24 horas. Introdúcelo en la página de recuperación para restablecer tu contraseña.</p>
    
    <div style="background-color: #172033; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; color: #94a3b8;">
      Por seguridad, nunca compartas este código con nadie.
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #2d3748; text-align: center; color: #64748b; font-size: 12px;">
      <p>${APP_NAME} - Blockchain Financial Services</p>
      <p>Si no solicitaste este código, ignora este correo.</p>
    </div>
  </div>
</body>
</html>`;
}