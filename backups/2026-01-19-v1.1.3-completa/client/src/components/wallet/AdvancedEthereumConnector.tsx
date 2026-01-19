import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, ExternalLink, Wallet } from 'lucide-react';
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useEnsName, 
  useChainId, 
  useSwitchChain 
} from 'wagmi';
import { initializeWeb3Modal } from '@/lib/web3modal-config';

// Inicializar Web3Modal en el cliente
if (typeof window !== 'undefined') {
  initializeWeb3Modal();
}

interface AdvancedEthereumConnectorProps {
  onConnect?: (address: string, chainId: string) => void;
}

export function AdvancedEthereumConnector({ onConnect }: AdvancedEthereumConnectorProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address });
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const { toast } = useToast();

  // Formato corto de dirección
  const shortAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` 
    : '';

  // Efecto para notificar conexión
  useEffect(() => {
    if (isConnected && address && onConnect) {
      onConnect(address, chainId?.toString() || '');
      
      toast({
        title: "Wallet conectada",
        description: `${ensName || shortAddress} en la red ${chains.find(c => c.id === chainId)?.name || chainId}`,
      });
    }
  }, [isConnected, address, chainId, ensName, onConnect]);

  const handleOpenW3Modal = async () => {
    try {
      // Intentar abrir el modal de Web3Modal (se hace a través de evento global)
      const w3mButton = document.getElementById('w3m-button');
      if (w3mButton) {
        w3mButton.click();
      } else {
        // Si no se encuentra el botón, intentar conectar directamente con el primer conector
        if (connectors.length > 0) {
          await connectAsync({ connector: connectors[0] });
        }
      }
    } catch (error) {
      console.error('Error al abrir Web3Modal:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo abrir el selector de wallet",
        variant: "destructive"
      });
    }
  };

  if (isConnected && address) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-indigo-600" />
                <span className="text-sm font-medium">
                  {ensName ? "ENS: " + ensName : "Wallet Ethereum"}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => disconnect()}
                className="h-8 px-2"
              >
                Desconectar
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Dirección:</p>
              <p className="text-sm font-mono truncate">
                {address}
              </p>
            </div>
            
            <div className="flex items-center mt-2">
              <ArrowRightLeft className="h-3 w-3 mr-1 text-gray-500" />
              <span className="text-xs text-gray-500">Red:</span>
              <span className="text-xs font-medium ml-1">
                {chains.find(c => c.id === chainId)?.name || `Chain ID: ${chainId}`}
              </span>
            </div>
            
            {chains.length > 1 && (
              <div className="mt-2">
                <select
                  className="w-full text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-1"
                  value={chainId}
                  onChange={(e) => switchChain?.({ chainId: Number(e.target.value) })}
                >
                  {chains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="mt-2 flex justify-end">
              <a 
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Ver en Explorer
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        className="w-full border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
        onClick={handleOpenW3Modal}
      >
        <Wallet className="h-4 w-4 mr-2" />
        Conectar Wallet
      </Button>
    </div>
  );
}