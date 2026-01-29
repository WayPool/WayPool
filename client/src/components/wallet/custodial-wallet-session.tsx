import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { APP_NAME } from '@/utils/app-config';

/**
 * Componente invisible que monitorea y gestiona la sesión de la billetera custodiada
 * Este componente se encarga de:
 * 1. Almacenar el token de sesión en localStorage cuando se conecta a una billetera custodiada
 * 2. Validar regularmente que la sesión sigue siendo válida
 * 3. Mantener la sesión activa hasta que el usuario desconecte explícitamente la wallet
 */
export default function CustodialWalletSession({
  walletAddress,
  walletType,
}: {
  walletAddress: string | null;
  walletType: string;
}) {
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Verificar si estamos usando una billetera custodiada
  const isCustodial = walletType === `${APP_NAME} Wallet`;

  // Efecto para monitorear la sesión de la billetera custodiada
  useEffect(() => {
    // No hacemos nada si no es una billetera custodiada o no hay dirección
    if (!isCustodial || !walletAddress) {
      return;
    }

    // Función para verificar la sesión
    const checkSession = async () => {
      try {
        // Verificar si tenemos un token de sesión
        const sessionToken = localStorage.getItem('custodialSessionToken');

        if (!sessionToken) {
          console.log('[CustodialWallet] No hay token de sesión para validar');
          return;
        }

        // Validar la sesión con el backend
        const response = await apiRequest('GET', `/api/custodial-wallet/${walletAddress}/validate?sessionToken=${encodeURIComponent(sessionToken)}`, null, {
          headers: {
            'x-custodial-session': sessionToken
          }
        });

        if (response && response.valid) {
          console.log('[CustodialWallet] Sesión válida hasta:', new Date(response.expiresAt));
        } else {
          console.warn('[CustodialWallet] Sesión inválida, eliminando token y dirección');
          localStorage.removeItem('custodialSessionToken');
          localStorage.removeItem('walletAddress');
        }
      } catch (error) {
        console.error('Error monitoring custodial wallet:', error);
      }
    };

    // Comprobar la sesión inmediatamente al cargar
    checkSession();

    // Configurar intervalo para verificar la sesión cada 5 minutos
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    setIsMonitoring(true);

    // Limpiar intervalo al desmontar
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [walletAddress, isCustodial]);

  // Este componente es invisible, no renderiza nada
  return null;
}
