import { useWeb3Wallet } from '@/hooks/use-web3-wallet';
import { WalletType } from '@/lib/new-wallet-provider';
import { useEffect } from 'react';

/**
 * Clave para almacenar la dirección del wallet en localStorage
 */
export const WAYBANK_WALLET_ADDRESS_KEY = 'waybank_wallet_address';

/**
 * Hook de compatibilidad para mantener el código existente funcionando
 * mientras migramos a la nueva implementación basada en Web3Modal.
 * 
 * Este hook actúa como una capa de compatibilidad, asegurando que
 * todos los componentes existentes que usen useWallet() sigan funcionando
 * sin cambios, pero aprovechando la nueva implementación.
 */
export function useWallet() {
  // Usamos la nueva implementación internamente
  const web3WalletContext = useWeb3Wallet();
  
  // Sincronizar la dirección del wallet con localStorage
  useEffect(() => {
    if (web3WalletContext.isConnected && web3WalletContext.address) {
      // Guardar dirección normalizada en minúsculas
      const normalizedAddress = web3WalletContext.address.toLowerCase();
      localStorage.setItem(WAYBANK_WALLET_ADDRESS_KEY, normalizedAddress);
      console.log("Dirección del wallet guardada en localStorage:", normalizedAddress);
    } else if (!web3WalletContext.isConnected) {
      // Limpiar cuando se desconecta
      localStorage.removeItem(WAYBANK_WALLET_ADDRESS_KEY);
      console.log("Dirección del wallet eliminada de localStorage");
    }
  }, [web3WalletContext.isConnected, web3WalletContext.address]);
  
  // Función para obtener la dirección del wallet actual (desde el contexto o localStorage)
  const getCurrentWalletAddress = (): string | null => {
    if (web3WalletContext.address) {
      return web3WalletContext.address.toLowerCase();
    }
    
    // Intentar obtener de localStorage si no está en el contexto
    const savedAddress = localStorage.getItem(WAYBANK_WALLET_ADDRESS_KEY);
    return savedAddress;
  };
  
  // Retornamos una interfaz compatible con el hook anterior
  return {
    // Estado general
    address: web3WalletContext.address,
    account: web3WalletContext.account,
    isConnected: web3WalletContext.isConnected,
    isConnecting: web3WalletContext.isConnecting,
    error: web3WalletContext.error,
    
    // Soporte para nombres alternativos (compatibilidad con código existente)
    isLoggedIn: web3WalletContext.isConnected,
    isLoading: web3WalletContext.isConnecting,
    
    // Información de red
    chainId: web3WalletContext.chainId,
    network: web3WalletContext.network,
    
    // Proveedores para interacción con blockchain
    provider: web3WalletContext.provider,
    signer: web3WalletContext.signer,
    
    // Métodos para gestionar la conexión
    // La función tiene compatibilidad con el enum WalletType anterior
    connectWallet: web3WalletContext.connect,
    disconnectWallet: web3WalletContext.disconnect,
    refreshConnection: web3WalletContext.refreshConnection,
    
    // Control de modal
    isModalOpen: web3WalletContext.isModalOpen,
    setIsModalOpen: web3WalletContext.setIsModalOpen,
    
    // Cambio de red
    switchNetwork: web3WalletContext.switchNetwork,
    
    // Métodos adicionales
    getCurrentWalletAddress
  };
}

export default useWallet;