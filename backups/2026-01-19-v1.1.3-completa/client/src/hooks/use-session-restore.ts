import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { WalletType } from '@/lib/new-wallet-provider';

/**
 * Hook para restaurar sesión automáticamente al cargar la página
 */
export function useSessionRestore() {
  const { connectWallet } = useWallet();
  const [isRestoring, setIsRestoring] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    // Solo intentar una vez al cargar la página
    if (hasAttempted) return;
    
    const restoreSession = async () => {
      try {
        setIsRestoring(true);
        setHasAttempted(true);
        
        console.log("🔍 Verificando sesión guardada en el backend...");
        
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.authenticated && data.user?.walletAddress) {
            console.log("✅ Sesión válida encontrada para:", data.user.walletAddress);
            
            // Verificar si MetaMask está disponible y esperar a que esté listo
            if (typeof window !== 'undefined' && window.ethereum) {
              try {
                console.log("🔗 Verificando MetaMask...");
                
                // Obtener las cuentas ya conectadas sin solicitar permisos
                const accounts = await window.ethereum.request({ 
                  method: 'eth_accounts' 
                });
                
                if (accounts.length > 0) {
                  const connectedAccount = accounts[0].toLowerCase();
                  const sessionAccount = data.user.walletAddress.toLowerCase();
                  
                  if (connectedAccount === sessionAccount) {
                    console.log("🎉 MetaMask ya conectado con la cuenta correcta:", accounts[0]);
                    
                    // Usar la función de conexión normal para sincronizar el estado
                    const success = await connectWallet(WalletType.METAMASK, undefined);
                    
                    if (success) {
                      console.log("✅ Estado sincronizado con MetaMask");
                    } else {
                      console.warn("⚠️ No se pudo sincronizar el estado");
                    }
                  } else {
                    console.warn("⚠️ MetaMask conectado con cuenta diferente:", connectedAccount, "vs", sessionAccount);
                  }
                } else {
                  console.log("ℹ️ MetaMask no tiene cuentas conectadas - esperando conexión manual");
                }
              } catch (error) {
                console.error("❌ Error verificando MetaMask:", error);
              }
            } else {
              console.warn("⚠️ MetaMask no está disponible");
            }
          } else {
            console.log("ℹ️ No hay sesión válida guardada");
          }
        } else {
          console.log("ℹ️ No se pudo verificar la sesión");
        }
      } catch (error) {
        console.error("❌ Error restaurando sesión:", error);
      } finally {
        setIsRestoring(false);
      }
    };

    // Ejecutar después de un pequeño delay para asegurar que todo esté cargado
    const timer = setTimeout(restoreSession, 1000);
    
    return () => clearTimeout(timer);
  }, [connectWallet, hasAttempted]);

  return { isRestoring };
}