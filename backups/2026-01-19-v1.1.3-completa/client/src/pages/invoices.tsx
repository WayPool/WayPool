/**
 * Page for viewing user invoices
 * This page requires authentication (connected wallet)
 */

import React, { useState } from 'react';
import { UserInvoicesNew } from '@/components/invoices/user-invoices-new';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import ConnectModal from '@/components/wallet/connect-modal';

export default function InvoicesPage() {
  const { account, isConnected } = useWallet();
  const { t } = useTranslation();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  
  const handleConnect = () => {
    setIsConnectModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {isConnected && account ? (
        <UserInvoicesNew walletAddress={account} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('Mis facturas')}</CardTitle>
            <CardDescription>
              {t('Historial de facturas asociadas a tu wallet')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-40 space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <p className="text-center">{t('Conecta tu wallet para ver tus facturas')}</p>
            <Button onClick={handleConnect}>
              {t('Conectar Wallet')}
            </Button>
          </CardContent>
        </Card>
      )}
      
      <ConnectModal 
        isOpen={isConnectModalOpen} 
        onClose={() => setIsConnectModalOpen(false)} 
      />
    </div>
  );
}