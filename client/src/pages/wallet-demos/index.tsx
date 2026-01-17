import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

/**
 * Página principal para las demostraciones de wallet
 * Esta versión simple está diseñada para tener mínimas dependencias
 */
export default function WalletDemosPage() {
  return (
    <div className="container mx-auto my-10 px-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Demostraciones de Wallet</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Ejemplos de integración con diferentes tipos de wallets blockchain
        </p>
      </div>

      <Tabs defaultValue="ethereum" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
          <TabsTrigger value="monero">Monero (simulado)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ethereum">
          <EthereumWalletDemo />
        </TabsContent>
        
        <TabsContent value="monero">
          <MoneroWalletDemo />
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Documentación Técnica</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Integración de Wallets</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nuestro sistema proporciona una arquitectura flexible para integrar diferentes tipos de wallets blockchain, permitiendo una experiencia consistente independientemente del protocolo subyacente.
            </p>
            <h4 className="font-medium mb-1">Características principales:</h4>
            <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
              <li>Detección automática de dispositivo</li>
              <li>Adaptación según tipo de navegador</li>
              <li>Soporte para extensiones y wallets móviles</li>
              <li>Manejo de múltiples cadenas</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Tecnologías Utilizadas</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="font-medium mb-1">Ethereum</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Provider Web3</li>
                  <li>ethers.js</li>
                  <li>WalletConnect</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <h4 className="font-medium mb-1">Otras cadenas</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Adaptadores personalizados</li>
                  <li>APIs de Monero (simuladas)</li>
                  <li>RPC customizados</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para la demostración de wallet Ethereum
 */
function EthereumWalletDemo() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  // Comprobar si MetaMask está instalado
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        setIsMetaMaskInstalled(true);
        
        // Configurar listeners de eventos
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    };
    
    checkMetaMask();
    
    // Limpiar listeners al desmontar
    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Manejar cambio de cuenta
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // Usuario desconectó su wallet
      handleDisconnect();
    } else {
      // Usuario cambió su cuenta activa
      setAccount(accounts[0]);
      fetchBalance(accounts[0]);
    }
  };

  // Manejar cambio de red
  const handleChainChanged = (chainIdHex: string) => {
    const chainIdDecimal = parseInt(chainIdHex, 16).toString();
    setChainId(chainIdDecimal);
    
    // Actualizar el balance al cambiar la red
    if (account) {
      fetchBalance(account);
    }
  };

  // Conectar wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask no está instalado. Por favor instala la extensión para continuar.');
      return;
    }
    
    try {
      setIsConnecting(true);
      setError('');
      
      // Solicitar conexión a MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      // Obtener la red actual
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainIdHex, 16).toString());
      
      // Obtener el balance
      fetchBalance(accounts[0]);
    } catch (err: any) {
      console.error('Error al conectar wallet:', err);
      setError(err.message || 'Error al conectar con MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  // Obtener balance de ETH
  const fetchBalance = async (address: string) => {
    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      // Convertir de wei a ether
      const balanceInWei = parseInt(balanceHex, 16);
      const balanceInEth = balanceInWei / 1e18;
      setBalance(balanceInEth.toFixed(4));
    } catch (err) {
      console.error('Error al obtener balance:', err);
    }
  };

  // Desconectar wallet
  const handleDisconnect = () => {
    setAccount('');
    setChainId('');
    setBalance('');
  };

  // Obtener nombre de la red
  const getNetworkName = (chainId: string) => {
    if (!chainId) return 'Desconocida';
    
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '137': 'Polygon Mainnet',
      '80001': 'Mumbai (Polygon Testnet)',
      '42161': 'Arbitrum One',
      '10': 'Optimism',
      '56': 'BNB Smart Chain'
    };
    
    return networks[chainId] || `Red #${chainId}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Conectar con MetaMask</CardTitle>
          <CardDescription>
            Interactúa directamente con el proveedor de Ethereum
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!isMetaMaskInstalled && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">MetaMask no detectado</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-500">
                Para usar esta demo, necesitas instalar la extensión MetaMask.
                <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 ml-1 underline">
                  Descargar MetaMask
                </a>
              </p>
            </div>
          )}
          
          {!account ? (
            <Button 
              onClick={connectWallet} 
              disabled={!isMetaMaskInstalled || isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Conectando...' : 'Conectar con MetaMask'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Dirección:</span>
                    <span className="font-mono">
                      {account.substring(0, 6)}...{account.substring(account.length - 4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Red:</span>
                    <span>{getNetworkName(chainId)}</span>
                  </div>
                  {balance && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Balance:</span>
                      <span>{balance} ETH</span>
                    </div>
                  )}
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
        <CardFooter className="text-xs text-muted-foreground">
          Esta demo utiliza la API estándar de Ethereum Provider
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Integración</CardTitle>
          <CardDescription>
            Cómo funciona la conexión con wallets Ethereum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Estado de conexión</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${account ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{account ? 'Conectado' : 'Desconectado'}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Funcionamiento</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                <li>La aplicación detecta el provider de Ethereum (window.ethereum)</li>
                <li>Al conectar, se solicita acceso mediante eth_requestAccounts</li>
                <li>Se obtiene la dirección del usuario y la red actual</li>
                <li>Se configuran listeners para reaccionar a cambios de cuenta o red</li>
                <li>La información se actualiza en tiempo real</li>
              </ol>
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Compatibilidad</h3>
              <p className="text-sm">
                Esta demo es compatible con cualquier wallet que implemente la EIP-1193, incluyendo
                MetaMask, Brave Wallet, Coinbase Wallet y otras extensiones de navegador.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Componente para la demostración de wallet Monero (simulado)
 */
function MoneroWalletDemo() {
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ total: 0, unlocked: 0 });

  // Simular conexión con Monero
  const connectMonero = () => {
    setIsLoading(true);
    
    // Simulamos la conexión con un pequeño delay para hacerlo más realista
    setTimeout(() => {
      setConnected(true);
      setAddress('43Scx7Aph8UUiibG8AyZP1QdcXZiHhbJ6AeCSixjKHeSKZVpUyiHDGki5q1BxSfQNin3GZ7cNgc4wUHkS9TNnpYdSUoK1b1');
      setBalance({
        total: 2.342,
        unlocked: 1.897
      });
      setIsLoading(false);
    }, 1000);
  };

  // Desconectar
  const disconnectMonero = () => {
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
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-0.5 rounded-full">
              Simulado
            </span>
          </CardTitle>
          <CardDescription>
            Demostración de integración con Monero (XMR)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md text-blue-800 dark:text-blue-300">
            <p className="text-sm">
              <span className="font-medium">Importante:</span> Esta es una simulación con fines de demostración. 
              No se conecta a ninguna red real de Monero.
            </p>
          </div>
          
          {!connected ? (
            <Button 
              onClick={connectMonero}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Conectando...' : 'Simular Conexión Monero'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <div className="grid gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground mb-1">Dirección:</span>
                    <span className="font-mono text-xs break-all">
                      {address}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Balance Total:</span>
                    <span>{balance.total.toFixed(4)} XMR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Disponible:</span>
                    <span>{balance.unlocked.toFixed(4)} XMR</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={disconnectMonero}
                variant="outline"
                className="w-full"
              >
                Desconectar
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          En una implementación real, se utilizaría una biblioteca como monero-javascript
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acerca de Monero</CardTitle>
          <CardDescription>
            Criptomoneda centrada en la privacidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              Monero (XMR) es una criptomoneda que prioriza la privacidad, el anonimato y la fungibilidad.
              A diferencia de Bitcoin, todas las transacciones en Monero ocultan automáticamente los remitentes,
              receptores y montos de las transacciones.
            </p>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Tecnologías de Privacidad:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <span className="font-medium">Firmas de anillo:</span> Oculta el remitente entre un grupo de posibles participantes
                </li>
                <li>
                  <span className="font-medium">RingCT:</span> Oculta los montos de las transacciones
                </li>
                <li>
                  <span className="font-medium">Direcciones ocultas:</span> Genera direcciones únicas para cada transacción
                </li>
                <li>
                  <span className="font-medium">Bulletproofs:</span> Optimiza el tamaño de las pruebas de rango para mayor eficiencia
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Integración Técnica:</h3>
              <p className="text-sm">
                Una integración real con Monero requeriría ejecutar un nodo Monero o
                conectarse a un nodo remoto a través de RPC, utilizando bibliotecas como 
                monero-javascript o implementaciones nativas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Definición para window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}