/**
 * Migración para añadir la tabla wallet_seed_phrases
 * Esta tabla almacena las frases semilla únicas para cada wallet
 */

import { sql } from "drizzle-orm";
import { db, pool } from "../db";

export async function addWalletSeedPhrasesTableMigration() {
  console.log('Iniciando migración para crear tabla wallet_seed_phrases...');
  
  try {
    // Verificar si la tabla ya existe
    const tableExists = await checkTableExists('wallet_seed_phrases');
    
    if (tableExists) {
      console.log('La tabla wallet_seed_phrases ya existe, omitiendo creación');
      return { success: true, message: 'La tabla ya existía, no se realizaron cambios' };
    }
    
    // Crear la tabla
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS wallet_seed_phrases (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL UNIQUE,
        seed_phrase TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Crear índice para búsquedas rápidas por dirección de wallet
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS wallet_seed_phrases_wallet_address_idx 
      ON wallet_seed_phrases (wallet_address)
    `);
    
    console.log('Tabla wallet_seed_phrases creada correctamente');
    return { success: true, message: 'Tabla wallet_seed_phrases creada correctamente' };
  } catch (error) {
    console.error('Error al crear tabla wallet_seed_phrases:', error);
    return { success: false, message: 'Error al crear tabla wallet_seed_phrases', error };
  }
}

/**
 * Verifica si una tabla existe en la base de datos
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' AND tablename = $1
      )
    `, [tableName]);
    
    return result.rows[0].exists;
  } finally {
    client.release();
  }
}

// Si este archivo se ejecuta directamente, realizar la migración
if (require.main === module) {
  (async () => {
    const result = await addWalletSeedPhrasesTableMigration();
    console.log('Resultado de la migración:', result);
    process.exit(0);
  })();
}