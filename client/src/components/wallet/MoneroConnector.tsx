import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, ExternalLink, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Interfaces para la integración con Monero
export interface MoneroConnectorProps {
  onConnect?: (address: string, balance: { total: number, unlocked: number }) => void;
  className?: string; // Añadimos esta propiedad
}

interface MoneroWalletState {
  address: string;
  balance: {
    total: number;
    unlocked: number;
  };
  connected: boolean;
}

// Billeteras de ejemplo para modo simulación
const DEMO_WALLETS = [
  {
    address: "45rTtwU6mHqSEMduDm5EvUEmFNx2Rykwy9mRrCQc2XCQrVCyif3uCpHkj2hQUEEHiKnAB3TcA9TuB6mjGGogDgrxEfUCHkC",
    balance: { total: 3.42, unlocked: 3.42 }
  },
  {
    address: "88Rezd6YGecXouxScWoyfzciwKhvxbgr1hYJm1FG9e9MCgwoxYKqEfZ9dAGNgQXR3AFBBuqTYQlEFZV7jWd6VdwTKDDXvq5",
    balance: { total: 12.75, unlocked: 12.75 }
  },
  {
    address: "48Y4SoUJM5L3YXBEy4SuDVQeLGwQbG5aLs4wd7xk7gxMFnZrZGrZQRBjK8JzF1FakKcYoL1QdpA9M5JNyRd8Q7gJBCYe6qM",
    balance: { total: 0.87, unlocked: 0.87 }
  },
];

/**
 * Componente que simula la conectividad con billeteras Monero
 */
export function MoneroConnector({ onConnect, className }: MoneroConnectorProps) {
  const [wallet, setWallet] = useState<MoneroWalletState | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setLoading(true);
    
    // Simulamos una conexión con una pequeña demora para hacerlo más realista
    setTimeout(() => {
      // Seleccionamos una billetera aleatoria de la lista de demostración
      const demoWallet = DEMO_WALLETS[Math.floor(Math.random() * DEMO_WALLETS.length)];
      
      setWallet({
        address: demoWallet.address,
        balance: demoWallet.balance,
        connected: true
      });
      
      // Notificamos al componente padre
      if (onConnect) {
        onConnect(demoWallet.address, demoWallet.balance);
      }
      
      toast({
        title: "Monero Wallet Conectada",
        description: "Conectado correctamente en modo simulación",
      });
      
      setLoading(false);
    }, 1500);
  };

  const disconnectWallet = () => {
    setWallet(null);
    toast({
      title: "Monero Wallet Desconectada",
      description: "La billetera ha sido desconectada",
    });
  };

  if (wallet?.connected) {
    return (
      <Card className={`bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-orange-600" />
                <span className="text-sm font-medium">Monero Wallet (XMR)</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={disconnectWallet}
                className="h-8 px-2"
              >
                Desconectar
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Dirección:</p>
              <p className="text-xs font-mono truncate">{wallet.address}</p>
            </div>
            
            <div className="flex justify-between mt-2 bg-white dark:bg-gray-800 rounded-md p-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance Total:</p>
                <p className="text-sm font-semibold">{wallet.balance.total} XMR</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Disponible:</p>
                <p className="text-sm font-semibold">{wallet.balance.unlocked} XMR</p>
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <ArrowRightLeft className="h-3 w-3 mr-1 text-gray-500" />
              <span className="text-xs text-gray-500">Red:</span>
              <span className="text-xs font-medium ml-1">Monero Mainnet (Simulación)</span>
            </div>
            
            <div className="mt-2 flex justify-end">
              <a 
                href="https://localmonero.co/blocks/search/1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center text-orange-600 hover:text-orange-800"
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Ver en Explorer
              </a>
            </div>

            <Alert className="mt-2 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
              <Info className="h-4 w-4" />
              <AlertTitle className="text-xs">Modo Simulación</AlertTitle>
              <AlertDescription className="text-xs">
                Esto es una simulación con fines educativos. No se conecta a ninguna red real.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Button
        variant="outline"
        className="w-full border-orange-200 hover:bg-orange-50 text-orange-800 dark:hover:bg-orange-950/20"
        onClick={connectWallet}
        disabled={loading}
      >
        <Shield className="h-4 w-4 mr-2" />
        {loading ? "Conectando..." : "Conectar con Monero"}
      </Button>
    </div>
  );
}