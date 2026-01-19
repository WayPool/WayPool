import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum, optimism, avalanche, bsc } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

// Obtener el projectId de las variables de entorno
const projectId = import.meta.env.WALLET_CONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn(
    "Advertencia: No se ha encontrado WALLET_CONNECT_PROJECT_ID en las variables de entorno. WalletConnect podría no funcionar correctamente."
  );
}

// Metadatos de la DApp
export const metadata = {
  name: 'WayBank Multi-Blockchain Platform',
  description: 'Plataforma avanzada para gestión de múltiples blockchains',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://waybank.com',
  icons: ['https://www.getmonero.org/press-kit/symbols/monero-symbol-on-white-480.png'],
};

// Configuración de wagmi
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum, optimism, avalanche, bsc],
  connectors: [
    walletConnect({
      projectId,
      metadata,
      showQrModal: true,
      qrModalOptions: {
        themeMode: "light",
      }
    }),
    injected({
      shimDisconnect: true,
      target: 'metaMask',
    }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
      darkMode: false,
      reloadOnDisconnect: true,
    }),
  ],
  transports: {
    [mainnet.id]: http('https://ethereum.publicnode.com'),
    [sepolia.id]: http('https://ethereum-sepolia.publicnode.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  ssr: true,
});

// Crear QueryClient para React Query
export const queryClient = new QueryClient();