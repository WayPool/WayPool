import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Hook para obtener el APR promedio de todas las posiciones activas
 * 
 * @returns Objeto con el APR promedio y estado de carga
 */
export function useAverageAPR() {
  // Usamos un valor predeterminado de 61.64% en caso de error
  const [averageAPR, setAverageAPR] = useState<number>(61.64);
  // Obtener el cliente de query para invalidar el cache
  const queryClient = useQueryClient();
  
  // Forzar una actualización al cargar el componente
  useEffect(() => {
    // Invalidar inmediatamente el cache para obtener datos frescos
    queryClient.invalidateQueries({ queryKey: ['/api/stats/average-apr'] });
  }, []);
  
  // Realizar la consulta al endpoint de APR promedio
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/stats/average-apr'],
    staleTime: 0, // Sin caché
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  
  // Actualizar el estado cuando los datos cambian
  useEffect(() => {
    if (data && typeof data.averageAPR === 'number') {
      console.log("Recibido nuevo APR promedio:", data.averageAPR);
      setAverageAPR(data.averageAPR);
    }
  }, [data]);
  
  return {
    averageAPR,
    isLoading,
    isError,
    timestamp: data?.timestamp ? new Date(data.timestamp) : new Date(),
    refetch, // Exponer la función para actualizar manualmente
  };
}