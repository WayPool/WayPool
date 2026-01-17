import React from 'react';
import { WagmiConfig } from 'wagmi';
import { createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

// Configuración básica con proveedores públicos
const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
});

export function WagmiRootProvider({ children }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  );
}