import React, { useState, useEffect } from 'react';

export default function EthereumConnectDemo() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Detectar si es dispositivo móvil
    const checkIfMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobile(checkIfMobile());

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Demo de Conexión Ethereum</h1>
      
      {/* Información de dispositivo */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Información del Dispositivo</h2>
        <p className="mb-1">
          <span className="font-medium">Tipo:</span> {isMobile ? 'Móvil' : 'Escritorio'}
        </p>
        <p>
          <span className="font-medium">MetaMask instalado:</span> {isMetaMaskInstalled ? 'Sí' : 'No'}
        </p>
        
        {!isMetaMaskInstalled && (
          <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            <p>Para usar esta demo necesitas instalar MetaMask.</p>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline mt-1 inline-block"
            >
              Descargar MetaMask
            </a>
          </div>
        )}
      </div>
      
      {/* Conexión wallet */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Wallet Ethereum</h2>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {!account ? (
          <button 
            onClick={connectWallet}
            disabled={!isMetaMaskInstalled}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Conectar Wallet
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 border rounded-md bg-gray-50">
              <p className="mb-1 break-all">
                <span className="font-medium">Dirección:</span>{' '}
                {account}
              </p>
              <p className="mb-1">
                <span className="font-medium">Red:</span>{' '}
                {getNetworkName(chainId)}
              </p>
              <p>
                <span className="font-medium">Balance:</span>{' '}
                {balance} ETH
              </p>
            </div>
            
            <button 
              onClick={() => {
                setAccount(null);
                setChainId(null);
                setBalance(null);
              }}
              className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>
      
      {/* Instrucciones */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">Instrucciones</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Para probar la conexión necesitas tener MetaMask instalado.</li>
          <li>Haz clic en "Conectar Wallet" para iniciar la conexión.</li>
          <li>Puedes cambiar de red en MetaMask para ver cómo se actualiza la información.</li>
          <li>El balance mostrado corresponde a la red actualmente seleccionada.</li>
        </ul>
      </div>
    </div>
  );
}

// Tipado para window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}