import { useState, useEffect } from 'react';
import { BillingProfile } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminBillingProfilesDirectory } from '@/components/billing-profiles/admin-billing-profiles-directory';
import { UserBillingProfilesDirectory } from '@/components/billing-profiles/user-billing-profiles-directory';
import { UserBillingProfileForm } from '@/components/billing-profiles/user-billing-profile-form';
import { getBillingProfileById } from '@/lib/billing-profile-service';
import { InvoiceService } from '@/lib/invoice-service';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { BuildingIcon, PlusCircleIcon, RefreshCw, UserIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface BillingProfileSelectorProps {
  invoiceId: number;
  walletAddress: string;
  initialBillingProfileId?: number | null;
  onProfileSelected?: (profile: BillingProfile) => void;
  onProfileAssigned?: (profileId: number) => Promise<void>;
  onClose?: () => void;
}

export function BillingProfileSelector({
  invoiceId,
  walletAddress,
  initialBillingProfileId,
  onProfileSelected,
  onProfileAssigned,
  onClose
}: BillingProfileSelectorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('existing');
  const [selectedProfile, setSelectedProfile] = useState<BillingProfile | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Obtener el perfil inicial si está establecido
  useEffect(() => {
    const loadInitialProfile = async () => {
      if (initialBillingProfileId) {
        try {
          setLoading(true);
          const profile = await getBillingProfileById(initialBillingProfileId);
          setSelectedProfile(profile);
        } catch (error) {
          console.error('Error al cargar el perfil inicial:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadInitialProfile();
  }, [initialBillingProfileId]);
  
  // Manejar la selección de un perfil existente
  const handleSelectExistingProfile = (profile: BillingProfile) => {
    setSelectedProfile(profile);
    
    if (onProfileSelected) {
      onProfileSelected(profile);
    }
    
    toast({
      title: t('Perfil seleccionado'),
      description: t('El perfil de facturación ha sido seleccionado correctamente')
    });
    
    setIsOpen(false);
  };
  
  // Manejar la creación de un nuevo perfil
  const handleCreateNewProfile = async (profile: BillingProfile) => {
    setSelectedProfile(profile);
    
    if (onProfileSelected) {
      onProfileSelected(profile);
    }
    
    // Asignar el nuevo perfil a la factura si hay un ID de factura
    if (invoiceId) {
      try {
        setLoading(true);
        
        // Si se proporcionó onProfileAssigned, usar esa función
        if (onProfileAssigned) {
          await onProfileAssigned(profile.id);
        } else {
          // En caso contrario, usar el comportamiento por defecto
          await InvoiceService.assignBillingProfile(invoiceId, profile.id);
        }
        
        toast({
          title: t('Perfil creado y asignado'),
          description: t('El nuevo perfil de facturación ha sido creado y asignado a la factura')
        });
      } catch (error) {
        console.error('Error al asignar el nuevo perfil:', error);
        
        toast({
          title: t('Error'),
          description: t('El perfil se creó correctamente pero no se pudo asignar a la factura'),
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: t('Perfil creado'),
        description: t('El nuevo perfil de facturación ha sido creado correctamente')
      });
    }
    
    setIsOpen(false);
  };

  // Manejar la asignación directa de un perfil a la factura
  const handleAssignProfile = async (profileId: number, invoiceId: number) => {
    try {
      setLoading(true);
      
      // Si se proporcionó onProfileAssigned, usar esa función
      if (onProfileAssigned) {
        await onProfileAssigned(profileId);
      } else {
        // En caso contrario, usar el comportamiento por defecto
        await InvoiceService.assignBillingProfile(invoiceId, profileId);
      }
      
      toast({
        title: t('Perfil asignado'),
        description: t('El perfil de facturación ha sido asignado correctamente a la factura')
      });
      
      // Cargar el perfil completo
      const profile = await getBillingProfileById(profileId);
      setSelectedProfile(profile);
      
      if (onProfileSelected) {
        onProfileSelected(profile);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error al asignar el perfil:', error);
      
      toast({
        title: t('Error'),
        description: t('No se pudo asignar el perfil a la factura'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Función para mostrar la información resumida del perfil seleccionado
  const renderSelectedProfileSummary = () => {
    if (!selectedProfile) {
      return (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="p-3 mb-2 rounded-full bg-muted">
            <BuildingIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{t('No hay perfil de facturación seleccionado')}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => setIsOpen(true)}
          >
            {t('Seleccionar perfil')}
          </Button>
        </div>
      );
    }
    
    return (
      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <div className="font-medium text-lg">
            {selectedProfile.companyName || selectedProfile.fullName}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsOpen(true)}
          >
            {t('Cambiar')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t('NIF/CIF')}:</span> {selectedProfile.taxId || '-'}
          </div>
          <div>
            <span className="text-muted-foreground">{t('Email')}:</span> {selectedProfile.email || '-'}
          </div>
          <div>
            <span className="text-muted-foreground">{t('Dirección')}:</span> {selectedProfile.address || '-'}
          </div>
          <div>
            <span className="text-muted-foreground">{t('Ciudad')}:</span> {selectedProfile.city || '-'}, {selectedProfile.country || '-'}
          </div>
        </div>
      </div>
    );
  };
  
  // Verificar si el usuario es administrador
  const { data: isAdmin = false } = useQuery({
    queryKey: ['/api/user/admin-status'],
    queryFn: async () => {
      const response = await fetch(`/api/user/${walletAddress}/admin-status`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.isAdmin;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('Datos de facturación')}</h3>
        {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      
      {renderSelectedProfileSummary()}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('Seleccionar perfil de facturación')}</DialogTitle>
            <DialogDescription>
              {t('Selecciona un perfil existente o crea uno nuevo para la factura')}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="existing">
                <UserIcon className="h-4 w-4 mr-2" />
                {t('Perfiles existentes')}
              </TabsTrigger>
              <TabsTrigger value="new">
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                {t('Crear nuevo perfil')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="pt-4">
              {isAdmin ? (
                <AdminBillingProfilesDirectory 
                  invoiceId={invoiceId}
                  onSelectProfile={handleSelectExistingProfile}
                  onAssignToInvoice={handleAssignProfile}
                  closeAfterSelection={true}
                />
              ) : (
                <UserBillingProfilesDirectory 
                  invoiceId={invoiceId}
                  walletAddress={walletAddress}
                  onSelectProfile={handleSelectExistingProfile}
                  onAssignToInvoice={handleAssignProfile}
                  closeAfterSelection={true}
                />
              )}
            </TabsContent>
            
            <TabsContent value="new" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Crear nuevo perfil de facturación')}</CardTitle>
                  <CardDescription>
                    {t('Introduce los datos para el nuevo perfil de facturación')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserBillingProfileForm
                    walletAddress={walletAddress}
                    onProfileSaved={handleCreateNewProfile}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}