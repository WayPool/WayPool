import React from 'react';
import { useBasicWallet, WalletType } from '@/lib/simplified/basic-wallet';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';

// Componente para el botón de conexión básico
export function BasicConnectButton() {
  const [, setLocation] = useLocation();
  const { isConnected, address, disconnectWallet, isConnecting, connectWallet } = useBasicWallet();

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

  // Si no está conectado, mostrar botón de conexión
  return (
    <Button 
      variant="default" 
      onClick={async () => {
        const success = await connectWallet(WalletType.ADMIN);
        if (success) {
          // Redirigir al dashboard después de una conexión exitosa
          console.log("Conectado! Redirigiendo al dashboard...");
          setTimeout(() => {
            setLocation('/dashboard');
          }, 500);
        }
      }}
      disabled={isConnecting}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Conectar Admin
        </>
      )}
    </Button>
  );
}