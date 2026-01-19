import axios from 'axios';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import {
  EmailLanguage,
  getEmailLanguage,
  isRTL,
  feeCollectionTranslations,
  newPositionTranslations
} from './email-templates/email-translations';

interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

/**
 * Servicio para envío de correos electrónicos utilizando SMTP o la API de Resend
 */
class EmailService {
  private initialized: boolean = false;
  private resendApiKey: string = '';
  private fromEmail: string = '';
  private smtpTransporter: any = null;
  private preferSMTP: boolean = false;
  private alternativeTransporters: any[] = [];

  constructor() {
    this.initialized = false;
    this.initialize();
  }
  
  /**
   * Método genérico para enviar cualquier tipo de correo
   * 
   * @param emailData Datos del correo a enviar (destinatario, asunto, contenido)
   * @returns Promesa que se resuelve a true si el correo se envió correctamente
   */
  public async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Si no está inicializado, intentar inicializar
      if (!this.initialized) {
        const initialized = this.initialize();
        if (!initialized) {
          console.error('[Email Service] Could not initialize, email will not be sent');
          return false;
        }
      }
      
      const fromEmail = emailData.from || this.fromEmail;
      
      // Log para depuración
      console.log('[Email Service] Sending email');
      console.log(`- From: ${fromEmail}`);
      console.log(`- To: ${emailData.to}`);
      console.log(`- Subject: ${emailData.subject}`);
      
      // Si tenemos configuración SMTP y la preferimos, usar SMTP
      if (this.preferSMTP && this.smtpTransporter) {
        return await this.sendEmailSMTP(emailData, fromEmail);
      } else {
        // Si no, intentar con Resend
        return await this.sendEmailResend(emailData, fromEmail);
      }
    } catch (error) {
      console.error('[Email Service] General error in sendEmail:', error);
      return false;
    }
  }

  /**
   * Enviar email usando SMTP con timeout y múltiples configuraciones alternativas
   */
  private async sendEmailSMTP(emailData: EmailData, fromEmail: string, transporterIndex: number = 0): Promise<boolean> {
    // Lista de configuraciones SMTP a probar - IP directa primero para evitar Cloudflare
    const smtpConfigs = [
      // IP directa del servidor de correo (bypass Cloudflare)
      { host: '185.68.111.228', port: 465, name: 'Direct IP SSL' },
      // IP directa con puerto 587
      { host: '185.68.111.228', port: 587, name: 'Direct IP STARTTLS' },
      // Configuración desde env vars como respaldo
      { 
        host: process.env.SMTP_HOST || 'elysiumdubai.net', 
        port: parseInt(process.env.SMTP_PORT || '465'),
        name: 'Primary'
      },
    ];
    
    const config = smtpConfigs[transporterIndex];
    if (!config) {
      console.error('[Email Service] All SMTP configurations exhausted');
      // Intentar Resend como último recurso
      const resendKey = this.resendApiKey || process.env.RESEND_API_KEY;
      if (resendKey && resendKey.length > 0) {
        this.resendApiKey = resendKey;
        console.log('[Email Service] Trying Resend as final fallback...');
        return await this.sendEmailResend(emailData, fromEmail);
      }
      return false;
    }
    
    try {
      console.log(`[Email Service] Trying SMTP config ${transporterIndex + 1}/${smtpConfigs.length}: ${config.name}`);
      console.log(`[Email Service] Host: ${config.host}, Port: ${config.port}`);
      
      // Crear transportador dinámico para esta configuración
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: {
          user: process.env.SMTP_USER || 'noreply@elysiumdubai.net',
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2'
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });
      
      // Crear promesa con timeout de 12 segundos
      const sendWithTimeout = new Promise<any>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`SMTP timeout after 12 seconds (${config.name})`));
        }, 12000);
        
        transporter.sendMail({
          from: fromEmail,
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text || "Este correo requiere un cliente de correo compatible con HTML",
          html: emailData.html
        }).then((info: any) => {
          clearTimeout(timeout);
          resolve(info);
        }).catch((err: any) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
      
      const info = await sendWithTimeout;
      
      console.log(`[Email Service] Email sent successfully via SMTP (${config.name})!`, info.messageId);
      if (info.accepted?.length) console.log('[Email Service] Accepted recipients:', info.accepted);
      return true;
    } catch (error: any) {
      console.error(`[Email Service] SMTP config ${config.name} failed:`, error.message || error);
      
      // Intentar siguiente configuración
      if (transporterIndex + 1 < smtpConfigs.length) {
        console.log('[Email Service] Trying next SMTP configuration...');
        return await this.sendEmailSMTP(emailData, fromEmail, transporterIndex + 1);
      }
      
      // Si todas las configuraciones SMTP fallan, intentar Resend
      const resendKey = this.resendApiKey || process.env.RESEND_API_KEY;
      console.log('[Email Service] All SMTP configs failed. Resend available:', resendKey ? 'YES' : 'NO');
      if (resendKey && resendKey.length > 0) {
        this.resendApiKey = resendKey;
        console.log('[Email Service] Trying Resend as fallback...');
        return await this.sendEmailResend(emailData, fromEmail);
      }
      return false;
    }
  }

  /**
   * Enviar email usando Resend API
   */
  private async sendEmailResend(emailData: EmailData, fromEmail: string, useDefaultSender: boolean = false): Promise<boolean> {
    try {
      console.log('[Email Service] Sending via Resend API...');
      
      // Si useDefaultSender es true o el dominio no está verificado, usar el remitente por defecto de Resend
      const resendFrom = useDefaultSender ? 'WayBank <onboarding@resend.dev>' : fromEmail;
      console.log(`[Email Service] Sending email via Resend, from: ${resendFrom}`);
      
      // Enviar el correo usando la API de Resend
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: resendFrom,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text || "Este correo requiere un cliente de correo compatible con HTML"
        },
        {
          headers: {
            'Authorization': `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Verificar si la respuesta es exitosa
      if (response.status === 200 || response.status === 201) {
        console.log('[Email Service] Email sent successfully via Resend!', response.data);
        return true;
      } else {
        console.error('[Email Service] Error response from Resend API:', response.status, response.statusText);
        return false;
      }
    } catch (apiError: any) {
      console.error('[Email Service] Error sending email via Resend API:', apiError.message);
      if (apiError.response) {
        console.error('Response data:', apiError.response.data);
        console.error('Response status:', apiError.response.status);
        
        // Si el error es 403 por dominio no verificado y no estamos usando el remitente por defecto, reintentar con él
        if (apiError.response.status === 403 && !useDefaultSender && 
            apiError.response.data?.message?.includes('domain is not verified')) {
          console.log('[Email Service] Domain not verified, retrying with Resend default sender...');
          return await this.sendEmailResend(emailData, fromEmail, true);
        }
      }
      
      // Si falla Resend y tenemos SMTP como respaldo, intentar con SMTP (solo si no es loop infinito)
      if (this.smtpTransporter && !useDefaultSender) {
        console.log('[Email Service] Falling back to SMTP...');
        return await this.sendEmailSMTP(emailData, fromEmail);
      }
      
      return false;
    }
  }

  /**
   * Inicializa el servicio con SMTP y Resend API
   */
  public initialize(): boolean {
    try {
      // Comprobar configuración SMTP
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
      const smtpUser = process.env.SMTP_USER;
      const smtpPassword = process.env.SMTP_PASSWORD;
      
      // Comprobar configuración Resend
      const resendApiKey = process.env.RESEND_API_KEY;
      
      // Configurar email de origen
      this.fromEmail = process.env.SMTP_FROM || 'WayBank <info@elysiumdubai.net>';
      
      // Si tenemos configuración SMTP, crear el transportador
      if (smtpHost && smtpPort && smtpUser && smtpPassword) {
        console.log(`[Email Service] Setting up SMTP with host ${smtpHost} and port ${smtpPort}`);
        this.smtpTransporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPassword,
          },
          tls: {
            // No verificar certificado para evitar errores de certificados no coincidentes
            rejectUnauthorized: false
          },
          debug: true, // Activar logs de depuración
          logger: true // Mostrar logs en la consola
        });
        
        this.preferSMTP = true;
        this.initialized = true;
        console.log('[Email Service] Initialized successfully with SMTP');
      } 
      
      // Si también tenemos Resend, configurarlo como respaldo
      if (resendApiKey) {
        this.resendApiKey = resendApiKey;
        this.initialized = true;
        console.log('[Email Service] Initialized successfully with Resend API (as backup)');
      }
      
      if (!this.initialized) {
        console.warn('[Email Service] Warning: No email configuration found');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[Email Service] Error initializing email service:', error);
      return false;
    }
  }

  /**
   * Envía un correo electrónico de notificación para una nueva posición de liquidez
   * utilizando SMTP o la API de Resend
   *
   * @param positionData Datos de la posición creada
   * @param userInfo Información del usuario
   * @param language Idioma del usuario (opcional, por defecto 'en')
   * @returns Promesa que se resuelve a true si el correo se envió correctamente
   */
  public async sendNewPositionEmail(positionData: any, userInfo: any, language?: string): Promise<boolean> {
    try {
      const lang = getEmailLanguage(language || userInfo.language);
      const translations = newPositionTranslations[lang];

      // Generar el contenido HTML del correo
      const html = this.generateNewPositionEmailHTML(positionData, userInfo, lang);
      const toEmail = userInfo.email || 'test@example.com'; // Email del usuario o uno de prueba
      const subject = translations.subject;

      // Usar el método genérico para enviar el correo
      return await this.sendEmail({
        to: toEmail,
        subject: subject,
        html: html
      });
    } catch (error) {
      console.error('[Email Service] General error in sendNewPositionEmail:', error);
      return false;
    }
  }

  /**
   * Envía un correo electrónico de notificación para la recolección de fees
   * utilizando SMTP o la API de Resend
   *
   * @param collectionData Datos de la recolección de fees
   * @param userInfo Información del usuario
   * @param positionData Datos de la posición asociada
   * @param language Idioma del usuario (opcional, por defecto 'en')
   * @returns Promesa que se resuelve a true si el correo se envió correctamente
   */
  public async sendFeeCollectionEmail(collectionData: any, userInfo: any, positionData: any, language?: string): Promise<boolean> {
    try {
      const lang = getEmailLanguage(language || userInfo.language);
      const translations = feeCollectionTranslations[lang];

      // Generar el contenido HTML del correo para el usuario
      const htmlUser = this.generateFeeCollectionEmailHTML(collectionData, userInfo, positionData, lang);

      // Generar el contenido HTML para el correo al administrador (siempre en inglés)
      const htmlAdmin = this.generateAdminFeeCollectionEmailHTML(collectionData, userInfo, positionData);

      // Email de destino para el usuario
      const toEmail = userInfo.email || process.env.ADMIN_EMAIL || 'info@elysiumdubai.net';

      // Email de destino para el administrador
      const adminEmail = process.env.ADMIN_EMAIL || 'info@elysiumdubai.net';

      // Asunto para el correo al usuario (en su idioma)
      const subject = translations.subject;

      // Asunto para el correo al administrador con info identificativa (siempre en inglés)
      const adminSubject = `Fee Collection Alert - User (${userInfo.walletAddress})`;

      // Enviar correo al usuario
      const userEmailSent = await this.sendEmail({
        to: toEmail,
        subject: subject,
        html: htmlUser
      });

      // Enviar correo al administrador
      const adminEmailSent = await this.sendEmail({
        to: adminEmail,
        subject: adminSubject,
        html: htmlAdmin
      });

      // Solo necesitamos que uno de los dos correos se envíe correctamente
      return userEmailSent || adminEmailSent;
    } catch (error) {
      console.error('[Email Service] General error in sendFeeCollectionEmail:', error);
      return false;
    }
  }
  
  /**
   * Genera el HTML para el correo de notificación al administrador sobre recolección de fees
   *
   * @param collectionData Datos de la recolección
   * @param userInfo Información del usuario
   * @param positionData Datos de la posición asociada
   * @returns String HTML formateado
   */
  private generateAdminFeeCollectionEmailHTML(collectionData: any, userInfo: any, positionData: any): string {
    const dateTime = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Dubai'
    });

    // Formatear cantidades monetarias con 2 decimales
    const formatCurrency = (amount: number | string | undefined) => {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);
      if (isNaN(numAmount)) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numAmount);
    };

    // Obtener valores de los datos o valores por defecto
    const amount = collectionData?.amount || 0;
    const formattedAmount = formatCurrency(amount);
    const poolName = positionData?.poolName || 'Unknown Pool';
    const poolTokens = positionData?.poolPair || 'Unknown Pair';
    const positionId = positionData?.id || 'N/A';
    const walletAddress = userInfo?.walletAddress || 'Unknown';
    const ipAddress = userInfo?.ipAddress || 'Unknown';

    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fee Collection Alert - WayPool Admin</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">WayPool Admin Alert</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Fee Collection Detected</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #334155; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">Amount Collected</p>
                    <p style="color: #22c55e; font-size: 32px; font-weight: 700; margin: 0;">${formattedAmount}</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155;">Position ID</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: right; border-bottom: 1px solid #334155;">#${positionId}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155;">Pool</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: right; border-bottom: 1px solid #334155;">${poolName}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155;">Token Pair</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: right; border-bottom: 1px solid #334155;">${poolTokens}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155;">Date/Time (Dubai)</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: right; border-bottom: 1px solid #334155;">${dateTime}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155;">Wallet</td><td style="padding: 12px 0; color: #3b82f6; font-size: 12px; text-align: right; border-bottom: 1px solid #334155; font-family: monospace;">${walletAddress}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">IP Address</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: right;">${ipAddress}</td></tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px; border-top: 1px solid #334155; text-align: center;">
              <p style="color: #64748b; font-size: 11px; margin: 0;">This is an automated admin notification from WayPool.</p>
              <p style="color: #64748b; font-size: 11px; margin: 8px 0 0 0;">&copy; ${year} Elysium Media FZCO. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  /**
   * Genera el HTML para el correo de recolección de fees
   *
   * @param collectionData Datos de la recolección
   * @param userInfo Información del usuario
   * @param positionData Datos de la posición asociada
   * @param lang Idioma del email
   * @returns String HTML formateado
   */
  private generateFeeCollectionEmailHTML(collectionData: any, userInfo: any, positionData: any, lang: EmailLanguage = 'en'): string {
    const t = feeCollectionTranslations[lang];
    const rtl = isRTL(lang);
    const dir = rtl ? 'rtl' : 'ltr';
    const textAlign = rtl ? 'right' : 'left';
    const textAlignOpposite = rtl ? 'left' : 'right';

    const dateTime = new Date().toLocaleString(lang === 'ar' ? 'ar-AE' : lang === 'zh' ? 'zh-CN' : lang === 'hi' ? 'hi-IN' : lang === 'ru' ? 'ru-RU' : `${lang}-${lang.toUpperCase()}`, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Dubai'
    });

    // Formatear cantidades monetarias con 2 decimales
    const formatCurrency = (amount: number | string | undefined) => {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);
      if (isNaN(numAmount)) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numAmount);
    };

    // Obtener valores de los datos o valores por defecto
    const amount = collectionData?.amount || 0;
    const formattedAmount = formatCurrency(amount);
    const poolName = positionData?.poolName || 'Liquidity Pool';
    const poolTokens = positionData?.poolPair || 'Token Pair';
    const positionId = positionData?.id || 'N/A';
    const transactionId = collectionData?.transactionId || 'N/A';

    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0f172a; direction: ${dir};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">WayPool</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${t.subtitle}</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: ${textAlign};">
                ${t.greeting}
              </p>
              <!-- Amount Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%); border-radius: 12px; margin-bottom: 24px; border: 1px solid #334155;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">${t.amountLabel}</p>
                    <p style="color: #22c55e; font-size: 36px; font-weight: 700; margin: 0;">${formattedAmount}</p>
                  </td>
                </tr>
              </table>
              <!-- Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.positionId}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155;">#${positionId}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.pool}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155;">${poolName}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.tokenPair}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155;">${poolTokens}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.dateTime}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155;">${dateTime}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; text-align: ${textAlign};">${t.transactionId}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 12px; text-align: ${textAlignOpposite}; font-family: monospace;">${transactionId}</td></tr>
              </table>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 24px auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); border-radius: 8px;">
                    <a href="https://waypool.net/dashboard" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">${t.ctaButton}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Crypto Disclaimer -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #334155; border-radius: 8px; border-${rtl ? 'right' : 'left'}: 3px solid #f59e0b;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="color: #f59e0b; font-size: 11px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; text-align: ${textAlign};">Risk Disclaimer</p>
                    <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; text-align: ${textAlign};">${t.disclaimer}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 24px; border-top: 1px solid #334155;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 16px;">
                    <p style="color: #e2e8f0; font-size: 14px; font-weight: 600; margin: 0;">Elysium Media FZCO</p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 16px;">
                    <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.6;">License No: 58510 | TRN: 104956612600003<br>Free Zone Company - Dubai, UAE</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 16px;">
                    <a href="https://waypool.net/terms" style="color: #7c3aed; font-size: 12px; text-decoration: none; margin: 0 8px;">Terms</a>
                    <span style="color: #334155;">|</span>
                    <a href="https://waypool.net/privacy" style="color: #7c3aed; font-size: 12px; text-decoration: none; margin: 0 8px;">Privacy</a>
                    <span style="color: #334155;">|</span>
                    <a href="mailto:info@elysiumdubai.net" style="color: #7c3aed; font-size: 12px; text-decoration: none; margin: 0 8px;">Contact</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <a href="mailto:unsubscribe@elysiumdubai.net?subject=Unsubscribe" style="color: #64748b; font-size: 11px; text-decoration: underline;">Unsubscribe from these emails</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #64748b; font-size: 11px; margin: 0;">&copy; ${year} Elysium Media FZCO. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  /**
   * Genera el HTML para el correo de una nueva posición de liquidez
   *
   * @param positionData Datos de la posición
   * @param userInfo Información del usuario
   * @param lang Idioma del email
   * @returns String HTML formateado
   */
  private generateNewPositionEmailHTML(positionData: any, userInfo: any, lang: EmailLanguage = 'en'): string {
    const t = newPositionTranslations[lang];
    const rtl = isRTL(lang);
    const dir = rtl ? 'rtl' : 'ltr';
    const textAlign = rtl ? 'right' : 'left';
    const textAlignOpposite = rtl ? 'left' : 'right';

    const dateTime = new Date().toLocaleString(lang === 'ar' ? 'ar-AE' : lang === 'zh' ? 'zh-CN' : lang === 'hi' ? 'hi-IN' : lang === 'ru' ? 'ru-RU' : `${lang}-${lang.toUpperCase()}`, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Dubai'
    });

    // Formatear cantidades monetarias con 2 decimales
    const formatCurrency = (amount: number | string | undefined) => {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);
      if (isNaN(numAmount)) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numAmount);
    };

    // Obtener valores de los datos o valores por defecto
    const amount = positionData?.amount || positionData?.depositedUSDC || 0;
    const formattedAmount = formatCurrency(amount);
    const tokenPair = positionData?.tokenPair || positionData?.poolPair || 'USDC/ETH';
    const period = positionData?.period || '30 days';
    const apr = positionData?.estimatedAPR || positionData?.apr || 'Variable';
    const risk = positionData?.impermanentLossRisk || positionData?.risk || 'Medium';
    const positionId = positionData?.id || 'Pending';

    // Color del riesgo
    const riskColor = risk.toLowerCase().includes('low') || risk.toLowerCase().includes('bajo') ? '#22c55e' :
                      risk.toLowerCase().includes('high') || risk.toLowerCase().includes('alto') ? '#ef4444' : '#f59e0b';

    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0f172a; direction: ${dir};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">WayPool</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${t.subtitle}</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: ${textAlign};">
                ${t.greeting}
              </p>
              <!-- Amount Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%); border-radius: 12px; margin-bottom: 24px; border: 1px solid #334155;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">${t.amountLabel}</p>
                    <p style="color: #7c3aed; font-size: 36px; font-weight: 700; margin: 0;">${formattedAmount}</p>
                    <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0 0;">${tokenPair}</p>
                  </td>
                </tr>
              </table>
              <!-- Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.positionId}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155;">#${positionId}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.tokenPair}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155;">${tokenPair}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.period}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155;">${period}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.estimatedApr}</td><td style="padding: 12px 0; color: #22c55e; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155; font-weight: 600;">${apr}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.ilRisk}</td><td style="padding: 12px 0; color: ${riskColor}; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155;">${risk}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #334155; text-align: ${textAlign};">${t.status}</td><td style="padding: 12px 0; color: #22c55e; font-size: 14px; text-align: ${textAlignOpposite}; border-bottom: 1px solid #334155; font-weight: 600;">${t.statusActive}</td></tr>
                <tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px; text-align: ${textAlign};">${t.created}</td><td style="padding: 12px 0; color: #e2e8f0; font-size: 14px; text-align: ${textAlignOpposite};">${dateTime}</td></tr>
              </table>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 24px auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); border-radius: 8px;">
                    <a href="https://waypool.net/dashboard" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">${t.ctaButton}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Crypto Disclaimer -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #334155; border-radius: 8px; border-${rtl ? 'right' : 'left'}: 3px solid #f59e0b;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="color: #f59e0b; font-size: 11px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; text-align: ${textAlign};">Risk Disclaimer</p>
                    <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0; text-align: ${textAlign};">${t.disclaimer}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 24px; border-top: 1px solid #334155;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 16px;">
                    <p style="color: #e2e8f0; font-size: 14px; font-weight: 600; margin: 0;">Elysium Media FZCO</p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 16px;">
                    <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.6;">License No: 58510 | TRN: 104956612600003<br>Free Zone Company - Dubai, UAE</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 16px;">
                    <a href="https://waypool.net/terms" style="color: #7c3aed; font-size: 12px; text-decoration: none; margin: 0 8px;">Terms</a>
                    <span style="color: #334155;">|</span>
                    <a href="https://waypool.net/privacy" style="color: #7c3aed; font-size: 12px; text-decoration: none; margin: 0 8px;">Privacy</a>
                    <span style="color: #334155;">|</span>
                    <a href="mailto:info@elysiumdubai.net" style="color: #7c3aed; font-size: 12px; text-decoration: none; margin: 0 8px;">Contact</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <a href="mailto:unsubscribe@elysiumdubai.net?subject=Unsubscribe" style="color: #64748b; font-size: 11px; text-decoration: underline;">Unsubscribe from these emails</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #64748b; font-size: 11px; margin: 0;">&copy; ${year} Elysium Media FZCO. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}

// Función auxiliar para determinar la clase CSS basada en el nivel de riesgo
function getRiskClass(risk: string): string {
  if (!risk) return '';
  
  const riskLower = risk.toLowerCase();
  if (riskLower.includes('bajo') || riskLower.includes('low')) {
    return 'success';
  } else if (riskLower.includes('medio') || riskLower.includes('medium')) {
    return 'warning';
  } else if (riskLower.includes('alto') || riskLower.includes('high')) {
    return 'danger';
  }
  
  return '';
}

// Exportar una instancia única del servicio para ser reutilizada en toda la aplicación
export const emailService = new EmailService();