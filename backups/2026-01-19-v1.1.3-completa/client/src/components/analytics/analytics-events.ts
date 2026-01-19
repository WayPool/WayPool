import { sendGAEvent } from './GoogleAnalytics';

/**
 * Módulo para integrar eventos específicos de Google Analytics en toda la aplicación
 * Proporciona funciones para rastrear eventos importantes relacionados con blockchain
 */

// Eventos de Wallet
export const trackWalletConnect = (walletType: string, walletAddress: string) => {
  sendGAEvent('wallet_connect', {
    wallet_type: walletType,
    wallet_address: walletAddress?.slice(0, 6) + '...' + walletAddress?.slice(-4) // Solo enviamos versión corta de la dirección
  });
};

export const trackWalletDisconnect = (walletType: string) => {
  sendGAEvent('wallet_disconnect', {
    wallet_type: walletType
  });
};

// Eventos de Transacciones
export const trackTransactionSubmit = (txType: string, amount: string, tokenSymbol: string) => {
  sendGAEvent('transaction_submit', {
    transaction_type: txType,
    amount: amount,
    token: tokenSymbol
  });
};

export const trackTransactionSuccess = (txType: string, txHash: string, amount: string, tokenSymbol: string) => {
  sendGAEvent('transaction_success', {
    transaction_type: txType,
    transaction_hash: txHash.slice(0, 10) + '...' + txHash.slice(-6), // Versión corta del hash
    amount: amount,
    token: tokenSymbol
  });
};

export const trackTransactionError = (txType: string, errorMessage: string) => {
  sendGAEvent('transaction_error', {
    transaction_type: txType,
    error_message: errorMessage
  });
};

// Eventos de Pool y Posiciones
export const trackPoolView = (poolAddress: string, poolSymbols: string) => {
  sendGAEvent('pool_view', {
    pool_address: poolAddress.slice(0, 6) + '...' + poolAddress.slice(-4),
    pool_symbols: poolSymbols
  });
};

export const trackPositionCreate = (poolSymbols: string, amount: string, position_type: string) => {
  sendGAEvent('position_create', {
    pool_symbols: poolSymbols,
    amount: amount,
    position_type: position_type
  });
};

// Eventos de UI
export const trackLanguageChange = (language: string) => {
  sendGAEvent('language_change', {
    language: language
  });
};

export const trackThemeChange = (theme: string) => {
  sendGAEvent('theme_change', {
    theme: theme
  });
};

// Eventos de NFT
export const trackNftView = (tokenId: string, collection: string) => {
  sendGAEvent('nft_view', {
    token_id: tokenId,
    collection: collection
  });
};

// Eventos de búsqueda
export const trackSearch = (query: string, results_count: number) => {
  sendGAEvent('search', {
    search_query: query,
    results_count: results_count
  });
};

// Eventos Stripe
export const trackStripeCheckoutStart = (amount: string, currency: string, product: string) => {
  sendGAEvent('stripe_checkout_start', {
    amount: amount,
    currency: currency,
    product: product
  });
};

export const trackStripeCheckoutComplete = (amount: string, currency: string, product: string) => {
  sendGAEvent('stripe_checkout_complete', {
    amount: amount,
    currency: currency,
    product: product
  });
};