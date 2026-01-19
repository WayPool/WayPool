import express from "express";
import { z } from "zod";
import { storage } from "./storage";
import { referralEmailService } from "./referral-email-service";
import { Language } from "../client/src/hooks/use-translation";

// Configuración del router
export const referralSubscribeRouter = express.Router();

// Esquema de validación para la suscripción
const subscribeSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido" }),
  language: z.string().optional().default("es"),
  name: z.string().optional(),
  referralCode: z.string().optional()
});

// Ruta para suscribirse al programa de referidos
referralSubscribeRouter.post("/subscribe", async (req, res) => {
  try {
    // Validar datos de entrada
    const validationResult = subscribeSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Datos de suscripción inválidos",
        details: validationResult.error.errors
      });
    }
    
    const { email, language, name, referralCode } = validationResult.data;
    
    // Verificar si el email ya está suscrito
    const existingSubscriber = await storage.getReferralSubscriberByEmail(email);
    
    if (existingSubscriber) {
      // Si ya existe pero está inactivo, reactivarlo
      if (!existingSubscriber.active) {
        await storage.updateReferralSubscriber(existingSubscriber.id, { 
          active: true,
          language: language as Language,
          updatedAt: new Date()
        });
        
        // Enviar email de bienvenida nuevamente
        await referralEmailService.sendWelcomeEmail(
          email, 
          language as Language, 
          existingSubscriber.referralCode || referralCode,
          name
        );
        
        // Notificar al equipo
        await referralEmailService.sendNewSubscriberNotification(email, language as Language, name);
        
        return res.status(200).json({
          success: true,
          message: "Suscripción reactivada correctamente",
          subscriberId: existingSubscriber.id
        });
      }
      
      // Si ya está activo, responder que ya está suscrito
      return res.status(200).json({
        success: true,
        message: "El correo ya está suscrito al programa de referidos",
        subscriberId: existingSubscriber.id
      });
    }
    
    // Crear nuevo suscriptor
    const newSubscriber = await storage.createReferralSubscriber({
      email,
      language: language as Language,
      name,
      referralCode,
      active: true,
      lastEmailSentAt: new Date()
    });
    
    // Enviar email de bienvenida
    await referralEmailService.sendWelcomeEmail(
      email, 
      language as Language, 
      referralCode,
      name
    );
    
    // Notificar al equipo
    await referralEmailService.sendNewSubscriberNotification(email, language as Language, name);
    
    // Responder con éxito
    return res.status(201).json({
      success: true,
      message: "Suscripción realizada correctamente",
      subscriberId: newSubscriber.id
    });
  } catch (error) {
    console.error("Error al procesar la suscripción:", error);
    return res.status(500).json({
      success: false,
      error: "Error al procesar la suscripción"
    });
  }
});

// Ruta para cancelar la suscripción (desactivar)
referralSubscribeRouter.post("/unsubscribe", async (req, res) => {
  try {
    // Validar datos de entrada
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Se requiere un correo electrónico"
      });
    }
    
    // Buscar el suscriptor por email
    const subscriber = await storage.getReferralSubscriberByEmail(email);
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        error: "Suscriptor no encontrado"
      });
    }
    
    // Desactivar suscripción
    await storage.updateReferralSubscriber(subscriber.id, { 
      active: false,
      updatedAt: new Date()
    });
    
    // Responder con éxito
    return res.status(200).json({
      success: true,
      message: "Suscripción cancelada correctamente"
    });
  } catch (error) {
    console.error("Error al cancelar la suscripción:", error);
    return res.status(500).json({
      success: false,
      error: "Error al cancelar la suscripción"
    });
  }
});

// Ruta para verificar si un email está suscrito
referralSubscribeRouter.get("/check", async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Se requiere un correo electrónico válido"
      });
    }
    
    // Buscar el suscriptor por email
    const subscriber = await storage.getReferralSubscriberByEmail(email);
    
    return res.status(200).json({
      success: true,
      isSubscribed: !!subscriber && subscriber.active,
      subscriber: subscriber ? {
        id: subscriber.id,
        email: subscriber.email,
        language: subscriber.language,
        active: subscriber.active
      } : null
    });
  } catch (error) {
    console.error("Error al verificar suscripción:", error);
    return res.status(500).json({
      success: false,
      error: "Error al verificar suscripción"
    });
  }
});

// Exportar la función para registrar las rutas
export function registerReferralSubscribeRoutes(app: express.Express) {
  app.use("/api/referral", referralSubscribeRouter);
  console.log("Rutas de suscripción al programa de referidos registradas");
}