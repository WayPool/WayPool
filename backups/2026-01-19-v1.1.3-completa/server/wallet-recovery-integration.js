/**
 * WayBank Wallet Recovery Integration
 * 
 * This module provides integration for the wallet recovery system
 * using secure English seed phrases compatible with BIP39 standard.
 */

const express = require('express');
const router = express.Router();
const seedPhraseService = require('./services/seedPhrase.service');
const { v4: uuidv4 } = require('uuid');

/**
 * Function to register wallet recovery routes
 * @param {Express} app The Express application
 */
function registerWalletRecoveryRoutes(app) {
  if (!app) {
    throw new Error('Express app is required to register wallet recovery routes');
  }
  
  // Middleware para registrar información en logs
  router.use((req, res, next) => {
    console.log(`[Wallet Recovery] ${req.method} ${req.path}`);
    next();
  });
  
  /**
   * Obtener frase semilla para un wallet
   * GET /api/wallet/seed-phrase-public?address=0x...
   */
  router.get('/seed-phrase-public', async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }
      
      // Get the seed phrase for the wallet
      const seedPhrase = await seedPhraseService.getSeedPhraseForWallet(address);
      
      if (!seedPhrase) {
        return res.status(404).json({ error: 'No seed phrase found for this wallet' });
      }
      
      // Solo mostrar los primeros caracteres en el log por seguridad
      console.log(`Seed phrase provided for ${address}: ${seedPhrase.substring(0, 15)}...`);
      
      return res.status(200).json({ seedPhrase });
    } catch (error) {
      console.error('Error getting public seed phrase:', error);
      return res.status(500).json({ error: 'Error retrieving seed phrase' });
    }
  });
  
  /**
   * Verificar si una frase semilla pertenece a un wallet
   * POST /api/wallet/verify-seed
   */
  router.post('/verify-seed', async (req, res) => {
    try {
      const { seedPhrase, walletAddress } = req.body;
      
      if (!seedPhrase || !walletAddress) {
        return res.status(400).json({ error: 'Seed phrase and wallet address are required' });
      }
      
      // Verificar la frase semilla
      const result = await seedPhraseService.verifySeedPhrase(seedPhrase, walletAddress);
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error verifying seed phrase:', error);
      return res.status(500).json({ error: 'Error verifying seed phrase' });
    }
  });
  
  /**
   * Recuperar un wallet usando su frase semilla
   * POST /api/wallet/recover
   */
  router.post('/recover', async (req, res) => {
    try {
      console.log('[DEBUG] Starting wallet recovery process with seed phrase');
      console.log('[DEBUG] Request body:', JSON.stringify({
        seedPhraseLength: req.body.seedPhrase ? req.body.seedPhrase.length : 0,
        hasNewPassword: Boolean(req.body.newPassword)
      }));
      
      const { seedPhrase, newPassword } = req.body;
      
      if (!seedPhrase) {
        console.log('[DEBUG] Error: Seed phrase not provided');
        return res.status(400).json({ error: 'Seed phrase is required' });
      }
      
      // Usar nuestro nuevo servicio para recuperar el wallet
      const result = await seedPhraseService.recoverWalletWithSeedPhrase(seedPhrase, newPassword);
      
      // Si la recuperación fue exitosa, crear una sesión
      if (result.success && result.walletAddress) {
        // Crear una nueva sesión para el usuario
        if (req.session) {
          req.session.walletAddress = result.walletAddress;
          req.session.isAdmin = result.isAdmin || false;
          req.session.userId = result.walletId;
          
          // Para compatibilidad con sistemas antiguos
          if (!req.session.user) {
            req.session.user = {
              walletAddress: result.walletAddress,
              isAdmin: result.isAdmin || false
            };
          }
        }
        
        console.log(`Wallet recovered successfully: ${result.walletAddress}`);
        
        return res.status(200).json({
          success: true,
          walletAddress: result.walletAddress,
          isAdmin: result.isAdmin || false
        });
      } else {
        return res.status(400).json({ error: 'Failed to recover wallet' });
      }
    } catch (error) {
      console.error('Error recovering wallet with seed phrase:', error);
      return res.status(500).json({ error: error.message || 'Error recovering wallet' });
    }
  });
  
  /**
   * Generar una nueva frase semilla para un wallet
   * POST /api/wallet/generate-seed
   */
  router.post('/generate-seed', async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }
      
      // Generate and save a new seed phrase
      const seedPhrase = await seedPhraseService.generateSeedPhraseForWallet(walletAddress);
      
      return res.status(200).json({ success: true, seedPhrase });
    } catch (error) {
      console.error('Error generating seed phrase:', error);
      return res.status(500).json({ error: 'Error generating seed phrase' });
    }
  });
  
  // Registrar las rutas en la aplicación
  app.use('/api/wallet', router);
}

module.exports = {
  registerWalletRecoveryRoutes
};