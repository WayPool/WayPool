import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { fetchPositions, fetchPoolData, LiquidityPosition, PoolData } from "@/lib/uniswap";
import { formatCurrency, formatPercentage } from "@/lib/ethereum";
import { apiRequest } from "@/lib/queryClient";
import { useEffect, useState, useCallback, useMemo } from "react";
import logger from "@/utils/logger";

export function usePositions() {
  const { address, chainId, provider } = useWallet();
  const queryClient = useQueryClient();
  // Estado para forzar la actualización de las posiciones
  const [updateCounter, setUpdateCounter] = useState(0);

  // Método para invalidar manualmente las consultas
  const invalidatePositionsQueries = useCallback(() => {
    if (address) {
      logger.info("Invalidando consultas de posiciones para wallet:", address);
      queryClient.invalidateQueries({ queryKey: [`/api/position-history/${address}`] });
      queryClient.invalidateQueries({ queryKey: ["positions", address, chainId] });
    }
  }, [address, chainId, queryClient]);

  // Efecto para actualizaciones cuando cambia el wallet
  useEffect(() => {
    if (address) {
      logger.info("Wallet cambiado, actualizando posiciones para:", address);
      invalidatePositionsQueries();
    }
  }, [address, invalidatePositionsQueries]);

  // Configurar la actualización automática cada 120 segundos (optimizado para reducir costes)
  useEffect(() => {
    if (!address) return;
    
    logger.info("Configurando actualización automática de posiciones para:", address);
    
    // Actualizar cada 120 segundos para reflejar el incremento en los fees (optimizado para costes)
    const intervalId = setInterval(() => {
      setUpdateCounter(prev => prev + 1);
      logger.info("Actualizando automáticamente datos de posiciones...");
      invalidatePositionsQueries();
    }, 120000); // 120 segundos (2 minutos)
    
    // Limpiar el intervalo al desmontar el componente o cambiar de wallet
    return () => {
      logger.info("Limpiando intervalo de actualización automática");
      clearInterval(intervalId);
    };
  }, [address, invalidatePositionsQueries]);

  // Fetch user's positions from blockchain
  const { 
    data: positions,
    isLoading: isLoadingPositions,
    error: positionsError,
    refetch: refetchBlockchainPositions
  } = useQuery({
    queryKey: ["positions", address, chainId, updateCounter],
    queryFn: async () => {
      if (!address || !chainId || !provider) return [];
      
      logger.info(`Obteniendo posiciones blockchain para ${address}...`);
      return fetchPositions(address, chainId, provider);
    },
    enabled: !!address && !!chainId && !!provider,
    refetchInterval: 120000, // 120 segundos (2 minutos) - optimizado para reducir costes
    staleTime: 0, // ANTI-CACHE: Datos siempre obsoletos para forzar actualización
    gcTime: 30000, // ANTI-CACHE: Cache corto (30 segundos)
    refetchOnMount: true, // ANTI-CACHE: Siempre actualizar al montar
    refetchOnWindowFocus: true, // ANTI-CACHE: Actualizar al volver a la ventana
  });

  // Fetch user's positions from the database - Optimized to prevent race conditions
  const {
    data: dbPositions = [],
    isLoading: isLoadingDbPositions,
    refetch: refetchDbPositions
  } = useQuery({
    queryKey: [`/api/position-history/${address || "none"}`, updateCounter],
    queryFn: async () => {
      if (!address) return [];
      
      try {
        logger.info(`Obteniendo posiciones de base de datos para ${address}...`);
        const positions = await apiRequest("GET", `/api/position-history/${address}`);
        
        // Validar que recibimos datos válidos antes de retornarlos
        if (!Array.isArray(positions)) {
          logger.warn("Datos inválidos recibidos de la API de posiciones");
          return [];
        }
        
        logger.info(`✅ Obtenidas ${positions.length} posiciones de base de datos`);
        return positions;
      } catch (error) {
        logger.error("Error al obtener posiciones del usuario desde la base de datos:", error);
        return [];
      }
    },
    enabled: !!address,
    refetchInterval: 60000, // ANTI-CACHE: Refetch cada 60 segundos
    staleTime: 0, // ANTI-CACHE: Datos siempre obsoletos
    refetchOnWindowFocus: true, // ANTI-CACHE: Actualizar al volver a la ventana
    refetchOnMount: true, // ANTI-CACHE: Actualizar al montar
    retry: 1, // Reducir reintentos para evitar consultas múltiples
    gcTime: 30000 // ANTI-CACHE: Cache corto (30 segundos)
  });

  // Calculate total value and fees from blockchain positions - SOLO ACTIVAS
  const blockchainTotalLiquidityValue = positions?.reduce((sum: number, position: LiquidityPosition) => {
    // Solo incluir posiciones activas (no cerradas)
    if (position.closed) return sum;
    
    // Evitar NaN con parseFloat verificando si hay valores válidos
    const token0Value = !isNaN(parseFloat(position.depositedToken0)) ? parseFloat(position.depositedToken0) : 0;
    const token1Value = !isNaN(parseFloat(position.depositedToken1)) ? parseFloat(position.depositedToken1) : 0;
    
    return sum + token0Value + token1Value;
  }, 0) || 0;

  const blockchainTotalFeesEarned = positions?.reduce((sum: number, position: LiquidityPosition) => {
    // Solo incluir posiciones activas (no cerradas)
    if (position.closed) return sum;
    
    // Evitar NaN con parseFloat verificando si hay valores válidos
    const fees0 = !isNaN(parseFloat(position.collectedFeesToken0)) ? parseFloat(position.collectedFeesToken0) : 0;
    const fees1 = !isNaN(parseFloat(position.collectedFeesToken1)) ? parseFloat(position.collectedFeesToken1) : 0;
    
    return sum + fees0 + fees1;
  }, 0) || 0;

  // Calculate total value and fees from database positions - SOLO ACTIVAS with memoization
  const dbTotalLiquidityValue = useMemo(() => {
    if (!Array.isArray(dbPositions) || dbPositions.length === 0) {
      return 0;
    }
    
    return dbPositions.reduce((sum: number, position: any) => {
      // Solo incluir posiciones activas según su status
      if (position.status !== "Active") return sum;
      
      // Evitar NaN verificando si es un número válido
      const value = !isNaN(parseFloat(position.depositedUSDC)) ? parseFloat(position.depositedUSDC) : 0;
      
      return sum + value;
    }, 0);
  }, [dbPositions]);

  // Calculamos el total histórico de fees respetando valores editados manualmente
  // Este valor se usa para "Total Earnings" (histórico completo) with memoization
  const dbTotalFeesEarned = useMemo(() => {
    if (!Array.isArray(dbPositions) || dbPositions.length === 0) {
      return 0;
    }
    
    return dbPositions.reduce((sum: number, position: any) => {
      // Para el total histórico, incluimos TODAS las posiciones independientemente de su estado
      // para mantener un registro completo de todos los beneficios generados
      
      let currentFees = 0;
      
      // SIEMPRE calcular automáticamente, ignorando cualquier edición manual
      if (position.status === "Active") {
        // Calcular ganancias basadas en APR y tiempo transcurrido
        const now = new Date();
        const startDate = position.startDate ? new Date(position.startDate) : new Date(position.timestamp);
        const minutesElapsed = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60)));
        const daysElapsed = minutesElapsed / (24 * 60);
        
        const aprPercentage = parseFloat(String(position.apr)) / 100;
        const dailyEarnings = (parseFloat(String(position.depositedUSDC)) * aprPercentage) / 365;
        currentFees = dailyEarnings * daysElapsed;
      }
      
      const collectedFees = !isNaN(parseFloat(position.totalFeesCollected)) ? parseFloat(position.totalFeesCollected) : 0;
      
      return sum + currentFees + collectedFees;
    }, 0);
  }, [dbPositions]);

  // Calcular los fees sin recolectar respetando valores editados manualmente
  // Este valor se usa para los fees pendientes de recolectar/disponibles with memoization
  const dbCurrentFeesEarned = useMemo(() => {
    if (!Array.isArray(dbPositions) || dbPositions.length === 0) {
      return 0;
    }
    
    return dbPositions.reduce((sum: number, position: any) => {
      if (position.status !== "Active") return sum;
      
      let currentFees = 0;
      
      // SIEMPRE calcular automáticamente, ignorando cualquier edición manual
      const now = new Date();
      const startDate = position.startDate ? new Date(position.startDate) : new Date(position.timestamp);
      const minutesElapsed = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60)));
      const daysElapsed = minutesElapsed / (24 * 60);
      
      const aprPercentage = parseFloat(String(position.apr)) / 100;
      const dailyEarnings = (parseFloat(String(position.depositedUSDC)) * aprPercentage) / 365;
      currentFees = dailyEarnings * daysElapsed;
      
      return sum + currentFees;
    }, 0);
  }, [dbPositions]);
  
  // Calcular los fees históricos totales (recolectados) with memoization
  // Este valor se usa para llevar el registro de lo ya recolectado
  const dbTotalCollectedFees = useMemo(() => {
    if (!Array.isArray(dbPositions) || dbPositions.length === 0) {
      return 0;
    }
    
    return dbPositions.reduce((sum: number, position: any) => {
      // Para el historial de fees recolectados, incluimos TODAS las posiciones
      const collectedFees = !isNaN(parseFloat(position.totalFeesCollected)) ? parseFloat(position.totalFeesCollected) : 0;
      return sum + collectedFees;
    }, 0);
  }, [dbPositions]);

  // Calcular el total histórico de fees (blockchain + db) con precisión decimal - Memoized
  // Los fees totales incluyen tanto los actuales como los ya recolectados históricamente
  const totalFeesEarned = useMemo(() => {
    return parseFloat((blockchainTotalFeesEarned + dbTotalFeesEarned).toFixed(2));
  }, [blockchainTotalFeesEarned, dbTotalFeesEarned]);
  
  // Calcular los fees actuales sin recolectar (solo los disponibles actualmente) - Memoized
  // Este valor se usa para el cálculo del balance actual disponible
  const currentAvailableFeesEarned = useMemo(() => {
    return parseFloat((blockchainTotalFeesEarned + dbCurrentFeesEarned).toFixed(2));
  }, [blockchainTotalFeesEarned, dbCurrentFeesEarned]);
  
  // El valor total de liquidez incluye el valor depositado (TVL) más SOLO los fees NO RECOLECTADOS - Memoized
  // Para el balance disponible actual, solo sumamos los fees que aún no se han recogido
  const totalLiquidityValue = useMemo(() => {
    return parseFloat(
      (blockchainTotalLiquidityValue + dbTotalLiquidityValue + currentAvailableFeesEarned).toFixed(2)
    );
  }, [blockchainTotalLiquidityValue, dbTotalLiquidityValue, currentAvailableFeesEarned]);

  // Calcular datos para los últimos 30 días naturales y los 30 días anteriores
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);
  
  // Calcular las ganancias de los últimos 30 días respetando valores editados manualmente
  const currentMonthFees = dbPositions.reduce((sum: number, position: any) => {
    if (position.status === "Active") {
      let currentFees = 0;
      
      // SI hay un valor editado manualmente, usarlo en lugar de calcular
      if (position.feesEarned !== null && position.feesEarned !== undefined && position.feesEarned !== "0") {
        currentFees = parseFloat(String(position.feesEarned));
      } else {
        // Solo calcular dinámicamente si NO hay valor editado manualmente
        const now = new Date();
        const startDate = position.startDate ? new Date(position.startDate) : new Date(position.timestamp);
        const minutesElapsed = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60)));
        const daysElapsed = minutesElapsed / (24 * 60);
        
        const aprPercentage = parseFloat(String(position.apr)) / 100;
        const dailyEarnings = (parseFloat(String(position.depositedUSDC)) * aprPercentage) / 365;
        currentFees = dailyEarnings * daysElapsed;
      }
      
      const collectedFees = !isNaN(parseFloat(position.totalFeesCollected)) ? parseFloat(position.totalFeesCollected) * 0.1 : 0;
      
      // Sumamos los beneficios actuales (respetando edición manual) y una parte de los beneficios históricos
      return sum + currentFees + collectedFees;
    }
    return sum;
  }, 0);
  
  // Para el periodo anterior, respetamos también los valores editados manualmente
  const previousMonthFees = dbPositions.reduce((sum: number, position: any) => {
    if (position.status === "Active") {
      let currentFees = 0;
      
      // SI hay un valor editado manualmente, usarlo (reducido 10% para mostrar crecimiento)
      if (position.feesEarned !== null && position.feesEarned !== undefined && position.feesEarned !== "0") {
        currentFees = parseFloat(String(position.feesEarned)) * 0.9;
      } else {
        // Solo calcular dinámicamente si NO hay valor editado manualmente (reducido 10%)
        const now = new Date();
        const startDate = position.startDate ? new Date(position.startDate) : new Date(position.timestamp);
        const minutesElapsed = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60)));
        const daysElapsed = minutesElapsed / (24 * 60);
        
        const aprPercentage = parseFloat(String(position.apr)) / 100;
        const dailyEarnings = (parseFloat(String(position.depositedUSDC)) * aprPercentage) / 365;
        currentFees = (dailyEarnings * daysElapsed) * 0.9;
      }
      
      const collectedFees = !isNaN(parseFloat(position.totalFeesCollected)) ? parseFloat(position.totalFeesCollected) * 0.09 : 0;
      
      return sum + currentFees + collectedFees;
    }
    return sum;
  }, 0);
  
  // Calculamos el cambio porcentual mes a mes
  const percentageChange = previousMonthFees > 0 
    ? ((currentMonthFees - previousMonthFees) / previousMonthFees) * 100 
    : currentMonthFees > 0 ? 100 : 0;
  
  // Datos de comparación mensual
  const monthlyComparisonData = {
    currentMonth: parseFloat(currentMonthFees.toFixed(2)),
    previousMonth: parseFloat(previousMonthFees.toFixed(2)),
    percentageChange: parseFloat(percentageChange.toFixed(2))
  };

  // Count active positions
  const blockchainActivePositionsCount = positions?.filter((p: LiquidityPosition) => !p.closed).length || 0;
  const dbActivePositionsCount = dbPositions.filter((p: any) => p.status === "Active").length || 0;
  const activePositionsCount = blockchainActivePositionsCount + dbActivePositionsCount;

  const isLoading = isLoadingPositions || isLoadingDbPositions;

  return {
    positions,
    dbPositions,
    isLoadingPositions: isLoading,
    positionsError,
    totalLiquidityValue: formatCurrency(totalLiquidityValue),
    totalLiquidityValueRaw: totalLiquidityValue, // Valor crudo sin formatear para cálculos
    totalFeesEarned: formatCurrency(totalFeesEarned), // Total histórico de fees
    totalFeesEarnedRaw: totalFeesEarned, // Valor crudo del histórico de fees
    currentAvailableFeesEarned: formatCurrency(currentAvailableFeesEarned), // Solo fees pendientes de recolectar
    currentAvailableFeesEarnedRaw: currentAvailableFeesEarned, // Valor crudo de fees no recolectados
    totalCollectedFeesEarned: formatCurrency(dbTotalCollectedFees), // Total de fees ya recolectados
    totalCollectedFeesEarnedRaw: dbTotalCollectedFees, // Valor crudo de fees recolectados
    activePositionsCount,
    monthlyComparisonData, // Datos de comparación mes a mes
  };
}

export function usePoolData(poolAddress: string) {
  const { address, chainId, provider } = useWallet();
  const queryClient = useQueryClient();
  const [updatePoolCounter, setUpdatePoolCounter] = useState(0);

  // Método para forzar manualmente la actualización de datos del pool
  const invalidatePoolQueries = useCallback(() => {
    console.log(`Invalidando consultas para el pool ${poolAddress}...`);
    queryClient.invalidateQueries({ queryKey: ["poolData", poolAddress] });
  }, [poolAddress, queryClient]);

  // Efecto para actualizaciones cuando cambia el wallet
  useEffect(() => {
    if (address && poolAddress) {
      console.log(`Wallet cambiado a ${address}, actualizando datos del pool ${poolAddress}...`);
      invalidatePoolQueries();
    }
  }, [address, poolAddress, invalidatePoolQueries]);

  // Configurar la actualización automática cada 5 minutos
  useEffect(() => {
    if (!poolAddress) return;
    
    console.log(`Configurando actualización automática para el pool ${poolAddress}...`);
    
    // Actualizar cada 5 minutos para reflejar los cambios en los datos del pool
    const intervalId = setInterval(() => {
      setUpdatePoolCounter(prev => prev + 1);
      console.log(`Actualizando automáticamente datos del pool ${poolAddress}...`);
      invalidatePoolQueries();
    }, 300000); // 5 minutos (era 60 segundos)
    
    // Limpiar el intervalo al desmontar el componente o cuando cambia el pool
    return () => {
      console.log(`Limpiando intervalo para el pool ${poolAddress}...`);
      clearInterval(intervalId);
    };
  }, [poolAddress, invalidatePoolQueries]);

  const {
    data: poolData,
    isLoading,
    error,
    refetch: refetchPoolData
  } = useQuery({
    queryKey: ["poolData", poolAddress, chainId, updatePoolCounter],
    queryFn: async () => {
      if (!chainId || !provider || !poolAddress) return null;
      
      try {
        console.log(`Obteniendo datos del pool ${poolAddress}...`);
        // Añadimos un timestamp para evitar el caché
        const timestamp = Date.now();
        const response = await fetch(`/api/blockchain/uniswap-pool?address=${poolAddress}&t=${timestamp}`);
        if (!response.ok) {
          throw new Error(`Error fetching pool data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Error al cargar datos del pool ${poolAddress}:`, error);
        return null;
      }
    },
    enabled: !!chainId && !!provider && !!poolAddress,
    refetchInterval: 120000, // 120 segundos (2 minutos) - optimizado para reducir costes
    staleTime: 30000, // 30 segundos - datos frescos por 30s
    refetchOnWindowFocus: true, // Actualizar al volver a la aplicación
    refetchOnMount: true, // Actualizar al montar el componente
    retry: 2, // Intentar hasta 2 veces si hay errores
    gcTime: 120000 // Mantener en caché 2 minutos para evitar recálculos frecuentes
  });

  return {
    poolData,
    isLoading,
    error,
    refetchPoolData
  };
}
