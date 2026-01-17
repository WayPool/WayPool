import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function WalletConnectorDemo() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };
    
    setIsMobile(checkIfMobile());
  }, []);

  // Detectar MetaMask
  useEffect(() => {
    const checkIfMetaMaskIsInstalled = () => {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        console.log('MetaMask está instalado');
        setIsMetaMaskInstalled(true);
        
        // Agregar listeners para eventos de MetaMask
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('disconnect', handleDisconnect);
      } else {
        console.log('MetaMask no está instalado');
        setIsMetaMaskInstalled(false);
      }
    };
    
    checkIfMetaMaskIsInstalled();
    
    // Limpiar listeners cuando el componente se desmonta
    return () => {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
        ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  // Manejar cambio de cuentas
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // Usuario desconectó la wallet
      handleDisconnect();
    } else {
      setAccount(accounts[0]);
      getBalance(accounts[0]);
    }
  };

  // Manejar cambio de red
  const handleChainChanged = (chainIdHex: string) => {
    const chainIdDecimal = parseInt(chainIdHex, 16).toString();
    setChainId(chainIdDecimal);
  };

  // Manejar desconexión
  const handleDisconnect = () => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
  };

  // Conectar wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('No se detectó MetaMask. Por favor instala la extensión o usa un navegador compatible con Web3.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      // Solicitar acceso a la cuenta
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      // Obtener ID de la red
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainIdHex, 16).toString();
      setChainId(chainIdDecimal);
      
      // Obtener balance
      getBalance(accounts[0]);
    } catch (err: any) {
      console.error('Error al conectar wallet:', err);
      setError(err.message || 'Error al conectar con la wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Obtener balance
  const getBalance = async (address: string) => {
    try {
      if (!window.ethereum) return;
      
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      
      // Convertir de wei a ether
      const etherValue = parseInt(balance, 16) / 1e18;
      setBalance(etherValue.toFixed(4));
    } catch (err: any) {
      console.error('Error al obtener balance:', err);
      setError(err.message || 'Error al obtener el balance');
    }
  };

  // Enviar transacción
  const sendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!window.ethereum || !account) {
      setError('No hay wallet conectada');
      return;
    }
    
    if (!receiverAddress || !amount) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      // Convertir el monto a wei (1 ETH = 10^18 wei)
      const amountWei = `0x${(parseFloat(amount) * 1e18).toString(16)}`;
      
      // Construir la transacción
      const transactionParameters = {
        to: receiverAddress,
        from: account,
        value: amountWei,
        gas: '0x5208', // 21000 gas en hexadecimal
      };
      
      // Enviar la transacción
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      
      console.log('Transacción enviada:', txHash);
      alert(`Transacción enviada: ${txHash}`);
      
      // Actualizar balance
      getBalance(account);
    } catch (err: any) {
      console.error('Error al enviar transacción:', err);
      setError(err.message || 'Error al enviar la transacción');
    } finally {
      setIsConnecting(false);
    }
  };

  // Cambiar de red
  const switchNetwork = async (networkId: string) => {
    if (!window.ethereum) {
      setError('No hay wallet conectada');
      return;
    }
    
    const networkParams: Record<string, any> = {
      '1': {
        chainId: '0x1', // Mainnet
      },
      '5': {
        chainId: '0x5', // Goerli
      },
      '11155111': {
        chainId: '0xaa36a7', // Sepolia
      },
      '137': {
        chainId: '0x89', // Polygon
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      },
      '42161': {
        chainId: '0xa4b1', // Arbitrum
        chainName: 'Arbitrum One',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io/']
      }
    };

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkParams[networkId].chainId }],
      });
    } catch (switchError: any) {
      // Si el error es 4902, la red no existe y hay que agregarla
      if (switchError.code === 4902 && networkId !== '1' && networkId !== '5' && networkId !== '11155111') {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams[networkId]],
          });
        } catch (addError) {
          console.error('Error al agregar red:', addError);
          setError('Error al agregar la red');
        }
      } else {
        console.error('Error al cambiar de red:', switchError);
        setError(switchError.message || 'Error al cambiar de red');
      }
    }
  };

  // Obtener nombre de la red
  const getNetworkName = (id: string | null) => {
    if (!id) return 'Desconocida';
    
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '137': 'Polygon',
      '42161': 'Arbitrum One',
    };
    
    return networks[id] || `Red #${id}`;
  };

  // Formatear dirección
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Demostración de Conexión Web3</h1>
        <p className="text-muted-foreground">
          Conecta tu wallet para interactuar con la blockchain
        </p>
      </div>

      {/* Información de dispositivo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información del Dispositivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Tipo de dispositivo: <strong>{isMobile ? 'Móvil' : 'Escritorio'}</strong></p>
          <p>MetaMask instalado: <strong>{isMetaMaskInstalled ? 'Sí' : 'No'}</strong></p>
          {!isMetaMaskInstalled && (
            <div className="mt-4 bg-yellow-100 text-yellow-800 p-3 rounded-md">
              <p>
                Para usar esta demo, necesitas instalar MetaMask.{' '}
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

      {/* Conectar wallet */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conexión de Wallet</CardTitle>
          <CardDescription>
            {account 
              ? 'Tu wallet está conectada' 
              : 'Conecta tu wallet para interactuar con la blockchain'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {!account ? (
            <Button 
              onClick={connectWallet} 
              disabled={isConnecting || !isMetaMaskInstalled}
              className="w-full"
            >
              {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Dirección:</span>
                  <span className="font-mono">{formatAddress(account)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Red:</span>
                  <span>{getNetworkName(chainId)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Balance:</span>
                  <span>{balance} ETH</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="network-select">Cambiar Red</Label>
                <select
                  id="network-select"
                  className="w-full p-2 border rounded-md mt-1"
                  onChange={(e) => switchNetwork(e.target.value)}
                  value={chainId || '1'}
                >
                  <option value="1">Ethereum Mainnet</option>
                  <option value="5">Goerli Testnet</option>
                  <option value="11155111">Sepolia Testnet</option>
                  <option value="137">Polygon</option>
                  <option value="42161">Arbitrum One</option>
                </select>
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

      {/* Enviar transacción */}
      {account && (
        <Card>
          <CardHeader>
            <CardTitle>Enviar Transacción</CardTitle>
            <CardDescription>
              Envía ETH a otra dirección
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={sendTransaction} className="space-y-4">
              <div>
                <Label htmlFor="receiver-address">Dirección Destinatario</Label>
                <Input 
                  id="receiver-address" 
                  placeholder="0x..." 
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Cantidad (ETH)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  step="0.0001" 
                  min="0.0001" 
                  placeholder="0.01" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Enviando...' : 'Enviar ETH'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Añadir tipado para window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}