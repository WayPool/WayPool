import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BillingProfile } from '@shared/schema';
import { getAllBillingProfiles, getBillingProfileById } from '@/lib/billing-profile-service';
import { InvoiceService } from '@/lib/invoice-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Search, ChevronRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserBillingProfileForm } from './user-billing-profile-form';

interface AdminBillingProfilesDirectoryProps {
  onSelectProfile?: (profile: BillingProfile) => void;
  onAssignToInvoice?: (profileId: number, invoiceId: number) => void;
  invoiceId?: number;
  closeAfterSelection?: boolean;
}

export function AdminBillingProfilesDirectory({ 
  onSelectProfile, 
  onAssignToInvoice,
  invoiceId,
  closeAfterSelection = false
}: AdminBillingProfilesDirectoryProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [detailProfile, setDetailProfile] = useState<BillingProfile | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Cargar todos los perfiles de facturación (solo admin)
  const { data: profiles, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/admin/billing-profiles'],
    queryFn: () => getAllBillingProfiles(),
  });
  
  // Filtrar los perfiles según la búsqueda
  const filteredProfiles = profiles?.filter(profile => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      profile.fullName?.toLowerCase().includes(query) ||
      profile.companyName?.toLowerCase().includes(query) ||
      profile.walletAddress.toLowerCase().includes(query) ||
      profile.taxId?.toLowerCase().includes(query) ||
      profile.email?.toLowerCase().includes(query)
    );
  });
  
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
        title: 'Error',
        description: 'No se ha especificado una factura para asignar el perfil',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsAssigning(true);
      
      // Llamar al servicio para asignar el perfil a la factura
      await InvoiceService.assignBillingProfile(invoiceId, profileId);
      
      toast({
        title: 'Perfil asignado',
        description: 'El perfil de facturación ha sido asignado correctamente a la factura',
      });
      
      // Notificar al componente padre si es necesario
      if (onAssignToInvoice) {
        onAssignToInvoice(profileId, invoiceId);
      }
      
      // Cerrar el detalle si está abierto
      setDetailProfile(null);
    } catch (error) {
      console.error('Error al asignar perfil a factura:', error);
      
      toast({
        title: 'Error',
        description: 'No se pudo asignar el perfil a la factura',
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
          <h3 className="text-lg font-medium">Error al cargar los perfiles</h3>
          <p className="text-muted-foreground">
            No se pudieron cargar los perfiles de facturación. Intente nuevamente.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      );
    }
    
    if (profiles && profiles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No hay perfiles</h3>
          <p className="text-muted-foreground">
            No se han encontrado perfiles de facturación en el sistema.
          </p>
        </div>
      );
    }
    
    if (filteredProfiles && filteredProfiles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Search className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No hay resultados</h3>
          <p className="text-muted-foreground">
            No se encontraron perfiles que coincidan con su búsqueda.
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
          <CardTitle>Directorio de perfiles de facturación</CardTitle>
          <CardDescription>
            Administre los perfiles de facturación de los usuarios
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Barra de búsqueda */}
          <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
            <Input 
              type="text" 
              placeholder="Buscar por nombre, wallet, NIF..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
          
          {/* Tabla de perfiles */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Cargando perfiles...</span>
            </div>
          ) : (
            <>
              {renderStatusMessage() || (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>NIF/CIF</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProfiles?.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">
                            {profile.fullName}
                            {profile.companyName && (
                              <div className="text-sm text-muted-foreground">
                                {profile.companyName}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {profile.walletAddress.substring(0, 6)}...{profile.walletAddress.substring(38)}
                          </TableCell>
                          <TableCell>{profile.taxId || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              profile.verificationStatus === 'Verified' 
                                ? 'default' 
                                : profile.verificationStatus === 'Rejected'
                                  ? 'destructive'
                                  : 'outline'
                            }>
                              {profile.verificationStatus === 'Verified' 
                                ? 'Verificado' 
                                : profile.verificationStatus === 'Rejected'
                                  ? 'Rechazado'
                                  : 'Pendiente'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetail(profile)}
                              >
                                Ver
                              </Button>
                              
                              {invoiceId && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleAssignToInvoice(profile.id)}
                                  disabled={isAssigning}
                                >
                                  {isAssigning && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                  Asignar
                                </Button>
                              )}
                              
                              {onSelectProfile && !invoiceId && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleSelectProfile(profile)}
                                  className="ml-2"
                                >
                                  Seleccionar <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
            <DialogTitle>Detalle de perfil de facturación</DialogTitle>
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
                    Asignar a factura
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