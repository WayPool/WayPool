import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from './use-wallet';

// Mapeo de nombres de red
export const NETWORK_NAMES = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  unichain: 'Unichain',
} as const;

export type NetworkType = keyof typeof NETWORK_NAMES;

// Hook para gestionar la red predeterminada del usuario
export function useDefaultNetwork() {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  // Query para obtener los datos del usuario incluyendo la red predeterminada
  const { data: userSettings, isLoading } = useQuery({
    queryKey: ['/api/user/settings'],
    enabled: !!address,
    staleTime: 0, // Sin cache para obtener datos frescos
  });

  // Mutation para actualizar la red predeterminada
  const updateNetworkMutation = useMutation({
    mutationFn: async (newNetwork: NetworkType) => {
      const response = await fetch('/api/users/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          defaultNetwork: newNetwork
        }),
      });

      if (!response.ok) {
        throw new Error('Error actualizando la red predeterminada');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidar cache del usuario para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['/api/auth/validate'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/settings'] });
    },
  });

  // Función para actualizar la red predeterminada
  const updateDefaultNetwork = async (network: NetworkType) => {
    if (!address) return;
    
    setIsUpdating(true);
    try {
      await updateNetworkMutation.mutateAsync(network);
      console.log('✅ Red predeterminada actualizada a:', NETWORK_NAMES[network]);
    } catch (error) {
      console.error('❌ Error actualizando red predeterminada:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Obtener la red predeterminada actual
  const defaultNetwork = ((userSettings as any)?.defaultNetwork as NetworkType) || 'ethereum';
  const defaultNetworkName = NETWORK_NAMES[defaultNetwork];

  return {
    defaultNetwork,
    defaultNetworkName,
    updateDefaultNetwork,
    isLoading,
    isUpdating: isUpdating || updateNetworkMutation.isPending,
  };
}