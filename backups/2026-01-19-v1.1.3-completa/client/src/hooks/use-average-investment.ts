import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Definir el tipo de respuesta para mejorar la solidez del tipo
interface AverageInvestmentResponse {
  averageInvestment: number;
  positionCount: number;
  totalPositions: number;
  timestamp: string;
}

/**
 * Hook para obtener el valor promedio de inversión de todas las posiciones activas
 * 
 * @returns Objeto con el valor promedio de inversión, contador de posiciones y estado de carga
 */
export function useAverageInvestment() {
  // No usamos valor predeterminado, para que se actualice con el valor real de la API
  const [averageInvestment, setAverageInvestment] = useState<number>(0);
  const [positionCount, setPositionCount] = useState<number>(0);
  const [totalPositions, setTotalPositions] = useState<number>(0);
  // Obtener el cliente de query para invalidar el cache
  const queryClient = useQueryClient();
  
  // Forzar una actualización al cargar el componente
  useEffect(() => {
    // Invalidar inmediatamente el cache para obtener datos frescos
    queryClient.invalidateQueries({ queryKey: ['/api/stats/average-investment'] });
  }, [queryClient]);
  
  // Realizar la consulta al endpoint de valor promedio de inversión
  const { data, isLoading, isError, refetch } = useQuery<AverageInvestmentResponse>({
    queryKey: ['/api/stats/average-investment'],
    staleTime: 0, // Sin caché
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  
  // Actualizar el estado cuando los datos cambian
  useEffect(() => {
    if (data) {
      if (typeof data.averageInvestment === 'number') {
        console.log("Recibido nuevo valor promedio de inversión:", data.averageInvestment);
        setAverageInvestment(data.averageInvestment);
      }
      
      if (typeof data.positionCount === 'number') {
        console.log("Número de posiciones usadas en el cálculo:", data.positionCount);
        setPositionCount(data.positionCount);
      }
      
      if (typeof data.totalPositions === 'number') {
        console.log("Total de posiciones activas:", data.totalPositions);
        setTotalPositions(data.totalPositions);
      }
    }
  }, [data]);
  
  return {
    averageInvestment,
    positionCount,
    totalPositions,
    isLoading,
    isError,
    timestamp: data?.timestamp ? new Date(data.timestamp) : new Date(),
    refetch, // Exponer la función para actualizar manualmente
  }
}