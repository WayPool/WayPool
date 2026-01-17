import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { APP_NAME } from '@/utils/app-config';

// Interfaz del contexto
interface CoinbaseWalletQRContextType {
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
const CoinbaseWalletQRContext = createContext<CoinbaseWalletQRContextType | null>(null);

// Hook para usar el contexto
export function useCoinbaseWalletQR() {
  const context = useContext(CoinbaseWalletQRContext);
  if (!context) {
    throw new Error('useCoinbaseWalletQR debe ser usado dentro de un CoinbaseWalletQRProvider');
  }
  return context;
}

// Componente proveedor que envuelve la app
export function CoinbaseWalletQRProvider({ children }: { children: ReactNode }) {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const [provider, setProvider] = useState<ethers.ethers.providers.Web3Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const { toast } = useToast();

  // Inicializa Web3Modal al cargar el componente
  useEffect(() => {
    const initWeb3Modal = async () => {
      try {
        const web3ModalInstance = new Web3Modal({
          network: "mainnet",
          cacheProvider: true,
          providerOptions: {
            // Configuración específica para Coinbase Wallet
            walletlink: {
              package: (window as any).CoinbaseWalletSDK || {}, 
              options: {
                appName: APP_NAME,
                infuraId: process.env.INFURA_API_KEY || "9aa3d95b3bc440fa88ea12eaa4456161", // Fallback a ID público
                rpc: "",
                chainId: 1,
                appLogoUrl: null,
                darkMode: false
              }
            }
          }
        });
        
        setWeb3Modal(web3ModalInstance);
        
        // Reconectar automáticamente si hay un proveedor en caché
        if (web3ModalInstance.cachedProvider) {
          try {
            await connectToProvider(web3ModalInstance);
          } catch (err) {
            console.error("Error reconectando al proveedor en caché:", err);
            // Limpiar caché si hay error al reconectar
            web3ModalInstance.clearCachedProvider();
          }
        }
      } catch (error) {
        console.error("Error inicializando Web3Modal:", error);
        setError("Error inicializando el conector de wallet.");
      }
    };

    initWeb3Modal();
    
    // Limpieza al desmontar
    return () => {
      if (provider) {
        const ethersProvider = provider as providers.Web3Provider;
        const ethereum = ethersProvider.provider as any;
        
        // Limpiar listeners
        if (ethereum && ethereum.removeAllListeners) {
          ethereum.removeAllListeners('accountsChanged');
          ethereum.removeAllListeners('chainChanged');
          ethereum.removeAllListeners('disconnect');
        }
      }
    };
  }, []);

  // Función para conectar al proveedor
  const connectToProvider = async (modal: Web3Modal) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Mostrar modal de selección de wallet
      const connection = await modal.connect();
      
      // Crear provider de ethers
      const ethersProvider = new providers.Web3Provider(connection);
      setProvider(ethersProvider);
      
      // Obtener dirección
      const accounts = await ethersProvider.listAccounts();
      if (accounts.length === 0) {
        throw new Error("No se encontraron cuentas disponibles");
      }
      
      const userAddress = accounts[0];
      setAddress(userAddress);
      setIsConnected(true);
      
      // Obtener red
      const network = await ethersProvider.getNetwork();
      setNetwork(network.name);
      
      // Obtener balance
      await checkBalanceInternal(ethersProvider, userAddress);
      
      // Configurar listeners para eventos
      const ethereum = connection;
      if (ethereum.on) {
        ethereum.on('accountsChanged', (newAccounts: string[]) => {
          if (newAccounts.length === 0) {
            // Desconectado
            disconnectWallet();
          } else {
            // Cambio de cuenta
            setAddress(newAccounts[0]);
            checkBalanceInternal(ethersProvider, newAccounts[0]);
          }
        });
        
        ethereum.on('chainChanged', () => {
          // Recargar cuando cambie la cadena
          window.location.reload();
        });
        
        ethereum.on('disconnect', () => {
          disconnectWallet();
        });
      }
      
      return true;
    } catch (err: any) {
      console.error("Error conectando wallet:", err);
      setError(err.message || "Error desconocido al conectar");
      setIsConnected(false);
      setAddress(null);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Función para consultar el balance
  const checkBalanceInternal = async (
    ethersProvider: providers.Web3Provider,
    walletAddress: string
  ) => {
    try {
      const balanceWei = await ethersProvider.getBalance(walletAddress);
      const balanceEth = providers.formatEther(balanceWei);
      setBalance(balanceEth);
      return balanceEth;
    } catch (err: any) {
      console.error("Error obteniendo balance:", err);
      setError(err.message || "Error consultando balance");
      setBalance(null);
      return "0";
    }
  };

  // Función pública para conectar wallet
  const connectWallet = async (): Promise<boolean> => {
    if (!web3Modal) {
      setError("El conector de wallet no está disponible");
      return false;
    }
    
    return connectToProvider(web3Modal);
  };

  // Función para desconectar wallet
  const disconnectWallet = () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
    
    setProvider(null);
    setAddress(null);
    setIsConnected(false);
    setBalance(null);
    setNetwork(null);
    setError(null);
    
    // Si estamos en un navegador, recarga para limpiar todo
    if (typeof window !== 'undefined') {
      // No recargamos para evitar perder el estado
      // window.location.reload();
    }
  };

  // Función pública para consultar balance
  const checkBalance = async (): Promise<string> => {
    if (!provider || !address) {
      setError("No hay wallet conectada para consultar balance");
      return "0";
    }
    
    return checkBalanceInternal(provider, address);
  };

  // Objeto con los valores del contexto
  const value: CoinbaseWalletQRContextType = {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
    balance,
    checkBalance,
    network
  };

  return (
    <CoinbaseWalletQRContext.Provider value={value}>
      {children}
    </CoinbaseWalletQRContext.Provider>
  );
}