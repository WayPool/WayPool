import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, ExternalLink, Wallet } from 'lucide-react';

interface SimpleEthereumConnectorProps {
  onConnect?: (address: string, chainId: string) => void;
  className?: string;
}

export function SimpleEthereumConnector({ onConnect, className }: SimpleEthereumConnectorProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string>('1'); // Ethereum Mainnet por defecto
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Esta función simula la conexión con Ethereum
  const connectWallet = async () => {
    setLoading(true);
    
    // Simular conexión con una pequeña demora
    setTimeout(() => {
      // Generar una dirección aleatoria para la demo
      const demoAddress = '0x' + Array(40).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      
      setAddress(demoAddress);
      setIsConnected(true);
      
      // Notificar al componente padre
      if (onConnect) {
        onConnect(demoAddress, chainId);
      }
      
      toast({
        title: "Wallet conectada",
        description: `Conectado a la dirección ${demoAddress.substring(0, 8)}...${demoAddress.substring(36)}`,
      });
      
      setLoading(false);
    }, 1500);
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    toast({
      title: "Wallet desconectada",
      description: "La conexión con la wallet ha sido cerrada",
    });
  };

  // Obtener formato corto de dirección
  const shortAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` 
    : '';

  if (isConnected && address) {
    return (
      <Card className={`bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-indigo-600" />
                <span className="text-sm font-medium">Wallet Ethereum</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={disconnectWallet}
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
                Ethereum Mainnet
              </span>
            </div>
            
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
    <div className={className}>
      <Button
        variant="outline"
        className="w-full border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
        onClick={connectWallet}
        disabled={loading}
      >
        <Wallet className="h-4 w-4 mr-2" />
        {loading ? "Conectando..." : "Conectar Wallet"}
      </Button>
    </div>
  );
}