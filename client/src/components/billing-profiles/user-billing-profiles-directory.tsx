import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BillingProfile } from '@shared/schema';
import { getUserBillingProfile } from '@/lib/billing-profile-service';
import { InvoiceService } from '@/lib/invoice-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Search, ChevronRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserBillingProfileForm } from './user-billing-profile-form';
import { useTranslation } from '@/hooks/use-translation';

interface UserBillingProfilesDirectoryProps {
  onSelectProfile?: (profile: BillingProfile) => void;
  onAssignToInvoice?: (profileId: number, invoiceId: number) => void;
  invoiceId?: number;
  walletAddress: string;
  closeAfterSelection?: boolean;
}

export function UserBillingProfilesDirectory({ 
  onSelectProfile, 
  onAssignToInvoice,
  invoiceId,
  walletAddress,
  closeAfterSelection = false
}: UserBillingProfilesDirectoryProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [detailProfile, setDetailProfile] = useState<BillingProfile | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Cargar el perfil de facturación del usuario actual
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/billing-profile'],
    queryFn: () => getUserBillingProfile(walletAddress),
  });

  // Convertir el perfil único a un array para facilitar el renderizado
  const profiles = profile ? [profile] : [];
  
  // Seleccionar un perfil
  function handleSelectProfile(profile: BillingProfile) {
    if (onSelectProfile) {
      onSelectProfile(profile);
      
      if (closeAfterSelection) {
        // Cerrar el detalle si está abierto
        setDetailProfile(null);
      }
    }
  }
  
  // Ver detalle de un perfil
  function handleViewDetail(profile: BillingProfile) {
    setDetailProfile(profile);
  }
  
  // Cerrar el detalle
  function handleCloseDetail() {
    setDetailProfile(null);
  }
  
  // Asignar perfil a una factura
  async function handleAssignToInvoice(profileId: number) {
    if (!invoiceId) {
      toast({
        title: t('Error'),
        description: t('No invoice has been specified to assign the profile'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsAssigning(true);
      
      // Call the service to assign the profile to the invoice
      await InvoiceService.assignBillingProfile(invoiceId, profileId);
      
      toast({
        title: t('Profile assigned'),
        description: t('The billing profile has been successfully assigned to the invoice'),
      });
      
      // Notificar al componente padre si es necesario
      if (onAssignToInvoice) {
        onAssignToInvoice(profileId, invoiceId);
      }
      
      // Close the detail if it's open
      setDetailProfile(null);
    } catch (error) {
      console.error('Error assigning profile to invoice:', error);
      
      toast({
        title: t('Error'),
        description: t('Could not assign the profile to the invoice'),
        variant: 'destructive',
      });
    } finally {
      setIsAssigning(false);
    }
  }
  
  // Renderizar un mensaje si hay un error o no hay perfiles
  function renderStatusMessage() {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <XCircle className="h-10 w-10 text-destructive mb-2" />
          <h3 className="text-lg font-medium">{t('Error al cargar el perfil')}</h3>
          <p className="text-muted-foreground">
            {t('No se pudo cargar el perfil de facturación. Intente nuevamente.')}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            {t('Reintentar')}
          </Button>
        </div>
      );
    }
    
    if (!profile) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">{t('No hay perfil')}</h3>
          <p className="text-muted-foreground">
            {t('No tienes un perfil de facturación creado todavía.')}
          </p>
        </div>
      );
    }
    
    return null;
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('Tu perfil de facturación')}</CardTitle>
          <CardDescription>
            {t('Información utilizada para tus facturas')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Tabla de perfiles */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{t('Cargando perfil...')}</span>
            </div>
          ) : (
            <>
              {renderStatusMessage() || (
                <div className="space-y-6">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {profile.companyName || profile.fullName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {profile.walletAddress.substring(0, 6)}...{profile.walletAddress.substring(38)}
                          </p>
                        </div>
                        
                        <Badge variant={
                          profile.verificationStatus === 'Verified' 
                            ? 'default' 
                            : profile.verificationStatus === 'Rejected'
                              ? 'destructive'
                              : 'outline'
                        }>
                          {profile.verificationStatus === 'Verified' 
                            ? t('Verificado')
                            : profile.verificationStatus === 'Rejected'
                              ? t('Rechazado')
                              : t('Pendiente')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium">{t('NIF/CIF')}:</span> {profile.taxId || '-'}
                        </div>
                        <div>
                          <span className="font-medium">{t('Email')}:</span> {profile.email || '-'}
                        </div>
                        <div>
                          <span className="font-medium">{t('Dirección')}:</span> {profile.address || '-'}
                        </div>
                        <div>
                          <span className="font-medium">{t('Ciudad')}:</span> {profile.city || '-'}, {profile.country || '-'}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(profile)}
                        >
                          {t('Ver detalles')}
                        </Button>
                        
                        {invoiceId && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAssignToInvoice(profile.id)}
                            disabled={isAssigning}
                          >
                            {isAssigning && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            {t('Asignar')}
                          </Button>
                        )}
                        
                        {onSelectProfile && !invoiceId && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleSelectProfile(profile)}
                          >
                            {t('Seleccionar')} <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo para ver detalle de perfil */}
      <Dialog open={!!detailProfile} onOpenChange={(open) => !open && handleCloseDetail()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('Detalle de perfil de facturación')}</DialogTitle>
            <DialogDescription>
              {detailProfile?.walletAddress.substring(0, 6)}...{detailProfile?.walletAddress.substring(38)}
            </DialogDescription>
          </DialogHeader>
          
          {detailProfile && (
            <>
              <UserBillingProfileForm 
                profile={detailProfile} 
                walletAddress={detailProfile.walletAddress}
                readOnly 
              />
              
              {invoiceId && (
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => handleAssignToInvoice(detailProfile.id)}
                    disabled={isAssigning}
                  >
                    {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('Asignar a factura')}
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}