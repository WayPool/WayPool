import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function WalletTestPage() {
  return (
    <div className="container mx-auto max-w-4xl my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Test de Conexión de Wallets</h1>
      <p className="text-center text-gray-500 mb-8">Prueba las diferentes opciones de conexión con wallets blockchain</p>
      
      <Tabs defaultValue="ethereum">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
          <TabsTrigger value="monero">Monero (Simulado)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ethereum">
          <EthereumConnector />
        </TabsContent>
        
        <TabsContent value="monero">
          <MoneroSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EthereumConnector() {
  const [hasProvider, setHasProvider] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Detectar si hay un proveedor de Ethereum
    const detectProvider = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        setHasProvider(true);
        
        // Configurar listeners para eventos
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    };
    
    detectProvider();
    
    // Limpiar listeners al desmontar
    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleConnect = async () => {
    if (!hasProvider) {
      setError('No se detectó MetaMask. Por favor instala la extensión o utiliza un navegador compatible.');
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      
      // Solicitar acceso a las cuentas
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      // Obtener información de la red
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainIdHex, 16).toString());
      
      // Obtener el balance
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      
      // Convertir de wei a ether
      const balanceInWei = parseInt(balanceHex, 16);
      const balanceInEth = balanceInWei / 1e18;
      setBalance(balanceInEth.toFixed(4));
    } catch (err: any) {
      console.error('Error al conectar wallet:', err);
      setError(err.message || 'Error al conectar con la wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // El usuario desconectó su wallet
      handleDisconnect();
    } else {
      // El usuario cambió de cuenta
      setAccount(accounts[0]);
      
      // Actualizar el balance para la nueva cuenta
      window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      }).then((balanceHex: string) => {
        const balanceInWei = parseInt(balanceHex, 16);
        const balanceInEth = balanceInWei / 1e18;
        setBalance(balanceInEth.toFixed(4));
      }).catch(console.error);
    }
  };

  const handleChainChanged = (chainIdHex: string) => {
    const chainIdDecimal = parseInt(chainIdHex, 16).toString();
    setChainId(chainIdDecimal);
  };

  const getNetworkName = (chainId: string | null) => {
    if (!chainId) return 'Desconocida';
    
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '137': 'Polygon',
      '80001': 'Mumbai (Polygon Testnet)',
      '42161': 'Arbitrum One',
      '10': 'Optimism',
      '56': 'BNB Smart Chain',
      '8453': 'Base',
      '84531': 'Base Goerli'
    };
    
    return networks[chainId] || `Cadena #${chainId}`;
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Conexión con MetaMask</CardTitle>
          <CardDescription>
            {hasProvider 
              ? 'Conecta tu wallet MetaMask para interactuar con la blockchain' 
              : 'Necesitas instalar MetaMask para usar esta función'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {!hasProvider && (
            <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md">
              <p className="font-medium mb-1">MetaMask no detectado</p>
              <p className="text-sm">
                Para usar esta demo, necesitas instalar la extensión MetaMask. 
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="ml-1 text-blue-600 underline"
                >
                  Descargar MetaMask
                </a>
              </p>
            </div>
          )}
          
          {!account ? (
            <Button 
              onClick={handleConnect} 
              disabled={!hasProvider || isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Dirección:</span>
                  <span className="font-mono">{formatAddress(account)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Red:</span>
                  <span>{getNetworkName(chainId)}</span>
                </div>
                {balance && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Balance:</span>
                    <span>{balance} ETH</span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleDisconnect} 
                variant="outline" 
                className="w-full"
              >
                Desconectar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
          <CardDescription>Detalles sobre la integración con MetaMask</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Estado de conexión</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${hasProvider ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Provider: {hasProvider ? 'Detectado' : 'No detectado'}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${account ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Wallet: {account ? 'Conectada' : 'Desconectada'}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">¿Cómo funciona?</h3>
              <ol className="list-decimal ml-5 text-sm space-y-1">
                <li>La página detecta si tienes MetaMask instalado</li>
                <li>Al conectar, MetaMask solicita permiso</li>
                <li>Una vez aprobado, se obtiene tu dirección y balance</li>
                <li>La conexión persiste hasta que desconectes</li>
                <li>La app detecta cambios de cuenta y de red</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MoneroSimulator() {
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ total: 0, unlocked: 0 });

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulación de conexión con retraso para hacerlo más realista
    setTimeout(() => {
      setConnected(true);
      setAddress('43Scx7Aph8UUiibG8AyZP1QdcXZiHhbJ6AeCSixjKHeSKZVpUyiHDGki5q1BxSfQNin3GZ7cNgc4wUHkS9TNnpYdSUoK1b1');
      setBalance({ 
        total: 2.54,
        unlocked: 1.98
      });
      setIsConnecting(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAddress('');
    setBalance({ total: 0, unlocked: 0 });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Monero Wallet 
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
              Simulación
            </span>
          </CardTitle>
          <CardDescription>
            Simulación de conexión con una wallet de Monero
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Nota:</span> Esta es una simulación con fines de demostración.
              No se conecta a ninguna red real de Monero.
            </p>
          </div>
          
          {!connected ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Conectando...' : 'Simular Conexión'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Dirección:</span>
                  <span className="font-mono text-xs break-all">{address}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Balance Total:</span>
                  <span>{balance.total.toFixed(4)} XMR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Disponible:</span>
                  <span>{balance.unlocked.toFixed(4)} XMR</span>
                </div>
              </div>
              
              <Button 
                onClick={handleDisconnect} 
                variant="outline" 
                className="w-full"
              >
                Desconectar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sobre Monero</CardTitle>
          <CardDescription>La criptomoneda centrada en la privacidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              Monero (XMR) es una criptomoneda que prioriza la privacidad y la fungibilidad.
              A diferencia de Bitcoin, todas las transacciones en Monero ocultan por defecto
              los remitentes, receptores y montos.
            </p>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Tecnologías de privacidad:</h3>
              <ul className="list-disc ml-5 text-sm space-y-1">
                <li><span className="font-medium">Firmas de anillo:</span> Ocultan el origen real de los fondos</li>
                <li><span className="font-medium">RingCT:</span> Encripta los montos de las transacciones</li>
                <li><span className="font-medium">Direcciones ocultas:</span> Genera direcciones únicas por transacción</li>
                <li><span className="font-medium">Bulletproofs:</span> Mejora la eficiencia de las pruebas de rango</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Implementación real:</h3>
              <p className="text-sm">
                Una integración real con Monero requeriría ejecutar un nodo de Monero
                o conectarse a un nodo remoto a través de RPC, utilizando bibliotecas
                como monero-javascript o monero-ts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Tipo global para window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}