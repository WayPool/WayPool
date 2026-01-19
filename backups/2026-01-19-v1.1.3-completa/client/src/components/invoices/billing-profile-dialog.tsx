import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserBillingProfileForm } from '@/components/billing-profiles/user-billing-profile-form';
import { BillingProfile } from '@shared/schema';
import { useTranslation } from '@/hooks/use-translation';

interface BillingProfileDialogProps {
  walletAddress: string;
}

export function BillingProfileDialog({ walletAddress }: BillingProfileDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const handleProfileSaved = (profile: BillingProfile) => {
    // Close the dialog once the profile is saved
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('Perfil de facturación')}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('Perfil de facturación')}</DialogTitle>
          <DialogDescription>
            {t('Completa tu información de facturación para agilizar el proceso de generación de facturas')}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <UserBillingProfileForm 
            walletAddress={walletAddress} 
            onProfileSaved={handleProfileSaved}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}