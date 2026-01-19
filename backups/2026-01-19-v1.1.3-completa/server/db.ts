
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Base de datos de producción - ep-jolly-butterfly (Azure)
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require";

console.log("🔧 Conectando a base de datos de producción...");
console.log("🔗 Host: ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech");

// Declare variables at module level
let pool;
let db;
let getCurrentDb;

// Crear pool de conexión
pool = new Pool({ connectionString: DATABASE_URL });
db = drizzle({ client: pool, schema });

console.log("✅ Conectado a base de producción (ep-jolly-butterfly)");

// Export variables at module level
export { pool, db, getCurrentDb };
