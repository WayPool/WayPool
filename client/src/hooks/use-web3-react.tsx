import React, { createContext, useContext } from 'react';

interface Web3ReactContextType {
  active: boolean;
  account: string | null;
  deactivate: () => void;
  activate: (connector: any) => Promise<void>;
  error: Error | null;
}

// Crear un contexto con valores por defecto (inactivo)
const Web3ReactContext = createContext<Web3ReactContextType>({
  active: false,
  account: null,
  deactivate: () => console.log('Sistema de wallet en mantenimiento'),
  activate: async () => console.log('Sistema de wallet en mantenimiento'),
  error: null
});

// Hook para acceder al contexto
export function useWeb3React() {
  return useContext(Web3ReactContext);
}

// Componente provider (deshabilitado)
export function Web3ReactProvider({ children }: { children: React.ReactNode }) {
  const value: Web3ReactContextType = {
    active: false,
    account: null,
    deactivate: () => console.log('Sistema de wallet en mantenimiento'),
    activate: async () => console.log('Sistema de wallet en mantenimiento'),
    error: null
  };

  return (
    <Web3ReactContext.Provider value={value}>
      {children}
    </Web3ReactContext.Provider>
  );
}