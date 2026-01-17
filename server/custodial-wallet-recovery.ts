import express from 'express';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { custodialWallets, custodialRecoveryTokens } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

// Extender la interfaz SessionData para incluir walletAddress e isAdmin
declare module 'express-session' {
  interface SessionData {
    walletAddress?: string;
    isAdmin?: boolean;
  }
}

const router = express.Router();
const scryptAsync = promisify(scrypt);

// Función para derivar el hash de la contraseña con un salt
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

/**
 * Función para comparar una contraseña proporcionada con una almacenada (hash+salt)
 * @param supplied Contraseña proporcionada por el usuario
 * @param stored Hash almacenado (formato: hash.salt)
 * @returns true si la contraseña es correcta
 */
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

interface RecoverWalletRequest {
  seedPhrase: string;
  newPassword?: string;
}

/**
 * Endpoint para recuperar un wallet utilizando la frase semilla
 * POST /api/custodial-wallet/recover
 */
router.post('/recover', async (req, res) => {
  try {
    const { seedPhrase, newPassword } = req.body as RecoverWalletRequest;
    
    if (!seedPhrase) {
      return res.status(400).json({ error: 'La frase semilla es requerida' });
    }
    
    // Importamos el servicio de frases semilla
    const walletSeedService = require('./wallet-seed-service');
    
    try {
      // Usamos el nuevo servicio para recuperar el wallet
      const result = await walletSeedService.recoverWalletWithSeedPhrase(seedPhrase, newPassword);
      
      // Si la recuperación fue exitosa, creamos una sesión
      if (result.success && result.walletAddress) {
        // Crear una nueva sesión para el usuario
        const sessionToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // La sesión expira en 7 días
        
        // Guardar el token de sesión en la base de datos
        try {
          await db.insert(custodialRecoveryTokens)
            .values({
              token: sessionToken,
              walletId: result.walletId || 0, // Si no hay ID, usar 0 como fallback
              expiresAt,
              used: false
            });
          
          // Establecer la sesión para el usuario
          if (req.session) {
            req.session.walletAddress = result.walletAddress;
            req.session.isAdmin = result.isAdmin || false;
          }
          
          return res.status(200).json({
            success: true,
            walletAddress: result.walletAddress,
            token: sessionToken
          });
        } catch (sessionError) {
          console.error('Error al crear sesión:', sessionError);
          return res.status(500).json({ 
            error: 'Error al crear sesión de usuario'
          });
        }
      } else {
        return res.status(400).json({ 
          error: 'No se pudo recuperar el wallet con esta frase semilla'
        });
      }
    } catch (recoverError) {
      console.error('Error durante recuperación con frase semilla:', recoverError);
      return res.status(400).json({ 
        error: recoverError.message || 'Error en la recuperación con frase semilla'
      });
    }
    expiresAt.setDate(expiresAt.getDate() + 7); // La sesión expira en 7 días
    
    await db.insert(custodialRecoveryTokens)
      .values({
        token: sessionToken,
        walletId: wallet.id,
        expiresAt,
        used: false
      });
    
    // Establecer la sesión para el usuario
    if (req.session) {
      req.session.walletAddress = wallet.address;
      req.session.isAdmin = wallet.isAdmin || false;
    }
    
    return res.status(200).json({
      success: true,
      walletAddress: wallet.address,
      token: sessionToken
    });
    
  } catch (error) {
    console.error('Error en el proceso de recuperación:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al procesar la recuperación' 
    });
  }
});

export function registerWalletRecoveryRoutes(app: express.Express) {
  app.use('/api/custodial-wallet', router);
  
  // Función para procesar la recuperación
  const recoverHandler = async (req: express.Request, res: express.Response) => {
    try {
      // Importar la base de datos explícitamente para evitar problemas de referencia
      const { db } = require('./db');
      const { eq } = require('drizzle-orm');
      const { custodialWallets, custodialRecoveryTokens } = require('@shared/schema');
      const { v4: uuidv4 } = require('uuid');
      
      console.log('[DEBUG] Iniciando recuperación de wallet con frase semilla');
      
      const { seedPhrase, newPassword } = req.body;
      
      if (!seedPhrase) {
        return res.status(400).json({ error: 'La frase semilla es requerida' });
      }
      
      // La contraseña es opcional
      const passwordToUse = newPassword || 'DEFAULT_PASSWORD_' + Date.now();
      
      // Importamos el servicio de frases semilla
      const walletSeedService = require('./wallet-seed-service');
      
      try {
        // Usamos el servicio para recuperar el wallet con hash correcto
        const { generateSeedPhraseForWallet } = walletSeedService;
        
        // Normalizar la frase semilla ingresada
        const normalizedInput = seedPhrase.trim().toLowerCase();
        
        console.log('[DEBUG] Buscando coincidencia para la frase semilla');
        
        // Buscar en la base de datos
        const wallets = await db.select().from(custodialWallets);
        console.log(`[DEBUG] Encontrados ${wallets.length} wallets en la base de datos`);
        
        let matchedWallet = null;
        
        // Buscar coincidencia directa o por generación
        for (const wallet of wallets) {
          try {
            const generatedPhrase = generateSeedPhraseForWallet(wallet.address);
            if (normalizedInput === generatedPhrase.toLowerCase()) {
              matchedWallet = wallet;
              console.log(`[DEBUG] Encontrada coincidencia para wallet ${wallet.address}`);
              break;
            }
          } catch (err) {
            console.error(`[ERROR] Error generando frase para wallet ${wallet.address}:`, err);
          }
        }
        
        if (!matchedWallet) {
          console.log('[DEBUG] No se encontró coincidencia para la frase semilla');
          return res.status(400).json({ error: 'Frase semilla inválida o no reconocida' });
        }
        
        console.log('[DEBUG] Actualizando contraseña del wallet');
        
        // Hashear la nueva contraseña utilizando bcrypt
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(passwordToUse, 10);
        
        // Actualizar la contraseña en la base de datos
        await db.update(custodialWallets)
          .set({ 
            password: hashedPassword,
            lastLoginAt: new Date()
          })
          .where(eq(custodialWallets.id, matchedWallet.id));
        
        console.log('[DEBUG] Contraseña actualizada correctamente');
        
        // Crear token de recuperación
        const sessionToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 días de expiración
        
        await db.insert(custodialRecoveryTokens)
          .values({
            token: sessionToken,
            walletId: matchedWallet.id,
            expiresAt,
            used: false
          });
          
        console.log('[DEBUG] Token de recuperación generado');
        
        // Establecer la sesión para el usuario
        if (req.session) {
          req.session.user = {
            walletAddress: matchedWallet.address,
            isAdmin: matchedWallet.isAdmin || false
          };
          console.log('[DEBUG] Sesión establecida para el usuario');
        }
        
        return res.status(200).json({
          success: true,
          message: 'Wallet recuperado correctamente',
          walletAddress: matchedWallet.address,
          token: sessionToken
        });
      } catch (innerError) {
        console.error('[ERROR] Error en proceso de recuperación:', innerError);
        return res.status(500).json({ error: 'Error en el proceso de recuperación' });
      }
    } catch (outerError) {
      console.error('[ERROR] Error general en endpoint de recuperación:', outerError);
      return res.status(500).json({ error: 'Error interno del servidor al procesar la recuperación' });
    }
  };
  
  // Registrar el mismo handler en ambas rutas para compatibilidad
  app.post('/api/wallet/recover', recoverHandler);
  
  console.log('Wallet recovery routes registered successfully for both paths');
}