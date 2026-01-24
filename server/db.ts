
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Base de datos de producción - ep-jolly-butterfly (Azure)
// IMPORTANT: Use DIRECT connection (not pooler) to support options parameter
// The -pooler suffix is removed and options includes search_path
let DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech/neondb?sslmode=require";

// Ensure we're using direct connection (not pooler) for search_path support
if (DATABASE_URL.includes('-pooler')) {
  DATABASE_URL = DATABASE_URL.replace('-pooler', '');
  console.log("🔄 Switched from pooler to direct connection for search_path support");
}

// Add search_path option if not already present
if (!DATABASE_URL.includes('search_path')) {
  DATABASE_URL = DATABASE_URL + '&options=-c%20search_path%3Dpublic';
  console.log("🔧 Added search_path=public to connection options");
}

console.log("🔧 Conectando a base de datos de producción...");
console.log("🔗 Host: ep-jolly-butterfly-a9adjssi.gwc.azure.neon.tech (direct connection)");

// Declare variables at module level
let pool: Pool;
let db: ReturnType<typeof drizzle>;
let getCurrentDb;

// Crear pool de conexión
pool = new Pool({ connectionString: DATABASE_URL });

// Also set search_path on connect as a fallback
pool.on('connect', (client) => {
  client.query('SET search_path TO public');
});

db = drizzle({ client: pool, schema });

console.log("✅ Conectado a base de producción (ep-jolly-butterfly)");

// Export variables at module level
export { pool, db, getCurrentDb };
