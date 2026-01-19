import React from 'react';
import { WagmiProvider } from '@/lib/wagmi-provider-compat';
import { WagmiWalletConnector } from '@/components/wallet/WagmiWalletConnector';

export default function WagmiDemoPage() {
  return (
    <WagmiProvider>
      <div className="min-h-screen flex flex-col">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold text-center">Demostración de WalletConnect v2 con Wagmi</h1>
        </header>
        
        <main className="flex-1 container mx-auto p-4 max-w-4xl">
          <div className="bg-card rounded-lg shadow-lg p-6 my-8">
            <h2 className="text-xl font-semibold mb-4">Conecta tu Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Esta demostración utiliza wagmi y viem para una integración mejorada con wallets de criptomonedas.
              La experiencia se optimiza automáticamente para dispositivos móviles.
            </p>
            
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
              <WagmiWalletConnector />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-card rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-3">Características</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Detección automática de dispositivos móviles</li>
                <li>Soporte para WalletConnect v2</li>
                <li>Integración con MetaMask y Coinbase Wallet</li>
                <li>Cambio de red integrado</li>
                <li>Resolución de nombres ENS</li>
                <li>Experiencia optimizada según dispositivo</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-3">Beneficios del nuevo sistema</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Mayor facilidad de uso en dispositivos móviles</li>
                <li>Soporte para más tipos de wallets</li>
                <li>Mejor manejo de errores y estados de conexión</li>
                <li>Rendimiento mejorado</li>
                <li>Mayor seguridad</li>
                <li>Código más mantenible y escalable</li>
              </ul>
            </div>
          </div>
        </main>
        
        <footer className="p-4 border-t text-center text-sm text-muted-foreground">
          Demostración de integración de WalletConnect v2 con wagmi/viem - {new Date().getFullYear()}
        </footer>
      </div>
    </WagmiProvider>
  );
}