import axios from 'axios';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

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
   * @returns Promesa que se resuelve a true si el correo se envió correctamente
   */
  public async sendNewPositionEmail(positionData: any, userInfo: any): Promise<boolean> {
    try {
      // Generar el contenido HTML del correo
      const html = this.generateNewPositionEmailHTML(positionData, userInfo);
      const toEmail = userInfo.email || 'test@example.com'; // Email del usuario o uno de prueba
      const subject = `Nueva Posición de Liquidez - Detalles de la Operación`;
      
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
   * @returns Promesa que se resuelve a true si el correo se envió correctamente
   */
  public async sendFeeCollectionEmail(collectionData: any, userInfo: any, positionData: any): Promise<boolean> {
    try {
      // Generar el contenido HTML del correo para el usuario
      const htmlUser = this.generateFeeCollectionEmailHTML(collectionData, userInfo, positionData);
      
      // Generar el contenido HTML para el correo al administrador
      const htmlAdmin = this.generateAdminFeeCollectionEmailHTML(collectionData, userInfo, positionData);
      
      // Email de destino para el usuario
      const toEmail = userInfo.email || process.env.ADMIN_EMAIL || 'info@elysiumdubai.net';
      
      // Email de destino para el administrador
      const adminEmail = process.env.ADMIN_EMAIL || 'info@elysiumdubai.net';
      
      // Asunto para el correo al usuario
      const subject = `Recolección de Fees de Liquidez - Detalles de la Operación`;
      
      // Asunto para el correo al administrador con info identificativa
      const adminSubject = `🔔 ALERTA: Recolección de fees por usuario (${userInfo.walletAddress})`;
      
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
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    
    // Formatear cantidades monetarias con 2 decimales
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };
    
    // Obtener valores de los datos o valores por defecto
    const amount = collectionData.amount || 0;
    const formattedAmount = formatCurrency(amount);
    const poolName = positionData?.poolName || 'Pool desconocido';
    const poolTokens = positionData?.poolPair || 'Token par desconocido';
    const positionId = positionData?.id || 'ID desconocido';
    const walletAddress = userInfo?.walletAddress || 'Dirección desconocida';
    const ipAddress = userInfo?.ipAddress || 'IP desconocida';
    const userAgent = userInfo?.userAgent || 'Agente desconocido';
    
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alerta de Recolección de Fees</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0a0e17;
            color: #e6e6e6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #2a3044;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
          }
          .alert-banner {
            background-color: #e74c3c;
            color: white;
            text-align: center;
            padding: 10px;
            font-weight: bold;
            margin: 10px 0;
            border-radius: 5px;
          }
          .content {
            padding: 20px 0;
          }
          .collection-details {
            background-color: #1a1f2e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #e74c3c;
          }
          .user-details {
            background-color: #1a1f2e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #3498db;
          }
          .position-details {
            background-color: #1a1f2e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #27ae60;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #2a3044;
          }
          .detail-label {
            font-weight: bold;
            color: #8a8d93;
          }
          .detail-value {
            color: #ffffff;
            word-break: break-all;
          }
          .highlight {
            color: #e74c3c;
            font-weight: bold;
          }
          .success {
            color: #27ae60;
          }
          .warning {
            color: #e67e22;
          }
          .danger {
            color: #e74c3c;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #8a8d93;
            border-top: 1px solid #2a3044;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="font-size: 28px; color: white; margin: 0;">WayBank - Panel Administrador</h1>
            <p>Sistema de Alertas</p>
          </div>
          
          <div class="alert-banner">
            ¡ALERTA DE RECOLECCIÓN DE FEES!
          </div>
          
          <div class="content">
            <p>Se ha registrado una recolección de fees por parte de un usuario:</p>
            
            <div class="collection-details">
              <h2>Detalles de la Recolección</h2>
              
              <div class="detail-row">
                <span class="detail-label">Monto total recolectado:</span>
                <span class="detail-value highlight">${formattedAmount}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Fecha de recolección:</span>
                <span class="detail-value">${date}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Hora de recolección:</span>
                <span class="detail-value">${time}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">ID de transacción:</span>
                <span class="detail-value">${collectionData.transactionId || 'No disponible'}</span>
              </div>
            </div>
            
            <div class="user-details">
              <h2>Información del Usuario</h2>
              
              <div class="detail-row">
                <span class="detail-label">Dirección de wallet:</span>
                <span class="detail-value">${walletAddress}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Dirección IP:</span>
                <span class="detail-value">${ipAddress}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Navegador/Dispositivo:</span>
                <span class="detail-value">${userAgent}</span>
              </div>
            </div>
            
            <div class="position-details">
              <h2>Información de la Posición</h2>
              
              <div class="detail-row">
                <span class="detail-label">ID de Posición:</span>
                <span class="detail-value">${positionId}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Pool:</span>
                <span class="detail-value">${poolName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Par de tokens:</span>
                <span class="detail-value">${poolTokens}</span>
              </div>
            </div>
            
            <p>
              <b>Nota:</b> Este es un mensaje automático del sistema de alertas. 
              Por favor, verifique esta actividad en el panel de administración.
            </p>
          </div>
          
          <div class="footer">
            <p>Este es un correo electrónico automático. Por favor, no responda a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} WayBank. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera el HTML para el correo de recolección de fees
   * 
   * @param collectionData Datos de la recolección
   * @param userInfo Información del usuario
   * @param positionData Datos de la posición asociada
   * @returns String HTML formateado
   */
  private generateFeeCollectionEmailHTML(collectionData: any, userInfo: any, positionData: any): string {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    
    // Formatear cantidades monetarias con 2 decimales
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };
    
    // Obtener valores de los datos o valores por defecto
    const amount = collectionData.amount || 0;
    const formattedAmount = formatCurrency(amount);
    const poolName = positionData?.poolName || 'Pool desconocido';
    const poolTokens = positionData?.poolPair || 'Token par desconocido';
    const risk = positionData?.risk || 'Desconocido';
    
    // Función para determinar la clase CSS basada en el nivel de riesgo
    const getRiskClass = (risk: string): string => {
      switch (risk.toLowerCase()) {
        case 'bajo':
        case 'low':
          return 'success';
        case 'medio':
        case 'medium':
          return 'warning';
        case 'alto':
        case 'high':
          return 'danger';
        default:
          return '';
      }
    };
    
    const riskClass = getRiskClass(risk);
    const positionId = positionData?.id || 'ID desconocido';
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recolección de Fees</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0a0e17;
            color: #e6e6e6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #2a3044;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
          }
          .content {
            padding: 20px 0;
          }
          .collection-details {
            background-color: #1a1f2e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #3498db;
          }
          .position-details {
            background-color: #1a1f2e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #27ae60;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #2a3044;
          }
          .detail-label {
            font-weight: bold;
            color: #8a8d93;
          }
          .detail-value {
            color: #ffffff;
          }
          .highlight {
            color: #3498db;
            font-weight: bold;
          }
          .success {
            color: #27ae60;
          }
          .warning {
            color: #e67e22;
          }
          .danger {
            color: #e74c3c;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #8a8d93;
            border-top: 1px solid #2a3044;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="font-size: 28px; color: white; margin: 0;">WayBank</h1>
            <p>Recolección de Fees de Liquidez</p>
          </div>
          
          <div class="content">
            <p>Se ha completado la recolección de fees para tu posición de liquidez</p>
            
            <div class="collection-details">
              <h2>Detalles de la Recolección</h2>
              
              <div class="detail-row">
                <span class="detail-label">Monto total recolectado:</span>
                <span class="detail-value highlight">${formattedAmount}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Fecha de recolección:</span>
                <span class="detail-value">${date}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Hora de recolección:</span>
                <span class="detail-value">${time}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">ID de transacción:</span>
                <span class="detail-value">${collectionData.transactionId || 'No disponible'}</span>
              </div>
            </div>
            
            <div class="position-details">
              <h2>Información de la Posición</h2>
              
              <div class="detail-row">
                <span class="detail-label">ID de Posición:</span>
                <span class="detail-value">${positionId}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Pool:</span>
                <span class="detail-value">${poolName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Par de tokens:</span>
                <span class="detail-value">${poolTokens}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Nivel de riesgo:</span>
                <span class="detail-value ${riskClass}">${risk}</span>
              </div>
            </div>
            
            <p>
              Gracias por utilizar WayBank para la gestión de tus posiciones de liquidez.
              Puedes revisar más detalles en tu panel de control.
            </p>
          </div>
          
          <div class="footer">
            <p>Este es un correo electrónico automático. Por favor, no responda a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} WayBank. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera el HTML para el correo de una nueva posición de liquidez
   * 
   * @param positionData Datos de la posición
   * @param userInfo Información del usuario
   * @returns String HTML formateado
   */
  private generateNewPositionEmailHTML(positionData: any, userInfo: any): string {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    
    // Formatear cantidades monetarias con 2 decimales
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };
    
    // Obtener valores de los datos o valores por defecto
    const amount = positionData.amount || 0;
    const formattedAmount = formatCurrency(amount);
    const poolName = positionData.poolName || 'Pool desconocido';
    const poolTokens = positionData.poolPair || 'Token par desconocido';
    const risk = positionData.risk || 'Desconocido';
    const riskClass = getRiskClass(risk);
    const positionId = positionData.id || 'ID desconocido';
    const strategy = positionData.strategy || 'Estrategia desconocida';
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Posición de Liquidez</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #0a0e17;
            color: #e6e6e6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #2a3044;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3498db;
          }
          .content {
            padding: 20px 0;
          }
          .position-details {
            background-color: #1a1f2e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #3498db;
          }
          .strategy-details {
            background-color: #1a1f2e;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #27ae60;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #2a3044;
          }
          .detail-label {
            font-weight: bold;
            color: #8a8d93;
          }
          .detail-value {
            color: #ffffff;
          }
          .highlight {
            color: #3498db;
            font-weight: bold;
          }
          .success {
            color: #27ae60;
          }
          .warning {
            color: #e67e22;
          }
          .danger {
            color: #e74c3c;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #8a8d93;
            border-top: 1px solid #2a3044;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="font-size: 28px; color: white; margin: 0;">WayBank</h1>
            <p>Nueva Posición de Liquidez</p>
          </div>
          
          <div class="content">
            <p>Tu posición de liquidez ha sido creada con éxito.</p>
            
            <div class="position-details">
              <h2>Detalles de la Posición</h2>
              
              <div class="detail-row">
                <span class="detail-label">ID de Posición:</span>
                <span class="detail-value">${positionId}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Monto invertido:</span>
                <span class="detail-value highlight">${formattedAmount}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Pool:</span>
                <span class="detail-value">${poolName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Par de tokens:</span>
                <span class="detail-value">${poolTokens}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Nivel de riesgo:</span>
                <span class="detail-value ${riskClass}">${risk}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Fecha de creación:</span>
                <span class="detail-value">${date}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Hora de creación:</span>
                <span class="detail-value">${time}</span>
              </div>
            </div>
            
            <div class="strategy-details">
              <h2>Detalles de la Estrategia</h2>
              
              <div class="detail-row">
                <span class="detail-label">Estrategia seleccionada:</span>
                <span class="detail-value">${strategy}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Estado:</span>
                <span class="detail-value success">Activa</span>
              </div>
            </div>
            
            <p>
              Gracias por utilizar WayBank para la gestión de tus posiciones de liquidez.
              Puedes revisar más detalles en tu panel de control.
            </p>
          </div>
          
          <div class="footer">
            <p>Este es un correo electrónico automático. Por favor, no responda a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} WayBank. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
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