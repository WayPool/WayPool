import { useEffect } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { UserBillingProfileForm } from '@/components/billing-profiles/user-billing-profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutBasic } from '@/components/layout/layout-basic';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { APP_NAME } from '@/utils/app-config';

export default function BillingProfilePage() {
  // Get wallet connection status
  const { account, isConnected, setIsModalOpen } = useWallet();
  const { t } = useTranslation();
  
  // Use title for browser tab
  useEffect(() => {
    document.title = `${t('Mi Perfil de Facturación')} | ${APP_NAME}`;
  }, []);
  
  const handleConnect = () => {
    setIsModalOpen(true);
  };
  
  return (
    <LayoutBasic>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{t('Perfil de Facturación')}</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {!isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>{t('Perfil de facturación')}</CardTitle>
                <CardDescription>
                  {t('Gestiona tus datos de facturación')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-40 space-y-4">
                <AlertTriangle className="h-12 w-12 text-amber-500" />
                <p className="text-center">{t('Conecta tu wallet para gestionar tu perfil de facturación')}</p>
                <Button onClick={handleConnect}>
                  {t('Conectar Wallet')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{t('Información de Facturación')}</CardTitle>
                  <CardDescription>
                    {t('Esta información se utilizará para generar tus facturas para los servicios de')} {APP_NAME}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    {t('Completa tu información de facturación para agilizar el proceso de generación de facturas para tus posiciones y servicios. Todos los campos son opcionales excepto tu nombre completo.')}
                  </p>
                </CardContent>
              </Card>
              
              <UserBillingProfileForm walletAddress={account} />
            </>
          )}
        </div>
      </div>
    </LayoutBasic>
  );
}