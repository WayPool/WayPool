import express, { Response, NextFunction } from 'express';
import { insertAppConfigSchema } from '@shared/schema';
import { storage } from './storage';
import { implementAppConfigOperationsForMemStorage, implementAppConfigOperationsForDatabaseStorage } from './app-config-operations';

// Extendemos el tipo Request para incluir session
interface Request extends express.Request {
  session: {
    user?: {
      walletAddress: string;
      isAdmin: boolean;
    }
  }
}

// Middlewares de autenticación
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Verificar autenticación por sesión
  if (req.session && req.session.user) {
    return next();
  }
  
  // Verificar autenticación por encabezados (para solicitudes directas desde el cliente)
  const isAdminHeader = req.headers['x-is-admin'];
  const walletAddressHeader = req.headers['x-wallet-address'];
  
  if (isAdminHeader === 'true' && walletAddressHeader) {
    // Verificar que la dirección del wallet sea válida (formato básico)
    const walletAddress = walletAddressHeader.toString();
    if (walletAddress.startsWith('0x') && walletAddress.length === 42) {
      // Crear un objeto de sesión temporal para esta solicitud
      req.session = req.session || {} as any;
      req.session.user = {
        walletAddress: walletAddress,
        isAdmin: true
      };
      console.log('[AppConfig] Autenticación por encabezados aceptada para:', walletAddress);
      return next();
    }
  }
  
  return res.status(401).json({ message: "Unauthorized - Please log in" });
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Primero verificamos si hay una sesión activa
    if (!req.session || !req.session.user) {
      // Verificar encabezados como último recurso
      const isAdminHeader = req.headers['x-is-admin'];
      if (isAdminHeader === 'true') {
        console.log('[AppConfig] Acceso admin autorizado por encabezado X-Is-Admin');
        return next();
      }
      
      return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    
    // Si hay un encabezado X-Is-Admin=true, permitir acceso independientemente de la sesión
    const isAdminHeader = req.headers['x-is-admin'];
    if (isAdminHeader === 'true') {
      console.log('[AppConfig] Acceso admin autorizado por encabezado X-Is-Admin');
      return next();
    }
    
    // Verificar si el usuario es administrador en la sesión
    if (!req.session.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Error al verificar permisos de administrador:", error);
    res.status(500).json({ message: "Error interno al verificar permisos" });
  }
};

// Inicializando las operaciones para appConfig en storage
if ('appConfigMap' in storage) {
  implementAppConfigOperationsForMemStorage(storage as any);
} else {
  implementAppConfigOperationsForDatabaseStorage(storage as any);
}

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get('/app-config/version', async (req, res) => {
  try {
    const versionConfig = await storage.getAppConfigByKey('app_version');
    if (!versionConfig) {
      return res.status(404).json({ error: 'Versión de la aplicación no configurada' });
    }
    
    res.json({ version: versionConfig.value });
  } catch (error) {
    console.error('Error al obtener la versión de la aplicación:', error);
    res.status(500).json({ error: 'Error al obtener la versión de la aplicación' });
  }
});

// Rutas protegidas (requieren autenticación)
router.get('/app-config', isAuthenticated, async (req, res) => {
  try {
    const configs = await storage.getAllAppConfig();
    res.json(configs);
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ error: 'Error al obtener configuraciones de la aplicación' });
  }
});

router.get('/app-config/:key', isAuthenticated, async (req, res) => {
  try {
    const { key } = req.params;
    const config = await storage.getAppConfigByKey(key);
    
    if (!config) {
      return res.status(404).json({ error: `Configuración con clave ${key} no encontrada` });
    }
    
    res.json(config);
  } catch (error) {
    console.error(`Error al obtener configuración ${req.params.key}:`, error);
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
});

// Rutas de administrador (requieren ser admin)
router.post('/admin/app-config', isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Validar el cuerpo de la petición
    const result = insertAppConfigSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Datos de configuración inválidos',
        details: result.error.format()
      });
    }
    
    // Verificar si ya existe una configuración con la misma clave
    const existingConfig = await storage.getAppConfigByKey(result.data.key);
    if (existingConfig) {
      return res.status(409).json({ error: 'Ya existe una configuración con esta clave' });
    }
    
    // Crear la nueva configuración
    const newConfig = await storage.createAppConfig(result.data);
    res.status(201).json(newConfig);
  } catch (error) {
    console.error('Error al crear configuración:', error);
    res.status(500).json({ error: 'Error al crear la configuración' });
  }
});

router.put('/admin/app-config/:key', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (!value || typeof value !== 'string') {
      return res.status(400).json({ error: 'Se requiere un valor de tipo string' });
    }
    
    // Verificar si existe la configuración
    const existingConfig = await storage.getAppConfigByKey(key);
    if (!existingConfig) {
      return res.status(404).json({ error: `Configuración con clave ${key} no encontrada` });
    }
    
    // Actualizar la configuración
    const updatedConfig = await storage.updateAppConfig(key, value);
    if (!updatedConfig) {
      return res.status(404).json({ error: `No se pudo actualizar la configuración ${key}` });
    }
    
    res.json(updatedConfig);
  } catch (error) {
    console.error(`Error al actualizar configuración ${req.params.key}:`, error);
    res.status(500).json({ error: 'Error al actualizar la configuración' });
  }
});

router.delete('/admin/app-config/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de configuración inválido' });
    }
    
    const success = await storage.deleteAppConfig(id);
    if (!success) {
      return res.status(404).json({ error: `Configuración con ID ${id} no encontrada` });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar configuración ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al eliminar la configuración' });
  }
});

export default router;