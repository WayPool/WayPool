import React from 'react';
import { Button } from '@/components/ui/button';
import { useCoinbaseQR } from '@/lib/coinbase/coinbase-simplified-qr-wallet';
import { QrCode, AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Componente de botón para conectar/desconectar con Coinbase Wallet mediante QR (simplificado)
export function CoinbaseQRConnectButton() {
  const [, navigate] = useLocation();
  
  // Función placeholder para el botón
  const handleConnectButton = () => {
    alert("Sistema de conexión de wallets en mantenimiento. Estamos rediseñando el sistema desde cero para mejorar la experiencia de usuario.");
  };

  return (
    <>
      <Button 
        onClick={handleConnectButton}
        className="bg-blue-600 hover:bg-blue-700 opacity-60 cursor-not-allowed"
        disabled={true}
      >
        <QrCode className="mr-2 h-4 w-4" />
        Sistema en mantenimiento
      </Button>

      <Dialog>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Sistema en mantenimiento
            </DialogTitle>
            <DialogDescription>
              Estamos rediseñando el sistema de conexión de wallets para mejorar la experiencia de usuario
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center justify-center">
            <p className="text-center mb-4">
              El sistema de conexión de wallets está siendo rediseñado completamente para ofrecer mayor seguridad
              y mejor experiencia.
            </p>
            <p className="text-center text-sm opacity-70">
              Volverá a estar disponible próximamente.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}