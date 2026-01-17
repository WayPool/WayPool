import { pool } from '../db';

/**
 * Migración para crear las tablas necesarias para el sistema de wallet custodiado
 * - custodial_wallets: Tabla principal de billeteras custodiadas
 * - custodial_sessions: Sesiones de acceso a billeteras
 * - custodial_recovery_tokens: Tokens para recuperación de contraseñas
 */
export async function runCustodialWalletMigration() {
  console.log('Iniciando migración de tablas de wallet custodiado...');
  
  try {
    // Verificar si la tabla custodial_wallets ya existe
    const walletTableExists = await checkTableExists('custodial_wallets');
    
    if (!walletTableExists) {
      console.log('Creando tabla custodial_wallets...');
      
      await pool.query(`
        CREATE TABLE custodial_wallets (
          id SERIAL PRIMARY KEY,
          address VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          salt VARCHAR(255) NOT NULL,
          encrypted_private_key TEXT NOT NULL,
          encryption_iv VARCHAR(255) NOT NULL,
          active BOOLEAN DEFAULT TRUE,
          last_login_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL
        )
      `);
      
      console.log('Tabla custodial_wallets creada exitosamente');
    } else {
      console.log('La tabla custodial_wallets ya existe, omitiendo creación');
    }
    
    // Verificar si la tabla custodial_sessions ya existe
    const sessionTableExists = await checkTableExists('custodial_sessions');
    
    if (!sessionTableExists) {
      console.log('Creando tabla custodial_sessions...');
      
      await pool.query(`
        CREATE TABLE custodial_sessions (
          id SERIAL PRIMARY KEY,
          wallet_id INTEGER NOT NULL,
          address VARCHAR(255) NOT NULL,
          session_token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (wallet_id) REFERENCES custodial_wallets(id) ON DELETE CASCADE
        )
      `);
      
      console.log('Tabla custodial_sessions creada exitosamente');
    } else {
      console.log('La tabla custodial_sessions ya existe, omitiendo creación');
    }
    
    // Verificar si la tabla custodial_recovery_tokens ya existe
    const recoveryTableExists = await checkTableExists('custodial_recovery_tokens');
    
    if (!recoveryTableExists) {
      console.log('Creando tabla custodial_recovery_tokens...');
      
      await pool.query(`
        CREATE TABLE custodial_recovery_tokens (
          id SERIAL PRIMARY KEY,
          wallet_id INTEGER NOT NULL,
          email VARCHAR(255) NOT NULL,
          recovery_token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      
      console.log('Tabla custodial_recovery_tokens creada exitosamente');
    } else {
      console.log('La tabla custodial_recovery_tokens ya existe, omitiendo creación');
    }
    
    // Verificar columna last_login_at en custodial_wallets
    // Esta columna se utiliza para realizar un seguimiento del último inicio de sesión
    const lastLoginColumnExists = await checkColumnExists('custodial_wallets', 'last_login_at');
    
    if (!lastLoginColumnExists) {
      console.log('Añadiendo columna last_login_at a custodial_wallets...');
      
      await pool.query(`
        ALTER TABLE custodial_wallets 
        ADD COLUMN last_login_at TIMESTAMP
      `);
      
      console.log('Columna last_login_at añadida a custodial_wallets');
    } else {
      console.log('La columna last_login_at ya existe en custodial_wallets, omitiendo');
    }
    
    // Verificar y añadir restricciones de clave foránea si las tablas ya existen
    if (sessionTableExists) {
      // Verificar si ya existe la restricción de clave foránea wallet_id -> custodial_wallets.id
      const sessionFkExists = await checkForeignKeyExists('custodial_sessions', 'wallet_id', 'custodial_wallets', 'id');
      
      if (!sessionFkExists) {
        console.log('Añadiendo restricción de clave foránea a custodial_sessions.wallet_id...');
        
        try {
          await pool.query(`
            ALTER TABLE custodial_sessions
            ADD CONSTRAINT custodial_sessions_wallet_id_fkey
            FOREIGN KEY (wallet_id) REFERENCES custodial_wallets(id) ON DELETE CASCADE
          `);
          
          console.log('Restricción de clave foránea añadida a custodial_sessions.wallet_id');
        } catch (error) {
          console.error('Error al añadir restricción de clave foránea a custodial_sessions:', error);
          // No falla la migración por esto, pero lo registra
        }
      } else {
        console.log('La restricción de clave foránea ya existe para custodial_sessions.wallet_id');
      }
      
      // Comprobar si existe una restricción errónea en address que necesita ser eliminada
      const addressFkExists = await checkForeignKeyExists('custodial_sessions', 'address', 'custodial_wallets', 'address');
      
      if (addressFkExists) {
        console.log('Eliminando restricción de clave foránea incorrecta en custodial_sessions.address...');
        
        try {
          await pool.query(`
            ALTER TABLE custodial_sessions
            DROP CONSTRAINT custodial_sessions_address_fkey
          `);
          
          console.log('Restricción de clave foránea eliminada de custodial_sessions.address');
        } catch (error) {
          console.error('Error al eliminar restricción de clave foránea de custodial_sessions.address:', error);
          // No falla la migración por esto, pero lo registra
        }
      }
    }
    
    if (recoveryTableExists) {
      // Verificar si ya existe la restricción de clave foránea wallet_id -> custodial_wallets.id
      const recoveryFkExists = await checkForeignKeyExists('custodial_recovery_tokens', 'wallet_id', 'custodial_wallets', 'id');
      
      if (!recoveryFkExists) {
        console.log('Añadiendo restricción de clave foránea a custodial_recovery_tokens.wallet_id...');
        
        try {
          await pool.query(`
            ALTER TABLE custodial_recovery_tokens
            ADD CONSTRAINT custodial_recovery_tokens_wallet_id_fkey
            FOREIGN KEY (wallet_id) REFERENCES custodial_wallets(id) ON DELETE CASCADE
          `);
          
          console.log('Restricción de clave foránea añadida a custodial_recovery_tokens.wallet_id');
        } catch (error) {
          console.error('Error al añadir restricción de clave foránea a custodial_recovery_tokens:', error);
          // No falla la migración por esto, pero lo registra
        }
      } else {
        console.log('La restricción de clave foránea ya existe para custodial_recovery_tokens.wallet_id');
      }
    }
    
    console.log('Migración de tablas de wallet custodiado completada con éxito');
    
    return true;
  } catch (error) {
    console.error('Error en la migración de tablas de wallet custodiado:', error);
    throw error;
  }
}

/**
 * Función auxiliar para verificar si una tabla existe
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )
  `;
  
  const result = await pool.query(query, [tableName]);
  return result.rows[0].exists;
}

/**
 * Función auxiliar para verificar si una columna existe en una tabla
 */
async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = $1 
      AND column_name = $2
    )
  `;
  
  const result = await pool.query(query, [tableName, columnName]);
  return result.rows[0].exists;
}

/**
 * Función auxiliar para verificar si existe una restricción de clave foránea
 */
async function checkForeignKeyExists(
  childTable: string, 
  childColumn: string, 
  parentTable: string, 
  parentColumn: string
): Promise<boolean> {
  try {
    const query = `
      SELECT EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
        JOIN pg_class child ON child.oid = c.conrelid
        JOIN pg_class parent ON parent.oid = c.confrelid
        JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
        WHERE c.contype = 'f'
          AND child.relname = $1
          AND a.attname = $2
          AND parent.relname = $3
          AND af.attname = $4
      )
    `;
    
    const result = await pool.query(query, [childTable, childColumn, parentTable, parentColumn]);
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error verificando restricción de clave foránea ${childTable}.${childColumn} -> ${parentTable}.${parentColumn}:`, error);
    return false; // Asume que no existe en caso de error
  }
}