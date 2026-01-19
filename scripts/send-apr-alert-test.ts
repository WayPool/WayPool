/**
 * Script para enviar alerta de prueba del sistema APR
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.production') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { sendTestAlert } from '../server/daily-apr-cron.js';

async function main() {
  console.log('='.repeat(60));
  console.log('ENVIANDO ALERTA DE PRUEBA DEL SISTEMA APR');
  console.log('='.repeat(60));
  console.log('Destinatario: lballanti.lb@gmail.com');
  console.log('');

  const result = await sendTestAlert();

  if (result) {
    console.log('✅ Alerta de prueba enviada correctamente');
  } else {
    console.log('❌ Error al enviar alerta de prueba');
  }

  console.log('='.repeat(60));
}

main().catch(console.error);
