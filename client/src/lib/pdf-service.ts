/**
 * Servicio de gestión de PDFs para la aplicación
 * Maneja la generación y descarga de PDFs utilizando el sistema de impresión del navegador
 */

import { generatePdfFromHtml, printHtmlAsPdf } from '@/components/invoices/invoice-html-to-pdf';

/**
 * Clase de servicio para todas las operaciones relacionadas con PDFs
 */
export class PdfService {
  /**
   * Descarga un PDF a partir de la URL de API
   * @param url URL base de la API para descargar el PDF
   * @param assetId ID del recurso (ej: ID de factura)
   * @param fileName Nombre del archivo para descargar
   * @param forceDownload Forzar descarga en vez de visualización
   */
  static async downloadPdfFromApi(
    url: string,
    assetId: number | string,
    fileName: string = 'documento.pdf',
    forceDownload: boolean = true
  ): Promise<void> {
    try {
      // Construir la URL completa con el parámetro de descarga si se solicita
      const fullUrl = `${url}/${assetId}/pdf${forceDownload ? '?download=true' : ''}`;
      
      // Abrir en una nueva pestaña para activar el diálogo de impresión
      window.open(fullUrl, '_blank');
    } catch (error) {
      console.error(`Error al descargar PDF desde ${url}/${assetId}/pdf:`, error);
      throw error;
    }
  }

  /**
   * Obtiene el HTML para visualizar/imprimir desde una API y muestra el PDF
   * @param url URL de la API para obtener el HTML
   * @param assetId ID del recurso (ej: ID de factura)
   * @param fileName Nombre deseado del archivo PDF
   */
  static async viewPdfFromApi(
    url: string,
    assetId: number | string,
    fileName: string = 'documento.pdf'
  ): Promise<Window | null> {
    try {
      // Realizar petición para obtener los datos HTML
      const response = await fetch(`${url}/${assetId}/pdf`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener el PDF: ${response.status} ${response.statusText}`);
      }
      
      // Obtener el HTML como texto
      const htmlContent = await response.text();
      
      // Generar ventana de impresión sin activar impresión automática
      return await printHtmlAsPdf(htmlContent, fileName, {
        autoTriggerPrint: false
      });
    } catch (error) {
      console.error(`Error al visualizar PDF desde ${url}/${assetId}/pdf:`, error);
      throw error;
    }
  }

  /**
   * Convierte HTML directamente a PDF usando el diálogo de impresión
   * @param htmlContent Contenido HTML para convertir a PDF
   * @param fileName Nombre deseado del archivo PDF
   * @param autoTriggerPrint Si se debe abrir automáticamente el diálogo de impresión
   */
  static async htmlToPdf(
    htmlContent: string,
    fileName: string = 'documento.pdf',
    autoTriggerPrint: boolean = true
  ): Promise<Window | null> {
    return generatePdfFromHtml(htmlContent, fileName, autoTriggerPrint);
  }

  /**
   * Descarga una factura como PDF
   * @param invoiceId ID de la factura
   * @param invoiceNumber Número de factura para el nombre del archivo
   */
  static downloadInvoice(invoiceId: number | string, invoiceNumber?: string): Promise<void> {
    return this.downloadPdfFromApi(
      '/api/invoices',
      invoiceId,
      invoiceNumber ? `factura-${invoiceNumber}.pdf` : `factura-${invoiceId}.pdf`,
      true
    );
  }

  /**
   * Visualiza una factura como PDF
   * @param invoiceId ID de la factura
   * @param invoiceNumber Número de factura para el nombre del archivo
   */
  static viewInvoice(invoiceId: number | string, invoiceNumber?: string): Promise<Window | null> {
    return this.viewPdfFromApi(
      '/api/invoices',
      invoiceId,
      invoiceNumber ? `factura-${invoiceNumber}.pdf` : `factura-${invoiceId}.pdf`
    );
  }
}

export default PdfService;