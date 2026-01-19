/**
 * Base Email Template Components
 *
 * Plantillas base reutilizables para todos los emails de WayPool
 * Incluye footer legal, estilos comunes y componentes UI consistentes
 */

// Company Legal Information
export const COMPANY_INFO = {
  name: 'Elysium Media FZCO',
  legalForm: 'Free Zone Company',
  jurisdiction: 'Dubai, United Arab Emirates',
  address: 'Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE',
  licenseNumber: '58510',
  trn: '104956612600003',
  activities: 'Software Development, Fintech Solutions, Blockchain Technology',
  contactEmail: 'info@elysiumdubai.net',
  website: 'https://waypool.net',
  supportEmail: 'support@elysiumdubai.net',
};

// Brand Colors
export const COLORS = {
  primary: '#7c3aed',      // Purple
  primaryDark: '#5b21b6',
  secondary: '#3498db',    // Blue
  success: '#22c55e',      // Green
  warning: '#f59e0b',      // Orange
  danger: '#ef4444',       // Red
  dark: '#0f172a',         // Dark background
  darkCard: '#1e293b',     // Card background
  text: '#e2e8f0',         // Light text
  textMuted: '#94a3b8',    // Muted text
  border: '#334155',       // Border color
};

// URLs
export const URLS = {
  website: 'https://waypool.net',
  terms: 'https://waypool.net/terms',
  privacy: 'https://waypool.net/privacy',
  unsubscribe: 'mailto:unsubscribe@elysiumdubai.net?subject=Unsubscribe',
  contact: 'mailto:info@elysiumdubai.net',
};

/**
 * Generate the standard email header
 */
export function getEmailHeader(title: string, subtitle?: string): string {
  return `
    <tr>
      <td style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">WayPool</h1>
        ${subtitle ? `<p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${subtitle}</p>` : ''}
      </td>
    </tr>
  `;
}

/**
 * Generate the crypto disclaimer
 */
export function getCryptoDisclaimer(): string {
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

/**
 * Generate the standard email footer with legal information
 */
export function getEmailFooter(includeUnsubscribe: boolean = true): string {
  const year = new Date().getFullYear();

  return `
    <tr>
      <td style="background-color: ${COLORS.dark}; padding: 32px 24px; border-top: 1px solid ${COLORS.border};">
        <!-- Company Info -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <p style="color: ${COLORS.text}; font-size: 14px; font-weight: 600; margin: 0;">
                ${COMPANY_INFO.name}
              </p>
              <p style="color: ${COLORS.textMuted}; font-size: 12px; margin: 4px 0 0 0;">
                ${COMPANY_INFO.address}
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-bottom: 16px;">
              <p style="color: ${COLORS.textMuted}; font-size: 11px; margin: 0; line-height: 1.6;">
                License No: ${COMPANY_INFO.licenseNumber} | TRN: ${COMPANY_INFO.trn}<br>
                ${COMPANY_INFO.legalForm} - ${COMPANY_INFO.jurisdiction}
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <a href="${URLS.terms}" style="color: ${COLORS.primary}; font-size: 12px; text-decoration: none; margin: 0 8px;">Terms of Service</a>
              <span style="color: ${COLORS.border};">|</span>
              <a href="${URLS.privacy}" style="color: ${COLORS.primary}; font-size: 12px; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
              <span style="color: ${COLORS.border};">|</span>
              <a href="${URLS.contact}" style="color: ${COLORS.primary}; font-size: 12px; text-decoration: none; margin: 0 8px;">Contact Us</a>
            </td>
          </tr>
          ${includeUnsubscribe ? `
          <tr>
            <td style="text-align: center; padding-bottom: 16px;">
              <a href="${URLS.unsubscribe}" style="color: ${COLORS.textMuted}; font-size: 11px; text-decoration: underline;">
                Unsubscribe from these emails
              </a>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="text-align: center;">
              <p style="color: ${COLORS.textMuted}; font-size: 11px; margin: 0;">
                &copy; ${year} ${COMPANY_INFO.name}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

/**
 * Generate the complete email wrapper
 */
export function wrapEmail(content: string, options: {
  includeDisclaimer?: boolean;
  includeUnsubscribe?: boolean;
} = {}): string {
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          ${content}
          ${includeDisclaimer ? `
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              ${getCryptoDisclaimer()}
            </td>
          </tr>
          ` : ''}
          ${getEmailFooter(includeUnsubscribe)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Format currency amounts properly
 */
export function formatAmount(amount: number | string, currency: string = 'USD'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return `0.00 ${currency}`;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount) + ` ${currency}`;
}

/**
 * Format wallet address for display (truncated)
 */
export function formatWallet(address: string): string {
  if (!address || address.length < 10) return address || 'N/A';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Generate a styled button
 */
export function getButton(text: string, url: string, variant: 'primary' | 'secondary' = 'primary'): string {
  const bgColor = variant === 'primary'
    ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`
    : `linear-gradient(135deg, ${COLORS.secondary} 0%, #2980b9 100%)`;

  return `
    <table cellpadding="0" cellspacing="0" style="margin: 24px auto;">
      <tr>
        <td style="background: ${bgColor}; border-radius: 8px;">
          <a href="${url}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generate a data row for tables
 */
export function getDataRow(label: string, value: string, highlight: boolean = false): string {
  const valueColor = highlight ? COLORS.success : COLORS.text;
  const fontWeight = highlight ? '600' : '400';

  return `
    <tr>
      <td style="padding: 12px 0; color: ${COLORS.textMuted}; font-size: 14px; border-bottom: 1px solid ${COLORS.border};">
        ${label}
      </td>
      <td style="padding: 12px 0; color: ${valueColor}; font-size: 14px; text-align: right; border-bottom: 1px solid ${COLORS.border}; font-weight: ${fontWeight};">
        ${value}
      </td>
    </tr>
  `;
}

/**
 * Generate plain text version of email
 */
export function getPlainTextFooter(): string {
  const year = new Date().getFullYear();
  return `
---
${COMPANY_INFO.name}
${COMPANY_INFO.address}
License No: ${COMPANY_INFO.licenseNumber} | TRN: ${COMPANY_INFO.trn}

Terms: ${URLS.terms}
Privacy: ${URLS.privacy}
Contact: ${COMPANY_INFO.contactEmail}

RISK DISCLAIMER: Cryptocurrency investments involve substantial risk of loss.
Past performance is not indicative of future results. Please invest responsibly.

To unsubscribe, reply to this email with "Unsubscribe" in the subject line.

© ${year} ${COMPANY_INFO.name}. All rights reserved.
  `.trim();
}
