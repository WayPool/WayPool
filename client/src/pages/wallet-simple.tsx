import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WalletSimple() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Demostración de Wallet</h1>
      <p className="text-center text-muted-foreground mb-8">
        Conecta y prueba diferentes tipos de wallets
      </p>

      <Tabs defaultValue="metamask" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metamask">MetaMask</TabsTrigger>
          <TabsTrigger value="simulado">Monero (Simulado)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metamask" className="mt-6">
          <MetaMaskConnector />
        </TabsContent>
        
        <TabsContent value="simulado" className="mt-6">
          <MoneroSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Conector para MetaMask
function MetaMaskConnector() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si MetaMask está instalado al cargar
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window.ethereum !== 'undefined') {
        setIsMetaMaskInstalled(true);
        
        // Configurar listeners de eventos
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('disconnect', handleDisconnect);
      }
    };
    
    checkMetaMask();
    
    return () => {
      // Limpiar listeners al desmontar
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
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
    // Convertir de hexadecimal a decimal
    const chainIdDecimal = parseInt(chainIdHex, 16).toString();
    setChainId(chainIdDecimal);
    
    // Actualizar el balance al cambiar la red
    if (account) {
      fetchBalance(account);
    }
  };

  // Manejar la desconexión
  const handleDisconnect = () => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
  };

  // Conectar wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask no está instalado. Por favor instálalo para continuar.');
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      
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
  const disconnectWallet = () => {
    handleDisconnect();
  };

  // Obtener nombre de la red
  const getNetworkName = (chainId: string | null) => {
    if (!chainId) return 'Desconocida';
    
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '137': 'Polygon Mainnet',
      '80001': 'Mumbai (Polygon Testnet)',
      '42161': 'Arbitrum One',
      '421613': 'Arbitrum Goerli',
      '10': 'Optimism',
      '8453': 'Base',
      '84531': 'Base Goerli',
      '56': 'BNB Smart Chain'
    };
    
    return networks[chainId] || `Red #${chainId}`;
  };

  // Formatear dirección
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Conectar con MetaMask</CardTitle>
          <CardDescription>
            {isMetaMaskInstalled 
              ? 'Usa tu wallet de MetaMask para conectarte' 
              : 'Necesitas instalar MetaMask para usar esta demo'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!isMetaMaskInstalled && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              <p className="text-sm">
                MetaMask no está instalado. Para continuar:
              </p>
              <ol className="list-decimal ml-4 mt-2 text-sm">
                <li>Instala la extensión de MetaMask desde <a href="https://metamask.io/download/" target="_blank" rel="noreferrer" className="text-blue-600 underline">metamask.io</a></li>
                <li>Crea o importa una wallet</li>
                <li>Recarga esta página</li>
              </ol>
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
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Dirección:</span>
                  <span className="font-mono">{formatAddress(account)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Red:</span>
                  <span>{getNetworkName(chainId)}</span>
                </div>
                {balance && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance:</span>
                    <span>{balance} ETH</span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={disconnectWallet}
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
          <CardDescription>Detalles sobre la conexión MetaMask</CardDescription>
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
            
            <div>
              <h3 className="text-sm font-medium mb-2">Compatibilidad</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isMetaMaskInstalled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isMetaMaskInstalled ? 'MetaMask detectado' : 'MetaMask no detectado'}</span>
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Funcionalidades</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Conexión segura con tu wallet</li>
                <li>Visualización de dirección y balance</li>
                <li>Detección automática de red</li>
                <li>Actualización en tiempo real al cambiar de cuenta</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Simulador de Monero (no es un conector real)
function MoneroSimulator() {
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ total: 0, unlocked: 0 });

  const connectMonero = async () => {
    setIsLoading(true);
    
    // Simulamos una conexión con delay para hacerlo más realista
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

  const disconnectMonero = () => {
    setConnected(false);
    setAddress('');
    setBalance({ total: 0, unlocked: 0 });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monero Wallet <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Simulado</span></CardTitle>
          <CardDescription>
            Simulación de conexión con una wallet de Monero (XMR)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md">
            <p className="text-sm font-medium">Importante:</p>
            <p className="text-sm">
              Esta es una simulación y no se conecta a ninguna red real de Monero.
              Los datos mostrados son ficticios para fines de demostración.
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
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Dirección:</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">{address}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance Total:</span>
                    <span>{balance.total.toFixed(4)} XMR</span>
                  </div>
                  <div className="flex justify-between items-center">
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
          La integración real con Monero requeriría utilizar monero-wallet-rpc o una biblioteca similar.
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acerca de Monero</CardTitle>
          <CardDescription>Información sobre la criptomoneda enfocada en privacidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              Monero (XMR) es una criptomoneda enfocada en la privacidad que oculta los detalles de las transacciones,
              incluyendo remitentes, destinatarios y montos. Utiliza técnicas avanzadas de criptografía para garantizar la privacidad.
            </p>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Características principales:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Transacciones privadas por defecto</li>
                <li>Firmas de anillo para ocultar remitentes</li>
                <li>RingCT para ocultar montos</li>
                <li>Direcciones ocultas para receptores</li>
                <li>Blockchain no rastreable</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Demostración técnica:</h3>
              <p className="text-sm">
                Esta simulación muestra cómo sería la integración con la red Monero.
                En una implementación real, se conectaría a un nodo Monero a través de RPC
                o utilizando bibliotecas como monero-javascript.
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