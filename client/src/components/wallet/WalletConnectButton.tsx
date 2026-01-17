// Implementación simplificada de WalletConnect usando HTML nativo
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface WalletConnectButtonProps {
  onConnect?: (address: string, chainId: string) => void;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ onConnect }) => {
  const [loading, setLoading] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  useEffect(() => {
    // Verificar si ya hay una conexión establecida
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setConnected(true);
            
            // Notificar al componente padre si hay una conexión
            if (onConnect) {
              window.ethereum.request({ method: 'eth_chainId' })
                .then((chainId: string) => {
                  onConnect(accounts[0], parseInt(chainId, 16).toString());
                })
                .catch(console.error);
            }
          }
        })
        .catch(console.error);
        
      // Escuchar cambios de cuenta
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setConnected(true);
          
          // Notificar al componente padre
          if (onConnect) {
            window.ethereum.request({ method: 'eth_chainId' })
              .then((chainId: string) => {
                onConnect(accounts[0], parseInt(chainId, 16).toString());
              })
              .catch(console.error);
          }
        } else {
          setConnected(false);
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [onConnect]);

  const handleClick = () => {
    setLoading(true);
    
    try {
      // Buscar un elemento web3modal existente para hacer clic en él
      // Este método es más directo y tiene más posibilidades de funcionar
      const connectButton = document.querySelector('w3m-button') || 
                           document.getElementById('web3modal-connect-button') ||
                           document.querySelector('[w3m-button]');
                           
      if (connectButton) {
        (connectButton as HTMLElement).click();
      } else {
        // Si no encontramos un botón existente, intentar importar Web3Modal
        import('@/components/wallet/Web3Connector').then(({ openWeb3Modal }) => {
          openWeb3Modal();
        }).catch(err => {
          console.error("Error al abrir Web3Modal:", err);
        });
      }
    } catch (error) {
      console.error("Error al conectar WalletConnect:", error);
    } finally {
      // Dejar de mostrar la animación después de un tiempo razonable
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading}
      className="w-full bg-[#1c2237] hover:bg-[#232c45] rounded-lg p-3 flex items-center justify-between transition-colors"
      variant="outline"
    >
      <span className="font-medium">WalletConnect</span>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
      ) : (
        <span className="text-xs text-blue-400">(Scan QR)</span>
      )}
    </Button>
  );
};

export default WalletConnectButton;