import React from 'react';
import { Button } from '@/components/ui/button';
import { useCoinbaseWalletQR } from '@/lib/coinbase/coinbase-qr-wallet';
import { CreditCard, Loader2 } from 'lucide-react';

// Componente de botón para conectar/desconectar con Coinbase Wallet
export function CoinbaseQRConnectButton() {
  const { 
    connectWallet, 
    disconnectWallet, 
    isConnected, 
    isConnecting, 
    address 
  } = useCoinbaseWalletQR();

  // Función para manejar el clic en el botón
  const handleClick = async () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  // Función para acortar la dirección de wallet
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Renderizar botón según el estado
  if (isConnecting) {
    return (
      <Button disabled className="min-w-[180px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Conectando...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <Button 
        onClick={handleClick}
        variant="outline"
        className="min-w-[180px] bg-green-50 hover:bg-red-50 border-green-200 hover:border-red-200 text-green-700 hover:text-red-700 transition-colors"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        {shortenAddress(address)}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleClick}
      variant="default"
      className="min-w-[180px] bg-blue-600 hover:bg-blue-700"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Conectar Coinbase QR
    </Button>
  );
}