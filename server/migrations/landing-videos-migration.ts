import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Función para ejecutar la migración de la tabla landing_videos
 * Esta tabla se usa para almacenar URLs de videos multilingües para la landing page
 */
export async function migrateLandingVideosTable() {
  try {
    console.log('[Migración] Iniciando migración de la tabla landing_videos');
    
    // Verificar si la tabla ya existe
    const exists = await checkIfTableExists('landing_videos');
    
    if (exists) {
      console.log('[Migración] La tabla landing_videos ya existe, omitiendo creación');
      return true;
    }
    
    // Crear la tabla si no existe - use explicit public schema
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS public.landing_videos (
        id SERIAL PRIMARY KEY,
        language TEXT NOT NULL,
        main_video_url TEXT NOT NULL,
        full_video_url TEXT,
        video_type TEXT DEFAULT 'video/mp4',
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        created_by TEXT
      );
    `);

    console.log('[Migración] Tabla landing_videos creada exitosamente');

    // Añadir video por defecto para español
    await db.execute(sql`
      INSERT INTO public.landing_videos
        (language, main_video_url, full_video_url, active, created_by)
      VALUES
        ('es', 'https://waybank.info/videos/welcome-es.mp4', 'https://www.youtube.com/watch?v=example_es', true, 'system_migration');
    `);

    // Añadir video por defecto para inglés
    await db.execute(sql`
      INSERT INTO public.landing_videos
        (language, main_video_url, full_video_url, active, created_by)
      VALUES
        ('en', 'https://waybank.info/videos/welcome-en.mp4', 'https://www.youtube.com/watch?v=example_en', true, 'system_migration');
    `);
    
    console.log('[Migración] Videos por defecto añadidos para es y en');
    
    return true;
  } catch (error) {
    console.error('[Migración] Error al crear la tabla landing_videos:', error);
    return false;
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
      );
    `);
    
    // Necesitamos convertir explícitamente a booleano
    const existsValue = result.rows[0]?.exists;
    return existsValue === 't' || existsValue === true;
  } catch (error) {
    console.error(`[Migración] Error al verificar si existe la tabla ${tableName}:`, error);
    return false;
  }
}