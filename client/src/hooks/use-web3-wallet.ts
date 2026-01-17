import { useContext } from 'react';
import { WalletContext, WalletType } from '@/lib/new-wallet-provider';

/**
 * Hook personalizado para acceder al contexto de conexión de wallet
 * con Web3Modal
 * 
 * Proporciona métodos para conectar, desconectar y actualizar la conexión,
 * así como acceso a la información del wallet y la red conectada.
 */
export function useWeb3Wallet() {
  const context = useContext(WalletContext);
  
  if (!context) {
    throw new Error("useWeb3Wallet debe usarse dentro de un WalletProvider");
  }
  
  return {
    // Estado general
    address: context.address,
    account: context.account, // Alias usado en algunos componentes
    isConnected: context.isConnected,
    isConnecting: context.isConnecting,
    error: context.error,
    
    // Información de red
    chainId: context.chainId,
    network: context.network,
    
    // Proveedores para interacción con blockchain
    provider: context.provider,
    signer: context.signer,
    
    // Métodos para gestionar la conexión
    connect: (walletType: WalletType = WalletType.WEB3MODAL, options?: any) => context.connectWallet(walletType, options),
    disconnect: context.disconnectWallet,
    refreshConnection: context.refreshConnection,
    
    // Control de modal
    isModalOpen: context.isModalOpen,
    setIsModalOpen: context.setIsModalOpen,
    
    // Cambio de red
    switchNetwork: context.switchNetwork
  };
}

export default useWeb3Wallet;