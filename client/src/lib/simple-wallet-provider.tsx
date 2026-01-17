import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers, BrowserProvider } from 'ethers';

interface SimpleWalletContextType {
  account: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  showConnectDialog: () => void;
  web3Provider: BrowserProvider | null;
}

const SimpleWalletContext = createContext<SimpleWalletContextType | undefined>(undefined);

export function useSimpleWalletContext() {
  const context = useContext(SimpleWalletContext);
  if (context === undefined) {
    throw new Error('useSimpleWalletContext debe usarse dentro de un SimpleWalletProvider');
  }
  return context;
}

interface SimpleWalletProviderProps {
  children: ReactNode;
}

export function SimpleWalletProvider({ children }: SimpleWalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const [web3Provider, setWeb3Provider] = useState<BrowserProvider | null>(null);

  // Inicializar Web3Modal
  useEffect(() => {
    const newWeb3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions: {}
    });
    setWeb3Modal(newWeb3Modal);

    // Intentar reconectar si hay un proveedor en caché
    if (newWeb3Modal.cachedProvider) {
      console.log("Intentando reconectar automáticamente con", newWeb3Modal.cachedProvider);
      connect();
    }
  }, []);

  // Manejar cambios en la cuenta
  useEffect(() => {
    if (web3Provider && typeof window !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      const handleDisconnect = () => {
        disconnect();
      };

      const ethereum = window.ethereum;
      if (ethereum && ethereum.on) {
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('disconnect', handleDisconnect);

        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('disconnect', handleDisconnect);
          }
        };
      }
    }
  }, [web3Provider, account]);

  const connect = async () => {
    if (!web3Modal) return;
    try {
      setIsConnecting(true);
      console.log("Iniciando conexión de wallet tipo: web3modal");
      const modalProvider = await web3Modal.connect();
      const provider = new BrowserProvider(modalProvider);
      console.log("Proveedor inicializado:", "OK");
      
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        setWeb3Provider(provider);
        console.log("Wallet conectada exitosamente:", {
          address: accounts[0].address,
          chainId: (await provider.getNetwork()).chainId,
          provider: "OK"
        });
      } else {
        console.error("No se encontraron cuentas después de la conexión");
      }
    } catch (error) {
      console.error("Error al conectar wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
    setAccount(null);
    setWeb3Provider(null);
  };

  const showConnectDialog = () => {
    connect();
  };

  const value = {
    account,
    isConnecting,
    connect,
    disconnect,
    showConnectDialog,
    web3Provider
  };

  return (
    <SimpleWalletContext.Provider value={value}>
      {children}
    </SimpleWalletContext.Provider>
  );
}

// Custom hook para usar el contexto de SimpleWallet
export function useSimpleWallet() {
  return useSimpleWalletContext();
}