import React, { useEffect, useState } from 'react';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';
import { MoneroConnector } from '@/components/wallet/MoneroConnector';
import { MultiWalletConnector } from '@/components/wallet/MultiWalletConnector';
import { useWeb3React } from '@/hooks/use-web3-react';
import { isMobile } from '@/lib/utils';

export default function WalletDemoPage() {
  const { active, account, chainId, activate, deactivate } = useWeb3React();
  const [isPhone, setIsPhone] = useState(false);
  
  // Detectar si es un dispositivo móvil
  useEffect(() => {
    setIsPhone(isMobile());
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Demo de Conexión de Wallet</h1>
      
      <div className="bg-card p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Estado de Conexión</h2>
        <div className="space-y-2 mb-4">
          <p><strong>Dispositivo:</strong> {isPhone ? 'Móvil' : 'Desktop'}</p>
          <p><strong>Estado Ethereum:</strong> {active ? 'Conectado' : 'Desconectado'}</p>
          {active && (
            <>
              <p><strong>Dirección:</strong> {account}</p>
              <p><strong>Red:</strong> {chainId === 1 ? 'Ethereum' : chainId === 137 ? 'Polygon' : `ID: ${chainId}`}</p>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Botones Individuales</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Estos botones permiten conectar a cada tipo de wallet por separado.
          </p>
          
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Ethereum (Web3)</h3>
              <ConnectWalletButton />
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Monero</h3>
              <MoneroConnector />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Conector Múltiple</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Este componente integra todos los tipos de wallet en una interfaz adaptable automáticamente para móvil/desktop.
          </p>
          
          <MultiWalletConnector />
          
          <div className="mt-8">
            <h3 className="text-md font-medium mb-2">Características</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Detección automática de dispositivo móvil</li>
              <li>Interfaz adaptada según el dispositivo</li>
              <li>Soporte para WalletConnect v2 optimizado para móvil</li>
              <li>Integración con múltiples redes blockchain</li>
              <li>Feedback visual para el usuario durante el proceso de conexión</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Recomendaciones de prueba</h2>
        <p className="text-sm text-yellow-700">
          Para probar en móvil: Acceda desde un dispositivo móvil o ajuste el tamaño de su navegador (responsive).
          La interfaz se adaptará automáticamente mostrando opciones optimizadas para dispositivos móviles.
        </p>
      </div>
    </div>
  );
}