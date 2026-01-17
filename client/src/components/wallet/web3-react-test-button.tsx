import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWeb3React } from "@/hooks/use-web3-react";
// Referencia eliminada - proveedor consolidado
import { formatAddress } from "@/lib/ethereum";
import { NETWORKS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Wallet, Loader2, ChevronDown, Network, LogOut, 
  QrCode, CreditCard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Web3ReactTestButton() {
  const { 
    account, 
    isConnected, 
    isConnecting, 
    activate, 
    deactivate, 
    chainId,
    isModalOpen,
    setIsModalOpen,
    switchNetwork
  } = useWeb3React();
  
  const [isNetworkDialogOpen, setIsNetworkDialogOpen] = useState(false);

  // Obtener nombre de la red actual
  const currentNetwork = chainId
    ? Object.values(NETWORKS).find((network) => network.chainId === chainId)
    : null;

  const handleConnectWallet = async (connectorName: ConnectorNames) => {
    try {
      await activate(connectorName);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error conectando wallet:", error);
    }
  };

  const handleSwitchNetwork = async (newChainId: number) => {
    try {
      await switchNetwork(newChainId);
      setIsNetworkDialogOpen(false);
    } catch (error) {
      console.error("Error al cambiar de red:", error);
    }
  };

  return (
    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 mb-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">@web3-react Test Button</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Prueba la nueva implementación de conexión a wallet</p>
      </div>
      
      {isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-3 py-1 h-10 border-slate-500/30 dark:border-slate-500/30 bg-transparent"
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium">
                    {formatAddress(account || "")}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {currentNetwork?.name || "Red desconocida"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem
              className="flex items-center gap-2 py-2 cursor-pointer"
              onClick={() => setIsNetworkDialogOpen(true)}
            >
              <Network className="w-4 h-4" />
              <span>Cambiar red</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 py-2 cursor-pointer text-red-500"
              onClick={deactivate}
            >
              <LogOut className="w-4 h-4" />
              <span>Desconectar wallet</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          disabled={isConnecting}
          className="relative flex items-center gap-2 px-3 py-1 h-9"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Conectando...</span>
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              <span>Conectar wallet (@web3-react)</span>
            </>
          )}
        </Button>
      )}

      {/* Modal de conexión de wallets */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar wallet con @web3-react</DialogTitle>
            <DialogDescription>
              Elija una de las siguientes opciones para conectar su wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 h-12"
              onClick={() => handleConnectWallet(ConnectorNames.Injected)}
            >
              <Wallet className="h-5 w-5 text-orange-500" />
              <span>MetaMask</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 h-12"
              onClick={() => handleConnectWallet(ConnectorNames.CoinbaseWallet)}
            >
              <CreditCard className="h-5 w-5 text-blue-500" />
              <span>Coinbase Wallet</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-3 h-12"
              onClick={() => handleConnectWallet(ConnectorNames.WalletConnect)}
            >
              <QrCode className="h-5 w-5 text-blue-600" />
              <span>WalletConnect</span>
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para cambiar de red */}
      <Dialog open={isNetworkDialogOpen} onOpenChange={setIsNetworkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar red (@web3-react)</DialogTitle>
            <DialogDescription>Seleccione la red a la que desea cambiar.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.values(NETWORKS).map((network) => (
              <Button
                key={network.chainId}
                variant={network.chainId === chainId ? "default" : "outline"}
                className="flex items-center justify-start gap-3 h-12"
                onClick={() => handleSwitchNetwork(network.chainId)}
                disabled={network.chainId === chainId}
              >
                <div
                  className="h-3 w-3 rounded-full bg-primary"
                />
                <span>{network.name}</span>
                {network.chainId === chainId && (
                  <span className="ml-auto text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                    Activa
                  </span>
                )}
              </Button>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsNetworkDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}