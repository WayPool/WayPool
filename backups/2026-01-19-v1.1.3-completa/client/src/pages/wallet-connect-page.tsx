import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Smartphone, WalletCards, Info, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import Web3Connector from '@/components/wallet/Web3Connector';
import { apiRequest } from '@/lib/queryClient';

// Página actualizada para la conexión con WalletConnect
export default function WalletConnectPage() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // Manejador para cuando se conecta la wallet
  const handleWalletConnect = async (address: string, chainId: string) => {
    // Notificamos al usuario que se ha conectado correctamente
    toast({
      title: "Wallet conectada exitosamente",
      description: `Conectado a la dirección ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      variant: "default",
    });
    
    try {
      // Enviamos la dirección del wallet al servidor para autenticar al usuario
      await apiRequest('POST', '/api/auth/login', { walletAddress: address });
      
      // Almacenamos la dirección en localStorage para uso futuro
      localStorage.setItem('walletAddress', address);
      
      // Redirigimos al dashboard después de un breve periodo
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error("Error al autenticar:", error);
      toast({
        title: "Error de autenticación",
        description: "No se pudo completar el proceso de inicio de sesión. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Conexión con WalletConnect
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Conecta con cualquier wallet compatible con WalletConnect, incluido Coinbase Wallet
          </p>
        </div>
      </header>
      
      {/* Mensaje de sistema actualizado */}
      <Card className="mb-8 border-green-300 bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Sistema actualizado
          </CardTitle>
          <CardDescription>
            Implementación mejorada de WalletConnect v2 para una conexión más rápida y segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Hemos actualizado nuestro sistema de conexión de wallets para ofrecer mayor seguridad,
            compatibilidad y mejor experiencia. Ahora puedes conectarte con cualquier wallet compatible
            con WalletConnect v2.
          </p>
        </CardContent>
      </Card>

      {/* Componente de conexión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Componente Web3Connector */}
        <div>
          <Web3Connector onConnect={handleWalletConnect} />
        </div>
        
        {/* Información de WalletConnect */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader>
            <div className="flex items-center">
              <WalletCards className="h-6 w-6 mr-2 text-blue-600" />
              <CardTitle>Conexión Universal WalletConnect</CardTitle>
            </div>
            <CardDescription>
              Conecta cualquier wallet compatible escaneando un código QR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Ventajas</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                <li>
                  <strong>Universal:</strong> Compatible con más de 170 wallets distintas
                </li>
                <li>
                  <strong>Seguro:</strong> No almacena claves privadas y usa cifrado de extremo a extremo
                </li>
                <li>
                  <strong>Multiplataforma:</strong> Funciona en cualquier dispositivo
                </li>
                <li>
                  <strong>Amplia compatibilidad:</strong> Soporta múltiples cadenas de bloques
                </li>
              </ul>
              
              <div className="p-4 mt-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-start">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Puedes escanear el código QR con la aplicación móvil de tu wallet o utilizar
                  la extensión de navegador si la tienes instalada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}