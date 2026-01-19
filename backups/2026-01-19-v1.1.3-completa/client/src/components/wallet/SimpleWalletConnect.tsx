import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import WalletConnectIcon from "@/assets/icon-walletconnect.svg";
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useWallet } from '@/hooks/use-wallet';
import logger from '@/utils/logger';

// Versión simplificada de WalletConnect utilizando directamente la biblioteca
const SimpleWalletConnect = () => {
  const [loading, setLoading] = useState(false);
  const { connectWithProvider } = useWallet();

  const handleConnect = async () => {
    try {
      setLoading(true);
      // Iniciando conexión con WalletConnect

      // Configurar proveedor WalletConnect
      const provider = new WalletConnectProvider({
        infuraId: process.env.INFURA_API_KEY || '',
        bridge: "https://bridge.walletconnect.org",
        qrcodeModalOptions: {
          mobileLinks: [
            "rainbow",
            "metamask",
            "argent",
            "trust",
            "imtoken",
            "pillar",
          ],
        },
      });
      
      // Habilitar el proveedor (abre el modal QR)
      await provider.enable();
      
      // Crear instancia de Web3 con el proveedor WalletConnect
      const web3 = new Web3(provider as any);
      
      // Obtener cuenta
      const accounts = await web3.eth.getAccounts();
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        // Cuenta conectada exitosamente
        
        // Crear función de desconexión
        const disconnect = async () => {
          await provider.disconnect();
        };
        
        // Pasamos la cuenta y la función de desconexión al hook
        connectWithProvider(address, disconnect);
      }

    } catch (error) {
      logger.error("Error al conectar con WalletConnect:", error);
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
        <span className="text-xs text-blue-400">→</span>
      )}
    </Button>
  );
};

export default SimpleWalletConnect;