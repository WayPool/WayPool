import { useCallback } from 'react';
import { useWallet } from './use-wallet';
import { useToast } from './use-toast';

/**
 * Hook para forzar la actualización de la conexión con el wallet
 * Útil cuando ocurren eventos como cambio de cuenta o red
 */
export function useRefreshWallet() {
  const { refreshConnection, address } = useWallet();
  const { toast } = useToast();

  const triggerRefresh = useCallback(async () => {
    let oldAddress = address;
    
    try {
      console.log("Actualizando conexión de wallet...");
      const success = await refreshConnection();
      
      if (success) {
        // Si la dirección cambió, significa que se detectó una nueva wallet
        if (address && oldAddress !== address) {
          console.log(`Cambiado de wallet: ${oldAddress} -> ${address}`);
          toast({
            title: "Wallet cambiada",
            description: `Nueva wallet detectada: ${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`,
            variant: "default"
          });
        } else {
          console.log("Conexión actualizada correctamente");
          toast({
            title: "Wallet actualizada",
            description: `Conectado a ${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`,
            variant: "default"
          });
        }
        return true;
      } else {
        console.log("No se pudo actualizar la conexión");
        toast({
          title: "Conexión no actualizada",
          description: "No se detectaron cambios en la wallet",
          variant: "default"
        });
        return false;
      }
    } catch (error) {
      console.error("Error al refrescar la conexión:", error);
      toast({
        title: "Error de conexión",
        description: "No se pudo actualizar la conexión con el wallet",
        variant: "destructive"
      });
      return false;
    }
  }, [refreshConnection, address, toast]);

  return { triggerRefresh };
}