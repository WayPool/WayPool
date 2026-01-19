import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Migración para añadir las columnas fee_collection_status y last_collection_date a la tabla position_history
 */
export async function addFeeCollectionStatusMigration() {
  try {
    console.log("Iniciando migración para añadir fee_collection_status y last_collection_date...");

    // Verificar si la columna ya existe (para evitar errores al re-ejecutar)
    const checkResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'position_history' 
      AND column_name = 'fee_collection_status'
    `);

    // Si no existe la columna, añadirla
    if (checkResult.rowCount === 0) {
      // Añadir la columna fee_collection_status
      await db.execute(sql`
        ALTER TABLE position_history 
        ADD COLUMN fee_collection_status TEXT DEFAULT 'Pending',
        ADD COLUMN last_collection_date TIMESTAMP
      `);
      console.log("✅ Migración completada: Columnas fee_collection_status y last_collection_date añadidas a position_history");
    } else {
      console.log("Las columnas ya existen. No se requiere migración.");
    }

    return {
      success: true,
      message: "Migración completada correctamente"
    };
  } catch (error) {
    console.error("Error al ejecutar migración:", error);
    return {
      success: false,
      message: `Error en la migración: ${error}`
    };
  }
}