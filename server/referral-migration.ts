import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Migración para crear las tablas del sistema de referidos
 */
export async function addReferralTablesMigration() {
  console.log('Running referral tables migration...');
  
  try {
    // Verificar si la tabla referrals ya existe
    const resultReferrals = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'referrals'
      );
    `);
    
    // Si la tabla ya existe, omitir la migración
    if (resultReferrals.rows && resultReferrals.rows.length > 0 && resultReferrals.rows[0].exists) {
      console.log('Referrals table already exists, skipping migration');
      return true;
    }
    
    // Crear la tabla referrals
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS referrals (
        id SERIAL PRIMARY KEY,
        referral_code TEXT NOT NULL UNIQUE,
        wallet_address TEXT NOT NULL,
        total_rewards DECIMAL(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Referrals table created successfully');
    
    // Crear la tabla referred_users
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS referred_users (
        id SERIAL PRIMARY KEY,
        referral_id INTEGER NOT NULL REFERENCES referrals(id),
        referred_wallet_address TEXT NOT NULL UNIQUE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'active',
        earned_rewards DECIMAL(12,2) DEFAULT 0,
        apr_boost DECIMAL(5,2) DEFAULT 1.00
      );
    `);
    
    console.log('Referred users table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating referral tables:', error);
    return false;
  }
}

/**
 * Migración para crear la tabla de suscriptores al programa de referidos
 */
export async function addReferralSubscribersTableMigration() {
  console.log('Running referral subscribers table migration...');
  
  try {
    // Verificar si la tabla ya existe
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'referral_subscribers'
      );
    `);
    
    // Si la tabla ya existe, omitir la migración
    if (result.rows && result.rows.length > 0 && result.rows[0].exists) {
      console.log('Referral subscribers table already exists, skipping migration');
      return true;
    }
    
    // Crear la tabla de suscriptores
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS referral_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        language TEXT NOT NULL DEFAULT 'es',
        name TEXT,
        referral_code TEXT,
        active BOOLEAN DEFAULT TRUE,
        last_email_sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Referral subscribers table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating referral subscribers table:', error);
    return false;
  }
}