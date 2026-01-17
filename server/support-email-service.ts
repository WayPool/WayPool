import axios from 'axios';
import { emailService } from './email-service';

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
 * Genera el HTML para el correo de notificación de nuevo ticket de soporte
 * 
 * @param ticketData Datos del ticket
 * @param userInfo Información del usuario
 * @returns String HTML formateado
 */
function generateSupportTicketEmailHTML(ticketData: any, userInfo: any): string {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toISOString().split('T')[1].substring(0, 8);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Ticket de Soporte</title>
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
        .ticket-details {
          background-color: #1a1f2e;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .user-details {
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
        .description {
          margin-top: 15px;
          padding: 15px;
          background-color: #0c1221;
          border-radius: 6px;
          white-space: pre-wrap;
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
          <div class="logo">WayBank</div>
          <p>Notificación de Nuevo Ticket de Soporte</p>
        </div>
        
        <div class="content">
          <p>Se ha recibido un nuevo ticket de soporte en la plataforma WayBank.</p>
          
          <div class="ticket-details">
            <h2>Detalles del Ticket</h2>
            
            <div class="detail-row">
              <span class="detail-label">Número de Ticket:</span>
              <span class="detail-value highlight">#${ticketData.ticketNumber || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Asunto:</span>
              <span class="detail-value">${ticketData.subject || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Categoría:</span>
              <span class="detail-value">${ticketData.category || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Prioridad:</span>
              <span class="detail-value ${
                ticketData.priority === 'low' ? 'success' : 
                ticketData.priority === 'medium' ? 'highlight' : 
                ticketData.priority === 'high' ? 'warning' : 
                ticketData.priority === 'urgent' ? 'danger' : ''
              }">
                ${ticketData.priority === 'low' ? 'Baja' : 
                  ticketData.priority === 'medium' ? 'Media' : 
                  ticketData.priority === 'high' ? 'Alta' : 
                  ticketData.priority === 'urgent' ? 'Urgente' : 
                  ticketData.priority || 'N/A'}
              </span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Estado:</span>
              <span class="detail-value">${ticketData.status || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Fecha y Hora:</span>
              <span class="detail-value">${date} ${time}</span>
            </div>
            
            <h3>Descripción:</h3>
            <div class="description">${ticketData.description || 'Sin descripción'}</div>
          </div>
          
          <div class="user-details">
            <h2>Información del Usuario</h2>
            
            <div class="detail-row">
              <span class="detail-label">Dirección de Wallet:</span>
              <span class="detail-value">${userInfo.walletAddress || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Dirección IP:</span>
              <span class="detail-value">${userInfo.ipAddress || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">User Agent:</span>
              <span class="detail-value" style="font-size: 11px;">${userInfo.userAgent || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Este es un correo electrónico automático. Por favor, no responda a este mensaje.</p>
          <p>Para responder a este ticket, inicie sesión en el panel de administración de WayBank.</p>
          <p>&copy; ${new Date().getFullYear()} WayBank. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
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
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toISOString().split('T')[1].substring(0, 8);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Respuesta en Ticket</title>
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
        .ticket-details {
          background-color: #1a1f2e;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .message-details {
          background-color: #1a1f2e;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #e67e22;
        }
        .user-details {
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
        .message-content {
          margin-top: 15px;
          padding: 15px;
          background-color: #0c1221;
          border-radius: 6px;
          white-space: pre-wrap;
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
          <div class="logo">WayBank</div>
          <p>Notificación de Nueva Respuesta en Ticket</p>
        </div>
        
        <div class="content">
          <p>Se ha recibido una nueva respuesta en un ticket de soporte de la plataforma WayBank.</p>
          
          <div class="ticket-details">
            <h2>Detalles del Ticket</h2>
            
            <div class="detail-row">
              <span class="detail-label">Número de Ticket:</span>
              <span class="detail-value highlight">#${ticketData.ticketNumber || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Asunto:</span>
              <span class="detail-value">${ticketData.subject || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Estado:</span>
              <span class="detail-value">${ticketData.status || 'N/A'}</span>
            </div>
          </div>
          
          <div class="message-details">
            <h2>Nueva Respuesta</h2>
            
            <div class="detail-row">
              <span class="detail-label">Remitente:</span>
              <span class="detail-value">${
                messageData.sender === 'user' ? 'Usuario' : 
                messageData.sender === 'admin' ? 'Administrador' : 
                'Sistema'
              }</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Fecha y Hora:</span>
              <span class="detail-value">${date} ${time}</span>
            </div>
            
            <h3>Contenido:</h3>
            <div class="message-content">${messageData.message || 'Sin contenido'}</div>
          </div>
          
          <div class="user-details">
            <h2>Información del Usuario</h2>
            
            <div class="detail-row">
              <span class="detail-label">Dirección de Wallet:</span>
              <span class="detail-value">${userInfo.walletAddress || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Dirección IP:</span>
              <span class="detail-value">${userInfo.ipAddress || 'N/A'}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">User Agent:</span>
              <span class="detail-value" style="font-size: 11px;">${userInfo.userAgent || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Este es un correo electrónico automático. Por favor, no responda a este mensaje.</p>
          <p>Para responder a este ticket, inicie sesión en el panel de administración de WayBank.</p>
          <p>&copy; ${new Date().getFullYear()} WayBank. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}