/**
 * Script de prueba para enviar todas las plantillas de email disponibles
 * Uso: npx tsx scripts/test-all-emails.ts [email]
 *
 * Este script envía todas las plantillas de email del sistema a la dirección especificada
 * para verificar que funcionan correctamente y no van a la carpeta de spam.
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno (primero .env.production, luego .env)
dotenv.config({ path: path.join(__dirname, '..', '.env.production') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuración SMTP (usando hostname elysiumdubai.net)
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'elysiumdubai.net',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'noreply@elysiumdubai.net',
    pass: process.env.SMTP_PASSWORD || '1lyl_5O36',
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2' as const
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000
};

const TEST_EMAIL = process.argv[2] || 'lballanti.lb@gmail.com';
const FROM_EMAIL = 'noreply@elysiumdubai.net';

// Company Info for footer
const COMPANY = {
  name: 'Elysium Media FZCO',
  address: 'Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE',
  license: '58510',
  trn: '104956612600003',
  jurisdiction: 'Free Zone Company - Dubai, United Arab Emirates',
  website: 'https://waypool.net',
  termsUrl: 'https://waypool.net/terms',
  privacyUrl: 'https://waypool.net/privacy',
  contactEmail: 'info@elysiumdubai.net',
  unsubscribeEmail: 'unsubscribe@elysiumdubai.net',
};

// Colors
const COLORS = {
  primary: '#7c3aed',
  primaryDark: '#5b21b6',
  secondary: '#3498db',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  dark: '#0f172a',
  darkCard: '#1e293b',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  border: '#334155',
};

console.log('='.repeat(60));
console.log('TEST DE SISTEMA DE EMAILS - WayPool');
console.log('='.repeat(60));
console.log(`Destinatario: ${TEST_EMAIL}`);
console.log(`Remitente: ${FROM_EMAIL}`);
console.log(`SMTP Host: ${SMTP_CONFIG.host}`);
console.log(`SMTP Port: ${SMTP_CONFIG.port}`);
console.log('='.repeat(60));

// Crear transporter
const transporter = nodemailer.createTransport(SMTP_CONFIG);

interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text: string;
}

// Generate crypto disclaimer
function getCryptoDisclaimer(): string {
  return `
    <div style="background-color: ${COLORS.darkCard}; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 3px solid ${COLORS.warning};">
      <p style="color: ${COLORS.warning}; font-size: 11px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase;">Risk Disclaimer</p>
      <p style="color: ${COLORS.textMuted}; font-size: 11px; line-height: 1.5; margin: 0;">
        Cryptocurrency investments involve substantial risk of loss and are not suitable for all investors.
        Past performance is not indicative of future results. The value of digital assets can be volatile
        and may result in significant losses. Please invest responsibly and only with funds you can afford to lose.
        This communication does not constitute financial advice.
      </p>
    </div>
  `;
}

// Generate footer
function getFooter(includeUnsubscribe: boolean = true): string {
  const year = new Date().getFullYear();
  return `
    <tr>
      <td style="background-color: ${COLORS.dark}; padding: 32px 24px; border-top: 1px solid ${COLORS.border};">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <p style="color: ${COLORS.text}; font-size: 14px; font-weight: 600; margin: 0;">
                ${COMPANY.name}
              </p>
              <p style="color: ${COLORS.textMuted}; font-size: 12px; margin: 4px 0 0 0;">
                ${COMPANY.address}
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-bottom: 16px;">
              <p style="color: ${COLORS.textMuted}; font-size: 11px; margin: 0; line-height: 1.6;">
                License No: ${COMPANY.license} | TRN: ${COMPANY.trn}<br>
                ${COMPANY.jurisdiction}
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <a href="${COMPANY.termsUrl}" style="color: ${COLORS.primary}; font-size: 12px; text-decoration: none; margin: 0 8px;">Terms of Service</a>
              <span style="color: ${COLORS.border};">|</span>
              <a href="${COMPANY.privacyUrl}" style="color: ${COLORS.primary}; font-size: 12px; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
              <span style="color: ${COLORS.border};">|</span>
              <a href="mailto:${COMPANY.contactEmail}" style="color: ${COLORS.primary}; font-size: 12px; text-decoration: none; margin: 0 8px;">Contact Us</a>
            </td>
          </tr>
          ${includeUnsubscribe ? `
          <tr>
            <td style="text-align: center; padding-bottom: 16px;">
              <a href="mailto:${COMPANY.unsubscribeEmail}?subject=Unsubscribe" style="color: ${COLORS.textMuted}; font-size: 11px; text-decoration: underline;">
                Unsubscribe from these emails
              </a>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="text-align: center;">
              <p style="color: ${COLORS.textMuted}; font-size: 11px; margin: 0;">
                &copy; ${year} ${COMPANY.name}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// Wrap email content with standard structure
function wrapEmail(content: string, options: { includeDisclaimer?: boolean; includeUnsubscribe?: boolean } = {}): string {
  const { includeDisclaimer = true, includeUnsubscribe = true } = options;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>WayPool</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${COLORS.dark}; color: ${COLORS.text}; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark};">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: ${COLORS.darkCard}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          ${content}
          ${includeDisclaimer ? `
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              ${getCryptoDisclaimer()}
            </td>
          </tr>
          ` : ''}
          ${getFooter(includeUnsubscribe)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Get header
function getHeader(title: string, subtitle?: string): string {
  return `
    <tr>
      <td style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${title}</h1>
        ${subtitle ? `<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${subtitle}</p>` : ''}
      </td>
    </tr>
  `;
}

// Get button
function getButton(text: string, url: string): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin: 24px auto;">
      <tr>
        <td style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); border-radius: 8px;">
          <a href="${url}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

// Get data row
function getDataRow(label: string, value: string, highlight: boolean = false): string {
  const valueColor = highlight ? COLORS.success : COLORS.text;
  return `
    <tr>
      <td style="padding: 12px 0; color: ${COLORS.textMuted}; font-size: 14px; border-bottom: 1px solid ${COLORS.border};">
        ${label}
      </td>
      <td style="padding: 12px 0; color: ${valueColor}; font-size: 14px; text-align: right; border-bottom: 1px solid ${COLORS.border}; font-weight: ${highlight ? '600' : '400'};">
        ${value}
      </td>
    </tr>
  `;
}

// Plain text footer
function getPlainTextFooter(): string {
  const year = new Date().getFullYear();
  return `
---
${COMPANY.name}
${COMPANY.address}
License No: ${COMPANY.license} | TRN: ${COMPANY.trn}

Terms: ${COMPANY.termsUrl}
Privacy: ${COMPANY.privacyUrl}
Contact: ${COMPANY.contactEmail}

RISK DISCLAIMER: Cryptocurrency investments involve substantial risk of loss.
Past performance is not indicative of future results. Please invest responsibly.

To unsubscribe, reply to this email with "Unsubscribe" in the subject line.

© ${year} ${COMPANY.name}. All rights reserved.
  `.trim();
}

// ============================================================================
// TEMPLATE 1: System Test
// ============================================================================
const systemTestTemplate: EmailTemplate = {
  name: '1. System Test',
  subject: 'Email System Verified - WayPool',
  html: wrapEmail(`
    ${getHeader('WayPool', 'System Test')}
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: ${COLORS.success}20; color: ${COLORS.success}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            Configuration Successful
          </span>
        </div>

        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 16px 0; text-align: center; font-weight: 600;">
          Email System Verified
        </h2>

        <p style="color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
          The WayPool email system has been successfully configured and tested.
        </p>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            Test Information
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Date', new Date().toLocaleString('en-US'))}
            ${getDataRow('SMTP Server', SMTP_CONFIG.host)}
            ${getDataRow('Port', String(SMTP_CONFIG.port))}
            ${getDataRow('From', FROM_EMAIL)}
            ${getDataRow('Status', 'Active', true)}
          </table>
        </div>

        <div style="background-color: ${COLORS.success}15; border-radius: 8px; padding: 16px; border-left: 3px solid ${COLORS.success};">
          <p style="color: ${COLORS.success}; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">
            All Systems Operational
          </p>
          <p style="color: ${COLORS.textMuted}; font-size: 13px; margin: 0;">
            If you can see this email, the configuration is working correctly.
          </p>
        </div>
      </td>
    </tr>
  `, { includeDisclaimer: true, includeUnsubscribe: false }),
  text: `
WayPool - Email System Verified

The WayPool email system has been successfully configured and tested.

Test Information:
- Date: ${new Date().toLocaleString('en-US')}
- SMTP Server: ${SMTP_CONFIG.host}
- Port: ${SMTP_CONFIG.port}
- From: ${FROM_EMAIL}
- Status: Active

If you can see this email, the configuration is working correctly.

${getPlainTextFooter()}
  `
};

// ============================================================================
// TEMPLATE 2: New Position Created
// ============================================================================
const newPositionTemplate: EmailTemplate = {
  name: '2. New Position Created',
  subject: 'New Liquidity Position Created - WayPool',
  html: wrapEmail(`
    ${getHeader('WayPool', 'Position Alert')}
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: ${COLORS.primary}20; color: ${COLORS.primary}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            New Position
          </span>
        </div>

        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 8px 0; text-align: center; font-weight: 600;">
          Position #NFT-12345
        </h2>
        <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 0 0 24px 0; text-align: center;">
          A new liquidity position has been created on WayPool
        </p>

        <!-- Amount Card -->
        <div style="background: linear-gradient(135deg, ${COLORS.primary}15 0%, ${COLORS.primaryDark}15 100%); border: 1px solid ${COLORS.primary}30; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: ${COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
            Investment Amount
          </p>
          <p style="color: ${COLORS.primary}; font-size: 36px; font-weight: 700; margin: 0;">
            1,000.00 USD
          </p>
        </div>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            Position Details
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Token Pair', 'ETH/USDC')}
            ${getDataRow('Pool Fee', '0.3%')}
            ${getDataRow('Period', '30 days')}
            ${getDataRow('Estimated APR', '12.5%', true)}
            ${getDataRow('IL Risk', 'Low (±5%)')}
          </table>
        </div>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border};">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            User Information
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Wallet', '0x6b22...271F')}
            ${getDataRow('Date', new Date().toLocaleString('en-US'))}
          </table>
        </div>

        ${getButton('View Position', COMPANY.website + '/dashboard')}
      </td>
    </tr>
  `),
  text: `
WayPool - New Liquidity Position Created

Position #NFT-12345

A new liquidity position has been created on WayPool.

Investment Amount: 1,000.00 USD

Position Details:
- Token Pair: ETH/USDC
- Pool Fee: 0.3%
- Period: 30 days
- Estimated APR: 12.5%
- IL Risk: Low (±5%)

User Information:
- Wallet: 0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F
- Date: ${new Date().toLocaleString('en-US')}

${getPlainTextFooter()}
  `
};

// ============================================================================
// TEMPLATE 3: Fee Collection
// ============================================================================
const feeCollectionTemplate: EmailTemplate = {
  name: '3. Fee Collection',
  subject: 'Fee Collection Completed - WayPool',
  html: wrapEmail(`
    ${getHeader('WayPool', 'Fee Collection')}
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: ${COLORS.success}20; color: ${COLORS.success}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            Withdrawal Successful
          </span>
        </div>

        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 8px 0; text-align: center; font-weight: 600;">
          Fee Withdrawal Processed
        </h2>
        <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 0 0 24px 0; text-align: center;">
          Your fees have been successfully collected
        </p>

        <!-- Amount Card -->
        <div style="background: linear-gradient(135deg, ${COLORS.success}15 0%, ${COLORS.success}05 100%); border: 1px solid ${COLORS.success}30; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: ${COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
            Amount Collected
          </p>
          <p style="color: ${COLORS.success}; font-size: 36px; font-weight: 700; margin: 0;">
            2,500.75 USD
          </p>
        </div>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            Withdrawal Details
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Pool', 'USDC/ETH UNI-V3')}
            ${getDataRow('Position ID', '#92')}
            ${getDataRow('Amount', '$2,500.75', true)}
            ${getDataRow('Date', new Date().toLocaleString('en-US'))}
            ${getDataRow('Status', 'Completed')}
          </table>
        </div>

        <div style="background-color: ${COLORS.success}15; border-radius: 8px; padding: 16px; border-left: 3px solid ${COLORS.success};">
          <p style="color: ${COLORS.success}; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">
            Transaction Complete
          </p>
          <p style="color: ${COLORS.textMuted}; font-size: 13px; margin: 0;">
            The funds have been successfully transferred to your connected wallet.
          </p>
        </div>

        ${getButton('View Dashboard', COMPANY.website + '/dashboard')}
      </td>
    </tr>
  `),
  text: `
WayPool - Fee Collection Completed

Fee Withdrawal Processed

Your fees have been successfully collected.

Amount Collected: $2,500.75 USD

Withdrawal Details:
- Pool: USDC/ETH UNI-V3
- Position ID: #92
- Amount: $2,500.75
- Date: ${new Date().toLocaleString('en-US')}
- Status: Completed

The funds have been successfully transferred to your connected wallet.

${getPlainTextFooter()}
  `
};

// ============================================================================
// TEMPLATE 4: Referral Welcome
// ============================================================================
const referralWelcomeTemplate: EmailTemplate = {
  name: '4. Referral Welcome',
  subject: 'Welcome to the WayPool Referral Program!',
  html: wrapEmail(`
    ${getHeader('WayPool', 'Referral Program')}
    <tr>
      <td style="padding: 32px 24px;">
        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 16px 0; font-weight: 600;">
          Hello Test User,
        </h2>

        <p style="color: ${COLORS.text}; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Thank you for subscribing to our referral program! We're excited to have you on board.
        </p>

        <p style="color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
          WayPool offers you a unique opportunity to earn commissions by referring investors to our platform.
        </p>

        <!-- Referral Code Card -->
        <div style="background: linear-gradient(135deg, ${COLORS.primary}20 0%, ${COLORS.primaryDark}20 100%); border: 1px solid ${COLORS.primary}40; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
          <p style="color: ${COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
            Your Referral Code
          </p>
          <p style="color: ${COLORS.primary}; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: 2px; font-family: monospace;">
            WAYTEST123
          </p>
        </div>

        <!-- Steps -->
        <div style="background-color: ${COLORS.dark}; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            How to get started
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 8px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <div style="width: 24px; height: 24px; background: ${COLORS.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">1</div>
                    </td>
                    <td style="color: ${COLORS.textMuted}; font-size: 14px; padding-left: 12px;">
                      Visit our referral program page to learn more
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <div style="width: 24px; height: 24px; background: ${COLORS.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">2</div>
                    </td>
                    <td style="color: ${COLORS.textMuted}; font-size: 14px; padding-left: 12px;">
                      Share your referral code with potential investors
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <div style="width: 24px; height: 24px; background: ${COLORS.primary}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">3</div>
                    </td>
                    <td style="color: ${COLORS.textMuted}; font-size: 14px; padding-left: 12px;">
                      Track your earnings in your dashboard
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <div style="width: 24px; height: 24px; background: ${COLORS.success}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: 600;">4</div>
                    </td>
                    <td style="color: ${COLORS.textMuted}; font-size: 14px; padding-left: 12px;">
                      Receive commissions every time your referrals generate fees
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        ${getButton('Access Your Dashboard', COMPANY.website + '/dashboard')}

        <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 24px 0 0 0;">
          Best regards,<br>
          <strong style="color: ${COLORS.text};">The WayPool Team</strong>
        </p>
      </td>
    </tr>
  `),
  text: `
WayPool - Referral Program

Hello Test User,

Thank you for subscribing to our referral program! We're excited to have you on board.

Your Referral Code: WAYTEST123

How to get started:
1. Visit our referral program page to learn more
2. Share your referral code with potential investors
3. Track your earnings in your dashboard
4. Receive commissions every time your referrals generate fees

Best regards,
The WayPool Team

${getPlainTextFooter()}
  `
};

// ============================================================================
// TEMPLATE 5: Password Recovery
// ============================================================================
const passwordRecoveryTemplate: EmailTemplate = {
  name: '5. Password Recovery',
  subject: 'Password Recovery Request - WayPool',
  html: wrapEmail(`
    ${getHeader('WayPool', 'Security Center')}
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 28px;">
          <span style="display: inline-block; background-color: ${COLORS.primary}15; color: ${COLORS.primary}; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            Security
          </span>
          <h2 style="color: ${COLORS.text}; font-size: 24px; font-weight: 700; margin: 12px 0 8px 0;">
            Password Recovery Request
          </h2>
          <p style="color: ${COLORS.textMuted}; font-size: 16px; margin: 0;">
            Use the code below to reset your password
          </p>
        </div>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
          <p style="color: ${COLORS.text}; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
            We have received a request to reset the password for your WayPool account.
          </p>

          <div style="background: linear-gradient(180deg, ${COLORS.darkCard} 0%, ${COLORS.dark} 100%); border: 2px solid ${COLORS.primary}; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="color: ${COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0; font-weight: 600;">
              Recovery Code
            </p>
            <p style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 6px; color: ${COLORS.primary}; margin: 0;">
              ABC123
            </p>
          </div>

          <div style="background-color: ${COLORS.darkCard}; border-left: 3px solid ${COLORS.warning}; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <p style="color: ${COLORS.warning}; font-size: 12px; font-weight: 600; margin: 0 0 4px 0; text-transform: uppercase;">
              Important
            </p>
            <p style="color: ${COLORS.text}; font-size: 14px; margin: 0; line-height: 1.5;">
              This code will expire in <strong>24 hours</strong> for security reasons.
            </p>
          </div>
        </div>

        <p style="color: ${COLORS.textMuted}; font-size: 14px; text-align: center; margin: 24px 0; line-height: 1.6;">
          If you did not request this password reset, please ignore this message or contact support at
          <a href="mailto:support@elysiumdubai.net" style="color: ${COLORS.primary}; text-decoration: none;">support@elysiumdubai.net</a>
        </p>
      </td>
    </tr>
  `, { includeDisclaimer: true, includeUnsubscribe: false }),
  text: `
WayPool - Password Recovery Request

We have received a request to reset the password for your WayPool account.

Your Recovery Code: ABC123

IMPORTANT: This code will expire in 24 hours for security reasons.

If you did not request this password reset, please ignore this message or contact support at support@elysiumdubai.net

${getPlainTextFooter()}
  `
};

// ============================================================================
// TEMPLATE 6: Support Ticket
// ============================================================================
const supportTicketTemplate: EmailTemplate = {
  name: '6. Support Ticket',
  subject: 'New Support Ticket #12345 - WayPool',
  html: wrapEmail(`
    ${getHeader('WayPool', 'Admin Notification')}
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: ${COLORS.primary}20; color: ${COLORS.primary}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            New Support Ticket
          </span>
        </div>

        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 8px 0; text-align: center; font-weight: 600;">
          Ticket #12345
        </h2>
        <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 0 0 24px 0; text-align: center;">
          Issue with fee withdrawal
        </p>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 20px;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            Ticket Details
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Ticket Number', '#12345', true)}
            ${getDataRow('Category', 'Technical')}
            <tr>
              <td style="padding: 12px 0; color: ${COLORS.textMuted}; font-size: 14px; border-bottom: 1px solid ${COLORS.border};">
                Priority
              </td>
              <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid ${COLORS.border};">
                <span style="background-color: ${COLORS.warning}20; color: ${COLORS.warning}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                  High
                </span>
              </td>
            </tr>
            ${getDataRow('Status', 'Open')}
            ${getDataRow('Date', new Date().toLocaleString('en-US'))}
          </table>
        </div>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 20px;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            Description
          </h3>
          <div style="background-color: ${COLORS.darkCard}; border-radius: 8px; padding: 16px; border-left: 3px solid ${COLORS.primary};">
            <p style="color: ${COLORS.text}; font-size: 14px; line-height: 1.6; margin: 0;">
              This is a test message to verify the support ticket system.
              The user reports they cannot withdraw their accumulated fees.
            </p>
          </div>
        </div>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border};">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            User Information
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Wallet', '0x6b22...271F')}
            ${getDataRow('IP Address', '127.0.0.1')}
          </table>
        </div>

        <p style="color: ${COLORS.textMuted}; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
          To respond to this ticket, log in to the WayPool admin panel.
        </p>
      </td>
    </tr>
  `, { includeDisclaimer: false, includeUnsubscribe: false }),
  text: `
WayPool - New Support Ticket #12345

Ticket Details:
- Ticket Number: #12345
- Subject: Issue with fee withdrawal
- Category: Technical
- Priority: High
- Status: Open
- Date: ${new Date().toLocaleString('en-US')}

Description:
This is a test message to verify the support ticket system.
The user reports they cannot withdraw their accumulated fees.

User Information:
- Wallet: 0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F
- IP Address: 127.0.0.1

${getPlainTextFooter()}
  `
};

// ============================================================================
// TEMPLATE 7: Admin Fee Alert
// ============================================================================
const adminFeeAlertTemplate: EmailTemplate = {
  name: '7. Admin Fee Alert',
  subject: 'Fee Collection Alert - WayPool Admin',
  html: wrapEmail(`
    ${getHeader('WayPool', 'Admin Alert')}
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: ${COLORS.warning}20; color: ${COLORS.warning}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            Admin Alert
          </span>
        </div>

        <h2 style="color: ${COLORS.text}; font-size: 22px; margin: 0 0 8px 0; text-align: center; font-weight: 600;">
          Fee Collection Detected
        </h2>
        <p style="color: ${COLORS.textMuted}; font-size: 14px; margin: 0 0 24px 0; text-align: center;">
          A fee collection has been processed that requires your attention
        </p>

        <!-- Amount Card -->
        <div style="background: linear-gradient(135deg, ${COLORS.success}15 0%, ${COLORS.success}05 100%); border: 1px solid ${COLORS.success}30; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: ${COLORS.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
            Amount Collected
          </p>
          <p style="color: ${COLORS.success}; font-size: 36px; font-weight: 700; margin: 0;">
            2,500.75 USD
          </p>
        </div>

        <div style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 24px; border: 1px solid ${COLORS.border}; margin-bottom: 24px;">
          <h3 style="color: ${COLORS.text}; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
            Collection Details
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${getDataRow('Position ID', '#92')}
            ${getDataRow('Pool', 'USDC/ETH UNI-V3')}
            ${getDataRow('Amount', '$2,500.75', true)}
            ${getDataRow('User Wallet', '0x6b22...271F')}
            ${getDataRow('Timestamp', new Date().toISOString())}
          </table>
        </div>

        ${getButton('View in Admin Panel', COMPANY.website + '/admin')}
      </td>
    </tr>
  `, { includeDisclaimer: false, includeUnsubscribe: false }),
  text: `
WayPool Admin - Fee Collection Alert

A fee collection has been processed that requires your attention.

Amount Collected: $2,500.75 USD

Collection Details:
- Position ID: #92
- Pool: USDC/ETH UNI-V3
- Amount: $2,500.75
- User Wallet: 0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F
- Timestamp: ${new Date().toISOString()}

${getPlainTextFooter()}
  `
};

// Lista de todas las plantillas
const allTemplates: EmailTemplate[] = [
  systemTestTemplate,
  newPositionTemplate,
  feeCollectionTemplate,
  referralWelcomeTemplate,
  passwordRecoveryTemplate,
  supportTicketTemplate,
  adminFeeAlertTemplate,
];

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
async function sendAllTestEmails() {
  console.log('\nVerificando conexión SMTP...\n');

  try {
    await transporter.verify();
    console.log('Conexión SMTP verificada correctamente\n');
  } catch (error: any) {
    console.error('Error verificando conexión SMTP:', error.message);
    console.log('\nIntentando enviar emails de todos modos...\n');
  }

  const results: { name: string; success: boolean; error?: string }[] = [];

  for (let i = 0; i < allTemplates.length; i++) {
    const template = allTemplates[i];
    console.log(`\n[${i + 1}/${allTemplates.length}] Enviando: ${template.name}`);
    console.log(`   Asunto: ${template.subject}`);

    try {
      const info = await transporter.sendMail({
        from: `"WayPool" <${FROM_EMAIL}>`,
        to: TEST_EMAIL,
        subject: template.subject,
        html: template.html,
        text: template.text,
        headers: {
          'X-Mailer': 'WayPool Email System',
          'X-Priority': '3',
          'List-Unsubscribe': `<mailto:${COMPANY.unsubscribeEmail}>`,
        }
      });

      console.log(`   Enviado! Message ID: ${info.messageId}`);
      results.push({ name: template.name, success: true });

      // Esperar 2 segundos entre emails para evitar rate limiting
      if (i < allTemplates.length - 1) {
        console.log('   Esperando 2 segundos...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error: any) {
      console.error(`   Error: ${error.message}`);
      results.push({ name: template.name, success: false, error: error.message });
    }
  }

  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('RESUMEN DE ENVÍOS');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\nExitosos: ${successful.length}/${results.length}`);
  successful.forEach(r => console.log(`   - ${r.name}`));

  if (failed.length > 0) {
    console.log(`\nFallidos: ${failed.length}/${results.length}`);
    failed.forEach(r => console.log(`   - ${r.name}: ${r.error}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Todos los emails fueron enviados a: ${TEST_EMAIL}`);
  console.log('Revisa tu bandeja de entrada y carpeta de spam.');
  console.log('='.repeat(60));
}

// Ejecutar
sendAllTestEmails().catch(console.error);
