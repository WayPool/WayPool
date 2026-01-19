import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatEther, JsonRpcProvider, getAddress } from 'ethers';

// Tipos de wallet soportados
export enum WalletType {
  ADMIN = 'admin' // Wallet del admin para simulación
}

// Interface para el contexto
interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connectWallet: (walletType: WalletType) => Promise<boolean>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
  balance: string | null;
  checkBalance: () => Promise<string>;
}

// Crear el contexto
const WalletContext = createContext<WalletContextType | null>(null);

// Hook para usar el contexto
export function useBasicWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useBasicWallet debe usarse dentro de un BasicWalletProvider');
  }
  return context;
}

// Provider component
export function BasicWalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Efecto para recuperar la conexión guardada
  useEffect(() => {
    const savedWalletType = localStorage.getItem('basic_wallet_type');
    if (savedWalletType) {
      connectWallet(savedWalletType as WalletType);
    }
  }, []);

  // Conectar wallet (solo admin por ahora)
  const connectWallet = async (walletType: WalletType): Promise<boolean> => {
    if (isConnecting) return false;

    try {
      setIsConnecting(true);
      setError(null);

      // Simulamos la conexión con la wallet del admin
      const adminAddress = '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F';
      
      // Breve retraso para simular la conexión
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAddress(adminAddress);
      setIsConnected(true);
      
      // Guardar tipo de wallet
      localStorage.setItem('basic_wallet_type', walletType);
      
      // Verificar el saldo inmediatamente después de conectar
      setTimeout(() => {
        checkBalance().then((balance) => {
          toast({
            title: 'Wallet conectada',
            description: `Conectado como administrador: ${adminAddress.substring(0, 6)}...${adminAddress.substring(38)} | Saldo: ${parseFloat(balance).toFixed(4)} ETH`,
          });
        });
      }, 500);
      
      return true;
    } catch (error: any) {
      setError(error.message || 'Error al conectar');
      
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
    setAddress(null);
    setIsConnected(false);
    
    // Limpiar localStorage
    localStorage.removeItem('basic_wallet_type');
    
    toast({
      title: 'Wallet desconectada',
      description: 'Tu wallet ha sido desconectada correctamente',
    });
  };

  // Función para verificar el saldo
  const checkBalance = async (): Promise<string> => {
    if (!address) return '0';
    
    try {
      // Usamos Infura o Alchemy como provider
      const infuraKey = process.env.INFURA_API_KEY || import.meta.env.VITE_INFURA_API_KEY || "84842078b09946638c03157f83405213"; // Clave pública de ejemplo
      const provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraKey}`);
      
      // Consultamos el saldo
      const balanceWei = await provider.getBalance(getAddress(address));
      const balanceEth = formatEther(balanceWei);
      
      // Actualizamos el estado
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
  const value: WalletContextType = {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
    balance,
    checkBalance,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}