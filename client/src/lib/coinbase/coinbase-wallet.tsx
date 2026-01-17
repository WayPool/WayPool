import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatEther, JsonRpcProvider, getAddress } from 'ethers';

// Interfaz para el contexto
interface CoinbaseWalletContextType {
  address: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
  balance: string | null;
  checkBalance: () => Promise<string>;
  network: string | null;
}

// Crear el contexto
const CoinbaseWalletContext = createContext<CoinbaseWalletContextType | null>(null);

// Hook para usar el contexto
export function useCoinbaseWallet() {
  const context = useContext(CoinbaseWalletContext);
  if (!context) {
    throw new Error('useCoinbaseWallet debe usarse dentro de un CoinbaseWalletProvider');
  }
  return context;
}

// Obtener el proveedor de Ethereum
const getEthereumProvider = () => {
  const ethereum = window.ethereum;
  
  // Verificar si hay un proveedor disponible
  if (!ethereum) {
    console.warn('No se encontró ningún proveedor de wallet');
    return null;
  }
  
  console.log('Proveedor de wallet encontrado');
  return ethereum;
};

// Detectar el nombre de la red según el chainId
const getNetworkName = (chainId: string): string => {
  switch (chainId) {
    case '0x1':
      return 'Ethereum Mainnet';
    case '0x5':
      return 'Goerli Testnet';
    case '0x89':
      return 'Polygon Mainnet';
    case '0x13881':
      return 'Mumbai Testnet';
    default:
      return `Red desconocida (${chainId})`;
  }
};

// Provider component
export function CoinbaseWalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  // Efecto para verificar la conexión existente al cargar
  useEffect(() => {
    // Función para restaurar la sesión
    const restoreSession = async () => {
      const ethereum = getEthereumProvider();
      
      // Si no hay proveedor o el usuario no ha guardado su preferencia, salir
      if (!ethereum || !localStorage.getItem('coinbase_wallet_connected')) {
        return;
      }
      
      try {
        // Intentar obtener las cuentas sin solicitar (esto no mostrará una ventana emergente)
        const accounts = await ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          
          // Obtener información de la red
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          setNetwork(getNetworkName(chainId));
          
          // Verificar el saldo
          checkBalance();
        }
      } catch (error) {
        console.error('Error al restaurar la sesión:', error);
      }
    };
    
    restoreSession();
    setupEventListeners();
    
    // Limpiar los event listeners al desmontar
    return () => cleanupEventListeners();
  }, []);
  
  // Configurar los listeners de eventos
  const setupEventListeners = () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) return;
    
    // Escuchar cambios de cuenta
    ethereum.on('accountsChanged', handleAccountsChanged);
    
    // Escuchar cambios de red
    ethereum.on('chainChanged', handleChainChanged);
    
    // Escuchar desconexión
    ethereum.on('disconnect', handleDisconnect);
  };
  
  // Limpiar los listeners de eventos
  const cleanupEventListeners = () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) return;
    
    ethereum.removeListener('accountsChanged', handleAccountsChanged);
    ethereum.removeListener('chainChanged', handleChainChanged);
    ethereum.removeListener('disconnect', handleDisconnect);
  };
  
  // Manejar cambios de cuenta
  const handleAccountsChanged = (accounts: string[]) => {
    console.log('Cuentas cambiadas:', accounts);
    
    if (accounts.length === 0) {
      // El usuario desconectó su wallet desde la extensión
      disconnectWallet();
    } else {
      // El usuario cambió a otra cuenta
      setAddress(accounts[0]);
      checkBalance();
      
      toast({
        title: 'Cuenta cambiada',
        description: `Ahora estás conectado con: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      });
    }
  };
  
  // Manejar cambios de red
  const handleChainChanged = (chainId: string) => {
    console.log('Red cambiada:', chainId);
    setNetwork(getNetworkName(chainId));
    
    toast({
      title: 'Red cambiada',
      description: `Ahora estás conectado a: ${getNetworkName(chainId)}`,
    });
    
    // Es buena práctica recargar la página cuando cambia la red
    // window.location.reload();
  };
  
  // Manejar desconexión
  const handleDisconnect = (error: { code: number; message: string }) => {
    console.log('Desconexión:', error);
    disconnectWallet();
  };

  // Función para conectar wallet
  const connectWallet = async (): Promise<boolean> => {
    if (isConnecting) return false;
    
    setIsConnecting(true);
    setError(null);
    
    const ethereum = getEthereumProvider();
    
    if (!ethereum) {
      setError('Coinbase Wallet no está instalado. Por favor, instala la extensión de Coinbase Wallet.');
      setIsConnecting(false);
      
      toast({
        title: 'Wallet no disponible',
        description: 'Coinbase Wallet no está instalado. Por favor, instala la extensión de Coinbase Wallet.',
        variant: 'destructive',
      });
      
      // Abre el sitio web de Coinbase Wallet para que el usuario pueda instalarlo
      window.open('https://www.coinbase.com/wallet/downloads', '_blank');
      
      return false;
    }
    
    // Comprobamos si es realmente Coinbase Wallet
    const isCoinbaseProvider = 
      ethereum.isCoinbaseWallet || 
      window.coinbaseWalletExtension || 
      (ethereum.providers && ethereum.providers.some((p: any) => p.isCoinbaseWallet));
    
    if (!isCoinbaseProvider) {
      setError('Por favor, usa la extensión de Coinbase Wallet para esta conexión. Si tienes múltiples wallets, selecciona Coinbase Wallet.');
      setIsConnecting(false);
      
      toast({
        title: 'Wallet incorrecta',
        description: 'Esta opción es específica para Coinbase Wallet. Por favor, usa la extensión de Coinbase Wallet.',
        variant: 'destructive',
      });
      
      return false;
    }
    
    try {
      // Solicitar acceso a la cuenta
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        const userAddress = accounts[0];
        setAddress(userAddress);
        setIsConnected(true);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('coinbase_wallet_connected', 'true');
        
        // Obtener información de la red
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        setNetwork(getNetworkName(chainId));
        
        // Verificar el saldo
        setTimeout(() => {
          checkBalance().then((balance) => {
            toast({
              title: 'Wallet conectada',
              description: `Conectado con: ${userAddress.substring(0, 6)}...${userAddress.substring(38)} | Saldo: ${parseFloat(balance).toFixed(4)} ETH`,
            });
          });
        }, 500);
        
        return true;
      } else {
        throw new Error('No se pudo obtener la dirección de la wallet');
      }
    } catch (error: any) {
      console.error('Error al conectar wallet:', error);
      setError(error.message || 'Error al conectar la wallet');
      
      toast({
        title: 'Error de conexión',
        description: error.message || 'No se pudo conectar la wallet',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Función para desconectar wallet
  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(null);
    setNetwork(null);
    
    // Eliminar flag de conexión
    localStorage.removeItem('coinbase_wallet_connected');
    
    toast({
      title: 'Wallet desconectada',
      description: 'Tu wallet ha sido desconectada correctamente',
    });
  };

  // Función para verificar el saldo
  const checkBalance = async (): Promise<string> => {
    if (!address) return '0';
    
    try {
      const ethereum = getEthereumProvider();
      
      if (!ethereum) {
        throw new Error('No hay un proveedor de Ethereum disponible');
      }
      
      // Solicitar saldo mediante eth_getBalance
      const balanceHex = await ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      
      // Convertir de hexadecimal a decimal
      const balanceWei = parseInt(balanceHex, 16).toString();
      
      // Convertir de Wei a Ether
      const balanceEth = formatEther(balanceWei);
      
      // Actualizar estado
      setBalance(balanceEth);
      
      console.log(`Saldo consultado: ${balanceEth} ETH`);
      return balanceEth;
    } catch (error: any) {
      console.error('Error al verificar saldo:', error);
      
      toast({
        title: 'Error al verificar saldo',
        description: error.message || 'No se pudo obtener el saldo de la wallet',
        variant: 'destructive',
      });
      
      return '0';
    }
  };

  // Context value
  const value: CoinbaseWalletContextType = {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
    balance,
    checkBalance,
    network,
  };

  return (
    <CoinbaseWalletContext.Provider value={value}>
      {children}
    </CoinbaseWalletContext.Provider>
  );
}

// Necesario para TypeScript
declare global {
  interface Window {
    ethereum?: any;
    coinbaseWalletExtension?: any;
  }
}