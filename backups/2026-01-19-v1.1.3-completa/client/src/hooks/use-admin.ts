import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { apiRequest } from '@/lib/queryClient';

interface AdminStatus {
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

// Clave para almacenar la información de admin en sessionStorage
const ADMIN_STATUS_KEY = 'isAdmin';
// Clave para almacenar la dirección del wallet asociada con el estado de admin
const ADMIN_ADDRESS_KEY = 'adminWalletAddress';

/**
 * Hook para verificar si el usuario actual es administrador
 */
export function useAdmin(): AdminStatus {
  const { address } = useWallet();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Si no hay dirección, no es admin
    if (!address) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    // Limpiamos el estado de admin si cambia la dirección
    const savedAdminAddress = sessionStorage.getItem(ADMIN_ADDRESS_KEY);
    if (savedAdminAddress && savedAdminAddress.toLowerCase() !== address.toLowerCase()) {
      console.log(`🛡️ Cambio de wallet detectado, limpiando estado admin previo`);
      sessionStorage.removeItem(ADMIN_STATUS_KEY);
      sessionStorage.removeItem(ADMIN_ADDRESS_KEY);
    }

    // Verificar si el usuario ya está marcado como admin en sessionStorage
    const sessionIsAdmin = sessionStorage.getItem(ADMIN_STATUS_KEY) === 'true';
    const sessionAdminAddress = sessionStorage.getItem(ADMIN_ADDRESS_KEY);
    
    if (sessionIsAdmin && sessionAdminAddress && sessionAdminAddress.toLowerCase() === address.toLowerCase()) {
      console.log('🛡️ Admin detectado desde sessionStorage para:', address);
      setIsAdmin(true);
      setIsLoading(false);
      return;
    }
    
    const checkAdminStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Usar el endpoint específico para verificar estado de admin
        console.log(`🛡️ Verificando estado de admin para ${address}...`);
        const response = await apiRequest<{isAdmin: boolean}>("GET", `/api/user/${address}/admin-status`);
        
        const adminStatus = response?.isAdmin === true;
        setIsAdmin(adminStatus);
        
        // Guardar el estado en sessionStorage para futuras referencias
        if (adminStatus) {
          console.log(`🛡️ Usuario ${address} confirmado como admin, guardando en sessionStorage`);
          sessionStorage.setItem(ADMIN_STATUS_KEY, 'true');
          sessionStorage.setItem(ADMIN_ADDRESS_KEY, address.toLowerCase());
        } else {
          // Si no es admin, asegurarse de limpiar cualquier valor previo
          sessionStorage.removeItem(ADMIN_STATUS_KEY);
          sessionStorage.removeItem(ADMIN_ADDRESS_KEY);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError(err instanceof Error ? err : new Error('Error al verificar estado de administrador'));
        setIsAdmin(false);
        // Limpiar estado en caso de error
        sessionStorage.removeItem(ADMIN_STATUS_KEY);
        sessionStorage.removeItem(ADMIN_ADDRESS_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [address]);

  return { isAdmin, isLoading, error };
}