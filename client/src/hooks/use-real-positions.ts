import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Definimos el tipo aquí para evitar dependencias circulares
interface RealPosition {
  id: number;
  walletAddress: string;
  virtualPositionId: string;
  poolAddress: string;
  poolName: string;
  token0: string;
  token1: string;
  token0Amount: string | number;
  token1Amount: string | number;
  tokenId?: string;
  txHash?: string;
  network: string;
  status: string;
  blockExplorerUrl?: string;
  liquidityValue?: string | number;
  feesEarned?: string | number;
  inRange: boolean;
  additionalData?: string;
}

/**
 * Custom hook para gestionar posiciones reales en Uniswap
 */
export function useRealPositions(walletAddress?: string) {
  const queryClient = useQueryClient();
  
  // Obtiene todas las posiciones reales para una dirección de wallet
  const {
    data: realPositions,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: walletAddress ? ['/api/real-positions', walletAddress] : ['skip-query'],
    enabled: !!walletAddress,
    staleTime: 30000 // 30 segundos
  });
  
  // Obtiene las posiciones reales asociadas a una posición virtual específica
  const getRealPositionsByVirtualId = (virtualPositionId: number) => {
    return useQuery({
      queryKey: ['/api/real-positions/virtual', virtualPositionId],
      enabled: !!virtualPositionId
    });
  };
  
  // Crea una nueva posición real
  const createRealPosition = useMutation({
    mutationFn: (data: { virtualPositionId: number, walletAddress: string }) => {
      return apiRequest<RealPosition>('/api/real-positions', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      // Invalidar consultas relacionadas después de crear
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: ['/api/real-positions', walletAddress] });
      }
    }
  });
  
  // Actualiza una posición real
  const updateRealPosition = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<RealPosition>) => {
      return apiRequest<RealPosition>(`/api/real-positions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      // Invalidar consultas relacionadas después de actualizar
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: ['/api/real-positions', walletAddress] });
      }
    }
  });
  
  // Elimina una posición real
  const deleteRealPosition = useMutation({
    mutationFn: (id: number) => {
      return apiRequest<{ success: boolean }>(`/api/real-positions/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      // Invalidar consultas relacionadas después de eliminar
      if (walletAddress) {
        queryClient.invalidateQueries({ queryKey: ['/api/real-positions', walletAddress] });
      }
    }
  });
  
  return {
    realPositions,
    isLoading,
    error,
    refetch,
    getRealPositionsByVirtualId,
    createRealPosition,
    updateRealPosition,
    deleteRealPosition
  };
}