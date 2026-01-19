import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  WalletCards, 
  QrCode, 
  ArrowRight, 
  Settings, 
  AlertTriangle,
  LucideWallet
} from 'lucide-react';

// Página unificada para conexión de wallet con advertencia de mantenimiento
export default function SecureConnectPage() {
  const [_, navigate] = useLocation();
  
  // Función para mostrar mensaje de mantenimiento
  const handleConnectButton = () => {
    alert("Sistema de conexión de wallets en mantenimiento. Estamos rediseñando el sistema desde cero para mejorar la experiencia de usuario.");
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-2">
        Conecta tu Wallet
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
        Para acceder a todas las funcionalidades de la plataforma, necesitas conectar tu wallet. 
        Selecciona tu método preferido de conexión.
      </p>
      
      {/* Alerta de mantenimiento */}
      <Card className="mb-8 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Sistema en mantenimiento
          </CardTitle>
          <CardDescription>
            Estamos rediseñando el sistema de conexión de wallets para mejorar la experiencia de usuario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            El sistema de conexión de wallets está siendo rediseñado completamente para ofrecer mayor seguridad
            y mejor experiencia. Volverá a estar disponible próximamente.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* MetaMask */}
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <LucideWallet className="h-5 w-5 text-orange-600" />
              MetaMask
            </CardTitle>
            <CardDescription>
              Para usuarios de extensión MetaMask
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2 text-sm mb-4">
              <p>
                ✓ <span className="font-medium">Popular y extensamente utilizado</span>
              </p>
              <p>
                ✓ Excelente para <span className="font-medium">usuarios de escritorio</span>
              </p>
              <p>
                ✓ <span className="font-medium">Fácil de usar</span> y seguro
              </p>
            </div>
            <Button 
              onClick={handleConnectButton}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 opacity-60 cursor-not-allowed"
              disabled={true}
            >
              <LucideWallet className="mr-2 h-4 w-4" />
              En mantenimiento
            </Button>
          </CardContent>
        </Card>

        {/* WalletConnect */}
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <WalletCards className="h-5 w-5 text-blue-600" />
              WalletConnect
            </CardTitle>
            <CardDescription>
              Conexión universal con código QR
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2 text-sm mb-4">
              <p>
                ✓ <span className="font-medium">Compatible con múltiples wallets</span>
              </p>
              <p>
                ✓ Ideal para <span className="font-medium">usuarios móviles</span>
              </p>
              <p>
                ✓ <span className="font-medium">Conexión mediante</span> código QR
              </p>
            </div>
            <Button 
              onClick={handleConnectButton}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 opacity-60 cursor-not-allowed"
              disabled={true}
            >
              <WalletCards className="mr-2 h-4 w-4" />
              En mantenimiento
            </Button>
          </CardContent>
        </Card>

        {/* Coinbase QR */}
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-600" />
              Coinbase Wallet QR
            </CardTitle>
            <CardDescription>
              Para usuarios de Coinbase móvil
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2 text-sm mb-4">
              <p>
                ✓ <span className="font-medium">Específico para Coinbase</span> Wallet
              </p>
              <p>
                ✓ Ideal para <span className="font-medium">usuarios móviles</span>
              </p>
              <p>
                ✓ <span className="font-medium">Conexión instantánea</span> vía QR
              </p>
            </div>
            <Button 
              onClick={handleConnectButton}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 opacity-60 cursor-not-allowed"
              disabled={true}
            >
              <QrCode className="mr-2 h-4 w-4" />
              En mantenimiento
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          variant="link" 
          className="text-gray-500 dark:text-gray-400"
          onClick={() => navigate('/dashboard')}
        >
          Continuar sin conectar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ¿Necesitas ayuda? <Button variant="link" className="p-0 h-auto text-xs" onClick={() => navigate('/support')}>Contacta con soporte</Button>
        </p>
      </div>
    </div>
  );
}