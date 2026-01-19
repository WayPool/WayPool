import React, { useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig, initializeWeb3Modal } from './web3modal-config';

interface WagmiWrapperProps {
  children: React.ReactNode;
}

// Componente para envolver aplicaciones con la configuración Wagmi
export function WagmiWrapper({ children }: WagmiWrapperProps) {
  // Inicializar Web3Modal en el lado del cliente
  useEffect(() => {
    try {
      initializeWeb3Modal();
    } catch (err) {
      console.error('Error inicializando Web3Modal desde WagmiWrapper:', err);
    }
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
    </WagmiConfig>
  );
}

// Alias para mantener compatibilidad con código existente
export const WagmiProvider = WagmiWrapper;