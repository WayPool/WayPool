import { Request, Response } from 'express';
import { emailService } from './email-service';

/**
 * Servicio para probar el sistema de emails después de actualizar credenciales
 */
export class EmailTestService {
  
  /**
   * Envía un email de prueba para verificar la configuración
   */
  async sendTestEmail(req: Request, res: Response): Promise<void> {
    try {
      console.log('[Email Test] Iniciando prueba de email...');
      
      const testEmail = req.body.email || 'admin@waybank.info';
      
      const emailData = {
        to: testEmail,
        subject: '✅ Test de Sistema de Emails - WayBank',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">WayBank</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Sistema de Emails Restaurado</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">✅ Configuración Exitosa</h2>
              
              <p style="color: #666; line-height: 1.6;">
                El sistema de emails de WayBank ha sido restaurado correctamente con las nuevas credenciales SMTP.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Funcionalidades Restauradas:</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li>📧 Notificaciones de retiros de fees</li>
                  <li>🔔 Alertas de nuevas posiciones</li>
                  <li>👥 Sistema de referidos</li>
                  <li>📊 Reportes de rendimiento</li>
                  <li>🛡️ Notificaciones de seguridad</li>
                </ul>
              </div>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                <p style="margin: 0; color: #155724;">
                  <strong>Estado:</strong> Todos los emails se enviarán automáticamente desde ahora.
                </p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Email enviado el ${new Date().toLocaleString('es-ES')} desde WayBank
                </p>
              </div>
            </div>
          </div>
        `,
        text: `
WayBank - Sistema de Emails Restaurado

El sistema de emails ha sido configurado correctamente con las nuevas credenciales SMTP.

Funcionalidades restauradas:
- Notificaciones de retiros de fees
- Alertas de nuevas posiciones  
- Sistema de referidos
- Reportes de rendimiento
- Notificaciones de seguridad

Todos los emails se enviarán automáticamente desde ahora.

Email enviado el ${new Date().toLocaleString('es-ES')}
        `
      };
      
      console.log('[Email Test] Enviando email de prueba a:', testEmail);
      const result = await emailService.sendEmail(emailData);
      
      if (result) {
        console.log('[Email Test] ✅ Email de prueba enviado exitosamente');
        res.json({
          success: true,
          message: 'Email de prueba enviado exitosamente',
          sentTo: testEmail,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('[Email Test] ❌ Error enviando email de prueba');
        res.status(500).json({
          success: false,
          message: 'Error enviando email de prueba',
          error: 'Email service returned false'
        });
      }
    } catch (error) {
      console.error('[Email Test] ❌ Error en prueba de email:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servicio de email',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  /**
   * Envía un email de prueba específico para retiros de fees
   */
  async sendFeeWithdrawalTestEmail(req: Request, res: Response): Promise<void> {
    try {
      console.log('[Email Test] Enviando prueba de email de retiro de fees...');
      
      const testEmail = req.body.email || 'admin@waybank.info';
      const testAmount = req.body.amount || '150.75';
      const testPool = req.body.pool || 'ETH/USDC';
      
      const emailData = {
        to: testEmail,
        subject: '💰 Retiro de Fees Procesado - WayBank',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">💰 WayBank</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Retiro de Fees Procesado</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Retiro Exitoso</h2>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Detalles del Retiro:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Pool:</strong></td>
                    <td style="padding: 8px 0; color: #333; border-bottom: 1px solid #eee; text-align: right;">${testPool}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;"><strong>Cantidad:</strong></td>
                    <td style="padding: 8px 0; color: #28a745; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${testAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Fecha:</strong></td>
                    <td style="padding: 8px 0; color: #333; text-align: right;">${new Date().toLocaleString('es-ES')}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                <p style="margin: 0; color: #155724;">
                  <strong>✅ Estado:</strong> Retiro procesado exitosamente. Los fondos han sido transferidos a su wallet.
                </p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Esta es una notificación automática de WayBank - No responder a este email
                </p>
              </div>
            </div>
          </div>
        `,
        text: `
WayBank - Retiro de Fees Procesado

Detalles del Retiro:
Pool: ${testPool}
Cantidad: $${testAmount}
Fecha: ${new Date().toLocaleString('es-ES')}

Estado: Retiro procesado exitosamente. Los fondos han sido transferidos a su wallet.

Esta es una notificación automática de WayBank
        `
      };
      
      console.log('[Email Test] Enviando email de prueba de retiro a:', testEmail);
      const result = await emailService.sendEmail(emailData);
      
      if (result) {
        console.log('[Email Test] ✅ Email de retiro de fees enviado exitosamente');
        res.json({
          success: true,
          message: 'Email de retiro de fees enviado exitosamente',
          sentTo: testEmail,
          amount: testAmount,
          pool: testPool,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('[Email Test] ❌ Error enviando email de retiro');
        res.status(500).json({
          success: false,
          message: 'Error enviando email de retiro',
          error: 'Email service returned false'
        });
      }
    } catch (error) {
      console.error('[Email Test] ❌ Error en prueba de email de retiro:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servicio de email de retiro',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  /**
   * Verifica el estado de la configuración de email
   */
  async checkEmailConfig(req: Request, res: Response): Promise<void> {
    try {
      const config = {
        smtpHost: process.env.SMTP_HOST ? '✅ Configurado' : '❌ Falta',
        smtpPort: process.env.SMTP_PORT ? '✅ Configurado' : '❌ Falta',
        smtpUser: process.env.SMTP_USER ? '✅ Configurado' : '❌ Falta',
        smtpPassword: process.env.SMTP_PASSWORD ? '✅ Configurado' : '❌ Falta',
        smtpFrom: process.env.SMTP_FROM ? '✅ Configurado' : '❌ Falta',
        resendApiKey: process.env.RESEND_API_KEY ? '✅ Configurado (backup)' : '⚠️ No configurado (opcional)'
      };
      
      const allConfigured = Object.entries(config)
        .filter(([key]) => key !== 'resendApiKey')
        .every(([, value]) => value.includes('✅'));
      
      res.json({
        success: true,
        configured: allConfigured,
        status: allConfigured ? 'Sistema de emails completamente configurado' : 'Faltan configuraciones',
        configuration: config,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verificando configuración',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const emailTestService = new EmailTestService();