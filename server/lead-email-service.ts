import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import axios from 'axios';

interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

/**
 * Servicio simplificado para enviar emails de notificaciones de leads
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    console.log('[Lead Email Service] Enviando email');
    console.log(`- De: ${emailData.from || process.env.SMTP_FROM || 'noreply@waybank.info'}`);
    console.log(`- Para: ${emailData.to}`);
    console.log(`- Asunto: ${emailData.subject}`);
    
    // Primero intentamos con SMTP si está configurado
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    
    if (smtpHost && smtpPort && smtpUser && smtpPassword) {
      try {
        console.log(`[Lead Email Service] Enviando vía SMTP con host ${smtpHost} y puerto ${smtpPort}`);
        
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true para 465, false para otros puertos
          auth: {
            user: smtpUser,
            pass: smtpPassword,
          },
          tls: {
            // No verificar certificado para evitar errores de certificados no coincidentes
            rejectUnauthorized: false
          }
        });
        
        const fromEmail = emailData.from || process.env.SMTP_FROM || 'noreply@waybank.info';
        
        const info = await transporter.sendMail({
          from: fromEmail,
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text || "Este correo requiere un cliente de correo compatible con HTML",
          html: emailData.html
        });
        
        console.log('[Lead Email Service] Email enviado correctamente vía SMTP!', info.messageId);
        return true;
      } catch (smtpError) {
        console.error('[Lead Email Service] Error enviando email vía SMTP:', smtpError);
        // Si falla SMTP, intentamos con Resend
      }
    }
    
    // Si SMTP falla o no está configurado, intentamos con Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        console.log('[Lead Email Service] Enviando vía Resend API');
        
        const fromEmail = emailData.from || process.env.SMTP_FROM || 'noreply@waybank.info';
        
        const response = await axios.post(
          'https://api.resend.com/emails',
          {
            from: fromEmail,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text || "Este correo requiere un cliente de correo compatible con HTML"
          },
          {
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.status === 200 || response.status === 201) {
          console.log('[Lead Email Service] Email enviado correctamente vía Resend!', response.data);
          return true;
        } else {
          console.error('[Lead Email Service] Error respuesta de Resend API:', response.status, response.statusText);
          return false;
        }
      } catch (resendError: any) {
        console.error('[Lead Email Service] Error enviando email vía Resend API:', resendError.message);
        if (resendError.response) {
          console.error('Datos de respuesta:', resendError.response.data);
          console.error('Estado de respuesta:', resendError.response.status);
        }
        return false;
      }
    }
    
    console.warn('[Lead Email Service] No hay configuración de email disponible');
    return false;
  } catch (error) {
    console.error('[Lead Email Service] Error general enviando email:', error);
    return false;
  }
}