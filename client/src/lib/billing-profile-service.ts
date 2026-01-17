import { BillingProfile, InsertBillingProfile } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';

/**
 * Clase para manejar errores específicos del servicio de perfiles de facturación
 */
export class BillingProfileServiceError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'BillingProfileServiceError';
    this.status = status;
  }
}

/**
 * Funciones para gestionar perfiles de facturación
 * 
 * Nota: Todas las funciones ahora utilizan apiRequest que maneja
 * automáticamente la autenticación y los reintentos.
 */

/**
 * Obtiene el perfil de facturación para una dirección de wallet
 */
export async function getUserBillingProfile(walletAddress?: string): Promise<BillingProfile | null> {
  try {
    const response = await apiRequest<BillingProfile>('GET', '/api/billing-profile');
    return response;
  } catch (error: any) {
    // Si el perfil no existe (404) o hay un error de autenticación (401), retornamos null
    if (error.message && (error.message.startsWith('404:') || error.message.startsWith('401:'))) {
      console.warn('No se encontró perfil de facturación o usuario no autenticado');
      return null;
    }
    console.error('Error al obtener el perfil de facturación:', error);
    return null;
  }
}

/**
 * Guarda un perfil de facturación (crea o actualiza)
 */
export async function saveUserBillingProfile(
  profileData: Partial<InsertBillingProfile>
): Promise<BillingProfile> {
  try {
    // Asegurarse de que walletAddress esté en minúsculas para consistencia
    const normalizedData = { 
      ...profileData,
      walletAddress: profileData.walletAddress ? profileData.walletAddress.toLowerCase() : profileData.walletAddress
    };
    
    console.log("Enviando datos normalizados para guardar perfil:", normalizedData);
    
    const savedProfile = await apiRequest<BillingProfile>(
      'POST', 
      '/api/billing-profile', 
      normalizedData
    );
    
    // Invalidar consultas relacionadas con perfiles de facturación
    queryClient.invalidateQueries({ queryKey: ['/api/billing-profile'] });
    
    return savedProfile;
  } catch (error) {
    console.error('Error al guardar el perfil de facturación:', error);
    throw error;
  }
}

/**
 * Verifica un perfil de facturación con blockchain
 */
export async function verifyBillingProfile(signature: string): Promise<BillingProfile> {
  try {
    const verifiedProfile = await apiRequest<BillingProfile>(
      'POST', 
      '/api/billing-profile/verify', 
      { signature }
    );
    
    // Invalidar consultas relacionadas con perfiles de facturación
    queryClient.invalidateQueries({ queryKey: ['/api/billing-profile'] });
    
    return verifiedProfile;
  } catch (error) {
    console.error('Error al verificar el perfil de facturación:', error);
    throw error;
  }
}

/**
 * Obtiene todos los perfiles de facturación (solo admin)
 */
export async function getAllBillingProfiles(): Promise<BillingProfile[]> {
  try {
    const profiles = await apiRequest<BillingProfile[]>('GET', '/api/admin/billing-profiles');
    return profiles;
  } catch (error) {
    console.error('Error al obtener todos los perfiles de facturación:', error);
    throw error;
  }
}

/**
 * Obtiene un perfil de facturación por ID (solo admin)
 */
export async function getBillingProfileById(id: number): Promise<BillingProfile> {
  try {
    const profile = await apiRequest<BillingProfile>('GET', `/api/admin/billing-profiles/${id}`);
    return profile;
  } catch (error) {
    console.error(`Error al obtener el perfil de facturación con ID ${id}:`, error);
    throw error;
  }
}

/**
 * Obtiene un perfil por dirección de wallet (solo admin)
 */
export async function getBillingProfileByWalletAddress(walletAddress: string): Promise<BillingProfile> {
  try {
    const profile = await apiRequest<BillingProfile>(
      'GET', 
      `/api/admin/billing-profiles/wallet/${walletAddress}`
    );
    return profile;
  } catch (error) {
    console.error(`Error al obtener el perfil de facturación para la wallet ${walletAddress}:`, error);
    throw error;
  }
}

/**
 * Actualiza un perfil de facturación (solo admin)
 */
export async function updateBillingProfile(
  id: number, 
  profileData: Partial<BillingProfile>
): Promise<BillingProfile> {
  try {
    const updatedProfile = await apiRequest<BillingProfile>(
      'PUT', 
      `/api/admin/billing-profiles/${id}`, 
      profileData
    );
    
    // Invalidar consultas relacionadas con perfiles de facturación
    queryClient.invalidateQueries({ queryKey: ['/api/admin/billing-profiles'] });
    queryClient.invalidateQueries({ queryKey: [`/api/admin/billing-profiles/${id}`] });
    
    return updatedProfile;
  } catch (error) {
    console.error(`Error al actualizar el perfil de facturación con ID ${id}:`, error);
    throw error;
  }
}

/**
 * Elimina un perfil de facturación (solo admin)
 */
export async function deleteBillingProfile(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const result = await apiRequest<{ success: boolean; message: string }>(
      'DELETE', 
      `/api/admin/billing-profiles/${id}`
    );
    
    // Invalidar consultas relacionadas con perfiles de facturación
    queryClient.invalidateQueries({ queryKey: ['/api/admin/billing-profiles'] });
    
    return result;
  } catch (error) {
    console.error(`Error al eliminar el perfil de facturación con ID ${id}:`, error);
    throw error;
  }
}