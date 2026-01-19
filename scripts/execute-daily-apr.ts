/**
 * Script para ejecutar manualmente la distribución diaria de APR
 * Uso: npx tsx scripts/execute-daily-apr.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.production') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  console.log('='.repeat(60));
  console.log('EJECUCIÓN MANUAL DE DISTRIBUCIÓN DIARIA DE APR');
  console.log('='.repeat(60));
  console.log(`Fecha: ${new Date().toISOString()}`);
  console.log('');

  try {
    // Import dinámico después de cargar las variables de entorno
    const { executeDailyAprDistribution, calculateAveragePoolApr, getAprSystemInfo } = await import('../server/daily-apr-distribution-service.js');

    // 1. Mostrar información del sistema
    console.log('--- INFORMACIÓN DEL SISTEMA ---');
    const systemInfo = await getAprSystemInfo();

    console.log(`\nPools activos: ${systemInfo.pools.length}`);
    systemInfo.pools.forEach(p => {
      console.log(`  - ${p.name}: ${p.apr.toFixed(2)}% APR, TVL: $${p.tvl.toLocaleString()}`);
    });

    console.log(`\nAPR Promedio: ${systemInfo.averageApr.toFixed(2)}%`);

    console.log('\nAjustes por timeframe:');
    systemInfo.timeframeAdjustments.forEach(adj => {
      console.log(`  - ${adj.timeframe}d: ${adj.adjustment}% -> APR ajustado: ${adj.adjustedApr.toFixed(2)}%`);
    });

    console.log(`\nPosiciones activas: ${systemInfo.activePositionsCount}`);
    console.log(`Capital total activo: $${systemInfo.totalActiveCapital.toLocaleString()}`);

    // 2. Ejecutar distribución
    console.log('\n--- EJECUTANDO DISTRIBUCIÓN ---\n');
    const result = await executeDailyAprDistribution('manual-script');

    if (result.success) {
      console.log('\n✅ DISTRIBUCIÓN COMPLETADA EXITOSAMENTE');
      console.log(`  - Posiciones actualizadas: ${result.totalPositionsUpdated}`);
      console.log(`  - Total distribuido: $${result.totalDistributed.toFixed(2)}`);
      console.log(`  - APR promedio pools: ${result.averagePoolApr}%`);

      console.log('\nDetalle por timeframe:');
      for (const [tf, data] of Object.entries(result.distributionsByTimeframe)) {
        console.log(`  - ${tf}d: APR ${data.adjustedApr.toFixed(2)}%, ${data.positionsUpdated} posiciones, $${data.totalDistributed.toFixed(2)}`);
      }
    } else {
      console.log('\n❌ DISTRIBUCIÓN FALLÓ');
      console.log(`  Error: ${result.errorMessage}`);
    }

  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('FIN DE LA EJECUCIÓN');
  console.log('='.repeat(60));
}

main().catch(console.error);
