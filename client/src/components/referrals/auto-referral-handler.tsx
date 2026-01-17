import React, { useEffect, useState, useContext } from 'react';
import { useReferralCode } from '@/context/referral-code-context';
import { useWallet, WAYBANK_WALLET_ADDRESS_KEY } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

// Función para hacer solicitudes API
const apiRequest = async<T = any>({
  url,
  method = 'GET',
  data = undefined
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  data?: any;
}): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Incluir cookies
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const responseData = await response.json();
  return responseData;
};

// Componente que maneja automáticamente los códigos de referido cuando un usuario se conecta
export function AutoReferralHandler() {
  const { detectedReferralCode, clearDetectedReferralCode } = useReferralCode();
  const { isConnected, address } = useWallet();
  const [hasProcessed, setHasProcessed] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Al cargar o cuando cambie el estado de conexión, procesar el código de referido
  useEffect(() => {
    // Creamos una bandera para manejar el caso de unmount
    let isMounted = true;
    
    const processReferral = async () => {
      // Obtener la dirección del wallet actual
      const currentWalletAddress = address || localStorage.getItem(WAYBANK_WALLET_ADDRESS_KEY);
      
      // Solo procesar si:
      // 1. El usuario está conectado
      // 2. Hay un código detectado
      // 3. No se ha procesado ya en esta sesión
      // 4. Tenemos una dirección de wallet válida
      if (isConnected && currentWalletAddress && detectedReferralCode && !hasProcessed) {
        try {
          console.log(`AutoReferralHandler: Procesando código de referido ${detectedReferralCode} para wallet ${currentWalletAddress}`);
          
          // Verificar si el usuario ya tiene un referido
          // Usamos un timeout para evitar que la aplicación se bloquee
          const checkPromise = new Promise(async (resolve, reject) => {
            try {
              // Incluir la dirección del wallet en la consulta
              const checkResponse = await apiRequest<{isReferred: boolean}>({
                url: `/api/referrals/check-referred?walletAddress=${currentWalletAddress}`,
                method: 'GET'
              });
              resolve(checkResponse);
            } catch (error) {
              console.error('Error al verificar si el usuario ya tiene un referido:', error);
              reject(error);
            }
          });
          
          // Establecemos un timeout para la petición
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout al verificar estado de referido')), 5000);
          });
          
          // Esperamos la primera promesa que se resuelva (la petición o el timeout)
          const checkResponse = await Promise.race([checkPromise, timeoutPromise]) as {isReferred: boolean};
          
          // Si el componente ya no está montado, salimos
          if (!isMounted) return;
          
          // Si el usuario ya tiene un referido, no hacemos nada
          if (checkResponse.isReferred) {
            console.log('AutoReferralHandler: El usuario ya tiene un referido.');
            // Limpiamos el código detectado ya que no se puede usar
            clearDetectedReferralCode();
            return;
          }
          
          // Normalizar el código (eliminar espacios)
          const normalizedCode = detectedReferralCode.trim();
          
          // Usar el código de referido con timeout de seguridad
          // Usamos /api/referrals/users/referred que es el endpoint correcto implementado
          const useCodePromise = new Promise(async (resolve, reject) => {
            try {
              const response = await apiRequest({
                url: '/api/referrals/users/referred',
                method: 'POST',
                data: { 
                  referralCode: normalizedCode,
                  walletAddress: currentWalletAddress // Incluir explícitamente la dirección del wallet
                }
              });
              resolve(response);
            } catch (error) {
              console.error('Error al usar código de referido:', error);
              reject(error);
            }
          });
          
          // Establecemos un timeout para la petición
          const useCodeTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout al usar código de referido')), 5000);
          });
          
          // Esperamos la primera promesa que se resuelva (la petición o el timeout)
          const response = await Promise.race([useCodePromise, useCodeTimeoutPromise]) as any;
          
          // Si el componente ya no está montado, salimos
          if (!isMounted) return;
          
          if (response && response.success) {
            console.log('AutoReferralHandler: Código de referido aplicado con éxito.');
            // Solo mostramos el toast si el componente sigue montado
            if (isMounted) {
              toast({
                title: t("Referral Code Applied"),
                description: t("You are now using a referral code that gives you a 1% APR boost on all your positions!"),
                variant: "default"
              });
            }
            
            // Limpiar código detectado después de usarlo exitosamente
            clearDetectedReferralCode();
          } else if (response) {
            console.error('AutoReferralHandler: Error al aplicar código de referido:', response.error);
            // No mostramos toast de error porque puede ser confuso para el usuario
            // ya que este proceso es automático en segundo plano
          }
        } catch (error) {
          console.error('AutoReferralHandler: Error al procesar el código de referido:', error);
          // No hacemos nada más para permitir que la aplicación continúe funcionando
        } finally {
          // Solo actualizamos el estado si el componente sigue montado
          if (isMounted) {
            // Marcar como procesado para no intentarlo de nuevo en esta sesión
            setHasProcessed(true);
          }
        }
      }
    };
    
    // Usamos un setTimeout para evitar que este componente bloquee el renderizado inicial
    const timerId = setTimeout(() => {
      processReferral();
    }, 2000); // Retrasar el procesamiento por 2 segundos para permitir que la aplicación se cargue primero
    
    // Limpieza cuando el componente se desmonta
    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [isConnected, address, detectedReferralCode, hasProcessed, clearDetectedReferralCode, toast, t]);
  
  // Este componente no renderiza nada visible
  return null;
}

export default AutoReferralHandler;