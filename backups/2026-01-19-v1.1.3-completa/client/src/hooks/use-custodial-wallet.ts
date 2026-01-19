import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { APP_NAME } from '@/utils/app-config';

interface CustodialWalletState {
  address: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

interface WalletInfo {
  address: string;
  balance: string;
  createdAt: string;
}

/**
 * Hook para gestionar billeteras custodiadas
 * Proporciona funciones para acceder, verificar estado y gestionar
 * billeteras WayBank
 */
export function useCustodialWallet() {
  const [state, setState] = useState<CustodialWalletState>({
    address: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Comprobar si hay una sesión de billetera custodiada activa
  useEffect(() => {
    const checkWalletSession = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Verificar si hay una sesión activa
        const response = await apiRequest<{
          authenticated: boolean;
          walletInfo?: WalletInfo;
        }>('GET', '/api/custodial-wallet/session');

        if (response?.authenticated && response.walletInfo) {
          setState({
            address: response.walletInfo.address,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setState({
            address: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error checking wallet session:', error);
        setState({
          address: null,
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Error desconocido al verificar sesión'),
        });
      }
    };

    checkWalletSession();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await apiRequest('POST', '/api/custodial-wallet/logout');
      setState({
        address: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Error al cerrar sesión'),
      }));
      
      return false;
    }
  };

  // Función para obtener información detallada de la billetera
  const getWalletDetails = async () => {
    if (!state.address || !state.isAuthenticated) {
      return null;
    }

    try {
      const details = await apiRequest<WalletInfo>('GET', `/api/custodial-wallet/${state.address}`);
      return details;
    } catch (error) {
      console.error('Error fetching wallet details:', error);
      return null;
    }
  };

  // Función para firmar un mensaje con la billetera custodiada
  // Esta función sería útil para interactuar con aplicaciones DeFi
  const signMessage = async (message: string) => {
    if (!state.address || !state.isAuthenticated) {
      throw new Error('No hay una sesión de billetera activa');
    }

    try {
      const response = await apiRequest<{ signature: string }>('POST', '/api/custodial-wallet/sign', {
        message,
        address: state.address,
      });
      
      return response?.signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  return {
    ...state,
    logout,
    getWalletDetails,
    signMessage,
  };
}