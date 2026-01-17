// Web3Connector.tsx
import React, { useState, useEffect, useRef } from 'react';
import { WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logger from '@/utils/logger';

// Importación dinámica para evitar errores en SSR y mejorar la estabilidad
let createWeb3Modal: any;
let defaultWagmiConfig: any;

// Función segura para importar las dependencias Web3Modal
const loadWeb3ModalDependencies = async () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const w3mModule = await import('@web3modal/wagmi');
    createWeb3Modal = w3mModule.createWeb3Modal;
    defaultWagmiConfig = w3mModule.defaultWagmiConfig;
    return true;
  } catch (error) {
    logger.warn('Error cargando dependencias de Web3Modal (silenciado para producción)');
    return false;
  }
};

// Proyecto ID para WalletConnect v2
// En un entorno real, esto debería estar en una variable de entorno
const projectId = "27e484dcd237756ba3f1c4d8bf2dd4fb";

// Definir las cadenas con las que queremos trabajar
const chains = [mainnet, polygon] as const;

// Usar la URL actual del navegador en lugar de una URL fija para evitar advertencias
const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://waybank.com';

// Variable para almacenar la configuración de Wagmi
let wagmiConfig: any;

// Variable para controlar si se ha intentado la inicialización
let initializationAttempted = false;

// Función para inicializar la configuración de forma segura
function getWagmiConfig() {
  if (wagmiConfig) return wagmiConfig;
  
  try {
    wagmiConfig = defaultWagmiConfig({
      chains,
      projectId,
      metadata: {
        name: 'WayBank',
        description: 'Conecta tu wallet a WayBank',
        url: currentUrl, 
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    });
    return wagmiConfig;
  } catch (error) {
    logger.warn("Error creando configuración Wagmi (manejado)", { handled: true });
    // Devolvemos una configuración mínima para evitar errores fatales
    return {
      chains,
      projectId
    };
  }
}

// Función segura para inicializar Web3Modal
async function safeInitializeWeb3Modal() {
  // Solo intentamos inicializar una vez para evitar errores repetidos
  if (initializationAttempted) return;
  initializationAttempted = true;
  
  try {
    // Verificamos si ya existe una instancia
    if (!(window as any).web3ModalInstance) {
      // Primero cargar las dependencias dinámicamente
      const dependenciesLoaded = await loadWeb3ModalDependencies();
      
      // Si no se pudieron cargar las dependencias, salimos
      if (!dependenciesLoaded) {
        logger.info("No se pudieron cargar las dependencias de Web3Modal, omitiendo inicialización");
        (window as any).web3ModalInstance = "unavailable";
        return;
      }
      
      // Obtenemos la configuración
      const config = getWagmiConfig();
      
      // Creamos la instancia con manejo de errores
      try {
        // Nos aseguramos de que las funciones estén disponibles
        if (typeof createWeb3Modal === 'function') {
          createWeb3Modal({ 
            wagmiConfig: config, 
            projectId, 
            themeMode: 'dark'
          });
          
          // Marcamos como inicializado
          (window as any).web3ModalInstance = true;
          logger.info("Web3Modal inicializado correctamente");
        } else {
          // Función no disponible
          logger.warn("Función createWeb3Modal no disponible", { 
            handled: true 
          });
          (window as any).web3ModalInstance = "fallback";
        }
      } catch (modalError) {
        // Si hay un error, lo registramos pero no lo mostramos en consola
        logger.warn("Advertencia en inicialización de Web3Modal (controlada)", { 
          error_handled: true,
          context: "createWeb3Modal"
        });
        
        // Intentamos mantener la funcionalidad mínima
        (window as any).web3ModalInstance = "fallback";
      }
    }
  } catch (outerError) {
    // Capturamos cualquier error en el proceso general
    logger.warn("Error en el proceso general de inicialización de Web3Modal", { 
      handled: true 
    });
    // Marcamos como fallido para no reintentar
    (window as any).web3ModalInstance = "failed";
  }
}

// Inicializar de forma segura si estamos en el navegador
if (typeof window !== 'undefined') {
  // Ejecutamos la inicialización en el siguiente ciclo del event loop
  // para asegurar que el DOM esté completamente cargado
  setTimeout(() => {
    safeInitializeWeb3Modal();
  }, 0);
}

// Función auxiliar para abrir el modal de WalletConnect
export const openWeb3Modal = () => {
  logger.info("Web3Modal botón activado");
  
  // Intenta usar la API global de Web3Modal directamente
  try {
    if (typeof window !== 'undefined' && (window as any).Web3Modal) {
      logger.info("Abriendo Web3Modal usando API global");
      (window as any).Web3Modal.open();
      return true;
    }
  } catch (err) {
    logger.warn("No se pudo abrir Web3Modal con API global:", err);
  }
  
  // Buscar si ya existe un botón w3m en el DOM
  const existingButtons = document.querySelectorAll('w3m-button, [w3m-button]');
  if (existingButtons.length > 0) {
    logger.info("Botón Web3Modal encontrado en el DOM");
    try {
      (existingButtons[0] as HTMLElement).click();
      return true;
    } catch (err) {
      logger.warn("Error al hacer clic en botón existente:", err);
    }
  }
  
  // Intentar encontrar el modal
  try {
    const modalElement = document.querySelector('w3m-modal');
    if (modalElement) {
      logger.info("Elemento w3m-modal encontrado, intentando abrir");
      // Disparar un evento personalizado
      const openEvent = new CustomEvent('w3m-open');
      modalElement.dispatchEvent(openEvent);
      return true;
    }
  } catch (err) {
    logger.warn("Error al buscar w3m-modal:", err);
  }
  
  // Si todo lo anterior falla, intentar implementación directa
  // Utilizar el botón que se creó en App.tsx
  try {
    const webButton = document.getElementById('web3modal-connect-button');
    if (webButton) {
      logger.info("Usando botón web3modal-connect-button existente");
      webButton.click();
      return true;
    }
  } catch (err) {
    logger.warn("Error al usar botón existente:", err);
  }
  
  // Último intento: crear un nuevo botón
  try {
    logger.info("Creando nuevo botón w3m-button");
    const button = document.createElement('w3m-button');
    button.setAttribute('w3m-button', '');
    document.body.appendChild(button);
    
    setTimeout(() => {
      try {
        button.click();
        logger.info("Clic realizado en botón nuevo");
        // Limpiar después
        setTimeout(() => button.remove(), 5000);
      } catch (clickErr) {
        logger.error("Error al hacer clic en botón nuevo:", clickErr);
      }
    }, 200);
    
    return true;
  } catch (err) {
    logger.error("Error creando botón Web3Modal dinámicamente:", err);
    return false;
  }
};

// Componente principal para conectar con Web3
const Web3Connector = ({ onConnect }: { onConnect?: (address: string, chainId: string) => void }) => {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  
  // Asegurar que la inicialización se haga cuando el componente está montado
  useEffect(() => {
    if (typeof window !== 'undefined' && !initializationAttempted) {
      safeInitializeWeb3Modal();
    }
  }, []);

  // Función para conectar la wallet
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      // En la nueva versión, esto abre automáticamente el modal
      if (window.ethereum) {
        try {
          // Esta línea abre el modal de selección de wallet en la versión actualizada
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (err) {
          logger.info('Usuario rechazó la conexión o no tiene wallet');
          // No manejamos el error aquí, solo registramos
        }
      } else {
        // Si no hay ethereum, utilizamos el web3modal global
        // que ya está configurado y disponible globalmente
        document.getElementById('web3modal-connect-button')?.click();
      }
    } catch (err: any) {
      logger.error('Error al conectar:', err);
      setError('Error al conectar: ' + (err.message || 'Desconocido'));
      
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar a la wallet. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para desconectar
  const disconnectWallet = async () => {
    try {
      if (window.ethereum) {
        // No hay un método estándar para desconectar en la Web3 Provider API
        // Simplemente reiniciamos el estado local
        setAccount('');
        setChainId('');
        setBalance('');
        
        toast({
          title: "Desconectado",
          description: "Tu wallet ha sido desconectada.",
        });
      }
    } catch (err: any) {
      logger.error('Error al desconectar:', err);
      setError('Error al desconectar: ' + (err.message || 'Desconocido'));
      
      toast({
        title: "Error al desconectar",
        description: "No se pudo desconectar la wallet correctamente.",
        variant: "destructive"
      });
    }
  };

  // Escuchar cambios de cuenta y cadena
  useEffect(() => {
    const handleAccountsChanged = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            setAccount(address);
            
            // Obtener el chainId
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chainIdDecimal = parseInt(chainId, 16).toString();
            setChainId(chainIdDecimal);
            
            // Obtener el balance
            const balanceHex = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [address, 'latest']
            });
            
            const balanceInWei = parseInt(balanceHex, 16);
            const balanceInEth = balanceInWei / 10**18;
            setBalance(balanceInEth.toFixed(4));
            
            // Notificar al componente padre
            if (onConnect) {
              onConnect(address, chainIdDecimal);
            }
          } else {
            setAccount('');
            setChainId('');
            setBalance('');
          }
        } catch (err) {
          logger.error("Error al obtener información de la cuenta:", err);
        }
      }
    };
    
    // Verificar si ya hay cuentas conectadas al cargar
    handleAccountsChanged();
    
    // Configurar listeners para eventos de cambio
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => {
        handleAccountsChanged(); // Volvemos a cargar toda la información
      });
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleAccountsChanged);
      };
    }
  }, [onConnect]);

  // Obtener configuración Wagmi de forma segura
  const config = useRef<any>(null);
  
  useEffect(() => {
    // Solo intentar obtener la configuración una vez
    if (!config.current && typeof getWagmiConfig === 'function') {
      try {
        config.current = getWagmiConfig();
      } catch (error) {
        logger.warn("Error obteniendo configuración Wagmi en componente", { 
          handled: true 
        });
        // Configuración mínima de fallback
        config.current = { chains, projectId };
      }
    }
  }, []);
  
  // Renderizar de forma segura
  return (
    <>
      {config.current ? (
        <WagmiConfig config={config.current}>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Conectar a Web3</CardTitle>
              <CardDescription>
                Conecta tu wallet para interactuar con la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
              
              {!account ? (
                <Button 
                  onClick={connectWallet} 
                  disabled={loading}
                  className="w-full"
                  id="web3modal-connect-button"
                  w3m-button // Esto hace que el botón sea reconocido por Web3Modal
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Conectando...
                    </>
                  ) : 'Conectar Wallet'}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Dirección:</div>
                    <div className="font-medium truncate">{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</div>
                    
                    <div className="text-muted-foreground">Red:</div>
                    <div className="font-medium">
                      {chainId === '1' ? 'Ethereum Mainnet' : 
                      chainId === '137' ? 'Polygon' : 
                      `Chain ID: ${chainId}`}
                    </div>
                    
                    <div className="text-muted-foreground">Balance:</div>
                    <div className="font-medium">{balance} ETH</div>
                  </div>
                  
                  <Button 
                    onClick={disconnectWallet}
                    variant="outline"
                    className="w-full"
                  >
                    Desconectar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </WagmiConfig>
      ) : (
        // Renderizar estado de carga o error mientras no hay configuración
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Conectar a Web3</CardTitle>
            <CardDescription>
              Cargando opciones de conexión...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Web3Connector;