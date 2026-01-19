import { type Express } from "express";
import { log } from "./vite";

/**
 * Endpoint de diagnóstico para problemas de SSL/HTTPS en Replit
 * Ayuda a identificar problemas de certificado que causan el error 4500
 */
export function registerSSLDiagnosticRoutes(app: Express) {
  
  // Endpoint para verificar el estado de SSL/HTTPS
  app.get('/api/ssl-diagnostics', (req, res) => {
    try {
      const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: process.env.NODE_ENV,
          isReplit: !!process.env.REPL_ID,
          replitDomain: process.env.REPLIT_DOMAINS || 'Not set',
          host: req.get('host'),
          protocol: req.protocol,
          isSecure: req.secure,
          headers: {
            'x-forwarded-proto': req.get('x-forwarded-proto'),
            'x-forwarded-host': req.get('x-forwarded-host'),
            'x-forwarded-for': req.get('x-forwarded-for'),
            'user-agent': req.get('user-agent'),
          }
        },
        websocket: {
          recommendedProtocol: req.secure || req.get('x-forwarded-proto') === 'https' ? 'wss:' : 'ws:',
          currentUrl: `${req.secure || req.get('x-forwarded-proto') === 'https' ? 'wss:' : 'ws:'}//${req.get('host')}/ws`
        },
        replit: {
          configuredCorrectly: process.env.REPL_ID ? true : false,
          domains: process.env.REPLIT_DOMAINS || 'No domains configured',
          suggestions: [
            'Verificar que el dominio esté configurado correctamente en Replit',
            'Asegurar que los certificados SSL estén habilitados',
            'Comprobar que no hay conflictos de puerto'
          ]
        }
      };

      log(`SSL Diagnostics requested from ${req.get('host')}`, 'ssl-diagnostics');
      
      res.json({
        status: 'success',
        message: 'Diagnóstico SSL completado',
        data: diagnostics
      });

    } catch (error) {
      log(`Error in SSL diagnostics: ${error}`, 'ssl-diagnostics');
      res.status(500).json({
        status: 'error',
        message: 'Error al generar diagnóstico SSL',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint para verificar conectividad WebSocket
  app.get('/api/websocket-test', (req, res) => {
    try {
      const isSecure = req.secure || req.get('x-forwarded-proto') === 'https';
      const protocol = isSecure ? 'wss:' : 'ws:';
      const host = req.get('host');
      const wsUrl = `${protocol}//${host}/ws`;

      const testResult = {
        timestamp: new Date().toISOString(),
        websocketUrl: wsUrl,
        isSecureConnection: isSecure,
        expectedToWork: true,
        troubleshooting: {
          'error4500': 'Indica problema de certificado SSL o configuración del servidor',
          'error1006': 'Conexión cerrada anormalmente, revisar conectividad',
          'connectionRefused': 'Verificar que el servidor WebSocket esté ejecutándose',
          'certificateError': 'Comprobar configuración SSL en Replit'
        },
        recommendations: [
          isSecure ? 'Usar protocolo wss:// para conexiones HTTPS' : 'Usar protocolo ws:// para conexiones HTTP',
          'Verificar que el path /ws esté disponible',
          'Comprobar que no hay firewall bloqueando la conexión',
          'En Replit, asegurar que los dominios estén configurados correctamente'
        ]
      };

      res.json({
        status: 'success',
        message: 'Test de WebSocket preparado',
        data: testResult
      });

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error en test de WebSocket',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  log('SSL and WebSocket diagnostic routes registered', 'ssl-diagnostics');
}