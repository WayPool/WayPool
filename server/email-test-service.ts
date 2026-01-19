import { Request, Response } from 'express';
import { emailService } from './email-service';
import {
  wrapEmail,
  getEmailHeader,
  getButton,
  getDataRow,
  formatAmount,
  COLORS,
  COMPANY_INFO,
  URLS
} from './email-templates/email-base';

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

      const testEmail = req.body.email || 'admin@waypool.net';

      const content = `
        ${getEmailHeader('WayPool', 'System Test')}
        <tr>
          <td style="padding: 32px 24px;">
            <!-- Success Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background-color: ${COLORS.success}20; color: ${COLORS.success}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Configuration Successful
              </span>
            </div>

            <!-- Title -->
            <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 16px 0; text-align: center; font-weight: 600;">
              Email System Restored
            </h2>

            <p style="color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
              The WayPool email system has been successfully configured with the new SMTP credentials.
            </p>

            <!-- Features Card -->
            <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
              <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
                Restored Features
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: ${COLORS.text}; font-size: 14px;">
                    <span style="color: ${COLORS.success}; margin-right: 8px;">&#10003;</span>
                    Fee withdrawal notifications
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${COLORS.text}; font-size: 14px;">
                    <span style="color: ${COLORS.success}; margin-right: 8px;">&#10003;</span>
                    New position alerts
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${COLORS.text}; font-size: 14px;">
                    <span style="color: ${COLORS.success}; margin-right: 8px;">&#10003;</span>
                    Referral program notifications
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${COLORS.text}; font-size: 14px;">
                    <span style="color: ${COLORS.success}; margin-right: 8px;">&#10003;</span>
                    Performance reports
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${COLORS.text}; font-size: 14px;">
                    <span style="color: ${COLORS.success}; margin-right: 8px;">&#10003;</span>
                    Security notifications
                  </td>
                </tr>
              </table>
            </div>

            <!-- Status Notice -->
            <div style="background-color: ${COLORS.success}15; border-radius: 8px; padding: 16px; border-left: 3px solid ${COLORS.success};">
              <p style="color: ${COLORS.success}; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">
                Status: Active
              </p>
              <p style="color: ${COLORS.textMuted}; font-size: 13px; margin: 0;">
                All emails will be sent automatically from now on.
              </p>
            </div>

            <!-- Timestamp -->
            <p style="color: ${COLORS.textMuted}; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
              Email sent on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </td>
        </tr>
      `;

      const emailData = {
        to: testEmail,
        subject: 'Test Email - WayPool System Check',
        html: wrapEmail(content, { includeDisclaimer: true, includeUnsubscribe: false }),
        text: `
WayPool - Email System Restored

The email system has been successfully configured with the new SMTP credentials.

Restored features:
- Fee withdrawal notifications
- New position alerts
- Referral program notifications
- Performance reports
- Security notifications

All emails will be sent automatically from now on.

Email sent on ${new Date().toLocaleString('en-US')}

---
${COMPANY_INFO.name}
${COMPANY_INFO.address}
License No: ${COMPANY_INFO.licenseNumber} | TRN: ${COMPANY_INFO.trn}
        `
      };

      console.log('[Email Test] Enviando email de prueba a:', testEmail);
      const result = await emailService.sendEmail(emailData);

      if (result) {
        console.log('[Email Test] Email de prueba enviado exitosamente');
        res.json({
          success: true,
          message: 'Email de prueba enviado exitosamente',
          sentTo: testEmail,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('[Email Test] Error enviando email de prueba');
        res.status(500).json({
          success: false,
          message: 'Error enviando email de prueba',
          error: 'Email service returned false'
        });
      }
    } catch (error) {
      console.error('[Email Test] Error en prueba de email:', error);
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

      const testEmail = req.body.email || 'admin@waypool.net';
      const testAmount = req.body.amount || '150.75';
      const testPool = req.body.pool || 'ETH/USDC';

      const content = `
        ${getEmailHeader('WayPool', 'Fee Collection')}
        <tr>
          <td style="padding: 32px 24px;">
            <!-- Success Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background-color: ${COLORS.success}20; color: ${COLORS.success}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Withdrawal Successful
              </span>
            </div>

            <!-- Title -->
            <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 8px 0; text-align: center; font-weight: 600;">
              Fee Withdrawal Processed
            </h2>
            <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 0 0 24px 0; text-align: center;">
              Your fees have been successfully transferred to your wallet
            </p>

            <!-- Amount Card -->
            <div style="background: linear-gradient(135deg, ${COLORS.success}15 0%, ${COLORS.success}05 100%); border: 1px solid ${COLORS.success}30; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="color: ${COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
                Amount Collected
              </p>
              <p style="color: ${COLORS.success}; font-size: 36px; font-weight: 700; margin: 0;">
                ${formatAmount(testAmount)}
              </p>
            </div>

            <!-- Details Card -->
            <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
              <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
                Withdrawal Details
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${getDataRow('Pool', testPool)}
                ${getDataRow('Amount', `$${testAmount}`, true)}
                ${getDataRow('Date', new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }))}
                ${getDataRow('Status', 'Completed')}
              </table>
            </div>

            <!-- Success Notice -->
            <div style="background-color: ${COLORS.success}15; border-radius: 8px; padding: 16px; border-left: 3px solid ${COLORS.success};">
              <p style="color: ${COLORS.success}; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">
                Transaction Complete
              </p>
              <p style="color: ${COLORS.textMuted}; font-size: 13px; margin: 0;">
                The funds have been successfully transferred to your connected wallet.
              </p>
            </div>

            <!-- CTA Button -->
            ${getButton('View Dashboard', URLS.website + '/dashboard')}
          </td>
        </tr>
      `;

      const emailData = {
        to: testEmail,
        subject: 'Fee Withdrawal Processed - WayPool',
        html: wrapEmail(content, { includeDisclaimer: true, includeUnsubscribe: true }),
        text: `
WayPool - Fee Withdrawal Processed

Withdrawal Details:
Pool: ${testPool}
Amount: $${testAmount}
Date: ${new Date().toLocaleString('en-US')}
Status: Completed

The funds have been successfully transferred to your connected wallet.

---
${COMPANY_INFO.name}
${COMPANY_INFO.address}
License No: ${COMPANY_INFO.licenseNumber} | TRN: ${COMPANY_INFO.trn}

RISK DISCLAIMER: Cryptocurrency investments involve substantial risk of loss.
        `
      };

      console.log('[Email Test] Enviando email de prueba de retiro a:', testEmail);
      const result = await emailService.sendEmail(emailData);

      if (result) {
        console.log('[Email Test] Email de retiro de fees enviado exitosamente');
        res.json({
          success: true,
          message: 'Email de retiro de fees enviado exitosamente',
          sentTo: testEmail,
          amount: testAmount,
          pool: testPool,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('[Email Test] Error enviando email de retiro');
        res.status(500).json({
          success: false,
          message: 'Error enviando email de retiro',
          error: 'Email service returned false'
        });
      }
    } catch (error) {
      console.error('[Email Test] Error en prueba de email de retiro:', error);
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
        smtpHost: process.env.SMTP_HOST ? 'Configured' : 'Missing',
        smtpPort: process.env.SMTP_PORT ? 'Configured' : 'Missing',
        smtpUser: process.env.SMTP_USER ? 'Configured' : 'Missing',
        smtpPassword: process.env.SMTP_PASSWORD ? 'Configured' : 'Missing',
        smtpFrom: process.env.SMTP_FROM ? 'Configured' : 'Missing',
        resendApiKey: process.env.RESEND_API_KEY ? 'Configured (backup)' : 'Not configured (optional)'
      };

      const allConfigured = Object.entries(config)
        .filter(([key]) => key !== 'resendApiKey')
        .every(([, value]) => value === 'Configured');

      res.json({
        success: true,
        configured: allConfigured,
        status: allConfigured ? 'Email system fully configured' : 'Missing configurations',
        configuration: config,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking configuration',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const emailTestService = new EmailTestService();
