/**
 * WayBank Wallet Recovery API
 * Secure endpoints for wallet seed phrase management and recovery
 */

const express = require('express');
const router = express.Router();
const seedPhraseService = require('../services/seedPhrase.service');
const { db } = require('../db');
const { eq } = require('drizzle-orm');
const { custodialWallets } = require('@shared/schema');
const { v4: uuidv4 } = require('uuid');

/**
 * Get public seed phrase for a wallet
 * GET /api/wallet-recovery/seed-phrase?address=0x...
 */
router.get('/seed-phrase', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Check if the user is authorized to access this wallet's seed phrase
    const isAuthorized = await checkUserAuthorization(req, address);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'You are not authorized to access this wallet\'s seed phrase' });
    }
    
    // Get seed phrase for the wallet
    const seedPhrase = await seedPhraseService.getSeedPhrase(address);
    
    if (!seedPhrase) {
      return res.status(404).json({ error: 'No seed phrase found for this wallet' });
    }
    
    // Only show first few characters in logs for security
    console.log(`Seed phrase provided for ${address}: ${seedPhrase.substring(0, 15)}...`);
    
    return res.status(200).json({ seedPhrase });
  } catch (error) {
    console.error('Error getting public seed phrase:', error);
    return res.status(500).json({ error: 'Error retrieving seed phrase' });
  }
});

/**
 * Verify if a seed phrase belongs to a wallet
 * POST /api/wallet-recovery/verify
 */
router.post('/verify', async (req, res) => {
  try {
    const { seedPhrase, walletAddress } = req.body;
    
    if (!seedPhrase || !walletAddress) {
      return res.status(400).json({ error: 'Seed phrase and wallet address are required' });
    }
    
    // Verify the seed phrase
    const result = await seedPhraseService.verifySeedPhrase(seedPhrase, walletAddress);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error verifying seed phrase:', error);
    return res.status(500).json({ error: 'Error verifying seed phrase' });
  }
});

/**
 * Recover a wallet using its seed phrase
 * POST /api/wallet-recovery/recover
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
    
    // Use our new service to recover the wallet
    const result = await seedPhraseService.recoverWalletWithSeedPhrase(seedPhrase, newPassword);
    
    // If recovery was successful, create a session
    if (result.success && result.walletAddress) {
      // Create a new session for the user
      const sessionToken = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
      
      // Update session information (setting wallet address in session)
      if (req.session) {
        req.session.walletAddress = result.walletAddress;
        req.session.isAdmin = result.isAdmin || false;
        req.session.userId = result.walletId;
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
 * Generate a new seed phrase for a wallet
 * POST /api/wallet-recovery/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Check if the user is authorized to generate a seed phrase for this wallet
    const isAuthorized = await checkUserAuthorization(req, walletAddress);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'You are not authorized to generate a seed phrase for this wallet' });
    }
    
    // Generate and save a new seed phrase
    const seedPhrase = await seedPhraseService.generateAndSaveSeedPhrase(walletAddress);
    
    return res.status(200).json({ success: true, seedPhrase });
  } catch (error) {
    console.error('Error generating seed phrase:', error);
    return res.status(500).json({ error: 'Error generating seed phrase' });
  }
});

/**
 * Helper function to check if a user is authorized to access a wallet's seed phrase
 * @param {Object} req Express request object
 * @param {string} walletAddress The wallet address to check
 * @returns {Promise<boolean>} True if authorized, false otherwise
 */
async function checkUserAuthorization(req, walletAddress) {
  // If user is admin, allow access to any wallet
  if (req.session && req.session.isAdmin) {
    return true;
  }
  
  // If user is logged in and requesting their own wallet, allow access
  if (req.session && req.session.walletAddress && 
      req.session.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
    return true;
  }
  
  // In any other case, deny access
  return false;
}

module.exports = router;