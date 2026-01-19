/**
 * Script para verificar los valores de APR actuales
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
import { eq } from 'drizzle-orm';

async function checkAprValues() {
  console.log('='.repeat(60));
  console.log('VERIFICACIÓN DE VALORES APR');
  console.log('='.repeat(60));

  const positions = await db.select({
    id: positionHistory.id,
    apr: positionHistory.apr,
    currentApr: positionHistory.currentApr,
    timeframe: positionHistory.timeframe,
    depositedUSDC: positionHistory.depositedUSDC
  }).from(positionHistory).where(eq(positionHistory.status, 'Active'));

  console.log(`\nPosiciones activas: ${positions.length}\n`);
  console.log('ID    | APR Contratado | APR Actual | Timeframe | Capital');
  console.log('-'.repeat(65));

  // Mostrar primeras 20 posiciones
  positions.slice(0, 20).forEach(p => {
    const aprContratado = parseFloat(p.apr || '0').toFixed(2);
    const aprActual = parseFloat(p.currentApr || '0').toFixed(2);
    const capital = parseFloat(p.depositedUSDC || '0').toLocaleString();
    console.log(`${String(p.id).padEnd(5)} | ${aprContratado.padStart(14)}% | ${aprActual.padStart(10)}% | ${String(p.timeframe).padStart(9)}d | $${capital}`);
  });

  if (positions.length > 20) {
    console.log(`\n... y ${positions.length - 20} posiciones más`);
  }

  // Verificar si hay discrepancias significativas
  const problemPositions = positions.filter(p => {
    const apr = parseFloat(p.apr || '0');
    const currentApr = parseFloat(p.currentApr || '0');
    // Verificar si el APR contratado es significativamente diferente del actual
    return Math.abs(apr - currentApr) > 50; // Diferencia mayor a 50%
  });

  if (problemPositions.length > 0) {
    console.log(`\n⚠️  POSICIONES CON DIFERENCIA > 50% ENTRE APR CONTRATADO Y ACTUAL:`);
    problemPositions.forEach(p => {
      console.log(`  - ID ${p.id}: Contratado=${p.apr}%, Actual=${p.currentApr}%`);
    });
  }

  console.log('\n' + '='.repeat(60));
}

checkAprValues().catch(console.error);
