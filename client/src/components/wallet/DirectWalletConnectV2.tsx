import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight } from 'lucide-react';
import WalletConnectIcon from "@/assets/icon-walletconnect.svg";

// Componente optimizado para WalletConnect
const DirectWalletConnectV2 = () => {
  const [loading, setLoading] = useState(false);
  
  const handleConnect = async () => {
    try {
      setLoading(true);
      console.log("Iniciando conexión con WalletConnect V2...");
      
      // Importación dinámica para evitar problemas durante la renderización
      const WalletConnectProvider = await import('@walletconnect/web3-provider').then(m => m.default);
      
      // Crear una instancia de WalletConnectProvider con configuración básica
      const provider = new WalletConnectProvider({
        infuraId: process.env.INFURA_API_KEY || import.meta.env.VITE_INFURA_API_KEY || '',
        qrcodeModalOptions: {
          mobileLinks: [
            "metamask",
            "trust",
            "rainbow",
            "argent",
            "imtoken",
            "pillar"
          ]
        }
      });
      
      // Mostrar el modal QR y esperar conexión
      await provider.enable();
      
      // Una vez conectado, obtenemos la dirección
      const accounts = provider.accounts;
      
      if (accounts && accounts.length > 0) {
        const userAddress = accounts[0];
        console.log("Conectado con cuenta:", userAddress);
        
        // Guardar información en localStorage
        localStorage.setItem("walletProvider", "walletconnect");
        localStorage.setItem("walletAddress", userAddress);
        
        // Recargar para aplicar la conexión
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al conectar con WalletConnect:", error);
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

export default DirectWalletConnectV2;