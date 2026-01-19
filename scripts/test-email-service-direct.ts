/**
 * Script para probar directamente los templates de email-service.ts
 * Esto enviará los emails usando las funciones reales del servicio
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

// Import email service
import { emailService } from '../server/email-service.js';

async function testEmailService() {
  console.log('='.repeat(60));
  console.log('TEST DIRECTO DE EMAIL SERVICE');
  console.log('='.repeat(60));
  console.log(`Enviando a: ${TEST_EMAIL}`);

  // Test data
  const positionData = {
    id: 'TEST-001',
    amount: 1000,
    poolName: 'USDC/ETH Pool',
    poolPair: 'USDC/ETH',
    tokenPair: 'USDC/ETH',
    period: '30 days',
    estimatedAPR: '12.5%',
    impermanentLossRisk: 'Low'
  };

  const userInfo = {
    email: TEST_EMAIL,
    walletAddress: '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F',
    language: 'en'
  };

  const collectionData = {
    amount: 250.50,
    transactionId: 'TX-TEST-12345'
  };

  console.log('\n1. Enviando email de nueva posición (EN)...');
  const result1 = await emailService.sendNewPositionEmail(positionData, userInfo, 'en');
  console.log(`   Resultado: ${result1 ? 'OK' : 'FAILED'}`);

  await new Promise(r => setTimeout(r, 2000));

  console.log('\n2. Enviando email de fee collection (EN)...');
  const result2 = await emailService.sendFeeCollectionEmail(collectionData, userInfo, positionData, 'en');
  console.log(`   Resultado: ${result2 ? 'OK' : 'FAILED'}`);

  await new Promise(r => setTimeout(r, 2000));

  console.log('\n3. Enviando email de nueva posición (ES)...');
  const result3 = await emailService.sendNewPositionEmail(positionData, { ...userInfo, language: 'es' }, 'es');
  console.log(`   Resultado: ${result3 ? 'OK' : 'FAILED'}`);

  console.log('\n' + '='.repeat(60));
  console.log('TEST COMPLETADO');
  console.log('Revisa tu bandeja de entrada para verificar el diseño');
  console.log('='.repeat(60));
}

testEmailService().catch(console.error);
