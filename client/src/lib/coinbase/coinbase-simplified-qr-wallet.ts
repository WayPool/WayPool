/**
 * Hook simplificado para Coinbase QR (deshabilitado)
 * El sistema de conexión de wallet está en rediseño
 */
import React, { createContext, useContext } from 'react';

// Tipo de contexto
interface CoinbaseQRContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
}

// Valor por defecto del contexto
const defaultContext: CoinbaseQRContextType = {
  address: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  connectWallet: async () => {
    console.log('Sistema de wallet en mantenimiento');
    return false;
  },
  disconnectWallet: () => console.log('Sistema de wallet en mantenimiento')
};

// Crear el contexto
const CoinbaseQRContext = createContext<CoinbaseQRContextType>(defaultContext);

// Hook para usar el contexto
export function useCoinbaseQR() {
  return useContext(CoinbaseQRContext);
}

// Componente provider
export function CoinbaseQRProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(
    CoinbaseQRContext.Provider,
    { value: defaultContext },
    children
  );
}