/**
 * Script para exportar la base de datos completa a JSON
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require'
});

async function exportDatabase() {
  const client = await pool.connect();
  const backup = {};

  try {
    // Obtener lista de tablas
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map(r => r.table_name);
    console.log(`Encontradas ${tables.length} tablas:`, tables);

    // Exportar cada tabla
    for (const table of tables) {
      console.log(`Exportando tabla: ${table}...`);
      const result = await client.query(`SELECT * FROM "${table}"`);
      backup[table] = {
        count: result.rows.length,
        data: result.rows
      };
      console.log(`  - ${result.rows.length} registros`);
    }

    // Guardar backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupPath = path.join(__dirname, `2026-01-18/database_backup_${timestamp}.json`);

    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    console.log(`\nBackup guardado en: ${backupPath}`);
    console.log(`Tamaño: ${(fs.statSync(backupPath).size / 1024 / 1024).toFixed(2)} MB`);

    // Resumen
    console.log('\n=== RESUMEN DEL BACKUP ===');
    for (const [table, info] of Object.entries(backup)) {
      console.log(`${table}: ${info.count} registros`);
    }

  } finally {
    client.release();
    await pool.end();
  }
}

exportDatabase().catch(console.error);
