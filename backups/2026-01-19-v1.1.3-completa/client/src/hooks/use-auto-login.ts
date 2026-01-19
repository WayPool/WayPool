import { useEffect, useRef } from 'react';
import { useWallet } from '@/hooks/use-wallet';

/**
 * Hook para autenticación automática cuando el wallet está conectado
 * pero el usuario no está autenticado en el backend
 */
export function useAutoLogin() {
  const { connectedWallet } = useWallet();
  const hasAttemptedLogin = useRef(false);

  useEffect(() => {
    // Si hay wallet conectado, intentar autenticación automática
    if (connectedWallet?.isConnected && connectedWallet?.address && !hasAttemptedLogin.current) {
      console.log("🔐 Wallet conectado - ejecutando login automático...");
      hasAttemptedLogin.current = true;
      
      // Usar el servicio de autenticación directo
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: connectedWallet.address
        }),
      })
        .then(response => response.json())
        .then((data) => {
          if (data.success) {
            console.log("✅ Login automático exitoso");
          } else {
            console.warn("⚠️ Error en login automático:", data.error);
          }
        })
        .catch((error) => {
          console.error("❌ Error ejecutando login automático:", error);
        });
    }

    // Reset del flag cuando el wallet se desconecta
    if (!connectedWallet?.isConnected) {
      hasAttemptedLogin.current = false;
    }
  }, [connectedWallet]);
}