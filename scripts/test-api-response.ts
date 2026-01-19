/**
 * Script para diagnosticar por qué currentApr no aparece en la respuesta del API
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.production') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { db } from '../server/db.js';
import { positionHistory } from '../shared/schema.js';
import { eq, sql, desc } from 'drizzle-orm';
import { storage } from '../server/storage.js';

const TEST_WALLET = '0x3370201c0ac55184a23a330b363002cbd8579c90';

async function test() {
  console.log('='.repeat(60));
  console.log('DIAGNÓSTICO: currentApr en API Response');
  console.log('='.repeat(60));

  // Test 1: Direct select from positionHistory
  console.log('\n=== Test 1: Direct DB Select ===');
  const directResult = await db
    .select()
    .from(positionHistory)
    .where(sql`LOWER(${positionHistory.walletAddress}) = ${TEST_WALLET.toLowerCase()}`)
    .orderBy(desc(positionHistory.timestamp))
    .limit(1);

  if (directResult[0]) {
    console.log('Direct result keys:', Object.keys(directResult[0]).length);
    console.log('Has currentApr key:', 'currentApr' in directResult[0]);
    console.log('currentApr value:', directResult[0].currentApr);
    console.log('lastAprUpdate value:', directResult[0].lastAprUpdate);
    console.log('apr value:', directResult[0].apr);
  } else {
    console.log('No results found');
  }

  // Test 2: Through storage function
  console.log('\n=== Test 2: Through storage.getPositionHistoryByWalletAddress ===');
  const storageResult = await storage.getPositionHistoryByWalletAddress(TEST_WALLET);

  if (storageResult[0]) {
    console.log('Storage result keys:', Object.keys(storageResult[0]).length);
    console.log('Has currentApr key:', 'currentApr' in storageResult[0]);
    console.log('currentApr value:', (storageResult[0] as any).currentApr);
    console.log('lastAprUpdate value:', (storageResult[0] as any).lastAprUpdate);
    console.log('apr value:', storageResult[0].apr);

    // Mostrar todas las keys
    console.log('\nAll keys in storage result:');
    Object.keys(storageResult[0]).forEach(key => {
      const value = (storageResult[0] as any)[key];
      if (key.toLowerCase().includes('apr') || key.toLowerCase().includes('update')) {
        console.log(`  ${key}: ${value}`);
      }
    });
  } else {
    console.log('No results found');
  }

  // Test 3: JSON serialization
  console.log('\n=== Test 3: JSON Serialization ===');
  if (directResult[0]) {
    const jsonStr = JSON.stringify(directResult[0]);
    const parsed = JSON.parse(jsonStr);
    console.log('After JSON stringify/parse:');
    console.log('Has currentApr:', 'currentApr' in parsed);
    console.log('currentApr value:', parsed.currentApr);

    // Check if any APR-related keys exist
    const aprKeys = Object.keys(parsed).filter(k => k.toLowerCase().includes('apr'));
    console.log('APR-related keys:', aprKeys);
  }

  console.log('\n' + '='.repeat(60));
  console.log('FIN DIAGNÓSTICO');
  console.log('='.repeat(60));
}

test().catch(console.error);
