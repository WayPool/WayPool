import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { BillingProfile } from '@shared/schema';
import { getAllBillingProfiles } from '@/lib/billing-profile-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Search, User2 } from 'lucide-react';

interface ContactSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSelect: (profile: BillingProfile) => void;
}

export function ContactSelector({ open, onOpenChange, onContactSelect }: ContactSelectorProps) {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<BillingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cargar perfiles al abrir el selector
  useEffect(() => {
    const loadProfiles = async () => {
      if (!open) return;
      
      setIsLoading(true);
      try {
        const data = await getAllBillingProfiles();
        setProfiles(data);
      } catch (error) {
        console.error('Error al cargar perfiles de facturación:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfiles();
  }, [open]);
  
  // Filtrar perfiles por búsqueda
  const filteredProfiles = searchQuery.trim() === ''
    ? profiles
    : profiles.filter(profile => 
        profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.company && profile.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        profile.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.taxId.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Manejar selección de contacto
  const handleSelectContact = (profile: BillingProfile) => {
    if (profile) {
      onContactSelect(profile);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('Seleccionar Contacto')}</DialogTitle>
          <DialogDescription>
            {t('Selecciona un contacto para aplicar sus datos a la factura')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('Buscar por nombre, empresa, wallet o ID fiscal...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Nombre / Empresa')}</TableHead>
                  <TableHead>{t('ID Fiscal')}</TableHead>
                  <TableHead>{t('Wallet')}</TableHead>
                  <TableHead className="text-right">{t('Acciones')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex justify-center">
                        <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {searchQuery.trim() !== '' ? 
                        t('No se encontraron contactos con esos criterios de búsqueda') : 
                        t('No hay perfiles de facturación disponibles')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium">{profile.fullName}</div>
                          {profile.company && (
                            <div className="text-sm text-muted-foreground">{profile.company}</div>
                          )}
                          {profile.isDefault && (
                            <Badge variant="outline" className="mt-1 w-fit text-xs bg-indigo-500/10 text-indigo-500 border-indigo-300">
                              {t('Predeterminado')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{profile.taxId}</TableCell>
                      <TableCell>
                        <div className="font-mono text-xs truncate max-w-[120px]" title={profile.walletAddress}>
                          {profile.walletAddress.substring(0, 6)}...{profile.walletAddress.substring(profile.walletAddress.length - 4)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => handleSelectContact(profile)}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {t('Seleccionar')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('Cancelar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}