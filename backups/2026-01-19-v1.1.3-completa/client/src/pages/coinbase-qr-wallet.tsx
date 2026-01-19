import React from 'react';
import { CoinbaseWalletQRProvider } from '@/lib/coinbase/coinbase-qr-wallet';
import { CoinbaseQRConnectButton } from '@/components/coinbase/coinbase-qr-connect-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCoinbaseWalletQR } from '@/lib/coinbase/coinbase-qr-wallet';
import { Button } from '@/components/ui/button';
import { RefreshCw, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Página de prueba para la conexión con Coinbase Wallet mediante QR
export default function CoinbaseQRWalletPage() {
  return (
    <CoinbaseWalletQRProvider>
      <div className="container mx-auto p-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Coinbase Wallet con QR
          </h1>
          <CoinbaseQRConnectButton />
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Conexión con Coinbase Wallet mediante QR</CardTitle>
            <CardDescription>
              Esta solución permite conectar con Coinbase Wallet escaneando un código QR desde tu móvil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Esta implementación ofrece:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Conexión mediante escaneo de código QR desde la app móvil</li>
              <li>No requiere extensión de Coinbase Wallet en el navegador</li>
              <li>Verificación de saldo desde la blockchain</li>
              <li>Soporte para cambio de cuentas y redes</li>
              <li>Experiencia de usuario mejorada</li>
            </ul>
          </CardContent>
        </Card>

        <CoinbaseWalletQRInfo />
      </div>
    </CoinbaseWalletQRProvider>
  );
}

// Componente para mostrar información de Coinbase Wallet
function CoinbaseWalletQRInfo() {
  const { toast } = useToast();
  const { 
    address, 
    isConnected, 
    isConnecting, 
    error,
    balance,
    checkBalance,
    network
  } = useCoinbaseWalletQR();
  
  // Estado de carga mientras se conecta
  if (isConnecting) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conectando wallet...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Estado cuando no está conectado
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet no conectada</CardTitle>
          {error && (
            <CardDescription className="text-red-500">
              Error: {error}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <QrCode size={48} className="text-blue-500" />
            </div>
            <p>Haz clic en el botón "Conectar Coinbase QR" para conectar tu wallet.</p>
            <p className="mt-2 text-sm opacity-70">
              Se mostrará un código QR que podrás escanear con la app de Coinbase Wallet en tu móvil.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Estado cuando está conectado correctamente
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Wallet</CardTitle>
        {network && (
          <CardDescription>
            Conectado a: {network}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Dirección</h3>
            <p className="mt-1 break-all">{address}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Saldo</h3>
            <div className="flex items-center mt-1">
              <p className="mr-2">{balance ? `${parseFloat(balance).toFixed(6)} ETH` : 'Cargando...'}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  checkBalance();
                  toast({
                    title: "Actualizando saldo",
                    description: "Consultando la blockchain para obtener el saldo...",
                  });
                }}
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Actualizar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}