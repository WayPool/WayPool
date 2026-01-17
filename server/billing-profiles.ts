import { Express, Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { insertBillingProfileSchema } from '@shared/schema';
import { z } from 'zod';
import { ethers } from 'ethers';
import crypto from 'crypto';

// Extender la interfaz Request para incluir la sesión
declare module 'express-session' {
  interface SessionData {
    user?: {
      walletAddress: string;
      isAdmin?: boolean;
    }
  }
}

// Middleware robusto para autenticación de perfiles de facturación con múltiples métodos de verificación
const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔐 [BILLING-AUTH] Iniciando verificación de autenticación...');
    console.log('🔐 [BILLING-AUTH] Método HTTP:', req.method, '| URL:', req.url);
    
    let authenticatedWallet: string | null = null;
    let authMethod = '';
    
    // Método 1: Verificar sesión activa (método principal)
    if (req.session?.user?.walletAddress) {
      authenticatedWallet = req.session.user.walletAddress;
      authMethod = 'sesión activa';
      console.log('✅ [BILLING-AUTH] Autenticado vía sesión:', authenticatedWallet);
    }
    
    // Método 2: Verificar header x-custodial-address (para wallets custodiales)
    if (!authenticatedWallet) {
      const custodialAddress = req.headers['x-custodial-address'] as string;
      if (custodialAddress) {
        console.log('🔍 [BILLING-AUTH] Verificando wallet custodial:', custodialAddress);
        
        try {
          const normalizedAddress = custodialAddress.toLowerCase();
          const user = await storage.getUserByWalletAddress(normalizedAddress);
          
          if (user) {
            authenticatedWallet = user.walletAddress;
            authMethod = 'wallet custodial';
            console.log('✅ [BILLING-AUTH] Autenticado vía wallet custodial:', authenticatedWallet);
            
            // Crear/actualizar sesión para futuras requests
            if (!req.session) req.session = {} as any;
            req.session.user = { 
              walletAddress: user.walletAddress,
              isAdmin: user.isAdmin || false
            };
          }
        } catch (dbError) {
          console.log('⚠️ [BILLING-AUTH] Error consultando DB para wallet custodial:', dbError);
        }
      }
    }
    
    // Método 3: Verificar header x-wallet-address (método estándar)
    if (!authenticatedWallet) {
      const walletHeader = req.headers['x-wallet-address'] as string;
      if (walletHeader) {
        console.log('🔍 [BILLING-AUTH] Verificando wallet header:', walletHeader);
        
        try {
          const normalizedAddress = walletHeader.toLowerCase();
          const user = await storage.getUserByWalletAddress(normalizedAddress);
          
          if (user) {
            authenticatedWallet = user.walletAddress;
            authMethod = 'header wallet estándar';
            console.log('✅ [BILLING-AUTH] Autenticado vía header wallet:', authenticatedWallet);
            
            // Crear/actualizar sesión
            if (!req.session) req.session = {} as any;
            req.session.user = { 
              walletAddress: user.walletAddress,
              isAdmin: user.isAdmin || false
            };
          }
        } catch (dbError) {
          console.log('⚠️ [BILLING-AUTH] Error consultando DB para wallet header:', dbError);
        }
      }
    }
    
    // Método 4: Verificar usando cookies de sesión como último recurso
    if (!authenticatedWallet && req.headers.cookie) {
      console.log('🔍 [BILLING-AUTH] Verificando cookies de sesión como fallback...');
      
      try {
        // Intentar reconstruir sesión desde cookies si existe pero no está disponible
        if (req.sessionID && !req.session?.user) {
          console.log('🔄 [BILLING-AUTH] Intentando reconstruir sesión desde cookies...');
          // Nota: En este punto la sesión debería haberse cargado automáticamente
          // Si no está disponible, es probable que haya expirado
        }
        
        if (req.session?.user?.walletAddress) {
          authenticatedWallet = req.session.user.walletAddress;
          authMethod = 'cookie de sesión reconstruida';
          console.log('✅ [BILLING-AUTH] Autenticado vía cookie reconstruida:', authenticatedWallet);
        }
      } catch (cookieError) {
        console.log('⚠️ [BILLING-AUTH] Error procesando cookies:', cookieError);
      }
    }
    
    // Si tenemos autenticación exitosa, continuar
    if (authenticatedWallet) {
      console.log(`✅ [BILLING-AUTH] Autenticación EXITOSA para ${authenticatedWallet} usando: ${authMethod}`);
      return next();
    }
    
    // Log detallado para debugging en caso de fallo
    console.log('❌ [BILLING-AUTH] FALLO DE AUTENTICACIÓN - Detalles:');
    console.log('   • Session exists:', !!req.session);
    console.log('   • Session user:', req.session?.user ? 'presente' : 'ausente');
    console.log('   • Session wallet:', req.session?.user?.walletAddress || 'ninguno');
    console.log('   • Custodial header:', req.headers['x-custodial-address'] || 'ninguno');
    console.log('   • Wallet header:', req.headers['x-wallet-address'] || 'ninguno');
    console.log('   • Session token:', req.headers['x-session-token'] ? 'presente' : 'ausente');
    console.log('   • Cookies:', req.headers.cookie ? 'presentes' : 'ausentes');
    console.log('   • Session ID:', req.sessionID || 'ninguno');
    
    return res.status(401).json({ 
      message: "Unauthorized - Please log in",
      details: "Authentication failed using all available methods"
    });
    
  } catch (error) {
    console.error('❌ [BILLING-AUTH] Error crítico en middleware de autenticación:', error);
    return res.status(500).json({ 
      message: "Server error during authentication",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lista de direcciones de superadmins que siempre tienen acceso
    const superadminAddresses = [
      "0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f", // Admin principal
      "0x825a23354fef0f82fedc0da599be8ccb3c4e8e28"  // Admin secundario
    ];
    
    // Método 1: Verificar sesión
    if (req.session?.user?.isAdmin === true) {
      console.log(`✅ [Billing] Acceso admin por sesión: ${req.session.user.walletAddress}`);
      return next();
    }
    
    // Método 2: Verificar headers x-wallet-address
    const walletHeader = req.headers['x-wallet-address'] as string;
    if (walletHeader && superadminAddresses.includes(walletHeader.toLowerCase())) {
      console.log(`✅ [Billing] Acceso admin por header superadmin: ${walletHeader}`);
      
      // Actualizar sesión si existe
      if (req.session?.user) {
        req.session.user.isAdmin = true;
      }
      
      return next();
    }
    
    // Método 3: Verificar en base de datos si tenemos dirección de wallet
    if (walletHeader) {
      const dbUser = await storage.getUserByWalletAddress(walletHeader);
      if (dbUser?.isAdmin) {
        console.log(`✅ [Billing] Acceso admin por BD: ${walletHeader}`);
        
        // Actualizar sesión si existe
        if (req.session?.user) {
          req.session.user.isAdmin = true;
        }
        
        return next();
      }
    }
    
    // Método 4: Verificar sesión con consulta a BD
    if (req.session?.user?.walletAddress) {
      const dbUser = await storage.getUserByWalletAddress(req.session.user.walletAddress);
      if (dbUser?.isAdmin) {
        console.log(`✅ [Billing] Acceso admin por sesión verificada en BD: ${req.session.user.walletAddress}`);
        req.session.user.isAdmin = true;
        return next();
      }
    }
    
    console.log(`❌ [Billing] Acceso admin denegado. Sesión: ${JSON.stringify(req.session?.user)}, Header: ${walletHeader}`);
    return res.status(401).json({ message: "Unauthorized - Please log in as admin" });
  } catch (error) {
    console.error("Error en middleware de admin billing:", error);
    return res.status(500).json({ message: "Server error during admin authentication" });
  }
};

export function registerBillingProfileRoutes(app: Express) {
  // Ruta para obtener el perfil de facturación del usuario autenticado
  app.get("/api/billing-profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.session.user!;
      
      const profile = await storage.getBillingProfileByWalletAddress(walletAddress);
      
      if (!profile) {
        return res.status(404).json({ message: "Billing profile not found" });
      }
      
      return res.json(profile);
    } catch (error) {
      console.error("Error getting billing profile:", error);
      return res.status(500).json({ message: "Failed to get billing profile" });
    }
  });
  
  // Ruta para crear o actualizar el perfil de facturación del usuario autenticado
  app.post("/api/billing-profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.session.user!;
      
      // Validar los datos con el esquema
      console.log("Datos recibidos:", JSON.stringify(req.body));
      const validation = insertBillingProfileSchema.safeParse(req.body);
      
      if (!validation.success) {
        console.error("Error de validación:", JSON.stringify(validation.error.format()));
        return res.status(400).json({ 
          message: "Invalid billing profile data", 
          errors: validation.error.format() 
        });
      }
      
      // Los datos son válidos, procesar la solicitud
      const profileData = validation.data;
      
      // Verificar si ya existe un perfil para esta wallet
      const existingProfile = await storage.getBillingProfileByWalletAddress(walletAddress);
      
      let profile;
      if (existingProfile) {
        // Actualizar el perfil existente
        profile = await storage.updateBillingProfileByWalletAddress(
          walletAddress, 
          { ...profileData, updatedAt: new Date() }
        );
      } else {
        // Crear un nuevo perfil
        profile = await storage.createBillingProfile({
          ...profileData,
          walletAddress
        });
      }
      
      // Si se proporcionó un email, sincronizarlo con el perfil del usuario
      if (profileData.email) {
        try {
          await storage.updateUserByWalletAddress(walletAddress, {
            email: profileData.email
          });
          console.log(`✅ Email sincronizado para usuario ${walletAddress}: ${profileData.email}`);
        } catch (emailError) {
          console.error(`⚠️ No se pudo sincronizar el email para ${walletAddress}:`, emailError);
          // No fallar la operación principal por esto
        }
      }
      
      return res.json(profile);
    } catch (error) {
      console.error("Error saving billing profile:", error);
      return res.status(500).json({ message: "Failed to save billing profile" });
    }
  });
  
  // Ruta para verificar un perfil de facturación con blockchain
  app.post("/api/billing-profile/verify", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.session.user!;
      const { signature } = req.body;
      
      if (!signature) {
        return res.status(400).json({ message: "Signature is required" });
      }
      
      // Obtener el perfil de facturación
      const profile = await storage.getBillingProfileByWalletAddress(walletAddress);
      
      if (!profile) {
        return res.status(404).json({ message: "Billing profile not found" });
      }
      
      // Crear hash para verificar - usamos los datos clave del perfil
      const dataToVerify = `${profile.walletAddress}:${profile.fullName}:${profile.email || ''}:${profile.taxId || ''}`;
      const dataHash = crypto.createHash('sha256').update(dataToVerify).digest('hex');
      
      // Verificar la firma (que el usuario firmó el hash con su wallet)
      try {
        const recoveredAddress = ethers.verifyMessage(dataToVerify, signature);
        
        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
          return res.status(400).json({ message: "Invalid signature" });
        }
      } catch (signatureError) {
        console.error("Error al verificar firma:", signatureError);
        return res.status(400).json({ message: "Invalid signature format" });
      }
      
      // La firma es válida, actualizamos los campos de verificación en la BD
      const verifiedProfile = await storage.verifyBillingProfile(profile.id, dataHash);
      
      return res.json(verifiedProfile);
    } catch (error) {
      console.error("Error verifying billing profile:", error);
      return res.status(500).json({ message: "Failed to verify billing profile" });
    }
  });
  
  // === Rutas administrativas ===
  
  // Ruta para obtener todos los perfiles de facturación (solo admin)
  app.get("/api/admin/billing-profiles", isAdmin, async (req: Request, res: Response) => {
    try {
      const profiles = await storage.getAllBillingProfiles();
      return res.json(profiles);
    } catch (error) {
      console.error("Error getting all billing profiles:", error);
      return res.status(500).json({ message: "Failed to get billing profiles" });
    }
  });
  
  // Ruta para obtener un perfil específico por ID (solo admin)
  app.get("/api/admin/billing-profiles/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const profile = await storage.getBillingProfile(id);
      
      if (!profile) {
        return res.status(404).json({ message: "Billing profile not found" });
      }
      
      return res.json(profile);
    } catch (error) {
      console.error(`Error getting billing profile ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to get billing profile" });
    }
  });
  
  // Ruta para actualizar un perfil específico (solo admin)
  app.put("/api/admin/billing-profiles/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Validar los datos parcialmente (permitir actualizaciones parciales)
      const validation = insertBillingProfileSchema.partial().safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid billing profile data", 
          errors: validation.error.format() 
        });
      }
      
      const updatedProfile = await storage.updateBillingProfile(id, validation.data);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: "Billing profile not found" });
      }
      
      return res.json(updatedProfile);
    } catch (error) {
      console.error(`Error updating billing profile ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update billing profile" });
    }
  });
  
  // Ruta para eliminar un perfil (solo admin)
  app.delete("/api/admin/billing-profiles/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const deleted = await storage.deleteBillingProfile(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Billing profile not found" });
      }
      
      return res.json({ success: true, message: "Billing profile deleted successfully" });
    } catch (error) {
      console.error(`Error deleting billing profile ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to delete billing profile" });
    }
  });
  
  // Ruta para verificar o rechazar un perfil de facturación (solo admin)
  app.put("/api/admin/billing-profiles/:id/verify", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Verificar el cuerpo de la solicitud
      const schema = z.object({
        status: z.enum(["Verified", "Rejected"])
      });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validation.error.format() 
        });
      }
      
      const { status } = validation.data;
      
      // Obtener el perfil actual
      const profile = await storage.getBillingProfile(id);
      
      if (!profile) {
        return res.status(404).json({ message: "Billing profile not found" });
      }
      
      // Actualizar el estado de verificación
      const updatedProfile = await storage.updateBillingProfile(id, {
        verificationStatus: status,
        verificationTimestamp: new Date()
      });
      
      return res.json(updatedProfile);
    } catch (error) {
      console.error(`Error verifying billing profile ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to verify billing profile" });
    }
  });
  
  // Ruta para obtener el perfil por dirección de wallet (solo admin)
  app.get("/api/admin/billing-profiles/wallet/:walletAddress", isAdmin, async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress || !ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }
      
      const profile = await storage.getBillingProfileByWalletAddress(walletAddress);
      
      if (!profile) {
        return res.status(404).json({ message: "Billing profile not found" });
      }
      
      return res.json(profile);
    } catch (error) {
      console.error(`Error getting billing profile for wallet ${req.params.walletAddress}:`, error);
      return res.status(500).json({ message: "Failed to get billing profile" });
    }
  });

  // Ruta para actualizar un perfil de facturación (solo admin)
  app.put("/api/admin/billing-profiles/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Esquema de validación para los datos del perfil
      const schema = z.object({
        companyName: z.string().optional(),
        fullName: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        phoneNumber: z.string().optional(),
        taxId: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        notes: z.string().optional(),
        verificationStatus: z.enum(["Pending", "Verified", "Rejected"]).optional()
      });
      
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validation.error.format() 
        });
      }
      
      // Verificar que el perfil existe
      const existingProfile = await storage.getBillingProfile(id);
      
      if (!existingProfile) {
        return res.status(404).json({ message: "Billing profile not found" });
      }
      
      // Actualizar el perfil con los nuevos datos
      const updateData = validation.data;
      
      // Si se está cambiando el estado de verificación, añadir timestamp
      if (updateData.verificationStatus && updateData.verificationStatus !== existingProfile.verificationStatus) {
        (updateData as any).verificationTimestamp = new Date();
      }
      
      const updatedProfile = await storage.updateBillingProfile(id, updateData);
      
      // Si se actualizó el email, sincronizarlo con el perfil del usuario
      if (updateData.email && existingProfile.walletAddress) {
        try {
          await storage.updateUserByWalletAddress(existingProfile.walletAddress, {
            email: updateData.email
          });
          console.log(`✅ Email sincronizado para usuario ${existingProfile.walletAddress}: ${updateData.email}`);
        } catch (emailError) {
          console.error(`⚠️ No se pudo sincronizar el email para ${existingProfile.walletAddress}:`, emailError);
          // No fallar la operación principal por esto
        }
      }
      
      console.log(`✅ Perfil de facturación ${id} actualizado por administrador`);
      
      return res.json(updatedProfile);
    } catch (error) {
      console.error(`Error updating billing profile ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update billing profile" });
    }
  });
}