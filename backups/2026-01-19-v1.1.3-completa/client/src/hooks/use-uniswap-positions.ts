import { useState, useEffect } from 'react';
import { getUserUniswapPositions, UniswapPositionNFT } from '@/lib/uniswap-positions';
import { useWallet } from './use-wallet';

/**
 * Hook personalizado para obtener las posiciones NFT de Uniswap de un usuario
 */
export function useUniswapPositions() {
  const { address, provider } = useWallet();
  const [positions, setPositions] = useState<UniswapPositionNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Función para cargar las posiciones
  const loadPositions = async () => {
    if (!address || !provider) {
      setPositions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Pasamos directamente el provider, la función de getUserUniswapPositions se encargará
      // de hacer la conversión si fuera necesario
      const userPositions = await getUserUniswapPositions(address, provider);
      setPositions(userPositions);
    } catch (err) {
      console.error('Error al cargar posiciones de Uniswap:', err);
      setError(err as Error);
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar posiciones cuando cambia la dirección o el proveedor
  useEffect(() => {
    loadPositions();
  }, [address, provider]);

  return {
    positions,
    isLoading,
    error,
    refresh: loadPositions
  };
}