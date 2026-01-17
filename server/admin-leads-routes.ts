import express, { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { leads, leadStatus } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { isAdmin } from './middleware'; // Importamos el middleware robusto de verificación

// Usamos la declaración de módulo para mantener tipado de sesión
declare module 'express-session' {
  interface SessionData {
    user?: {
      walletAddress: string;
      isAdmin?: boolean;
    }
  }
}

const router = express.Router();

// Registro de información adicional para diagnóstico
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[AdminLeads] Accediendo a ${req.method} ${req.originalUrl}`);
  console.log(`[AdminLeads] Sesión: ${req.session?.user ? 'Existe' : 'No existe'}`);
  if (req.session?.user) {
    console.log(`[AdminLeads] Usuario: ${req.session.user.walletAddress}, isAdmin: ${req.session.user.isAdmin}`);
  }
  
  // Logs adicionales para verificación de permisos
  const walletAddress = req.headers['x-wallet-address'] as string || 
                      (req.session?.user?.walletAddress) || 
                      req.params.walletAddress || 
                      req.body?.walletAddress;
  
  console.log(`[AdminLeads] Headers de autenticación: ${req.headers['x-wallet-address'] || 'ninguno'}`);
  console.log(`[AdminLeads] Dirección de wallet detectada: ${walletAddress || 'ninguna'}`);
  
  next();
});

// Obtener todos los leads (solo para admins)
router.get('/', isAdmin, async (req: Request, res: Response) => {
  try {
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
    
    // Sanitizar leads para asegurar que additionalData sea un objeto válido JSON
    const sanitizedLeads = allLeads.map(lead => {
      let sanitizedLead = { ...lead };
      
      // Manejar el campo additionalData para asegurar que sea un objeto válido
      try {
        if (sanitizedLead.additionalData) {
          // Si es un string, intentar parsearlo como JSON
          if (typeof sanitizedLead.additionalData === 'string') {
            console.log(`Lead #${sanitizedLead.id}: additionalData es string, intentando parsear`);
            try {
              sanitizedLead.additionalData = JSON.parse(sanitizedLead.additionalData);
            } catch (parseError) {
              console.error(`Error al parsear additionalData para lead #${sanitizedLead.id}:`, parseError);
              sanitizedLead.additionalData = {}; // Usar objeto vacío en caso de error
            }
          }
          // Si no es un objeto, establecerlo como un objeto vacío
          else if (typeof sanitizedLead.additionalData !== 'object' || sanitizedLead.additionalData === null) {
            console.log(`Lead #${sanitizedLead.id}: additionalData no es objeto, estableciendo objeto vacío`);
            sanitizedLead.additionalData = {};
          }
        } else {
          // Si es undefined o null, usar un objeto vacío
          sanitizedLead.additionalData = {};
        }
      } catch (error) {
        console.error(`Error general sanitizando additionalData para lead #${sanitizedLead.id}:`, error);
        sanitizedLead.additionalData = {}; // En caso de error general, usar un objeto vacío
      }
      
      return sanitizedLead;
    });
    
    res.json(sanitizedLeads);
  } catch (error) {
    console.error('Error al obtener leads:', error);
    res.status(500).json({ error: 'Error al obtener los leads' });
  }
});

// Obtener un lead específico por ID (solo para admins)
router.get('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const leadId = parseInt(req.params.id);
    if (isNaN(leadId)) {
      return res.status(400).json({ error: 'ID de lead inválido' });
    }
    
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }
    
    // Sanitizar el campo additionalData para asegurar que sea un objeto válido
    let sanitizedLead = { ...lead };
    
    try {
      if (sanitizedLead.additionalData) {
        // Si es un string, intentar parsearlo como JSON
        if (typeof sanitizedLead.additionalData === 'string') {
          console.log(`Lead #${sanitizedLead.id}: additionalData es string, intentando parsear`);
          try {
            sanitizedLead.additionalData = JSON.parse(sanitizedLead.additionalData);
          } catch (parseError) {
            console.error(`Error al parsear additionalData para lead #${sanitizedLead.id}:`, parseError);
            sanitizedLead.additionalData = {}; // Usar objeto vacío en caso de error
          }
        }
        // Si no es un objeto, establecerlo como un objeto vacío
        else if (typeof sanitizedLead.additionalData !== 'object' || sanitizedLead.additionalData === null) {
          console.log(`Lead #${sanitizedLead.id}: additionalData no es objeto, estableciendo objeto vacío`);
          sanitizedLead.additionalData = {};
        }
      } else {
        // Si es undefined o null, usar un objeto vacío
        sanitizedLead.additionalData = {};
      }
    } catch (error) {
      console.error(`Error general sanitizando additionalData para lead #${sanitizedLead.id}:`, error);
      sanitizedLead.additionalData = {}; // En caso de error general, usar un objeto vacío
    }
    
    res.json(sanitizedLead);
  } catch (error) {
    console.error('Error al obtener lead:', error);
    res.status(500).json({ error: 'Error al obtener el lead' });
  }
});

// Actualizar estado de un lead (solo para admins)
router.patch('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const leadId = parseInt(req.params.id);
    if (isNaN(leadId)) {
      return res.status(400).json({ error: 'ID de lead inválido' });
    }
    
    // Esquema de validación para los datos de actualización
    const updateSchema = z.object({
      status: z.enum(['nuevo', 'contactado', 'interesado', 'convertido', 'no_interesado', 'inactivo']),
      notes: z.string().optional().nullable(),
      assignedTo: z.string().optional().nullable(),
      followUpDate: z.string().optional().nullable(),
      additionalData: z.any().optional()
    });
    
    // Validar los datos recibidos
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      console.error('Datos de actualización inválidos:', validationResult.error.format());
      return res.status(400).json({ 
        error: 'Datos de actualización inválidos',
        details: validationResult.error.format() 
      });
    }
    
    const { status, notes, assignedTo, followUpDate, additionalData } = validationResult.data;
    
    // Verificar si el lead existe
    const [existingLead] = await db.select().from(leads).where(eq(leads.id, leadId));
    
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }
    
    // Preparar datos para actualizar
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    // Solo agregar campos que están presentes en la solicitud
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (followUpDate !== undefined) updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
    
    // Manejar additionalData de forma segura
    if (additionalData !== undefined) {
      // Sanitizar additionalData si existe
      try {
        // Si es string, intentar parsearlo
        if (typeof additionalData === 'string') {
          console.log(`Actualizando lead #${leadId}: additionalData es string, intentando parsear`);
          try {
            updateData.additionalData = JSON.parse(additionalData);
          } catch (parseError) {
            console.error(`Error al parsear additionalData en actualización para lead #${leadId}:`, parseError);
            // Si el existingLead tiene additionalData, mantenerlo en lugar de sobreescribir con objeto vacío
            if (existingLead.additionalData && typeof existingLead.additionalData === 'object') {
              updateData.additionalData = existingLead.additionalData;
            } else {
              updateData.additionalData = {};
            }
          }
        } 
        // Si es null, usar objeto vacío
        else if (additionalData === null) {
          updateData.additionalData = {};
        }
        // Si es objeto, usarlo directamente
        else if (typeof additionalData === 'object') {
          updateData.additionalData = additionalData;
        }
        // Si no es ni string ni objeto, usar el additionalData existente o un objeto vacío
        else {
          if (existingLead.additionalData && typeof existingLead.additionalData === 'object') {
            updateData.additionalData = existingLead.additionalData;
          } else {
            updateData.additionalData = {};
          }
        }
      } catch (error) {
        console.error(`Error general manejando additionalData en actualización para lead #${leadId}:`, error);
        // Mantener el additionalData existente si hay error
        if (existingLead.additionalData && typeof existingLead.additionalData === 'object') {
          updateData.additionalData = existingLead.additionalData;
        } else {
          updateData.additionalData = {};
        }
      }
    }
    
    // Si se está cambiando el estado a 'contactado', actualizar lastContact
    if (status === 'contactado') {
      updateData.lastContact = new Date();
    }
    
    console.log('Actualizando lead con datos:', updateData);
    
    // Actualizar el lead
    const [updatedLead] = await db.update(leads)
      .set(updateData)
      .where(eq(leads.id, leadId))
      .returning();
    
    res.json({ 
      success: true, 
      message: 'Lead actualizado correctamente',
      lead: updatedLead
    });
  } catch (error) {
    console.error('Error al actualizar lead:', error);
    res.status(500).json({ error: 'Error al actualizar el lead' });
  }
});

// Exportar el router para usarlo en routes.ts
export function registerAdminLeadsRoutes(app: express.Express) {
  app.use('/api/admin/leads', router);
  console.log('Admin leads routes registered successfully');
}