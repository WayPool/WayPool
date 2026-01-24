import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Base de datos de producción - ep-jolly-butterfly (Azure)
// IMPORTANT: Use DIRECT connection (not pooler) to support options parameter
let PRODUCTION_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require";

// Ensure we're using direct connection (not pooler) for search_path support
if (PRODUCTION_URL.includes('-pooler')) {
  PRODUCTION_URL = PRODUCTION_URL.replace('-pooler', '');
  console.log("🔄 Switched from pooler to direct connection for search_path support");
}

// Add search_path option if not already present
if (!PRODUCTION_URL.includes('search_path')) {
  PRODUCTION_URL = PRODUCTION_URL + '&options=-c%20search_path%3Dpublic';
  console.log("🔧 Added search_path=public to connection options");
}

console.log("🚀 Conectando a base de producción (ep-jolly-butterfly)...");
console.log("🔗 Host: ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech (direct connection)");

// Crear nueva conexión directa
const productionPool = new Pool({ connectionString: PRODUCTION_URL });

// Also set search_path on connect as a fallback
productionPool.on('connect', (client) => {
  client.query('SET search_path TO public');
});

const productionDb = drizzle({ client: productionPool, schema });

console.log("✅ Conexión de producción establecida");

export { productionPool as pool, productionDb as db };