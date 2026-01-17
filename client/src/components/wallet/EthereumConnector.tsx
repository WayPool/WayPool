import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName, useChainId, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ArrowRightLeft, X, ExternalLink } from 'lucide-react';

interface EthereumConnectorProps {
  onConnect?: (address: string, chainId: string) => void;
}

export function EthereumConnector({ onConnect }: EthereumConnectorProps) {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, isPending: isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, chains, error: switchError } = useSwitchChain();
  
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  // Formato corto de dirección
  const shortAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` 
    : '';

  // Manejador de conexión
  const handleConnect = (connector: any) => {
    connect({ connector });
    setShowModal(false);
  };

  // Efecto cuando se conecta
  React.useEffect(() => {
    if (isConnected && address && onConnect) {
      onConnect(address, chainId?.toString() || '');
      toast({
        title: "Wallet conectada",
        description: `${ensName || shortAddress} en la red ${chains.find(c => c.id === chainId)?.name || chainId}`,
      });
    }
  }, [isConnected, address, chainId, ensName]);

  if (isConnected && address) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium">
                  {activeConnector?.name || "Wallet"}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => disconnect()}
                className="h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Dirección:</p>
              <p className="text-sm font-mono truncate">
                {ensName ? `${ensName} (${shortAddress})` : shortAddress}
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
                  onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
                >
                  {chains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
                </select>
                {switchError && (
                  <p className="text-xs text-red-500 mt-1">
                    {switchError.message}
                  </p>
                )}
              </div>
            )}
            
            <div className="mt-2 flex justify-end">
              <a 
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Ver en Etherscan
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
        className="w-full border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/20"
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? "Conectando..." : "Conectar Ethereum"}
      </Button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Conectar Wallet</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleConnect(connector)}
                  disabled={!connector.ready || isConnecting}
                >
                  {connector.name}
                  {!connector.ready && ' (no disponible)'}
                </Button>
              ))}
            </div>
            
            {connectError && (
              <p className="text-sm text-red-500 mt-4">
                {connectError.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}