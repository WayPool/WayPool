import React from 'react';
import { Button } from '@/components/ui/button';
import { useCoinbaseWallet } from '@/lib/coinbase/coinbase-wallet';
import { Wallet, Loader2 } from 'lucide-react';

// Botón de conexión para Coinbase Wallet
export function CoinbaseConnectButton({ className = '' }: { className?: string }) {
  const { 
    isConnected, 
    address, 
    disconnectWallet, 
    isConnecting, 
    connectWallet, 
    network 
  } = useCoinbaseWallet();

  // Si ya está conectado, mostrar dirección y botón de desconexión
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 p-2 sm:p-3 text-xs">
          <div className="flex flex-col items-start">
            <span className="font-medium">
              {`${address.substring(0, 6)}...${address.substring(38)}`}
            </span>
            {network && (
              <span className="text-xs opacity-70">{network}</span>
            )}
          </div>
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
      onClick={connectWallet}
      disabled={isConnecting}
      className={`${className} bg-gradient-to-r from-blue-500 to-yellow-500 hover:from-blue-600 hover:to-yellow-600`}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Conectar Coinbase
        </>
      )}
    </Button>
  );
}