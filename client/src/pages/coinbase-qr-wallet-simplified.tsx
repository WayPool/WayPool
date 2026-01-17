import React from 'react';
import { CoinbaseQRProvider } from '@/lib/coinbase/coinbase-simplified-qr-wallet';
import { CoinbaseQRConnectButton } from '@/components/coinbase/coinbase-qr-connect-button-simplified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCoinbaseQR } from '@/lib/coinbase/coinbase-simplified-qr-wallet';
import { Button } from '@/components/ui/button';
import { RefreshCw, QrCode, SmartphoneNfc } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Página de demostración para la conexión con Coinbase Wallet mediante código QR
export default function CoinbaseQRWalletSimplifiedPage() {
  return (
    <CoinbaseQRProvider>
      <div className="container mx-auto p-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Conexión QR con Coinbase Wallet
          </h1>
          <CoinbaseQRConnectButton />
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Conexión mediante QR y WalletConnect</CardTitle>
            <CardDescription>
              Escanea el código QR desde la app de Coinbase Wallet para conectar tu wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Cómo funciona</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Este método de conexión utiliza el protocolo WalletConnect para establecer una conexión segura entre la aplicación web y tu wallet móvil mediante un código QR.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Genera un código QR único para la sesión de conexión</li>
                  <li>El usuario escanea el código con la app de Coinbase Wallet</li>
                  <li>Se establece un canal seguro de comunicación</li>
                  <li>La wallet móvil puede firmar transacciones solicitadas por la aplicación</li>
                </ul>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <SmartphoneNfc size={64} className="mb-4 text-blue-500" />
                <p className="text-center text-gray-600 dark:text-gray-300">
                  No requiere instalar extensiones en el navegador. Toda la interacción se realiza a través de tu dispositivo móvil.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <WalletInfoDisplay />
      </div>
    </CoinbaseQRProvider>
  );
}

// Componente para mostrar información de la wallet
function WalletInfoDisplay() {
  const { toast } = useToast();
  const { 
    address, 
    isConnected, 
    isConnecting, 
    error,
    balance,
    checkBalance,
    network
  } = useCoinbaseQR();
  
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
            <p>Haz clic en el botón "Conectar con QR" para iniciar el proceso de conexión.</p>
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