/**
 * Componente para visualizar el detalle de una factura
 * Permite ver toda la información y descargar el PDF
 */

import React, { useState, useEffect } from 'react';
import { Invoice, BillingProfile } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatDate, formatCurrency } from '@/lib/date-utils';
import { useTranslation } from '@/hooks/use-translation';
import { Separator } from '@/components/ui/separator';
import { ExternalLink as ExternalLinkIcon, X, Loader2, Building, User, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceService } from '@/lib/invoice-service';
import { PdfService } from '@/lib/pdf-service';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BillingProfileSelector } from './billing-profile-selector';

export interface InvoiceDetailViewProps {
  invoice?: Invoice;
  invoiceId?: number;
  onClose?: () => void;
  onEdit?: () => void;
  onDownload?: () => Promise<void>;
  walletAddress?: string; // Dirección de wallet del usuario actual
}

export function InvoiceDetailView({ invoice: propInvoice, invoiceId, onClose, onEdit, onDownload, walletAddress }: InvoiceDetailViewProps) {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [updatedInvoice, setUpdatedInvoice] = useState<Invoice | null>(null);
  const [isViewPdfLoading, setIsViewPdfLoading] = useState<boolean>(false);
  const [isDownloadPdfLoading, setIsDownloadPdfLoading] = useState<boolean>(false);
  
  // Si recibimos un ID pero no la factura, buscarla
  const { data: fetchedInvoice, isLoading: isInvoiceLoading, error, refetch } = useQuery({
    queryKey: ['/api/invoices', invoiceId],
    queryFn: () => invoiceId ? InvoiceService.getInvoiceById(invoiceId) : null,
    enabled: !!invoiceId && !propInvoice,
  });
  
  // Usar la factura pasada como prop o la obtenida por consulta o la actualizada
  const invoice = updatedInvoice || propInvoice || fetchedInvoice;

  // Función para manejar la asignación de un perfil de facturación a la factura
  const handleProfileAssigned = async (profileId: number) => {
    try {
      if (!invoice || !invoice.id) {
        toast({
          title: t('Error'),
          description: t('No se pudo asignar el perfil a la factura'),
          variant: 'destructive',
        });
        return;
      }

      const updatedInvoiceData = await InvoiceService.assignBillingProfile(invoice.id, profileId);
      setUpdatedInvoice(updatedInvoiceData);
      
      // Actualizar la consulta para reflejar los cambios
      if (invoiceId) {
        refetch();
      }
      
      toast({
        title: t('Perfil asignado'),
        description: t('El perfil de facturación ha sido asignado correctamente a la factura'),
      });
      
      // Volver a la pestaña de detalles
      setActiveTab('details');
    } catch (error) {
      console.error('Error al asignar perfil:', error);
      toast({
        title: t('Error'),
        description: t('No se pudo asignar el perfil a la factura'),
        variant: 'destructive',
      });
    }
  };
  
  // Realizamos una aserción de tipo para manejar los casos donde ya hemos verificado que invoice no es nulo
  // Específicamente, después de las verificaciones if (isInvoiceLoading) y if (!invoice)
  // TypeScript seguirá viendo a invoice como posiblemente nulo, por lo que usamos este tipo para el resto del código
  type NonNullInvoice = NonNullable<typeof invoice>;

  // Se eliminó la función handleOpenInvoiceView ya que ahora se usa directamente
  // un controlador de eventos en línea en el botón de "Ver factura"

  // Formatear el estado de la factura
  const getStatusLabel = (status: string) => {
    return t(status);
  };

  // Función segura para manejar el cierre
  const handleClose = () => {
    if (onClose) onClose();
  };

  // Mostrar estado de carga
  if (isInvoiceLoading) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{t('Cargando factura...')}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t('Cargando datos de la factura...')}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Mostrar error
  if (error || !invoice) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{t('Error al cargar factura')}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-destructive">{error ? error.message : t('No se encontró la factura solicitada')}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              {t('Cerrar')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // En este punto sabemos que invoice no es nulo (por el if (!invoice) anterior)
  // así que podemos hacer una aserción de tipo para los componentes
  const invoiceData = invoice as NonNullInvoice;
  
  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('Factura')} #{invoiceData.invoiceNumber}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              {t('Detalles de factura')}
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              {t('Perfil de facturación')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detalles básicos */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t('Detalles de la factura')}</h3>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">{t('Nº Factura')}:</span>
                  <span className="font-medium">{invoiceData.invoiceNumber}</span>
                  
                  <span className="text-muted-foreground">{t('Estado')}:</span>
                  <span className={`font-medium ${
                    invoiceData.status === 'Paid' || invoiceData.status === 'Active' 
                      ? 'text-green-600 dark:text-green-400' 
                      : invoiceData.status === 'Pending' 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-red-600 dark:text-red-400'
                  }`}>
                    {getStatusLabel(invoiceData.status)}
                  </span>
                  
                  <span className="text-muted-foreground">{t('Importe')}:</span>
                  <span className="font-medium">{formatCurrency(invoiceData.amount, 'USD', language)}</span>
                  
                  <span className="text-muted-foreground">{t('Método de pago')}:</span>
                  <span className="font-medium">{t(invoiceData.paymentMethod)}</span>
                  
                  <span className="text-muted-foreground">{t('Fecha de emisión')}:</span>
                  <span className="font-medium">{formatDate(invoiceData.issueDate, 'dd MMM yyyy', language)}</span>
                  
                  <span className="text-muted-foreground">{t('Fecha de vencimiento')}:</span>
                  <span className="font-medium">{formatDate(invoiceData.dueDate, 'dd MMM yyyy', language)}</span>
                  
                  {invoiceData.paidDate && (
                    <>
                      <span className="text-muted-foreground">{t('Fecha de pago')}:</span>
                      <span className="font-medium">{formatDate(invoiceData.paidDate, 'dd MMM yyyy', language)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Información del cliente */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t('Información del cliente')}</h3>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {invoiceData.clientName && (
                    <>
                      <span className="text-muted-foreground">{t('Nombre')}:</span>
                      <span className="font-medium">{invoiceData.clientName}</span>
                    </>
                  )}
                  
                  {invoiceData.clientTaxId && (
                    <>
                      <span className="text-muted-foreground">{t('ID Fiscal')}:</span>
                      <span className="font-medium">{invoiceData.clientTaxId}</span>
                    </>
                  )}
                  
                  {invoiceData.clientAddress && (
                    <>
                      <span className="text-muted-foreground">{t('Dirección')}:</span>
                      <span className="font-medium">{invoiceData.clientAddress}</span>
                    </>
                  )}
                  
                  {(invoiceData.clientCity || invoiceData.clientCountry) && (
                    <>
                      <span className="text-muted-foreground">{t('Ciudad/País')}:</span>
                      <span className="font-medium">
                        {[invoiceData.clientCity, invoiceData.clientCountry].filter(Boolean).join(', ')}
                      </span>
                    </>
                  )}
                  
                  <span className="text-muted-foreground">{t('Dirección de wallet')}:</span>
                  <span className="font-medium break-all">{invoiceData.walletAddress}</span>
                  
                  {invoiceData.positionId && (
                    <>
                      <span className="text-muted-foreground">{t('ID de posición')}:</span>
                      <span className="font-medium">{invoiceData.positionId}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Datos de pago */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{t('Datos de pago')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {invoiceData.transactionHash && (
                  <div>
                    <span className="text-muted-foreground block">{t('Hash de transacción')}:</span>
                    <span className="font-medium break-all">{invoiceData.transactionHash}</span>
                  </div>
                )}
                
                {invoiceData.bankReference && (
                  <div>
                    <span className="text-muted-foreground block">{t('Referencia bancaria')}:</span>
                    <span className="font-medium">{invoiceData.bankReference}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Información de la empresa */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{t('Información de la empresa')}</h3>
              
              <div className="text-sm space-y-2">
                <p><strong>ELYSIUM MEDIA FZCO</strong></p>
                <p>ID: 58510, Premises no. 58510 - 001</p>
                <p>IFZA Business Park, DDP, DUBAI, UAE</p>
              </div>
              
              <h4 className="font-medium mt-3">{t('Datos bancarios')}</h4>
              <div className="text-sm space-y-1">
                <p><strong>ELYSIUM MEDIA - FZCO</strong></p>
                <p>IBAN: AE590860000009839365601</p>
                <p>BIC: WIOBAEADXXX</p>
                <p>Etihad Airways Centre 5th Floor, Abu Dhabi, UAE</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            {walletAddress ? (
              <BillingProfileSelector 
                invoiceId={invoiceData.id} 
                walletAddress={walletAddress}
                onProfileAssigned={handleProfileAssigned}
              />
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md text-amber-700 dark:text-amber-300">
                <p>{t('No se puede gestionar el perfil de facturación porque no se ha proporcionado la dirección de wallet')}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose}>
            {t('Cerrar')}
          </Button>
          
          {/* Botones para editar y descargar la factura si se proporcionaron las funciones */}
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              {t('Editar')}
            </Button>
          )}
          
          <div className="flex space-x-2">
            <Button 
              onClick={async () => {
                setIsViewPdfLoading(true);
                try {
                  // Si se proporcionó onDownload, usarlo
                  if (onDownload) {
                    await onDownload();
                  } else {
                    // Usar el servicio de PDF para visualizar
                    await PdfService.viewInvoice(
                      invoiceData.id, 
                      invoiceData.invoiceNumber
                    );
                    
                    toast({
                      title: t('Factura abierta'),
                      description: t('Factura #{number} abierta en nueva pestaña').replace(
                        '{number}', 
                        invoiceData.invoiceNumber
                      ),
                    });
                  }
                } catch (error) {
                  console.error('Error al abrir PDF:', error);
                  toast({
                    title: t('Error'),
                    description: t('No se pudo abrir la factura'),
                    variant: 'destructive',
                  });
                } finally {
                  setIsViewPdfLoading(false);
                }
              }}
              disabled={isViewPdfLoading || isDownloadPdfLoading}
            >
              {isViewPdfLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
              )}
              {t('Ver factura')}
            </Button>
            
            <Button 
              variant="outline"
              onClick={async () => {
                setIsDownloadPdfLoading(true);
                try {
                  // Usar el servicio de PDF para descargar
                  await PdfService.downloadInvoice(
                    invoiceData.id, 
                    invoiceData.invoiceNumber
                  );
                  
                  toast({
                    title: t('Descargando factura'),
                    description: t('Factura #{number} descargada').replace(
                      '{number}', 
                      invoiceData.invoiceNumber
                    ),
                  });
                } catch (error) {
                  console.error('Error al descargar PDF:', error);
                  toast({
                    title: t('Error'),
                    description: t('No se pudo descargar la factura'),
                    variant: 'destructive',
                  });
                } finally {
                  setIsDownloadPdfLoading(false);
                }
              }}
              disabled={isViewPdfLoading || isDownloadPdfLoading}
            >
              {isDownloadPdfLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {t('Descargar PDF')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}