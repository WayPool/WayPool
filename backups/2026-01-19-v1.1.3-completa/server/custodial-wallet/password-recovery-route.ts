import { Request, Response, Router } from "express";
import { storage } from "../storage";
import { emailService } from "../email-service";
import { hash } from 'bcrypt';
import { 
  createOTPForUser,
  verifyOTP,
  generateOTPEmail,
  generateOTPEmailHtml
} from './otp-recovery';

const passwordRecoveryRouter = Router();

/**
 * Endpoint para solicitar recuperación de contraseña
 * Utiliza un sistema OTP (One-Time Password) con códigos de un solo uso
 * NO requiere que el email exista en la base de datos
 */
passwordRecoveryRouter.post("/recover", async (req: Request, res: Response) => {
  console.log('[password-recovery] ========== INICIO RECUPERACIÓN ==========');
  console.log('[password-recovery] Body recibido:', { email: req.body?.email });
  
  try {
    const { email } = req.body;
    
    if (!email) {
      console.log('[password-recovery] ERROR: Email no proporcionado');
      return res.status(400).json({
        success: false,
        error: "Se requiere un email para recuperar la contraseña"
      });
    }
    
    console.log('[password-recovery] Generando código OTP para:', email);
    
    // Para seguridad, siempre generamos un código sin verificar si el email existe
    // Un identificador aleatorio para usar en vez de ID de usuario
    const tempUserId = Math.floor(Math.random() * 10000) + 1;
    
    // Generar código OTP 
    const otpCode = await createOTPForUser(tempUserId, email);
    console.log('[password-recovery] Código OTP generado:', otpCode);
    
    // Generar email con contenido extremadamente simple (solo texto)
    const plainTextEmail = generateOTPEmail(otpCode);
    
    // Generar HTML ultra básico
    const htmlEmail = generateOTPEmailHtml(otpCode);
    
    console.log('[password-recovery] Enviando email a:', email);
    
    // Enviar email con código OTP
    const emailSent = await emailService.sendEmail({
      to: email,
      subject: "Código de recuperación WayBank",
      html: htmlEmail,
      text: plainTextEmail,
      from: "info@elysiumdubai.net" // Usar directamente el remitente verificado
    });
    
    console.log('[password-recovery] Resultado envío email:', emailSent);
    
    // El sistema funciona independientemente del envío de email
    // Si el email falla, el código OTP sigue siendo válido y se puede obtener desde el admin
    if (!emailSent) {
      console.warn(`[OTP Recovery] Email no enviado (SMTP no disponible), pero OTP generado para: ${email}`);
      console.log(`[OTP Recovery] Código OTP para ${email}: ${otpCode}`);
    } else {
      console.log(`[OTP Recovery] Email de recuperación enviado con éxito a: ${email}`);
    }
    
    // Siempre devolver éxito con el código OTP
    // En producción con email funcionando, se debe remover el campo otp de la respuesta
    return res.json({
      success: true,
      message: emailSent 
        ? "Se ha enviado un código de recuperación al email indicado" 
        : "Código de recuperación generado. Contacta al administrador para obtenerlo.",
      recoveryInfo: {
        email,
        codeExpiration: "5 minutos",
        emailSent: emailSent,
        // Código OTP disponible para desarrollo/admin - en producción solo si email falla
        otp: otpCode
      }
    });
    
  } catch (error) {
    console.error("[password-recovery] ========== ERROR EN RECUPERACIÓN ==========");
    console.error("[password-recovery] Error completo:", error);
    console.error("[password-recovery] Stack:", error instanceof Error ? error.stack : 'N/A');
    return res.status(500).json({
      success: false,
      error: "Error al procesar la solicitud de recuperación"
    });
  }
});

/**
 * Endpoint para verificar la validez de un token de recuperación
 * Se utiliza antes de mostrar el formulario de restablecimiento
 */
passwordRecoveryRouter.get("/verify/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Se requiere un token de recuperación"
      });
    }
    
    // Verificar si el token existe y es válido
    const recovery = await storage.getPasswordRecoveryByToken(token);
    
    if (!recovery) {
      console.log("Token de recuperación no encontrado:", token);
      return res.status(404).json({
        success: false,
        error: "Token de recuperación no encontrado"
      });
    }
    
    // Verificar si ya ha sido utilizado
    if (recovery.used) {
      console.log("Token de recuperación ya utilizado:", token);
      return res.status(400).json({
        success: false,
        error: "Este token ya ha sido utilizado"
      });
    }
    
    // Verificar si ha expirado
    const now = new Date();
    if (now > recovery.expiresAt) {
      console.log("Token de recuperación expirado:", token);
      return res.status(400).json({
        success: false,
        error: "El token de recuperación ha expirado"
      });
    }
    
    // Obtener información del usuario asociado
    const user = await storage.getUser(recovery.userId);
    
    if (!user) {
      console.log("Usuario no encontrado para el token:", token);
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }
    
    // Todo correcto, el token es válido
    return res.json({
      success: true,
      message: "Token válido",
      email: user.email
    });
    
  } catch (error) {
    console.error("Error al verificar token de recuperación:", error);
    return res.status(500).json({
      success: false,
      error: "Error al verificar el token de recuperación"
    });
  }
});

/**
 * Endpoint para restablecer contraseña usando token de recuperación
 */
passwordRecoveryRouter.post("/reset", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Se requiere token y nueva contraseña"
      });
    }
    
    // Verificar validez del token
    const recovery = await storage.getPasswordRecoveryByToken(token);
    
    if (!recovery) {
      return res.status(404).json({
        success: false,
        error: "Token de recuperación inválido o expirado"
      });
    }
    
    if (recovery.used) {
      return res.status(400).json({
        success: false,
        error: "Este token ya ha sido utilizado"
      });
    }
    
    const now = new Date();
    if (now > recovery.expiresAt) {
      return res.status(400).json({
        success: false,
        error: "El token de recuperación ha expirado"
      });
    }
    
    // Obtener usuario asociado al token
    const user = await storage.getUser(recovery.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }
    
    // Actualizar contraseña del usuario (debe usar la misma lógica de hash que en el registro)
    await storage.updateUserPassword(user.id, newPassword);
    
    // Marcar token como usado
    await storage.markRecoveryTokenAsUsed(token);
    
    return res.json({
      success: true,
      message: "Contraseña actualizada con éxito"
    });
    
  } catch (error) {
    console.error("Error en restablecimiento de contraseña:", error);
    return res.status(500).json({
      success: false,
      error: "Error al procesar el restablecimiento de contraseña"
    });
  }
});

/**
 * Endpoint para restablecer contraseña usando código OTP
 * Sistema simplificado sin depender de la base de datos de usuarios
 */
passwordRecoveryRouter.post("/reset-direct", async (req: Request, res: Response) => {
  try {
    const { email, recoveryCode, newPassword } = req.body;
    
    if (!email || !recoveryCode || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Se requiere email, código de recuperación y nueva contraseña"
      });
    }
    
    console.log(`[OTP Recovery] Intentando verificar código: ${recoveryCode} para email: ${email}`);
    
    // Verificar el código OTP
    const verificationResult = verifyOTP(email, recoveryCode);
    
    if (!verificationResult.isValid) {
      console.log(`[OTP Recovery] Código inválido para ${email}`);
      return res.status(400).json({
        success: false,
        error: "Código de recuperación inválido o expirado"
      });
    }
    
    console.log(`[OTP Recovery] Código válido para email: ${email}`);
    
    // Importar el servicio de wallet custodiada
    const { custodialWalletService } = await import('./service-instance');
    
    // Actualizar la contraseña del usuario usando el email verificado
    const updateResult = await custodialWalletService.updatePasswordByEmail(email, newPassword);
    
    if (!updateResult) {
      console.error(`[OTP Recovery] No se pudo actualizar la contraseña para ${email}`);
      return res.status(500).json({
        success: false,
        error: "No se pudo actualizar la contraseña. Puede que la billetera asociada a este email no exista."
      });
    }
    
    console.log(`[OTP Recovery] Contraseña actualizada con éxito para ${email}`);
    
    return res.json({
      success: true,
      message: "Tu contraseña ha sido actualizada correctamente",
      info: {
        passwordUpdated: true,
        emailVerified: email 
      }
    });
    
  } catch (error) {
    console.error("[OTP Recovery] Error en restablecimiento de contraseña:", error);
    return res.status(500).json({
      success: false,
      error: "Error al procesar el restablecimiento de contraseña"
    });
  }
});

export { passwordRecoveryRouter };