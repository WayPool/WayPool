import express, { Request, Response } from 'express';
import { storage } from './storage';
import { isAdmin } from './middleware';

// Router para las rutas relacionadas con el wallet banco
const bankWalletRouter = express.Router();

/**
 * Endpoint para obtener la dirección del wallet del banco (superadmin)
 * Esta dirección se usa para las transferencias de tokens desde los usuarios
 */
bankWalletRouter.get('/bank-wallet-address', (req: Request, res: Response) => {
  try {
    // Obtener la dirección del wallet del banco desde las variables de entorno
    const bankWalletAddress = "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F";
    
    console.log("Usando wallet del banco (hardcoded):", bankWalletAddress);
    console.log("Variable de entorno WALLET_BANK:", process.env.WALLET_BANK);
    
    if (!bankWalletAddress) {
      console.error("Error: Dirección del wallet del banco no disponible");
      return res.status(500).json({ 
        error: "No se ha configurado la dirección del banco en el servidor" 
      });
    }
    
    // Devolver la dirección
    return res.json({ 
      address: bankWalletAddress,
      success: true
    });
  } catch (error) {
    console.error("Error al obtener la dirección del wallet del banco:", error);
    return res.status(500).json({ 
      error: "Error al obtener la dirección del wallet del banco" 
    });
  }
});

/**
 * Endpoint para verificar el saldo USDC en el wallet del banco
 * Solo accesible para administradores
 */
bankWalletRouter.get('/bank-wallet-balance', isAdmin, async (req: Request, res: Response) => {
  try {
    const bankWalletAddress = "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F";
    
    console.log("Usando wallet del banco para balance (hardcoded):", bankWalletAddress);
    console.log("Variable de entorno WALLET_BANK:", process.env.WALLET_BANK);
    
    if (!bankWalletAddress) {
      return res.status(500).json({ 
        error: "No se ha configurado la dirección del banco en el servidor" 
      });
    }
    
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    
    if (!alchemyApiKey) {
      return res.status(500).json({ 
        error: "No se ha configurado la API key de Alchemy" 
      });
    }

    // Obtener el balance del wallet usando Alchemy API
    const network = "eth-mainnet"; // O la red que corresponda
    const url = `https://${network}.g.alchemy.com/v2/${alchemyApiKey}`;
    
    // Datos para la solicitud JSON-RPC
    const data = {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTokenBalances",
      params: [bankWalletAddress, ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]] // USDC address en Ethereum
    };
    
    // Realizar la petición a Alchemy API
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en respuesta de Alchemy:", errorText);
      return res.status(500).json({ error: "Error al consultar el balance" });
    }
    
    const result = await response.json();
    
    return res.json({
      address: bankWalletAddress,
      balance: result.result,
      success: true
    });
  } catch (error) {
    console.error("Error al obtener el balance del wallet del banco:", error);
    return res.status(500).json({ 
      error: "Error al obtener el balance del wallet del banco" 
    });
  }
});

/**
 * Endpoint para verificar transacciones recibidas por el wallet del banco
 * Solo accesible para administradores
 */
bankWalletRouter.get('/bank-wallet-transactions', isAdmin, async (req: Request, res: Response) => {
  try {
    const bankWalletAddress = "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F";
    
    console.log("Usando wallet del banco para transacciones (hardcoded):", bankWalletAddress);
    console.log("Variable de entorno WALLET_BANK:", process.env.WALLET_BANK);
    
    if (!bankWalletAddress) {
      return res.status(500).json({ 
        error: "No se ha configurado la dirección del banco en el servidor" 
      });
    }
    
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;
    
    if (!alchemyApiKey) {
      return res.status(500).json({ 
        error: "No se ha configurado la API key de Alchemy" 
      });
    }

    // Obtener las últimas transacciones usando Alchemy API
    const network = "eth-mainnet"; // O la red que corresponda
    const url = `https://${network}.g.alchemy.com/v2/${alchemyApiKey}`;
    
    // Datos para la solicitud JSON-RPC para obtener transferencias de token
    const data = {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          toAddress: bankWalletAddress,
          category: ["erc20"],
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: "0xa" // 10 transacciones
        }
      ]
    };
    
    // Realizar la petición a Alchemy API
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en respuesta de Alchemy:", errorText);
      return res.status(500).json({ error: "Error al consultar las transacciones" });
    }
    
    const result = await response.json();
    
    return res.json({
      address: bankWalletAddress,
      transactions: result.result.transfers || [],
      success: true
    });
  } catch (error) {
    console.error("Error al obtener las transacciones del wallet del banco:", error);
    return res.status(500).json({ 
      error: "Error al obtener las transacciones del wallet del banco" 
    });
  }
});

/**
 * Función para registrar las rutas del banco de wallets en la aplicación
 */
export function registerBankWalletRoutes(app: express.Express) {
  app.use('/api/admin', bankWalletRouter);
  console.log("Bank wallet routes registered successfully");
}