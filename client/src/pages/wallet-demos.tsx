import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BasicWalletConnector } from '@/components/wallet/BasicWalletConnector';
import { Link } from 'wouter';

// Importación directa del componente EthereumConnectDemo
import EthereumConnectDemo from './ethereum-connect-demo';

// Simulación del componente MoneroConnector para demostración
function MoneroConnector() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ total: 0, unlocked: 0 });

  const handleConnect = () => {
    // Simulamos la conexión con una wallet de Monero
    setConnected(true);
    setAddress('43TH7ogTXBbZjm...');
    setBalance({ total: 2.5, unlocked: 1.8 });
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAddress('');
    setBalance({ total: 0, unlocked: 0 });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Monero Connector <span className="text-xs bg-yellow-100 text-yellow-800 p-1 rounded ml-2">Simulación</span></h3>
      
      {!connected ? (
        <div>
          <p className="mb-4 text-gray-600">Esta es una simulación de conexión a Monero. No se conecta a ninguna red real.</p>
          <button 
            onClick={handleConnect}
            className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded"
          >
            Simular Conexión Monero
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border rounded bg-gray-50">
            <p className="flex justify-between mb-2">
              <span className="font-medium">Dirección:</span>
              <span className="font-mono">{address}</span>
            </p>
            <p className="flex justify-between mb-2">
              <span className="font-medium">Balance Total:</span>
              <span>{balance.total.toFixed(4)} XMR</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Balance Disponible:</span>
              <span>{balance.unlocked.toFixed(4)} XMR</span>
            </p>
          </div>
          
          <button 
            onClick={handleDisconnect}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Desconectar
          </button>
        </div>
      )}
    </div>
  );
}

// Componente unificado para demostración de Wallets
export default function WalletDemosPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Centro de Demostración de Wallets</h1>
        <p className="text-muted-foreground mt-2">
          Prueba diferentes métodos de conexión con wallets de criptomonedas
        </p>
      </div>

      <Tabs defaultValue="ethereum" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="ethereum">Ethereum Básico</TabsTrigger>
          <TabsTrigger value="multichain">Multi-Cadenas</TabsTrigger>
          <TabsTrigger value="monero">Monero (Simulado)</TabsTrigger>
        </TabsList>

        {/* Demo 1: Ethereum Básico con Metamask */}
        <TabsContent value="ethereum" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <EthereumConnectDemo />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conexión Ethereum Simple</CardTitle>
                  <CardDescription>
                    Conecta directamente con MetaMask o providers compatibles con Web3
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esta demostración utiliza la API de Ethereum directamente sin 
                    bibliotecas adicionales para una conexión simple y ligera.
                  </p>
                  <h4 className="font-medium mb-2">Características:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Conexión directa con MetaMask</li>
                    <li>Detección automática de dispositivo</li>
                    <li>Visualización de balance y dirección</li>
                    <li>Manejo de cambios de cuenta y red</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Instrucciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Para probar esta demo:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Asegúrate de tener MetaMask instalado</li>
                    <li>Haz clic en "Conectar Wallet"</li>
                    <li>Aprueba la conexión en la ventana emergente</li>
                    <li>Prueba a cambiar de red en MetaMask</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Demo 2: Multi Chain con Wagmi/Viem */}
        <TabsContent value="multichain" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <BasicWalletConnector />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Multi-Cadena</CardTitle>
                  <CardDescription>
                    Conexión avanzada con soporte para múltiples cadenas y wallets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esta demo implementa una conexión más avanzada utilizando
                    ethers.js para gestionar interacciones con múltiples cadenas.
                  </p>
                  <h4 className="font-medium mb-2">Características:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Soporte para múltiples cadenas (Ethereum, Polygon, etc.)</li>
                    <li>Conexión con diferentes wallets (MetaMask, WalletConnect)</li>
                    <li>Optimizado para dispositivos móviles y escritorio</li>
                    <li>Diseño adaptable según el dispositivo</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demos Adicionales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Tenemos implementaciones adicionales con diversas características:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <h4 className="font-medium">WalletConnect v2</h4>
                      <p className="text-xs text-muted-foreground">
                        Conexión con código QR para wallets móviles
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <h4 className="font-medium">Wagmi/Viem</h4>
                      <p className="text-xs text-muted-foreground">
                        Implementación con hooks de React especializados
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Demo 3: Monero (Simulado) */}
        <TabsContent value="monero" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <MoneroConnector />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Simulación de Monero</CardTitle>
                  <CardDescription>
                    Demostración de integración con blockchain no-EVM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esta demo simula cómo sería una integración con Monero, 
                    una blockchain centrada en la privacidad que usa un protocolo
                    diferente a Ethereum.
                  </p>
                  <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                    <p className="font-medium">Nota:</p>
                    <p>Esta es una simulación para propósitos de demostración. 
                    No se conecta a ninguna red real de Monero.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integraciones No-EVM</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Además de blockchains compatibles con EVM, nuestro sistema
                    está diseñado para soportar otras redes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Monero (XMR)</li>
                    <li>Bitcoin (BTC)</li>
                    <li>Solana (SOL)</li>
                    <li>Polkadot (DOT)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Cada implementación requiere un conector específico para
                    el protocolo de la blockchain correspondiente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-bold mb-3">Documentación Técnica</h2>
        <p className="mb-4">
          Nuestro sistema de conexión de wallets está diseñado para ser modular y extensible,
          permitiendo integrar fácilmente nuevas blockchains y métodos de conexión.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Componentes Principales</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conectores básicos para interacción directa</li>
              <li>Adaptadores específicos para cada blockchain</li>
              <li>Interfaces unificadas para manejo consistente</li>
              <li>Detectores de dispositivo para experiencia optimizada</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Tecnologías Utilizadas</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>ethers.js para interacción con EVM</li>
              <li>WalletConnect v2 para conexión móvil</li>
              <li>Wagmi/Viem para hooks de React</li>
              <li>Adaptadores personalizados para blockchains no-EVM</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/" className="text-primary hover:underline">
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
}