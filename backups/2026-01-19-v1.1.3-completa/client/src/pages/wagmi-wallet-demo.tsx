import React from 'react';
import { WagmiProvider } from '@/lib/wagmi-provider-compat';
import { WagmiWalletConnector } from '@/components/wallet/WagmiWalletConnector';

export default function WagmiWalletDemoPage() {
  return (
    <WagmiProvider>
      <div className="min-h-screen flex flex-col">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold text-center">Demostración con Wagmi/Viem</h1>
        </header>
        
        <main className="flex-1 container mx-auto p-4 max-w-4xl">
          <div className="bg-card rounded-lg shadow-lg p-6 my-8">
            <h2 className="text-xl font-semibold mb-4">Conecta tu Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Esta página utiliza wagmi y viem para mejorar la integración con wallets de criptomonedas.
              La experiencia está optimizada para dispositivos móviles y detecta automáticamente el tipo de dispositivo.
            </p>
            
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
              <WagmiWalletConnector />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-card rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-3">Características principales</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Detección automática de dispositivos móviles</li>
                <li>Soporte mejorado para WalletConnect v2</li>
                <li>Optimización para MetaMask en desktop</li>
                <li>Optimización para Coinbase Wallet en móvil</li>
                <li>Interfaz adaptativa según dispositivo</li>
                <li>Mejor manejo de errores de conexión</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-3">Ventajas técnicas</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Arquitectura basada en hooks para mejor reusabilidad</li>
                <li>Tipos TypeScript completos para mejor desarrollo</li>
                <li>Mejor integración con múltiples cadenas</li>
                <li>Soporte para resolver nombres ENS</li>
                <li>Notificaciones claras de errores de conexión</li>
                <li>Experiencia mejorada para QR en móviles</li>
              </ul>
            </div>
          </div>
        </main>
        
        <footer className="p-4 border-t text-center text-sm text-muted-foreground">
          Nueva implementación con wagmi/viem - {new Date().getFullYear()}
        </footer>
      </div>
    </WagmiProvider>
  );
}