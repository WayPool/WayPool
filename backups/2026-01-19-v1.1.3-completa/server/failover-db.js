/**
 * Sistema de conmutación por error (failover) para bases de datos
 * Permite cambiar automáticamente entre la base de datos principal y la secundaria
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import ws from 'ws';
import dotenv from 'dotenv';

// Configurar WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Cargar variables de entorno
dotenv.config();

// Definir rutas de archivos de estado
const STATE_DIR = path.join(process.cwd(), 'db-state');
const PRIMARY_STATE_FILE = path.join(STATE_DIR, 'primary-db-state.json');
const ACTIVE_DB_FILE = path.join(STATE_DIR, 'active-db.json');

// Asegurar que el directorio de estado exista
if (!fs.existsSync(STATE_DIR)) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
}

// Configuración de bases de datos
const dbConfig = {
  primary: {
    connectionString: process.env.DATABASE_URL,
    name: 'Principal (US-East)',
    region: 'us-east'
  },
  secondary: {
    connectionString: process.env.SECONDARY_DATABASE_URL,
    name: 'Secundaria (Europa)',
    region: 'eu-central'
  },
  // Configuración del sistema de failover
  failover: {
    // Intentos fallidos necesarios para cambiar de base de datos
    maxFailedAttempts: 3,
    // Intervalo (ms) entre verificaciones de recuperación tras fallo
    recoveryCheckInterval: 60000, // 1 minuto
    // Tiempo (ms) antes de volver a la primaria tras recuperación
    recoveryGracePeriod: 300000 // 5 minutos
  }
};

// Estado del sistema de failover (con valores por defecto)
let failoverState = {
  activeDb: 'primary', // Base de datos activa actualmente ('primary' o 'secondary')
  primaryFailedAttempts: 0, // Contador de intentos fallidos de conexión a la primaria
  secondaryFailedAttempts: 0, // Contador de intentos fallidos de conexión a la secundaria
  lastPrimaryFailure: null, // Timestamp del último fallo de la primaria
  lastSecondaryFailure: null, // Timestamp del último fallo de la secundaria
  primaryRecovered: null, // Timestamp de recuperación de la primaria
  secondaryRecovered: null, // Timestamp de recuperación de la secundaria
  inFailoverMode: false, // Indica si estamos operando en modo failover (secundaria)
  lastSwitchTime: null, // Timestamp del último cambio entre bases de datos
  lastCheckTime: new Date().toISOString() // Timestamp de la última verificación
};

// Intentar cargar el estado guardado
try {
  if (fs.existsSync(ACTIVE_DB_FILE)) {
    const savedState = JSON.parse(fs.readFileSync(ACTIVE_DB_FILE, 'utf8'));
    failoverState = { ...failoverState, ...savedState };
    console.log(`Estado del sistema de failover cargado`);
  }
} catch (error) {
  console.error(`Error al cargar el estado del sistema de failover:`, error);
  // Continuar con valores por defecto
}

// Pools de conexión
let primaryPool = null;
let secondaryPool = null;

// Funciones de utilidad

/**
 * Guarda el estado actual del sistema de failover
 */
function saveFailoverState() {
  try {
    // Actualizar timestamp de última verificación
    failoverState.lastCheckTime = new Date().toISOString();
    fs.writeFileSync(ACTIVE_DB_FILE, JSON.stringify(failoverState, null, 2));
  } catch (error) {
    console.error(`Error al guardar estado del sistema de failover:`, error);
  }
}

/**
 * Verifica el estado de una conexión a base de datos
 * @param {Pool} pool Conexión a verificar
 * @param {string} dbType Tipo de base de datos ('primary' o 'secondary')
 * @returns {Promise<boolean>} true si la conexión está disponible
 */
async function checkConnection(pool, dbType) {
  try {
    if (!pool) {
      return false;
    }
    
    // Probar conexión con una consulta simple
    await pool.query('SELECT 1');
    
    // Conexión exitosa
    if (dbType === 'primary') {
      failoverState.primaryFailedAttempts = 0;
      failoverState.primaryRecovered = new Date().toISOString();
    } else {
      failoverState.secondaryFailedAttempts = 0;
      failoverState.secondaryRecovered = new Date().toISOString();
    }
    
    return true;
  } catch (error) {
    // Incrementar contador de fallos
    if (dbType === 'primary') {
      failoverState.primaryFailedAttempts++;
      failoverState.lastPrimaryFailure = new Date().toISOString();
      console.error(`❌ Error al conectar a la base de datos principal (intento ${failoverState.primaryFailedAttempts}/${dbConfig.failover.maxFailedAttempts}):`, error.message);
    } else {
      failoverState.secondaryFailedAttempts++;
      failoverState.lastSecondaryFailure = new Date().toISOString();
      
      // Solo mostrar error cada 10 intentos para reducir spam en logs
      if (failoverState.secondaryFailedAttempts % 10 === 0) {
        console.warn(`⚠️ Base de datos secundaria no disponible (${failoverState.secondaryFailedAttempts} intentos fallidos). Sistema funcionando con base principal.`);
      }
    }
    
    return false;
  }
}

/**
 * Cambia la base de datos activa
 * @param {string} dbType Base de datos a activar ('primary' o 'secondary')
 */
function switchActiveDatabase(dbType) {
  // Actualizar estado
  failoverState.activeDb = dbType;
  failoverState.lastSwitchTime = new Date().toISOString();
  failoverState.inFailoverMode = (dbType === 'secondary');
  
  // Guardar estado
  saveFailoverState();
  
  console.log(`⚠️ CAMBIO DE BASE DE DATOS: Ahora usando ${dbType === 'primary' ? 'PRINCIPAL' : 'SECUNDARIA'}`);
}

/**
 * Inicializa las conexiones a las bases de datos
 */
function initializeConnections() {
  try {
    // Crear Pool para la base principal
    if (dbConfig.primary.connectionString) {
      primaryPool = new Pool({ connectionString: dbConfig.primary.connectionString });
      console.log(`Conexión a base de datos principal inicializada`);
    } else {
      console.error(`❌ No se ha configurado la variable de entorno DATABASE_URL para la base de datos principal`);
    }
    
    // Crear Pool para la base secundaria
    if (dbConfig.secondary.connectionString) {
      secondaryPool = new Pool({ connectionString: dbConfig.secondary.connectionString });
      console.log(`Conexión a base de datos secundaria inicializada`);
    } else {
      console.error(`❌ No se ha configurado la variable de entorno SECONDARY_DATABASE_URL para la base de datos secundaria`);
    }
  } catch (error) {
    console.error(`Error al inicializar conexiones:`, error);
  }
}

/**
 * Verifica la disponibilidad de las bases de datos y realiza failover si es necesario
 * Esta función es el corazón del sistema de failover
 */
async function checkDatabasesAndFailover() {
  try {
    console.log(`\nVerificando estado de las bases de datos...`);
    
    // Verificar conexión a la base principal
    const primaryStatus = await checkConnection(primaryPool, 'primary');
    console.log(`Base de datos principal: ${primaryStatus ? 'DISPONIBLE ✅' : 'NO DISPONIBLE ❌'}`);
    
    // Verificar conexión a la base secundaria
    const secondaryStatus = await checkConnection(secondaryPool, 'secondary');
    console.log(`Base de datos secundaria: ${secondaryStatus ? 'DISPONIBLE ✅' : 'NO DISPONIBLE ❌'}`);
    
    // Lógica de failover
    
    // Caso 1: Estamos usando la principal y ha fallado demasiadas veces
    if (failoverState.activeDb === 'primary' && 
        failoverState.primaryFailedAttempts >= dbConfig.failover.maxFailedAttempts && 
        secondaryStatus) {
      console.log(`⚠️ La base de datos principal ha fallado ${failoverState.primaryFailedAttempts} veces. Cambiando a la secundaria...`);
      switchActiveDatabase('secondary');
    }
    
    // Caso 2: Estamos en modo failover, pero la primaria se ha recuperado
    else if (failoverState.activeDb === 'secondary' && primaryStatus) {
      const now = new Date();
      const recoveryTime = new Date(failoverState.primaryRecovered);
      const timeSinceRecovery = now.getTime() - recoveryTime.getTime();
      
      if (timeSinceRecovery >= dbConfig.failover.recoveryGracePeriod) {
        console.log(`La base de datos principal se ha recuperado por ${Math.floor(timeSinceRecovery/1000)} segundos. Volviendo a la principal...`);
        switchActiveDatabase('primary');
      } else {
        console.log(`La base de datos principal se ha recuperado, pero esperando periodo de gracia (${Math.floor((dbConfig.failover.recoveryGracePeriod - timeSinceRecovery)/1000)} segundos restantes)`);
      }
    }
    
    // Caso 3: Ambas bases de datos están caídas
    else if (!primaryStatus && !secondaryStatus) {
      console.error(`❌ ALERTA CRÍTICA: Ambas bases de datos no están disponibles`);
      // Aquí podrías implementar notificaciones adicionales (email, SMS, etc.)
    }
    
    // Guardar estado actual
    saveFailoverState();
    
    // Retornar estado actual
    return {
      primaryStatus,
      secondaryStatus,
      activeDb: failoverState.activeDb,
      inFailoverMode: failoverState.inFailoverMode
    };
  } catch (error) {
    console.error(`Error en la verificación de bases de datos:`, error);
    return {
      error: error.message,
      activeDb: failoverState.activeDb,
      inFailoverMode: failoverState.inFailoverMode
    };
  }
}

/**
 * Obtiene la conexión activa a la base de datos
 * @returns {Pool} Conexión activa a la base de datos
 */
function getActiveConnection() {
  return failoverState.activeDb === 'primary' ? primaryPool : secondaryPool;
}

/**
 * Inicializa el servicio de failover y retorna la conexión activa
 * @returns {Pool} Conexión activa a la base de datos
 */
function initializeFailoverService() {
  // Inicializar conexiones
  initializeConnections();
  
  // Verificar estado inicial
  checkDatabasesAndFailover()
    .then(status => {
      console.log(`Estado inicial del sistema de failover:`, status);
    })
    .catch(err => {
      console.error(`Error en verificación inicial:`, err);
    });
  
  // Programar verificaciones periódicas
  setInterval(checkDatabasesAndFailover, dbConfig.failover.recoveryCheckInterval);
  
  // Retornar conexión activa
  return getActiveConnection();
}

// Exportar la función para inicializar el servicio y obtener la conexión activa
export default initializeFailoverService;

// Exportar funciones adicionales para uso en otros módulos
export {
  checkDatabasesAndFailover,
  getActiveConnection,
  failoverState
};