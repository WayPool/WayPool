/**
 * Secure Seed Phrase Service
 * Provides cryptographically secure seed phrase generation and management
 * for WayBank wallets using English BIP39 wordlist
 */

const crypto = require('crypto');
const { db } = require('../db');
const { eq } = require('drizzle-orm');
const { custodialWallets, walletSeedPhrases } = require('@shared/schema');
const bcrypt = require('bcrypt');

// English BIP39 word list (first 200 words only for brevity)
const ENGLISH_BIP39_WORDLIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake',
  'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge',
  'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain',
  'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become',
  'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit',
  'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology',
  'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless'
];

// Full wordlist would be loaded in production

// Encryption key for seed phrase storage
// In production, this would be stored in a secure vault, not in code
const ENCRYPTION_KEY = process.env.SEED_PHRASE_ENCRYPTION_KEY || 'waybank-secure-seed-phrase-encryption-key';
const ENCRYPTION_IV_LENGTH = 16;

/**
 * Generate a cryptographically secure random seed phrase
 * @param {number} wordCount Number of words in the seed phrase (default: 12)
 * @returns {string} A randomly generated seed phrase
 */
function generateSecureRandomSeedPhrase(wordCount = 12) {
  const words = [];
  const wordlistLength = ENGLISH_BIP39_WORDLIST.length;
  
  // Generate cryptographically secure random numbers
  const randomBytes = crypto.randomBytes(wordCount * 2); // 2 bytes per word gives good entropy
  
  for (let i = 0; i < wordCount; i++) {
    // Use 2 bytes (16 bits) for each word selection
    const randomValue = randomBytes.readUInt16BE(i * 2);
    const wordIndex = randomValue % wordlistLength;
    words.push(ENGLISH_BIP39_WORDLIST[wordIndex]);
  }
  
  return words.join(' ');
}

/**
 * Generate a deterministic seed phrase from a wallet address (for backward compatibility)
 * @param {string} walletAddress The wallet address to generate a seed phrase for
 * @returns {string} A deterministic seed phrase based on the wallet address
 */
function generateDeterministicSeedPhrase(walletAddress) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }
  
  // Normalize the wallet address
  const normalizedAddress = walletAddress.toLowerCase().replace('0x', '');
  
  // Generate a unique hash based on the address
  const addressHash = crypto.createHash('sha256').update(normalizedAddress).digest('hex');
  
  // Generate 12 words based on the hash
  const seedPhrase = [];
  for (let i = 0; i < 12; i++) {
    const segment = addressHash.slice(i * 4, (i * 4) + 4);
    const segmentValue = parseInt(segment, 16);
    const wordIndex = segmentValue % ENGLISH_BIP39_WORDLIST.length;
    seedPhrase.push(ENGLISH_BIP39_WORDLIST[wordIndex]);
  }
  
  return seedPhrase.join(' ');
}

/**
 * Encrypt a seed phrase for secure storage
 * @param {string} seedPhrase The seed phrase to encrypt
 * @returns {string} The encrypted seed phrase data
 */
function encryptSeedPhrase(seedPhrase) {
  if (!seedPhrase) return null;
  
  // Generate a random initialization vector
  const iv = crypto.randomBytes(ENCRYPTION_IV_LENGTH);
  
  // Create a cipher using AES-256-CBC
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  // Encrypt the seed phrase
  let encrypted = cipher.update(seedPhrase, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Combine IV and encrypted data for storage
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt a stored encrypted seed phrase
 * @param {string} encryptedData The encrypted seed phrase data
 * @returns {string} The decrypted seed phrase
 */
function decryptSeedPhrase(encryptedData) {
  if (!encryptedData) return null;
  
  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Save a seed phrase for a wallet
 * @param {string} walletAddress The wallet address
 * @param {string} seedPhrase The seed phrase to save
 * @returns {Promise<boolean>} True if saved successfully
 */
async function saveSeedPhrase(walletAddress, seedPhrase) {
  try {
    if (!walletAddress || !seedPhrase) {
      throw new Error('Wallet address and seed phrase are required');
    }
    
    // Normalize address
    const normalizedAddress = walletAddress.toLowerCase();
    
    // Encrypt the seed phrase
    const encryptedSeedPhrase = encryptSeedPhrase(seedPhrase);
    
    // Check if an entry already exists for this wallet
    const existingSeedPhrase = await getSeedPhraseEntry(normalizedAddress);
    
    if (existingSeedPhrase) {
      // Update existing entry
      await db.update(walletSeedPhrases)
        .set({
          seedPhrase: encryptedSeedPhrase,
          updatedAt: new Date()
        })
        .where(eq(walletSeedPhrases.walletAddress, normalizedAddress));
    } else {
      // Create new entry
      await db.insert(walletSeedPhrases)
        .values({
          walletAddress: normalizedAddress,
          seedPhrase: encryptedSeedPhrase,
          createdAt: new Date(),
          updatedAt: new Date()
        });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving seed phrase:', error);
    throw error;
  }
}

/**
 * Get the seed phrase entry for a wallet
 * @param {string} walletAddress The wallet address
 * @returns {Promise<Object|null>} The seed phrase entry or null if not found
 */
async function getSeedPhraseEntry(walletAddress) {
  try {
    if (!walletAddress) return null;
    
    const normalizedAddress = walletAddress.toLowerCase();
    
    const [entry] = await db.select()
      .from(walletSeedPhrases)
      .where(eq(walletSeedPhrases.walletAddress, normalizedAddress));
    
    return entry || null;
  } catch (error) {
    console.error('Error getting seed phrase entry:', error);
    return null;
  }
}

/**
 * Get a wallet's seed phrase (decrypted)
 * @param {string} walletAddress The wallet address
 * @returns {Promise<string|null>} The decrypted seed phrase or null if not found
 */
async function getSeedPhrase(walletAddress) {
  try {
    if (!walletAddress) return null;
    
    // Try to get the seed phrase from the dedicated table first
    const entry = await getSeedPhraseEntry(walletAddress);
    
    if (entry && entry.seedPhrase) {
      return decryptSeedPhrase(entry.seedPhrase);
    }
    
    // If not found, check if we have it in the custodial wallets table as fallback
    const [wallet] = await db.select()
      .from(custodialWallets)
      .where(eq(custodialWallets.address, walletAddress.toLowerCase()));
    
    if (wallet && wallet.seedPhrase) {
      // If it's stored in legacy format, it might not be encrypted
      if (wallet.seedPhrase.includes(':')) {
        return decryptSeedPhrase(wallet.seedPhrase);
      }
      return wallet.seedPhrase;
    }
    
    // If no stored seed phrase found, generate a deterministic one for backward compatibility
    return generateDeterministicSeedPhrase(walletAddress);
  } catch (error) {
    console.error('Error getting seed phrase:', error);
    throw error;
  }
}

/**
 * Verify if a seed phrase belongs to a wallet
 * @param {string} seedPhrase The seed phrase to verify
 * @param {string} walletAddress The wallet address
 * @returns {Promise<Object>} Verification result
 */
async function verifySeedPhrase(seedPhrase, walletAddress) {
  try {
    if (!seedPhrase || !walletAddress) {
      return { isValid: false, message: 'Seed phrase and wallet address are required' };
    }
    
    // Normalize the input seed phrase
    const normalizedInputPhrase = seedPhrase.trim().toLowerCase();
    const normalizedAddress = walletAddress.toLowerCase();
    
    // Get the stored seed phrase for this wallet
    const storedSeedPhrase = await getSeedPhrase(normalizedAddress);
    
    if (!storedSeedPhrase) {
      return { isValid: false, message: 'No seed phrase found for this wallet' };
    }
    
    // Constant-time comparison to protect against timing attacks
    // Better than direct string comparison
    const inputBuffer = Buffer.from(normalizedInputPhrase);
    const storedBuffer = Buffer.from(storedSeedPhrase.toLowerCase());
    
    // If buffers have different lengths, pad the shorter one
    let isValid = false;
    if (inputBuffer.length === storedBuffer.length) {
      try {
        isValid = crypto.timingSafeEqual(inputBuffer, storedBuffer);
      } catch (e) {
        isValid = normalizedInputPhrase === storedSeedPhrase.toLowerCase();
      }
    } else {
      // Fallback to regular comparison if buffers are different lengths
      isValid = normalizedInputPhrase === storedSeedPhrase.toLowerCase();
    }
    
    if (isValid) {
      return { isValid: true, message: 'Seed phrase is valid' };
    }
    
    // As a fallback, check if it matches the deterministic generation
    // This provides backward compatibility
    const deterministicPhrase = generateDeterministicSeedPhrase(normalizedAddress);
    
    if (normalizedInputPhrase === deterministicPhrase.toLowerCase()) {
      return { 
        isValid: true, 
        message: 'Seed phrase is valid (using deterministic generation)',
        usedLegacyFallback: true
      };
    }
    
    return { isValid: false, message: 'Invalid seed phrase' };
  } catch (error) {
    console.error('Error verifying seed phrase:', error);
    return { isValid: false, message: 'Error verifying seed phrase' };
  }
}

/**
 * Recover a wallet using its seed phrase
 * @param {string} seedPhrase The seed phrase
 * @param {string} newPassword Optional new password
 * @returns {Promise<Object>} Recovery result
 */
async function recoverWalletWithSeedPhrase(seedPhrase, newPassword) {
  try {
    if (!seedPhrase) {
      throw new Error('Seed phrase is required');
    }
    
    const normalizedSeedPhrase = seedPhrase.trim().toLowerCase();
    
    // First, try to find the wallet by checking stored encrypted seed phrases
    let matchedWallet = null;
    
    // Get all wallets that have seed phrases
    const walletsWithSeeds = await db.select()
      .from(walletSeedPhrases);
    
    // Check each wallet's seed phrase
    for (const entry of walletsWithSeeds) {
      try {
        const decryptedPhrase = decryptSeedPhrase(entry.seedPhrase).toLowerCase();
        if (normalizedSeedPhrase === decryptedPhrase) {
          // Found the wallet by seed phrase
          const [wallet] = await db.select()
            .from(custodialWallets)
            .where(eq(custodialWallets.address, entry.walletAddress));
          
          if (wallet) {
            matchedWallet = wallet;
            break;
          }
        }
      } catch (error) {
        // Skip this entry if decryption fails
        console.error('Error decrypting seed phrase:', error);
      }
    }
    
    // If not found, try the legacy approach
    if (!matchedWallet) {
      const allWallets = await db.select().from(custodialWallets);
      
      for (const wallet of allWallets) {
        // Check against deterministic generation as a fallback
        const deterministicPhrase = generateDeterministicSeedPhrase(wallet.address).toLowerCase();
        
        if (normalizedSeedPhrase === deterministicPhrase) {
          matchedWallet = wallet;
          break;
        }
      }
    }
    
    if (!matchedWallet) {
      throw new Error('Invalid seed phrase or no matching wallet found');
    }
    
    // If we need to update the password
    if (newPassword) {
      // Hash the new password with bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update the wallet with the new password
      await db.update(custodialWallets)
        .set({ 
          password: hashedPassword,
          lastLoginAt: new Date() 
        })
        .where(eq(custodialWallets.id, matchedWallet.id));
    }
    
    return {
      success: true,
      walletAddress: matchedWallet.address,
      walletId: matchedWallet.id,
      isAdmin: matchedWallet.isAdmin || false
    };
    
  } catch (error) {
    console.error('Error recovering wallet with seed phrase:', error);
    throw error;
  }
}

/**
 * Generate and save a new seed phrase for a wallet
 * @param {string} walletAddress The wallet address
 * @returns {Promise<string>} The generated seed phrase
 */
async function generateAndSaveSeedPhrase(walletAddress) {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }
  
  // Generate a new random seed phrase
  const seedPhrase = generateSecureRandomSeedPhrase();
  
  // Save it for the wallet
  await saveSeedPhrase(walletAddress, seedPhrase);
  
  return seedPhrase;
}

module.exports = {
  generateSecureRandomSeedPhrase,
  generateDeterministicSeedPhrase,
  encryptSeedPhrase,
  decryptSeedPhrase,
  saveSeedPhrase,
  getSeedPhrase,
  getSeedPhraseEntry,
  verifySeedPhrase,
  recoverWalletWithSeedPhrase,
  generateAndSaveSeedPhrase
};