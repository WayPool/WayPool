import express, { Request, Response } from 'express';
import { z } from 'zod';
import { db } from './db';
import { leads, type Lead, insertLeadSchema } from '../shared/schema';
import { sendEmail } from './lead-email-service';
import { format } from 'date-fns';
import { eq, asc, desc } from 'drizzle-orm';

// Extender la interfaz Request de Express para incluir la autenticación y sesión
declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): boolean;
      user?: any;
    }
  }
}

// Router para las rutas de leads
const leadsRouter = express.Router();

// Esquema para validar datos del formulario de leads
const leadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  phoneFormatted: z.string().optional(),
  company: z.string().optional(),
  investmentSize: z.string(),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true),
  languagePreference: z.string().optional(),
});

// POST /api/leads - Crear un nuevo lead
leadsRouter.post('/', async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const validationResult = leadSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de formulario inválidos',
        details: validationResult.error.format()
      });
    }
    
    const leadData = validationResult.data;
    
    // Obtener la fecha actual formateada
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
    
    // Preparar información adicional para almacenamiento
    const additionalData: Record<string, any> = {};
    
    // Guardar información del teléfono en additionalData para no modificar el esquema de la tabla
    if (leadData.phoneCountryCode) {
      additionalData.phoneCountryCode = leadData.phoneCountryCode;
    }
    
    if (leadData.phoneFormatted) {
      additionalData.phoneFormatted = leadData.phoneFormatted;
    }
    
    // Guardar el lead en la base de datos
    const [newLead] = await db.insert(leads).values({
      // Usamos el formato camelCase correspondiente a la definición en schema.ts
      fullName: leadData.fullName,
      email: leadData.email,
      phone: leadData.phone || null,
      company: leadData.company || null,
      investmentSize: leadData.investmentSize,
      message: leadData.message || null,
      consentGiven: leadData.consent,
      createdAt: currentDate,
      updatedAt: currentDate,
      status: 'nuevo', // Estado inicial usando el enum
      assignedTo: null, // Nadie asignado inicialmente
      source: 'landing_page', // Fuente: landing page
      languagePreference: leadData.languagePreference || 'es', // Usar el idioma proporcionado o español por defecto
      additionalData: Object.keys(additionalData).length > 0 ? additionalData : null, // Guardar información adicional en JSONB
    }).returning();

    // Enviar email de notificación al equipo
    try {
      // Definir correos predeterminados para notificación
      const adminEmails = ['info@elysiumdubai.net'];
      
      // Intentar obtener correos de administradores desde la base de datos
      try {
        const admins = await db.query.users.findMany({
          where: (users, { eq }) => eq(users.isAdmin, true)
        });
        
        // Agregar los emails de administradores que tengan su campo walletAddress configurado con dominio
        admins.forEach(admin => {
          if (admin.walletAddress && admin.walletAddress.includes('@')) {
            adminEmails.push(admin.walletAddress);
          }
        });
      } catch (dbError) {
        console.error('[Lead Email Service] Error obteniendo administradores:', dbError);
        // Continuamos con los emails predeterminados
      }
      
      console.log(`[Lead Email Service] Enviando notificaciones a ${adminEmails.length} administradores:`, adminEmails.join(', '));
      
      // Función para obtener el nombre del idioma en español
      const getLanguageDisplayName = (langCode: string): string => {
        const languageNames: Record<string, string> = {
          es: 'Español',
          en: 'Inglés',
          ar: 'Árabe',
          pt: 'Portugués',
          it: 'Italiano',
          fr: 'Francés',
          de: 'Alemán',
          hi: 'Hindi',
          zh: 'Chino'
        };
        return languageNames[langCode] || langCode;
      };

      // Determinar el idioma del email para administradores (mantener notificaciones en español)
      const userLanguage = leadData.languagePreference || 'es';
      
      // Contenido del correo para administradores
      const emailSubject = '¡Nuevo Lead Registrado!';
      
      // Incluir el idioma preferido del lead en la notificación para administradores
      const emailText = `
        Nuevo lead registrado en WayBank:
        
        Nombre: ${leadData.fullName}
        Email: ${leadData.email}
        Teléfono: ${leadData.phone || 'No proporcionado'}
        País: ${leadData.phoneCountryCode ? leadData.phoneCountryCode.toUpperCase() : 'No identificado'}
        Empresa: ${leadData.company || 'No proporcionada'}
        Rango de inversión: ${leadData.investmentSize}
        Mensaje: ${leadData.message || 'No proporcionado'}
        Idioma preferido: ${getLanguageDisplayName(userLanguage)}
        
        Fecha: ${formattedDate}
        
        Este lead requiere seguimiento.
      `;
      
      const emailHtml = `
        <h2>Nuevo lead registrado en WayBank</h2>
        
        <p><strong>Nombre:</strong> ${leadData.fullName}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Teléfono:</strong> ${leadData.phone || 'No proporcionado'}</p>
        <p><strong>País:</strong> ${leadData.phoneCountryCode ? leadData.phoneCountryCode.toUpperCase() : 'No identificado'}</p>
        <p><strong>Empresa:</strong> ${leadData.company || 'No proporcionada'}</p>
        <p><strong>Rango de inversión:</strong> ${leadData.investmentSize}</p>
        <p><strong>Mensaje:</strong> ${leadData.message || 'No proporcionado'}</p>
        <p><strong>Idioma preferido:</strong> ${getLanguageDisplayName(userLanguage)}</p>
        
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        
        <p>Este lead requiere seguimiento.</p>
        <p>Puedes administrar este lead desde el <a href="${process.env.APP_URL || 'https://waybank.info'}/admin?tab=leads">panel de administración</a>.</p>
      `;
      
      // Enviar email a cada administrador
      for (const adminEmail of adminEmails) {
        console.log(`[Lead Email Service] Enviando notificación de lead a: ${adminEmail}`);
        
        await sendEmail({
          to: adminEmail,
          from: 'info@elysiumdubai.net',
          subject: emailSubject,
          text: emailText,
          html: emailHtml
        });
      }
      
      console.log(`Notification email sent for lead: ${newLead.id} to ${adminEmails.join(', ')}`);
    } catch (emailError) {
      console.error('Error sending lead notification email:', emailError);
      // No fallamos la petición si falla el email, solo lo registramos
    }
    
    // Enviar email de confirmación al usuario con diseño mejorado y en el idioma seleccionado
    try {
      // Determinar el idioma del email
      const userLanguage = leadData.languagePreference || 'es';
      
      // Contenido del email según el idioma
      let emailSubject, emailText, emailHtml;
      
      // Versión en inglés para inglés y otros idiomas no-españoles (excepto portugués)
      if (userLanguage === 'en' || (userLanguage !== 'es' && userLanguage !== 'pt')) {
        // Versión en inglés
        emailSubject = 'Thank you for your interest in WayBank';
        emailText = `
          Hello ${leadData.fullName},
          
          Thank you for contacting us! We have received your request for information about WayBank.
          
          At WayBank, we offer advanced investment solutions using Delta Neutral strategies that reduce the risk of capital loss to only 5%, while maximizing your returns.
          
          A member of our team will contact you soon to provide you with more details about our platform and answer all your questions.
          
          In the meantime, we invite you to visit our website: https://waybank.info
          
          If you have any urgent questions, please don't hesitate to reply to this email.
          
          Thank you very much for your interest!
          
          Sincerely,
          The WayBank Team
        `;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for your interest in WayBank</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #0E3255;
                padding: 20px;
                text-align: center;
              }
              .header img {
                max-width: 180px;
              }
              .content {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 0 0 5px 5px;
                border: 1px solid #e0e0e0;
                border-top: none;
              }
              h1 {
                color: #0E3255;
                font-size: 24px;
                margin-top: 0;
              }
              .greeting {
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                background-color: #0E3255;
                color: #ffffff !important;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-weight: bold;
                margin: 20px 0;
              }
              .features {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
              }
              .features ul {
                margin: 10px 0;
                padding-left: 20px;
              }
              .features li {
                margin-bottom: 8px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 14px;
                color: #777777;
              }
              .social {
                margin-top: 15px;
              }
              .social a {
                display: inline-block;
                margin: 0 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: #ffffff; font-size: 36px; font-weight: bold; margin: 0; padding: 0; letter-spacing: 1px;">WayBank</h1>
              </div>
              <div class="content">
                <h1>Thank you for your interest in WayBank!</h1>
                
                <p class="greeting">Hello ${leadData.fullName},</p>
                
                <p>We have received your request for information about WayBank. We appreciate your interest in our innovative investment platform.</p>
                
                <div class="features">
                  <p><strong>At WayBank we offer:</strong></p>
                  <ul>
                    <li>Delta Neutral strategies that reduce the risk of capital loss to only 5%</li>
                    <li>Returns above the market average</li>
                    <li>Access to investments in Uniswap liquidity pools</li>
                    <li>Complete dashboard to monitor your investments</li>
                    <li>Personalized support from blockchain experts</li>
                  </ul>
                </div>
                
                <p>A member of our team will contact you soon to provide you with more details about our platform and answer all your questions.</p>
                
                <p>In the meantime, we invite you to learn more about us:</p>
                
                <div style="text-align: center;">
                  <a href="https://waybank.info" class="button">Visit WayBank.net</a>
                </div>
                
                <p>If you have any urgent questions, please don't hesitate to reply to this email and we'll be happy to help you.</p>
                
                <p>Thank you again for your interest!</p>
                
                <p>Sincerely,<br/>The WayBank Team</p>
              </div>
              
              <div class="footer">
                <p>© 2025 WayBank. All rights reserved.</p>
                <p>Dubai, UAE</p>
                <div class="social">
                  <a href="https://twitter.com/waybank" target="_blank">Twitter</a> | 
                  <a href="https://linkedin.com/company/waybank" target="_blank">LinkedIn</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
      } else {
        // Versión por defecto en español (o portugués que se basa en el español)
        emailSubject = 'Gracias por tu interés en WayBank';
        emailText = `
          Hola ${leadData.fullName},
          
          ¡Gracias por contactarnos! Hemos recibido tu solicitud de información sobre WayBank.
          
          En WayBank, ofrecemos soluciones de inversión avanzadas utilizando estrategias Delta Neutral que reducen el riesgo de pérdida de capital a solo un 5%, mientras maximizan tus rendimientos.
          
          Un miembro de nuestro equipo te contactará pronto para brindarte más detalles sobre nuestra plataforma y responder a todas tus preguntas.
          
          Mientras tanto, te invitamos a visitar nuestra página web: https://waybank.info
          
          Si tienes alguna consulta urgente, no dudes en respondernos a este correo.
          
          ¡Muchas gracias por tu interés!
          
          Cordialmente,
          El equipo de WayBank
        `;
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Gracias por tu interés en WayBank</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #0E3255;
                padding: 20px;
                text-align: center;
              }
              .header img {
                max-width: 180px;
              }
              .content {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 0 0 5px 5px;
                border: 1px solid #e0e0e0;
                border-top: none;
              }
              h1 {
                color: #0E3255;
                font-size: 24px;
                margin-top: 0;
              }
              .greeting {
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                background-color: #0E3255;
                color: #ffffff !important;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-weight: bold;
                margin: 20px 0;
              }
              .features {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
              }
              .features ul {
                margin: 10px 0;
                padding-left: 20px;
              }
              .features li {
                margin-bottom: 8px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 14px;
                color: #777777;
              }
              .social {
                margin-top: 15px;
              }
              .social a {
                display: inline-block;
                margin: 0 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: #ffffff; font-size: 36px; font-weight: bold; margin: 0; padding: 0; letter-spacing: 1px;">WayBank</h1>
              </div>
              <div class="content">
                <h1>¡Gracias por tu interés en WayBank!</h1>
                
                <p class="greeting">Hola ${leadData.fullName},</p>
                
                <p>Hemos recibido tu solicitud de información sobre WayBank. Agradecemos tu interés en nuestra plataforma innovadora de inversiones.</p>
                
                <div class="features">
                  <p><strong>En WayBank ofrecemos:</strong></p>
                  <ul>
                    <li>Estrategias Delta Neutral que reducen el riesgo de pérdida de capital a solo un 5%</li>
                    <li>Rendimientos superiores a la media del mercado</li>
                    <li>Acceso a inversiones en pools de liquidez de Uniswap</li>
                    <li>Dashboard completo para monitorear tus inversiones</li>
                    <li>Soporte personalizado por expertos en blockchain</li>
                  </ul>
                </div>
                
                <p>Un miembro de nuestro equipo te contactará pronto para brindarte más detalles sobre nuestra plataforma y responder a todas tus preguntas.</p>
                
                <p>Mientras tanto, te invitamos a conocer más sobre nosotros:</p>
                
                <div style="text-align: center;">
                  <a href="https://waybank.info" class="button">Visitar WayBank.net</a>
                </div>
                
                <p>Si tienes alguna consulta urgente, no dudes en responder a este correo y estaremos encantados de ayudarte.</p>
                
                <p>¡Gracias de nuevo por tu interés!</p>
                
                <p>Cordialmente,<br/>El equipo de WayBank</p>
              </div>
              
              <div class="footer">
                <p>© 2025 WayBank. Todos los derechos reservados.</p>
                <p>Dubai, UAE</p>
                <div class="social">
                  <a href="https://twitter.com/waybank" target="_blank">Twitter</a> | 
                  <a href="https://linkedin.com/company/waybank" target="_blank">LinkedIn</a>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
      }
      
      // Enviar email según el idioma del usuario
      await sendEmail({
        to: leadData.email,
        from: 'WayBank <info@elysiumdubai.net>',
        subject: emailSubject,
        text: emailText,
        html: emailHtml
      });
      
      console.log(`Confirmation email sent to: ${leadData.email}`);
    } catch (emailError) {
      console.error('Error sending lead confirmation email:', emailError);
      // No fallamos la petición si falla el email, solo lo registramos
    }

    // Devolver respuesta exitosa
    return res.status(201).json({ 
      success: true, 
      message: 'Lead registrado correctamente',
      leadId: newLead.id
    });
    
  } catch (error) {
    console.error('Error al registrar lead:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al procesar el lead' 
    });
  }
});

// GET /api/leads - Obtener todos los leads (solo para administradores)
leadsRouter.get('/', async (req: Request, res: Response) => {
  // Verificar si el usuario está autenticado y es administrador
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  // Verificar si el usuario tiene permisos de administrador
  const user = req.user;
  if (!user || !(user as any).is_admin) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  try {
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return res.status(200).json(allLeads);
  } catch (error) {
    console.error('Error al obtener leads:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/leads/:id - Obtener un lead específico (solo para administradores)
leadsRouter.get('/:id', async (req: Request, res: Response) => {
  // Verificar si el usuario está autenticado y es administrador
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  // Verificar si el usuario tiene permisos de administrador
  const user = req.user;
  if (!user || !(user as any).is_admin) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  const leadId = parseInt(req.params.id);
  if (isNaN(leadId)) {
    return res.status(400).json({ error: 'ID de lead inválido' });
  }
  
  try {
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }
    
    return res.status(200).json(lead);
  } catch (error) {
    console.error(`Error al obtener lead ${leadId}:`, error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PATCH /api/leads/:id - Actualizar estado de un lead (solo para administradores)
leadsRouter.patch('/:id', async (req: Request, res: Response) => {
  // Verificar si el usuario está autenticado y es administrador
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  // Verificar si el usuario tiene permisos de administrador
  const user = req.user;
  if (!user || !(user as any).is_admin) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  const leadId = parseInt(req.params.id);
  if (isNaN(leadId)) {
    return res.status(400).json({ error: 'ID de lead inválido' });
  }
  
  // Validar datos de entrada
  const updateSchema = z.object({
    status: z.enum(['nuevo', 'contactado', 'interesado', 'convertido', 'no_interesado', 'inactivo']).optional(),
    assignedTo: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    followUpDate: z.string().optional().nullable(),
    additionalData: z.any().optional()
  });
  
  try {
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Datos de actualización inválidos',
        details: validationResult.error.format()
      });
    }
    
    const updateData = validationResult.data;
    const updateValues: Record<string, any> = {};
    
    // Mapear datos a actualizar
    if (updateData.status !== undefined) {
      updateValues.status = updateData.status;
    }
    
    if (updateData.assignedTo !== undefined) {
      updateValues.assigned_to = updateData.assignedTo;
    }
    
    if (updateData.notes !== undefined) {
      updateValues.notes = updateData.notes;
    }
    
    if (updateData.followUpDate !== undefined) {
      updateValues.follow_up_date = updateData.followUpDate ? new Date(updateData.followUpDate) : null;
    }
    
    if (updateData.additionalData !== undefined) {
      updateValues.additional_data = updateData.additionalData;
    }
    
    // Actualizar timestamp
    updateValues.updated_at = new Date();
    
    // Si se está cambiando el estado a 'contactado', actualizar lastContact
    if (updateData.status === 'contactado') {
      updateValues.last_contact = new Date();
    }
    
    // Actualizar en la base de datos con manejo correcto de tipos
    // Para la actualización, convertimos updateValues a un objeto compatible con los campos en la tabla
    const leadUpdateValues: any = {};
    
    if (updateValues.status !== undefined) {
      leadUpdateValues.status = updateValues.status;
    }
    
    if (updateValues.assignedTo !== undefined) {
      leadUpdateValues.assignedTo = updateValues.assignedTo;
    } else if (updateValues.assigned_to !== undefined) {
      leadUpdateValues.assignedTo = updateValues.assigned_to;
    }
    
    if (updateValues.notes !== undefined) {
      leadUpdateValues.notes = updateValues.notes;
    }
    
    if (updateValues.followUpDate !== undefined) {
      leadUpdateValues.followUpDate = updateValues.followUpDate;
    } else if (updateValues.follow_up_date !== undefined) {
      leadUpdateValues.followUpDate = updateValues.follow_up_date;
    }
    
    if (updateValues.additionalData !== undefined) {
      leadUpdateValues.additionalData = updateValues.additionalData;
    } else if (updateValues.additional_data !== undefined) {
      leadUpdateValues.additionalData = updateValues.additional_data;
    }
    
    if (updateValues.updated_at !== undefined) {
      leadUpdateValues.updatedAt = updateValues.updated_at;
    }
    
    if (updateValues.last_contact !== undefined) {
      leadUpdateValues.lastContact = updateValues.last_contact;
    }
    
    const [updatedLead] = await db
      .update(leads)
      .set(leadUpdateValues)
      .where(eq(leads.id, leadId))
      .returning();
    
    if (!updatedLead) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Lead actualizado correctamente',
      lead: updatedLead
    });
    
  } catch (error) {
    console.error(`Error al actualizar lead ${leadId}:`, error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Exportar el router
export function registerLeadRoutes(app: express.Express) {
  app.use('/api/leads', leadsRouter);
}

export default leadsRouter;