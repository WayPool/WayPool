import React, { useState } from 'react';
import { useSimpleWallet, WalletType } from '@/lib/simplified/wallet-connector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Componente para el botón de conexión simple
export function SimpleConnectButton() {
  const { isConnected, address, disconnectWallet, isConnecting } = useSimpleWallet();
  const [isOpen, setIsOpen] = useState(false);

  // Si ya está conectado, mostrar dirección y botón de desconexión
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 p-2 sm:p-3">
          <span className="hidden sm:block">
            {`${address.substring(0, 6)}...${address.substring(38)}`}
          </span>
          <span className="block sm:hidden">
            {`${address.substring(0, 4)}...`}
          </span>
        </Button>
        <Button variant="destructive" onClick={disconnectWallet} size="sm">
          Desconectar
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="default" 
        onClick={() => setIsOpen(true)}
        disabled={isConnecting}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
      </Button>

      <SimpleConnectModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

// Modal de selección de wallet
function SimpleConnectModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (value: boolean) => void }) {
  const { connectWallet, isConnecting } = useSimpleWallet();

  const handleConnect = async (type: WalletType) => {
    const success = await connectWallet(type);
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar Wallet</DialogTitle>
          <DialogDescription>
            Selecciona el método de conexión que prefieras.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Opción MetaMask */}
          <Card className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
            onClick={() => handleConnect(WalletType.METAMASK)}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.2045 1L13.6441 7.88563L15.2552 3.94984L21.2045 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.79481 1L10.2856 7.94563L8.7445 3.94984L2.79481 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.1719 17.1042L15.9243 20.9982L20.6933 22.4718L22.0504 17.1883L18.1719 17.1042Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.95996 17.1883L3.30693 22.4718L8.07593 20.9982L5.8397 17.1042L1.95996 17.1883Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.78294 10.7149L6.33594 13.0265L11.0575 13.2752L10.8914 8.13184L7.78294 10.7149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.2173 10.7149L13.0633 8.07184L12.9424 13.2752L17.664 13.0265L16.2173 10.7149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.07593 20.9982L10.7752 19.4402L8.45317 17.2231L8.07593 20.9982Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.2246 19.4402L15.9241 20.9982L15.5466 17.2231L13.2246 19.4402Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                MetaMask
              </CardTitle>
              <CardDescription>Conectar con MetaMask</CardDescription>
            </CardHeader>
          </Card>

          {/* Opción Admin Wallet (para pruebas) */}
          <Card className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
            onClick={() => handleConnect(WalletType.ADMIN)}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Admin Wallet
              </CardTitle>
              <CardDescription>Conectar como administrador</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}