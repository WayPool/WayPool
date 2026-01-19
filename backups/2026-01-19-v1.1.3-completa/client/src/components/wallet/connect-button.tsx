import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { formatAddress } from "@/lib/ethereum";
import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { RefreshWalletButton } from "./refresh-button";
import ConnectModal from "./connect-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-translation";

const ConnectButton: React.FC = () => {
  const { 
    address, 
    network, 
    connectWallet,
    disconnectWallet,
    isConnecting,
    isConnected,
    setIsModalOpen
  } = useWallet();
  
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleSwitchWallet = () => {
    // Primero desconectar
    disconnectWallet();
    // Luego abrir modal de conexión
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  };

  if (!address || !isConnected) {
    return (
      <>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-medium">{t('Connect wallet to access your positions')}</span>
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600"
          >
            {isConnecting ? t('Connecting...') : t('Connect Wallet')}
          </Button>
        </div>
        <ConnectModal />
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-2 flex items-center gap-2 w-full md:w-auto">
        <div className="network-indicator flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 ${network ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
          <span className="text-xs font-medium">{network ? network.name : 'ethereum'}</span>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg py-1.5 px-3 flex items-center">
          <span className="text-sm font-mono truncate max-w-[100px]">{formatAddress(address)}</span>
        </div>
        <RefreshWalletButton />
        
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronDown className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => disconnectWallet()} className="cursor-pointer text-red-500 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('Disconnect')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ConnectModal />
    </>
  );
};

export default ConnectButton;
