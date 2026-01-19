import { useState, useEffect } from 'react';

interface SimpleWalletReturn {
  account: string | null;
  address: string | null; // Alias para mantener compatibilidad
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: Error | null;
}

/**
 * Hook simplificado para la conexión al wallet del usuario
 * En Replit, simula la conexión a MetaMask
 * En un entorno real, intentará conectarse a MetaMask si está disponible
 */
export function useSimpleWallet(): SimpleWalletReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Forzamos a false para permitir conexiones reales de MetaMask
  const [isReplitEnvironment] = useState<boolean>(false);

  // Función para conectar al wallet (real o simulado)
  const connect = async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    // Si no hay MetaMask instalado, mostramos un error apropiado
    if (!window.ethereum) {
      setIsConnecting(false);
      setError(new Error('No se detectó MetaMask. Por favor instala la extensión de MetaMask en tu navegador.'));
      throw new Error('MetaMask no detectado');
    }

    // Conexión real a MetaMask si no estamos en Replit
    try {
      // Solicitar cuentas al wallet del usuario con un tiempo de espera
      const accountsPromise = (window.ethereum as any).request({
        method: 'eth_requestAccounts'
      });
      
      const timeoutPromise = new Promise<string[]>((_, reject) => 
        setTimeout(() => reject(new Error('Tiempo de espera agotado')), 10000)
      );
      
      const accounts = await Promise.race([accountsPromise, timeoutPromise]);

      if (accounts && accounts.length > 0) {
        // Guardar en localStorage para persistencia entre recargas
        localStorage.setItem('simpleWalletAccount', accounts[0]);
        setAccount(accounts[0]);
      } else {
        throw new Error('No se pudo obtener la cuenta del usuario.');
      }
    } catch (err) {
      console.error('Error al conectar wallet:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al conectar wallet'));
      throw err; // Re-lanzar el error para que el componente pueda manejarlo
    } finally {
      setIsConnecting(false);
    }
  };

  // Función para desconectar (limpia el estado y localStorage)
  const disconnect = (): void => {
    localStorage.removeItem('simpleWalletAccount');
    setAccount(null);
  };

  // Comprobar si hay una cuenta previamente conectada
  useEffect(() => {
    const checkConnection = async () => {
      // Primero intentamos obtener la cuenta desde localStorage
      const savedAccount = localStorage.getItem('simpleWalletAccount');
      
      // Eliminamos el caso especial de Replit para permitir conexiones reales
      
      // Si hay wallet en el navegador, intentamos obtener la cuenta actual
      if (window.ethereum) {
        try {
          // Añadimos un timeout para evitar que se quede esperando indefinidamente
          const accountsPromise = (window.ethereum as any).request({ method: 'eth_accounts' });
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Tiempo de espera agotado')), 3000)
          );
          
          // Esperamos a que se resuelva primero la que termine antes
          const accounts = await Promise.race([accountsPromise, timeoutPromise])
            .catch(err => {
              console.warn('Error al obtener cuentas:', err);
              return [];
            });
            
          if (Array.isArray(accounts) && accounts.length > 0) {
            setAccount(accounts[0]);
            localStorage.setItem('simpleWalletAccount', accounts[0]);
          } else if (savedAccount) {
            setAccount(savedAccount);
          }
        } catch (err) {
          console.error('Error al comprobar cuentas:', err);
          // Si falla, usamos la cuenta guardada en localStorage
          if (savedAccount) {
            setAccount(savedAccount);
          }
        }
      } else if (savedAccount) {
        // Si no hay wallet, usamos la cuenta guardada en localStorage
        setAccount(savedAccount);
      }
    };

    checkConnection();

    // Siempre configuramos los event listeners para detectar cambios de cuenta

    // Escuchar cambios de cuenta
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // El usuario desconectó todas las cuentas
        localStorage.removeItem('simpleWalletAccount');
        setAccount(null);
      } else {
        // El usuario cambió de cuenta
        localStorage.setItem('simpleWalletAccount', accounts[0]);
        setAccount(accounts[0]);
      }
    };

    // Escuchar desconexión de la wallet
    const handleDisconnect = () => {
      localStorage.removeItem('simpleWalletAccount');
      setAccount(null);
    };

    if (window.ethereum) {
      try {
        (window.ethereum as any).on('accountsChanged', handleAccountsChanged);
        (window.ethereum as any).on('disconnect', handleDisconnect);
      } catch (err) {
        console.warn('Error al configurar listeners de MetaMask:', err);
      }
    }

    return () => {
      if (window.ethereum) {
        try {
          (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
          (window.ethereum as any).removeListener('disconnect', handleDisconnect);
        } catch (err) {
          console.warn('Error al eliminar listeners de MetaMask:', err);
        }
      }
    };
  }, []);

  return {
    account,
    address: account, // Alias para mantener compatibilidad con otros componentes
    isConnected: !!account,
    isConnecting,
    connect,
    disconnect,
    error
  };
}

// Si hay un error de compatibilidad con la definición de ethereum,
// eliminamos la declaración global y usamos 'as any' donde sea necesario

export default useSimpleWallet;