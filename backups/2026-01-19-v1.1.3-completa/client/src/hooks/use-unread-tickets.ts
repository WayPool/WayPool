import { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from './use-wallet';
import { useAdmin } from './use-admin';

// Caché local para reducir solicitudes innecesarias
interface TicketCacheEntry {
  count: number;
  timestamp: number;
}
const CACHE_LIFETIME_MS = 60000; // 1 minuto de validez para el caché
const ticketsCache: Record<string, TicketCacheEntry> = {};

export function useUnreadTickets() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isConnected, address } = useWallet();
  const { isAdmin } = useAdmin();
  const lastFetchRef = useRef(0);

  const getCacheKey = useCallback(() => {
    const readerType = isAdmin ? 'admin' : 'user';
    return `${readerType}:${address || 'no-address'}`;
  }, [isAdmin, address]);

  // Función optimizada para verificar el caché antes de realizar la solicitud
  const fetchUnreadCount = useCallback(async (force = false) => {
    if (!isConnected) {
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    const now = Date.now();
    const cacheKey = getCacheKey();
    const cachedData = ticketsCache[cacheKey];
    
    // Verificar si podemos usar datos del caché
    if (!force && 
        cachedData && 
        now - cachedData.timestamp < CACHE_LIFETIME_MS && 
        now - lastFetchRef.current < 10000) { // Evitar refetches frecuentes
      setUnreadCount(cachedData.count);
      setIsLoading(false);
      return;
    }
    
    // Actualizar timestamp del último intento
    lastFetchRef.current = now;
    
    try {
      setIsLoading(true);
      setError(null);

      // Determinar si estamos consultando como admin o como usuario
      const readerType = isAdmin ? 'admin' : 'user';
      
      // Construir la URL con los parámetros adecuados
      let url = `/api/support/tickets/unread-count?reader=${readerType}`;
      
      if (readerType === 'user' && address) {
        url += `&walletAddress=${address}`;
      }
      
      const response = await fetch(url, {
        // Añadir encabezados para prevenir uso de caché HTTP
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener conteo de tickets no leídos');
      }
      
      const data = await response.json();
      const count = data.unreadCount || 0;
      
      // Guardar en caché y actualizar estado
      ticketsCache[cacheKey] = {
        count,
        timestamp: now
      };
      
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread tickets count:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, isAdmin, getCacheKey]);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    // Iniciar inmediatamente
    if (isMounted) {
      fetchUnreadCount(false);
    }
    
    // Configurar un intervalo para verificar periódicamente (cada 5 minutos)
    // Reducimos la frecuencia para evitar solicitudes excesivas
    intervalId = setInterval(() => {
      if (isMounted) {
        fetchUnreadCount(false);
      }
    }, 300000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchUnreadCount]);

  // Función para forzar una actualización (utilizada en acciones del usuario)
  const refresh = async () => {
    // Forzar una nueva obtención de datos pasando true como parámetro
    await fetchUnreadCount(true);
  };

  return {
    unreadCount,
    isLoading,
    error,
    refresh
  };
}