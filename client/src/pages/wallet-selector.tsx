import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Wallet, CreditCard, QrCode, WalletCards } from 'lucide-react';

// Página de selección de wallet
export default function WalletSelectorPage() {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto p-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">
          Selecciona tu método de conexión
        </h1>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-300">
          Elige la opción que mejor se adapte a tus necesidades
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>MetaMask Básico</CardTitle>
            <CardDescription>
              Implementación simplificada para MetaMask
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <p className="mb-6 flex-grow">
              Usa la implementación simplificada que funciona exclusivamente con MetaMask.
              Recomendada para usuarios que utilizan MetaMask como su wallet principal.
            </p>
            <Button 
              onClick={() => navigate('/simple-wallet')}
              className="w-full mt-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Conectar con MetaMask
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Coinbase Wallet</CardTitle>
            <CardDescription>
              Integración nativa con Coinbase Wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <p className="mb-6 flex-grow">
              Conecta directamente con Coinbase Wallet usando la API nativa. 
              Para usuarios de Coinbase con la extensión instalada.
            </p>
            <Button 
              onClick={() => navigate('/coinbase-wallet')}
              className="w-full mt-auto bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Conectar con Coinbase
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <div className="absolute -top-1 -right-1">
              <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">Nuevo</span>
            </div>
            <CardTitle>Coinbase QR</CardTitle>
            <CardDescription>
              Conexión mediante código QR para móviles
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <p className="mb-6 flex-grow">
              Conecta con Coinbase Wallet escaneando un código QR. Ideal para usuarios 
              móviles sin necesidad de extensiones de navegador.
            </p>
            <Button 
              onClick={() => navigate('/coinbase-qr-wallet-simplified')}
              className="w-full mt-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              <QrCode className="mr-2 h-4 w-4" />
              Conectar vía QR
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="bg-indigo-50 dark:bg-indigo-950/20">
            <div className="absolute -top-1 -right-1">
              <span className="bg-indigo-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">Recomendado</span>
            </div>
            <CardTitle>WalletConnect</CardTitle>
            <CardDescription>
              Conexión universal para todas las wallets
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <p className="mb-6 flex-grow">
              La solución más versátil compatible con +170 wallets diferentes. Funciona en móviles y
              escritorio mediante códigos QR.
            </p>
            <Button 
              onClick={() => navigate('/wallet-connect-page')}
              className="w-full mt-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <WalletCards className="mr-2 h-4 w-4" />
              Conectar Universal
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Administrador</CardTitle>
            <CardDescription>
              Acceso exclusivo para administradores
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <p className="mb-6 flex-grow">
              Usa la wallet de administrador predefinida para acceder a todas las funcionalidades 
              sin necesidad de instalar extensiones.
            </p>
            <Button 
              onClick={() => navigate('/simple-wallet')}
              className="w-full mt-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Acceso Administrativo
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Todas las opciones son 100% compatibles con la aplicación y ofrecen las mismas funcionalidades básicas.
          <br />
          La elección depende de tu preferencia personal y el wallet que utilizas habitualmente.
        </p>
      </div>
    </div>
  );
}