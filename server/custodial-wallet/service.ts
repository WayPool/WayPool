import crypto from 'crypto';
import { ethers } from 'ethers';
import bcrypt from 'bcrypt';
import { pool } from '../db';
import { v4 as uuidv4 } from 'uuid';

// Configuración de cifrado
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const SALT_ROUNDS = 10;
const KEY_LENGTH = 32; // Para AES-256

/**
 * Servicio de gestión de billeteras custodiadas
 * Proporciona funciones para crear, autenticar y gestionar billeteras custodiadas
 */
export class CustodialWalletService {
  constructor() {
    // Verificar y crear tablas al inicializar el servicio
    this.verifyTables().catch(error => {
      console.error('[CustodialWalletService] ERROR AL INICIALIZAR TABLAS:', error);
    });
  }
  
  /**
   * Verifica si las tablas necesarias existen y las crea si no existen
   */
  async verifyTables() {
    try {
      console.log('[verifyTables] Verificando existencia de tablas para billeteras custodiadas...');
      
      // Verificar si la tabla custodial_wallets existe
      const walletTableExists = await this.tableExists('custodial_wallets');
      if (!walletTableExists) {
        console.log('[verifyTables] Tabla custodial_wallets no existe, creándola...');
        await this.createWalletTable();
      } else {
        console.log('[verifyTables] Tabla custodial_wallets existe');
      }
      
      // Verificar si la tabla custodial_sessions existe
      const sessionTableExists = await this.tableExists('custodial_sessions');
      if (!sessionTableExists) {
        console.log('[verifyTables] Tabla custodial_sessions no existe, creándola...');
        await this.createSessionTable();
      } else {
        console.log('[verifyTables] Tabla custodial_sessions existe');
      }
      
      // Verificar si la tabla custodial_recovery_tokens existe
      const recoveryTableExists = await this.tableExists('custodial_recovery_tokens');
      if (!recoveryTableExists) {
        console.log('[verifyTables] Tabla custodial_recovery_tokens no existe, creándola...');
        await this.createRecoveryTable();
      } else {
        console.log('[verifyTables] Tabla custodial_recovery_tokens existe');
      }
      
      console.log('[verifyTables] Verificación y creación de tablas completada');
    } catch (error) {
      console.error('[verifyTables] Error al verificar o crear tablas:', error);
      throw error;
    }
  }
  
  /**
   * Verifica si una tabla existe en la base de datos
   */
  private async tableExists(tableName: string): Promise<boolean> {
    try {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = $1
        )
      `, [tableName]);
      
      return result.rows[0].exists;
    } catch (error) {
      console.error(`[tableExists] Error al verificar si existe la tabla ${tableName}:`, error);
      throw error;
    }
  }
  
  /**
   * Crea la tabla de billeteras custodiadas
   */
  private async createWalletTable() {
    try {
      await pool.query(`
        CREATE TABLE custodial_wallets (
          id SERIAL PRIMARY KEY,
          address VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          salt VARCHAR(255) NOT NULL,
          encrypted_private_key TEXT NOT NULL,
          encryption_iv VARCHAR(255) NOT NULL,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          last_login_at TIMESTAMP
        )
      `);
      console.log('[createWalletTable] Tabla custodial_wallets creada exitosamente');
    } catch (error) {
      console.error('[createWalletTable] Error al crear tabla custodial_wallets:', error);
      throw error;
    }
  }
  
  /**
   * Crea la tabla de sesiones de billeteras custodiadas
   */
  private async createSessionTable() {
    try {
      await pool.query(`
        CREATE TABLE custodial_sessions (
          id SERIAL PRIMARY KEY,
          wallet_id INTEGER NOT NULL,
          address VARCHAR(255) NOT NULL,
          session_token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('[createSessionTable] Tabla custodial_sessions creada exitosamente');
    } catch (error) {
      console.error('[createSessionTable] Error al crear tabla custodial_sessions:', error);
      throw error;
    }
  }
  
  /**
   * Crea la tabla de tokens de recuperación
   */
  private async createRecoveryTable() {
    try {
      await pool.query(`
        CREATE TABLE custodial_recovery_tokens (
          id SERIAL PRIMARY KEY,
          wallet_id INTEGER NOT NULL,
          email VARCHAR(255) NOT NULL,
          recovery_token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('[createRecoveryTable] Tabla custodial_recovery_tokens creada exitosamente');
    } catch (error) {
      console.error('[createRecoveryTable] Error al crear tabla custodial_recovery_tokens:', error);
      throw error;
    }
  }
  /**
   * Crear una nueva billetera custodiada para un usuario
   */
  async createWallet(email: string, password: string) {
    try {
      console.log('[createWallet] Iniciando creación de nueva billetera para email:', email);
      
      // Verificar si el email ya existe en la base de datos
      try {
        const existingWallet = await pool.query(
          `SELECT id FROM custodial_wallets WHERE email = $1`,
          [email]
        );
        
        if (existingWallet.rowCount > 0) {
          console.log('[createWallet] Email ya registrado:', email);
          throw new Error('El email ya está registrado con otra billetera');
        }
      } catch (checkError: any) {
        // Si el error es porque la tabla no existe, continuamos con la creación
        // de lo contrario, propagamos el error
        if (checkError.message && 
            !checkError.message.includes('relation "custodial_wallets" does not exist')) {
          throw checkError;
        }
        
        console.log('[createWallet] La tabla puede no existir, continuando con la creación...');
        
        // Si la tabla no existe, intentamos crearla
        await this.verifyTables();
      }
      
      // Generar nueva billetera
      console.log('[createWallet] Generando wallet aleatorio con ethers...');
      let wallet;
      try {
        wallet = ethers.Wallet.createRandom();
      } catch (ethersError) {
        console.error('[createWallet] Error al generar wallet con ethers:', ethersError);
        throw new Error('Error al generar billetera: problema con la biblioteca de criptografía');
      }
      
      const privateKey = wallet.privateKey;
      const address = wallet.address;
      // Normalizar dirección a minúsculas para consistencia
      const normalizedAddress = address.toLowerCase();
      console.log('[createWallet] Billetera generada con dirección:', address);
      console.log('[createWallet] Dirección normalizada:', normalizedAddress);

      // Generar hash de contraseña
      console.log('[createWallet] Generando hash de contraseña con bcrypt...');
      let salt;
      let passwordHash;
      try {
        salt = await bcrypt.genSalt(SALT_ROUNDS);
        passwordHash = await bcrypt.hash(password, salt);
        console.log('[createWallet] Hash de contraseña generado correctamente');
      } catch (bcryptError) {
        console.error('[createWallet] Error al generar hash con bcrypt:', bcryptError);
        throw new Error('Error de seguridad: no se pudo encriptar la contraseña');
      }

      // Derivar clave de cifrado con manejo de errores mejorado
      console.log('[createWallet] Derivando clave de cifrado...');
      let encryptionKey, iv;
      try {
        const result = this.deriveEncryptionKey(password, salt);
        encryptionKey = result.encryptionKey;
        iv = result.iv;
        console.log('[createWallet] Clave de cifrado derivada correctamente');
      } catch (encryptionError) {
        console.error('[createWallet] Error al derivar clave de cifrado:', encryptionError);
        throw new Error('Error de seguridad: no se pudo generar clave de cifrado');
      }

      // Cifrar clave privada con manejo de errores mejorado
      console.log('[createWallet] Cifrando clave privada...');
      let encryptedPrivateKey;
      try {
        encryptedPrivateKey = this.encryptPrivateKey(privateKey, encryptionKey, iv);
        console.log('[createWallet] Clave privada cifrada correctamente');
      } catch (encryptError) {
        console.error('[createWallet] Error al cifrar clave privada:', encryptError);
        throw new Error('Error de seguridad: no se pudo cifrar la clave privada');
      }

      // Guardar billetera en la base de datos
      console.log('[createWallet] Guardando billetera en la base de datos...');
      try {
        // Verificar que tenemos todos los datos necesarios antes de insertar
        if (!normalizedAddress || !email || !passwordHash || !salt || !encryptedPrivateKey || !iv) {
          console.error('[createWallet] Faltan datos para la inserción:', {
            tieneAddress: !!normalizedAddress,
            tieneEmail: !!email,
            tienePasswordHash: !!passwordHash,
            tieneSalt: !!salt,
            tieneEncryptedKey: !!encryptedPrivateKey,
            tieneIV: !!iv
          });
          throw new Error('Datos incompletos para crear la billetera');
        }
        
        const insertResult = await pool.query(
          `INSERT INTO custodial_wallets 
          (address, email, password_hash, salt, encrypted_private_key, encryption_iv, active, created_at, updated_at, last_login_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
          RETURNING id, address, created_at`,
          [normalizedAddress, email, passwordHash, salt, encryptedPrivateKey, iv.toString('hex'), true]
        );
        console.log('[createWallet] Billetera guardada correctamente con ID:', insertResult.rows[0].id);

        // Retornar información de la billetera creada
        return {
          id: insertResult.rows[0].id,
          address: insertResult.rows[0].address,
          createdAt: insertResult.rows[0].created_at,
        };
      } catch (dbError: any) {
        console.error('[createWallet] Error en la inserción a la base de datos:', dbError);
        
        // Ver si es un problema de tabla que no existe
        if (dbError.message && typeof dbError.message === 'string' && 
            dbError.message.includes('relation "custodial_wallets" does not exist')) {
          console.error('[createWallet] ERROR CRÍTICO: La tabla custodial_wallets no existe en la base de datos');
          
          // Intento de recuperación - crear la tabla si no existe
          try {
            console.log('[createWallet] Intentando crear la tabla custodial_wallets...');
            await this.createWalletTable();
            
            // Reintentar la inserción después de crear la tabla
            console.log('[createWallet] Tabla creada, reintentando inserción...');
            const retryResult = await pool.query(
              `INSERT INTO custodial_wallets 
              (address, email, password_hash, salt, encrypted_private_key, encryption_iv, active, created_at, updated_at, last_login_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
              RETURNING id, address, created_at`,
              [normalizedAddress, email, passwordHash, salt, encryptedPrivateKey, iv.toString('hex'), true]
            );
            
            console.log('[createWallet] Reinserción exitosa con ID:', retryResult.rows[0].id);
            return {
              id: retryResult.rows[0].id,
              address: retryResult.rows[0].address,
              createdAt: retryResult.rows[0].created_at,
            };
          } catch (retryError) {
            console.error('[createWallet] Error en recuperación automática:', retryError);
            throw new Error('Error de configuración del servidor: no se pudo crear la estructura de base de datos');
          }
        }
        
        // Ver si es un problema de duplicado (email único)
        if (dbError.code === '23505') {
          console.error('[createWallet] ERROR: Email ya registrado');
          throw new Error('El email ya está registrado con otra billetera');
        }
        
        // Error genérico de base de datos
        throw new Error('Error de base de datos al crear la billetera');
      }
    } catch (error) {
      console.error('[createWallet] Error al crear billetera custodiada:', error);
      // Intentar proporcionar un mensaje de error más específico
      let errorMessage = 'No se pudo crear la billetera custodiada';
      if (error instanceof Error) {
        if (error.message.includes('ya está registrado')) {
          errorMessage = 'Este email ya está registrado con otra billetera';
        } else if (error.message.includes('tabla') || error.message.includes('table')) {
          errorMessage = 'Error de configuración del servidor: tabla de billeteras no encontrada';
        } else if (error.message.includes('seguridad')) {
          errorMessage = error.message;
        } else if (error.message.includes('biblioteca')) {
          errorMessage = error.message;
        }
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * Autenticar a un usuario con su billetera custodiada
   */
  async authenticate(email: string, password: string) {
    try {
      // Flujo normal para cuentas
      // Buscar billetera por email
      const walletResult = await pool.query(
        `SELECT id, address, password_hash, salt, encrypted_private_key, encryption_iv
         FROM custodial_wallets
         WHERE email = $1 AND active = true`,
        [email]
      );

      if (walletResult.rowCount === 0) {
        throw new Error('Email o contraseña incorrectos');
      }

      const wallet = walletResult.rows[0];

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, wallet.password_hash);
      if (!passwordMatch) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Crear token de sesión con expiración extendida (1 año)
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // La sesión expira en 1 año

      // Guardar sesión en la base de datos - normalizando dirección a minúsculas
      const normalizedAddress = wallet.address.toLowerCase();
      console.log('[authenticate] Normalizando dirección para sesión:', {
        original: wallet.address,
        normalizada: normalizedAddress
      });
      
      await pool.query(
        `INSERT INTO custodial_sessions
         (wallet_id, address, session_token, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [wallet.id, normalizedAddress, sessionToken, expiresAt]
      );

      // Actualizar la fecha del último inicio de sesión
      try {
        await pool.query(
          `UPDATE custodial_wallets 
           SET last_login_at = NOW()
           WHERE id = $1`,
          [wallet.id]
        );
        console.log('[authenticate] Actualizada última fecha de inicio de sesión para wallet:', wallet.id);
      } catch (updateError) {
        // No fallar si hay un error actualizando la fecha de inicio de sesión
        // Este error podría ocurrir si la columna no existe
        console.warn('[authenticate] No se pudo actualizar la fecha de último inicio de sesión:', updateError.message);
      }

      return {
        address: wallet.address,
        sessionToken,
        expiresAt,
      };
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw new Error('Error al iniciar sesión');
    }
  }

  /**
   * Verificar sesión de billetera
   */
  async verifySession(sessionToken: string) {
    try {
      // ‼️ Corrección crítica: verificamos que no estemos trabajando con null o undefined
      if (!sessionToken) {
        console.log('[verifySession] Token no proporcionado');
        return null;
      }
      
      // ‼️ Corrección crítica: Detectar formato UUID vs token de prueba
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionToken);
      
      console.log('[verifySession] Análisis del token:', {
        tokenInput: sessionToken,
        tokenLength: sessionToken.length,
        isUUID: isUUID
      });

      // Buscar sesión activa en la base de datos
      const sessionResult = await pool.query(
        `SELECT s.id, s.wallet_id, s.expires_at, w.address
         FROM custodial_sessions s
         JOIN custodial_wallets w ON s.wallet_id = w.id
         WHERE s.session_token = $1 AND s.expires_at > NOW() AND w.active = true`,
        [sessionToken]
      );

      if (sessionResult.rowCount === 0) {
        return null;
      }

      const session = sessionResult.rows[0];

      // Normalizar dirección a minúsculas para mantener consistencia
      const normalizedAddress = session.address.toLowerCase();
      console.log('[verifySession] Normalizando dirección de sesión:', {
        original: session.address,
        normalizada: normalizedAddress
      });
      
      return {
        walletId: session.wallet_id,
        address: normalizedAddress,
        expiresAt: session.expires_at,
      };
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      return null;
    }
  }

  /**
   * Cerrar sesión de billetera
   */
  async logout(sessionToken: string) {
    try {
      // Eliminar sesión
      await pool.query(
        `DELETE FROM custodial_sessions
         WHERE session_token = $1`,
        [sessionToken]
      );

      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return false;
    }
  }

  /**
   * Obtener detalles de una billetera custodiada
   */
  /**
   * Verifica si una dirección específica corresponde a una billetera custodiada
   * @param address Dirección de la billetera a verificar
   * @returns true si es custodiada, false si no
   */
  async isWalletCustodial(address: string): Promise<boolean> {
    try {
      // Normalizar la dirección a minúsculas para consistencia
      const normalizedAddress = address.toLowerCase();

      // Consultar la base de datos para verificar si existe una wallet con esta dirección
      const result = await pool.query(
        'SELECT EXISTS(SELECT 1 FROM custodial_wallets WHERE LOWER(address) = $1)',
        [normalizedAddress]
      );
      
      return result.rows[0].exists;
    } catch (error) {
      console.error('[isWalletCustodial] Error al verificar si la wallet es custodiada:', error);
      return false;
    }
  }

  async getWalletDetails(address: string) {
    try {
      // Buscar billetera por dirección
      const walletResult = await pool.query(
        `SELECT id, address, email, created_at, last_login_at
         FROM custodial_wallets
         WHERE address = $1 AND active = true`,
        [address]
      );

      if (walletResult.rowCount === 0) {
        return null;
      }

      const wallet = walletResult.rows[0];

      // Obtener balance (este sería un buen lugar para integrar un proveedor como Alchemy o Infura)
      // Para simplificar, aquí solo devolveremos una estructura de ejemplo
      // Garantizar que last_login_at nunca sea null para evitar errores en el frontend
      const lastLoginAt = wallet.last_login_at || wallet.created_at || new Date();
      
      return {
        id: wallet.id,
        address: wallet.address,
        email: wallet.email,
        balance: '0.0', // En un entorno real, se consultaría la blockchain
        createdAt: wallet.created_at,
        lastLoginAt: lastLoginAt,
      };
    } catch (error) {
      console.error('Error al obtener detalles de la billetera:', error);
      return null;
    }
  }

  /**
   * Iniciar proceso de recuperación de billetera
   */
  async initiateRecovery(email: string) {
    try {
      // Buscar billetera por email
      const walletResult = await pool.query(
        `SELECT id, address
         FROM custodial_wallets
         WHERE email = $1 AND active = true`,
        [email]
      );

      if (walletResult.rowCount === 0) {
        throw new Error('Email no encontrado');
      }

      const wallet = walletResult.rows[0];

      // Generar token de recuperación
      const recoveryToken = this.generateRecoveryToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // El token expira en 1 hora

      // Guardar token en la base de datos
      await pool.query(
        `INSERT INTO custodial_recovery_tokens
         (wallet_id, email, recovery_token, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [wallet.id, email, recoveryToken, expiresAt]
      );

      return {
        email,
        recoveryToken,
        expiresAt,
      };
    } catch (error) {
      console.error('Error al iniciar recuperación:', error);
      throw new Error('No se pudo iniciar el proceso de recuperación');
    }
  }

  /**
   * Verificar token de recuperación
   */
  async verifyRecoveryToken(token: string) {
    try {
      // Buscar token activo
      const recoveryResult = await pool.query(
        `SELECT r.id, r.wallet_id, r.expires_at, r.email, w.address
         FROM custodial_recovery_tokens r
         JOIN custodial_wallets w ON r.wallet_id = w.id
         WHERE r.recovery_token = $1 AND r.expires_at > NOW() AND r.used = false AND w.active = true`,
        [token]
      );

      if (recoveryResult.rowCount === 0) {
        return null;
      }

      const recovery = recoveryResult.rows[0];

      return {
        recoveryId: recovery.id,
        walletId: recovery.wallet_id,
        email: recovery.email,
        address: recovery.address,
        expiresAt: recovery.expires_at,
      };
    } catch (error) {
      console.error('Error al verificar token de recuperación:', error);
      return null;
    }
  }

  /**
   * Restablecer contraseña de billetera
   */
  async resetPassword(recoveryToken: string, newPassword: string) {
    try {
      // Verificar token de recuperación
      const recovery = await this.verifyRecoveryToken(recoveryToken);
      if (!recovery) {
        throw new Error('Token de recuperación inválido o expirado');
      }

      // Obtener datos de la billetera
      const walletResult = await pool.query(
        `SELECT id, encrypted_private_key, encryption_iv
         FROM custodial_wallets
         WHERE id = $1 AND active = true`,
        [recovery.walletId]
      );

      if (walletResult.rowCount === 0) {
        throw new Error('Billetera no encontrada');
      }

      const wallet = walletResult.rows[0];

      // Generar nuevo hash de contraseña
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      // Descifrar la clave privada original
      // Nota: Aquí normalmente descifraríamos la clave privada con la contraseña antigua
      // y la volveríamos a cifrar con la nueva, pero para simplificar asumiremos que
      // tenemos acceso a la clave privada en este punto

      // En un entorno real, habría que implementar una estrategia más segura para
      // recuperar la clave privada en caso de olvido de contraseña (ej. clave compartida)

      // Marcar token como usado
      await pool.query(
        `UPDATE custodial_recovery_tokens
         SET used = true
         WHERE id = $1`,
        [recovery.recoveryId]
      );

      // Actualizar contraseña
      await pool.query(
        `UPDATE custodial_wallets
         SET password_hash = $1, salt = $2, updated_at = NOW()
         WHERE id = $3`,
        [passwordHash, salt, wallet.id]
      );

      return {
        success: true,
        message: 'Contraseña actualizada correctamente',
      };
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw new Error('No se pudo restablecer la contraseña');
    }
  }

  /**
   * Firmar un mensaje con la billetera custodiada
   */
  async signMessage(address: string, message: string, sessionToken: string) {
    try {
      // Verificar sesión (comparando direcciones en minúsculas)
      const session = await this.verifySession(sessionToken);
      const normalizedRequestAddress = address.toLowerCase();
      
      if (!session) {
        console.error(`Sesión no encontrada para token de longitud: ${sessionToken?.length || 0}`);
        throw new Error('Sesión inválida o expirada');
      }
      
      if (session.address !== normalizedRequestAddress) {
        console.error(`Las direcciones no coinciden:`, {
          sesión: session.address,
          solicitada: normalizedRequestAddress,
          original: address,
          tokenLength: sessionToken?.length || 0
        });
        throw new Error('La dirección no coincide con la sesión');
      }

      // Para billeteras custodiadas
      // Obtener datos de la billetera
      const walletResult = await pool.query(
        `SELECT encrypted_private_key, encryption_iv, salt, password_hash
         FROM custodial_wallets
         WHERE address = $1 AND active = true`,
        [address]
      );

      if (walletResult.rowCount === 0) {
        throw new Error('Billetera no encontrada');
      }

      // En un entorno real, aquí descifraríamos la clave privada
      // y usaríamos ethers.js para firmar el mensaje
      // Por razones de seguridad, en esta implementación de ejemplo
      // simulamos la firma sin descifrar realmente la clave

      const mockSignature = `0x${crypto.randomBytes(65).toString('hex')}`;

      return {
        message,
        signature: mockSignature,
        address,
      };
    } catch (error) {
      console.error('Error al firmar mensaje:', error);
      throw new Error('No se pudo firmar el mensaje');
    }
  }

  // Métodos internos para cifrado y seguridad

  /**
   * Derivar clave de cifrado a partir de la contraseña
   */
  private deriveEncryptionKey(password: string, salt: string) {
    try {
      // Validar entrada
      if (!password || typeof password !== 'string') {
        throw new Error('La contraseña es inválida o está vacía');
      }
      
      if (!salt || typeof salt !== 'string') {
        throw new Error('El salt es inválido o está vacío');
      }
      
      console.log('[deriveEncryptionKey] Iniciando derivación de clave con PBKDF2');
      console.log('[deriveEncryptionKey] Parámetros:', { 
        saltLength: salt.length,
        passwordLength: password.length,
        keyLength: KEY_LENGTH
      });
      
      let key;
      // Derivar clave usando PBKDF2 con manejo de errores específico
      try {
        key = crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
      } catch (cryptoError) {
        console.error('[deriveEncryptionKey] Error en PBKDF2:', cryptoError);
        throw new Error('Error en algoritmo de derivación de clave');
      }
      
      let iv;
      // Generar vector de inicialización con manejo de errores específico
      try {
        iv = crypto.randomBytes(16); // Vector de inicialización para AES-GCM
      } catch (randomError) {
        console.error('[deriveEncryptionKey] Error al generar bytes aleatorios:', randomError);
        throw new Error('Error al generar datos aleatorios para cifrado');
      }
      
      // Verificar que los valores sean válidos
      if (!key || key.length !== KEY_LENGTH) {
        console.error('[deriveEncryptionKey] Clave generada inválida:', { 
          keyPresente: !!key, 
          keyLongitud: key ? key.length : 0,
          esperado: KEY_LENGTH
        });
        throw new Error('La clave generada no tiene la longitud esperada');
      }
      
      if (!iv || iv.length !== 16) {
        console.error('[deriveEncryptionKey] IV generado inválido:', { 
          ivPresente: !!iv, 
          ivLongitud: iv ? iv.length : 0,
          esperado: 16
        });
        throw new Error('El vector de inicialización generado no tiene la longitud esperada');
      }
      
      console.log('[deriveEncryptionKey] Clave derivada correctamente:', { 
        keyLength: key.length,
        ivLength: iv.length
      });

      return {
        encryptionKey: key,
        iv,
      };
    } catch (error) {
      console.error('[deriveEncryptionKey] Error al derivar clave:', error);
      // Capturar mensaje de error específico o usar genérico
      if (error instanceof Error) {
        throw error; // Reenviar el error específico
      } else {
        throw new Error('Error al generar claves de cifrado');
      }
    }
  }

  /**
   * Cifrar clave privada
   */
  private encryptPrivateKey(privateKey: string, key: Buffer, iv: Buffer) {
    try {
      console.log('[encryptPrivateKey] Iniciando cifrado de clave privada');
      console.log('[encryptPrivateKey] Parámetros:', { 
        privateKeyLength: privateKey.length,
        keyLength: key.length,
        ivLength: iv.length,
        algorithm: ENCRYPTION_ALGORITHM
      });
      
      // Verificar que la clave tenga la longitud correcta para el algoritmo
      if (key.length !== KEY_LENGTH) {
        throw new Error(`La clave de cifrado debe tener longitud ${KEY_LENGTH}, se recibió ${key.length}`);
      }
      
      const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
      let encrypted = cipher.update(privateKey, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // En AES-GCM, también tenemos un authTag para verificar la integridad
      const authTag = cipher.getAuthTag();
      
      // Combinar todo en un formato que podamos almacenar
      const result = `${encrypted}:${authTag.toString('hex')}`;
      console.log('[encryptPrivateKey] Cifrado exitoso, longitud del resultado:', result.length);
      
      return result;
    } catch (error) {
      console.error('[encryptPrivateKey] Error al cifrar clave privada:', error);
      throw new Error('Error al cifrar la clave privada');
    }
  }

  /**
   * Descifrar clave privada
   */
  private decryptPrivateKey(encryptedData: string, key: Buffer, iv: Buffer) {
    try {
      console.log('[decryptPrivateKey] Iniciando descifrado de clave privada');
      console.log('[decryptPrivateKey] Parámetros:', { 
        encryptedDataLength: encryptedData.length,
        keyLength: key.length,
        ivLength: iv.length,
        algorithm: ENCRYPTION_ALGORITHM
      });
      
      // Separar datos cifrados y authTag
      const parts = encryptedData.split(':');
      if (parts.length !== 2) {
        console.error('[decryptPrivateKey] Formato de datos cifrados incorrecto:', { 
          encryptedData: encryptedData.substring(0, 20) + '...',
          partes: parts.length
        });
        throw new Error('Formato de datos cifrados incorrecto');
      }
      
      const [encryptedKey, authTagHex] = parts;
      console.log('[decryptPrivateKey] Datos extrados del formato:', {
        encryptedKeyLength: encryptedKey.length,
        authTagLength: authTagHex.length
      });
      
      const authTag = Buffer.from(authTagHex, 'hex');
      
      // Descifrar
      const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      console.log('[decryptPrivateKey] Descifrado exitoso, longitud de clave descifrada:', decrypted.length);
      
      return decrypted;
    } catch (error) {
      console.error('[decryptPrivateKey] Error al descifrar clave privada:', error);
      throw new Error('Error al descifrar la clave privada');
    }
  }

  /**
   * Generar token de sesión
   */
  private generateSessionToken() {
    return uuidv4();
  }

  /**
   * Generar token de recuperación
   */
  private generateRecoveryToken() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Buscar una billetera por su email
   * @param email Email asociado a la billetera
   * @returns Información de la billetera o null si no se encuentra
   */
  async findWalletByEmail(email: string) {
    try {
      console.log(`[findWalletByEmail] Buscando billetera con email: ${email}`);

      const result = await pool.query(
        `SELECT id, address, email, created_at, salt, encryption_iv
         FROM custodial_wallets
         WHERE email = $1 AND active = true`,
        [email]
      );

      if (result.rowCount === 0) {
        console.log(`[findWalletByEmail] No se encontró billetera con email: ${email}`);
        return null;
      }

      console.log(`[findWalletByEmail] Billetera encontrada para email: ${email}`);
      return result.rows[0];
    } catch (error) {
      console.error(`[findWalletByEmail] Error al buscar billetera por email: ${email}`, error);
      return null;
    }
  }

  /**
   * Buscar billetera por email de forma case-insensitive
   * @param email Email a buscar (será normalizado a minúsculas)
   * @returns Datos de la billetera o null si no existe
   */
  async findWalletByEmailCaseInsensitive(email: string) {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      console.log(`[findWalletByEmailCaseInsensitive] Buscando billetera con email: ${normalizedEmail}`);

      // Búsqueda case-insensitive usando LOWER()
      const result = await pool.query(
        `SELECT id, address, email, created_at, salt, encryption_iv
         FROM custodial_wallets
         WHERE LOWER(email) = $1 AND active = true`,
        [normalizedEmail]
      );

      if (result.rowCount === 0) {
        console.log(`[findWalletByEmailCaseInsensitive] No se encontró billetera con email: ${normalizedEmail}`);
        return null;
      }

      console.log(`[findWalletByEmailCaseInsensitive] Billetera encontrada para email: ${normalizedEmail}`);
      return result.rows[0];
    } catch (error) {
      console.error(`[findWalletByEmailCaseInsensitive] Error al buscar billetera por email: ${email}`, error);
      return null;
    }
  }

  /**
   * Actualizar contraseña de una billetera usando email (para recuperación)
   * Usa búsqueda case-insensitive
   * @param email Email de la billetera
   * @param newPassword Nueva contraseña
   * @returns true si la actualización fue exitosa, false en caso contrario
   */
  async updatePasswordByEmail(email: string, newPassword: string): Promise<boolean> {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      console.log(`[updatePasswordByEmail] Actualizando contraseña para email: ${normalizedEmail}`);

      // Buscar la billetera por email (case-insensitive)
      const wallet = await this.findWalletByEmailCaseInsensitive(normalizedEmail);

      if (!wallet) {
        console.error(`[updatePasswordByEmail] No se encontró billetera con email: ${normalizedEmail}`);
        return false;
      }

      // Generar nuevo salt y hash de contraseña
      const newSalt = await bcrypt.genSalt(SALT_ROUNDS);
      const newPasswordHash = await bcrypt.hash(newPassword, newSalt);
      
      // Intentar acceder a la clave privada (en un escenario real necesitaríamos 
      // un mecanismo alternativo para recuperarla, ya que no tenemos la contraseña anterior)
      
      // En este caso, como estamos en recuperación y no tenemos la clave privada descifrada,
      // haremos un reset completo (en producción se recomienda otra estrategia más segura)
      
      // Actualizar la contraseña en la base de datos
      const result = await pool.query(
        `UPDATE custodial_wallets
         SET password_hash = $1, salt = $2, updated_at = NOW()
         WHERE id = $3 AND active = true
         RETURNING id`,
        [newPasswordHash, newSalt, wallet.id]
      );
      
      if (result.rowCount === 0) {
        console.error(`[updatePasswordByEmail] No se pudo actualizar la contraseña para wallet ID: ${wallet.id}`);
        return false;
      }
      
      console.log(`[updatePasswordByEmail] Contraseña actualizada con éxito para wallet ID: ${wallet.id}`);
      return true;
    } catch (error) {
      console.error('[updatePasswordByEmail] Error al actualizar contraseña:', error);
      return false;
    }
  }

  /**
   * Cambiar contraseña de una billetera custodiada
   * 
   * @param address Dirección de la billetera custodiada
   * @param currentPassword Contraseña actual
   * @param newPassword Nueva contraseña
   * @returns true si el cambio fue exitoso, false en caso contrario
   */
  async changePassword(address: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Buscar la billetera en la base de datos
      const walletResult = await pool.query(
        `SELECT id, password_hash, salt, encrypted_private_key, encryption_iv
         FROM custodial_wallets
         WHERE address = $1 AND active = true`,
        [address]
      );
      
      if (walletResult.rowCount === 0) {
        console.error(`No se encontró billetera activa con la dirección: ${address}`);
        return false;
      }
      
      const wallet = walletResult.rows[0];
      
      // Verificar la contraseña actual
      const passwordMatch = await bcrypt.compare(currentPassword, wallet.password_hash);
      if (!passwordMatch) {
        console.error(`Contraseña incorrecta para la dirección: ${address}`);
        return false;
      }
      
      // Descifrar la clave privada con la contraseña actual
      const { encryptionKey: currentKey, iv: currentIv } = this.deriveEncryptionKey(
        currentPassword, 
        wallet.salt
      );
      
      const privateKey = this.decryptPrivateKey(
        wallet.encrypted_private_key, 
        currentKey, 
        Buffer.from(wallet.encryption_iv, 'hex')
      );
      
      // Generar nuevo hash de contraseña
      const newSalt = await bcrypt.genSalt(SALT_ROUNDS);
      const newPasswordHash = await bcrypt.hash(newPassword, newSalt);
      
      // Derivar nueva clave de cifrado a partir de la nueva contraseña
      const { encryptionKey: newKey, iv: newIv } = this.deriveEncryptionKey(newPassword, newSalt);
      
      // Cifrar clave privada con la nueva clave de cifrado
      const newEncryptedPrivateKey = this.encryptPrivateKey(privateKey, newKey, newIv);
      
      // Actualizar billetera en la base de datos
      await pool.query(
        `UPDATE custodial_wallets
         SET password_hash = $1,
             salt = $2,
             encrypted_private_key = $3,
             encryption_iv = $4,
             updated_at = NOW()
         WHERE id = $5`,
        [newPasswordHash, newSalt, newEncryptedPrivateKey, newIv.toString('hex'), wallet.id]
      );
      
      console.log(`Contraseña cambiada con éxito para la billetera ${address}`);
      return true;
    } catch (error) {
      console.error(`Error al cambiar contraseña para la billetera ${address}:`, error);
      return false;
    }
  }

  /**
   * Exportar la clave privada de una billetera custodiada
   * Requiere autenticación con contraseña para seguridad
   *
   * @param address Dirección de la billetera
   * @param password Contraseña del usuario para verificación
   * @returns La clave privada descifrada o null si falla
   */
  async exportPrivateKey(address: string, password: string): Promise<{ privateKey: string; address: string } | null> {
    try {
      console.log(`[exportPrivateKey] Solicitando exportación de clave privada para: ${address}`);

      // Buscar la billetera en la base de datos
      const walletResult = await pool.query(
        `SELECT id, address, password_hash, salt, encrypted_private_key, encryption_iv
         FROM custodial_wallets
         WHERE LOWER(address) = LOWER($1) AND active = true`,
        [address]
      );

      if (walletResult.rowCount === 0) {
        console.error(`[exportPrivateKey] Billetera no encontrada: ${address}`);
        return null;
      }

      const wallet = walletResult.rows[0];

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, wallet.password_hash);
      if (!passwordMatch) {
        console.error(`[exportPrivateKey] Contraseña incorrecta para: ${address}`);
        return null;
      }

      // Descifrar la clave privada
      const { encryptionKey, iv } = this.deriveEncryptionKey(password, wallet.salt);

      const privateKey = this.decryptPrivateKey(
        wallet.encrypted_private_key,
        encryptionKey,
        Buffer.from(wallet.encryption_iv, 'hex')
      );

      console.log(`[exportPrivateKey] Clave privada exportada exitosamente para: ${address}`);

      // Registrar el evento de exportación para auditoría
      try {
        await pool.query(
          `INSERT INTO custodial_wallet_audit_log (wallet_id, action, ip_address, created_at)
           VALUES ($1, 'private_key_exported', 'system', NOW())`,
          [wallet.id]
        );
      } catch (auditError) {
        // La tabla de auditoría puede no existir, no es crítico
        console.log('[exportPrivateKey] Audit log skipped (table may not exist)');
      }

      return {
        privateKey,
        address: wallet.address
      };
    } catch (error) {
      console.error(`[exportPrivateKey] Error al exportar clave privada:`, error);
      return null;
    }
  }
}

// Exportar instancia del servicio
export const custodialWalletService = new CustodialWalletService();