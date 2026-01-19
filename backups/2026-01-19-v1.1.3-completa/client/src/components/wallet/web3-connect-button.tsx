import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { WalletType } from "@/lib/new-wallet-provider";
import { formatAddress } from "@/lib/ethereum";
import { ChevronDown, LogOut, Wallet, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useDefaultNetwork } from "@/hooks/use-default-network";
import ConnectModal from "./connect-modal";

interface Web3ConnectButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  className?: string;
}

const Web3ConnectButton: React.FC<Web3ConnectButtonProps> = ({
  variant = 'default',
  size = 'default',
  fullWidth = false,
  className = ''
}) => {
  const { 
    address, 
    network, 
    connectWallet,
    disconnectWallet,
    refreshConnection,
    isConnecting,
    isConnected,
    error,
  } = useWallet();

  const { toast } = useToast();
  const { t } = useTranslation();
  const { defaultNetworkName } = useDefaultNetwork();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mostrar errores de conexión
  useEffect(() => {
    if (error) {
      toast({
        title: t("Connection Error"),
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast, t]);

  const handleConnect = async () => {
    // Abrir el modal de conexión personalizado en lugar de connectWallet directo
    setIsModalOpen(true);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
    
    toast({
      title: t("Disconnect Success"),
      description: t("Your wallet has been disconnected"),
    });
  };

  const handleRefresh = async () => {
    if (isRefreshing || !address) return;
    
    setIsRefreshing(true);
    try {
      const success = await refreshConnection();
      
      if (success) {
        toast({
          title: t("Connection Updated"),
          description: t("Wallet information has been updated"),
        });
      } else {
        toast({
          title: t("Update Failed"),
          description: t("No changes detected or there was an error"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error.message || t("Could not update connection"),
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isConnected) {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          className={`${fullWidth ? 'w-full' : ''} ${className}`}
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('Connecting...')}
            </>
          ) : (
            t('Connect Wallet')
          )}
        </Button>
        <ConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className={`${fullWidth ? 'w-full' : 'flex items-center gap-2'}`}>
        {/* Dirección de wallet */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={variant}
              size={size}
              className={`${fullWidth ? 'w-full' : ''} ${className} flex items-center gap-2 font-mono justify-between`} 
              onClick={() => setIsDropdownOpen(true)}
            >
              <div className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                <span>{formatAddress(address || '')}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium mb-1">{t('Wallet Connected')}</p>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 break-all">{address}</p>
            </div>
            {network && (
              <>
                <DropdownMenuSeparator />
                <div className="px-3 py-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs font-medium">{t('Network')}: {network.name}</span>
                </div>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{t('Refresh Connection')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              navigator.clipboard.writeText(address || '');
              toast({
                title: t('Address Copied'),
                description: t('The address has been copied to clipboard'),
                duration: 2000,
              });
              setIsDropdownOpen(false);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{t('Copy Address')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('Disconnect')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Web3ConnectButton;