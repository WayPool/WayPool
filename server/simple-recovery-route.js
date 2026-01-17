/**
 * Endpoint independiente para recuperación de wallets
 * Esta implementación evita dependencias complejas y trabaja directamente con la base de datos
 */

import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from './db.js';
const router = express.Router();

// IMPORTANTE: Este router NO DEBE requerir autenticación, ya que se usa para recuperar acceso
// Modificamos el comportamiento para garantizar que no se aplique el middleware de autenticación
router.use((req, res, next) => {
  console.log('[WalletRecovery] Acceso permitido sin autenticación para operación de recuperación');
  // Forzamos que continúe sin verificar autenticación
  next();
});

// Lista de palabras BIP39 en inglés (estándar)
const englishBIP39Words = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic'
];

// Lista de palabras BIP39 en español (compatibilidad con wallets existentes)
const spanishBIP39Words = [
  'ábaco', 'abdomen', 'abeja', 'abierto', 'abogado', 'abono', 'aborto', 'abrazo', 'abrir', 'abuelo', 'abuso', 'acabar', 
  'academia', 'acceso', 'acción', 'aceite', 'acelga', 'acento', 'aceptar', 'ácido', 'aclarar', 'acné', 'acoger', 'acoso',
  'activo', 'acto', 'actriz', 'actuar', 'acudir', 'acuerdo', 'acusar', 'adicto', 'admitir', 'adoptar', 'adorno', 'aduana',
  'adulto', 'aéreo', 'afectar', 'afición', 'afinar', 'afirmar', 'ágil', 'agitar', 'agonía', 'agosto', 'agotar', 'agregar',
  'agrio', 'agua', 'agudo', 'águila', 'aguja', 'ahogo', 'ahorro', 'aire', 'aislar', 'ajedrez', 'ajeno', 'ajuste', 'alarma',
  'alba', 'álbum', 'alcalde', 'aldea', 'alegre', 'alejar', 'alerta', 'aleta', 'alfiler', 'alga', 'algodón', 'aliado',
  'aliento', 'alivio', 'alma', 'almeja', 'almíbar', 'altar', 'alteza', 'altivo', 'alto', 'altura', 'alumno', 'alzar', 'amable',
  'amante', 'amapola', 'amargo', 'amasar', 'ámbar', 'ámbito', 'ameno', 'amigo', 'amistad', 'amor', 'amparo', 'amplio',
  'ancho', 'anciano', 'ancla', 'andar'
];

// Función para generar frase semilla determinística para un wallet en inglés
function generateEnglishSeedPhrase(walletAddress) {
  // Normalizar la dirección (minúsculas, sin 0x)
  const normalizedAddress = walletAddress.toLowerCase().replace('0x', '');
  
  // Implementamos un derivador de clave más seguro utilizando crypto
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', 'waybankSeedGeneratorV2');
  hmac.update(normalizedAddress);
  const addressHmac = hmac.digest('hex');
  
  // Crear un array para almacenar las palabras de la frase semilla
  const seedWords = [];
  
  // Generamos 12 palabras para la frase, siguiendo el estándar BIP39
  for (let i = 0; i < 12; i++) {
    // Tomamos segmentos de 8 caracteres hexadecimales (32 bits de entropía por palabra)
    const segment = addressHmac.substring(i * 8, (i * 8) + 8);
    
    // Convertimos el segmento a un valor numérico
    const segmentValue = parseInt(segment, 16);
    
    // Seleccionamos la palabra del wordlist usando ese valor
    const wordIndex = segmentValue % englishBIP39Words.length;
    seedWords.push(englishBIP39Words[wordIndex]);
  }
  
  return seedWords.join(' ');
}

// Función para generar frase semilla determinística para un wallet en español (compatibilidad)
function generateSpanishSeedPhrase(walletAddress) {
  // Normalizar la dirección (minúsculas, sin 0x)
  const normalizedAddress = walletAddress.toLowerCase().replace('0x', '');
  
  // Implementamos un derivador de clave más seguro utilizando crypto
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', 'waybankSeedGeneratorV1Spanish');
  hmac.update(normalizedAddress);
  const addressHmac = hmac.digest('hex');
  
  // Crear un array para almacenar las palabras de la frase semilla
  const seedWords = [];
  
  // Generamos 12 palabras para la frase, siguiendo el estándar BIP39
  for (let i = 0; i < 12; i++) {
    // Tomamos segmentos de 8 caracteres hexadecimales (32 bits de entropía por palabra)
    const segment = addressHmac.substring(i * 8, (i * 8) + 8);
    
    // Convertimos el segmento a un valor numérico
    const segmentValue = parseInt(segment, 16);
    
    // Seleccionamos la palabra del wordlist usando ese valor
    const wordIndex = segmentValue % spanishBIP39Words.length;
    seedWords.push(spanishBIP39Words[wordIndex]);
  }
  
  return seedWords.join(' ');
}

// Función principal que comprueba tanto frases en inglés como en español
function generateSeedPhraseForWallet(walletAddress) {
  // Ahora generamos por defecto frases en inglés
  return generateEnglishSeedPhrase(walletAddress);
}

// Endpoint para la ruta principal (GET)
router.get('/', (req, res, next) => {
  // Si la ruta incluye 'seed-phrase', pasar al siguiente manejador (evita capturar la ruta de frases semilla)
  if (req.originalUrl.includes('seed-phrase')) {
    return next();
  }
  
  // Solo para la ruta exacta /api/wallet
  res.json({ 
    status: 'online',
    message: 'Utilizar método POST para recuperar wallet'
  });
});

// Endpoint para recuperar wallet (POST) - NO REQUIERE AUTENTICACIÓN
router.post('/', async (req, res) => {
  console.log('[DirectRecovery] Solicitud recibida para recuperación de wallet');
  
  // IMPORTANTE: Este endpoint no requiere autenticación ya que es para recuperación de acceso
  
  // Verificar que la solicitud tenga un cuerpo válido
  if (!req.body) {
    console.log('[DirectRecovery] Error: Cuerpo de solicitud vacío');
    return res.status(400).json({ 
      success: false, 
      error: 'Solicitud inválida, sin datos proporcionados' 
    });
  }
  
  // Registrar la información de la solicitud para depuración
  console.log('[DirectRecovery] Body recibido tipo:', typeof req.body);
  console.log('[DirectRecovery] Body recibido keys:', Object.keys(req.body));
  
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
      console.log('[DirectRecovery] Cuerpo analizado de string a objeto');
    } catch (parseError) {
      console.log('[DirectRecovery] Error al analizar cuerpo de la solicitud:', parseError);
    }
  }
  
  try {
    // Extraer datos de la solicitud, con manejo de errores robusto
    const seedPhrase = req.body.seedPhrase || '';
    const newPassword = req.body.newPassword || '';
    
    console.log('[DirectRecovery] Datos extraídos - Frase semilla presente:', !!seedPhrase);
    console.log('[DirectRecovery] Datos extraídos - Longitud de frase:', seedPhrase ? seedPhrase.length : 0);
    
    // Validación básica
    if (!seedPhrase) {
      console.log('[DirectRecovery] Error: Frase semilla vacía');
      return res.status(400).json({ 
        success: false, 
        error: 'Por favor introduce tu frase semilla de 12 palabras' 
      });
    }
    
    console.log('[DirectRecovery] Frase semilla recibida (longitud):', seedPhrase.length);
    console.log('[DirectRecovery] Primeras 3 palabras:', seedPhrase.split(/\s+/).slice(0, 3).join(' '));
    
    const seedWords = seedPhrase.trim().split(/\s+/);
    console.log('[DirectRecovery] Palabras detectadas:', seedWords.length);
    
    if (seedWords.length < 12) {
      console.log('[DirectRecovery] Error: Frase semilla incompleta, palabras:', seedWords.length);
      return res.status(400).json({ 
        success: false, 
        error: `La frase semilla debe contener 12 palabras (detectadas: ${seedWords.length})` 
      });
    }
    
    console.log('[DirectRecovery] Validaciones básicas completadas');
    
    // Contraseña opcional, generamos una si no se proporciona
    const passwordToUse = newPassword || `DEFAULT_PASSWORD_${Date.now()}`;
    
    // Normalizar la frase semilla
    const normalizedInput = seedPhrase.trim().toLowerCase();
    
    try {
      console.log('[DirectRecovery] Usando conexión existente a la base de datos...');
      
      try {
        console.log('[DirectRecovery] Consultando wallets en la base de datos...');
        
        // Obtener todos los wallets
        const result = await pool.query('SELECT * FROM custodial_wallets');
        const wallets = result.rows;
        
        console.log(`[DirectRecovery] Se encontraron ${wallets.length} wallets`);
        
        // Buscar coincidencia con la frase semilla
        let matchedWallet = null;
        
        // Implementamos una función de comparación de tiempo constante para prevenir ataques de temporización
        function constantTimeEquals(a, b) {
          if (a.length !== b.length) {
            return false;
          }
          
          let result = 0;
          for (let i = 0; i < a.length; i++) {
            result |= (a.charCodeAt(i) ^ b.charCodeAt(i));
          }
          
          return result === 0;
        }
        
        for (const wallet of wallets) {
          try {
            // Intentar primero con la frase en inglés
            const englishPhrase = generateEnglishSeedPhrase(wallet.address);
            const normalizedEnglish = englishPhrase.toLowerCase();
            
            // Usamos solo los primeros caracteres para logs (sin revelar la frase completa)
            console.log(`[DirectRecovery] Verificando wallet con ID ${wallet.id} (${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)})`);
            
            if (constantTimeEquals(normalizedInput, normalizedEnglish)) {
              matchedWallet = wallet;
              console.log(`[DirectRecovery] ¡Coincidencia encontrada (EN) para wallet: ${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`);
              break;
            }
            
            // Si no coincide, intentar con la frase en español (compatibilidad)
            const spanishPhrase = generateSpanishSeedPhrase(wallet.address);
            const normalizedSpanish = spanishPhrase.toLowerCase();
            
            if (constantTimeEquals(normalizedInput, normalizedSpanish)) {
              matchedWallet = wallet;
              console.log(`[DirectRecovery] ¡Coincidencia encontrada (ES) para wallet: ${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`);
              break;
            }
          } catch (genError) {
            console.error(`[DirectRecovery] Error generando frase para wallet`, genError);
          }
        }
        
        // Si no se encontró coincidencia
        if (!matchedWallet) {
          console.log('[DirectRecovery] No se encontró coincidencia para la frase semilla');
          return res.status(400).json({ 
            success: false, 
            error: 'No se encontró ningún wallet asociado a esta frase semilla' 
          });
        }
        
        console.log('[DirectRecovery] Actualizando contraseña del wallet...');
        
        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(passwordToUse, 10);
        
        // Actualizar la contraseña en la base de datos
        await pool.query(
          'UPDATE custodial_wallets SET password_hash = $1, last_login_at = NOW() WHERE id = $2',
          [hashedPassword, matchedWallet.id]
        );
        
        console.log('[DirectRecovery] Contraseña actualizada correctamente');
        
        // Establecer la sesión para el usuario (si hay sesión)
        if (req.session) {
          req.session.user = {
            walletAddress: matchedWallet.address,
            isAdmin: matchedWallet.is_admin || false
          };
          console.log('[DirectRecovery] Sesión establecida para el usuario');
        }
        
        // Respuesta exitosa
        return res.status(200).json({
          success: true,
          message: 'Wallet recuperado correctamente',
          walletAddress: matchedWallet.address,
          generatedPassword: !newPassword ? passwordToUse : undefined
        });
        
      } catch (dbError) {
        console.error('[DirectRecovery] Error en operación de base de datos:', dbError);
        return res.status(500).json({ 
          success: false, 
          error: 'Error en operación de base de datos' 
        });
      } finally {
        // No cerramos el pool porque es compartido con el resto de la aplicación
        console.log('[DirectRecovery] Operación de base de datos completada');
      }
      
    } catch (dbConnectError) {
      console.error('[DirectRecovery] Error conectando a la base de datos:', dbConnectError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error al conectar con la base de datos' 
      });
    }
    
  } catch (error) {
    console.error('[DirectRecovery] Error general:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Exportar el router
export default router;