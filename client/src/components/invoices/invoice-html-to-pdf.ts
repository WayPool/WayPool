/**
 * Utilidades para generar PDFs de facturas a partir de HTML
 * Usando la funcionalidad de impresión del navegador
 */

/**
 * Opciones para personalizar la generación de PDF
 */
export interface HtmlToPdfOptions {
  /** Título que se muestra en la ventana de impresión */
  title?: string;
  /** Si se debe activar automáticamente el diálogo de impresión */
  autoTriggerPrint?: boolean;
  /** Si la ventana debe cerrarse después de imprimir */
  closeAfterPrint?: boolean;
  /** Estilos CSS adicionales específicos para la impresión */
  additionalStyles?: string;
  /** Si se debe establecer el tamaño de página a A4 automáticamente */
  setA4Size?: boolean;
}

/**
 * Toma HTML y lo imprime como PDF
 * @param htmlContent HTML para convertir a PDF
 * @param fileName Nombre del archivo PDF
 * @param autoTriggerPrint Si se debe iniciar automáticamente el diálogo de impresión
 */
export const generatePdfFromHtml = async (
  htmlContent: string,
  fileName: string = 'documento.pdf',
  autoTriggerPrint: boolean = true
): Promise<Window | null> => {
  try {
    // Preparar el HTML con el nombre del archivo y opciones
    const preparedHtml = prepareHtmlForPrint(htmlContent, {
      title: fileName,
      autoTriggerPrint,
      setA4Size: true
    });
    
    // Abrir una nueva ventana y escribir el contenido
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('No se pudo abrir la ventana de impresión. Comprueba que no está bloqueada por el navegador.');
    }
    
    printWindow.document.write(preparedHtml);
    printWindow.document.close();
    
    // Esperar a que la ventana se cargue completamente
    return new Promise<Window | null>((resolve) => {
      printWindow.onload = () => {
        if (autoTriggerPrint) {
          printWindow.print();
        }
        resolve(printWindow);
      };
    });
  } catch (error) {
    console.error('Error al generar PDF desde HTML:', error);
    throw error;
  }
};

/**
 * Convierte HTML a una ventana de impresión para PDF con más opciones
 * @param htmlContent HTML para mostrar en ventana de impresión
 * @param title Título de la ventana
 * @param options Opciones adicionales para personalizar la generación del PDF
 */
export const printHtmlAsPdf = (
  htmlContent: string,
  title: string = 'Documento',
  options: HtmlToPdfOptions = {}
): Promise<Window | null> => {
  const preparedHtml = prepareHtmlForPrint(htmlContent, {
    title,
    ...options
  });
  
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('No se pudo abrir la ventana de impresión. Comprueba que no está bloqueada por el navegador.');
  }
  
  printWindow.document.write(preparedHtml);
  printWindow.document.close();
  
  return new Promise<Window | null>((resolve) => {
    printWindow.onload = () => {
      if (options.autoTriggerPrint) {
        printWindow.print();
        
        // Si se configuró para cerrar después de imprimir
        if (options.closeAfterPrint) {
          printWindow.addEventListener('afterprint', () => {
            printWindow.close();
          });
        }
      }
      resolve(printWindow);
    };
  });
};

/**
 * Prepara el contenido HTML para PDF agregando estilos y optimizaciones
 * @param htmlContent HTML original
 * @param options Opciones de preparación
 * @returns HTML preparado para impresión como PDF
 */
const prepareHtmlForPrint = (
  htmlContent: string,
  options: HtmlToPdfOptions = {}
): string => {
  const {
    title = 'Documento PDF',
    autoTriggerPrint = false,
    additionalStyles = '',
    setA4Size = true
  } = options;
  
  // Estilos base para la impresión
  const printStyles = `
    @page {
      margin: 15mm;
      ${setA4Size ? 'size: A4 portrait;' : ''}
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
      line-height: 1.5;
    }
    .invoice-container {
      max-width: 100%;
      padding: 10mm;
      margin: 0 auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    .text-right {
      text-align: right;
    }
    .font-bold {
      font-weight: 600;
    }
    .break-all {
      word-break: break-all;
    }
    .text-sm {
      font-size: 0.875rem;
    }
    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 10px 0;
      text-align: center;
      font-size: 0.75rem;
    }
    ${additionalStyles}
  `;
  
  // Script para activar la impresión automática si se solicita
  const printScript = autoTriggerPrint ? `
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 1000);
      };
    </script>
  ` : '';
  
  // Verificar si el contenido ya tiene estructura HTML completa
  const hasHtmlStructure = htmlContent.includes('<html') && htmlContent.includes('</html>');
  
  if (hasHtmlStructure) {
    // Modificar el HTML existente para agregarle los estilos y scripts
    return htmlContent
      .replace('<head>', `<head>
        <title>${title}</title>
        <style>${printStyles}</style>`)
      .replace('</head>', `${printScript}</head>`);
  } else {
    // Crear estructura HTML completa
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          ${printStyles}
        </style>
        ${printScript}
      </head>
      <body>
        <div class="invoice-container">
          ${htmlContent}
        </div>
      </body>
      </html>
    `;
  }
};