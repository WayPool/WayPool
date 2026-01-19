import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function BasicWalletConnector() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('No se detectó MetaMask. Por favor instala la extensión o utiliza un navegador compatible.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      // Solicitar acceso a la cuenta
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      
      const network = await provider.getNetwork();
      setChainId(network.chainId.toString());
      
      // Configurar listeners para eventos
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    } catch (err: any) {
      console.error('Error al conectar wallet:', err);
      setError(err.message || 'Error al conectar con la wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    
    // Eliminar listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // Usuario desconectó su wallet
      disconnectWallet();
    } else {
      // Usuario cambió de cuenta
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainIdHex: string) => {
    // Convertir de hexadecimal a decimal
    const chainIdDecimal = parseInt(chainIdHex, 16).toString();
    setChainId(chainIdDecimal);
  };

  // Función para obtener el nombre de la red según el chainId
  const getNetworkName = (chainId: string | null) => {
    if (!chainId) return 'Desconocida';
    
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '3': 'Ropsten',
      '4': 'Rinkeby',
      '5': 'Goerli',
      '42': 'Kovan',
      '56': 'Binance Smart Chain',
      '137': 'Polygon',
      '43114': 'Avalanche',
      '42161': 'Arbitrum',
      '10': 'Optimism',
      '250': 'Fantom'
    };
    
    return networks[chainId] || `Cadena #${chainId}`;
  };

  // Formatear dirección de wallet para mostrar
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Detectar si hay MetaMask instalado
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask está instalado');
    } else {
      console.log('MetaMask no está instalado');
      setError('No se detectó MetaMask. Por favor instala la extensión o utiliza un navegador compatible.');
    }
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Conexión de Wallet</CardTitle>
        <CardDescription>
          {isMobile() 
            ? "Conecta tu wallet móvil" 
            : "Conecta tu wallet usando MetaMask u otra wallet compatible con Web3"}
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
            className="w-full" 
            disabled={isConnecting}
          >
            {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Dirección:</span>
                <span className="font-mono">{formatAddress(account)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Red:</span>
                <span>{getNetworkName(chainId)}</span>
              </div>
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
  );
}

// Añadir tipado para window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}