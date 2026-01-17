import express, { Router } from 'express';
import https from 'https';

// Función para evitar exponer información sensible
function sanitizeStripeResponse(data: any) {
  // Eliminar campos sensibles si están presentes
  if (data && typeof data === 'object') {
    const sanitized = { ...data };
    
    // Lista de campos sensibles a eliminar
    const sensitiveFields = [
      'client_secret',
      'secret',
      'api_key',
      'card',
      'source'
    ];
    
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    // Si hay objetos anidados, sanitizarlos también
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] && typeof sanitized[key] === 'object') {
        sanitized[key] = sanitizeStripeResponse(sanitized[key]);
      }
    });
    
    return sanitized;
  }
  
  return data;
}

// Función para realizar solicitudes HTTP a la API de Stripe
function stripeRequest(method: string, path: string, data?: any, apiKey?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const stripeSecretKey = apiKey || process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      return reject(new Error('No se ha proporcionado una clave API de Stripe'));
    }
    
    const options = {
      hostname: 'api.stripe.com',
      port: 443,
      path: `/v1/${path}`,
      method: method.toUpperCase(),
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2023-10-16'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (parsedData.error) {
            reject(parsedData.error);
          } else {
            resolve(parsedData);
          }
        } catch (e) {
          reject(new Error('Error al analizar la respuesta de Stripe'));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data && method !== 'GET') {
      // Convertir datos a formato URL codificado
      const urlEncodedData = Object.keys(data)
        .map(key => {
          // Manejo especial para arrays, especialmente payment_method_types
          if (Array.isArray(data[key])) {
            // Formatear arrays en formato adecuado para Stripe: payment_method_types[0]=card&payment_method_types[1]=...
            return data[key].map((item: any, index: number) => 
              `${encodeURIComponent(`${key}[${index}]`)}=${encodeURIComponent(item)}`
            ).join('&');
          } else if (typeof data[key] === 'object' && data[key] !== null) {
            // Para objetos anidados como metadata, necesitamos formatearlos con la notación de corchetes
            return Object.keys(data[key]).map(subKey => 
              `${encodeURIComponent(`${key}[${subKey}]`)}=${encodeURIComponent(data[key][subKey])}`
            ).join('&');
          }
          return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
        })
        .join('&');
      
      console.log('Datos enviados a Stripe para diagnóstico:', urlEncodedData);
      req.write(urlEncodedData);
    }
    
    req.end();
  });
}

// Definir interfaces para mejorar el tipado
interface DiagnosticResults {
  apiKeyValid: boolean;
  publicKeyValid: boolean;
  mode: string;
  webhookConfigured: boolean;
  timestamp: string;
  accountVerified?: boolean;
  accountDetails?: {
    id: string;
    businessType?: string;
    country?: string;
    email?: string;
  };
  webhooks?: Array<{
    id: string;
    url: string;
    status: string;
    enabledEvents: string[];
  }>;
  error?: string;
}

export default function createStripeDiagnosticsRouter() {
  const router = Router();
  
  // Verificar si la clave de API de Stripe está configurada
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLIC_KEY;
  
  // Determinamos el modo
  const stripeMode = stripeSecretKey ? 'real' : 'simulation';
  console.log(`Diagnóstico Stripe: ${stripeMode === 'real' ? 'Clave API detectada, usando modo real' : 'Clave API no detectada, usando modo simulación'}`);
  
  // Endpoint para obtener la clave pública de Stripe
  router.get('/api/stripe/public-key', (req, res) => {
    // Verificamos primero las variables de entorno normales
    const publicKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLIC_KEY;
    
    console.log('Solicitud de clave pública de Stripe recibida, estado de clave:', {
      publishableKeyPresent: !!publicKey,
      keyLength: publicKey ? publicKey.length : 0,
      keyPrefix: publicKey ? publicKey.substring(0, 5) + '...' : 'no-key'
    });
    
    if (publicKey) {
      console.log('Devolviendo clave pública de Stripe en modo real');
      res.json({ 
        publicKey: publicKey,
        mode: 'real'
      });
    } else {
      // Si no tenemos clave, devolvemos una respuesta que indica modo simulación
      console.log('No se encontró clave pública de Stripe, usando modo simulación');
      res.status(200).json({ 
        publicKey: 'pk_test_51OiY18BMT9gV68TI4cSP5X91rWsgiTtPvqyjTvQRlKSBJOxkWQQCgbhwS7uGdGhXYdE40y3qHK5OWWLWEgpSJnZ800NeD17b3B',
        mode: 'simulation'
      });
    }
  });
  
  // Endpoint de diagnóstico
  router.get('/api/stripe/diagnostics', async (req, res) => {
    try {
      const diagnosticResults: DiagnosticResults = {
        apiKeyValid: !!stripeSecretKey,
        publicKeyValid: !!stripePublicKey,
        mode: stripeMode,
        webhookConfigured: false, // Por defecto asumimos que no hay webhooks configurados
        timestamp: new Date().toISOString()
      };
      
      // Solo intentamos hacer llamadas a Stripe si tenemos la clave
      if (stripeSecretKey) {
        try {
          // Alternativa más segura: probar /v1/balance que requiere menos permisos
          // En lugar de 'account' que requiere permisos especiales
          const balance = await stripeRequest('GET', 'balance');
          diagnosticResults.accountVerified = true;
          // Si llegamos aquí, la clave tiene acceso para operaciones básicas
          diagnosticResults.accountDetails = {
            id: "verificada", // No necesitamos el ID completo para diagnóstico
            businessType: "verificado",
            country: "verificado",
            email: "verificado@cuenta.stripe",
          };
          
          // Intentar obtener los webhooks configurados
          const webhooks = await stripeRequest('GET', 'webhook_endpoints?limit=5');
          diagnosticResults.webhookConfigured = webhooks.data && webhooks.data.length > 0;
          if (webhooks.data) {
            diagnosticResults.webhooks = webhooks.data.map((webhook: any) => ({
              id: webhook.id,
              url: webhook.url,
              status: webhook.status,
              enabledEvents: webhook.enabled_events
            }));
          }
          
        } catch (stripeError: any) {
          diagnosticResults.accountVerified = false;
          diagnosticResults.error = `Error al verificar la cuenta: ${stripeError.message || JSON.stringify(stripeError)}`;
          console.error('Error al verificar la cuenta de Stripe:', stripeError);
        }
      } else {
        diagnosticResults.error = 'No se encontró la clave API de Stripe en las variables de entorno.';
      }
      
      res.json(diagnosticResults);
    } catch (error: any) {
      console.error('Error en diagnóstico de Stripe:', error);
      res.status(500).json({ 
        error: `Error en diagnóstico: ${error.message || JSON.stringify(error)}`,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Endpoint para probar la creación de PaymentIntent
  router.post('/api/stripe/test-payment-intent', async (req, res) => {
    try {
      const { amount, currency, description } = req.body;
      
      if (!amount || !currency) {
        return res.status(400).json({ 
          error: 'Se requieren amount y currency',
          timestamp: new Date().toISOString()
        });
      }
      
      if (stripeSecretKey) {
        try {
          // Convertir el monto a centavos (Stripe usa centavos)
          const amountInCents = Math.round(parseFloat(amount) * 100);
          
          // Crear un PaymentIntent de prueba
          const paymentIntent = await stripeRequest('POST', 'payment_intents', {
            amount: amountInCents,
            currency: currency,
            description: description || 'Test payment intent',
            payment_method_types: ['card'],
            metadata: { test: 'true', diagnostics: 'true' }
          });
          
          // Sanitizar la respuesta antes de enviarla
          const sanitizedResponse = sanitizeStripeResponse(paymentIntent);
          
          res.json({
            success: true,
            paymentIntent: sanitizedResponse,
            timestamp: new Date().toISOString()
          });
        } catch (stripeError: any) {
          console.error('Error al crear PaymentIntent de prueba:', stripeError);
          res.status(400).json({ 
            error: `Error al crear PaymentIntent: ${stripeError.message || JSON.stringify(stripeError)}`,
            code: stripeError.code,
            type: stripeError.type,
            param: stripeError.param,
            requestParams: sanitizeStripeResponse(req.body),
            timestamp: new Date().toISOString()
          });
        }
      } else {
        // Versión simulada para desarrollo sin clave API
        console.log('Creando PaymentIntent simulado para diagnóstico');
        res.json({
          success: true,
          paymentIntent: {
            id: `pi_test_${Date.now()}`,
            object: 'payment_intent',
            amount: parseInt(amount) * 100,
            currency,
            status: 'requires_payment_method',
            description: description || 'Test payment intent',
            metadata: { test: 'true', diagnostics: 'true' },
            created: Math.floor(Date.now() / 1000),
            simulated: true
          },
          timestamp: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Error en test de PaymentIntent:', error);
      res.status(500).json({ 
        error: `Error interno: ${error.message || JSON.stringify(error)}`,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return router;
}