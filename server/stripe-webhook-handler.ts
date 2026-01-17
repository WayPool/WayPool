import express, { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from './db';
import { sql } from 'drizzle-orm';

// Clave secreta del webhook proporcionada por Stripe al configurar el webhook
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export default function createStripeWebhookRouter() {
  const router = Router();

  router.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    console.log('⚡ Webhook de Stripe recibido');
    
    const sig = req.headers['stripe-signature'] as string;
    if (!sig) {
      console.error('Error: No se proporcionó firma de webhook');
      return res.status(400).send('No se proporcionó firma de webhook');
    }

    let event;
    
    // Verificar la firma del webhook para asegurar que la solicitud proviene de Stripe
    try {
      if (STRIPE_WEBHOOK_SECRET) {
        // Si tenemos la clave secreta del webhook, verificamos la firma
        const payload = req.body;
        const signature = req.headers['stripe-signature'] as string;
        
        // Crear un HMAC hexadecimal usando la clave secreta
        const expectedSignature = crypto
          .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
          .update(payload.toString())
          .digest('hex');
        
        // Verificar la firma
        // Formato típico de Stripe: t=timestamp,v1=signature
        const signatureParts = signature.split(',');
        let isValid = false;
        
        for (const part of signatureParts) {
          if (part.startsWith('v1=')) {
            const stripeSignature = part.substring(3);
            // Verificar usando un método de tiempo constante para evitar timing attacks
            isValid = crypto.timingSafeEqual(
              Buffer.from(expectedSignature),
              Buffer.from(stripeSignature)
            );
            if (isValid) break;
          }
        }
        
        if (!isValid) {
          console.error('⚠️ Firma de webhook inválida');
          return res.status(400).send('Firma de webhook inválida');
        }
      } else {
        console.warn('⚠️ STRIPE_WEBHOOK_SECRET no configurado. Se omitió la verificación de firma.');
      }
      
      // Convertir el cuerpo de la solicitud a un objeto JSON si es una cadena
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (err: any) {
      console.error('⚠️ Error al analizar el webhook:', err);
      return res.status(400).send(`Error al analizar el webhook: ${err?.message || 'Error desconocido'}`);
    }

    // Manejar el evento según su tipo
    try {
      console.log(`⭐ Procesando evento de Stripe: ${event.type}`);
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log(`💰 Evento payment_intent.succeeded recibido: ${event.data.object.id}`);
          await handlePaymentIntentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          console.log(`❌ Evento payment_intent.payment_failed recibido: ${event.data.object.id}`);
          await handlePaymentIntentFailed(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          console.log(`💰 Evento invoice.payment_succeeded recibido: ${event.data.object.id}`);
          await handleInvoicePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          console.log(`❌ Evento invoice.payment_failed recibido: ${event.data.object.id}`);
          await handleInvoicePaymentFailed(event.data.object);
          break;
        default:
          console.log(`⚠️ Evento no manejado: ${event.type}`);
      }

      // Responder a Stripe para confirmar la recepción
      res.json({ received: true });
    } catch (err: any) {
      console.error(`Error al manejar evento ${event.type}:`, err);
      res.status(500).send(`Error al procesar evento: ${err?.message || 'Error desconocido'}`);
    }
  });

  return router;
}

// Maneja el evento cuando un PaymentIntent es exitoso
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('💰 PaymentIntent exitoso:', paymentIntent.id);
  
  try {
    // Extraer información relevante del paymentIntent
    const { id, metadata, amount, currency, status } = paymentIntent;
    
    // Si tenemos metadatos con positionId o virtualPositionId, actualizamos el estado de la posición
    if (metadata && (metadata.positionId || metadata.virtualPositionId)) {
      const positionId = metadata.positionId || metadata.virtualPositionId;
      
      // Actualizar el estado de la posición a 'active' usando SQL directo para evitar problemas de tipo
      await db.execute(sql`
        UPDATE position_history 
        SET 
          status = 'Active', 
          last_updated = ${new Date()}, 
          payment_intent_id = ${id}, 
          payment_status = ${status}
        WHERE id = ${parseInt(positionId)}
      `);
      
      console.log(`✅ Posición ${positionId} activada tras pago exitoso`);
      
      // Crear una factura automáticamente si no existe
      await createOrUpdateInvoice(paymentIntent, 'paid');
    } else {
      console.log('⚠️ PaymentIntent sin positionId en metadata, no se pudo actualizar posición');
    }
  } catch (error) {
    console.error('❌ Error al procesar PaymentIntent exitoso:', error);
    throw error;
  }
}

// Maneja el evento cuando un PaymentIntent falla
async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('❌ PaymentIntent fallido:', paymentIntent.id);
  
  try {
    // Extraer información relevante del paymentIntent
    const { id, metadata, status } = paymentIntent;
    
    // Si tenemos metadatos con positionId o virtualPositionId, actualizamos el estado de la posición
    if (metadata && (metadata.positionId || metadata.virtualPositionId)) {
      const positionId = metadata.positionId || metadata.virtualPositionId;
      
      // Actualizar el estado de la posición a 'pending' usando SQL directo para evitar problemas de tipo
      await db.execute(sql`
        UPDATE position_history 
        SET 
          status = 'Pending', 
          last_updated = ${new Date()}, 
          payment_intent_id = ${id}, 
          payment_status = ${status}
        WHERE id = ${parseInt(positionId)}
      `);
      
      console.log(`⚠️ Posición ${positionId} marcada como pendiente tras pago fallido`);
      
      // Actualizar la factura si existe
      await createOrUpdateInvoice(paymentIntent, 'unpaid');
    } else {
      console.log('⚠️ PaymentIntent sin positionId en metadata, no se pudo actualizar posición');
    }
  } catch (error) {
    console.error('❌ Error al procesar PaymentIntent fallido:', error);
    throw error;
  }
}

// Maneja el evento cuando el pago de una factura es exitoso
async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('💰 Pago de factura exitoso:', invoice.id);
  // Implementación dependerá de cómo manejes facturas en tu sistema
}

// Maneja el evento cuando el pago de una factura falla
async function handleInvoicePaymentFailed(invoice: any) {
  console.log('❌ Pago de factura fallido:', invoice.id);
  // Implementación dependerá de cómo manejes facturas en tu sistema
}

// Crea o actualiza una factura basada en un PaymentIntent
async function createOrUpdateInvoice(paymentIntent: any, status: 'paid' | 'unpaid') {
  try {
    const { id, metadata, amount, currency } = paymentIntent;
    
    if (!metadata || (!metadata.positionId && !metadata.virtualPositionId) || !metadata.walletAddress) {
      console.log('⚠️ Metadatos insuficientes para crear factura');
      return;
    }
    
    const positionId = metadata.positionId || metadata.virtualPositionId;
    const walletAddress = metadata.walletAddress;
    
    // Verificar si ya existe una factura para este paymentIntent
    const existingInvoices = await db.execute(sql`
      SELECT * FROM invoices WHERE payment_intent_id = ${id}
    `);
    
    if (existingInvoices.rows.length > 0) {
      // Actualizar la factura existente
      await db.execute(sql`
        UPDATE invoices
        SET 
          status = ${status},
          updated_at = ${new Date()}
        WHERE payment_intent_id = ${id}
      `);
      
      console.log(`✅ Factura actualizada para PaymentIntent ${id}`);
    } else {
      // Crear nueva factura
      const invoiceNumber = `INV-${Date.now().toString().substring(0, 10)}`;
      const itemsJSON = JSON.stringify([{
        description: `Pago por activación de posición #${positionId}`,
        amount: amount / 100,
        quantity: 1
      }]);
      
      await db.execute(sql`
        INSERT INTO invoices (
          invoice_number, 
          wallet_address, 
          position_id, 
          amount, 
          currency, 
          payment_intent_id, 
          status, 
          payment_method, 
          items, 
          created_at, 
          updated_at
        ) VALUES (
          ${invoiceNumber}, 
          ${walletAddress}, 
          ${parseInt(positionId)}, 
          ${amount / 100}, 
          ${currency}, 
          ${id}, 
          ${status}, 
          ${'Credit Card'}, 
          ${itemsJSON}, 
          ${new Date()}, 
          ${new Date()}
        )
      `);
      
      console.log(`✅ Nueva factura creada para PaymentIntent ${id}`);
    }
  } catch (error) {
    console.error('❌ Error al crear/actualizar factura:', error);
    throw error;
  }
}