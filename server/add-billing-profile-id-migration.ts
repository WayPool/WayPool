import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Migración para añadir la columna billing_profile_id a la tabla de facturas
 */
export async function addBillingProfileIdColumnMigration() {
  console.log('Running billing_profile_id column migration for invoices table...');
  
  try {
    // Verificar si la columna billing_profile_id ya existe en la tabla invoices
    const columnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'invoices'
        AND column_name = 'billing_profile_id'
      );
    `);
    
    // Si la columna ya existe, omitir la migración
    if (columnExists.rows && columnExists.rows.length > 0 && columnExists.rows[0].exists) {
      console.log('billing_profile_id column already exists in invoices table, skipping migration');
      return true;
    }
    
    // Añadir la columna billing_profile_id a la tabla invoices - use explicit public schema
    await db.execute(sql`
      ALTER TABLE public.invoices
      ADD COLUMN billing_profile_id INTEGER REFERENCES public.billing_profiles(id) ON DELETE SET NULL;
    `);
    
    console.log('billing_profile_id column added to invoices table successfully');
    return true;
  } catch (error) {
    console.error('Error adding billing_profile_id column to invoices table:', error);
    return false;
  }
}