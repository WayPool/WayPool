import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

// Esta clave es para uso de demo solamente y tiene limitaciones
// En producción, obtén tu projectId en https://cloud.walletconnect.com
const projectId = 'a9a861f2e6a30cbc9af5d513fc536e59';

// Metadatos de la aplicación
const metadata = {
  name: 'WayBank Multi-Blockchain Platform',
  description: 'Plataforma de gestión de posiciones en múltiples blockchains',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://waybank.example.com',
  icons: ['https://waybank.example.com/logo.png'], 
};

// Configuración de wagmi
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum],
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
    [sepolia.id]: http('https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
  },
  ssr: true,
});

// Cliente de Query para React Query (usado por wagmi)
export const queryClient = new QueryClient();