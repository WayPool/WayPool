/**
 * Rutas para consultar balances de tokens en diferentes redes
 * Proporciona endpoints para USDC en Ethereum y Polygon
 */

import express, { Request, Response } from 'express';
import { getTokenBalance, getTotalUSDCBalanceInPolygon, NetworkID } from './alchemy-service';

// Crear router para los endpoints de balance de tokens
const tokenBalanceRouter = express.Router();

/**
 * Endpoint para consultar el balance de USDC de una dirección en Ethereum
 * GET /api/token-balance/usdc/:walletAddress
 */
tokenBalanceRouter.get('/usdc/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    // Opcionalmente aceptar network como query parameter
    const network = req.query.network as string || '1'; // Default a Ethereum
    
    // Obtener la dirección del token USDC según la red
    const tokenAddress = network === '137'
      ? '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' // USDC.e en Polygon
      : '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC en Ethereum
    
    console.log(`Consultando balance USDC para ${walletAddress} en red ${network}`);
    const balance = await getTokenBalance(
      walletAddress, 
      tokenAddress, 
      network as NetworkID,
      6 // Decimales para USDC
    );
    
    res.json({
      address: walletAddress,
      token: 'USDC',
      network,
      balance: balance.balance,
      balanceRaw: balance.rawBalance,
      tokenAddress,
      decimals: 6,
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error al consultar balance USDC:`, error);
    res.status(500).json({ error: 'Error al consultar balance USDC' });
  }
});

/**
 * Endpoint especializado para Polygon que suma tanto USDC.e (bridged) como USDC nativo
 * GET /api/token-balance/usdc-polygon/:walletAddress
 */
tokenBalanceRouter.get('/usdc-polygon/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    console.log(`Consultando balance USDC para ${walletAddress} en Polygon (endpoint especializado)`);
    
    // Esta función suma automáticamente USDC.e y USDC nativo en Polygon
    const result = await getTotalUSDCBalanceInPolygon(walletAddress);
    
    res.json({
      address: walletAddress,
      token: 'USDC',
      network: 'polygon',
      networkId: '137',
      balance: result.balance,
      nativeBalance: result.nativeBalance,
      bridgedBalance: result.bridgedBalance,
      decimals: 6,
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error al consultar balance USDC en Polygon:`, error);
    res.status(500).json({ error: 'Error al consultar balance USDC en Polygon' });
  }
});

/**
 * Registra las rutas de balance de tokens en la aplicación
 */
export function registerTokenBalanceRoutes(app: express.Express) {
  app.use('/api/token-balance', tokenBalanceRouter);
}