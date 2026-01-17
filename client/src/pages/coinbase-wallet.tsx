import React from 'react';
import { CoinbaseWalletProvider } from '@/lib/coinbase/coinbase-wallet';
import { CoinbaseConnectButton } from '@/components/coinbase/coinbase-connect-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCoinbaseWallet } from '@/lib/coinbase/coinbase-wallet';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Página de prueba para la conexión con Coinbase Wallet
export default function CoinbaseWalletPage() {
  return (
    <CoinbaseWalletProvider>
      <div className="container mx-auto p-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Coinbase Wallet Connector
          </h1>
          <CoinbaseConnectButton />
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Conexión nativa con Coinbase Wallet</CardTitle>
            <CardDescription>
              Esta es una solución optimizada para conectar con Coinbase Wallet sin librerías adicionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Esta implementación directa ofrece:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Conexión directa con Coinbase Wallet mediante API nativa</li>
              <li>Verificación de saldo desde la blockchain</li>
              <li>Soporte para cambio de cuentas y redes</li>
              <li>Persistencia de sesión automática</li>
              <li>Interfaz responsiva y amigable</li>
            </ul>
          </CardContent>
        </Card>

        <CoinbaseWalletInfo />
      </div>
    </CoinbaseWalletProvider>
  );
}

// Componente para mostrar información de Coinbase Wallet
function CoinbaseWalletInfo() {
  const { toast } = useToast();
  const { 
    address, 
    isConnected, 
    isConnecting, 
    error,
    balance,
    checkBalance,
    network
  } = useCoinbaseWallet();
  
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
          <p>Haz clic en el botón "Conectar Coinbase" para conectar tu wallet.</p>
          <p className="mt-2 text-sm opacity-70">
            Nota: Necesitas tener instalada la extensión de Coinbase Wallet en tu navegador.
          </p>
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