/**
 * Script para generar preview HTML de los templates de email
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import translations
import {
  EmailLanguage,
  getEmailLanguage,
  isRTL,
  feeCollectionTranslations,
  newPositionTranslations
} from '../server/email-templates/email-translations.js';

function generateFeeCollectionEmailHTML(collectionData: any, userInfo: any, positionData: any, lang: EmailLanguage = 'en'): string {
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

// Generate preview
const testData = {
  collectionData: {
    amount: 2500.75,
    transactionId: 'TX-TEST-12345'
  },
  userInfo: {
    email: 'test@example.com',
    walletAddress: '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F',
    language: 'en'
  },
  positionData: {
    id: '92',
    poolName: 'USDC/ETH UNI-V3',
    poolPair: 'USDC/ETH'
  }
};

const html = generateFeeCollectionEmailHTML(testData.collectionData, testData.userInfo, testData.positionData, 'en');

// Save to file
const outputPath = path.join(__dirname, '..', 'email-preview.html');
fs.writeFileSync(outputPath, html);
console.log(`Preview saved to: ${outputPath}`);
console.log('Open this file in a browser to see how the email looks');
