/**
 * Componente para descargar una factura como PDF
 * Utiliza una solución basada en HTML-a-PDF en el cliente
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceService } from '@/lib/invoice-service';
import { useTranslation } from '@/hooks/use-translation';
import { generatePdfFromHtml } from './invoice-html-to-pdf';

interface InvoicePdfDownloadProps {
  invoiceId: number;
  invoiceNumber: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function InvoicePdfDownload({
  invoiceId,
  invoiceNumber,
  buttonVariant = 'default',
  buttonSize = 'default',
  className = '',
}: InvoicePdfDownloadProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Obtenemos el HTML de la factura
      const response = await fetch(`/api/invoices/${invoiceId}/pdf?download=false`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener el HTML: ${response.statusText}`);
      }
      
      // Convertimos la respuesta a texto HTML
      const htmlContent = await response.text();
      
      // Generamos y descargamos el PDF a partir del HTML
      await generatePdfFromHtml(
        htmlContent, 
        `invoice-${invoiceNumber}.pdf`
      );
      
      toast({
        title: t('PDF descargado'),
        description: t('La factura #{number} ha sido descargada como PDF').replace(
          '{number}', 
          invoiceNumber
        ),
      });
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast({
        title: t('Error'),
        description: t('No se pudo descargar el PDF de la factura'),
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant={buttonVariant}
      size={buttonSize}
      className={className}
    >
      {isDownloading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      {t('Descargar PDF')}
    </Button>
  );
}