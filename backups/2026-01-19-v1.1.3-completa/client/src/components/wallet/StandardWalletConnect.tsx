import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight } from 'lucide-react';
import WalletConnectIcon from "@/assets/icon-walletconnect.svg";
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

// Componente que usa la implementación estándar de WalletConnect
const StandardWalletConnect = ({ onSuccess, onFailure }: { 
  onSuccess?: (address: string) => void,
  onFailure?: (error: Error) => void 
}) => {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<WalletConnectProvider | null>(null);

  // Limpiar el proveedor cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (provider && provider.connected) {
        try {
          provider.disconnect();
        } catch (e) {
          console.error("Error al desconectar WalletConnect:", e);
        }
      }
    };
  }, [provider]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      console.log("Iniciando conexión con WalletConnect...");

      // Crear una nueva instancia de WalletConnectProvider
      const walletConnectProvider = new WalletConnectProvider({
        infuraId: process.env.INFURA_API_KEY || import.meta.env.VITE_INFURA_API_KEY || '',
        bridge: "https://bridge.walletconnect.org",
        qrcodeModalOptions: {
          mobileLinks: ["metamask", "trust", "rainbow", "argent", "imtoken", "pillar"],
        },
      });

      // Guardar la instancia para limpiarla después
      setProvider(walletConnectProvider);
      
      console.log("Abriendo modal de QR de WalletConnect...");
      
      // Habilitar el proveedor (esto abre el modal QR)
      await walletConnectProvider.enable();
      
      console.log("WalletConnect habilitado, obteniendo cuentas...");
      
      // Conectar un proveedor de Ethers.js
      const ethersProvider = new ethers.BrowserProvider(walletConnectProvider as any);
      const accounts = await ethersProvider.listAccounts();
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0].address;
        console.log("Cuenta de WalletConnect conectada:", address);
        
        // Notificar éxito
        if (onSuccess) {
          onSuccess(address);
        }
      } else {
        throw new Error("No se pudo obtener la dirección de la wallet");
      }
    } catch (error) {
      console.error("Error al conectar con WalletConnect:", error);
      if (onFailure && error instanceof Error) {
        onFailure(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
      className="w-full bg-[#1c2237] hover:bg-[#232c45] rounded-lg p-3 flex items-center justify-between transition-colors h-auto"
      variant="ghost"
    >
      <div className="flex items-center space-x-3">
        <img src={WalletConnectIcon} alt="WalletConnect" className="w-8 h-8" />
        <span className="font-medium">WalletConnect</span>
        <span className="text-xs text-blue-400">(Scan QR)</span>
      </div>
      
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
      ) : (
        <ChevronRight className="h-5 w-5 text-gray-400" />
      )}
    </Button>
  );
};

export default StandardWalletConnect;