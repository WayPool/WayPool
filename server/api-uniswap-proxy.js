/**
 * Proxy API para Uniswap Subgraphs
 * Actúa como intermediario para evitar problemas de CORS
 */

import express from 'express';
import axios from 'axios';

const router = express.Router();

// URLs de los subgraphs de Uniswap
const SUBGRAPH_ENDPOINTS = {
  v2: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  v3: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  v4: 'https://api.studio.thegraph.com/query/48211/uniswap-v4-mainnet/version/latest'
};

// Función para manejar y formatear los errores
const handleError = (error, res) => {
  console.error('Error en proxy de Uniswap:', error);
  
  const status = error.response ? error.response.status : 500;
  const message = error.response ? error.response.data : error.message;
  
  res.status(status).json({
    error: message,
    message: 'Error al consultar subgraph de Uniswap'
  });
};

// Endpoint para proxy de Uniswap V2
router.post('/v2', async (req, res) => {
  try {
    const response = await axios.post(SUBGRAPH_ENDPOINTS.v2, req.body);
    res.json(response.data);
  } catch (error) {
    handleError(error, res);
  }
});

// Endpoint para proxy de Uniswap V3
router.post('/v3', async (req, res) => {
  try {
    const response = await axios.post(SUBGRAPH_ENDPOINTS.v3, req.body);
    res.json(response.data);
  } catch (error) {
    handleError(error, res);
  }
});

// Endpoint para proxy de Uniswap V4
router.post('/v4', async (req, res) => {
  try {
    const response = await axios.post(SUBGRAPH_ENDPOINTS.v4, req.body);
    res.json(response.data);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;