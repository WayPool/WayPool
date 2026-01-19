import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EthereumConnector } from './EthereumConnector';
import { MoneroConnector } from './MoneroConnector';
import { useToast } from '@/hooks/use-toast';
import { WagmiWrapper } from '@/lib/wagmi-provider';

interface MultiBlockchainConnectorProps {
  defaultTab?: 'ethereum' | 'monero';
  showDescription?: boolean;
}

export function MultiBlockchainConnector({ 
  defaultTab = 'ethereum',
  showDescription = true
}: MultiBlockchainConnectorProps) {
  const [activeTab, setActiveTab] = useState<'ethereum' | 'monero'>(defaultTab);
  const [connections, setConnections] = useState<{
    ethereum?: { address: string, chainId: string },
    monero?: { address: string, balance: { total: number, unlocked: number } }
  }>({});
  
  const { toast } = useToast();

  const handleEthereumConnect = (address: string, chainId: string) => {
    setConnections(prev => ({
      ...prev,
      ethereum: { address, chainId }
    }));
  };

  const handleMoneroConnect = (address: string, balance: { total: number, unlocked: number }) => {
    setConnections(prev => ({
      ...prev,
      monero: { address, balance }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar con Blockchains</CardTitle>
        {showDescription && (
          <CardDescription>
            Conecta con diferentes blockchains para interactuar con tus activos digitales
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'ethereum' | 'monero')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="monero">Monero</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ethereum" className="mt-4">
            <WagmiWrapper>
              <EthereumConnector onConnect={handleEthereumConnect} />
            </WagmiWrapper>
            
            {showDescription && !connections.ethereum && (
              <div className="mt-4 text-sm text-gray-500">
                <p>Conecta con tus wallets Ethereum, incluyendo:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>MetaMask (navegador)</li>
                  <li>WalletConnect (móvil)</li>
                  <li>Coinbase Wallet</li>
                  <li>Y otros proveedores compatibles</li>
                </ul>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monero" className="mt-4">
            <MoneroConnector onConnect={handleMoneroConnect} />
            
            {showDescription && !connections.monero && (
              <div className="mt-4 text-sm text-gray-500">
                <p>Conecta con Monero (XMR):</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Privacidad por defecto</li>
                  <li>Transacciones anónimas</li>
                  <li>Fungibilidad completa</li>
                  <li><em>Nota: Esta es una simulación para fines educativos</em></li>
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}