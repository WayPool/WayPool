import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@/hooks/use-web3-react';
// Referencia eliminada - proveedor consolidado
import { Button } from '@/components/ui/button';
import { isMobile } from '@/lib/utils';
import { dashboardTranslations } from '@/translations/dashboard';
import { useTranslation } from '@/hooks/use-translation';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
// Definición simplificada de iconos para este componente
const Icons = {
  walletConnect: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" {...props}>
      <path
        d="M169.54 165.16C224.111 111.537 314.09 111.537 368.662 165.16L378.132 174.487C380.494 176.809 380.494 180.633 378.132 182.955L353.613 207.151C352.432 208.312 350.52 208.312 349.338 207.151L336.333 194.333C299.067 157.651 239.135 157.651 201.868 194.333L188.078 207.911C186.896 209.072 184.985 209.072 183.803 207.911L159.284 183.715C156.922 181.393 156.922 177.569 159.284 175.247L169.54 165.16Z"
        fill="#3B99FC"
      />
      <path
        d="M412.218 208.086L433.871 229.423C436.233 231.745 436.233 235.569 433.871 237.891L328.292 342.106C326.929 343.447 324.824 343.447 323.461 342.106C323.461 342.106 323.461 342.106 323.461 342.106L249.993 269.765C249.402 269.185 248.451 269.185 247.86 269.765C247.86 269.765 247.86 269.765 247.86 269.765L174.4 342.106C173.037 343.447 170.931 343.447 169.569 342.106C169.569 342.106 169.569 342.106 169.569 342.106L63.9835 237.882C61.6216 235.56 61.6216 231.737 63.9835 229.415L85.6372 208.077C87 206.736 89.1056 206.736 90.4684 208.077L164.045 280.418C164.636 280.999 165.588 280.999 166.179 280.418C166.179 280.418 166.179 280.418 166.179 280.418L239.63 208.077C240.993 206.736 243.098 206.736 244.461 208.077C244.461 208.077 244.461 208.077 244.461 208.077L317.92 280.418C318.511 280.999 319.463 280.999 320.054 280.418L393.622 208.086C394.985 206.745 397.09 206.745 398.453 208.086L412.218 208.086Z"
        fill="#3B99FC"
      />
    </svg>
  ),
  metamask: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" {...props}>
      <path d="M389.269 21.333L285.653 162.261L306.347 93.557L389.269 21.333Z" fill="#E2761B" />
      <path d="M122.539 21.333L225.456 163.147L205.653 93.557L122.539 21.333Z" fill="#E4761B" />
      <path d="M339.733 341.045L301.611 411.477L383.253 438.784L407.168 342.315L339.733 341.045Z" fill="#E4761B" />
      <path d="M104.64 342.315L128.555 438.784L210.197 411.477L172.075 341.045L104.64 342.315Z" fill="#E4761B" />
      <path d="M203.687 225.557L185.941 266.923L267.008 271.195L263.12 184.192L203.687 225.557Z" fill="#E4761B" />
      <path d="M308.121 225.557L248.112 183.616L244.799 271.195L325.771 266.923L308.121 225.557Z" fill="#E4761B" />
      <path d="M210.197 411.477L260.117 383.968L217.109 342.891L210.197 411.477Z" fill="#E4761B" />
      <path d="M251.691 383.968L301.611 411.477L294.699 342.891L251.691 383.968Z" fill="#E4761B" />
    </svg>
  ),
  coinbase: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" {...props}>
      <path 
        d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" 
        fill="#0052FF"
      />
      <path 
        d="M24.0002 9.59961C16.0962 9.59961 9.6001 16.0957 9.6001 23.9997C9.6001 31.9037 16.0962 38.3998 24.0002 38.3998C31.9042 38.3998 38.4003 31.9037 38.4003 23.9997C38.4003 16.0957 31.9042 9.59961 24.0002 9.59961Z" 
        fill="white"
      />
    </svg>
  )
};

interface WalletOption {
  id: ConnectorNames;
  name: string;
  logo: React.ReactNode;
  description: string;
  recommended?: boolean;
  mobileFriendly?: boolean;
}

export function MobileWalletSelector() {
  const { activate, isModalOpen, setIsModalOpen } = useWeb3React();
  const { language } = useTranslation();
  const [isPhone, setIsPhone] = useState(false);
  
  // Detectar si es teléfono móvil al cargar
  useEffect(() => {
    setIsPhone(isMobile());
  }, []);
  
  // Lista de wallets disponibles con sus íconos
  const wallets: WalletOption[] = [
    {
      id: ConnectorNames.WalletConnect,
      name: "WalletConnect",
      logo: <Icons.walletConnect className="h-6 w-6" />,
      description: "Conecta con cualquier wallet compatible usando QR",
      recommended: true,
      mobileFriendly: true
    },
    {
      id: ConnectorNames.CoinbaseWallet,
      name: "Coinbase Wallet",
      logo: <Icons.coinbase className="h-6 w-6" />,
      description: "Conecta con Coinbase Wallet en móvil o desktop",
      mobileFriendly: true
    },
    {
      id: ConnectorNames.Injected,
      name: "MetaMask",
      logo: <Icons.metamask className="h-6 w-6" />,
      description: "Conecta usando la extensión de navegador",
      mobileFriendly: false
    }
  ];
  
  // Ordenar wallets: primero los recomendados para móvil si estamos en un dispositivo móvil
  const sortedWallets = [...wallets].sort((a, b) => {
    if (isPhone) {
      if (a.mobileFriendly && !b.mobileFriendly) return -1;
      if (!a.mobileFriendly && b.mobileFriendly) return 1;
    }
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    return 0;
  });

  const handleConnect = async (connector: ConnectorNames) => {
    try {
      await activate(connector);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error conectando wallet:", error);
    }
  };

  return (
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
          {sortedWallets.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              className={`flex items-center justify-start space-x-3 h-16 px-4 ${
                isPhone && !wallet.mobileFriendly ? 'opacity-60' : ''
              }`}
              onClick={() => handleConnect(wallet.id)}
            >
              <div className="flex-shrink-0">
                {wallet.logo}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{wallet.name}</span>
                <span className="text-xs text-muted-foreground">
                  {wallet.description}
                </span>
              </div>
              {wallet.recommended && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {dashboardTranslations[language as keyof typeof dashboardTranslations]?.recommended || "Recommended"}
                </span>
              )}
              {isPhone && !wallet.mobileFriendly && (
                <span className="ml-auto text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                  Experiencia limitada
                </span>
              )}
            </Button>
          ))}
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
  );
}