import React, { createContext, useEffect, useState } from "react";
import { ethers, BrowserProvider, Signer } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { NETWORKS, Network } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { APP_NAME } from "@/utils/app-config";
import { WalletSessionManager, WalletSessionData } from "@/lib/wallet-session-manager";
import { AutoReconnectManager } from "@/lib/auto-reconnect";

// Declaración para que TypeScript reconozca window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}

// Enumeración para los tipos de carteras soportadas
export enum WalletType {
  METAMASK = "metamask",
  COINBASE = "coinbase",
  WALLETCONNECT = "walletconnect",
  WEB3MODAL = "web3modal",
  CUSTODIAL = "custodial" // Tipo para billeteras custodiadas {APP_NAME}
}

// Interface para opciones adicionales al conectar
interface ConnectWalletOptions {
  address?: string;  // Dirección para billeteras custodiadas
  sessionToken?: string; // Token de sesión para billeteras custodiadas
  [key: string]: any; // Permitir otras opciones en el futuro
}

interface WalletContextType {
  address: string | null;
  account: string | null;  // Alias para address, usado en components de integración
  isConnected: boolean;    // Indica si hay conexión activa
  chainId: number | null;
  network: Network | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  connectWallet: (walletType: WalletType, options?: ConnectWalletOptions) => Promise<boolean>;
  disconnectWallet: () => void;
  refreshConnection: () => Promise<boolean | undefined>; // Añadido para forzar actualizaciones
  isConnecting: boolean;
  error: string | null;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

// Inicializamos el contexto con valores por defecto
export const WalletContext = createContext<WalletContextType>({
  address: null,
  account: null,
  isConnected: false,
  chainId: null,
  network: null,
  provider: null,
  signer: null,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  refreshConnection: async () => undefined,
  isConnecting: false,
  error: null,
  isModalOpen: false,
  setIsModalOpen: () => {},
  switchNetwork: async () => {},
});

interface WalletProviderProps {
  children: React.ReactNode;
}

// Inicializar Web3Modal
let web3Modal: Web3Modal | null = null;

// Esta función inicializa web3Modal solo una vez
const getWeb3Modal = () => {
  if (web3Modal) return web3Modal;

  // Obtener la clave de Infura (se utilizará con WalletConnect)
  const infuraId = import.meta.env.VITE_INFURA_API_KEY || import.meta.env.INFURA_API_KEY || "ede1fccc624543fea1c96277472edd49";

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId,
        rpc: {
          1: `https://mainnet.infura.io/v3/${infuraId}`,
          137: `https://polygon-mainnet.infura.io/v3/${infuraId}`, // Polygon Mainnet
          80001: `https://polygon-mumbai.infura.io/v3/${infuraId}`, // Polygon Mumbai testnet
          56: "https://bsc-dataseed.binance.org", // BSC
          42161: `https://arbitrum-mainnet.infura.io/v3/${infuraId}`, // Arbitrum
        },
        qrcodeModalOptions: {
          mobileLinks: ["coinbase", "metamask", "trust"],
          desktopLinks: ["metamask", "ledger"]
        }
      }
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: APP_NAME,
        infuraId,
        darkMode: true
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: true, // Recordar último proveedor conectado
    providerOptions,
    theme: "dark",
    disableInjectedProvider: false // Permitir MetaMask
  });

  return web3Modal;
};

export function WalletProvider({ children }: WalletProviderProps) {
  console.log("🚀 WalletProvider montándose...");
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInstance, setCurrentInstance] = useState<any>(null);

  // Intentar conectarse automáticamente con el último proveedor utilizado o wallet guardado
  useEffect(() => {
    const init = async () => {
      console.log("🚀 Inicializando proveedor de wallet con persistencia...");
      console.log("🔍 WalletProvider useEffect ejecutándose al montar el componente");

      // CRÍTICO: Verificar PRIMERO si hay un wallet provider disponible
      // Si no hay wallet (Firefox/navegador sin extensión), limpiar sesión y NO intentar reconectar
      const savedSession = WalletSessionManager.getSession();
      const hasWalletProvider = typeof window !== 'undefined' && (
        window.ethereum ||
        savedSession?.walletType === 'custodial'
      );

      if (savedSession && !hasWalletProvider) {
        console.log("⚠️ Sesión guardada pero NO hay wallet provider disponible - limpiando sesión para evitar loops");
        WalletSessionManager.clearSession();
        WalletSessionManager.clearLoginSession();
        console.log("✅ Sesión limpiada. La página cargará sin intentos de reconexión.");
        return; // Salir inmediatamente, no intentar nada más
      }

      // Si no hay sesión guardada, no hay nada que hacer
      if (!savedSession) {
        console.log("📭 No hay sesión guardada, cargando página sin wallet");
        return;
      }

      // A partir de aquí, tenemos sesión Y wallet provider disponible
      console.log("✅ Wallet provider detectado, procediendo con reconexión...");

      // Configurar listeners para mantener sesión activa
      WalletSessionManager.setupActivityListener();
      WalletSessionManager.setupAutoRefresh();

      // Esperar un poco para que el DOM y los providers estén listos
      await new Promise(resolve => setTimeout(resolve, 100));

      // Configurar listeners persistentes para reconexión (ahora en modo pasivo)
      AutoReconnectManager.setupPersistentListeners(connectWallet);

      // Intentar reconexión automática
      console.log("🚀 Iniciando sistema de reconexión automática...");
      const reconnected = await AutoReconnectManager.attemptAutoReconnect(connectWallet);

      if (reconnected) {
        console.log("✅ Reconexión automática exitosa");
        return;
      }

      // Fallback: sistema de reconexión legacy
      console.log("🔍 Verificando sesión guardada:", savedSession ? `Encontrada para ${savedSession.address}` : "No encontrada");

      if (savedSession) {
        console.log(`✅ Sesión encontrada para ${savedSession.address} (${savedSession.walletType})`);

        // Establecer inmediatamente el estado como conectado para evitar el modal
        setAddress(savedSession.address);
        setChainId(savedSession.chainId);
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);

        // Actualizar la información de red
        const networkInfo = NETWORKS.find((n: Network) => n.chainId === savedSession.chainId);
        if (networkInfo) {
          setNetwork(networkInfo);
        }

        // Guardar la sesión nuevamente para asegurar que se mantenga
        WalletSessionManager.saveSession(savedSession);

        console.log("✅ Estado del wallet restablecido desde sesión guardada");
        console.log("✅ Wallet conectado automáticamente:", savedSession.address);

        // Autenticar inmediatamente en el backend al detectar sesión guardada
        try {
          console.log("🔐 Autenticando sesión automáticamente en el backend...");
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              walletAddress: savedSession.address
            }),
          });

          const loginData = await response.json();
          if (loginData.success) {
            console.log("✅ Sesión backend establecida automáticamente");
          } else {
            console.warn("⚠️ Error estableciendo sesión backend automática");
          }
        } catch (authError) {
          console.error("❌ Error en autenticación automática:", authError);
        }
        
        try {
          if (savedSession.walletType === WalletType.CUSTODIAL) {
            // Reconectar wallet custodiada
            if (savedSession.sessionToken) {
              const validateUrl = `/api/custodial-wallet/${savedSession.address}/validate?sessionToken=${encodeURIComponent(savedSession.sessionToken)}`;
              const validateResponse = await fetch(validateUrl, {
                headers: {
                  'x-custodial-session': savedSession.sessionToken
                }
              });
              
              const validationData = await validateResponse.json();
              
              if (validateResponse.ok && validationData.valid) {
                console.log("🔑 Token de sesión válido, reconectando wallet custodiada");
                await connectWallet(WalletType.CUSTODIAL, {
                  address: savedSession.address,
                  sessionToken: savedSession.sessionToken
                });
                return;
              } else {
                console.warn("⚠️ Token de sesión inválido, limpiando sesión");
                WalletSessionManager.clearSession();
              }
            }
          } else {
            // Reconectar wallet Web3 usando múltiples métodos
            console.log(`🔌 Intentando reconectar ${savedSession.walletType} automáticamente`);
            
            let reconnected = false;
            
            // Método 1: Usar Web3Modal cache
            const web3Modal = getWeb3Modal();
            if (web3Modal.cachedProvider) {
              try {
                console.log("Método 1: Reconectando via Web3Modal cache");
                await connectWallet(WalletType.WEB3MODAL);
                reconnected = true;
              } catch (error) {
                console.warn("Método 1 falló, intentando método 2");
              }
            }
            
            // Método 2: Reconectar directamente según el tipo de wallet
            if (!reconnected) {
              try {
                if (savedSession.walletType === WalletType.METAMASK && window.ethereum) {
                  console.log("Método 2: Reconectando MetaMask directamente");
                  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                  if (accounts.length > 0 && accounts[0].toLowerCase() === savedSession.address.toLowerCase()) {
                    await connectWallet(WalletType.METAMASK);
                    reconnected = true;
                  }
                } else if (savedSession.walletType === WalletType.COINBASE) {
                  console.log("Método 2: Reconectando Coinbase directamente");
                  await connectWallet(WalletType.COINBASE);
                  reconnected = true;
                } else {
                  console.log("Método 2: Reconectando via Web3Modal genérico");
                  await connectWallet(WalletType.WEB3MODAL);
                  reconnected = true;
                }
              } catch (error) {
                console.warn("Método 2 también falló:", error);
              }
            }
            
            // Si se reconectó exitosamente, autenticar en el backend (solo una vez)
            if (reconnected) {
              try {
                const alreadyAuthenticated = sessionStorage.getItem('backendAuthenticated');
                if (!alreadyAuthenticated) {
                  console.log("🔐 Autenticando sesión en el backend después de reconexión...");
                  const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      walletAddress: savedSession.address
                    }),
                  });
                  
                  const loginData = await response.json();
                  if (loginData.success) {
                    console.log("✅ Sesión backend restablecida correctamente");
                    sessionStorage.setItem('backendAuthenticated', 'true');
                    
                    // Guardar sesión de login persistente
                    WalletSessionManager.saveLoginSession({
                      walletAddress: savedSession.address,
                      sessionToken: loginData.sessionToken || 'auto-login',
                      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
                      isAdmin: loginData.isAdmin
                    });
                  } else {
                    console.warn("⚠️ Error restableciendo sesión backend");
                  }
                }
              } catch (authError) {
                console.error("❌ Error autenticando en backend tras reconexión:", authError);
              }
              
              return;
            } else {
              console.warn("No se pudo reconectar automáticamente, limpiando sesión");
              WalletSessionManager.clearSession();
            }
          }
        } catch (error) {
          console.error("❌ Error reconectando sesión guardada:", error);
        }
      }
      
      // Fallback: verificar localStorage tradicional para compatibilidad
      const savedWalletAddress = localStorage.getItem('walletAddress');
      const custodialSessionToken = localStorage.getItem('custodialSessionToken');
      
      if (savedWalletAddress && custodialSessionToken) {
        try {
          console.log("Intentando reconectar wallet custodiada:", savedWalletAddress);
          
          // Verificar si el token es válido antes de intentar reconectar
          try {
            const validateResponse = await fetch(
              `/api/custodial-wallet/${savedWalletAddress}/validate?sessionToken=${encodeURIComponent(custodialSessionToken)}`,
              {
                headers: {
                  'x-custodial-session': custodialSessionToken
                }
              }
            );
            
            const validationData = await validateResponse.json();
            
            if (validateResponse.ok && validationData.valid) {
              console.log("Token de sesión válido, reconectando wallet custodiada");
              // Crear una instancia de wallet custodiada y conectar
              const custodialWalletInstance = {
                isCustodial: true,
                address: savedWalletAddress,
                sessionToken: custodialSessionToken,
                chainId: 1 // Por defecto Ethereum
              };
              
              // Conectar directamente usando connectWallet
              await connectWallet(WalletType.CUSTODIAL, {
                address: savedWalletAddress,
                sessionToken: custodialSessionToken
              });
              return; // No necesitamos intentar reconexión con web3Modal
            } else {
              console.warn("Token de sesión inválido para wallet custodiada, no se puede reconectar automáticamente");
            }
          } catch (validationError) {
            console.error("Error validando token de sesión para reconexión:", validationError);
          }
        } catch (error) {
          console.error("Error reconectando wallet custodiada:", error);
          // No eliminamos los datos por si es un error temporal
        }
      }
      
      // Si no hay wallet custodiada o falló la reconexión, intentamos con Web3Modal
      const web3Modal = getWeb3Modal();
      if (web3Modal.cachedProvider) {
        try {
          console.log("Intentando reconectar automáticamente con proveedor:", web3Modal.cachedProvider);
          await connectWallet(WalletType.WEB3MODAL);
        } catch (error) {
          console.error("Error automatically reconnecting web3 wallet:", error);
          // Limpiar caché si hay un error
          web3Modal.clearCachedProvider();
        }
      }
    };
    
    init();
    
    // Configurar listeners para reconexión automática cuando el wallet esté disponible
    const setupWalletListeners = () => {
      // Listener para MetaMask
      if (window.ethereum) {
        const handleAccountsChanged = async (accounts: string[]) => {
          console.log("🔄 Cuentas cambiadas en MetaMask:", accounts);
          if (accounts.length > 0) {
            const savedSession = WalletSessionManager.getSession();
            if (savedSession && accounts[0].toLowerCase() === savedSession.address.toLowerCase()) {
              console.log("✅ Cuenta coincide con sesión guardada, manteniendo conexión");
              // Actualizar el estado sin desconectar
              if (!address) {
                try {
                  await connectWallet(WalletType.METAMASK);
                } catch (error) {
                  console.warn("Error reconectando MetaMask tras cambio de cuentas:", error);
                }
              }
            }
          }
        };

        const handleChainChanged = (chainId: string) => {
          console.log("🔄 Red cambiada:", chainId);
          // Actualizar chainId sin desconectar
          setChainId(parseInt(chainId, 16));
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        // Cleanup function
        return () => {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          }
        };
      }
    };

    const cleanup = setupWalletListeners();
    
    // Intentar reconexión periódica si hay sesión pero no hay conexión activa
    // NOTA: Reconexión deshabilitada por defecto para evitar loops en Firefox
    // Solo se activa si hay un wallet provider disponible
    let reconnectionAttempts = 0;
    const MAX_RECONNECTION_ATTEMPTS = 3;

    const reconnectionInterval = setInterval(() => {
      const savedSession = WalletSessionManager.getSession();
      // Solo intentar reconectar si:
      // 1. Hay sesión guardada
      // 2. No hay dirección conectada
      // 3. No estamos conectando actualmente
      // 4. No hemos excedido el máximo de intentos
      // 5. Hay un provider disponible (evita loops en Firefox sin wallet)
      const hasWalletProvider = typeof window !== 'undefined' && (
        window.ethereum ||
        savedSession?.walletType === 'custodial'
      );

      if (savedSession && !address && !isConnecting && reconnectionAttempts < MAX_RECONNECTION_ATTEMPTS && hasWalletProvider) {
        reconnectionAttempts++;
        console.log(`🔄 Intentando reconexión automática (${reconnectionAttempts}/${MAX_RECONNECTION_ATTEMPTS})...`);
        connectWallet(savedSession.walletType as WalletType).catch(error => {
          console.warn("Error en reconexión automática:", error);
        });
      } else if (address) {
        // Si ya está conectado, resetear contador y logear solo una vez
        reconnectionAttempts = 0;
        const alreadyLoggedKey = `reconnectionStopped_${address}`;
        if (!sessionStorage.getItem(alreadyLoggedKey)) {
          console.log("✅ Wallet conectado, detener intentos de reconexión");
          sessionStorage.setItem(alreadyLoggedKey, 'true');
        }
      } else if (!hasWalletProvider && savedSession) {
        // Si no hay wallet provider disponible pero hay sesión guardada, limpiar la sesión
        // para evitar intentos fallidos repetidos
        console.log("⚠️ No hay wallet provider disponible, limpiando sesión guardada");
        WalletSessionManager.clearSession();
      }
    }, 30000); // Intentar cada 30 segundos (antes era 15, ahora más conservador)

    return () => {
      cleanup?.();
      clearInterval(reconnectionInterval);
    };
  }, [address, isConnecting]);

  // Actualizar información de red cuando cambia el chainId
  useEffect(() => {
    if (chainId) {
      const networkInfo = Object.values(NETWORKS).find(
        (n) => n.chainId === chainId
      );
      setNetwork(networkInfo || null);
    } else {
      setNetwork(null);
    }
  }, [chainId]);
  
  // Registrar e iniciar sesión del usuario cuando se conecta un wallet
  useEffect(() => {
    const registerAndLoginUser = async () => {
      if (address) {
        try {
          console.log("Registrando usuario con dirección:", address);
          // Normalizar la dirección de la wallet a minúsculas para consistencia
          const normalizedAddress = address.toLowerCase();
          
          try {
            // Intentar obtener usuario primero para ver si ya existe
            const existingUser = await apiRequest("GET", `/api/user/${normalizedAddress}`);
            console.log("Usuario ya registrado:", existingUser);
          } catch (error: any) {
            // Si el error es 404 (no encontrado), creamos el usuario
            if (error.message && error.message.startsWith("404:")) {
              console.log("Usuario no encontrado, creando nuevo usuario...");
              try {
                const newUser = await apiRequest("POST", '/api/user', {
                  walletAddress: normalizedAddress,
                  username: `user_${normalizedAddress.substring(2, 8)}`, // Generar un nombre basado en la dirección
                  isAdmin: false, // Por defecto no es admin
                  theme: "dark", // Usar tema oscuro por defecto
                  defaultNetwork: "ethereum"
                });
                console.log("Usuario registrado automáticamente:", newUser);
              } catch (createError) {
                console.error("Error creating user:", createError);
                // Intentar nuevamente después de un breve retraso (podría ser un problema de sincronización)
                setTimeout(() => {
                  registerAndLoginUser();
                }, 2000);
                return;
              }
            } else {
              // Si es otro tipo de error, lo reportamos
              console.error("Error verifying user:", error);
            }
          }
          
          // Iniciar sesión en el servidor para establecer la sesión
          try {
            // Importar la función de login dinámicamente para evitar dependencias circulares
            const { login } = await import('@/lib/auth-service');
            
            const loginResponse = await login(normalizedAddress);
            if (loginResponse.success) {
              console.log("Sesión iniciada correctamente:", loginResponse.user);
            } else {
              console.error("Error logging in on the server");
            }
          } catch (loginError) {
            console.error("Error during login:", loginError);
          }
          
        } catch (error) {
          console.error("General error registering user:", error);
        }
      }
    };
    
    registerAndLoginUser();
  }, [address]);

  // Configurar manejadores de eventos para el proveedor
  const setupProviderEvents = (instance: any) => {
    if (!instance) return;

    // Si es una billetera custodiada, implementamos nuestra propia lógica de eventos
    if (instance.isCustodial) {
      console.log("Setting up custodial wallet monitoring");
      
      // Almacenar la referencia del intervalo para poder limpiarlo después
      instance.monitoringInterval = setInterval(async () => {
        try {
          // Verificar periódicamente si la sesión sigue siendo válida
          const response = await apiRequest("GET", `/api/custodial-wallet/${instance.address}/validate`, {
            sessionToken: instance.sessionToken
          });
          
          if (!response.valid) {
            console.warn("Custodial wallet session expired, disconnecting");
            disconnectWallet();
          }
        } catch (error) {
          console.error("Error monitoring custodial wallet:", error);
        }
      }, 60000); // Verificar cada minuto
      
      setCurrentInstance(instance);
      return;
    }

    // Limpiar event listeners anteriores si existen
    if (currentInstance && currentInstance.removeAllListeners) {
      currentInstance.removeAllListeners();
    }

    // Guardar el nuevo proveedor
    setCurrentInstance(instance);

    if (instance.on) {
      // Configurar event listeners
      instance.on("accountsChanged", async (accounts: string[]) => {
        console.log("Cuenta cambiada:", accounts);
        
        if (accounts.length === 0) {
          // Usuario desconectó todas las cuentas
          disconnectWallet();
        } else {
          // Forzar actualización completa de la conexión
          await refreshConnection();
        }
      });

      instance.on("chainChanged", (chainId: string) => {
        console.log("Red cambiada:", chainId);
        setChainId(parseInt(chainId, 16));
      });

      instance.on("disconnect", (code: number, reason: string) => {
        console.log(`Desconexión: Código ${code}, Razón: ${reason}`);
        disconnectWallet();
      });
    }
  };
  
  // Función para reconectar y refrescar el estado
  const refreshConnection = async () => {
    if (!currentInstance) return false;
    
    // Special handling for custodial wallets
    if (currentInstance.isCustodial) {
      try {
        console.log("Refreshing custodial wallet connection:", currentInstance.address);
        
        // Validate the custodial wallet is still valid
        const validateUrl = `/api/custodial-wallet/${currentInstance.address}/validate?sessionToken=${encodeURIComponent(currentInstance.sessionToken || '')}`;
        const response = await apiRequest("GET", validateUrl);
        
        if (response.valid) {
          console.log("Custodial wallet session is still valid");
          return true;
        } else {
          console.warn("Custodial wallet session is no longer valid, disconnecting");
          disconnectWallet();
          return false;
        }
      } catch (error) {
        console.error("Error refreshing custodial wallet connection:", error);
        disconnectWallet();
        return false;
      }
    }
    
    // Regular Web3 wallet refresh
    try {
      // Forzar solicitud de cuentas para detectar cambios de wallet
      let accounts: string[] = [];
      
      try {
        accounts = await currentInstance.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("Error al solicitar cuentas:", error);
        if (currentInstance.enable) {
          // Alternativa para proveedores más antiguos
          const enabledAccounts = await currentInstance.enable();
          if (Array.isArray(enabledAccounts) && enabledAccounts.length > 0) {
            accounts = enabledAccounts;
          }
        }
      }
      
      if (accounts && accounts.length > 0) {
        const newAddress = accounts[0];
        
        // Crear un nuevo proveedor para asegurarnos de que usamos el estado actualizado
        const newProvider = new BrowserProvider(currentInstance);
        const newSigner = await newProvider.getSigner();
        
        let chainId: number;
        try {
          const network = await newProvider.getNetwork();
          chainId = Number(network.chainId);
        } catch (error) {
          // Fallback to get chainId if getNetwork fails
          console.warn("Error obtaining network, trying to get chainId directly:", error);
          try {
            const chainIdHex = await currentInstance.request({ method: "eth_chainId" });
            chainId = parseInt(chainIdHex, 16);
          } catch (chainIdError) {
            console.error("Error obtaining chainId:", chainIdError);
            // Default to Ethereum mainnet if we can't get the current chain ID
            let defaultChainId = 1;
            chainId = defaultChainId;
          }
        }
        
        // Actualizar todo el estado
        setProvider(newProvider);
        setSigner(newSigner);
        setAddress(newAddress);
        setChainId(chainId);
        
        console.log("Conexión actualizada a la nueva cuenta:", newAddress);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al refrescar la conexión:", error);
      return false;
    }
  };

  // Función para desconectar la wallet
  const disconnectWallet = async () => {
    try {
      // Limpiar datos de administrador y autenticación del sessionStorage
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('adminWalletAddress');
      sessionStorage.removeItem('backendAuthenticated');
      console.log("🔄 Limpiando datos de sesión por desconexión");
      
      // Special handling for custodial wallets
      if (currentInstance?.isCustodial) {
        console.log("Disconnecting custodial wallet:", currentInstance.address);
        
        // Clear monitoring interval if it exists
        if (currentInstance.monitoringInterval) {
          clearInterval(currentInstance.monitoringInterval);
          console.log("Cleared custodial wallet monitoring interval");
        }
        
        try {
          // Call API to close custodial wallet session if needed
          const logoutUrl = `/api/custodial-wallet/logout?sessionToken=${encodeURIComponent(currentInstance.sessionToken || '')}`;
          await apiRequest("POST", logoutUrl, {
            address: currentInstance.address
          });
          
          // Limpiar todos los datos de la wallet en localStorage
          // Esto solo ocurre cuando el usuario desconecta explícitamente su wallet
          localStorage.removeItem('custodialSessionToken');
          localStorage.removeItem('walletAddress');
          localStorage.removeItem('sessionToken'); // Mantener compatibilidad con código existente
          
          // 🗑️ Limpiar sesión persistente y login
          WalletSessionManager.clearSession();
          WalletSessionManager.clearLoginSession();
          console.log("💾 Sesión persistente y login limpiadas para wallet custodiada");
          
          if (window.walletInstance) {
            window.walletInstance = undefined;
          }
          
          console.log("Custodial wallet session closed and all persistent data cleared");
        } catch (custodialError) {
          console.error("Error logging out custodial wallet:", custodialError);
          
          // Incluso si hay error, intentamos limpiar el almacenamiento local
          localStorage.removeItem('custodialSessionToken');
          localStorage.removeItem('walletAddress');
          localStorage.removeItem('sessionToken'); // Mantener compatibilidad
          
          if (window.walletInstance) {
            window.walletInstance = undefined;
          }
        }
      } 
      // Regular Web3 wallet disconnect
      else {
        // Obtener Web3Modal para limpiar la caché
        const web3Modal = getWeb3Modal();
        web3Modal.clearCachedProvider();
        
        // 🗑️ Limpiar sesión persistente y login para wallets Web3
        WalletSessionManager.clearSession();
        WalletSessionManager.clearLoginSession();
        console.log("💾 Sesión persistente y login limpiadas para wallet Web3");
        
        // Intentar desconectar el proveedor actual si tiene método de desconexión
        if (currentInstance?.disconnect) {
          currentInstance.disconnect();
        } else if (currentInstance?.close) {
          // Algunos proveedores como WalletConnect usan close en lugar de disconnect
          currentInstance.close();
        }
        
        // Limpiar listeners y estado
        if (currentInstance?.removeAllListeners) {
          currentInstance.removeAllListeners();
        }
      }
      
      // Cerrar sesión en el servidor
      try {
        // Importar la función de logout dinámicamente para evitar dependencias circulares
        const { logout } = await import('@/lib/auth-service');
        
        const logoutResponse = await logout();
        if (logoutResponse.success) {
          console.log("Session closed on server successfully");
        } else {
          console.error("Error logging out from server");
        }
      } catch (logoutError) {
        console.error("Error logging out from server:", logoutError);
      }
      
      // Limpiar el estado del provider
      setCurrentInstance(null);
      setProvider(null);
      setSigner(null);
      setAddress(null);
      setChainId(null);
      setNetwork(null);
      
      console.log("Wallet disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      
      // Even if there's an error, clear state to force disconnection
      setCurrentInstance(null);
      setProvider(null);
      setSigner(null);
      setAddress(null);
      setChainId(null);
      setNetwork(null);
      
      // Asegurarnos de limpiar también el estado de admin en caso de error
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('adminWalletAddress');
    }
  };

  // Main function to connect wallet
  const connectWallet = async (walletType: WalletType, options?: ConnectWalletOptions): Promise<boolean> => {
    if (isConnecting) return false;
    
    try {
      setIsConnecting(true);
      setError(null);
      console.log(`Starting wallet connection of type: ${walletType}`, options ? "with options" : "");

      let instance;
      
      // If it's Web3Modal, use the unified interface
      if (walletType === WalletType.WEB3MODAL) {
        const web3Modal = getWeb3Modal();
        instance = await web3Modal.connect();
        console.log("Web3Modal connected:", instance);
      } 
      // Use specific methods for each wallet type (fallback)
      else if (walletType === WalletType.METAMASK) {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed");
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
        instance = window.ethereum;
      } 
      else if (walletType === WalletType.COINBASE) {
        const coinbaseWallet = new CoinbaseWalletSDK({
          appName: APP_NAME,
          appLogoUrl: "/logo.svg"
        });
        instance = coinbaseWallet.makeWeb3Provider();
        await instance.request({ method: "eth_requestAccounts" });
      }
      else if (walletType === WalletType.WALLETCONNECT) {
        const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY || import.meta.env.INFURA_API_KEY || "ede1fccc624543fea1c96277472edd49";
        instance = new WalletConnectProvider({
          infuraId: infuraApiKey,
          qrcodeModalOptions: {
            mobileLinks: ["coinbase", "metamask", "trust"],
            desktopLinks: ["metamask", "ledger"]
          }
        });
        await instance.enable();
      }
      // Special handling for custodial wallets
      else if (walletType === WalletType.CUSTODIAL) {
        if (!options || !options.address) {
          throw new Error("Address is required for custodial wallet connection");
        }
        
        console.log("Connecting to custodial wallet with address:", options.address);
        
        // No need for an actual Web3 instance as this is our internal custodial wallet
        // We'll verify the wallet with our API instead
        try {
          // Validate custodial wallet
          // For GET requests, add sessionToken as a query parameter
          const validateUrl = `/api/custodial-wallet/${options.address}/validate?sessionToken=${encodeURIComponent(options.sessionToken || '')}`;
          const response = await apiRequest("GET", validateUrl);
          
          console.log("Custodial wallet validated:", response);
          
          // Create a simple "instance" with the address
          instance = {
            isCustodial: true,
            address: options.address,
            sessionToken: options.sessionToken
          };
          
          // Guardar sessionToken y dirección en localStorage para usarlo en posteriores peticiones
          if (options.sessionToken) {
            localStorage.setItem('custodialSessionToken', options.sessionToken);
            localStorage.setItem('walletAddress', options.address.toLowerCase());
            console.log("Token de sesión y dirección guardados en localStorage para reconexión automática");
            
            // También guardamos la instancia en window para acceso global
            window.walletInstance = instance;
            console.log("Instancia de wallet custodiada guardada en window.walletInstance");
          }
        } catch (error) {
          console.error("Error validating custodial wallet:", error);
          throw new Error("La billetera custodiada no pudo ser validada");
        }
      }
      
      // If there's no instance, it's because a valid wallet type was not selected
      if (!instance) {
        throw new Error("Wallet type not supported or could not be initialized");
      }
      
      console.log("Provider initialized:", instance ? "OK" : "Error");
      
      let provider;
      let signer = null;
      let address;
      let chainId = 1; // Default to Ethereum mainnet
      
      // Special handling for custodial wallet which doesn't have a real provider
      if (walletType === WalletType.CUSTODIAL && instance.isCustodial) {
        console.log("Using custodial wallet data");
        address = instance.address;
        provider = null;
        
        // We'll set the chainId based on configuration or default to Ethereum mainnet (1)
        chainId = 1; // Ethereum mainnet
      } 
      // Regular Web3 provider handling
      else {
        // Create ethers provider based on the connected provider
        provider = new BrowserProvider(instance);
        
        try {
          signer = await provider.getSigner();
          address = await signer.getAddress();
        } catch (error) {
          console.error("Error obtaining signer/address:", error);
          
          // Fallback to get the address if getSigner fails
          if (instance.selectedAddress) {
            address = instance.selectedAddress;
          } else if (instance.accounts && instance.accounts.length > 0) {
            address = instance.accounts[0];
          } else {
            try {
              const accounts = await instance.request({ method: "eth_accounts" });
              if (accounts && accounts.length > 0) {
                address = accounts[0];
              } else {
                throw new Error("Could not obtain wallet address");
              }
            } catch (requestError) {
              console.error("Error requesting accounts:", requestError);
              throw new Error("Could not obtain wallet address");
            }
          }
        }
        
        // Get chainId
        try {
          const network = await provider.getNetwork();
          chainId = Number(network.chainId);
        } catch (error) {
          console.warn("Error obtaining network, trying to get chainId directly:", error);
          try {
            const chainIdHex = await instance.request({ method: "eth_chainId" });
            chainId = parseInt(chainIdHex, 16);
          } catch (chainIdError) {
            console.error("Error obtaining chainId:", chainIdError);
            // Default to Ethereum mainnet
            chainId = 1;
          }
        }
      }

      // Update state with the obtained data
      setCurrentInstance(instance);
      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setChainId(chainId);
      
      // 🔐 Guardar sesión persistente para reconexión automática
      const sessionData: WalletSessionData = {
        address,
        walletType,
        chainId,
        connectionTime: Date.now()
      };
      
      // Agregar datos específicos para wallets custodiadas
      if (walletType === WalletType.CUSTODIAL && options?.sessionToken) {
        sessionData.sessionToken = options.sessionToken;
      }
      
      // Guardar datos del proveedor para reconexión
      if (instance && !instance.isCustodial) {
        sessionData.providerData = {
          isMetaMask: instance.isMetaMask,
          isWalletConnect: instance.isWalletConnect,
          isCoinbaseWallet: instance.isCoinbaseWallet
        };
      }
      
      console.log("💾 Guardando sesión persistente:", sessionData);
      WalletSessionManager.saveSession(sessionData);
      console.log("✅ Sesión persistente guardada para reconexión automática");
      
      // Configure event listeners for the provider
      setupProviderEvents(instance);
      
      // Close connection modal
      setIsModalOpen(false);
      
      console.log("Wallet connected successfully:", {
        address,
        chainId,
        provider: provider ? "OK" : "Not available",
        persistentSession: "✅ Saved"
      });
      
      return true;
    } catch (error: any) {
      console.error("Connection error:", error);
      
      // More descriptive error messages based on error type
      if (error.code === 4001) {
        setError("Connection rejected. Please authorize the connection in your wallet.");
      } else if (error.code === -32002) {
        setError("There is already a pending request. Check your wallet.");
      } else if (error.message && error.message.includes("MetaMask")) {
        setError("MetaMask not detected. Is the extension installed?");
      } else if (error.message && error.message.includes("WalletConnect")) {
        setError("Error starting WalletConnect. Please try again.");
      } else {
        setError(`Error connecting wallet: ${error.message || "Try again"}`);
      }
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to switch network
  const switchNetwork = async (targetChainId: number) => {
    if (!currentInstance) {
      console.error("No wallet connected");
      return;
    }
    
    // Handle custodial wallet case
    if (currentInstance.isCustodial) {
      console.log("Custodial wallet network switch requested to chainId:", targetChainId);
      
      try {
        // Call API to update custodial wallet settings if needed
        const switchNetworkUrl = `/api/custodial-wallet/${currentInstance.address}/switch-network?sessionToken=${encodeURIComponent(currentInstance.sessionToken || '')}`;
        await apiRequest("POST", switchNetworkUrl, {
          chainId: targetChainId
        });
        
        // Update chainId directly
        setChainId(targetChainId);
        
        // Update network info based on chainId
        const networkInfo = Object.values(NETWORKS).find(
          (n) => n.chainId === targetChainId
        );
        setNetwork(networkInfo || null);
        
        return;
      } catch (error) {
        console.error("Error switching network for custodial wallet:", error);
        throw new Error("No se pudo cambiar la red para la billetera custodiada");
      }
    }

    try {
      // Convert to hexadecimal string
      const chainIdHex = `0x${targetChainId.toString(16)}`;

      // Try to switch network (for regular web3 wallets)
      await currentInstance.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error: any) {
      console.error("Error switching network:", error);

      // If the error is that the network is not configured in the wallet
      if (error.code === 4902) {
        // Find network information
        const network = Object.values(NETWORKS).find(
          (n) => n.chainId === targetChainId
        );

        if (!network) {
          throw new Error("Network not supported");
        }

        // Add the network to the wallet
        try {
          await currentInstance.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: {
                  name: network.nativeCurrency.name,
                  symbol: network.nativeCurrency.symbol,
                  decimals: network.nativeCurrency.decimals,
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorerUrl],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          throw new Error(`Error adding network: ${addError}`);
        }
      } else {
        throw error;
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        account: address, // Alias for compatibility with existing code
        isConnected: !!address,
        chainId,
        network,
        provider,
        signer,
        connectWallet,
        disconnectWallet,
        refreshConnection,
        isConnecting,
        error,
        isModalOpen,
        setIsModalOpen,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}