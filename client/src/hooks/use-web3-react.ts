import { useContext } from 'react';
import { WalletContext } from '@/lib/new-wallet-provider';

/**
 * Hook personalizado para acceder al contexto de Wallet consolidado
 * Proporciona acceso a todas las funciones y estados relacionados con la conexión de wallet
 */
export function useWeb3React() {
  return useContext(WalletContext);
}