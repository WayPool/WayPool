import { apiRequest } from './queryClient';

export interface User {
  walletAddress: string;
  isAdmin?: boolean;
}

interface SessionResponse {
  isLoggedIn: boolean;
  user?: User;
}

interface LoginResponse {
  success: boolean;
  user?: User;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Obtiene el estado actual de la sesión
 */
export async function getSession(): Promise<SessionResponse> {
  try {
    return await apiRequest<SessionResponse>('GET', '/api/auth/session');
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return { isLoggedIn: false };
  }
}

/**
 * Inicia sesión con la dirección del wallet
 */
export async function login(walletAddress: string): Promise<LoginResponse> {
  try {
    // Normalizar la dirección antes de enviarla
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    // Llamamos a apiRequest con el método y la URL como parámetros separados
    const response = await apiRequest<LoginResponse>(
      'POST', 
      '/api/auth/login', 
      { walletAddress: normalizedWalletAddress }
    );
    
    return response;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false };
  }
}

/**
 * Cierra la sesión actual
 */
export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await apiRequest<LogoutResponse>('POST', '/api/auth/logout');
    
    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, message: 'Error al cerrar sesión' };
  }
}

/**
 * Verifica si el usuario está autenticado y tiene privilegios de administrador
 * Primero intenta obtener el estado desde localStorage/sessionStorage como respaldo
 */
export async function isAdmin(walletAddress: string): Promise<boolean> {
  // Primero verificamos en localStorage/sessionStorage por respaldo
  try {
    // Intentar cargar desde sessionStorage primero (más seguro y persistente entre navegación)
    const storedAdminStatus = sessionStorage.getItem('isAdmin');
    if (storedAdminStatus === 'true') {
      console.log('📋 Usando estado de administrador desde sessionStorage');
      return true;
    }
    
    // Como segunda opción, verificar en localStorage
    const adminUsers = localStorage.getItem('adminUsers');
    if (adminUsers) {
      const admins = JSON.parse(adminUsers);
      if (Array.isArray(admins) && admins.includes(walletAddress.toLowerCase())) {
        console.log('📋 Usuario encontrado en adminUsers de localStorage');
        // También lo guardamos en sessionStorage para futuras verificaciones
        try {
          sessionStorage.setItem('isAdmin', 'true');
        } catch (e) {
          console.warn('No se pudo guardar en sessionStorage', e);
        }
        return true;
      }
    }
  } catch (e) {
    console.warn('Error al acceder a almacenamiento local:', e);
  }
  
  // Si no se encontró en storage local, consultar API
  try {
    const response = await apiRequest<{ isAdmin: boolean }>('GET', `/api/user/${walletAddress}/admin-status`);
    
    // Si es admin, guardar en sessionStorage para futuras verificaciones
    if (response.isAdmin) {
      try {
        sessionStorage.setItem('isAdmin', 'true');
        
        // También actualizar el array en localStorage
        const adminUsers = localStorage.getItem('adminUsers');
        let admins = [];
        if (adminUsers) {
          try {
            admins = JSON.parse(adminUsers);
            if (!Array.isArray(admins)) admins = [];
          } catch (e) {
            console.warn('Error parsing adminUsers:', e);
            admins = [];
          }
        }
        if (!admins.includes(walletAddress.toLowerCase())) {
          admins.push(walletAddress.toLowerCase());
          localStorage.setItem('adminUsers', JSON.stringify(admins));
        }
      } catch (e) {
        console.warn('No se pudo guardar en storage:', e);
      }
    }
    
    return response.isAdmin;
  } catch (error) {
    console.error('Error al verificar estado de administrador:', error);
    
    // Si hay error en la API, última verificación en localStorage
    try {
      const isAdminInLocalStorage = localStorage.getItem(`isAdmin-${walletAddress.toLowerCase()}`);
      if (isAdminInLocalStorage === 'true') {
        console.log('📋 Usando estado de administrador desde clave específica en localStorage');
        return true;
      }
    } catch (e) {
      console.warn('Error al acceder a localStorage específico:', e);
    }
    
    return false;
  }
}