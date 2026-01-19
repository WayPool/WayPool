import React, { createContext, useContext, ReactNode } from 'react';
import { useSimpleWallet } from '@/hooks/use-simple-wallet';

interface SimpleWalletContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: Error | null;
}

// Crear el contexto con un valor por defecto
const SimpleWalletContext = createContext<SimpleWalletContextType | undefined>(undefined);

// Provider component
export function SimpleWalletProvider({ children }: { children: ReactNode }) {
  const walletData = useSimpleWallet();

  return (
    <SimpleWalletContext.Provider value={walletData}>
      {children}
    </SimpleWalletContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useSimpleWalletContext() {
  const context = useContext(SimpleWalletContext);
  
  if (context === undefined) {
    throw new Error('useSimpleWalletContext debe usarse dentro de un SimpleWalletProvider');
  }
  
  return context;
}

export default SimpleWalletProvider;