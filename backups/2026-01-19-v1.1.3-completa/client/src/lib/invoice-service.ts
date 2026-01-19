/**
 * Servicio para gestionar las facturas a través de la API
 */

import { apiRequest, queryClient } from "@/lib/queryClient";
import { Invoice } from "@shared/schema";

// Datos de actualización de factura
export interface InvoiceUpdateData {
  status?: string;
  paymentMethod?: string;
  transactionHash?: string;
  bankReference?: string;
  paidDate?: Date | null;
  notes?: string;
  billingProfileId?: number | null; // ID del perfil de facturación asociado
  // Datos del cliente (se pueden mantener para retrocompatibilidad o cuando no hay perfil asociado)
  clientName?: string;
  clientAddress?: string;
  clientCity?: string;
  clientCountry?: string;
  clientTaxId?: string;
}

/**
 * Clase para manejar errores específicos del servicio de facturas
 */
export class InvoiceServiceError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'InvoiceServiceError';
    this.status = status;
  }
}

/**
 * Verifica la respuesta de la API y parsea los datos a JSON
 * @param response Respuesta de fetch
 * @param arrayExpected Indica si se espera un array como respuesta
 * @returns Datos parseados de la respuesta
 */
async function handleApiResponse<T>(response: Response, arrayExpected = false): Promise<T> {
  try {
    // Verificar si la respuesta es válida
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response (${response.status}): ${errorText}`);
      throw new InvoiceServiceError(`Error en la petición (${response.status})`, response.status);
    }
    
    // Intentar parsear como JSON
    try {
      const data = await response.json();
      
      // Si se espera un array y no lo es, devolver array vacío
      if (arrayExpected && !Array.isArray(data)) {
        console.warn('Se esperaba un array pero se recibió:', typeof data);
        return ([] as any) as T;
      }
      
      return data as T;
    } catch (parseError) {
      console.error('Error al parsear la respuesta JSON:', parseError);
      throw new InvoiceServiceError('Formato de respuesta incorrecto');
    }
  } catch (error) {
    if (error instanceof InvoiceServiceError) {
      throw error;
    }
    console.error('Error inesperado:', error);
    throw new InvoiceServiceError('Error al procesar la respuesta');
  }
}

// Servicio de facturas
export class InvoiceService {
  /**
   * Asigna un perfil de facturación a una factura
   * @param invoiceId ID de la factura
   * @param billingProfileId ID del perfil de facturación
   */
  static async assignBillingProfile(invoiceId: number, billingProfileId: number): Promise<Invoice> {
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}/assign-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billingProfileId }),
      });
      
      const updatedInvoice = await handleApiResponse<Invoice>(response);
      
      // Invalidar consultas para actualizar los datos en caché
      queryClient.invalidateQueries({ queryKey: ['/api/admin/invoices'] });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/invoices/${invoiceId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: [`/api/invoices/${invoiceId}`] });
      
      return updatedInvoice;
    } catch (error) {
      console.error(`Error al asignar perfil de facturación ${billingProfileId} a factura ${invoiceId}:`, error);
      throw error;
    }
  }
  /**
   * Obtiene todas las facturas
   */
  static async getAllInvoices(): Promise<Invoice[]> {
    try {
      console.log("Invoice Service: Iniciando getAllInvoices");
      const response = await apiRequest("GET", "/api/invoices");
      
      if (!response) {
        console.error("Invoice Service: apiRequest retornó valor nulo");
        return [];
      }
      
      if (Array.isArray(response)) {
        console.log(`Invoice Service: getAllInvoices obtuvo ${response.length} facturas`);
        return response;
      }
      
      console.warn("Invoice Service: Respuesta no es un array:", response);
      return [];
    } catch (error) {
      console.error('Invoice Service: Error en getAllInvoices:', error);
      // En vez de propagar el error, devolvemos un array vacío para evitar errores en los componentes
      return [];
    }
  }

  /**
   * Obtiene las facturas de un usuario específico
   * @param walletAddress Dirección de la wallet del usuario
   */
  static async getUserInvoices(walletAddress: string): Promise<Invoice[]> {
    try {
      console.log(`Obteniendo facturas para wallet: ${walletAddress}`);
      const response = await apiRequest("GET", `/api/invoices/wallet/${walletAddress}`);
      const data = await handleApiResponse<Invoice[]>(response, true);
      console.log('Facturas recibidas:', data);
      return data;
    } catch (error) {
      console.error('Error en getUserInvoices:', error);
      throw error;
    }
  }

  /**
   * Obtiene una factura por su ID
   * @param invoiceId ID de la factura
   */
  static async getInvoiceById(invoiceId: number): Promise<Invoice> {
    try {
      const response = await apiRequest("GET", `/api/invoices/${invoiceId}`);
      return handleApiResponse<Invoice>(response);
    } catch (error) {
      console.error(`Error al obtener factura con ID ${invoiceId}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza una factura
   * @param invoiceId ID de la factura
   * @param updateData Datos a actualizar
   */
  static async updateInvoice(invoiceId: number, updateData: InvoiceUpdateData): Promise<Invoice> {
    try {
      const response = await apiRequest("PATCH", `/api/invoices/${invoiceId}`, updateData);
      return handleApiResponse<Invoice>(response);
    } catch (error) {
      console.error(`Error al actualizar factura ${invoiceId}:`, error);
      throw error;
    }
  }

  /**
   * Genera el PDF de una factura
   * @param invoiceId ID de la factura
   */
  static async generateInvoicePdf(invoiceId: number): Promise<Blob> {
    try {
      console.log(`API Request: GET /api/invoices/${invoiceId}/pdf`);
      
      // Usar fetch directamente para manejar la descarga como blob
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al generar PDF para factura ${invoiceId}:`, errorText);
        throw new InvoiceServiceError(`Error al generar PDF (${response.status})`, response.status);
      }
      
      try {
        return await response.blob();
      } catch (blobError) {
        console.error('Error al convertir la respuesta a blob:', blobError);
        throw new InvoiceServiceError('Error al procesar el PDF de la factura');
      }
    } catch (error) {
      console.error(`Error al generar PDF para factura ${invoiceId}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una factura
   * @param invoiceId ID de la factura
   */
  static async deleteInvoice(invoiceId: number): Promise<void> {
    try {
      const response = await apiRequest("DELETE", `/api/invoices/${invoiceId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error al eliminar factura (${response.status}):`, errorText);
        throw new InvoiceServiceError(`Error al eliminar factura (${response.status})`, response.status);
      }
    } catch (error) {
      console.error(`Error al eliminar factura ${invoiceId}:`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva factura
   * @param invoiceData Datos de la factura
   */
  static async createInvoice(invoiceData: any): Promise<Invoice> {
    try {
      const response = await apiRequest("POST", "/api/invoices", invoiceData);
      return handleApiResponse<Invoice>(response);
    } catch (error) {
      console.error('Error al crear factura:', error);
      throw error;
    }
  }
  

}