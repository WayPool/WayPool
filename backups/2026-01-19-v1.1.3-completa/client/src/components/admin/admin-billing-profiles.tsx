import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { getAllBillingProfiles, deleteBillingProfile } from '@/lib/billing-profile-service';
import { BillingProfile } from '@shared/schema';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AdminBillingProfiles() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<BillingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para diálogos
  const [selectedProfile, setSelectedProfile] = useState<BillingProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Cargar perfiles
  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      try {
        const data = await getAllBillingProfiles();
        setProfiles(data);
      } catch (error) {
        console.error('Error al cargar perfiles de facturación:', error);
        toast({
          title: t('admin.errorLoadingProfiles'),
          description: t('admin.errorLoadingProfilesDesc'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfiles();
  }, [t, toast]);
  
  // Filtrar perfiles por búsqueda
  const filteredProfiles = searchQuery.trim() === ''
    ? profiles
    : profiles.filter(profile => 
        profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.taxId.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Eliminar perfil
  const handleDelete = async () => {
    if (!selectedProfile) return;
    
    try {
      const success = await deleteBillingProfile(selectedProfile.id);
      
      if (success) {
        // Actualizar la lista local eliminando el perfil
        setProfiles(prevProfiles => 
          prevProfiles.filter(p => p.id !== selectedProfile.id)
        );
        
        toast({
          title: t('admin.profileDeleted'),
          description: t('admin.profileDeletedDesc'),
        });
      } else {
        throw new Error('Error al eliminar el perfil');
      }
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      toast({
        title: t('admin.errorDeletingProfile'),
        description: t('admin.errorDeletingProfileDesc'),
        variant: 'destructive',
      });
    } finally {
      setSelectedProfile(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Manejadores de acciones
  const openDetailDialog = (profile: BillingProfile) => {
    setSelectedProfile(profile);
    setIsDetailOpen(true);
  };
  
  const openDeleteDialog = (profile: BillingProfile) => {
    setSelectedProfile(profile);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.billingProfiles')}</CardTitle>
          <CardDescription>{t('admin.billingProfilesDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda */}
          <div className="flex items-center mb-6">
            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery.trim() ? t('admin.noProfilesFound') : t('admin.noProfiles')}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('billing.fullName')}</TableHead>
                    <TableHead>{t('billing.company')}</TableHead>
                    <TableHead>{t('billing.taxId')}</TableHead>
                    <TableHead>{t('common.walletAddress')}</TableHead>
                    <TableHead>{t('billing.country')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.fullName}</TableCell>
                      <TableCell>{profile.company || '-'}</TableCell>
                      <TableCell>{profile.taxId}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {profile.walletAddress.substring(0, 6)}...
                        {profile.walletAddress.substring(profile.walletAddress.length - 4)}
                      </TableCell>
                      <TableCell>{profile.country}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetailDialog(profile)}
                            title={t('common.view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(profile)}
                            title={t('common.delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
      
      {/* Diálogo de detalles del perfil */}
      {selectedProfile && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{t('admin.profileDetails')}</DialogTitle>
              <DialogDescription>
                {t('admin.profileDetailsDesc')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.fullName')}</h4>
                <p>{selectedProfile.fullName}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.company')}</h4>
                <p>{selectedProfile.company || '-'}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.taxId')}</h4>
                <p>{selectedProfile.taxId}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('common.walletAddress')}</h4>
                <p className="font-mono text-xs break-all">{selectedProfile.walletAddress}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.address')}</h4>
                <p>{selectedProfile.address}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.city')}</h4>
                <p>{selectedProfile.city}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.postalCode')}</h4>
                <p>{selectedProfile.postalCode || '-'}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.country')}</h4>
                <p>{selectedProfile.country}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.phoneNumber')}</h4>
                <p>{selectedProfile.phoneNumber || '-'}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.email')}</h4>
                <p>{selectedProfile.email || '-'}</p>
              </div>
            </div>
            
            {selectedProfile.notes && (
              <div className="space-y-1 py-2">
                <h4 className="text-sm font-medium text-muted-foreground">{t('billing.notes')}</h4>
                <p className="text-sm">{selectedProfile.notes}</p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                {t('common.close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.confirmDeleteProfileDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}