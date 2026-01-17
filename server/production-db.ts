import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Base de datos de producción - ep-jolly-butterfly (Azure)
const PRODUCTION_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require";

console.log("🚀 Conectando a base de producción (ep-jolly-butterfly)...");

// Crear nueva conexión directa
const productionPool = new Pool({ connectionString: PRODUCTION_URL });
const productionDb = drizzle({ client: productionPool, schema });

console.log("✅ Conexión de producción establecida");

export { productionPool as pool, productionDb as db };