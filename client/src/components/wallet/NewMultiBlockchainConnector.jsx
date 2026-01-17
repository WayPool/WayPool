import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoneroConnector } from './MoneroConnector';
import { ConnectWalletButton } from './ConnectWalletButton';
import { WagmiRootProvider } from '@/lib/WagmiRootProvider';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface NewMultiBlockchainConnectorProps {
  defaultTab?: 'ethereum' | 'monero' | 'solana' | 'bitcoin';
  showDescription?: boolean;
}

export function NewMultiBlockchainConnector({
  defaultTab = 'ethereum',
  showDescription = true
}: NewMultiBlockchainConnectorProps) {
  const [activeTab, setActiveTab] = useState<'ethereum' | 'monero' | 'solana' | 'bitcoin'>(defaultTab);
  const [connections, setConnections] = useState<{
    monero?: { address: string, balance: { total: number, unlocked: number } },
  }>({});
  
  const { toast } = useToast();

  const handleMoneroConnect = (address: string, balance: { total: number, unlocked: number }) => {
    setConnections(prev => ({
      ...prev,
      monero: { address, balance }
    }));
  };

  const handleSolanaConnect = () => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: "La conexión con Solana estará disponible próximamente.",
    });
  };

  const handleBitcoinConnect = () => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: "La conexión con Bitcoin estará disponible próximamente.",
    });
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Conectividad Multi-Blockchain</CardTitle>
        {showDescription && (
          <CardDescription>
            Conecta con diferentes blockchains para gestionar tus activos digitales
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'ethereum' | 'monero' | 'solana' | 'bitcoin')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="monero">Monero</TabsTrigger>
            <TabsTrigger value="solana">Solana</TabsTrigger>
            <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ethereum" className="mt-4 space-y-4">
            <WagmiRootProvider>
              <ConnectWalletButton />
            </WagmiRootProvider>
            
            {showDescription && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">Conecta con redes basadas en EVM:</p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                  <li>Ethereum Mainnet</li>
                  <li>Polygon</li>
                  <li>Arbitrum</li>
                  <li>Optimism</li>
                  <li>Binance Smart Chain</li>
                  <li>Avalanche C-Chain</li>
                </ul>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monero" className="mt-4 space-y-4">
            <MoneroConnector onConnect={handleMoneroConnect} />
            
            {!connections.monero && (
              <Alert className="mt-3 bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/30">
                <Info className="h-4 w-4" />
                <AlertTitle>Modo simulación</AlertTitle>
                <AlertDescription>
                  La conexión con Monero está en modo simulación con fines educativos. No se conecta a ninguna red real.
                </AlertDescription>
              </Alert>
            )}
            
            {showDescription && !connections.monero && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">Características de Monero:</p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                  <li>Privacidad por diseño</li>
                  <li>Transacciones anónimas</li>
                  <li>Direcciones y montos ocultos</li>
                  <li>Fungibilidad total</li>
                </ul>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="solana" className="mt-4 space-y-4">
            <div className="flex justify-center p-6 border border-dashed rounded-md border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50">
              <div className="text-center">
                <p className="text-gray-500 mb-3">Próximamente</p>
                <button 
                  className="px-4 py-2 bg-purple-600 text-white rounded-md opacity-70 cursor-not-allowed"
                  disabled
                  onClick={handleSolanaConnect}
                >
                  Conectar con Solana
                </button>
              </div>
            </div>
            
            {showDescription && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">Características de Solana:</p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                  <li>Alta velocidad (65,000 TPS)</li>
                  <li>Bajas comisiones</li>
                  <li>Ecosistema NFT y DeFi</li>
                  <li>Proof of History + Proof of Stake</li>
                </ul>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bitcoin" className="mt-4 space-y-4">
            <div className="flex justify-center p-6 border border-dashed rounded-md border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50">
              <div className="text-center">
                <p className="text-gray-500 mb-3">Próximamente</p>
                <button 
                  className="px-4 py-2 bg-orange-500 text-white rounded-md opacity-70 cursor-not-allowed"
                  disabled
                  onClick={handleBitcoinConnect}
                >
                  Conectar con Bitcoin
                </button>
              </div>
            </div>
            
            {showDescription && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">Características de Bitcoin:</p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                  <li>Primera criptomoneda</li>
                  <li>Máxima descentralización</li>
                  <li>Reserva de valor digital</li>
                  <li>Protocolo Lightning para pagos rápidos</li>
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}