import React, { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useChainId,
  useSwitchChain
} from 'wagmi';
import { isMobile } from '@/lib/utils';
import { dashboardTranslations } from '@/translations/dashboard';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { WalletIcons } from './WalletIcons';

// Componente principal para la conexión de wallet usando wagmi
export function WagmiWalletConnector() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { language } = useTranslation();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, chains } = useSwitchChain();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  // Detectar si es un dispositivo móvil
  useEffect(() => {
    setIsPhone(isMobile());
  }, []);

  // Formatear la dirección para mostrar
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Filtrar conectores relevantes basados en el dispositivo
  const relevantConnectors = connectors.filter(connector => {
    // En móvil, priorizar WalletConnect y Coinbase
    if (isPhone) {
      return (
        connector.id === 'walletConnect' || 
        connector.id === 'coinbaseWallet' ||
        // Solo mostrar injected si detectamos una billetera instalada
        (connector.id === 'injected' && connector.ready)
      );
    }
    return true;
  }).sort((a, b) => {
    // Ordenar para que WalletConnect esté primero en móviles
    if (isPhone) {
      if (a.id === 'walletConnect') return -1;
      if (b.id === 'walletConnect') return 1;
    }
    // En desktop, priorizar MetaMask/injected
    else {
      if (a.id === 'injected') return -1;
      if (b.id === 'injected') return 1;
    }
    return 0;
  });

  // Determinar el nombre a mostrar y el icono para cada conector
  const getConnectorInfo = (connectorId: string) => {
    switch (connectorId) {
      case 'walletConnect':
        return {
          name: 'WalletConnect',
          description: 'Conecta vía QR con cualquier wallet compatible',
          recommended: isPhone,
          mobileFriendly: true,
          icon: <WalletIcons.walletConnect className="h-6 w-6" />
        };
      case 'coinbaseWallet':
        return {
          name: 'Coinbase Wallet',
          description: 'Conecta con Coinbase Wallet',
          recommended: false,
          mobileFriendly: true,
          icon: <WalletIcons.coinbase className="h-6 w-6" />
        };
      case 'injected':
        return {
          name: 'MetaMask',
          description: 'Conecta usando la extensión o app de navegador',
          recommended: !isPhone,
          mobileFriendly: false,
          icon: <WalletIcons.metamask className="h-6 w-6" />
        };
      default:
        return {
          name: connectorId,
          description: 'Conecta tu wallet',
          recommended: false,
          mobileFriendly: false,
          icon: <WalletIcons.generic className="h-6 w-6" />
        };
    }
  };

  // Manejar la conexión
  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error conectando wallet:", error);
    }
  };

  // Si está conectado, mostrar información de la wallet
  if (isConnected && address) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
        <div className="mb-3">
          <p className="text-sm">
            Conectado con: <span className="font-medium">{activeConnector?.name || 'Wallet'}</span>
          </p>
          <p className="text-sm truncate max-w-64">
            {ensName ? `${ensName} (${formatAddress(address)})` : formatAddress(address)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Red: {chains.find(c => c.id === chainId)?.name || chainId}
          </p>
        </div>
        {chains.length > 1 && (
          <div className="mb-3 flex items-center space-x-2">
            <span className="text-xs">Cambiar red:</span>
            <select
              className="text-xs p-1 rounded border"
              value={chainId}
              onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => disconnect()}
        >
          Desconectar
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)} 
        disabled={isPending}
      >
        {isPending ? 'Conectando...' : 'Conectar Wallet'}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar Wallet</DialogTitle>
            <DialogDescription>
              {isPhone 
                ? "Selecciona cómo quieres conectar tu wallet en este dispositivo móvil." 
                : "Selecciona un método para conectar tu wallet."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-3 py-4">
            {relevantConnectors.map((connector) => {
              const info = getConnectorInfo(connector.id);
              return (
                <Button
                  key={connector.id}
                  variant="outline"
                  className={`flex items-center justify-start space-x-3 h-16 px-4 ${
                    isPhone && !info.mobileFriendly ? 'opacity-60' : ''
                  }`}
                  onClick={() => handleConnect(connector)}
                  disabled={!connector.ready || isPending}
                >
                  <div className="flex-shrink-0">
                    {info.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{info.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {info.description}
                    </span>
                  </div>
                  {info.recommended && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {dashboardTranslations[language as keyof typeof dashboardTranslations]?.recommended || "Recommended"}
                    </span>
                  )}
                  {isPhone && !info.mobileFriendly && (
                    <span className="ml-auto text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                      Experiencia limitada
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground mb-4 sm:mb-0">
              Al conectar tu wallet aceptas los <a href="/terms-of-use" className="underline">Términos de Uso</a>
            </p>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {connectError && (
        <p className="text-red-500 text-sm mt-2">
          Error: {connectError.message}
        </p>
      )}
    </>
  );
}