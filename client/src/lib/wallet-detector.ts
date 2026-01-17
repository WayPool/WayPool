/**
 * Utilidad para detectar y clasificar el tipo de wallet conectada
 * 
 * Esta función examina las propiedades del objeto window.ethereum y otras
 * fuentes (localStorage, sessionStorage) para determinar qué tipo de
 * wallet está siendo utilizada por el usuario.
 */
import { APP_NAME } from "@/utils/app-config";

/**
 * Detecta el tipo de wallet conectada al navegador
 * @returns {string} El tipo de wallet detectado
 */
export function detectWalletType(): string {
  try {
    if (typeof window === 'undefined') {
      console.log('[WalletDetection] Se está ejecutando en un entorno sin window');
      return 'Unknown';
    }
    
    const ethereum = (window as any).ethereum;
    
    // Si no hay ethereum, probablemente no haya wallet
    if (!ethereum) {
      console.log('[WalletDetection] No se detectó objeto ethereum');
      return 'Sin Wallet';
    }
    
    // Detectamos si existe una billetera custodiada
    const custodialSessionToken = localStorage.getItem('custodialSessionToken');
    if (custodialSessionToken) {
      console.log(`[WalletDetection] Detectada sesión de ${APP_NAME} Wallet`);
      return `${APP_NAME} Wallet`;
    }
    
    // Verificamos si existe una wallet address guardada en localStorage (para casos de settings)
    const savedWalletAddress = localStorage.getItem('walletAddress');
    if (savedWalletAddress) {
      console.log(`[WalletDetection] Detectada dirección guardada de ${APP_NAME} Wallet (walletAddress)`);
      return `${APP_NAME} Wallet`;
    }
    
    // Coinbase Wallet
    if (ethereum.isCoinbaseWallet || ethereum.selectedProvider?.isCoinbaseWallet) {
      console.log('[WalletDetection] Detectado: Coinbase Wallet');
      return 'Coinbase Wallet';
    }
    
    // WalletConnect
    if (ethereum.isWalletConnect || ethereum.selectedProvider?.isWalletConnect) {
      console.log('[WalletDetection] Detectado: WalletConnect');
      return 'WalletConnect';
    }
    
    // Detectar billeteras basadas en el proveedor seleccionado
    if (ethereum.selectedProvider) {
      if (ethereum.selectedProvider.isMetaMask) {
        console.log('[WalletDetection] Detectado (selectedProvider): MetaMask');
        return 'MetaMask';
      }
      if (ethereum.selectedProvider.isCoinbaseWallet) {
        console.log('[WalletDetection] Detectado (selectedProvider): Coinbase Wallet');
        return 'Coinbase Wallet';
      }
      if (ethereum.selectedProvider.isWalletConnect) {
        console.log('[WalletDetection] Detectado (selectedProvider): WalletConnect');
        return 'WalletConnect';
      }
    }
    
    // MetaMask y wallets compatibles
    if (ethereum.isMetaMask) {
      // Algunos wallets se identifican como MetaMask pero tienen propiedades específicas
      if (ethereum.isBraveWallet) {
        console.log('[WalletDetection] Detectado: Brave Wallet');
        return 'Brave Wallet';
      }
      if (ethereum.isTokenary) {
        console.log('[WalletDetection] Detectado: Tokenary');
        return 'Tokenary';
      }
      if (ethereum.isTokenPocket) {
        console.log('[WalletDetection] Detectado: TokenPocket');
        return 'TokenPocket';
      }
      
      // Verificar si hay algo en el URL, session o cookies que indique que es WayBank
      const custodial = localStorage.getItem('isCustodialWallet') === 'true';
      if (custodial) {
        console.log(`[WalletDetection] Detectado: ${APP_NAME} Wallet (localStorage)`);
        return `${APP_NAME} Wallet`;
      }
      
      // Si no hay indicadores específicos, asumimos que es MetaMask
      console.log('[WalletDetection] Detectado: MetaMask');
      return 'MetaMask';
    }
    
    // Trust Wallet
    if (ethereum.isTrust || ethereum.isTrustWallet) {
      console.log('[WalletDetection] Detectado: Trust Wallet');
      return 'Trust Wallet';
    }
    
    // Examinar localStorage para casos especiales
    const walletType = localStorage.getItem('walletType');
    const walletName = localStorage.getItem('walletName');
    
    if (walletType || walletName) {
      console.log('[WalletDetection] Examinando localStorage:', { walletType, walletName });
      
      switch(walletType?.toLowerCase() || walletName?.toLowerCase()) {
        case 'metamask':
          console.log('[WalletDetection] Usando localStorage: MetaMask');
          return 'MetaMask';
        case 'injected':
          console.log('[WalletDetection] Usando localStorage: Injected Provider');
          return 'Injected Provider';
        case 'coinbasewallet':
          console.log('[WalletDetection] Usando localStorage: Coinbase Wallet');
          return 'Coinbase Wallet';
        case 'walletconnect':
          console.log('[WalletDetection] Usando localStorage: WalletConnect');
          return 'WalletConnect';
        case 'waybank':
        case 'waybank':
          console.log(`[WalletDetection] Usando localStorage: ${APP_NAME} Wallet`);
          return `${APP_NAME} Wallet`;
      }
    }
    
    // Comprobación final para wallet administradas
    const userAddressInLocalStorage = localStorage.getItem('userAddress');
    const connectedAddressInLocalStorage = localStorage.getItem('connectedAddress');
    
    if (userAddressInLocalStorage && connectedAddressInLocalStorage &&
        userAddressInLocalStorage.toLowerCase() !== connectedAddressInLocalStorage.toLowerCase()) {
      console.log(`[WalletDetection] Detectado: ${APP_NAME} Wallet (diferencia entre userAddress y connectedAddress)`);
      return `${APP_NAME} Wallet`;
    }
    
    // Verificar dirección de testing especial
    const currentAddress = localStorage.getItem('walletAddress') || 
                         sessionStorage.getItem('walletAddress');
    if (currentAddress && currentAddress.toLowerCase() === '0xc2dd65af9fed4a01fb8764d65c591077f02c6497') {
      console.log(`[WalletDetection] Dirección de testing detectada, forzando ${APP_NAME} Wallet`);
      return `${APP_NAME} Wallet`;
    }
    
    // Si no pudimos determinar el tipo específico
    console.log('[WalletDetection] No se pudo determinar el tipo específico de wallet');
    return 'Wallet Blockchain';
  } catch (error) {
    console.error('[WalletDetection] Error al detectar tipo de wallet:', error);
    return 'Wallet Blockchain';
  }
}