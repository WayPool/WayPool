import { PgDialect } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { managedNfts } from "@shared/schema";
import { sql } from "drizzle-orm";

/**
 * Migración para crear la tabla managed_nfts para gestionar NFTs desde el panel de administración
 */
export async function runManagedNftsMigration(pool: Pool): Promise<void> {
  console.log("Verificando si es necesario crear la tabla managed_nfts...");
  
  // Crear cliente de Drizzle
  const db = drizzle(pool, { dialect: new PgDialect() });
  
  try {
    // Verificar si la tabla ya existe
    const tableExistsResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'managed_nfts'
      );
    `);
    
    const tableExists = tableExistsResult.rows && tableExistsResult.rows.length > 0 && tableExistsResult.rows[0].exists;
    
    if (!tableExists) {
      console.log("Creando tabla managed_nfts...");
      
      // Crear el tipo enum para status si no existe
      await db.execute(sql`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nft_status') THEN
            CREATE TYPE nft_status AS ENUM ('Active', 'Unknown', 'Closed', 'Finalized');
          END IF;
        END
        $$;
      `);
      
      // Crear la tabla managed_nfts
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS managed_nfts (
          id SERIAL PRIMARY KEY,
          network TEXT NOT NULL,
          version TEXT NOT NULL,
          token_id TEXT NOT NULL,
          contract_address TEXT,
          token0_symbol TEXT DEFAULT 'Unknown',
          token1_symbol TEXT DEFAULT 'Unknown',
          value_usdc DECIMAL(12, 2),
          status nft_status DEFAULT 'Active',
          fee_tier TEXT,
          pool_address TEXT,
          image_url TEXT,
          additional_data JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          created_by TEXT
        );
      `);
      
      console.log("Tabla managed_nfts creada exitosamente.");
    } else {
      console.log("La tabla managed_nfts ya existe. Verificando si necesita actualizaciones...");
      
      // Crear el tipo enum para status si no existe
      await db.execute(sql`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nft_status') THEN
            CREATE TYPE nft_status AS ENUM ('Active', 'Unknown', 'Closed', 'Finalized');
          END IF;
        END
        $$;
      `);
      
      // Verificar si la columna status existe
      const columnExistsResult = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'managed_nfts'
          AND column_name = 'status'
        );
      `);
      
      const columnExists = columnExistsResult.rows && columnExistsResult.rows.length > 0 && columnExistsResult.rows[0].exists;
      
      if (!columnExists) {
        console.log("Añadiendo columna 'status' a la tabla managed_nfts...");
        await db.execute(sql`
          ALTER TABLE managed_nfts
          ADD COLUMN status nft_status DEFAULT 'Active';
        `);
        console.log("Columna 'status' añadida exitosamente.");
      } else {
        console.log("La columna 'status' ya existe en la tabla managed_nfts.");
      }
    }
    
  } catch (error) {
    console.error("Error creando tabla managed_nfts:", error);
    throw error;
  }
}