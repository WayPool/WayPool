/**
 * Sistema de reconexión automática agresiva para wallets Web3
 * Garantiza que la sesión persista después de recargar la página
 */

import { WalletSessionManager } from './wallet-session-manager';
import { WalletType } from './new-wallet-provider';

export class AutoReconnectManager {
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 3;
  private static reconnectDelay = 2000; // 2 segundos
  private static isReconnecting = false;

  /**
   * Intenta reconectar el wallet automáticamente al cargar la página
   */
  static async attemptAutoReconnect(connectWallet: (type: WalletType, options?: any) => Promise<boolean>): Promise<boolean> {
    if (this.isReconnecting) {
      return false;
    }

    const savedSession = WalletSessionManager.getSession();
    
    if (!savedSession) {
      console.log("No hay sesión guardada para reconectar");
      return false;
    }

    this.isReconnecting = true;
    console.log(`🔄 Iniciando reconexión automática para ${savedSession.address} (${savedSession.walletType})`);

    // Intentar reconectar múltiples veces con diferentes métodos
    for (let attempt = 1; attempt <= this.maxReconnectAttempts; attempt++) {
      console.log(`Intento de reconexión ${attempt}/${this.maxReconnectAttempts}`);

      try {
        // Método específico por tipo de wallet
        switch (savedSession.walletType) {
          case WalletType.METAMASK:
            if (await this.reconnectMetaMask(connectWallet, savedSession)) {
              console.log("✅ Reconectado exitosamente via MetaMask");
              this.isReconnecting = false;
              return true;
            }
            break;

          case WalletType.COINBASE:
            if (await this.reconnectCoinbase(connectWallet)) {
              console.log("✅ Reconectado exitosamente via Coinbase");
              this.isReconnecting = false;
              return true;
            }
            break;

          case WalletType.CUSTODIAL:
            if (await this.reconnectCustodial(connectWallet, savedSession)) {
              console.log("✅ Reconectado exitosamente via Custodial");
              this.isReconnecting = false;
              return true;
            }
            break;

          default:
            // Método genérico usando Web3Modal
            if (await this.reconnectGeneric(connectWallet)) {
              console.log("✅ Reconectado exitosamente via Web3Modal");
              this.isReconnecting = false;
              return true;
            }
            break;
        }

        // Esperar antes del siguiente intento
        if (attempt < this.maxReconnectAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.reconnectDelay * attempt));
        }

      } catch (error) {
        console.warn(`Intento ${attempt} falló:`, error);
      }
    }

    console.error("❌ Falló la reconexión automática después de todos los intentos");
    this.isReconnecting = false;
    return false;
  }

  /**
   * Reconectar MetaMask específicamente
   */
  private static async reconnectMetaMask(connectWallet: (type: WalletType, options?: any) => Promise<boolean>, savedSession: any): Promise<boolean> {
    if (!window.ethereum) {
      console.log("MetaMask no está disponible");
      return false;
    }

    try {
      // Verificar si la cuenta actual coincide con la sesión guardada
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0 && accounts[0].toLowerCase() === savedSession.address.toLowerCase()) {
        console.log("Cuenta de MetaMask coincide, reconectando...");
        return await connectWallet(WalletType.METAMASK);
      } else {
        console.log("La cuenta de MetaMask no coincide con la sesión guardada");
        return false;
      }
    } catch (error) {
      console.error("Error reconectando MetaMask:", error);
      return false;
    }
  }

  /**
   * Reconectar Coinbase Wallet
   */
  private static async reconnectCoinbase(connectWallet: (type: WalletType, options?: any) => Promise<boolean>): Promise<boolean> {
    try {
      return await connectWallet(WalletType.COINBASE);
    } catch (error) {
      console.error("Error reconectando Coinbase:", error);
      return false;
    }
  }

  /**
   * Reconectar wallet custodial
   */
  private static async reconnectCustodial(connectWallet: (type: WalletType, options?: any) => Promise<boolean>, savedSession: any): Promise<boolean> {
    if (!savedSession.sessionToken) {
      console.log("No hay token de sesión para wallet custodial");
      return false;
    }

    try {
      // Validar token antes de reconectar
      const validateResponse = await fetch(
        `/api/custodial-wallet/${savedSession.address}/validate?sessionToken=${encodeURIComponent(savedSession.sessionToken)}`,
        {
          headers: {
            'x-custodial-session': savedSession.sessionToken
          }
        }
      );

      const validationData = await validateResponse.json();

      if (validateResponse.ok && validationData.valid) {
        return await connectWallet(WalletType.CUSTODIAL, {
          address: savedSession.address,
          sessionToken: savedSession.sessionToken
        });
      } else {
        console.log("Token de sesión custodial inválido");
        return false;
      }
    } catch (error) {
      console.error("Error reconectando wallet custodial:", error);
      return false;
    }
  }

  /**
   * Reconectar usando Web3Modal genérico
   */
  private static async reconnectGeneric(connectWallet: (type: WalletType, options?: any) => Promise<boolean>): Promise<boolean> {
    try {
      return await connectWallet(WalletType.WEB3MODAL);
    } catch (error) {
      console.error("Error reconectando via Web3Modal:", error);
      return false;
    }
  }

  /**
   * Configurar listeners para mantener la conexión activa
   * NOTA: Los listeners están deshabilitados temporalmente para evitar loops de reconexión en Firefox
   */
  static setupPersistentListeners(connectWallet: (type: WalletType, options?: any) => Promise<boolean>) {
    // DESHABILITADO: Estos listeners causaban loops infinitos en Firefox cuando no hay wallet
    // La reconexión se maneja de forma más controlada en el useEffect del WalletProvider
    console.log("✅ Listeners de persistencia configurados (modo pasivo para evitar loops)");

    // Solo registrar un listener muy ligero para logging
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log("Página visible - la reconexión se manejará automáticamente si es necesario");
      }
    });
  }
}