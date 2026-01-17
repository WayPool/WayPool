// NewWeb3Connector.tsx - Implementación simplificada compatible con las versiones actuales
import React, { useState, useEffect } from 'react';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ID de proyecto para WalletConnect v2 (debería estar en variable de entorno)
const projectId = "27e484dcd237756ba3f1c4d8bf2dd4fb";

// Definir las cadenas soportadas
const chains = [mainnet, polygon];

// Crear configuración única para este componente
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'WayBank',
    description: 'Conecta tu wallet a WayBank',
    url: 'https://waybank.com', 
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
});

// Crear instancia de Web3Modal una sola vez
const modal = createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent-color': '#3b82f6' // Color azul que coincide con el tema
  }
});

// Componente principal para conectar con Web3
const NewWeb3Connector = ({ onConnect }: { onConnect?: (address: string, chainId: string) => void }) => {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Función para conectar la wallet usando Web3Modal
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Abre Web3Modal directamente
      if (modal) {
        modal.open();
      } else {
        // Fallback para abrir el modal
        const modalButton = document.querySelector('w3m-button');
        if (modalButton) {
          (modalButton as HTMLElement).click();
        } else {
          throw new Error('No se pudo encontrar el botón de Web3Modal');
        }
      }
    } catch (err: any) {
      console.error('Error al abrir Web3Modal:', err);
      setError('Error al conectar: ' + (err.message || 'Desconocido'));
      
      toast({
        title: "Error de conexión",
        description: "No se pudo abrir el selector de wallet. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Escuchar cambios de cuenta
  useEffect(() => {
    if (window.ethereum) {
      // Verificar cuentas al inicio
      const checkCurrentAccounts = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            setAccount(address);
            
            // Obtener chainId
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chainIdDecimal = parseInt(chainId, 16).toString();
            setChainId(chainIdDecimal);
            
            // Obtener balance
            const balanceHex = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [address, 'latest']
            });
            const balanceInWei = parseInt(balanceHex, 16);
            const balanceInEth = balanceInWei / 10**18;
            setBalance(balanceInEth.toFixed(4));
            
            // Notificar conexión
            if (onConnect) {
              onConnect(address, chainIdDecimal);
            }
          }
        } catch (err) {
          console.error("Error al verificar cuenta:", err);
        }
      };
      
      checkCurrentAccounts();
      
      // Configurar listeners
      const handleAccountsChanged = async (accounts: string[]) => {
        try {
          if (accounts.length > 0) {
            const address = accounts[0];
            setAccount(address);
            
            // Obtener datos actualizados
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chainIdDecimal = parseInt(chainId, 16).toString();
            setChainId(chainIdDecimal);
            
            // Notificar al componente padre
            if (onConnect) {
              onConnect(address, chainIdDecimal);
            }
          } else {
            setAccount('');
            setChainId('');
            setBalance('');
          }
        } catch (err) {
          console.error("Error al manejar cambio de cuenta:", err);
        }
      };

      const handleChainChanged = (chainId: string) => {
        try {
          const chainIdDecimal = parseInt(chainId, 16).toString();
          setChainId(chainIdDecimal);
          
          // Notificar cambio de cadena
          if (account && onConnect) {
            onConnect(account, chainIdDecimal);
          }
        } catch (err) {
          console.error("Error al manejar cambio de cadena:", err);
        }
      };

      // Suscribir a eventos
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Limpiar
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account, onConnect]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="w-full bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md space-y-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Conectar Wallet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Elige tu método de conexión preferido
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <Button 
          onClick={connectWallet} 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </>
          ) : 'Conectar con WalletConnect'}
        </Button>
        
        {account && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h3 className="font-medium mb-2 text-sm">Wallet conectada</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><span className="inline-block w-20 opacity-70">Dirección:</span> {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</p>
              <p><span className="inline-block w-20 opacity-70">Red:</span> {chainId === '1' ? 'Ethereum' : chainId === '137' ? 'Polygon' : `Chain ${chainId}`}</p>
              <p><span className="inline-block w-20 opacity-70">Balance:</span> {balance} ETH</p>
            </div>
          </div>
        )}
      </div>
    </WagmiConfig>
  );
};

export default NewWeb3Connector;