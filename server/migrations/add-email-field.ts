import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Añade el campo email a la tabla users si no existe.
 */
async function runMigration() {
  try {
    console.log("Iniciando migración para añadir campo email a usuarios...");
    
    // Verificar si la columna ya existe
    const checkColumnExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'email'
    `);
    
    if (checkColumnExists.rowCount === 0) {
      console.log("La columna email no existe. Añadiendo columna...");
      
      // Añadir la columna email
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN email TEXT
      `);
      
      console.log("Columna email añadida correctamente.");
    } else {
      console.log("La columna email ya existe. No se requiere migración.");
    }
    
    console.log("Migración completada exitosamente.");
  } catch (error) {
    console.error("Error en la migración:", error);
    throw error;
  }
}

runMigration()
  .then(() => {
    console.log("Proceso de migración finalizado.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("La migración falló:", error);
    process.exit(1);
  });