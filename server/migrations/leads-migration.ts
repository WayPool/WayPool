import { sql } from 'drizzle-orm';
import { Pool } from '@neondatabase/serverless';

/**
 * Migración para crear la tabla de leads capturados desde la landing page
 */
export async function runLeadsMigration(pool: Pool) {
  console.log('Verificando si es necesario crear la tabla leads...');
  
  try {
    // Verificar si la tabla ya existe
    const tableExistsResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'leads'
      );
    `);
    
    const tableExists = tableExistsResult.rows[0].exists;
    
    if (tableExists) {
      console.log('La tabla leads ya existe. Verificando si necesita actualizaciones...');
      
      // Verificar si el enum lead_status existe
      const enumExistsResult = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM pg_type
          WHERE typname = 'lead_status'
        );
      `);
      
      const enumExists = enumExistsResult.rows[0].exists;
      
      if (!enumExists) {
        console.log('Creando enum lead_status...');
        await pool.query(`
          CREATE TYPE lead_status AS ENUM (
            'nuevo',
            'contactado',
            'interesado',
            'convertido',
            'no_interesado',
            'inactivo'
          );
        `);
        console.log('Enum lead_status creado exitosamente');
      }
      
      // Verificar y actualizar columnas
      const columns = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'leads';
      `);
      
      const columnNames = columns.rows.map(row => row.column_name);
      
      // Verificar y añadir columnas que faltan - use explicit public schema
      if (!columnNames.includes('status')) {
        console.log('Añadiendo columna status...');
        await pool.query(`
          ALTER TABLE public.leads
          ADD COLUMN status lead_status DEFAULT 'nuevo';
        `);
      }

      if (!columnNames.includes('follow_up_date')) {
        console.log('Añadiendo columna follow_up_date...');
        await pool.query(`
          ALTER TABLE public.leads
          ADD COLUMN follow_up_date TIMESTAMP;
        `);
      }

      if (!columnNames.includes('last_contact')) {
        console.log('Añadiendo columna last_contact...');
        await pool.query(`
          ALTER TABLE public.leads
          ADD COLUMN last_contact TIMESTAMP;
        `);
      }

      if (!columnNames.includes('language_preference')) {
        console.log('Añadiendo columna language_preference...');
        await pool.query(`
          ALTER TABLE public.leads
          ADD COLUMN language_preference TEXT DEFAULT 'es';
        `);
      }

      if (!columnNames.includes('original_referrer')) {
        console.log('Añadiendo columna original_referrer...');
        await pool.query(`
          ALTER TABLE public.leads
          ADD COLUMN original_referrer TEXT;
        `);
      }

      if (!columnNames.includes('additional_data')) {
        console.log('Añadiendo columna additional_data...');
        await pool.query(`
          ALTER TABLE public.leads
          ADD COLUMN additional_data JSONB;
        `);
      }

      if (!columnNames.includes('updated_at')) {
        console.log('Añadiendo columna updated_at...');
        await pool.query(`
          ALTER TABLE public.leads
          ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        `);
      }
      
      console.log('Tabla leads actualizada correctamente');
      return true;
    }
    
    // Crear enum lead_status si no existe
    const enumExistsResult = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'lead_status'
      );
    `);
    
    const enumExists = enumExistsResult.rows[0].exists;
    
    if (!enumExists) {
      console.log('Creando enum lead_status...');
      await pool.query(`
        CREATE TYPE lead_status AS ENUM (
          'nuevo',
          'contactado',
          'interesado',
          'convertido',
          'no_interesado',
          'inactivo'
        );
      `);
      console.log('Enum lead_status creado exitosamente');
    }
    
    // Crear tabla leads - use explicit public schema
    console.log('Creando tabla leads...');
    await pool.query(`
      CREATE TABLE public.leads (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        investment_size TEXT NOT NULL,
        message TEXT,
        consent_given BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status lead_status DEFAULT 'nuevo',
        assigned_to TEXT,
        notes TEXT,
        source TEXT DEFAULT 'landing_page',
        follow_up_date TIMESTAMP,
        last_contact TIMESTAMP,
        language_preference TEXT DEFAULT 'es',
        original_referrer TEXT,
        additional_data JSONB
      );
    `);
    
    console.log('Tabla leads creada exitosamente');
    return true;
  } catch (error) {
    console.error('Error en la migración de leads:', error);
    return false;
  }
}