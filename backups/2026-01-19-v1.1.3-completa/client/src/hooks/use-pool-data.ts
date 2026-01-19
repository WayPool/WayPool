import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { POOLS } from "@/lib/constants";
import { fetchPoolData } from "@/lib/uniswap";
import { useState, useMemo, useEffect, useRef } from "react";
import { BrowserProvider, JsonRpcProvider } from "ethers";
// WebSocket temporalmente deshabilitado para evitar errores
// import { useWebSocket } from '@/hooks/use-websocket';

// Cache global para datos de pools
interface PoolCache {
  [address: string]: {
    data: any;
    lastUpdated: number;
  };
}

// Cache global compartida entre todas las instancias del hook
const globalPoolCache: PoolCache = {};

// Tiempo de refresco de la caché en milisegundos (120 segundos) - optimizado para reducir costes
// Este intervalo debe estar en sincronía con refetchInterval de React Query
const CACHE_REFRESH_INTERVAL = 120000;

export interface PoolInfo {
  id: number;
  name: string;
  address: string;
  feeTier: number;
  token0Address: string;
  token0Symbol: string;
  token0Name: string;
  token0Decimals: number;
  token1Address: string;
  token1Symbol: string;
  token1Name: string;
  token1Decimals: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  networkId: number;
  networkName: string;
  createdBy: string;
  displayName?: string;
}

export interface PoolOption {
  key: string;
  value: string;
  displayName?: string;
}

export const usePoolData = (initialPoolAddress: string = "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36") => {
  const { chainId, provider } = useWallet();
  const [selectedPoolAddress, setSelectedPoolAddress] = useState<string>(initialPoolAddress);
  const [webSocketData, setWebSocketData] = useState<any>(null);
  const [availablePools, setAvailablePools] = useState<PoolInfo[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);
  const [activePoolKey, setActivePoolKey] = useState<string>("USDT-ETH");
  
  // Referencias para el intervalo de refresco y estado de carga inicial
  const initialLoadRef = useRef(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cliente de consulta para invalidar caché
  const queryClient = useQueryClient();
  
  // Red activa (Ethereum por defecto)
  const networkName = useMemo(() => {
    if (chainId === 137) return "POLYGON";
    return "ETHEREUM"; // Valor por defecto
  }, [chainId]);
  
  // Función auxiliar para cargar datos de un pool
  const fetchPoolDetails = async (address: string) => {
    try {
      // Extraer la dirección real sin posibles parámetros
      const cleanAddress = address.split('?')[0]; // Eliminar los parámetros si existen
      
      // Añadir timestamp para evitar la caché del navegador
      const timestamp = Date.now();
        
      // Determinar si es el pool principal para logging
      const isMainPool = cleanAddress.includes("0x4e68ccd3e89f51c3074ca5072bbac773960dfa36");
      
      // Log detallado para el pool principal
      if (isMainPool) {
        console.log(`Carga PRIORITARIA de datos del pool principal: ${cleanAddress}`);
      }
      
      // CORRECCIÓN: Construir URL correctamente sin anidar parámetros
      const response = await fetch(`/api/blockchain/uniswap-pool?address=${cleanAddress}&_=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching pool data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Verificar si los datos son válidos
      if (!data || !data.address) {
        console.warn(`⚠️ Advertencia: Datos posiblemente inválidos para pool ${cleanAddress}`);
      } else if (isMainPool) {
        console.log(`✅ Datos actualizados del pool principal cargados correctamente`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for pool ${address}:`, error);
      return null;
    }
  };
  
  // Función para precargar todos los pools y actualizar la caché
  const preloadAllPoolsData = async (pools: PoolInfo[]) => {
    console.log("Precargando datos para", pools.length, "pools...");
    
    // Constante para pool principal (USDT-ETH)
    const MAIN_POOL_ADDRESS = "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36";
    
    // Reorganizar pools para cargar primero el pool principal
    const prioritizedPools = [...pools];
    const mainPoolIndex = prioritizedPools.findIndex(pool => pool.address === MAIN_POOL_ADDRESS);
    
    if (mainPoolIndex > -1) {
      const mainPool = prioritizedPools.splice(mainPoolIndex, 1)[0];
      prioritizedPools.unshift(mainPool); // Poner el pool principal al principio
    }
    
    // Forzar recarga de pool principal al iniciar
    const now = Date.now();
    const isInitialLoad = !initialLoadRef.current;
    
    // Si es la carga inicial, eliminamos el caché del pool principal para forzar recarga
    if (isInitialLoad && globalPoolCache[MAIN_POOL_ADDRESS]) {
      console.log("Forzando recarga fresca del pool principal");
      delete globalPoolCache[MAIN_POOL_ADDRESS];
    }
    
    const fetchPromises = prioritizedPools.map(async (pool, index) => {
      try {
        // Determinar si es el pool principal
        const isMainPool = pool.address === MAIN_POOL_ADDRESS;
        
        // Verificar caché (excepto para pool principal en carga inicial)
        const cachedData = globalPoolCache[pool.address];
        const isCacheValid = cachedData && 
          (now - cachedData.lastUpdated < CACHE_REFRESH_INTERVAL);
        
        // Usar caché solo si es válida Y no es el pool principal en primera carga
        if (isCacheValid && !(isMainPool && isInitialLoad)) {
          console.log(`Usando datos en caché para pool ${pool.name} (${pool.address})`);
          return;
        }
        
        // Cargar prioridad alta para el primer pool (pool principal)
        if (index === 0) {
          console.log(`PRIORITARIO: Cargando datos actualizados para pool ${pool.name} (${pool.address})`);
        }
        
        // CORRECCIÓN: Cargamos los datos del pool sin concatenar parámetros incorrectos
        const poolData = await fetchPoolDetails(pool.address);
        
        if (poolData) {
          // Actualizamos la caché global
          globalPoolCache[pool.address] = {
            data: poolData,
            lastUpdated: now
          };
        }
      } catch (error) {
        console.error(`Error precargando datos para pool ${pool.name}:`, error);
      }
    });
    
    await Promise.all(fetchPromises);
  };
  
  // Iniciar intervalo de actualización de caché
  const startCacheRefreshInterval = (pools: PoolInfo[]) => {
    // Limpiar intervalo existente si hay uno
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    
    // Establecer nuevo intervalo para actualizar la caché periódicamente
    refreshIntervalRef.current = setInterval(() => {
      preloadAllPoolsData(pools);
    }, CACHE_REFRESH_INTERVAL);
    
    // Limpiar intervalo cuando el componente se desmonte
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  };
  
  // Cargar pools desde la API y precargar datos
  useEffect(() => {
    async function loadAvailablePools() {
      try {
        setLoadingPools(true);
        const response = await fetch('/api/pools/custom');
        if (!response.ok) {
          throw new Error('Failed to fetch pools');
        }
        
        const poolsData = await response.json();
        console.log("Available pools data received:", poolsData);
        
        // Marcar como no cargando inmediatamente después de obtener la lista de pools
        setLoadingPools(false);
        setAvailablePools(poolsData);
        
        // Precargar datos para todos los pools en segundo plano
        if (!initialLoadRef.current && poolsData.length > 0) {
          initialLoadRef.current = true;
          
          // No esperamos a que termine la precarga para continuar
          preloadAllPoolsData(poolsData).then(() => {
            console.log("Precarga inicial completa");
          });
          
          // Iniciar intervalo de actualización de caché
          startCacheRefreshInterval(poolsData);
        }
      } catch (error) {
        console.error("Error loading pools:", error);
        setLoadingPools(false);
      }
    }
    
    loadAvailablePools();
    
    // Limpiar intervalo cuando el componente se desmonte
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, []);
  
  // Crear opciones para el selector de pool
  const poolSelectionOptions = useMemo(() => {
    return availablePools.map(pool => ({
      key: pool.name,
      value: pool.address,
      displayName: pool.name || pool.displayName || `${pool.token0Symbol}-${pool.token1Symbol}`
    }));
  }, [availablePools]);
  
  // Debug para rastrear el pool seleccionado y las opciones disponibles
  useEffect(() => {
    if (poolSelectionOptions.length > 0) {
      console.log("Opciones de pool disponibles:", poolSelectionOptions);
      console.log("Pool seleccionado actual:", activePoolKey);
    }
  }, [poolSelectionOptions, activePoolKey]);
  
  // useEffect para actualizar el activePoolKey cuando cambia selectedPoolAddress o cuando se cargan los pools
  useEffect(() => {
    // Si tenemos pools disponibles, buscar el que coincide con selectedPoolAddress
    if (availablePools && availablePools.length > 0) {
      const foundPool = availablePools.find(pool => pool.address === selectedPoolAddress);
      if (foundPool) {
        console.log("Pool encontrado en useEffect:", foundPool.name);
        setActivePoolKey(foundPool.name);
      } else {
        // Si no encontramos el pool pero tenemos pools disponibles, usar el primero
        console.log("Pool no encontrado, usando el primero disponible:", availablePools[0].name);
        setActivePoolKey(availablePools[0].name);
        setSelectedPoolAddress(availablePools[0].address);
      }
    }
  }, [selectedPoolAddress, availablePools]);
  
  // La dirección del pool que usamos para los datos
  const poolAddress = useMemo(() => {
    return selectedPoolAddress;
  }, [selectedPoolAddress]);

  // WebSocket deshabilitado temporalmente para evitar errores de conexión
  // Implementación mock para mantener la compatibilidad sin los WebSockets
  const isConnected = false; // Siempre indicamos que no hay conexión 
  const isFailed = false;
  const send = () => console.log("WebSocket deshabilitado: send no disponible");
  const subscribe = () => console.log("WebSocket deshabilitado: subscribe no disponible");
  const setOnMessage = () => console.log("WebSocket deshabilitado: setOnMessage no disponible");
  
  // El WebSocket está deshabilitado, pero mantenemos el efecto de limpieza
  useEffect(() => {
    // Como WebSocket está deshabilitado, este código no se ejecuta nunca
    
    return () => {
      // Limpiar datos de WebSocket al desmontar
      setWebSocketData(null);
    };
  }, []);
  
  // WebSocket deshabilitado
  // El sistema funciona correctamente con actualización periódica vía HTTP
  
  // Consulta REST para obtener datos completos del pool, usando caché si está disponible
  const {
    data: poolData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["poolData", poolAddress],
    // Esta clave cambiará cuando cambie el pool, forzando refetch automático
    staleTime: 40000, // Considerar datos como "obsoletos" después de 40 segundos
    refetchInterval: 120000, // Refrescar automáticamente cada 120 segundos (2 minutos) - optimizado para reducir costes
    refetchOnWindowFocus: true, // Refrescar cuando el usuario vuelve a enfocar la ventana
    refetchOnMount: true, // Refrescar cuando el componente se monta
    refetchOnReconnect: true, // Refrescar cuando la conexión se restablece
    queryFn: async () => {
      try {
        // Verificar si es el pool principal
        const MAIN_POOL_ADDRESS = "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36";
        const isMainPool = poolAddress === MAIN_POOL_ADDRESS;
        
        // Determinar si es carga inicial
        const isInitialLoad = !initialLoadRef.current;
        
        // Verificar si tenemos datos en caché para esta dirección
        const cachedData = globalPoolCache[poolAddress];
        const now = Date.now();
        
        // Usar la caché solo si:
        // 1. Existen datos en caché
        // 2. Los datos son recientes
        // 3. No es el pool principal en carga inicial (forzar recarga para pool principal)
        const shouldUseCache = 
          cachedData && 
          (now - cachedData.lastUpdated < CACHE_REFRESH_INTERVAL) &&
          !(isMainPool && isInitialLoad);
        
        if (shouldUseCache) {
          console.log(`Usando datos en caché para pool ${poolAddress}`);
          return cachedData.data;
        }
        
        // Si es pool principal y carga inicial, loguear acción especial
        if (isMainPool && isInitialLoad) {
          console.log("⭐ CARGA INICIAL PRIORITARIA para pool principal");
        }
        
        // Si no hay caché o está desactualizada, obtener datos nuevos
        console.log("Fetching pool data from API endpoint for address:", poolAddress);
        
        // CORRECCIÓN: Construir URL correctamente sin parámetros anidados
        // Añadir timestamp aleatorio para evitar caché del navegador
        const timestamp = now + Math.floor(Math.random() * 1000);
        const response = await fetch(`/api/blockchain/uniswap-pool?address=${poolAddress}&_=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching pool data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validar que los datos recibidos son válidos
        if (!data || !data.address) {
          console.warn("⚠️ Se recibieron datos posiblemente inválidos del API");
          throw new Error("Datos de pool inválidos");
        }
        
        console.log("✅ DATOS DEL POOL RECIBIDOS:", JSON.stringify(data, null, 2).substring(0, 500) + "...");
        
        // Actualizar la caché global
        globalPoolCache[poolAddress] = {
          data,
          lastUpdated: now
        };
        
        // Marcar que ya hemos completado la carga inicial
        if (isInitialLoad) {
          initialLoadRef.current = true;
        }
        
        return data;
      } catch (error) {
        console.error("Error fetching pool data from API:", error);
        
        // Si hay un error pero tenemos una caché, usarla aunque esté desactualizada
        const cachedData = globalPoolCache[poolAddress];
        if (cachedData) {
          console.log("⚠️ Usando datos en caché (desactualizados) debido a un error en la API");
          return cachedData.data;
        }
        
        try {
          // Intentar obtener datos on-chain como último recurso
          if (provider && poolAddress) {
            console.log("🔗 Falling back to on-chain data request");
            const onChainData = await fetchPoolData(poolAddress, 1, provider);
            
            // Actualizar la caché con estos datos
            globalPoolCache[poolAddress] = {
              data: onChainData,
              lastUpdated: Date.now()
            };
            
            return onChainData;
          }
        } catch (fallbackError) {
          console.error("❌ Fallback to on-chain data also failed:", fallbackError);
        }
        
        throw error;
      }
    },
    enabled: true, // La consulta se ejecuta automáticamente
    retry: 3, // Intentar hasta 3 veces en caso de error
    retryDelay: 1000 // Esperar 1 segundo entre reintentos
  });

  // Función para actualizar la selección de pool basado en la dirección
  const setSelectedPoolKey = (poolAddress: string) => {
    console.log("Cambiando pool a dirección:", poolAddress);
    
    // Limpiar datos de WebSocket para evitar mostrar información desactualizada
    setWebSocketData(null);
    
    const foundPool = availablePools.find(pool => pool.address === poolAddress);
    if (foundPool) {
      console.log("Encontrado pool:", foundPool.name, "con dirección:", foundPool.address);
      setActivePoolKey(foundPool.name);
      
      // Eliminar datos de caché antes de cambiar el pool
      if (foundPool.address in globalPoolCache) {
        console.log("Eliminando caché para forzar nueva carga de datos");
        delete globalPoolCache[foundPool.address];
      }
      
      // Establecer la nueva dirección del pool
      setSelectedPoolAddress(foundPool.address);
      
      // Esperamos un momento y luego forzamos actualización de los datos
      setTimeout(() => {
        refetch();
      }, 100);
      
      // WebSocket deshabilitado
      // No es necesario reconectar
    }
  };

  // Combinar datos del API con actualizaciones en tiempo real de WebSocket
  const combinedPoolData = useMemo(() => {
    if (!poolData) return null;
    
    // Si hay datos de WebSocket, actualizar solo el precio y timestamp
    if (webSocketData && webSocketData.address === poolData.address) {
      return {
        ...poolData,
        price: webSocketData.price || poolData.price,
        ethPriceUsd: webSocketData.ethPriceUsd || poolData.ethPriceUsd,
        lastUpdated: webSocketData.lastUpdated || poolData.lastUpdated
      };
    }
    
    return poolData;
  }, [poolData, webSocketData]);

  return {
    poolData: combinedPoolData,
    isLoading,
    error,
    selectedPoolKey: activePoolKey, // Usar activePoolKey aquí
    setSelectedPoolKey,
    availablePools: poolSelectionOptions.map(option => option.key),
    poolSelectionOptions, // Devolvemos también las opciones para el selector
    loadingPools,
    networkName,
    webSocketConnected: isConnected,
    refetch // Exponemos la función de recarga para que componentes externos puedan forzar actualizaciones
  };
};
