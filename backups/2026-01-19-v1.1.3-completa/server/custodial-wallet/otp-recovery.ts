import { randomBytes } from 'crypto';
import { storage } from '../storage';

/**
 * Sistema de recuperación basado en OTP (One-Time Password)
 * Utiliza códigos de un solo uso generados en el momento y almacenados en sesión
 */

// Almacén en memoria para códigos OTP (para desarrollo)
// En producción esto debería ser una tabla en la base de datos
interface OTPEntry {
  code: string;
  userId: number;
  email: string;
  expiresAt: Date;
  used: boolean;
}

// Cache en memoria
const otpCache: OTPEntry[] = [];

/**
 * Genera un código OTP seguro de 6 dígitos
 */
function generateOTP(): string {
  // Usamos solo dígitos para máxima simplicidad
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Almacena un código OTP para un usuario
 */
export async function createOTPForUser(userId: number, email: string): Promise<string> {
  // Generar código numérico de 6 dígitos
  const otpCode = generateOTP();
  
  // Establecer expiración (5 minutos)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);
  
  // Eliminar cualquier OTP previo para este usuario
  const existingIndex = otpCache.findIndex(entry => entry.userId === userId);
  if (existingIndex !== -1) {
    otpCache.splice(existingIndex, 1);
  }
  
  // Almacenar el nuevo OTP
  otpCache.push({
    code: otpCode,
    userId,
    email,
    expiresAt,
    used: false
  });
  
  // Log para depuración
  console.log(`[OTP Recovery] Generado OTP ${otpCode} para usuario ${userId} (${email})`);
  
  return otpCode;
}

/**
 * Verifica un código OTP
 */
export function verifyOTP(email: string, code: string): { isValid: boolean, userId?: number, email?: string } {
  // Buscar el OTP en la caché
  const entry = otpCache.find(e => 
    e.email === email && 
    e.code === code && 
    !e.used && 
    e.expiresAt > new Date()
  );
  
  if (!entry) {
    console.log(`[OTP Recovery] OTP inválido o expirado para ${email}`);
    return { isValid: false };
  }
  
  // Marcar como usado
  entry.used = true;
  
  console.log(`[OTP Recovery] OTP válido para email ${entry.email}`);
  
  return {
    isValid: true,
    userId: entry.userId,
    email: entry.email
  };
}

/**
 * Genera un email extremadamente simple con OTP
 */
export function generateOTPEmail(code: string): string {
  return `
Tu código de recuperación para WayBank:

${code}

Este código expira en 5 minutos.
Introdúcelo en la página de recuperación para restablecer tu contraseña.

--
WayBank
`;
}

/**
 * Genera un HTML con estilo blockchain robusto para clientes de email
 */
export function generateOTPEmailHtml(code: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Código de Recuperación WayBank</title>
</head>
<body style="margin:0;padding:0;background-color:#0e1528;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0e1528">
    <tr>
      <td align="center" valign="top">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#0e1528" style="max-width:600px;border:1px solid #1e2e4a;border-radius:8px;overflow:hidden;margin:20px auto;">
          <!-- HEADER -->
          <tr>
            <td align="center" bgcolor="#101a33" style="padding:25px 15px;border-bottom:2px solid #1e2e4a;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <h1 style="margin:0;padding:0;color:#4a88ff;font-size:28px;font-weight:700;letter-spacing:0;">WayBank</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CONTENIDO -->
          <tr>
            <td style="padding:30px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h2 style="margin:0 0 20px 0;color:#ffffff;font-size:22px;font-weight:600;">Código de Verificación</h2>
                    <p style="margin:0 0 25px 0;color:#d1d8e4;font-size:16px;line-height:24px;">Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código para completar el proceso:</p>
                  </td>
                </tr>
                
                <!-- CÓDIGO OTP -->
                <tr>
                  <td align="center" style="padding:15px 0 25px 0;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" bgcolor="#12213d" style="padding:25px 15px;border:2px solid #1e3366;border-radius:10px;">
                          <span style="font-family:Consolas,monospace;font-size:36px;font-weight:bold;color:#4a88ff;letter-spacing:5px;">${code}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- ALERTA -->
                <tr>
                  <td style="padding:5px 0 20px 0;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td bgcolor="#152452" style="padding:12px 15px;border-left:4px solid #4a88ff;border-radius:4px;">
                          <p style="margin:0;color:#d1d8e4;font-size:14px;">Este código expirará en <strong style="color:#ffffff;">5 minutos</strong> por razones de seguridad.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td>
                    <p style="margin:20px 0 0 0;color:#a3b1cc;font-size:15px;line-height:22px;">Si no has solicitado este cambio, puedes ignorar este mensaje.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td align="center" bgcolor="#101a33" style="padding:20px 15px;border-top:1px solid #1e2e4a;">
              <p style="margin:0;color:#6d84b4;font-size:13px;">&copy; ${new Date().getFullYear()} WayBank - Seguridad Blockchain</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}