import { sql } from "drizzle-orm";
import { db } from "./db";

/**
 * Función para ejecutar la migración de la tabla app_config
 * Esta tabla se usa para almacenar configuraciones globales de la aplicación
 */
export async function migrateAppConfigTable() {
  try {
    console.log("Running app_config table migration...");
    
    // Verificar si la tabla ya existe
    const tableExists = await checkIfTableExists("app_config");
    
    if (tableExists) {
      console.log("app_config table already exists, skipping migration");
      return;
    }
    
    // Crear la tabla si no existe - use explicit public schema
    await db.execute(sql`
      CREATE TABLE public.app_config (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("app_config table created successfully");

    // Inicializar con la versión por defecto
    await db.execute(sql`
      INSERT INTO public.app_config (key, value, description)
      VALUES ('app_version', '1.0.0', 'Versión actual de la aplicación')
    `);
    
    console.log("Default app_version config created");
    
  } catch (error) {
    console.error("Error during app_config table migration:", error);
    throw error;
  }
}

/**
 * Función auxiliar para verificar si una tabla existe
 */
async function checkIfTableExists(tableName: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
      )
    `);
    
    return result.rows[0]?.exists === true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}