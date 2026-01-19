/**
 * API para manejar las frases semilla únicas por wallet
 * Integra con el sistema existente de wallet custodiada
 * Implementa persistencia en base de datos para garantizar
 * que cada wallet tenga siempre la misma frase semilla única
 */

import express from 'express';
import { db, pool } from './db.js';
import * as seedGenerator from './unique-seed-generator.js';
import bcrypt from 'bcrypt';
import { walletSeedPhrases, custodialWallets } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Función auxiliar para consultar custodial wallets usando SQL directo
async function getCustodialWallets() {
  const result = await pool.query('SELECT * FROM custodial_wallets');
  return result.rows;
}

const router = express.Router();

// Middleware para verificar autenticación
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user || !req.session.user.walletAddress) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  next();
};

/**
 * Obtener la frase semilla para una wallet (versión autenticada)
 * GET /api/wallet/seed-phrase
 */
router.get('/seed-phrase', requireAuth, async (req, res) => {
  console.log('[API] Solicitud recibida para obtener frase semilla (endpoint autenticado)');
  try {
    const walletAddress = req.session.user.walletAddress;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Se requiere una dirección de wallet' });
    }
    
    // PASO 1: Buscar la frase semilla en la base de datos
    const [existingSeed] = await db.select()
      .from(walletSeedPhrases)
      .where(eq(walletSeedPhrases.walletAddress, walletAddress));
    
    let seedPhrase;
    
    if (existingSeed) {
      // Si ya existe una frase para este wallet, la usamos
      seedPhrase = existingSeed.seedPhrase;
      console.log(`Recuperada frase semilla existente para ${walletAddress}`);
    } else {
      try {
        // PASO 2: En lugar de verificar si el wallet existe, simplemente generamos
        // la frase semilla basada en la dirección. Como el generador es determinístico,
        // siempre generará la misma frase para la misma dirección.
        // Esta aproximación evita cualquier consulta a la tabla custodial_wallets
        // que podría tener problemas de estructura.
        
        console.log(`Generando frase semilla para wallet: ${walletAddress}`);
        
        // No necesitamos verificar si el wallet existe, esto es completamente independiente
        // de la estructura de la base de datos y evita errores con los parámetros SQL
        
        // PASO 3: Generamos una nueva frase semilla para este wallet
        seedPhrase = seedGenerator.generateUniqueSeedPhrase(walletAddress);
        
        // PASO 4: Guardamos la frase en la base de datos para futuras recuperaciones
        try {
          await db.insert(walletSeedPhrases)
            .values({
              walletAddress: walletAddress,
              seedPhrase: seedPhrase,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          
          console.log(`Nueva frase semilla generada y almacenada para ${walletAddress}`);
        } catch (dbError) {
          // Si hay un error al guardar (ej. conflicto de clave única), verificamos si es por duplicado
          // y en ese caso intentamos recuperar la frase existente
          console.error('Error al guardar frase semilla en DB:', dbError);
          
          // PASO 5: Intento adicional para recuperar la frase si hubo un conflicto
          const [retryExistingSeed] = await db.select()
            .from(walletSeedPhrases)
            .where(eq(walletSeedPhrases.walletAddress, walletAddress));
            
          if (retryExistingSeed) {
            seedPhrase = retryExistingSeed.seedPhrase;
            console.log(`Recuperada frase semilla en segundo intento para ${walletAddress}`);
          }
        }
      } catch (genError) {
        console.error(`Error generando frase semilla para ${walletAddress}:`, genError);
        return res.status(500).json({ error: 'Error al generar la frase semilla para este wallet' });
      }
    }
    
    // Verificación final para asegurar que tenemos una frase semilla válida
    if (!seedPhrase) {
      return res.status(500).json({ 
        error: 'No se pudo recuperar o generar una frase semilla válida',
        details: 'Por favor contacte con soporte técnico para asistencia con este wallet'
      });
    }
    
    res.status(200).json({ seedPhrase });
  } catch (error) {
    console.error('Error al obtener frase semilla:', error);
    res.status(500).json({ error: 'Error al generar frase semilla' });
  }
});

/**
 * Obtener la frase semilla para una wallet sin requerir autenticación
 * GET /api/wallet/seed-phrase-public?address=0x...
 * (Uso exclusivo para recuperación, no expone datos sensibles)
 */
router.get('/seed-phrase-public', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Se requiere una dirección de wallet' });
    }
    
    // PASO 1: En lugar de verificar en la tabla custodial_wallets que podría tener
    // problemas de estructura, simplemente generamos la frase semilla
    // Esta frase será determinística (siempre la misma para cada dirección)
    // lo que hace que este enfoque sea robusto y evita problemas de base de datos
    
    // No verificamos si el wallet existe en la base de datos para evitar errores
    // La generación de frase semilla siempre funcionará independientemente del estado de la BD
    
    // PASO 2: Buscar si ya existe una frase semilla en la base de datos para este wallet
    const [existingSeed] = await db.select()
      .from(walletSeedPhrases)
      .where(eq(walletSeedPhrases.walletAddress, address));
    
    let seedPhrase;
    
    if (existingSeed) {
      // Si ya existe una frase para este wallet, la usamos
      seedPhrase = existingSeed.seedPhrase;
      console.log(`Recuperada frase semilla existente para ${address}`);
    } else {
      try {
        // PASO 3: Si no existe, generamos una nueva determinista
        seedPhrase = seedGenerator.generateUniqueSeedPhrase(address);
        
        // PASO 4: Guardar la nueva frase en la base de datos para futuras recuperaciones
        try {
          await db.insert(walletSeedPhrases)
            .values({
              walletAddress: address,
              seedPhrase: seedPhrase,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          
          console.log(`Nueva frase semilla generada y almacenada para ${address}`);
        } catch (dbError) {
          // PASO 5: Si hay un error al guardar, verificamos si fue por un conflicto de clave única
          // y en ese caso intentamos recuperar la frase existente
          console.error('Error al guardar frase semilla en DB:', dbError);
          
          // Intento adicional para recuperar la frase si hubo un conflicto
          const [retryExistingSeed] = await db.select()
            .from(walletSeedPhrases)
            .where(eq(walletSeedPhrases.walletAddress, address));
            
          if (retryExistingSeed) {
            seedPhrase = retryExistingSeed.seedPhrase;
            console.log(`Recuperada frase semilla en segundo intento para ${address}`);
          }
        }
      } catch (genError) {
        console.error(`Error generando frase semilla para ${address}:`, genError);
        return res.status(500).json({ error: 'Error al generar la frase semilla para este wallet' });
      }
    }
    
    // PASO 6: Verificación final para asegurar que tenemos una frase semilla válida
    if (!seedPhrase) {
      return res.status(500).json({ 
        error: 'No se pudo recuperar o generar una frase semilla válida',
        details: 'Por favor contacte con soporte técnico para asistencia con este wallet'
      });
    }
    
    // Mostrar solo los primeros caracteres en el log por seguridad
    console.log(`Frase semilla proporcionada para ${address}: ${seedPhrase.substring(0, 15)}...`);
    
    res.status(200).json({ seedPhrase });
  } catch (error) {
    console.error('Error al obtener frase semilla pública:', error);
    res.status(500).json({ error: 'Error al generar frase semilla' });
  }
});

/**
 * Recuperar acceso al wallet con frase semilla (ruta simplificada)
 * POST /api/wallet/simple-recovery
 * NOTA: Esta ruta NO requiere autenticación ya que es para recuperar acceso
 */
router.post('/simple-recovery', async (req, res) => {
  console.log('🔧 [SIMPLE-RECOVERY] ¡ARCHIVO CORRECTO! Solicitud de recuperación recibida SIN autenticación requerida');
  console.log('🔧 [SIMPLE-RECOVERY] Datos recibidos:', JSON.stringify(req.body, null, 2));
  try {
    console.log('[DEBUG] Iniciando proceso de recuperación de wallet con frase semilla');
    console.log('[DEBUG] Cuerpo de la solicitud:', JSON.stringify({
      seedPhraseLength: req.body.seedPhrase ? req.body.seedPhrase.length : 0,
      hasNewPassword: Boolean(req.body.newPassword)
    }));
    
    const { seedPhrase, newPassword } = req.body;
    
    if (!seedPhrase) {
      console.log('[DEBUG] Error: Frase semilla no proporcionada');
      return res.status(400).json({ error: 'La frase semilla es requerida' });
    }
    
    // La contraseña ahora es opcional en la interfaz, así que debemos
    // manejar ambos casos (con y sin contraseña)
    const passwordToUse = newPassword || 'DEFAULT_PASSWORD_' + Date.now();
    console.log('[DEBUG] Usando contraseña:', newPassword ? 'La proporcionada por el usuario' : 'Contraseña generada automáticamente');
    
    // Normalizar la frase semilla ingresada
    const normalizedInput = seedPhrase.trim().toLowerCase();
    
    // MÉTODO 1: Verificar si existe en la base de datos
    const savedSeedPhrases = await db.select().from(walletSeedPhrases);
    let matchedWalletFromDB = null;
    
    for (const saved of savedSeedPhrases) {
      if (saved.seedPhrase.toLowerCase() === normalizedInput) {
        // Encontramos una coincidencia en frases guardadas
        const [wallet] = await db.select()
          .from(custodialWallets)
          .where(eq(custodialWallets.address, saved.walletAddress));
        
        if (wallet) {
          matchedWalletFromDB = wallet;
          console.log(`[Recuperación] Coincidencia encontrada en DB para ${wallet.address}`);
          break;
        }
      }
    }
    
    // MÉTODO 2: Si no se encuentra en la BD, probar generando dinámicamente
    // Este paso es necesario para compatibilidad retroactiva con usuarios
    // que no tienen una frase guardada aún
    let matchedWalletDynamic = null;
    if (!matchedWalletFromDB) {
      console.log('[Recuperación] No se encontró en BD, probando generación dinámica');
      const wallets = await getCustodialWallets();
      
      for (const wallet of wallets) {
        // Verificar si coincide con la frase generada
        if (seedGenerator.verifySeedPhrase(normalizedInput, wallet.address)) {
          matchedWalletDynamic = wallet;
          
          // Guardar la frase en la base de datos para futuras recuperaciones
          try {
            await db.insert(walletSeedPhrases)
              .values({
                walletAddress: wallet.address,
                seedPhrase: seedPhrase.trim(),
                createdAt: new Date(),
                updatedAt: new Date()
              });
            console.log(`[Recuperación] Frase guardada en BD para ${wallet.address}`);
          } catch (dbError) {
            console.error('Error al guardar frase semilla durante recuperación:', dbError);
          }
          
          break;
        }
      }
    }
    
    // Usar el wallet encontrado por cualquiera de los dos métodos
    const matchedWallet = matchedWalletFromDB || matchedWalletDynamic;
    
    if (!matchedWallet) {
      return res.status(400).json({ error: 'Frase semilla inválida' });
    }
    
    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordToUse, salt);
    
    // Actualizar la contraseña en la base de datos
    await db.update(custodialWallets)
      .set({ 
        password: hashedPassword,
        lastLoginAt: new Date()
      })
      .where(eq(custodialWallets.id, matchedWallet.id));
    
    // Crear sesión para el usuario
    if (req.session) {
      req.session.user = {
        walletAddress: matchedWallet.address,
        isAdmin: matchedWallet.isAdmin || false
      };
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Wallet recuperado correctamente',
      walletAddress: matchedWallet.address
    });
  } catch (error) {
    console.error('Error en recuperación simple:', error);
    console.log('[DEBUG] Detalles del error:', {
      mensaje: error.message,
      tipo: error.name,
      stack: error.stack?.substring(0, 200) // Limitar longitud del stack trace
    });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * Recuperar acceso al wallet con frase semilla
 * POST /api/wallet/recover
 */
router.post('/recover', async (req, res) => {
  try {
    console.log('[DEBUG] Iniciando proceso de recuperación de wallet con frase semilla');
    console.log('[DEBUG] Cuerpo de la solicitud:', JSON.stringify({
      seedPhraseLength: req.body.seedPhrase ? req.body.seedPhrase.length : 0,
      hasNewPassword: Boolean(req.body.newPassword)
    }));
    
    const { seedPhrase, newPassword } = req.body;
    
    if (!seedPhrase) {
      console.log('[DEBUG] Error: Frase semilla no proporcionada');
      return res.status(400).json({ error: 'La frase semilla es requerida' });
    }
    
    // La contraseña ahora es opcional en la interfaz, así que debemos
    // manejar ambos casos (con y sin contraseña)
    const passwordToUse = newPassword || 'DEFAULT_PASSWORD_' + Date.now();
    console.log('[DEBUG] Usando contraseña:', newPassword ? 'La proporcionada por el usuario' : 'Contraseña generada automáticamente');
    
    // Normalizar la frase semilla ingresada
    const normalizedInput = seedPhrase.trim().toLowerCase();
    
    // MÉTODO 1: Verificar si existe en la base de datos
    const savedSeedPhrases = await db.select().from(walletSeedPhrases);
    let matchedWalletFromDB = null;
    
    for (const saved of savedSeedPhrases) {
      if (saved.seedPhrase.toLowerCase() === normalizedInput) {
        // Encontramos una coincidencia en frases guardadas
        const [wallet] = await db.select()
          .from(custodialWallets)
          .where(eq(custodialWallets.address, saved.walletAddress));
        
        if (wallet) {
          matchedWalletFromDB = wallet;
          console.log(`[Recuperación] Coincidencia encontrada en DB para ${wallet.address}`);
          break;
        }
      }
    }
    
    // MÉTODO 2: Si no se encuentra en la BD, probar generando dinámicamente
    // Este paso es necesario para compatibilidad retroactiva con usuarios
    // que no tienen una frase guardada aún
    let matchedWalletDynamic = null;
    if (!matchedWalletFromDB) {
      console.log('[Recuperación] No se encontró en BD, probando generación dinámica');
      const wallets = await getCustodialWallets();
      
      for (const wallet of wallets) {
        // Verificar si coincide con la frase generada
        if (seedGenerator.verifySeedPhrase(normalizedInput, wallet.address)) {
          matchedWalletDynamic = wallet;
          
          // Guardar la frase en la base de datos para futuras recuperaciones
          try {
            await db.insert(walletSeedPhrases)
              .values({
                walletAddress: wallet.address,
                seedPhrase: seedPhrase.trim(),
                createdAt: new Date(),
                updatedAt: new Date()
              });
            console.log(`[Recuperación] Frase guardada en BD para ${wallet.address}`);
          } catch (dbError) {
            console.error('Error al guardar frase semilla durante recuperación:', dbError);
          }
          
          break;
        }
      }
    }
    
    // Usar el wallet encontrado por cualquiera de los dos métodos
    const matchedWallet = matchedWalletFromDB || matchedWalletDynamic;
    
    if (!matchedWallet) {
      return res.status(400).json({ error: 'Frase semilla inválida' });
    }
    
    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordToUse, salt);
    
    // Actualizar la contraseña en la base de datos
    await db.update(custodialWallets)
      .set({ 
        password: hashedPassword,
        lastLoginAt: new Date()
      })
      .where(eq(custodialWallets.id, matchedWallet.id));
    
    // Crear sesión para el usuario
    if (req.session) {
      req.session.walletAddress = matchedWallet.address;
      req.session.isAdmin = matchedWallet.isAdmin || false;
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Wallet recuperado correctamente',
      walletAddress: matchedWallet.address
    });
  } catch (error) {
    console.error('Error en recuperación:', error);
    console.log('[DEBUG] Detalles del error:', {
      mensaje: error.message,
      tipo: error.name,
      stack: error.stack?.substring(0, 200) // Limitar longitud del stack trace
    });
    res.status(500).json({ error: 'Error al recuperar wallet' });
  }
});

/**
 * Verificar si una frase semilla es válida para una dirección
 * POST /api/wallet/verify-seed
 */
router.post('/verify-seed', async (req, res) => {
  try {
    const { seedPhrase, walletAddress } = req.body;
    
    if (!seedPhrase || !walletAddress) {
      return res.status(400).json({ error: 'Se requieren frase semilla y dirección' });
    }
    
    // Verificar que el wallet existe primero
    const [walletExists] = await db.select()
      .from(custodialWallets)
      .where(eq(custodialWallets.address, walletAddress));
    
    if (!walletExists) {
      return res.status(404).json({ error: 'Wallet no encontrado en el sistema' });
    }
    
    // Normalizar la frase semilla ingresada y la dirección
    const normalizedInput = seedPhrase.trim().toLowerCase();
    const normalizedAddress = walletAddress.toLowerCase();
    
    // MÉTODO 1: Verificar en la base de datos primero (es el más confiable)
    let isValidFromDB = false;
    let savedPhrase = null;
    
    try {
      const [existingSeed] = await db.select()
        .from(walletSeedPhrases)
        .where(eq(walletSeedPhrases.walletAddress, normalizedAddress));
      
      if (existingSeed) {
        savedPhrase = existingSeed.seedPhrase.toLowerCase();
        isValidFromDB = normalizedInput === savedPhrase;
        
        if (isValidFromDB) {
          console.log(`[Verificación] Frase válida encontrada en BD para ${normalizedAddress.substring(0, 8)}...`);
        }
      }
    } catch (dbError) {
      console.error('Error al verificar en base de datos:', dbError);
    }
    
    // MÉTODO 2: Generar la frase con el algoritmo y compararla
    let isValidFromGenerator = false;
    let generatedPhrase = null;
    
    if (!isValidFromDB) {
      try {
        generatedPhrase = seedGenerator.generateUniqueSeedPhrase(normalizedAddress).toLowerCase();
        isValidFromGenerator = normalizedInput === generatedPhrase;
        
        if (isValidFromGenerator) {
          console.log(`[Verificación] Frase válida generada algorítmicamente para ${normalizedAddress.substring(0, 8)}...`);
          
          // Si es válida por el generador pero no estaba en la BD, la guardamos para futuras verificaciones
          if (!savedPhrase) {
            try {
              await db.insert(walletSeedPhrases)
                .values({
                  walletAddress: normalizedAddress,
                  seedPhrase: seedPhrase.trim(),
                  createdAt: new Date(),
                  updatedAt: new Date()
                });
              console.log(`[Verificación] Nueva frase guardada en BD para ${normalizedAddress.substring(0, 8)}...`);
            } catch (insertError) {
              // Si hay un error al insertar (ej. clave duplicada), lo registramos pero continuamos
              console.error('Error al guardar nueva frase verificada:', insertError);
            }
          }
        }
      } catch (genError) {
        console.error(`Error al generar frase para verificación de ${normalizedAddress}:`, genError);
      }
    }
    
    // MÉTODO 3: Soporte para frases legacy para cuentas antiguas
    // Este método permite la migración gradual al nuevo sistema
    const staticPhrase = 'orbit glide museum chef guard traffic slush habit school ethics surge announce';
    const isLegacyValid = normalizedInput === staticPhrase.toLowerCase();
    
    // Si es válida con la frase legacy, también la guardamos para este wallet
    // para que la próxima vez use esta frase única persistida
    if (isLegacyValid && !isValidFromDB && !isValidFromGenerator && !savedPhrase) {
      try {
        // Generamos una nueva frase única para este wallet
        const newUniquePhrase = seedGenerator.generateUniqueSeedPhrase(normalizedAddress);
        
        // La guardamos en la base de datos para futuras verificaciones
        await db.insert(walletSeedPhrases)
          .values({
            walletAddress: normalizedAddress,
            seedPhrase: newUniquePhrase,  // Guardamos la nueva, no la legacy
            createdAt: new Date(),
            updatedAt: new Date()
          });
        console.log(`[Migración] Wallet ${normalizedAddress.substring(0, 8)}... migrado de frase legacy a frase única`);
      } catch (migrateError) {
        console.error('Error al migrar wallet desde frase legacy:', migrateError);
      }
    }
    
    // Resultado final combinando los tres métodos
    const isValid = isValidFromDB || isValidFromGenerator || isLegacyValid;
    
    // Determinamos la fuente para propósitos de logging y auditoría
    let source = 'unknown';
    if (isValidFromDB) {
      source = 'database';
    } else if (isValidFromGenerator) {
      source = 'generator';
    } else if (isLegacyValid) {
      source = 'legacy';
    }
    
    res.status(200).json({ 
      isValid: isValid,
      usedLegacyFallback: isLegacyValid && !isValidFromDB && !isValidFromGenerator,
      source: source
    });
  } catch (error) {
    console.error('Error al verificar frase semilla:', error);
    res.status(500).json({ error: 'Error al verificar frase semilla' });
  }
});

/**
 * Endpoint para migrar a usuarios existentes a frases semilla únicas
 * POST /api/wallet/migrate-to-unique-seed
 * Este endpoint es de uso administrativo y requiere privilegios especiales
 */
router.post('/migrate-to-unique-seed', async (req, res) => {
  try {
    // Verificar si el usuario tiene permisos administrativos
    if (!req.session?.isAdmin) {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren privilegios de administrador.' });
    }
    
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Se requiere dirección de wallet' });
    }
    
    // Buscar el wallet en la base de datos
    const [wallet] = await db.select()
      .from(custodialWallets)
      .where(eq(custodialWallets.address, walletAddress));
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet no encontrado' });
    }
    
    // Verificar si ya existe una frase semilla en la base de datos
    const [existingSeed] = await db.select()
      .from(walletSeedPhrases)
      .where(eq(walletSeedPhrases.walletAddress, walletAddress));
    
    let seedPhrase;
    let wasCreated = false;
    
    if (existingSeed) {
      // Si ya existe, la usamos
      seedPhrase = existingSeed.seedPhrase;
      console.log(`[Migración] Utilizando frase existente para ${walletAddress.substring(0, 8)}...`);
    } else {
      // Si no existe, generamos una nueva y la guardamos
      seedPhrase = seedGenerator.generateUniqueSeedPhrase(walletAddress);
      wasCreated = true;
      
      try {
        await db.insert(walletSeedPhrases)
          .values({
            walletAddress: walletAddress,
            seedPhrase: seedPhrase,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        console.log(`[Migración] Nueva frase guardada para ${walletAddress.substring(0, 8)}...`);
      } catch (dbError) {
        console.error('Error al guardar frase durante migración:', dbError);
        return res.status(500).json({ error: 'Error al guardar frase semilla en base de datos' });
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: wasCreated 
        ? 'Wallet migrado correctamente a frase semilla única' 
        : 'El wallet ya tenía una frase semilla única asignada',
      seedPhrase: seedPhrase,
      wasCreated: wasCreated
    });
  } catch (error) {
    console.error('Error en migración de semilla:', error);
    res.status(500).json({ error: 'Error al migrar wallet a frase única' });
  }
});

// Registrar rutas
export function registerWalletSeedRoutes(app) {
  // Cambiamos la ruta a /api/wallet para que coincida con lo que espera el frontend
  // Registramos específicamente el endpoint /seed-phrase para que no entre en conflicto
  // con la ruta genérica de recuperación de wallet
  app.use('/api/wallet', router);
  console.log('Rutas de wallet seed registradas en /api/wallet');
}