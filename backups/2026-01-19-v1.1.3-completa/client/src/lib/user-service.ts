import { apiRequest } from './queryClient';
import type { User } from '@shared/schema';

/**
 * Obtiene la información de un usuario por su dirección de wallet
 * @param walletAddress Dirección de la wallet
 * @returns Información del usuario
 */
export async function getUser(walletAddress: string): Promise<User | null> {
  try {
    if (!walletAddress) {
      console.warn("getUser: La dirección de wallet es vacía o inválida");
      return null;
    }
    
    // Normalizar la dirección a minúsculas para consistencia
    const normalizedAddress = walletAddress.toLowerCase();
    
    // Revisar si tenemos datos de usuario en caché temporal
    const localStorageKey = `waybank_user_${normalizedAddress}`;
    
    // Intentar obtener los datos desde localStorage como respaldo durante fallos
    try {
      const cachedUserData = localStorage.getItem(localStorageKey);
      if (cachedUserData) {
        console.log("Recuperando datos de usuario desde caché temporal:", walletAddress);
        return JSON.parse(cachedUserData) as User;
      }
    } catch (cacheError) {
      console.warn("No se pudo acceder a localStorage para caché:", cacheError);
    }
    
    // Si no hay caché o falla, recuperar de la API
    console.log("Obteniendo usuario desde API:", normalizedAddress);
    
    // Usar el método GET específicamente y pasar el walletAddress como parte del URL
    const response = await fetch(`/api/user/${normalizedAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-wallet-address': normalizedAddress // Incluir en headers como respaldo
      },
      credentials: 'include' // Incluir cookies para la autenticación
    });
    
    if (!response.ok) {
      // Si el código de estado es 404, intentar crear usuario automáticamente
      if (response.status === 404) {
        console.log("Usuario no encontrado, intentando crear usuario automáticamente");
        
        // Crear usuario automáticamente llamando a GET con un parámetro de creación
        const createResponse = await fetch(`/api/user/${normalizedAddress}?create=true`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-wallet-address': normalizedAddress
          },
          credentials: 'include'
        });
        
        if (createResponse.ok) {
          const newUser = await createResponse.json();
          
          // Guardar en localStorage para acceso offline
          try {
            localStorage.setItem(localStorageKey, JSON.stringify(newUser));
          } catch (e) {
            console.warn("No se pudo guardar usuario en localStorage:", e);
          }
          
          return newUser;
        }
      }
      
      throw new Error(`Error obteniendo usuario: ${response.status} ${response.statusText}`);
    }
    
    const user = await response.json();
    
    // Guardar en localStorage para acceso offline o como respaldo
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(user));
    } catch (e) {
      console.warn("No se pudo guardar usuario en localStorage:", e);
    }
    
    return user;
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    
    // Como último recurso, crear un objeto de usuario ficticio que permita la operación básica
    // en caso de pérdida de conectividad con el servidor (solo usará valores por defecto)
    if (walletAddress) {
      try {
        // Buscar si tenemos un indicador de aceptación de términos en localStorage
        const hasAcceptedTerms = localStorage.getItem(`waybank_legal_accepted_${walletAddress.toLowerCase()}`) === "true";
        
        if (hasAcceptedTerms) {
          // Si ya aceptó términos previamente según localStorage, permitir acceso mínimo
          // Creamos un objeto que cumpla con la estructura básica de User definida en schema.ts
          const recoveryUser = {
            id: 0, // ID ficticio
            walletAddress: walletAddress.toLowerCase(),
            hasAcceptedLegalTerms: true,
            termsOfUseAccepted: true,
            privacyPolicyAccepted: true,
            disclaimerAccepted: true,
            isAdmin: false,
            username: null,
            email: null,
            theme: "system",
            defaultNetwork: "ethereum",
            walletDisplay: "shortened",
            language: "es",
            gasPreference: "standard",
            autoHarvest: false,
            harvestPercentage: 100,
            legalTermsAcceptedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Propiedades adicionales para modo de recuperación
            lastLoginAt: new Date().toISOString(),
            recoveryMode: true // Indicador de modo recuperación
          };
          
          // Convertir explícitamente a unknown primero y luego a User para evitar errores de tipo
          return recoveryUser as unknown as User;
        }
      } catch (localStorageError) {
        console.warn("Error accediendo a localStorage para recuperación:", localStorageError);
      }
    }
    
    return null;
  }
}

/**
 * Verifica si un usuario tiene privilegios de administrador
 * @param walletAddress Dirección de la wallet
 * @returns Verdadero si es administrador, falso en caso contrario
 */
export async function getIsAdmin(walletAddress: string): Promise<boolean> {
  try {
    if (!walletAddress) {
      console.warn("getIsAdmin: La dirección de wallet es vacía o inválida");
      return false;
    }
    
    // Normalizar la dirección a minúsculas para consistencia
    const normalizedAddress = walletAddress.toLowerCase();
    
    // Revisar si tenemos el estado admin en caché temporal
    const localStorageKey = `waybank_admin_${normalizedAddress}`;
    
    // Intentar obtener los datos desde localStorage como respaldo durante fallos
    try {
      const cachedAdminStatus = localStorage.getItem(localStorageKey);
      if (cachedAdminStatus) {
        console.log("Recuperando estado admin desde caché temporal:", walletAddress);
        return cachedAdminStatus === "true";
      }
    } catch (cacheError) {
      console.warn("No se pudo acceder a localStorage para caché de admin:", cacheError);
    }
    
    // Hacer la petición directamente con fetch para evitar problemas de tipado
    const response = await fetch(`/api/user/${normalizedAddress}/admin-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-wallet-address': normalizedAddress // Incluir en headers como respaldo
      },
      credentials: 'include' // Incluir cookies para la autenticación
    });
    
    if (!response.ok) {
      throw new Error(`Error verificando estado admin: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    const isAdmin = !!result.isAdmin;
    
    // Guardar en localStorage para acceso offline
    try {
      localStorage.setItem(localStorageKey, isAdmin.toString());
    } catch (e) {
      console.warn("No se pudo guardar estado admin en localStorage:", e);
    }
    
    return isAdmin;
  } catch (error) {
    console.error("Error verificando estado de administrador:", error);
    return false;
  }
}

/**
 * Acepta los términos legales para un usuario
 * @param walletAddress Dirección de la wallet
 * @returns Verdadero si la operación fue exitosa, falso en caso contrario
 */
export async function acceptLegalTerms(walletAddress: string): Promise<boolean> {
  try {
    if (!walletAddress) {
      console.warn("acceptLegalTerms: La dirección de wallet es vacía o inválida");
      return false;
    }

    // Normalizar la dirección a minúsculas para consistencia
    const normalizedAddress = walletAddress.toLowerCase();
    
    // Hacer la petición directamente con fetch para evitar problemas de tipado con apiRequest
    const response = await fetch(`/api/user/${normalizedAddress}/legal-acceptance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-wallet-address': normalizedAddress // Incluir en headers como respaldo
      },
      body: JSON.stringify({
        termsOfUse: true,
        privacyPolicy: true,
        disclaimer: true
      }),
      credentials: 'include' // Incluir cookies para la autenticación
    });
    
    if (!response.ok) {
      throw new Error(`Error aceptando términos legales: ${response.status} ${response.statusText}`);
    }
    
    // Almacenar en localStorage como mecanismo de respaldo
    try {
      localStorage.setItem(`waybank_legal_accepted_${normalizedAddress}`, "true");
    } catch (e) {
      console.warn("No se pudo guardar status de aceptación legal en localStorage:", e);
    }
    
    // Invalidar caché de usuario para forzar recarga del estado
    try {
      localStorage.removeItem(`waybank_user_${normalizedAddress}`);
    } catch (e) {
      console.warn("No se pudo invalidar caché de usuario:", e);
    }
    
    return true;
  } catch (error) {
    console.error("Error aceptando términos legales:", error);
    
    // Plan de contingencia: almacenar en localStorage incluso en caso de error en la API
    // Esto permite que el usuario siga usando la app incluso si hay problemas de conectividad
    try {
      localStorage.setItem(`waybank_legal_accepted_${walletAddress.toLowerCase()}`, "true");
      console.log("Almacenado estado de aceptación legal en localStorage como contingencia");
      return true; // Retornar éxito aunque la API haya fallado
    } catch (storageError) {
      console.error("Error en plan de contingencia para términos legales:", storageError);
    }
    
    return false;
  }
}