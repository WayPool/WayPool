import React from 'react';
import { WagmiProvider } from '@/lib/wagmi-provider-compat';
import { WagmiWalletConnector } from '@/components/wallet/WagmiWalletConnector';

export default function SimpleWalletDemoPage() {
  return (
    <WagmiProvider>
      <div className="min-h-screen flex flex-col">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold text-center">Demostración de Conexión con Wallets</h1>
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
                <li>Optimizaciones para dispositivos móviles</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-3">Tecnologías</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>wagmi</strong> - Hooks de React para Ethereum</li>
                <li><strong>viem</strong> - Biblioteca TypeScript para interactuar con Ethereum</li>
                <li><strong>WalletConnect v2</strong> - Protocolo de conexión de wallets</li>
                <li><strong>Tailwind CSS</strong> - Estilos adaptables</li>
                <li><strong>Componentes adaptables</strong> - Optimización para diferentes dispositivos</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Recomendaciones de prueba</h2>
            <p className="text-sm text-yellow-700">
              Para probar correctamente esta demo:
            </p>
            <ul className="space-y-1 list-disc pl-5 text-sm text-yellow-700 mt-2">
              <li>Visita esta página desde un dispositivo móvil para ver la adaptación automática</li>
              <li>Prueba con MetaMask instalado en el navegador</li>
              <li>Escanea el código QR con una wallet móvil</li>
            </ul>
          </div>
        </main>
        
        <footer className="mt-auto p-4 text-center text-sm text-muted-foreground">
          Demostración de integración con wallets - Sistema implementado con wagmi/viem
        </footer>
      </div>
    </WagmiProvider>
  );
}