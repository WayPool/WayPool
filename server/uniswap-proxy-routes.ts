/**
 * Rutas de proxy para los subgraphs de Uniswap
 * Actúa como intermediario para evitar problemas CORS
 * Versión actualizada para usar Gateway API con Subgraph ID
 */

import { Router, Request, Response } from 'express';
import axios from 'axios';

// URL base para The Graph Gateway
const GRAPH_GATEWAY_BASE_URL = 'https://gateway.thegraph.com/api/';

// Subgraph IDs para diferentes versiones y redes de Uniswap
const SUBGRAPH_IDS = {
  'v3-ethereum': '5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV', // Uniswap V3 en Ethereum
  'v3-polygon': '3hCPRGf4z88VC5rsBKU5AA9FBBq5nF3jbKJG7VZCbhjm', // Uniswap V3 en Polygon (actualizado)
  'v3-arbitrum': 'AVmXxngrjXhyaWKfKKgQPsQKRvzXcPoPkCXsB7KfW4Ui', // Uniswap V3 en Arbitrum
  'v3-unichain': 'BCfy6Vw9No3weqVq9NhyGo4FkVCJep1ZN9RMJj5S32fX', // Uniswap V3 en Unichain
  'v4-ethereum': 'DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G', // Uniswap V4 en Ethereum
  'v4-polygon': 'CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND', // Uniswap V4 en Polygon
  'v4-unichain': 'Bd8UnJU8jCRJKVjcW16GHM3FNdfwTojmWb3QwSAmv8Uc'  // Uniswap V4 en Unichain
};

// URLs de los subgraphs de Uniswap (mantenemos compatibilidad con versiones anteriores)
const SUBGRAPH_ENDPOINTS = {
  v2: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  v3: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  v4: 'https://api.studio.thegraph.com/query/48211/uniswap-v4-mainnet/version/latest',
  // Dejamos esto vacío porque construiremos la URL correctamente en el endpoint
  gateway: ''
};

// Función para manejar y formatear los errores
const handleError = (error: any, res: Response) => {
  console.error('Error en proxy de Uniswap:', error);
  
  const status = error.response ? error.response.status : 500;
  const message = error.response ? error.response.data : error.message;
  
  res.status(status).json({
    error: message,
    message: 'Error al consultar subgraph de Uniswap'
  });
};

// Función para registrar las rutas de proxy de Uniswap
export function registerUniswapProxyRoutes(app: any) {
  const router = Router();

  // Endpoint para proxy de Uniswap V2
  router.post('/v2', async (req: Request, res: Response) => {
    try {
      const response = await axios.post(SUBGRAPH_ENDPOINTS.v2, req.body);
      res.json(response.data);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Endpoint para proxy de Uniswap V3
  router.post('/v3', async (req: Request, res: Response) => {
    try {
      const response = await axios.post(SUBGRAPH_ENDPOINTS.v3, req.body);
      res.json(response.data);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Endpoint para proxy de Uniswap V4
  router.post('/v4', async (req: Request, res: Response) => {
    try {
      const response = await axios.post(SUBGRAPH_ENDPOINTS.v4, req.body);
      res.json(response.data);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Endpoint para proxy de The Graph Gateway con soporte para múltiples versiones/redes
  router.post('/gateway/:version?/:network?', async (req: Request, res: Response) => {
    try {
      // Utilizamos la clave API guardada como secreto
      const apiKey = process.env.GRAPH_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({
          error: 'No se encontró la clave API para The Graph',
          message: 'Falta configuración de API_KEY'
        });
      }
      
      // Obtenemos la versión y red de los parámetros o usamos los valores predeterminados
      const version = req.params.version || 'v3';
      const network = req.params.network || 'ethereum';
      const subgraphKey = `${version}-${network}`;
      
      // Construimos la URL del subgraph con el formato correcto:
      // https://gateway.thegraph.com/api/[api-key]/subgraphs/id/[subgraph-id]
      let subgraphId = SUBGRAPH_IDS['v3-ethereum']; // ID por defecto (v3-ethereum)
      
      if (SUBGRAPH_IDS[subgraphKey]) {
        subgraphId = SUBGRAPH_IDS[subgraphKey];
        console.log(`Usando subgraph ID para ${subgraphKey}: ${subgraphId}`);
      } else {
        console.log(`Subgraph para ${subgraphKey} no encontrado, usando ID predeterminado`);
      }
      
      // Construimos la URL completa con el formato correcto incluyendo API key
      const targetUrl = `${GRAPH_GATEWAY_BASE_URL}${apiKey}/subgraphs/id/${subgraphId}`;
      
      // Ocultamos la API key en los logs por seguridad
      const maskedUrl = targetUrl.replace(apiKey, "****");
      console.log(`URL completa construida: ${maskedUrl}`);
      
      // Realizamos la petición con la autenticación correcta
      console.log(`Enviando petición a The Graph Gateway (${subgraphKey}) con apiKey`);
      console.log(`URL (segura): ${maskedUrl}`);
      console.log(`Consulta: ${JSON.stringify(req.body).substring(0, 200)}...`);
      
      try {
        // Configurar headers según la documentación oficial de The Graph API
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // El token de API ya va incluido en la URL, pero también enviamos el header de autorización
          'Authorization': `Bearer ${apiKey}`
        };
        
        console.log('Headers configurados correctamente');
        
        // Hacer la petición con la URL y headers correctos
        const response = await axios.post(targetUrl, req.body, { headers });
        
        // Verificamos si hay datos en la respuesta
        if (response.data && response.data.data) {
          console.log(`Respuesta exitosa de The Graph (${subgraphKey}): ${JSON.stringify(response.data.data).substring(0, 200)}...`);
        } else if (response.data && response.data.errors) {
          console.error(`Error de The Graph (${subgraphKey}):`, response.data.errors);
        } else {
          console.log(`Respuesta sin datos de The Graph (${subgraphKey}): ${JSON.stringify(response.data)}`);
        }
        
        // Comprobamos si la respuesta tiene éxito y la devolvemos
        res.json(response.data);
        
        // Registrar éxito en consola (para debug)
        console.log(`Consulta a The Graph Gateway (${subgraphKey}) procesada correctamente`);
      } catch (error: any) {
        console.error(`Error al consultar The Graph (${subgraphKey}):`, error.message);
        if (error.response) {
          console.error(`Detalles de error:`, error.response.data);
        }
        
        // Reutilizamos el manejador de errores existente
        handleError(error, res);
      }
      
    } catch (error) {
      // Usar el manejador de errores común
      handleError(error, res);
    }
  });

  // Registrar las rutas bajo /api/uniswap-proxy
  app.use('/api/uniswap-proxy', router);
  console.log("Rutas de proxy de Uniswap registradas correctamente");
}