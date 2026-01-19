import express, { Router, Request, Response } from 'express';
import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Router para manejar actualizaciones manuales del estado de posiciones de Stripe
 * ESTE ROUTER ES SOLO PARA PRUEBAS Y DESARROLLO LOCAL
 */
export default function createStripeManualRouter() {
  const router = Router();

  // Endpoint para simular un webhook de pago exitoso
  router.post('/api/stripe/manual/payment-success', async (req: Request, res: Response) => {
    try {
      // Validar datos
      const { paymentIntentId, positionId } = req.body;
      
      if (!paymentIntentId || !positionId) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren paymentIntentId y positionId'
        });
      }
      
      // Actualizar el estado de la posición a 'active' usando SQL directo
      await db.execute(sql`
        UPDATE position_history 
        SET 
          status = 'Active', 
          last_updated = ${new Date()}, 
          payment_intent_id = ${paymentIntentId}, 
          payment_status = 'succeeded'
        WHERE id = ${parseInt(positionId)}
      `);
      
      // Actualizar la factura si existe
      await db.execute(sql`
        UPDATE invoices
        SET 
          status = 'Paid',
          paid_date = ${new Date()},
          payment_intent_id = ${paymentIntentId},
          payment_method = 'Credit Card',
          updated_at = ${new Date()}
        WHERE position_id = ${parseInt(positionId)}
      `);
      

      
      return res.json({
        success: true,
        message: `Posición ${positionId} actualizada correctamente`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al actualizar posición manualmente:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar posición',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Endpoint para simular un webhook de pago fallido
  router.post('/api/stripe/manual/payment-failed', async (req: Request, res: Response) => {
    try {
      // Validar datos
      const { paymentIntentId, positionId } = req.body;
      
      if (!paymentIntentId || !positionId) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren paymentIntentId y positionId'
        });
      }
      
      // Actualizar la posición
      console.log(`⚡ Marcando posición ${positionId} como fallida manualmente con pago ${paymentIntentId}`);
      
      // Actualizar el estado de la posición a 'pending'
      await db.execute(sql`
        UPDATE position_history 
        SET 
          status = 'Pending', 
          last_updated = ${new Date()}, 
          payment_intent_id = ${paymentIntentId}, 
          payment_status = 'failed'
        WHERE id = ${parseInt(positionId)}
      `);
      
      // Actualizar la factura si existe
      await db.execute(sql`
        UPDATE invoices
        SET 
          status = 'Unpaid',
          payment_intent_id = ${paymentIntentId},
          payment_method = 'Credit Card',
          updated_at = ${new Date()}
        WHERE position_id = ${parseInt(positionId)}
      `);
      
      console.log(`✅ Posición ${positionId} marcada como fallida manualmente`);
      
      return res.json({
        success: true,
        message: `Posición ${positionId} actualizada como fallida correctamente`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al actualizar posición manualmente:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar posición',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  return router;
}