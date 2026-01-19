/**
 * Script para verificar los valores de currentApr en la base de datos
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

async function check() {
  console.log('Verificando valores de currentApr en la base de datos...\n');

  const positions = await db.select().from(positionHistory).where(eq(positionHistory.status, 'Active')).limit(10);

  console.log('ID    | apr (contratado) | currentApr (actual) | lastAprUpdate');
  console.log('-'.repeat(80));

  positions.forEach(p => {
    const apr = p.apr || 'NULL';
    const currentApr = p.currentApr || 'NULL';
    const lastUpdate = p.lastAprUpdate ? new Date(p.lastAprUpdate).toISOString() : 'NULL';
    console.log(`${String(p.id).padEnd(5)} | ${String(apr).padEnd(16)} | ${String(currentApr).padEnd(19)} | ${lastUpdate}`);
  });

  console.log('\n--- Objeto completo de la primera posición ---');
  if (positions[0]) {
    console.log(JSON.stringify(positions[0], null, 2));
  }
}

check().catch(console.error);
