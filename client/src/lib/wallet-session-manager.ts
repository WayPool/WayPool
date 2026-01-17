/**
 * Sistema de gestión de sesiones Web3 persistentes
 * Mantiene la conexión del wallet incluso después de cerrar/reabrir la página
 */

// Claves para localStorage
const STORAGE_KEYS = {
  WALLET_ADDRESS: 'waybank_wallet_address',
  WALLET_TYPE: 'waybank_wallet_type', 
  WALLET_CHAIN_ID: 'waybank_wallet_chain_id',
  WALLET_SESSION_TOKEN: 'waybank_wallet_session_token',
  WALLET_CONNECTION_TIME: 'waybank_wallet_connection_time',
  WALLET_PROVIDER_DATA: 'waybank_wallet_provider_data',
  LOGIN_SESSION_TOKEN: 'waybank_login_session', // Nueva clave para login persistente
  LOGIN_EXPIRES_AT: 'waybank_login_expires'
};

// Tiempo de expiración de sesión (24 horas por defecto)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export interface WalletSessionData {
  address: string;
  walletType: string;
  chainId: number;
  connectionTime: number;
  sessionToken?: string;
  providerData?: any;
}

export interface LoginSession {
  walletAddress: string;
  sessionToken: string;
  expiresAt: number;
  isAdmin?: boolean;
}

export class WalletSessionManager {
  /**
   * Guarda los datos de sesión del wallet en localStorage
   */
  static saveSession(sessionData: WalletSessionData): void {
    try {
      const currentTime = Date.now();
      
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, sessionData.address);
      localStorage.setItem(STORAGE_KEYS.WALLET_TYPE, sessionData.walletType);
      localStorage.setItem(STORAGE_KEYS.WALLET_CHAIN_ID, sessionData.chainId.toString());
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTION_TIME, currentTime.toString());
      
      // Guardar también en las claves legacy para compatibilidad
      localStorage.setItem('walletAddress', sessionData.address);
      localStorage.setItem('walletType', sessionData.walletType);
      localStorage.setItem('lastWalletType', sessionData.walletType);
      
      if (sessionData.sessionToken) {
        localStorage.setItem(STORAGE_KEYS.WALLET_SESSION_TOKEN, sessionData.sessionToken);
        localStorage.setItem('custodialSessionToken', sessionData.sessionToken);
      }
      
      if (sessionData.providerData) {
        localStorage.setItem(STORAGE_KEYS.WALLET_PROVIDER_DATA, JSON.stringify(sessionData.providerData));
      }
      
      console.log(`✅ Sesión guardada para wallet ${sessionData.address} (${sessionData.walletType})`);
      console.log('✅ Sesión de wallet renovada');
    } catch (error) {
      console.error('❌ Error guardando sesión de wallet:', error);
    }
  }

  /**
   * Recupera los datos de sesión del wallet desde localStorage
   */
  static getSession(): WalletSessionData | null {
    try {
      const address = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
      const walletType = localStorage.getItem(STORAGE_KEYS.WALLET_TYPE);
      const chainIdStr = localStorage.getItem(STORAGE_KEYS.WALLET_CHAIN_ID);
      const connectionTimeStr = localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTION_TIME);
      
      if (!address || !walletType || !chainIdStr || !connectionTimeStr) {
        return null;
      }
      
      const connectionTime = parseInt(connectionTimeStr);
      const currentTime = Date.now();
      
      // Verificar si la sesión ha expirado
      if (currentTime - connectionTime > SESSION_TIMEOUT) {
        console.warn('⚠️ Sesión de wallet expirada, limpiando datos');
        this.clearSession();
        return null;
      }
      
      const sessionData: WalletSessionData = {
        address,
        walletType,
        chainId: parseInt(chainIdStr),
        connectionTime,
      };
      
      // Recuperar datos opcionales
      const sessionToken = localStorage.getItem(STORAGE_KEYS.WALLET_SESSION_TOKEN);
      if (sessionToken) {
        sessionData.sessionToken = sessionToken;
      }
      
      const providerDataStr = localStorage.getItem(STORAGE_KEYS.WALLET_PROVIDER_DATA);
      if (providerDataStr) {
        try {
          sessionData.providerData = JSON.parse(providerDataStr);
        } catch (error) {
          console.warn('⚠️ Error parseando datos del proveedor:', error);
        }
      }
      
      // Evitar logs repetitivos - solo log una vez por sesión de navegador
      const sessionLogKey = `sessionLogged_${address}`;
      if (!sessionStorage.getItem(sessionLogKey)) {
        console.log(`✅ Sesión recuperada para wallet ${address} (${walletType})`);
        sessionStorage.setItem(sessionLogKey, 'true');
      }
      return sessionData;
    } catch (error) {
      console.error('❌ Error recuperando sesión de wallet:', error);
      return null;
    }
  }

  /**
   * Limpia todos los datos de sesión del localStorage
   */
  static clearSession(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('✅ Sesión de wallet limpiada');
    } catch (error) {
      console.error('❌ Error limpiando sesión de wallet:', error);
    }
  }

  /**
   * Guarda la sesión de login en localStorage (como una cookie persistente)
   */
  static saveLoginSession(loginData: LoginSession): void {
    try {
      const expiresAt = Date.now() + SESSION_TIMEOUT; // 24 horas
      const sessionData = {
        walletAddress: loginData.walletAddress,
        sessionToken: loginData.sessionToken,
        expiresAt: expiresAt,
        isAdmin: loginData.isAdmin || false
      };
      
      localStorage.setItem(STORAGE_KEYS.LOGIN_SESSION_TOKEN, JSON.stringify(sessionData));
      localStorage.setItem(STORAGE_KEYS.LOGIN_EXPIRES_AT, expiresAt.toString());
      
      console.log(`✅ Sesión de login guardada para ${loginData.walletAddress}`);
    } catch (error) {
      console.error("❌ Error guardando sesión de login:", error);
    }
  }

  /**
   * Obtiene la sesión de login guardada si no ha expirado
   */
  static getLoginSession(): LoginSession | null {
    try {
      const sessionJson = localStorage.getItem(STORAGE_KEYS.LOGIN_SESSION_TOKEN);
      const expiresAt = localStorage.getItem(STORAGE_KEYS.LOGIN_EXPIRES_AT);
      
      if (!sessionJson || !expiresAt) {
        return null;
      }

      const now = Date.now();
      const expiration = parseInt(expiresAt);
      
      if (now > expiration) {
        // Sesión expirada, limpiar
        this.clearLoginSession();
        return null;
      }

      const sessionData = JSON.parse(sessionJson) as LoginSession;
      return sessionData;
    } catch (error) {
      console.error("❌ Error recuperando sesión de login:", error);
      return null;
    }
  }

  /**
   * Verifica si hay una sesión de login válida
   */
  static hasValidLoginSession(): boolean {
    return this.getLoginSession() !== null;
  }

  /**
   * Limpia solo la sesión de login
   */
  static clearLoginSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.LOGIN_SESSION_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.LOGIN_EXPIRES_AT);
      console.log("✅ Sesión de login limpiada");
    } catch (error) {
      console.error("❌ Error limpiando sesión de login:", error);
    }
  }

  /**
   * Autentica automáticamente usando la sesión guardada
   */
  static async autoLogin(): Promise<boolean> {
    try {
      const loginSession = this.getLoginSession();
      if (!loginSession) {
        return false;
      }

      // Hacer login automático con los datos guardados
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: loginSession.walletAddress
        })
      });

      if (response.ok) {
        console.log(`✅ Auto-login exitoso para ${loginSession.walletAddress}`);
        return true;
      } else {
        // Sesión inválida, limpiar
        this.clearLoginSession();
        return false;
      }
    } catch (error) {
      console.error("❌ Error en auto-login:", error);
      return false;
    }
  }

  /**
   * Verifica si existe una sesión válida
   */
  static hasValidSession(): boolean {
    const session = this.getSession();
    return session !== null;
  }

  /**
   * Actualiza el tiempo de conexión para extender la sesión
   */
  static refreshSession(): void {
    try {
      const session = this.getSession();
      if (session) {
        session.connectionTime = Date.now();
        this.saveSession(session);
        console.log('✅ Sesión de wallet renovada');
      }
    } catch (error) {
      console.error('❌ Error renovando sesión de wallet:', error);
    }
  }

  /**
   * Obtiene el tipo de wallet de la sesión actual
   */
  static getCurrentWalletType(): string | null {
    const session = this.getSession();
    return session ? session.walletType : null;
  }

  /**
   * Obtiene la dirección del wallet de la sesión actual
   */
  static getCurrentAddress(): string | null {
    const session = this.getSession();
    return session ? session.address : null;
  }

  /**
   * Configura un listener para refrescar la sesión en actividad del usuario
   */
  static setupActivityListener(): void {
    const refreshOnActivity = () => {
      if (this.hasValidSession()) {
        this.refreshSession();
      }
    };

    // Eventos que indican actividad del usuario
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Throttle para no refrescar demasiado frecuentemente
    let lastRefresh = 0;
    const throttledRefresh = () => {
      const now = Date.now();
      if (now - lastRefresh > 60000) { // Máximo una vez por minuto
        lastRefresh = now;
        refreshOnActivity();
      }
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, throttledRefresh, { passive: true });
    });

    console.log('✅ Listener de actividad configurado para mantener sesión');
  }

  /**
   * Configura refresco automático de sesión cada cierto tiempo
   */
  static setupAutoRefresh(): void {
    // Refrescar sesión cada 30 minutos si existe
    setInterval(() => {
      if (this.hasValidSession()) {
        this.refreshSession();
      }
    }, 30 * 60 * 1000); // 30 minutos

    console.log('✅ Auto-refresco de sesión configurado');
  }
}

/**
 * Hook personalizado para usar el manager de sesiones
 */
export function useWalletSession() {
  return {
    saveSession: WalletSessionManager.saveSession,
    getSession: WalletSessionManager.getSession,
    clearSession: WalletSessionManager.clearSession,
    hasValidSession: WalletSessionManager.hasValidSession,
    refreshSession: WalletSessionManager.refreshSession,
    getCurrentWalletType: WalletSessionManager.getCurrentWalletType,
    getCurrentAddress: WalletSessionManager.getCurrentAddress,
  };
}