import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { mainnet, sepolia, polygon, arbitrum, optimism, avalanche, bsc } from 'wagmi/chains';

// Clave de proyecto para WalletConnect
// Usar la variable de entorno directamente causa problemas de acceso en algunos entornos
export const projectId = process.env.WALLET_CONNECT_PROJECT_ID || 
                        (typeof import.meta !== 'undefined' && import.meta.env ? 
                         import.meta.env.WALLET_CONNECT_PROJECT_ID : '') || 
                        'a9a861f2e6a30cbc9af5d513fc536e59'; // ID de respaldo

// Lista de cadenas blockchain soportadas como array
export const chains = [
  mainnet,
  polygon,
  sepolia,
  arbitrum,
  optimism,
  avalanche,
  bsc
];

// Metadatos de la aplicación
export const metadata = {
  name: 'WayBank Multi-Blockchain Platform',
  description: 'Plataforma de gestión avanzada para múltiples blockchains',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://waybank.com',
  icons: ['https://www.getmonero.org/press-kit/symbols/monero-symbol-on-white-480.png'],
};

// Configuración de Wagmi para integrarse con Web3Modal
export const wagmiConfig = defaultWagmiConfig({
  projectId,
  // @ts-ignore - La tipificación de chains en la librería a veces causa problemas
  chains,
  metadata,
  enableWalletConnect: true,
  enableInjected: true, 
  enableEIP6963: true,
  enableCoinbase: true,
});

// Flag global para evitar inicialización múltiple que causa loops en Firefox
const WEB3MODAL_CONFIG_INIT_KEY = '__web3modal_config_initialized__';

// Inicializar Web3Modal solo en el cliente - con protección contra inicialización múltiple
export function initializeWeb3Modal() {
  if (typeof window !== 'undefined') {
    // Verificar si ya está inicializado para evitar el error "WalletConnect Core is already initialized"
    if ((window as any)[WEB3MODAL_CONFIG_INIT_KEY]) {
      console.log('Web3Modal ya inicializado, saltando...');
      return;
    }

    try {
      createWeb3Modal({
        wagmiConfig,
        projectId,
        // @ts-ignore - La tipificación de chains en la librería a veces causa problemas
        chains,
        themeMode: 'light',
        themeVariables: {
          '--w3m-accent': '#6366f1', // Indigo-500
          '--w3m-border-radius-master': '0.5rem',
        },
        enableAnalytics: false, // Desactivar análisis para privacidad
      });
      (window as any)[WEB3MODAL_CONFIG_INIT_KEY] = true;
      console.log('Web3Modal inicializado correctamente desde config');
    } catch (error: any) {
      // Si el error es porque ya está inicializado, no es un error real
      if (error?.message?.includes('already initialized')) {
        console.log('Web3Modal ya estaba inicializado (detectado por error)');
        (window as any)[WEB3MODAL_CONFIG_INIT_KEY] = true;
      } else {
        console.error('Error al crear Web3Modal:', error);
      }
    }
  }
}