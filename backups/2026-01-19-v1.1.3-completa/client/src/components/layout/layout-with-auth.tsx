import React, { ReactNode } from 'react';
import { useSimpleWallet } from '@/hooks/use-simple-wallet';
import Header from '@/components/ui/header';
import { WalletNotConnected } from '@/components/wallet/wallet-not-connected';

type LayoutWithAuthProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  requireAuth?: boolean;
};

export function LayoutWithAuth({
  children,
  title = "Waybank",
  description = "Gestión avanzada de posiciones de liquidez en Uniswap v4",
  requireAuth = true
}: LayoutWithAuthProps) {
  const { account, isConnecting } = useSimpleWallet();
  
  // Si se requiere autenticación y no hay cuenta conectada, mostrar el mensaje de wallet no conectada
  if (requireAuth && !account && !isConnecting) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto p-4">
          <WalletNotConnected
            title={title}
            description={description}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto p-4">
        {children}
      </div>
    </div>
  );
}