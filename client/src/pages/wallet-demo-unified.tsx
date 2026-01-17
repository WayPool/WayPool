import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Componente de Ethereum básico
function EthereumBasicDemo() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si MetaMask está instalado
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true);
      
      // Configurar listeners para eventos de MetaMask
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup de listeners
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setBalance(null);
    } else {
      setAccount(accounts[0]);
      fetchBalance(accounts[0]);
    }
  };

  const handleChainChanged = (chainIdHex: string) => {
    const chainIdDecimal = parseInt(chainIdHex, 16).toString();
    setChainId(chainIdDecimal);
    if (account) {
      fetchBalance(account);
    }
  };

  const connectWallet = async () => {
    setError(null);
    
    if (typeof window.ethereum === 'undefined') {
      setError('No se detectó MetaMask. Por favor instala la extensión o utiliza un navegador compatible con Web3.');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainIdHex, 16).toString());
      
      fetchBalance(accounts[0]);
    } catch (err: any) {
      console.error('Error al conectar wallet:', err);
      setError(err.message || 'Error desconocido al conectar wallet');
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      // Convertir de wei a ether (1 ether = 10^18 wei)
      const etherValue = parseInt(balanceHex, 16) / 1e18;
      setBalance(etherValue.toFixed(4));
    } catch (err: any) {
      console.error('Error al obtener balance:', err);
    }
  };

  const getNetworkName = (chainId: string | null) => {
    if (!chainId) return 'Desconocida';
    
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '137': 'Polygon Mainnet',
      '80001': 'Mumbai (Polygon Testnet)',
      '42161': 'Arbitrum One',
      '421613': 'Arbitrum Goerli Testnet',
    };
    
    return networks[chainId] || `Red #${chainId}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      {/* Información de dispositivo */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="mb-2">
            <span className="font-medium">MetaMask instalado:</span> {isMetaMaskInstalled ? 'Sí' : 'No'}
          </p>
          
          {!isMetaMaskInstalled && (
            <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              <p>
                Para usar esta demo necesitas instalar MetaMask.{' '}
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline"
                >
                  Descargar MetaMask
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conexión wallet */}
      <Card>
        <CardHeader>
          <CardTitle>Conectar Wallet</CardTitle>
          <CardDescription>
            {account 
              ? 'Tu wallet está conectada' 
              : 'Conecta tu wallet para interactuar con la blockchain'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {!account ? (
            <Button 
              onClick={connectWallet}
              disabled={!isMetaMaskInstalled}
              className="w-full"
            >
              Conectar Wallet
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Dirección:</span>
                  <span className="font-mono">{formatAddress(account)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Red:</span>
                  <span>{getNetworkName(chainId)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Balance:</span>
                  <span>{balance} ETH</span>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  setAccount(null);
                  setChainId(null);
                  setBalance(null);
                }}
                variant="outline"
                className="w-full"
              >
                Desconectar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Simulación del componente MoneroConnector
function MoneroSimulatorDemo() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ total: 0, unlocked: 0 });

  const handleConnect = () => {
    // Simulamos la conexión con una wallet de Monero
    setConnected(true);
    setAddress('43TH7ogTXBbZjmS4Ww8a91PxqaEHCKqQMVc8QYcfbCH5F4');
    setBalance({ total: 2.5, unlocked: 1.8 });
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAddress('');
    setBalance({ total: 0, unlocked: 0 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monero Connector <span className="text-xs bg-yellow-100 text-yellow-800 p-1 rounded ml-2">Simulación</span></CardTitle>
        <CardDescription>Simulación de conexión a wallet Monero</CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div>
            <p className="mb-4 text-gray-600">Esta es una simulación de conexión a Monero. No se conecta a ninguna red real.</p>
            <Button 
              onClick={handleConnect}
              className="w-full"
            >
              Simular Conexión Monero
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="flex justify-between mb-2">
                <span className="font-medium">Dirección:</span>
                <span className="font-mono text-sm">{address.substring(0, 16)}...</span>
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
            
            <Button 
              onClick={handleDisconnect}
              variant="destructive"
              className="w-full"
            >
              Desconectar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente principal unificado
export default function WalletDemoUnified() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-4">Demostración de Wallets Blockchain</h1>
      <p className="text-center text-muted-foreground mb-8">
        Prueba diferentes métodos de conexión con wallets de criptomonedas
      </p>

      <Tabs defaultValue="ethereum" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
          <TabsTrigger value="monero">Monero (Simulado)</TabsTrigger>
        </TabsList>

        <TabsContent value="ethereum" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <EthereumBasicDemo />
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conexión Ethereum</CardTitle>
                  <CardDescription>
                    Integración con MetaMask y providers Web3
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esta demostración utiliza la API de Ethereum para conectar directamente
                    con tu wallet y mostrar información básica de la cuenta.
                  </p>
                  <h4 className="font-medium mb-2">Características:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Conexión directa con MetaMask</li>
                    <li>Detección de eventos de cambio de cuenta</li>
                    <li>Visualización de balance y dirección</li>
                    <li>Identificación automática de red</li>
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

        <TabsContent value="monero" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <MoneroSimulatorDemo />
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monero (Simulado)</CardTitle>
                  <CardDescription>
                    Simulación de integración con blockchain no-EVM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esta simulación muestra cómo sería la integración con Monero,
                    una blockchain centrada en la privacidad con protocolo diferente a Ethereum.
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
                  <CardTitle>Integraciones Multi-Blockchain</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nuestro sistema es capaz de integrar múltiples blockchains:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Ethereum y blockchains compatibles con EVM</li>
                    <li>Monero (XMR)</li>
                    <li>Bitcoin (BTC)</li>
                    <li>Solana (SOL)</li>
                  </ul>
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
    </div>
  );
}

// Añadir tipado para window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}