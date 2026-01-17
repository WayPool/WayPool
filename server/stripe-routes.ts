import express from 'express';
import { createPaymentIntent, confirmPaymentIntent, getPaymentIntent } from './stripe-service';
import { z } from 'zod';

const router = express.Router();

// Schema de validación para crear una intención de pago
const createPaymentIntentSchema = z.object({
  amount: z.number().positive("El monto debe ser positivo"),
  currency: z.string().optional().default('usd'),
  walletAddress: z.string().min(1, "La dirección de wallet es requerida"),
  description: z.string().optional(),
  positionId: z.string().or(z.number()).optional(),
  virtualPositionId: z.string().or(z.number()).optional(),
  metadata: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
});

// Endpoint para crear una intención de pago
router.post('/create-payment-intent', async (req, res) => {
  try {
    // Validar los datos de entrada
    const validation = createPaymentIntentSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: validation.error.format()
      });
    }
    
    const { 
      amount, 
      currency, 
      walletAddress, 
      description, 
      positionId, 
      virtualPositionId, 
      metadata = {} 
    } = validation.data;
    
    // Construir metadatos completos
    const completeMetadata: Record<string, any> = {
      ...metadata
    };
    
    // Añadir positionId si está presente
    if (positionId) {
      completeMetadata.positionId = positionId;
    }
    
    // Añadir virtualPositionId si está presente
    if (virtualPositionId) {
      completeMetadata.virtualPositionId = virtualPositionId;
    }
    
    console.log('Creando intención de pago con metadatos:', completeMetadata);
    
    // Crear la intención de pago
    const paymentIntent = await createPaymentIntent(
      amount,
      currency,
      walletAddress,
      description || `Pago desde wallet ${walletAddress.substring(0, 10)}...`,
      completeMetadata
    );
    
    // Responder con la intención de pago
    return res.json({
      success: true,
      paymentIntent,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error al crear intención de pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar el pago',
      error: String(error)
    });
  }
});

// Endpoint para confirmar una intención de pago
router.post('/confirm-payment-intent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de intención de pago requerido'
      });
    }
    
    // Confirmar la intención de pago
    const paymentIntent = await confirmPaymentIntent(id);
    
    // Responder con la intención de pago confirmada
    return res.json({
      success: true,
      paymentIntent
    });
  } catch (error) {
    console.error('Error al confirmar intención de pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al confirmar el pago',
      error: String(error)
    });
  }
});

// Endpoint para obtener detalles de una intención de pago
router.get('/payment-intent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de intención de pago requerido'
      });
    }
    
    // Obtener detalles de la intención de pago
    const paymentIntent = await getPaymentIntent(id);
    
    // Responder con la intención de pago
    return res.json({
      success: true,
      paymentIntent
    });
  } catch (error) {
    console.error('Error al obtener intención de pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener detalles del pago',
      error: String(error)
    });
  }
});

export default router;