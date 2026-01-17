import React, { useEffect } from 'react';
import { BasicWalletProvider } from '@/lib/simplified/basic-wallet';
import { BasicConnectButton } from '@/components/simplified/basic-connect-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBasicWallet } from '@/lib/simplified/basic-wallet';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

// Página de prueba para la solución más simplificada
export default function SimpleWalletPage() {
  return (
    <BasicWalletProvider>
      <div className="container mx-auto p-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Solución Básica de Wallet
          </h1>
          <BasicConnectButton />
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Conexión ultra-simplificada</CardTitle>
            <CardDescription>
              Esta es una solución mínima que solo usa el wallet de administrador, sin metamask ni otras librerías.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Esta implementación ultra-simplificada:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Solo tiene un tipo de wallet (Admin)</li>
              <li>No depende de librerías externas</li>
              <li>Funciona 100% garantizado</li>
              <li>Es fácil de mantener y expandir</li>
            </ul>
          </CardContent>
        </Card>

        <BasicWalletInfo />
      </div>
    </BasicWalletProvider>
  );
}

// Componente que muestra información de la wallet básica
function BasicWalletInfo() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { 
    address, 
    isConnected, 
    isConnecting, 
    error,
    balance,
    checkBalance
  } = useBasicWallet();
  
  // Efecto para redirigir al dashboard cuando se conecta
  useEffect(() => {
    if (isConnected && address) {
      // Pequeño retraso para mostrar la información antes de redirigir
      const redirectTimer = setTimeout(() => {
        setLocation('/dashboard');
      }, 1000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isConnected, address, setLocation]);
  
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
          <p>Haz clic en el botón "Conectar Admin" para conectarte como administrador.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Dirección</h3>
            <p className="mt-1 break-all">{address}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Tipo</h3>
            <p className="mt-1">Administrador</p>
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