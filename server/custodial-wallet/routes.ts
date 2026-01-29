import { Router, Request, Response, NextFunction } from 'express';
import { custodialWalletService } from './service';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { emailService } from '../email-service';
import { runCustodialWalletMigration } from './migrations';
import express from 'express';
import { storage } from '../storage';

// Crear equivalentes a __dirname y __filename para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Extender Request de Express para incluir walletSession
declare global {
  namespace Express {
    interface Request {
      walletSession?: {
        walletId: number;
        address: string;
        expiresAt: Date;
        token?: string; // Añadimos el token para usarlo en los endpoints
      };
    }
  }
}

// Crear router
const custodialWalletRouter = Router();

// Constantes
const SALT_ROUNDS = 10;

// Esquemas de validación
const registerSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
});

const loginSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(1, "Contraseña requerida"),
});

const recoveryRequestSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual requerida"),
  newPassword: z.string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
});

const signMessageSchema = z.object({
  address: z.string(),
  message: z.string(),
});

// Middleware para verificar el token de sesión
const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar si es la billetera de prueba por la ruta o headers
    let requestedAddress = req.params.address || 
                          req.body?.address || 
                          req.headers['x-wallet-address'];
                          
    // Normalizar la dirección a minúsculas para comparación consistente
    if (requestedAddress) {
      requestedAddress = requestedAddress.toLowerCase();
      console.log('[verifySession] Dirección normalizada a:', requestedAddress);
    }
                          
    // Caso especial para billetera de prueba
    if (requestedAddress && requestedAddress === '0xc2dd65af9fed4a01fb8764d65c591077f02c6497') {
      console.log('[verifySession] Detectada billetera de prueba en middleware');
      
      // Crear una sesión simulada para la billetera de prueba
      req.walletSession = {
        walletId: 9999,
        address: '0xc2dd65af9fed4a01fb8764d65c591077f02c6497', // Guardamos la dirección normalizada
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        token: 'test-session-token-123456789',
      };
      
      // Continuar con el siguiente middleware
      return next();
    }
    
    // Para billeteras reales, obtener el token de sesión de varias fuentes
    const sessionToken = req.cookies?.custodialSession || 
                         req.headers['x-custodial-session'] || 
                         req.query.sessionToken as string || 
                         req.body?.sessionToken;
    
    console.log('[verifySession] Token obtenido:', sessionToken ? 'Presente' : 'No presente');
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No hay sesión activa' });
    }
    
    // Verificar la sesión
    const session = await custodialWalletService.verifySession(sessionToken);
    if (!session) {
      return res.status(401).json({ error: 'Sesión inválida o expirada' });
    }
    
    console.log('[verifySession] Sesión válida para dirección:', session.address);
    
    // Añadir datos de la sesión al request, incluyendo el token original
    req.walletSession = {
      ...session,
      token: sessionToken as string
    };
    next();
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    res.status(500).json({ error: 'Error al verificar la sesión' });
  }
};

// Ruta para registrar una nueva billetera custodiada
custodialWalletRouter.post('/register', async (req, res) => {
  try {
    // Validar datos de entrada
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de registro inválidos',
        details: validationResult.error.format()
      });
    }
    
    const { email, password } = validationResult.data;
    
    // Crear billetera
    const wallet = await custodialWalletService.createWallet(email, password);
    
    // Iniciar sesión automáticamente
    const session = await custodialWalletService.authenticate(email, password);
    
    // Configurar cookie segura con el token de sesión
    res.cookie('custodialSession', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
    
    // Devolver información de la billetera y el token de sesión
    res.status(201).json({
      success: true,
      walletAddress: wallet.address,
      sessionToken: session.sessionToken, // Incluir el token para cliente
      createdAt: wallet.createdAt,
    });
  } catch (error: any) {
    console.error('Error al registrar billetera:', error);
    
    // Detectar error específico de email ya registrado
    if (error.message && error.message.includes('email ya está registrado')) {
      return res.status(409).json({ 
        error: 'El email ya está registrado con otra billetera',
        code: 'EMAIL_ALREADY_REGISTERED'
      });
    }
    
    // Cualquier otro error
    res.status(500).json({ error: 'Error al crear la billetera custodiada' });
  }
});

// Ruta para iniciar sesión
custodialWalletRouter.post('/login', async (req, res) => {
  console.log('[custodial-login] ========== INICIO LOGIN CUSTODIAL ==========');
  console.log('[custodial-login] Body recibido:', { email: req.body?.email, hasPassword: !!req.body?.password });
  
  try {
    // Validar datos de entrada
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log('[custodial-login] ERROR: Validación fallida', validationResult.error.format());
      return res.status(400).json({ 
        error: 'Datos de inicio de sesión inválidos',
        details: validationResult.error.format()
      });
    }
    
    const { email, password } = validationResult.data;
    console.log('[custodial-login] Autenticando usuario:', email);
    
    // Autenticar usuario en el sistema de wallet custodial
    const session = await custodialWalletService.authenticate(email, password);
    console.log('[custodial-login] Autenticación exitosa, wallet:', session.address);
    
    // Normalizar la dirección para consistencia
    const normalizedWalletAddress = session.address.toLowerCase();
    
    // IMPORTANTE: Crear o verificar el usuario en la tabla principal 'users'
    // Esto asegura que el usuario custodial tenga las mismas capacidades que los usuarios externos
    let user = await storage.getUserByWalletAddress(normalizedWalletAddress);
    
    if (!user) {
      try {
        console.log(`[custodial-login] Creando usuario automáticamente para wallet custodial: ${normalizedWalletAddress}`);
        user = await storage.createUser({
          walletAddress: normalizedWalletAddress,
          username: `user_${normalizedWalletAddress.substring(2, 8)}`,
          email: email, // Guardar el email del login custodial
          theme: "dark",
          defaultNetwork: "ethereum",
          isAdmin: false,
          hasAcceptedLegalTerms: false,
          termsOfUseAccepted: false,
          privacyPolicyAccepted: false,
          disclaimerAccepted: false,
          walletDisplay: "shortened",
          language: "es",
          gasPreference: "standard",
          autoHarvest: false,
          harvestPercentage: 100
        });
        console.log(`[custodial-login] Usuario creado con ID: ${user.id}`);
      } catch (createError) {
        console.error("[custodial-login] Error al crear usuario:", createError);
        // No fallar el login, continuar sin crear el usuario
      }
    }
    
    // Establecer la sesión express para que los endpoints protegidos funcionen
    req.session.user = {
      walletAddress: normalizedWalletAddress,
      isAdmin: user?.isAdmin || false
    };
    
    console.log(`[custodial-login] Sesión express establecida para: ${normalizedWalletAddress}, isAdmin: ${user?.isAdmin}`);
    console.log('[custodial-login] Session ID:', req.sessionID);
    console.log('[custodial-login] req.session.user:', req.session.user);
    
    // Configurar cookie segura con el token de sesión custodial
    res.cookie('custodialSession', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
    
    console.log('[custodial-login] ========== LOGIN CUSTODIAL EXITOSO ==========');
    
    // Devolver información de la sesión y el token para el cliente
    res.status(200).json({
      success: true,
      walletAddress: session.address,
      sessionToken: session.sessionToken, // Incluir el token para el cliente
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('[custodial-login] ========== ERROR EN LOGIN CUSTODIAL ==========');
    console.error('[custodial-login] Error:', error);
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// Ruta para verificar sesión actual
custodialWalletRouter.get('/session', async (req, res) => {
  try {
    // Obtener el token de sesión de las cookies o headers
    const sessionToken = req.cookies?.custodialSession || req.headers['x-custodial-session'];
    
    if (!sessionToken) {
      return res.status(200).json({ authenticated: false });
    }
    
    // Verificar la sesión
    const session = await custodialWalletService.verifySession(sessionToken);
    if (!session) {
      return res.status(200).json({ authenticated: false });
    }
    
    // Obtener detalles de la billetera
    const walletInfo = await custodialWalletService.getWalletDetails(session.address);
    
    // Devolver información de la sesión
    res.status(200).json({
      authenticated: true,
      walletInfo,
    });
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    res.status(500).json({ error: 'Error al verificar la sesión' });
  }
});

// Ruta para cerrar sesión
custodialWalletRouter.post('/logout', async (req, res) => {
  try {
    // Obtener el token de sesión de las cookies o headers
    const sessionToken = req.cookies?.custodialSession || req.headers['x-custodial-session'];
    
    if (sessionToken) {
      // Cerrar sesión
      await custodialWalletService.logout(sessionToken);
    }
    
    // Eliminar cookie de sesión
    res.clearCookie('custodialSession');
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: 'Error al cerrar la sesión' });
  }
});

// Ruta para validar una billetera custodiada (usado por el wallet provider)
custodialWalletRouter.get('/:address/validate', async (req, res) => {
  try {
    const { address } = req.params;
    // Normalizar la dirección del wallet para asegurar consistencia
    const normalizedAddress = address.toLowerCase();
    
    // Obtener el token de sesión de múltiples fuentes posibles
    // Restauramos la obtención del token de todas las fuentes
    const sessionToken = req.query.sessionToken as string || 
                         req.headers['x-custodial-session'] as string || 
                         req.cookies?.custodialSession ||
                         req.body?.sessionToken;
    
    console.log('[validate] Iniciando validación para dirección:', {
      original: address,
      normalizada: normalizedAddress,
      tieneToken: Boolean(sessionToken),
      tokenLength: sessionToken ? (sessionToken as string).length : 0,
      fuente: sessionToken ? 
          (req.cookies?.custodialSession ? 'cookie' : 
          req.headers['x-custodial-session'] ? 'header' : 
          req.query.sessionToken ? 'query' : 
          req.body?.sessionToken ? 'body' : 'unknown') : 'ninguna'
    });
    
    // Caso especial para billetera de prueba - solo si no hay un token real
    // Y la dirección específicamente es la de prueba (comparación exacta)
    if (normalizedAddress === '0xc2dd65af9fed4a01fb8764d65c591077f02c6497' && (!sessionToken || sessionToken === 'test-session-token-123456789')) {
      console.log('[validate] Detectada billetera de prueba, generando respuesta especial');
      return res.status(200).json({ 
        valid: true, 
        address: normalizedAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),  // 7 días
        testing: true
      });
    }
    
    if (!sessionToken) {
      console.log('[validate] No se proporcionó token de sesión para', normalizedAddress);
      return res.status(401).json({ error: 'No se proporcionó token de sesión', valid: false });
    }
    
    // Verificar la sesión - esta vez con el token real proporcionado
    console.log('[validate] Verificando sesión con token real de longitud:', (sessionToken as string).length);
    const session = await custodialWalletService.verifySession(sessionToken as string);
    
    if (!session) {
      console.log('[validate] Sesión inválida o expirada para', normalizedAddress);
      return res.status(401).json({ error: 'Sesión inválida o expirada', valid: false });
    }
    
    // Verificar que la dirección coincida con la de la sesión (comparando las versiones normalizadas)
    // Normalizamos ambas direcciones para evitar problemas de mayúsculas/minúsculas
    const normalizedSessionAddress = session.address.toLowerCase();
    if (normalizedAddress !== normalizedSessionAddress) {
      console.log('[validate] La dirección solicitada no coincide con la sesión:', {
        solicitada: normalizedAddress,
        enSesión: normalizedSessionAddress,
        original: address,
        sessionOriginal: session.address,
        sessionToken: sessionToken
      });
      return res.status(403).json({ 
        error: 'La dirección no coincide con la sesión', 
        valid: false,
        requestedAddress: address,
        sessionAddress: session.address
      });
    }
    
    console.log('[validate] Sesión validada correctamente para', address);
    
    // La sesión contiene ya la dirección normalizada (de la función verifySession)
    res.status(200).json({ 
      valid: true, 
      address: session.address, // Ya está normalizada desde verifySession
      expiresAt: session.expiresAt
    });
  } catch (error) {
    console.error('Error al validar billetera custodiada:', error);
    res.status(500).json({ error: 'Error al validar la billetera custodiada', valid: false });
  }
});

// Ruta para obtener detalles de billetera
custodialWalletRouter.get('/:address', verifySession, async (req, res) => {
  try {
    const { address } = req.params;
    
    // Verificar que la dirección coincida con la de la sesión (sin distinguir mayúsculas/minúsculas)
    if (!req.walletSession || address.toLowerCase() !== req.walletSession.address.toLowerCase()) {
      console.log('[getDetails] La dirección solicitada no coincide con la sesión:', {
        solicitada: address,
        enSesión: req.walletSession?.address || 'No hay sesión'
      });
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta billetera' });
    }
    
    // Obtener detalles de la billetera
    const walletInfo = await custodialWalletService.getWalletDetails(address);
    
    if (!walletInfo) {
      return res.status(404).json({ error: 'Billetera no encontrada' });
    }
    
    res.status(200).json(walletInfo);
  } catch (error) {
    console.error('Error al obtener detalles de billetera:', error);
    res.status(500).json({ error: 'Error al obtener los detalles de la billetera' });
  }
});

// Ruta para iniciar recuperación de billetera
custodialWalletRouter.post('/recovery/request', async (req, res) => {
  try {
    // Validar datos de entrada
    const validationResult = recoveryRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        details: validationResult.error.format()
      });
    }
    
    const { email } = validationResult.data;
    
    // Iniciar recuperación
    const recovery = await custodialWalletService.initiateRecovery(email);
    
    // Construir enlace de recuperación
    const baseUrl = process.env.APP_URL || `https://${req.get('host')}`;
    const resetLink = `${baseUrl}/reset-password?token=${recovery.recoveryToken}`;
    
    // Leer plantilla de email
    // En ESM, __dirname apunta a la carpeta custodial-wallet, necesitamos ir un nivel arriba
    const templatePath = path.join(__dirname, "..", "email-templates", "password-recovery.html");
    
    console.log('[Password Recovery] Reading template from path:', templatePath);
    let emailTemplate = fs.readFileSync(templatePath, "utf8");
    
    // Reemplazar variables en la plantilla
    emailTemplate = emailTemplate.replace(/\[RECOVERY_CODE\]/g, recovery.recoveryToken.substring(0, 6).toUpperCase());
    
    // Enviar email
    console.log('[Password Recovery] Sending recovery email to:', email);
    // DEBUG: Mostrar contenido del email en consola
    console.log("====== CONTENIDO DEL EMAIL DE RECUPERACIÓN ======");
    console.log(`Para: ${email}`);
    console.log(`Asunto: Recuperación de acceso a tu billetera WayBank`);
    console.log(`De: ${process.env.SMTP_FROM || "info@elysiumdubai.net"}`);
    console.log("= CUERPO HTML =");
    console.log(emailTemplate);
    console.log("=================================================");
    
    // Enviar email usando el servicio de email configurado (SMTP o Resend)
    // Con SMTP podemos enviar a cualquier dirección, con Resend solo a direcciones verificadas
    const emailSent = await emailService.sendEmail({
      to: email,
      subject: "Recuperación de acceso a tu billetera WayBank",
      html: emailTemplate,
      from: process.env.SMTP_FROM || "info@elysiumdubai.net"
    });
    
    if (!emailSent) {
      console.error(`[Password Recovery] Error al enviar email de recuperación a: ${email}`);
    } else {
      console.log(`[Password Recovery] Email de recuperación enviado con éxito a: ${email}`);
    }
    
    // Devolver respuesta exitosa (por seguridad, no revelamos si el email existe)
    res.status(200).json({
      success: true,
      message: 'Si el email existe, se ha enviado un enlace de recuperación',
      // Solo incluimos el token en desarrollo o para pruebas
      ...(process.env.NODE_ENV !== 'production' ? { recoveryInfo: recovery } : {}),
    });
  } catch (error) {
    console.error('Error al solicitar recuperación:', error);
    // Siempre devolver éxito por seguridad, para no revelar si el email existe
    res.status(200).json({
      success: true,
      message: 'Si el email existe, se ha enviado un enlace de recuperación',
    });
  }
});

// Ruta para verificar token de recuperación
custodialWalletRouter.get('/recovery/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verificar token
    const recovery = await custodialWalletService.verifyRecoveryToken(token);
    
    if (!recovery) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    res.status(200).json({
      success: true,
      valid: true,
      expiresAt: recovery.expiresAt,
    });
  } catch (error) {
    console.error('Error al verificar token de recuperación:', error);
    res.status(500).json({ error: 'Error al verificar token de recuperación' });
  }
});

// Ruta para restablecer contraseña con token
custodialWalletRouter.post('/recovery/reset', async (req, res) => {
  try {
    // Validar datos de entrada
    const validationResult = resetPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de restablecimiento inválidos',
        details: validationResult.error.format()
      });
    }
    
    const { token, password } = validationResult.data;
    
    // Restablecer contraseña
    const result = await custodialWalletService.resetPassword(token, password);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

// Ruta para firmar un mensaje
custodialWalletRouter.post('/sign-message', verifySession, async (req, res) => {
  try {
    // Validar datos de entrada
    const validationResult = signMessageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de firma inválidos',
        details: validationResult.error.format()
      });
    }
    
    const { address, message } = validationResult.data;
    
    // Verificar que la dirección coincida con la de la sesión (sin distinguir mayúsculas/minúsculas)
    if (!req.walletSession || address.toLowerCase() !== req.walletSession.address.toLowerCase()) {
      console.log('[signMessage] La dirección solicitada no coincide con la sesión:', {
        solicitada: address,
        enSesión: req.walletSession?.address || 'No hay sesión'
      });
      return res.status(403).json({ error: 'No tienes permiso para firmar con esta billetera' });
    }
    
    // Obtener la sesión activa
    if (!req.walletSession || !req.walletSession.token) {
      return res.status(401).json({ error: 'No se proporcionó token de sesión' });
    }
    
    // Firmar mensaje con el token de sesión
    let sessionToken = req.walletSession.token;
    if (!sessionToken) {
      // Si no tenemos el token en el objeto de sesión, lo intentamos obtener de otras fuentes
      sessionToken = req.cookies?.custodialSession || 
                  req.headers['x-custodial-session'] as string || 
                  req.query.sessionToken as string || 
                  req.body?.sessionToken;
                  
      if (!sessionToken) {
        return res.status(401).json({ error: 'No se pudo obtener el token de sesión' });
      }
    }
    
    const signature = await custodialWalletService.signMessage(
      address, 
      message, 
      sessionToken
    );
    
    res.status(200).json({ 
      success: true,
      signature,
      message,
      address
    });
  } catch (error) {
    console.error('Error al firmar mensaje:', error);
    res.status(500).json({ error: 'Error al firmar el mensaje' });
  }
});

// Ruta para cambiar la contraseña de una wallet
custodialWalletRouter.post('/change-password', async (req, res) => {
  try {
    // Obtener el token de sesión del cuerpo, las cookies o headers
    const sessionToken = req.body?.sessionToken || 
                         req.cookies?.custodialSession || 
                         req.headers['x-custodial-session'] || 
                         req.query.sessionToken;
    
    console.log('[change-password] Acceso a cambio de contraseña:', {
      hasSessionToken: !!sessionToken,
      tokenFrom: sessionToken ? 
        (req.body?.sessionToken ? 'body' : 
         req.cookies?.custodialSession ? 'cookie' : 
         req.headers['x-custodial-session'] ? 'header' : 
         req.query.sessionToken ? 'query' : 'unknown') : 'none'
    });
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No hay sesión activa para cambiar la contraseña' });
    }
    
    // Verificar la sesión manualmente
    const session = await custodialWalletService.verifySession(sessionToken as string);
    if (!session) {
      return res.status(401).json({ error: 'Sesión inválida o expirada' });
    }
    
    // Validar datos de entrada
    const validationResult = changePasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de cambio de contraseña inválidos',
        details: validationResult.error.format()
      });
    }
    
    const { currentPassword, newPassword } = validationResult.data;
    
    // Cambiar la contraseña
    const success = await custodialWalletService.changePassword(
      session.address,
      currentPassword,
      newPassword
    );
    
    if (!success) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }
    
    // Enviar email de notificación (opcional)
    try {
      const walletInfo = await custodialWalletService.getWalletDetails(session.address);
      if (walletInfo && walletInfo.email) {
        // Enviar notificación por email del cambio de contraseña
        await emailService.sendEmail({
          to: walletInfo.email,
          subject: "Tu contraseña de WayBank ha sido actualizada",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
              <h2 style="color: #333;">Cambio de contraseña exitoso</h2>
              <p>Hola,</p>
              <p>Te informamos que la contraseña de tu billetera WayBank ha sido actualizada correctamente.</p>
              <p>Si no realizaste este cambio, por favor contacta inmediatamente a nuestro equipo de soporte.</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">Este es un mensaje automático, por favor no respondas a este correo.</p>
            </div>
          `,
          from: process.env.SMTP_FROM || "info@elysiumdubai.net"
        });
      }
    } catch (emailError) {
      // No interrumpimos el flujo principal si falla el envío del email
      console.error('Error al enviar email de notificación de cambio de contraseña:', emailError);
    }
    
    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});

// Schema para validar exportación de clave privada
const exportPrivateKeySchema = z.object({
  password: z.string().min(1, "Contraseña requerida"),
});

/**
 * Ruta para exportar la clave privada de una wallet custodiada
 * POST /api/custodial-wallet/export-private-key
 *
 * Requiere:
 * - sessionToken: Token de sesión válido
 * - password: Contraseña del usuario para verificación adicional
 *
 * Esta operación es sensible y requiere doble autenticación:
 * 1. Sesión activa válida
 * 2. Verificación de contraseña
 */
custodialWalletRouter.post('/export-private-key', async (req, res) => {
  try {
    // Obtener el token de sesión
    const sessionToken = req.body?.sessionToken ||
                         req.cookies?.custodialSession ||
                         req.headers['x-custodial-session'];

    if (!sessionToken) {
      return res.status(401).json({
        error: 'No se proporcionó token de sesión',
        code: 'NO_SESSION'
      });
    }

    // Validar datos de entrada
    const validation = exportPrivateKeySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Contraseña requerida para exportar la clave privada',
        code: 'PASSWORD_REQUIRED'
      });
    }

    const { password } = validation.data;

    // Verificar sesión y obtener la dirección de la wallet
    const session = await custodialWalletService.verifySession(sessionToken);

    if (!session || !session.valid) {
      return res.status(401).json({
        error: 'Sesión inválida o expirada. Por favor, inicia sesión nuevamente.',
        code: 'INVALID_SESSION'
      });
    }

    // Exportar la clave privada (verifica la contraseña internamente)
    const result = await custodialWalletService.exportPrivateKey(session.address, password);

    if (!result) {
      return res.status(401).json({
        error: 'Contraseña incorrecta. Verifica tu contraseña e inténtalo de nuevo.',
        code: 'INVALID_PASSWORD'
      });
    }

    console.log(`[export-private-key] Clave privada exportada exitosamente para: ${session.address}`);

    res.status(200).json({
      success: true,
      privateKey: result.privateKey,
      address: result.address,
      warning: 'IMPORTANTE: Guarda esta clave privada de forma segura. Nunca la compartas con nadie. Cualquier persona con acceso a esta clave puede controlar tu wallet.'
    });

  } catch (error) {
    console.error('Error al exportar clave privada:', error);
    res.status(500).json({
      error: 'Error al exportar la clave privada. Por favor, inténtalo de nuevo.',
      code: 'EXPORT_ERROR'
    });
  }
});

// Función asincrónica para registrar las rutas y ejecutar migraciones
export async function registerCustodialWalletRoutes(app: express.Express) {
  try {
    // Ejecutar migración de tablas al iniciar
    console.log('Ejecutando migración automática de tablas de wallet custodiado...');
    const result = await runCustodialWalletMigration();
    
    if (result) {
      console.log('Migración de tablas de wallet custodiado completada con éxito');
    } else {
      console.warn('Migración de tablas de wallet custodiado no fue exitosa');
    }
  } catch (error) {
    console.error('Error en la migración automática de tablas de wallet custodiado:', error);
    // No fallamos el inicio del servidor, continuamos aunque haya errores
  }

  // Registrar rutas
  app.use('/api/custodial-wallet', custodialWalletRouter);
}

export default custodialWalletRouter;