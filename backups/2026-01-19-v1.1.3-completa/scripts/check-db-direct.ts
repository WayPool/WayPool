/**
 * Script para verificar directamente la base de datos con pg
 */
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('Consultando base de datos directamente con pg...');

  const result = await pool.query('SELECT id, apr, current_apr, last_apr_update FROM position_history WHERE id = 118');
  console.log('Direct PG query result:');
  console.log(JSON.stringify(result.rows[0], null, 2));

  await pool.end();
}

main().catch(console.error);
