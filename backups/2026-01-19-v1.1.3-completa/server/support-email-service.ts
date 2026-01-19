import axios from 'axios';
import { emailService } from './email-service';
import {
  wrapEmail,
  getEmailHeader,
  getDataRow,
  COLORS,
  COMPANY_INFO,
  URLS
} from './email-templates/email-base';

/**
 * Envía un correo electrónico para notificar sobre un nuevo ticket de soporte
 *
 * @param ticketData Datos del ticket creado
 * @param userInfo Información adicional del usuario
 * @returns Promesa que se resuelve a true si el correo se envió correctamente
 */
export async function sendNewSupportTicketEmail(ticketData: any, userInfo: any): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[Support Email] Warning: RESEND_API_KEY not found in environment variables');
      return false;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Generar el contenido HTML del correo
    const html = generateSupportTicketEmailHTML(ticketData, userInfo);
    const toEmail = 'info@elysiumdubai.net'; // Destinatario (administrador)
    const subject = `Nuevo Ticket de Soporte #${ticketData.ticketNumber} - ${ticketData.subject}`;

    // Log para depuración
    console.log('[Support Email] Sending support ticket notification email with Resend');
    console.log(`- From: ${fromEmail}`);
    console.log(`- To: ${toEmail}`);
    console.log(`- Subject: ${subject}`);

    try {
      // Enviar el correo usando la API de Resend
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: fromEmail,
          to: toEmail,
          subject: subject,
          html: html,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Verificar si la respuesta es exitosa
      if (response.status === 200 || response.status === 201) {
        console.log('[Support Email] Support ticket email sent successfully via Resend!', response.data);
        return true;
      } else {
        console.error('[Support Email] Error response from Resend API:', response.status, response.statusText);
        return false;
      }
    } catch (apiError: any) {
      console.error('[Support Email] Error sending support ticket email via Resend API:', apiError.message);
      if (apiError.response) {
        console.error('Response data:', apiError.response.data);
        console.error('Response status:', apiError.response.status);
      }
      return false;
    }
  } catch (error) {
    console.error('[Support Email] General error in sendSupportTicketEmail:', error);
    return false;
  }
}

/**
 * Envía un correo electrónico para notificar sobre una nueva respuesta en un ticket de soporte
 *
 * @param ticketData Datos del ticket
 * @param messageData Datos del mensaje/respuesta
 * @param userInfo Información adicional del usuario
 * @returns Promesa que se resuelve a true si el correo se envió correctamente
 */
export async function sendTicketReplyEmail(ticketData: any, messageData: any, userInfo: any): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[Support Email] Warning: RESEND_API_KEY not found in environment variables');
      return false;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Generar el contenido HTML del correo
    const html = generateTicketReplyEmailHTML(ticketData, messageData, userInfo);
    const toEmail = 'info@elysiumdubai.net'; // Destinatario (administrador)
    const subject = `Respuesta en Ticket #${ticketData.ticketNumber} - ${ticketData.subject}`;

    // Log para depuración
    console.log('[Support Email] Sending ticket reply notification email with Resend');
    console.log(`- From: ${fromEmail}`);
    console.log(`- To: ${toEmail}`);
    console.log(`- Subject: ${subject}`);

    try {
      // Enviar el correo usando la API de Resend
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: fromEmail,
          to: toEmail,
          subject: subject,
          html: html,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Verificar si la respuesta es exitosa
      if (response.status === 200 || response.status === 201) {
        console.log('[Support Email] Ticket reply email sent successfully via Resend!', response.data);
        return true;
      } else {
        console.error('[Support Email] Error response from Resend API:', response.status, response.statusText);
        return false;
      }
    } catch (apiError: any) {
      console.error('[Support Email] Error sending ticket reply email via Resend API:', apiError.message);
      if (apiError.response) {
        console.error('Response data:', apiError.response.data);
        console.error('Response status:', apiError.response.status);
      }
      return false;
    }
  } catch (error) {
    console.error('[Support Email] General error in sendTicketReplyEmail:', error);
    return false;
  }
}

/**
 * Get priority color based on ticket priority
 */
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low': return COLORS.success;
    case 'medium': return COLORS.secondary;
    case 'high': return COLORS.warning;
    case 'urgent': return COLORS.danger;
    default: return COLORS.textMuted;
  }
}

/**
 * Get priority label in Spanish
 */
function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'low': return 'Baja';
    case 'medium': return 'Media';
    case 'high': return 'Alta';
    case 'urgent': return 'Urgente';
    default: return priority || 'N/A';
  }
}

/**
 * Truncate wallet address for display
 */
function formatWalletAddress(address: string): string {
  if (!address || address.length < 10) return address || 'N/A';
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

/**
 * Genera el HTML para el correo de notificación de nuevo ticket de soporte
 *
 * @param ticketData Datos del ticket
 * @param userInfo Información del usuario
 * @returns String HTML formateado
 */
function generateSupportTicketEmailHTML(ticketData: any, userInfo: any): string {
  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const priorityColor = getPriorityColor(ticketData.priority);
  const priorityLabel = getPriorityLabel(ticketData.priority);

  const content = `
    ${getEmailHeader('WayPool', 'Admin Notification')}
    <tr>
      <td style="padding: 32px 24px;">
        <!-- Alert Badge -->
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: ${COLORS.primary}20; color: ${COLORS.primary}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            New Support Ticket
          </span>
        </div>

        <!-- Title -->
        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 8px 0; text-align: center; font-weight: 600;">
          Ticket #${ticketData.ticketNumber || 'N/A'}
        </h2>
        <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 0 0 24px 0; text-align: center;">
          ${ticketData.subject || 'Sin asunto'}
        </p>

        <!-- Ticket Details Card -->
        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 20px;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600; border-bottom: 1px solid ${COLORS.border}; padding-bottom: 12px;">
            Detalles del Ticket
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Número de Ticket', `#${ticketData.ticketNumber || 'N/A'}`, true)}
            ${getDataRow('Categoría', ticketData.category || 'N/A')}
            <tr>
              <td style="padding: 12px 0; color: ${COLORS.textMuted}; font-size: 14px; border-bottom: 1px solid ${COLORS.border};">
                Prioridad
              </td>
              <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid ${COLORS.border};">
                <span style="background-color: ${priorityColor}20; color: ${priorityColor}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                  ${priorityLabel}
                </span>
              </td>
            </tr>
            ${getDataRow('Estado', ticketData.status || 'Abierto')}
            ${getDataRow('Fecha', date)}
          </table>
        </div>

        <!-- Description Card -->
        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 20px;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            Descripción
          </h3>
          <div style="background-color: ${COLORS.darkCard}; border-radius: 8px; padding: 16px; border-left: 3px solid ${COLORS.primary};">
            <p style="color: ${COLORS.text}; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
              ${ticketData.description || 'Sin descripción'}
            </p>
          </div>
        </div>

        <!-- User Info Card -->
        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border};">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600; border-bottom: 1px solid ${COLORS.border}; padding-bottom: 12px;">
            Información del Usuario
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Wallet', formatWalletAddress(userInfo.walletAddress))}
            ${getDataRow('IP Address', userInfo.ipAddress || 'N/A')}
            <tr>
              <td style="padding: 12px 0; color: ${COLORS.textMuted}; font-size: 14px;">
                User Agent
              </td>
              <td style="padding: 12px 0; color: ${COLORS.text}; font-size: 11px; text-align: right; word-break: break-all;">
                ${userInfo.userAgent || 'N/A'}
              </td>
            </tr>
          </table>
        </div>

        <!-- Admin Notice -->
        <p style="color: ${COLORS.textMuted}; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
          Para responder a este ticket, inicie sesión en el panel de administración de WayPool.
        </p>
      </td>
    </tr>
  `;

  return wrapEmail(content, { includeDisclaimer: false, includeUnsubscribe: false });
}

/**
 * Genera el HTML para el correo de notificación de respuesta en ticket de soporte
 *
 * @param ticketData Datos del ticket
 * @param messageData Datos del mensaje/respuesta
 * @param userInfo Información del usuario
 * @returns String HTML formateado
 */
function generateTicketReplyEmailHTML(ticketData: any, messageData: any, userInfo: any): string {
  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const senderLabel = messageData.sender === 'user' ? 'Usuario' :
                      messageData.sender === 'admin' ? 'Administrador' : 'Sistema';
  const senderColor = messageData.sender === 'user' ? COLORS.secondary :
                      messageData.sender === 'admin' ? COLORS.success : COLORS.warning;

  const content = `
    ${getEmailHeader('WayPool', 'Admin Notification')}
    <tr>
      <td style="padding: 32px 24px;">
        <!-- Alert Badge -->
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: ${COLORS.warning}20; color: ${COLORS.warning}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            Nueva Respuesta en Ticket
          </span>
        </div>

        <!-- Title -->
        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 8px 0; text-align: center; font-weight: 600;">
          Ticket #${ticketData.ticketNumber || 'N/A'}
        </h2>
        <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 0 0 24px 0; text-align: center;">
          ${ticketData.subject || 'Sin asunto'}
        </p>

        <!-- Ticket Status Card -->
        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 20px; border: 1px solid ${COLORS.border}; margin-bottom: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Estado del Ticket', ticketData.status || 'Abierto')}
          </table>
        </div>

        <!-- New Reply Card -->
        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; border-left: 4px solid ${senderColor}; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0; font-weight: 600;">
              Nueva Respuesta
            </h3>
            <span style="background-color: ${senderColor}20; color: ${senderColor}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
              ${senderLabel}
            </span>
          </div>

          <p style="color: ${COLORS.textMuted}; font-size: 12px; margin: 0 0 16px 0;">
            ${date}
          </p>

          <div style="background-color: ${COLORS.darkCard}; border-radius: 8px; padding: 16px;">
            <p style="color: ${COLORS.text}; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
              ${messageData.message || 'Sin contenido'}
            </p>
          </div>
        </div>

        <!-- User Info Card -->
        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border};">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600; border-bottom: 1px solid ${COLORS.border}; padding-bottom: 12px;">
            Información del Usuario
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Wallet', formatWalletAddress(userInfo.walletAddress))}
            ${getDataRow('IP Address', userInfo.ipAddress || 'N/A')}
            <tr>
              <td style="padding: 12px 0; color: ${COLORS.textMuted}; font-size: 14px;">
                User Agent
              </td>
              <td style="padding: 12px 0; color: ${COLORS.text}; font-size: 11px; text-align: right; word-break: break-all;">
                ${userInfo.userAgent || 'N/A'}
              </td>
            </tr>
          </table>
        </div>

        <!-- Admin Notice -->
        <p style="color: ${COLORS.textMuted}; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
          Para responder a este ticket, inicie sesión en el panel de administración de WayPool.
        </p>
      </td>
    </tr>
  `;

  return wrapEmail(content, { includeDisclaimer: false, includeUnsubscribe: false });
}
