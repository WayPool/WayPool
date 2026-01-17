import React from 'react';
import { useLocation } from 'wouter';
import { 
  AlertTriangle, 
  QrCode,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConnectPage() {
  const [_, navigate] = useLocation();
  
  // Función para mostrar mensaje de mantenimiento sin intentar conectar realmente
  const handleConnectButton = () => {
    alert("Sistema de conexión de wallets en mantenimiento. Estamos rediseñando el sistema desde cero para mejorar la experiencia de usuario.");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container max-w-5xl mx-auto py-16 px-4">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Conecta tu Wallet</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Para acceder a todas las funcionalidades de la plataforma, necesitas conectar tu wallet.
            Selecciona tu método preferido de conexión.
          </p>
        </div>

        {/* Alerta de mantenimiento */}
        <div className="mb-10 border border-amber-700 bg-amber-900/20 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-400">Sistema en mantenimiento</h3>
            <p className="text-amber-300/70 text-sm">
              Estamos rediseñando el sistema de conexión de wallets para mejorar la experiencia de usuario
            </p>
            <p className="text-gray-400 mt-2">
              El sistema de conexión de wallets está siendo rediseñado completamente para ofrecer mayor seguridad y mejor experiencia.
              Volverá a estar disponible próximamente.
            </p>
          </div>
        </div>

        {/* Opciones de Wallet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {/* MetaMask */}
          <div className="bg-navy-900 rounded-lg p-6">
            <div className="flex flex-col h-full">
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold">MetaMask</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Para usuarios de extensión MetaMask</p>
              
              <div className="flex-grow space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Popular y extensamente utilizado</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Excelente para usuarios de escritorio</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Fácil de usar y seguro</p>
                </div>
              </div>
              
              <Button 
                onClick={handleConnectButton}
                disabled
                className="w-full bg-orange-600/50 hover:bg-orange-600/50 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                En mantenimiento
              </Button>
            </div>
          </div>
          
          {/* WalletConnect */}
          <div className="bg-navy-900 rounded-lg p-6">
            <div className="flex flex-col h-full">
              <div className="mb-2 flex items-center gap-2">
                <QrCode className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold">WalletConnect</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Conexión universal con código QR</p>
              
              <div className="flex-grow space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Compatible con múltiples wallets</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Ideal para usuarios móviles</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Conexión mediante código QR</p>
                </div>
              </div>
              
              <Button 
                onClick={handleConnectButton}
                disabled
                className="w-full bg-indigo-600/50 hover:bg-indigo-600/50 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                En mantenimiento
              </Button>
            </div>
          </div>
          
          {/* Coinbase Wallet */}
          <div className="bg-navy-900 rounded-lg p-6">
            <div className="flex flex-col h-full">
              <div className="mb-2 flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold">Coinbase Wallet QR</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Para usuarios de Coinbase móvil</p>
              
              <div className="flex-grow space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Específico para Coinbase Wallet</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Ideal para usuarios móviles</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="text-sm text-gray-400">Conexión instantánea vía QR</p>
                </div>
              </div>
              
              <Button 
                onClick={handleConnectButton}
                disabled
                className="w-full bg-blue-600/50 hover:bg-blue-600/50 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                En mantenimiento
              </Button>
            </div>
          </div>
        </div>
        
        {/* Botón para continuar sin conectar */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-400 hover:text-white flex items-center gap-1"
            onClick={() => navigate('/dashboard')}
          >
            <svg 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Continuar sin conectar
          </Button>
        </div>
        
        {/* Enlace de soporte */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          ¿Necesitas ayuda? <a href="/support" className="text-indigo-400 hover:text-indigo-300">Contacta con soporte</a>
        </div>
      </div>
    </div>
  );
}