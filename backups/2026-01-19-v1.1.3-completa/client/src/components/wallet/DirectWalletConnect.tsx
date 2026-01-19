import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import WalletConnectIcon from "@/assets/icon-walletconnect.svg";

// Componente simplificado que usa el método estándar para WalletConnect
const DirectWalletConnect = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);

    try {
      // Activar Web3Modal y cerrar el modal actual
      const web3ModalButton = document.getElementById('web3modal-connect-button');
      if (web3ModalButton) {
        web3ModalButton.click();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("No se encontró el botón de Web3Modal");
      }
    } catch (error) {
      console.error("Error al intentar conectar WalletConnect:", error);
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

export default DirectWalletConnect;