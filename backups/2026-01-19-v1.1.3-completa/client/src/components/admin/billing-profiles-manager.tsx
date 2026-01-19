import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { BillingProfile } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { formatAddress } from '@/lib/ethereum';
import { Loader2, Search, Eye, Check, X, Edit, Mail, Building, User, Phone } from 'lucide-react';
import { getSession, login } from '@/lib/auth-service';

interface BillingProfilesManagerProps {
  adminWalletAddress: string;
}

export default function BillingProfilesManager({ adminWalletAddress }: BillingProfilesManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<BillingProfile | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BillingProfile | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  // Verificar la sesión cuando se monta el componente
  useEffect(() => {
    const checkAndEnsureSession = async () => {
      try {
        // Verificar si hay una sesión activa
        const sessionData = await getSession();
        
        // Si no hay sesión, intentar iniciar sesión automáticamente
        if (!sessionData.isLoggedIn && adminWalletAddress) {
          console.log("No hay sesión activa, intentando iniciar sesión con:", adminWalletAddress);
          const loginResult = await login(adminWalletAddress);
          
          if (loginResult.success) {
            console.log("Inicio de sesión exitoso:", loginResult);
            // Invalidar consultas para forzar recarga
            await queryClient.invalidateQueries({ queryKey: ['/api/admin/billing-profiles'] });
          } else {
            console.error("No se pudo iniciar sesión automáticamente");
            toast({
              title: "Error de sesión",
              description: "Se requiere conectar el wallet para acceder a esta sección",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkAndEnsureSession();
  }, [adminWalletAddress, queryClient, toast]);
  
  // Verificar si el usuario es administrador
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
  console.log('📋 BillingProfilesManager verificando admin:', isAdmin);

  // Cargar perfiles de facturación
  const { data: profiles, isLoading, error, refetch } = useQuery<BillingProfile[]>({
    queryKey: ['/api/admin/billing-profiles'],
    queryFn: async () => {
      try {
        // Asegurar que enviamos el encabezado de admin
        const customHeaders: Record<string, string> = {
          'x-is-admin': 'true'
        };
        
        // Añadir el wallet address si está disponible
        if (adminWalletAddress) {
          customHeaders['x-wallet-address'] = adminWalletAddress;
        }
        
        // Realizar la solicitud con los encabezados personalizados
        const data = await apiRequest<BillingProfile[]>(
          'GET', 
          '/api/admin/billing-profiles', 
          undefined, 
          { headers: customHeaders }
        );
        
        return data || [];
      } catch (error) {
        console.error('Error cargando perfiles de facturación:', error);
        throw error;
      }
    },
    enabled: !!adminWalletAddress && !isCheckingSession && isAdmin,
  });

  // Filtrar perfiles según la búsqueda
  const filteredProfiles = profiles?.filter(profile => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      profile.walletAddress.toLowerCase().includes(query) ||
      profile.companyName?.toLowerCase().includes(query) ||
      profile.fullName?.toLowerCase().includes(query) ||
      profile.email?.toLowerCase().includes(query) ||
      profile.taxId?.toLowerCase().includes(query)
    );
  });

  // Ver detalles del perfil
  const handleViewDetails = (profile: BillingProfile) => {
    setSelectedProfile(profile);
    setViewDialogOpen(true);
  };

  // Editar perfil
  const handleEditProfile = (profile: BillingProfile) => {
    setEditingProfile(profile);
    setEditDialogOpen(true);
  };

  // Guardar cambios del perfil editado
  const handleSaveProfile = async (updatedProfile: Partial<BillingProfile>) => {
    if (!editingProfile) return;

    try {
      // Verificar que la sesión está activa antes de hacer la petición
      const sessionData = await getSession();
      
      if (!sessionData.isLoggedIn) {
        console.log("No hay sesión activa, intentando iniciar sesión con:", adminWalletAddress);
        const loginResult = await login(adminWalletAddress);
        
        if (!loginResult.success) {
          toast({
            title: 'Error de sesión',
            description: 'No se pudo iniciar sesión para realizar esta acción.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Asegurar que enviamos los encabezados de admin
      const customHeaders: Record<string, string> = {
        'x-is-admin': 'true'
      };
      
      // Añadir el wallet address si está disponible
      if (adminWalletAddress) {
        customHeaders['x-wallet-address'] = adminWalletAddress;
      }
      
      // Actualizar el perfil
      await apiRequest(
        'PUT', 
        `/api/admin/billing-profiles/${editingProfile.id}`, 
        updatedProfile,
        { headers: customHeaders }
      );
      
      // Actualizar la caché de consultas
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/billing-profiles'] });
      
      // Cerrar el diálogo de edición
      setEditDialogOpen(false);
      setEditingProfile(null);
      
      toast({
        title: 'Perfil actualizado',
        description: 'Los cambios se han guardado correctamente.',
      });
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios del perfil.',
        variant: 'destructive',
      });
    }
  };

  // Marcar un perfil como verificado o rechazado
  const handleUpdateVerification = async (profileId: number, status: 'Verified' | 'Rejected') => {
    try {
      // Verificar que la sesión está activa antes de hacer la petición
      const sessionData = await getSession();
      
      if (!sessionData.isLoggedIn) {
        console.log("No hay sesión activa, intentando iniciar sesión con:", adminWalletAddress);
        const loginResult = await login(adminWalletAddress);
        
        if (!loginResult.success) {
          toast({
            title: 'Error de sesión',
            description: 'No se pudo iniciar sesión para realizar esta acción.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Asegurar que enviamos los encabezados de admin
      const customHeaders: Record<string, string> = {
        'x-is-admin': 'true'
      };
      
      // Añadir el wallet address si está disponible
      if (adminWalletAddress) {
        customHeaders['x-wallet-address'] = adminWalletAddress;
      }
      
      // Ahora procedemos con la petición, la autenticación se maneja con los encabezados
      await apiRequest(
        'PUT', 
        `/api/admin/billing-profiles/${profileId}/verify`, 
        { status },
        { headers: customHeaders }
      );
      
      // Actualizar la caché de consultas
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/billing-profiles'] });
      
      toast({
        title: 'Perfil actualizado',
        description: `El perfil ha sido ${status === 'Verified' ? 'verificado' : 'rechazado'} correctamente.`,
      });
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de verificación del perfil.',
        variant: 'destructive',
      });
    }
  };

  // Si está cargando
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Si hay un error
  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-2">Error al cargar los perfiles de facturación</p>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </div>
    );
  }

  // Renderizar la lista de perfiles
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Perfiles de Facturación</CardTitle>
          <CardDescription>
            Administra los perfiles de facturación de los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center">
            <Search className="mr-2 h-4 w-4 opacity-50" />
            <Input
              placeholder="Buscar por dirección, nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {!filteredProfiles?.length ? (
            <div className="text-center p-8 text-muted-foreground">
              {searchQuery 
                ? 'No se encontraron perfiles que coincidan con la búsqueda'
                : 'No hay perfiles de facturación registrados'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-mono">{formatAddress(profile.walletAddress)}</TableCell>
                      <TableCell>{profile.companyName || profile.fullName || 'No especificado'}</TableCell>
                      <TableCell>{profile.email || 'No especificado'}</TableCell>
                      <TableCell>
                        {profile.verificationStatus === 'Verified' ? (
                          <Badge className="bg-green-500">Verificado</Badge>
                        ) : profile.verificationStatus === 'Rejected' ? (
                          <Badge className="bg-red-500">Rechazado</Badge>
                        ) : (
                          <Badge className="bg-yellow-500">Pendiente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleViewDetails(profile)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEditProfile(profile)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {profile.verificationStatus !== 'Verified' && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="bg-green-50 hover:bg-green-100 text-green-600"
                              onClick={() => handleUpdateVerification(profile.id, 'Verified')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {profile.verificationStatus !== 'Rejected' && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="bg-red-50 hover:bg-red-100 text-red-600"
                              onClick={() => handleUpdateVerification(profile.id, 'Rejected')}
                            >
                              <X className="h-4 w-4" />
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
        </CardContent>
      </Card>

      {/* Diálogo para ver detalles del perfil */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Perfil de Facturación</DialogTitle>
            <DialogDescription>
              Información completa del perfil de facturación
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Dirección de Wallet</Label>
                  <div className="font-mono text-sm">{selectedProfile.walletAddress}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Estado de Verificación</Label>
                  <div>
                    {selectedProfile.verificationStatus === 'Verified' ? (
                      <Badge className="bg-green-500">Verificado</Badge>
                    ) : selectedProfile.verificationStatus === 'Rejected' ? (
                      <Badge className="bg-red-500">Rechazado</Badge>
                    ) : (
                      <Badge className="bg-yellow-500">Pendiente</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">Empresa</Label>
                </div>
                <div className="text-sm">{selectedProfile.companyName || 'No especificado'}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">Contacto</Label>
                </div>
                <div className="text-sm">{selectedProfile.fullName || 'No especificado'}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">Email</Label>
                </div>
                <div className="text-sm">{selectedProfile.email || 'No especificado'}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">Teléfono</Label>
                </div>
                <div className="text-sm">{selectedProfile.phoneNumber || 'No especificado'}</div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">ID Fiscal / NIF</Label>
                <div className="text-sm">{selectedProfile.taxId || 'No especificado'}</div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Dirección</Label>
                <div className="text-sm">{selectedProfile.address || 'No especificada'}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Ciudad</Label>
                  <div className="text-sm">{selectedProfile.city || 'No especificada'}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Código Postal</Label>
                  <div className="text-sm">{selectedProfile.postalCode || 'No especificado'}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">País</Label>
                  <div className="text-sm">{selectedProfile.country || 'No especificado'}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Notas Adicionales</Label>
                <div className="text-sm">{selectedProfile.notes || 'Sin notas'}</div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-end space-x-2">
            {selectedProfile && selectedProfile.verificationStatus !== 'Verified' && (
              <Button
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-600"
                onClick={() => {
                  handleUpdateVerification(selectedProfile.id, 'Verified');
                  setViewDialogOpen(false);
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Verificar Perfil
              </Button>
            )}
            
            {selectedProfile && selectedProfile.verificationStatus !== 'Rejected' && (
              <Button
                variant="outline"
                className="bg-red-50 hover:bg-red-100 text-red-600"
                onClick={() => {
                  handleUpdateVerification(selectedProfile.id, 'Rejected');
                  setViewDialogOpen(false);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Rechazar Perfil
              </Button>
            )}
            
            <Button variant="secondary" onClick={() => setViewDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar perfil */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Perfil de Facturación</DialogTitle>
            <DialogDescription>
              Modifica la información del perfil de facturación
            </DialogDescription>
          </DialogHeader>
          
          {editingProfile && (
            <EditProfileForm 
              profile={editingProfile}
              onSave={handleSaveProfile}
              onCancel={() => {
                setEditDialogOpen(false);
                setEditingProfile(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Componente para el formulario de edición
function EditProfileForm({ 
  profile, 
  onSave, 
  onCancel 
}: { 
  profile: BillingProfile;
  onSave: (updatedProfile: Partial<BillingProfile>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    companyName: profile.companyName || '',
    fullName: profile.fullName || '',
    email: profile.email || '',
    phoneNumber: profile.phoneNumber || '',
    taxId: profile.taxId || '',
    address: profile.address || '',
    city: profile.city || '',
    postalCode: profile.postalCode || '',
    country: profile.country || '',
    notes: profile.notes || '',
    verificationStatus: profile.verificationStatus || 'Pending'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nombre de Empresa</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Nombre de la empresa"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre Completo</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Nombre completo del contacto"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Teléfono</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="+34 123 456 789"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxId">ID Fiscal / NIF</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => handleInputChange('taxId', e.target.value)}
            placeholder="NIF, CIF o número fiscal"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="España, Francia, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Calle, número, piso..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Madrid, Barcelona, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Código Postal</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            placeholder="28001, 08001, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas Adicionales</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Información adicional..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="verificationStatus">Estado de Verificación</Label>
        <select
          id="verificationStatus"
          value={formData.verificationStatus}
          onChange={(e) => handleInputChange('verificationStatus', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="Pending">Pendiente</option>
          <option value="Verified">Verificado</option>
          <option value="Rejected">Rechazado</option>
        </select>
      </div>

      <DialogFooter className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Cambios
        </Button>
      </DialogFooter>
    </form>
  );
}