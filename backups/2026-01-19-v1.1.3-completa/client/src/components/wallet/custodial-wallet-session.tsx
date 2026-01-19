import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { APP_NAME } from '@/utils/app-config';

/**
 * Componente invisible que monitorea y gestiona la sesión de la billetera custodiada
 * Este componente se encarga de:
 * 1. Almacenar el token de sesión en localStorage cuando se conecta a una billetera custodiada
 * 2. Validar regularmente que la sesión sigue siendo válida
 * 3. Reintentar la autenticación si la sesión expira
 * 4. Mantener la sesión activa hasta que el usuario desconecte explícitamente la wallet
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
    
    // Para la billetera de prueba, siempre establecemos un token válido en localStorage
    if (walletAddress.toLowerCase() === '0xc2dd65af9fed4a01fb8764d65c591077f02c6497') {
      console.log('[CustodialWallet] Estableciendo token fijo para billetera de prueba');
      localStorage.setItem('custodialSessionToken', 'test-session-token-123456789');
      localStorage.setItem('walletAddress', walletAddress.toLowerCase());
      console.log('[CustodialWallet] Dirección y token guardados para reconexión automática');
    }

    // Función para verificar la sesión
    const checkSession = async () => {
      try {
        // Verificar si tenemos un token de sesión
        const sessionToken = localStorage.getItem('custodialSessionToken');
        
        if (!sessionToken) {
          // Si no hay token, intentamos iniciar sesión automáticamente con el token fijo para testing
          if (walletAddress.toLowerCase() === '0xc2dd65af9fed4a01fb8764d65c591077f02c6497') {
            console.log('[CustodialWallet] Iniciando sesión automática para wallet de testing');
            
            // Intentamos realizar un login automático simulado
            try {
              console.log('[CustodialWallet] Realizando login automático para wallet de testing...');
              
              const loginResponse = await apiRequest(
                'POST',
                '/api/custodial-wallet/login',
                {
                  email: `test@${APP_NAME.toLowerCase()}.com`,
                  password: 'Test123456!'
                }
              );
              
              if (loginResponse && loginResponse.success && loginResponse.sessionToken) {
                console.log('[CustodialWallet] Login automático exitoso, token recibido');
                localStorage.setItem('custodialSessionToken', loginResponse.sessionToken);
                localStorage.setItem('walletAddress', walletAddress.toLowerCase());
                
                // Intentamos validar la sesión inmediatamente con el token
                try {
                  console.log('[CustodialWallet] Validando sesión después de login automático...');
                  const validateResponse = await apiRequest(
                    'GET', 
                    `/api/custodial-wallet/${walletAddress}/validate?sessionToken=${encodeURIComponent(loginResponse.sessionToken)}`, 
                    null, 
                    {
                      headers: {
                        'x-custodial-session': loginResponse.sessionToken
                      }
                    }
                  );
                  
                  if (validateResponse && validateResponse.valid) {
                    console.log('[CustodialWallet] Sesión validada correctamente después de login automático');
                  } else {
                    console.warn('[CustodialWallet] No se pudo validar la sesión después de login automático');
                  }
                } catch (validationError) {
                  console.error('[CustodialWallet] Error validando sesión después de login automático:', validationError);
                }
              } else {
                console.warn('[CustodialWallet] Login automático fallido, usando token de respaldo');
                
                // Si falla el login, usamos un token de respaldo para testing
                const testToken = 'test-session-token-123456789';
                localStorage.setItem('custodialSessionToken', testToken);
                localStorage.setItem('walletAddress', walletAddress.toLowerCase());
                
                try {
                  console.log('[CustodialWallet] Validando sesión con token de respaldo...');
                  const validateResponse = await apiRequest(
                    'GET', 
                    `/api/custodial-wallet/${walletAddress}/validate?sessionToken=${encodeURIComponent(testToken)}`, 
                    null, 
                    {
                      headers: {
                        'x-custodial-session': testToken
                      }
                    }
                  );
                  
                  if (validateResponse && validateResponse.valid) {
                    console.log('[CustodialWallet] Sesión de testing validada correctamente con token de respaldo');
                  } else {
                    console.warn('[CustodialWallet] No se pudo validar la sesión de testing con token de respaldo');
                  }
                } catch (error) {
                  console.error('[CustodialWallet] Error validando sesión de testing con token de respaldo:', error);
                }
              }
            } catch (loginError) {
              console.error('[CustodialWallet] Error en login automático:', loginError);
              
              // Si falla el login, usamos un token de respaldo para testing
              const testToken = 'test-session-token-123456789';
              localStorage.setItem('custodialSessionToken', testToken);
              localStorage.setItem('walletAddress', walletAddress.toLowerCase());
            }
            
            return;
          }
          
          console.log('[CustodialWallet] No hay token de sesión para validar');
          return;
        }
        
        // Validar la sesión con el backend - enviando el token como parámetro de consulta para mayor compatibilidad
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