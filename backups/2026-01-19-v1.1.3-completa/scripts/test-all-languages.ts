/**
 * Script para probar emails en todos los idiomas
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.production') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const TEST_EMAIL = process.argv[2] || 'lballanti.lb@gmail.com';

import { emailService } from '../server/email-service.js';

const LANGUAGES = ['en', 'es', 'de', 'fr', 'it', 'pt', 'ar', 'zh', 'hi', 'ru'];
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
  ar: 'العربية',
  zh: '中文',
  hi: 'हिन्दी',
  ru: 'Русский'
};

async function testAllLanguages() {
  console.log('='.repeat(60));
  console.log('TEST DE EMAILS EN TODOS LOS IDIOMAS');
  console.log('='.repeat(60));
  console.log(`Enviando a: ${TEST_EMAIL}`);
  console.log(`Idiomas: ${LANGUAGES.length}`);
  console.log('='.repeat(60));

  const positionData = {
    id: 'TEST-LANG',
    amount: 5000,
    poolName: 'USDC/ETH Pool',
    poolPair: 'USDC/ETH',
    tokenPair: 'USDC/ETH',
    period: '30 days',
    estimatedAPR: '15.2%',
    impermanentLossRisk: 'Medium'
  };

  const collectionData = {
    amount: 750.25,
    transactionId: 'TX-MULTI-LANG-001'
  };

  const results: { lang: string; type: string; success: boolean }[] = [];

  // Enviar New Position en todos los idiomas
  console.log('\n--- EMAILS DE NUEVA POSICIÓN ---\n');

  for (const lang of LANGUAGES) {
    const userInfo = {
      email: TEST_EMAIL,
      walletAddress: '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F',
      language: lang
    };

    console.log(`[${lang.toUpperCase()}] ${LANGUAGE_NAMES[lang]} - New Position...`);
    const result = await emailService.sendNewPositionEmail(positionData, userInfo, lang);
    results.push({ lang, type: 'New Position', success: result });
    console.log(`   ${result ? '✅' : '❌'}`);

    await new Promise(r => setTimeout(r, 1500));
  }

  // Enviar Fee Collection en todos los idiomas
  console.log('\n--- EMAILS DE FEE COLLECTION ---\n');

  for (const lang of LANGUAGES) {
    const userInfo = {
      email: TEST_EMAIL,
      walletAddress: '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F',
      language: lang
    };

    console.log(`[${lang.toUpperCase()}] ${LANGUAGE_NAMES[lang]} - Fee Collection...`);
    const result = await emailService.sendFeeCollectionEmail(collectionData, userInfo, positionData, lang);
    results.push({ lang, type: 'Fee Collection', success: result });
    console.log(`   ${result ? '✅' : '❌'}`);

    await new Promise(r => setTimeout(r, 1500));
  }

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('RESUMEN');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  console.log(`\nTotal enviados: ${successful}/${results.length}`);

  console.log('\nNew Position:');
  results.filter(r => r.type === 'New Position').forEach(r => {
    console.log(`  [${r.lang.toUpperCase()}] ${LANGUAGE_NAMES[r.lang]}: ${r.success ? '✅' : '❌'}`);
  });

  console.log('\nFee Collection:');
  results.filter(r => r.type === 'Fee Collection').forEach(r => {
    console.log(`  [${r.lang.toUpperCase()}] ${LANGUAGE_NAMES[r.lang]}: ${r.success ? '✅' : '❌'}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL: ${results.length} emails enviados a ${TEST_EMAIL}`);
  console.log('='.repeat(60));
}

testAllLanguages().catch(console.error);
