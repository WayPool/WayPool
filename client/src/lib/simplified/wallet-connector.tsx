import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { BrowserProvider, Signer } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { NETWORKS, Network } from '@/lib/constants';

// Tipos de wallet soportados
export enum WalletType {
  METAMASK = 'metamask',
  ADMIN = 'admin' // Wallet del admin para simulación
}

// Interface para el contexto
interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  network: Network | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  connectWallet: (walletType: WalletType) => Promise<boolean>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
}

// Crear el contexto
const WalletContext = createContext<WalletContextType | null>(null);

// Hook para usar el contexto
export function useSimpleWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useSimpleWallet debe usarse dentro de un SimpleWalletProvider');
  }
  return context;
}

// Provider component
export function SimpleWalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Actualizar información de red cuando cambia el chainId
  useEffect(() => {
    if (chainId) {
      const networkInfo = Object.values(NETWORKS).find(
        (n) => n.chainId === chainId
      );
      setNetwork(networkInfo || null);
    } else {
      setNetwork(null);
    }
  }, [chainId]);

  // Efecto para recuperar la conexión guardada
  useEffect(() => {
    const savedWalletType = localStorage.getItem('walletType');
    if (savedWalletType) {
      connectWallet(savedWalletType as WalletType);
    }
  }, []);

  // Conectar wallet
  const connectWallet = async (walletType: WalletType): Promise<boolean> => {
    if (isConnecting) return false;

    try {
      setIsConnecting(true);
      setError(null);
      console.log(`Conectando wallet: ${walletType}`);

      // Si es la wallet del admin, simular conexión
      if (walletType === WalletType.ADMIN) {
        // Wallet del administrador para pruebas
        const adminAddress = '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F';
        
        setAddress(adminAddress);
        setChainId(1); // Ethereum Mainnet
        setIsConnected(true);
        
        // Guardar tipo de wallet
        localStorage.setItem('walletType', walletType);
        
        toast({
          title: 'Wallet conectada',
          description: `Conectado como administrador: ${adminAddress.substring(0, 6)}...${adminAddress.substring(38)}`,
        });
        
        return true;
      }
      
      // Conectar con MetaMask
      if (walletType === WalletType.METAMASK) {
        // Verificar si MetaMask está instalado
        if (typeof window === 'undefined' || !window.ethereum) {
          throw new Error('MetaMask no está instalado');
        }
        
        // Solicitar cuentas
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
          throw new Error('No se autorizó el acceso a MetaMask');
        }
        
        // Obtener dirección y chainId
        const userAddress = accounts[0];
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const userChainId = parseInt(chainIdHex, 16);
        
        // Crear provider y signer
        const ethersProvider = new BrowserProvider(window.ethereum);
        const ethersSigner = await ethersProvider.getSigner();
        
        // Actualizar estado
        setAddress(userAddress);
        setChainId(userChainId);
        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setIsConnected(true);
        
        // Guardar tipo de wallet
        localStorage.setItem('walletType', walletType);
        
        // Configurar event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('disconnect', handleDisconnect);
        
        toast({
          title: 'Wallet conectada',
          description: `Conectado con MetaMask: ${userAddress.substring(0, 6)}...${userAddress.substring(38)}`,
        });
        
        return true;
      }
      
      throw new Error('Tipo de wallet no soportado');
    } catch (error: any) {
      console.error('Error al conectar wallet:', error);
      setError(error.message || 'Error desconocido al conectar wallet');
      
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

  // Desconectar wallet
  const disconnectWallet = () => {
    // Limpiar event listeners si es MetaMask
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }
    
    // Limpiar estado
    setAddress(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    
    // Limpiar localStorage
    localStorage.removeItem('walletType');
    
    toast({
      title: 'Wallet desconectada',
      description: 'Tu wallet ha sido desconectada correctamente',
    });
  };

  // Manejadores de eventos
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // Usuario desconectó la wallet
      disconnectWallet();
    } else {
      // Cambió a otra cuenta
      setAddress(accounts[0]);
    }
  };

  const handleChainChanged = (chainIdHex: string) => {
    setChainId(parseInt(chainIdHex, 16));
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  // Context value
  const value: WalletContextType = {
    address,
    isConnected,
    chainId,
    network,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}