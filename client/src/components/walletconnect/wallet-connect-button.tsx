import React from 'react';
import { Button } from '@/components/ui/button';
import { useWalletConnect } from '@/lib/walletconnect/wallet-connect-provider';
import { CreditCard, Loader2, QrCode, X } from 'lucide-react';
import { useLocation } from 'wouter';

// Componente de botón para conectar/desconectar con WalletConnect
export function WalletConnectButton() {
  const [, setLocation] = useLocation();
  const { 
    connectWallet, 
    disconnectWallet, 
    isConnected, 
    isConnecting, 
    address,
    balance,
    network
  } = useWalletConnect();

  // Función para manejar el clic en el botón
  const handleConnectClick = async () => {
    if (!isConnected) {
      const success = await connectWallet();
      if (success) {
        // Redirigir al dashboard después de una conexión exitosa
        setLocation('/dashboard');
      }
    } else {
      disconnectWallet();
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
      <div className="flex flex-col">
        <Button 
          onClick={handleConnectClick}
          variant="outline"
          className="min-w-[180px] bg-green-50 hover:bg-red-50 border-green-200 hover:border-red-200 text-green-700 hover:text-red-700 transition-colors"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {shortenAddress(address)}
        </Button>
        {balance && network && (
          <div className="text-xs mt-1 text-gray-500 text-center">
            {parseFloat(balance).toFixed(4)} ETH • {network}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnectClick}
      variant="default"
      className="min-w-[180px] bg-blue-600 hover:bg-blue-700"
    >
      <QrCode className="mr-2 h-4 w-4" />
      Conectar con QR
    </Button>
  );
}