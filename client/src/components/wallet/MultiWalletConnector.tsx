import React, { useState } from 'react';
import { ConnectWalletButton } from './ConnectWalletButton';
import { MoneroConnector } from './MoneroConnector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWeb3React } from '@/hooks/use-web3-react';
import { isMobile } from '@/lib/utils';

interface MultiWalletConnectorProps {
  className?: string;
  onConnect?: (address: string) => void;
}

/**
 * Componente integrador que permite conectar con múltiples tipos de wallets
 * Soporta Ethereum (MetaMask, WalletConnect, Coinbase Wallet) y Monero
 * Optimizado para dispositivos móviles y desktop
 */
export function MultiWalletConnector({ className = '', onConnect }: MultiWalletConnectorProps) {
  const { active: ethereumActive, account: ethereumAccount } = useWeb3React();
  const [moneroAddress, setMoneroAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('ethereum');
  
  // Detectar si hay alguna wallet conectada
  const isAnyWalletConnected = ethereumActive || moneroAddress;
  
  // Manejar conexión con Monero
  const handleMoneroConnect = (address: string) => {
    setMoneroAddress(address);
    
    // Llamar al callback de conexión si existe
    if (onConnect) {
      onConnect(address);
    }
  };
  
  // Efecto para manejar la conexión Ethereum
  React.useEffect(() => {
    if (ethereumActive && ethereumAccount && onConnect) {
      onConnect(ethereumAccount);
    }
  }, [ethereumActive, ethereumAccount, onConnect]);
  
  // Mostrar diseño optimizado para móviles
  if (isMobile()) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="monero">Monero</TabsTrigger>
          </TabsList>
          <TabsContent value="ethereum" className="py-2">
            <ConnectWalletButton className="w-full" />
          </TabsContent>
          <TabsContent value="monero" className="py-2">
            <MoneroConnector 
              onConnect={handleMoneroConnect} 
              className="w-full"
            />
          </TabsContent>
        </Tabs>
        
        {isAnyWalletConnected && (
          <div className="text-sm text-green-500 mt-2 text-center">
            Wallet conectada correctamente
          </div>
        )}
      </div>
    );
  }
  
  // Diseño para desktop
  return (
    <div className={`flex flex-row gap-2 items-center ${className}`}>
      <ConnectWalletButton />
      <MoneroConnector onConnect={handleMoneroConnect} />
      
      {isAnyWalletConnected && (
        <div className="ml-2 text-sm text-green-500">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
          Conectado
        </div>
      )}
    </div>
  );
}