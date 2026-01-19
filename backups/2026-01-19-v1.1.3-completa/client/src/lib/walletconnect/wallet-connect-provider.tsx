import React, { createContext, useContext } from 'react';

// Tipos de contexto de WalletConnect (deshabilitado)
export interface WalletConnectContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  balance: string | null;
  network: string | null;
  provider: any | null;
  ethersProvider: any | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  checkBalance: () => Promise<void>;
}

// Contexto por defecto
const defaultContext: WalletConnectContextType = {
  address: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  balance: null,
  network: null,
  provider: null,
  ethersProvider: null,
  connectWallet: async () => {
    console.log('Sistema de wallet en mantenimiento');
    return false;
  },
  disconnectWallet: () => console.log('Sistema de wallet en mantenimiento'),
  checkBalance: async () => console.log('Sistema de wallet en mantenimiento')
};

// Crear el contexto
export const WalletConnectContext = createContext<WalletConnectContextType>(defaultContext);

// Hook para acceder al contexto
export const useWalletConnect = () => useContext(WalletConnectContext);

// Componente provider
export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletConnectContext.Provider value={defaultContext}>
      {children}
    </WalletConnectContext.Provider>
  );
}