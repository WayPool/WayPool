import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, ExternalLink } from "lucide-react";
import { useSimpleWallet } from "@/lib/simple-wallet-provider";
import { useToast } from "@/hooks/use-toast";

/**
 * Botón simple para conectar wallet 
 * Solo obtiene la dirección del wallet sin funcionalidades complejas
 * Soporta conexión real a MetaMask
 */
export function SimpleConnectButton() {
  const { account, isConnecting, connect, disconnect, showConnectDialog, web3Provider } = useSimpleWallet();
  const isConnected = !!account;
  const { toast } = useToast();
  const [showAddress, setShowAddress] = useState(true);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Verificar si MetaMask está instalado
  useEffect(() => {
    setIsMetaMaskInstalled(typeof window !== 'undefined' && !!window.ethereum);
  }, []);

  // Formatear dirección para mostrar solo los primeros y últimos caracteres
  const formatAddress = (address: string): string => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Manejar clic en el botón
  const handleClick = async () => {
    if (isConnected) {
      disconnect();
      toast({
        title: "Wallet desconectado",
        description: "Tu wallet ha sido desconectado correctamente.",
      });
    } else if (!isMetaMaskInstalled) {
      // Abrir página de MetaMask para instalación
      window.open('https://metamask.io/download/', '_blank');
    } else {
      try {
        // Añadir tiempo máximo de espera
        const connectionPromise = connect();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Tiempo de espera agotado")), 10000)
        );
        
        // Esperar a la primera promesa que se resuelva o rechace
        await Promise.race([connectionPromise, timeoutPromise]);
        
        // Si llegamos aquí sin error, la conexión fue exitosa
        toast({
          title: "Wallet conectado",
          description: "Tu wallet ha sido conectado correctamente.",
        });
      } catch (err) {
        // Resetear el estado de carga en caso de error
        disconnect();
        toast({
          title: "Error al conectar",
          description: err instanceof Error ? err.message : "No se pudo conectar al wallet",
          variant: "destructive",
        });
      }
    }
  };

  // Alternar entre mostrar dirección o etiqueta
  const toggleShowAddress = () => {
    setShowAddress(!showAddress);
  };

  return (
    <div className="flex items-center">
      {isConnected && (
        <Button
          variant="outline"
          size="sm"
          className="mr-2 text-xs"
          onClick={toggleShowAddress}
        >
          {showAddress ? formatAddress(account || "") : "Wallet conectado"}
        </Button>
      )}
      
      <Button
        variant={isConnected ? "outline" : "default"}
        size="sm"
        className="relative flex items-center gap-2 px-3 py-1 h-9"
        onClick={handleClick}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : !isMetaMaskInstalled && !isConnected ? (
          <ExternalLink className="h-4 w-4" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        <span>
          {isConnected 
            ? "Desconectar" 
            : !isMetaMaskInstalled 
              ? "Instalar MetaMask" 
              : "Conectar wallet"
          }
        </span>
      </Button>
    </div>
  );
}

export default SimpleConnectButton;