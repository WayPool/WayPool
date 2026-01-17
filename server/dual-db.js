/**
 * MÓDULO DE CONEXIÓN DUAL DE BASES DE DATOS
 * Maneja conexiones simultáneas a la base principal y secundaria
 */

import { Pool } from '@neondatabase/serverless';

// Conexiones a las dos bases de datos
const primaryPool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

const secondaryPool = new Pool({ 
  connectionString: process.env.SECONDARY_DATABASE_URL 
});

/**
 * Ejecuta una consulta en ambas bases de datos
 * @param {string} query - La consulta SQL
 * @param {Array} params - Parámetros de la consulta
 * @returns {Promise} Resultado de la base principal
 */
export async function dualQuery(query, params = []) {
  try {
    // Ejecutar en base principal
    const primaryResult = await primaryPool.query(query, params);
    
    // Ejecutar en base secundaria (sin esperar a que termine)
    secondaryPool.query(query, params).catch(error => {
      console.warn('⚠️ Error en base secundaria:', error.message);
    });
    
    return primaryResult;
  } catch (error) {
    console.error('❌ Error en base principal:', error.message);
    throw error;
  }
}

/**
 * Ejecuta una consulta solo en la base principal (para lecturas)
 * @param {string} query - La consulta SQL
 * @param {Array} params - Parámetros de la consulta
 * @returns {Promise} Resultado de la consulta
 */
export async function primaryQuery(query, params = []) {
  return await primaryPool.query(query, params);
}

/**
 * Sincroniza datos de la base principal a la secundaria
 * @param {string} tableName - Nombre de la tabla a sincronizar
 */
export async function syncTable(tableName) {
  try {
    // Obtener datos de la base principal
    const data = await primaryPool.query(`SELECT * FROM ${tableName}`);
    
    // Limpiar tabla secundaria
    await secondaryPool.query(`TRUNCATE TABLE ${tableName} CASCADE`);
    
    // Insertar datos en base secundaria
    if (data.rows.length > 0) {
      const columns = Object.keys(data.rows[0]);
      const values = data.rows.map(row => 
        `(${columns.map(col => `'${row[col]}'`).join(', ')})`
      ).join(', ');
      
      await secondaryPool.query(
        `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values}`
      );
    }
    
    console.log(`✅ Tabla ${tableName} sincronizada: ${data.rows.length} registros`);
  } catch (error) {
    console.error(`❌ Error sincronizando ${tableName}:`, error.message);
  }
}

export { primaryPool, secondaryPool };
