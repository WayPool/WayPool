import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import Landing from "@/pages/landing";
import ResponsiveLanding from "@/pages/responsive-landing";
import PublicLanding from "@/pages/public-landing";
import Dashboard from "@/pages/dashboard";
import Positions from "@/pages/positions";
import AddLiquiditySimple from "@/pages/add-liquidity-simple";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Admin from "@/pages/admin";
import Support from "@/pages/support";
import Invoices from "@/pages/invoices";
import BillingProfile from "@/pages/billing-profile";
import BackupInfo from "@/pages/backup-info";
import HowItWorks from "@/pages/how-it-works";
import Recovery from "@/pages/recovery";
import TransfersPage from "@/pages/transfers";
// import Algorithm from "@/pages/algorithm"; // Removed
import AlgorithmDetails from "@/pages/algorithm-details";
// Eliminado: import AlgorithmApex from "@/pages/algorithm-apex";
import TermsOfUse from "@/pages/terms-of-use";
import PrivacyPolicy from "@/pages/privacy-policy";
import Disclaimer from "@/pages/disclaimer";
import ReferralsPage from "@/pages/referrals/referrals-page";
import NFTsPage from "@/pages/nfts/nfts-page";
import ManagedNftsPage from "@/pages/admin/managed-nfts";
import PublicReferrals from "@/pages/public-referrals";
import TopPools from "@/pages/top-pools";
import UniswapExplorer from "@/pages/uniswap-explorer";
import UniswapPoolsExplorer from "@/pages/uniswap-pools-explorer";
import { StripeDiagnosticsPage } from "@/pages/stripe-diagnostics";
import WebSocketDiagnostics from "@/pages/websocket-diagnostics";
import NotFound from "@/pages/not-found";
import Podcast from "@/pages/podcast";
import GrayBackgroundFixer from "@/components/gray-bg-fixer";
import ResetPassword from "@/pages/reset-password";
import TestFlags from "@/pages/test-flags";
import WalletConnectTestPage from "@/pages/wallet-connect-test";
import WalletDemoPage from "@/pages/wallet-demo";
import WagmiWalletDemoPage from "@/pages/wagmi-wallet-demo";
import MultiWalletDemoPage from "@/pages/multi-wallet-demo";
import MoneroWalletPage from "@/pages/monero-wallet";
import WalletRecoveryPage from "@/pages/wallet-recovery";
import SimpleWalletDemoPage from "@/pages/simple-wallet-demo";
import WalletDemoBasicPage from "@/pages/wallet-demo-basic";
import WalletConnectorDemo from "@/pages/wallet-connector-demo";
import WalletDemosPage from "@/pages/wallet-demos";
import WalletDemoUnified from "@/pages/wallet-demo-unified";
import WalletSimple from "@/pages/wallet-simple";
import DemoWallet from "@/pages/demo-wallet";
import HolaMundo from "@/pages/hola-mundo";
import WalletTestPage from "@/pages/wallet-test";
import MoneroSimplePage from "@/pages/monero-simple";
// Chat eliminado para evitar errores de WebSocket
import { ExpandedPositionsProvider } from "@/context/expanded-positions-context";
import { ReferralCodeProvider } from "@/context/referral-code-context";
import { WalletProvider } from "@/lib/new-wallet-provider";
import { SimpleWalletProvider } from "@/lib/simple-wallet-provider";
import { useWallet } from "@/hooks/use-wallet";
import { LegalTermsProvider, useLegalTerms } from "@/hooks/use-legal-terms";
import LegalAcceptanceBlocker from "@/components/legal/legal-acceptance-blocker";
import AutoReferralHandler from "@/components/referrals/auto-referral-handler";

import React, { Suspense, useEffect } from "react";
import { TranslationProvider } from "@/hooks/use-translation";
import SEOManager from "@/components/seo/seo-manager";
import TranslationShield, { getEmergencyTranslation } from "@/components/translation-shield";
import PublicPagesEnhancer from "@/components/seo/public-pages-enhancer";
import PublicPageWrapper from "@/components/layout/public-page-wrapper";
import FooterMenuFixer from "@/components/shared/footer-menu-fixer";
import CustodialWalletMonitor from "@/components/wallet/custodial-wallet-monitor";
import { useSessionRestore } from "@/hooks/use-session-restore";
import { mainnet, polygon } from "wagmi/chains";

// Componente para manejar el login automático
function AutoLoginComponent() {
  useSessionRestore();
  return null;
}

// Proyecto ID para WalletConnect v2
// En un entorno real, esto debería estar en una variable de entorno
const projectId = "27e484dcd237756ba3f1c4d8bf2dd4fb";

// Definir las cadenas con las que queremos trabajar
const chains = [mainnet, polygon];

// Configuración para asegurar que Web3Modal solo se inicializa una vez
// Nota: El error de Web3Modal es conocido y no afecta la funcionalidad principal de la app
// ya que existen otros proveedores de wallet (SimpleWalletProvider, WalletProvider) que funcionan
// IMPORTANTE: Usamos una flag global para evitar inicialización múltiple que causa loops en Firefox
const WEB3MODAL_INIT_KEY = '__web3modal_initialized__';
if (typeof window !== 'undefined' && !(window as any)[WEB3MODAL_INIT_KEY]) {
  (window as any)[WEB3MODAL_INIT_KEY] = true;
  try {
    const w3mModule = require('@web3modal/wagmi');
    const createWeb3Modal = w3mModule.createWeb3Modal;
    const defaultWagmiConfig = w3mModule.defaultWagmiConfig;

    if (typeof defaultWagmiConfig === 'function') {
      const wagmiConfig = defaultWagmiConfig({
        chains,
        projectId,
        metadata: {
          name: 'WayBank',
          description: 'Conecta tu wallet a WayBank',
          url: 'https://waybank.com',
          icons: ['https://avatars.githubusercontent.com/u/37784886']
        }
      });

      createWeb3Modal({
        wagmiConfig,
        projectId,
        chains,
        themeMode: 'dark',
        themeVariables: {
          accentColor: '#3b82f6'
        }
      });
      console.log("Web3Modal inicializado correctamente");
    } else {
      console.log("Web3Modal: defaultWagmiConfig no disponible en esta versión - usando proveedores alternativos");
    }
  } catch (error) {
    console.log("Web3Modal no inicializado - usando proveedores de wallet alternativos");
  }
}

// Componente para cargar componentes lazy
const LazyLoadedRoute = ({ component: Component, ...rest }: any) => (
  <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>}>
    <Component {...rest} />
  </Suspense>
);

// Carga dinámica de los componentes de admin
const TransactionHistoryPage = React.lazy(() => import("@/pages/admin/transaction-history"));
const WBCTransactionsPage = React.lazy(() => import("@/pages/admin/wbc-transactions"));

// Componente que usa el contexto de términos legales y bloquea el acceso si no se han aceptado
function LayoutWithLegalTerms({ children }: { children: React.ReactNode }) {
  const { hasAcceptedLegalTerms, isLoading } = useLegalTerms();
  
  // Log para depuración
  console.log("LayoutWithLegalTerms - Estado de términos legales:", { 
    hasAcceptedLegalTerms, 
    isLoading
  });
  
  return (
    <LegalAcceptanceBlocker>
      <Layout 
        hasAcceptedLegalTerms={hasAcceptedLegalTerms} 
        isLoadingLegalTerms={isLoading}
      >
        {children}
      </Layout>
    </LegalAcceptanceBlocker>
  );
}

function Router() {
  const [location] = useLocation();
  // Siempre llamamos a useWallet para cumplir con las reglas de los hooks
  // pero solo usamos sus valores cuando es necesario
  const { account, isConnected } = useWallet();
  
  // Cleanup de URLs para remover hashtags innecesarios
  useEffect(() => {
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    // Si hay un hashtag vacío o innecesario, eliminarlo
    if (currentHash === '#' || (currentUrl.endsWith('#') && !currentUrl.includes('#/'))) {
      const cleanUrl = currentUrl.replace(/#$/, '');
      window.history.replaceState({}, '', cleanUrl);
      console.log('🧹 URL limpiada:', cleanUrl);
    }
    
    // También limpieza adicional cada vez que cambia la ubicación
    setTimeout(() => {
      if (window.location.hash === '#') {
        const newCleanUrl = window.location.origin + window.location.pathname + window.location.search;
        window.history.replaceState({}, '', newCleanUrl);
        console.log('🧹 Limpieza adicional aplicada:', newCleanUrl);
      }
    }, 100);
  }, [location]);
  
  // Sistema de persistencia y reconexión automática mejorado
  // NOTA: La reconexión principal se maneja en WalletProvider
  // Este useEffect solo maneja la autenticación en backend cuando ya hay conexión
  useEffect(() => {
    const handleReconnection = async () => {
      try {
        // DESHABILITADO: La reconexión automática ahora se maneja solo en WalletProvider
        // para evitar loops en navegadores sin wallet
        // Solo guardamos/limpiamos datos de sesión basados en el estado actual

        // 1. Autenticación automática cuando wallet se conecta
        if (account && isConnected) {
          console.log("🔐 Ejecutando login automático para:", account);

          // Guardar datos de sesión
          localStorage.setItem('waybank_wallet_address', account);
          localStorage.setItem('waybank_wallet_type', 'metamask');
          localStorage.setItem('waybank_wallet_connection_time', Date.now().toString());

          // Autenticar en backend
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: account }),
          });

          const data = await response.json();
          if (data.success) {
            console.log("✅ Login automático exitoso y sesión guardada");
          }
        }

        // 2. NO limpiar datos automáticamente - esto lo maneja WalletProvider
        // Solo limpiar si explícitamente se desconecta (no al cargar página)
      } catch (error) {
        console.error("❌ Error en sistema de persistencia:", error);
      }
    };

    handleReconnection();
  }, [account, isConnected]);
  
  // Verificar si estamos en una página pública que no necesita wallet
  const isLandingPage = location === "/";
  const isNewLandingPage = location === "/new" || location === "/welcome";
  const isHowItWorksPage = location === "/how-it-works";
  // const isAlgorithmPage = location === "/algorithm"; // Removed
  const isAlgorithmDetailsPage = location === "/algorithm-details";
  // Removido: const isAlgorithmApexPage = location === "/algorithm-apex";
  const isLegalPage = location === "/terms-of-use" || location === "/privacy-policy" || location === "/disclaimer";
  const isPublicReferralsPage = location === "/public-referrals";
  const isTopPoolsPage = location === "/top-pools";
  const isUniswapPage = location === "/uniswap";
  const isPodcastPage = location === "/podcast";
  const isResetPasswordPage = location.startsWith("/reset-password");
  const isRecoveryPage = location === "/recovery";
  const isTestFlagsPage = location === "/test-flags";
  const isWalletConnectTestPage = location === "/wallet-connect-test";
  const isWalletDemoPage = location === "/wallet-demo";
  const isWagmiDemoPage = location === "/wagmi-demo";
  const isMultiWalletDemoPage = location === "/multi-wallet-demo";
  const isWalletSimplePage = location === "/wallet-simple";
  const isWalletDemoUnifiedPage = location === "/wallet-demo-unified";
  const isWalletDemosPage = location === "/wallet-demos";
  const isWalletDemoBasicPage = location === "/wallet-demo-basic";
  const isWalletConnectorDemoPage = location === "/wallet-connector-demo";
  const isSimpleWalletDemoPage = location === "/simple-wallet-demo";
  const isDemoWalletPage = location === "/demo-wallet";
  const isHolaMundoPage = location === "/hola-mundo";
  const isWalletTestPage = location === "/wallet-test";
  const isMoneroSimplePage = location === "/monero-simple";
  
  // Añadir clase al elemento html cuando estamos en una página pública
  const isPublicPage = isLandingPage || isNewLandingPage || isHowItWorksPage || isAlgorithmDetailsPage || isLegalPage || 
    isPublicReferralsPage || isTopPoolsPage || isPodcastPage || isResetPasswordPage || isRecoveryPage || isTestFlagsPage || 
    isWalletConnectTestPage || isWalletDemoPage || isWagmiDemoPage || isMultiWalletDemoPage || isWalletSimplePage || 
    isWalletDemoUnifiedPage || isWalletDemosPage || isWalletDemoBasicPage || isWalletConnectorDemoPage || isSimpleWalletDemoPage || 
    isDemoWalletPage || isHolaMundoPage || isWalletTestPage || isMoneroSimplePage || isUniswapPage;
  
  // Efecto para agregar/quitar la clase al html
  useEffect(() => {
    if (isPublicPage) {
      document.documentElement.classList.add('public-page-active');
    } else {
      document.documentElement.classList.remove('public-page-active');
    }
    
    // Limpiar al desmontar
    return () => {
      document.documentElement.classList.remove('public-page-active');
    };
  }, [isPublicPage]);
  
  // Para páginas públicas sin layout (landing, how-it-works, algorithm-details, páginas legales, referidos públicos, top-pools, podcast, reset-password, recovery, test-flags, wallet-connect-test, wallet-demo y wagmi-demo)
  if (isLandingPage || isNewLandingPage || isHowItWorksPage || isAlgorithmDetailsPage || isLegalPage || isPublicReferralsPage || isTopPoolsPage || isPodcastPage || isResetPasswordPage || isRecoveryPage || isTestFlagsPage || isWalletConnectTestPage || isWalletDemoPage || isWagmiDemoPage || isMoneroSimplePage || isUniswapPage) {
    return (
      <PublicPageWrapper>
        <Switch>
          <Route path="/" component={ResponsiveLanding} />
          <Route path="/new" component={PublicLanding} />
          <Route path="/welcome" component={PublicLanding} />
          <Route path="/how-it-works" component={HowItWorks} />
          {/* Ruta Algorithm removida */}
          <Route path="/algorithm-details" component={AlgorithmDetails} />
          {/* Ruta Algorithm Apex removida */}
          <Route path="/terms-of-use" component={TermsOfUse} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/public-referrals" component={PublicReferrals} />
          <Route path="/top-pools" component={TopPools} />
          <Route path="/uniswap" component={UniswapPoolsExplorer} />
          <Route path="/podcast" component={Podcast} />
          <Route path="/reset-password/:token" component={ResetPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/recovery" component={Recovery} />
          <Route path="/test-flags" component={TestFlags} />
          <Route path="/wallet-connect-test" component={WalletConnectTestPage} />
          <Route path="/wallet-demo" component={WalletDemoPage} />
          <Route path="/wagmi-demo" component={WagmiWalletDemoPage} />
          <Route path="/multi-wallet-demo" component={MultiWalletDemoPage} />
          <Route path="/multi-wallet" component={MultiWalletDemoPage} />
          <Route path="/multi-wallet/" component={MultiWalletDemoPage} />
          <Route path="/simple-wallet-demo" component={SimpleWalletDemoPage} />
          <Route path="/wallet-demo-basic" component={WalletDemoBasicPage} />
          <Route path="/wallet-connector-demo" component={WalletConnectorDemo} />
          <Route path="/wallet-demos" component={WalletDemosPage} />
          <Route path="/wallet-demo-unified" component={WalletDemoUnified} />
          <Route path="/wallet-simple" component={WalletSimple} />
          <Route path="/demo-wallet" component={DemoWallet} />
          <Route path="/hola-mundo" component={HolaMundo} />
          <Route path="/wallet-test" component={WalletTestPage} />
          <Route path="/monero-simple" component={MoneroSimplePage} />
          <Route path="/monero-wallet" component={MoneroWalletPage} />
          <Route path="/wallet-recovery/:walletAddress" component={WalletRecoveryPage} />
          <Route path="/wallet-recovery" component={WalletRecoveryPage} />
          <Route component={NotFound} />
        </Switch>
      </PublicPageWrapper>
    );
  }
  
  // Agregar proveedor de términos legales cuando el usuario está conectado
  // para páginas internas que requieren autenticación
  if (isConnected && account) {
    return (
      <LegalTermsProvider walletAddress={account}>
        <LayoutWithLegalTerms>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/positions" component={Positions} />
            <Route path="/pools" component={() => <LazyLoadedRoute component={React.lazy(() => import('@/pages/pools'))} />} />
            <Route path="/add-liquidity" component={AddLiquiditySimple} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route path="/support" component={Support} />
            <Route path="/invoices" component={Invoices} />
            <Route path="/billing-profile" component={BillingProfile} />
            <Route path="/transfers" component={TransfersPage} />
            <Route path="/referrals" component={ReferralsPage} />
            <Route path="/nfts" component={NFTsPage} />
            <Route path="/uniswap-explorer" component={UniswapExplorer} />
            <Route path="/admin" component={Admin} />
            <Route path="/admin/managed-nfts" component={ManagedNftsPage} />
            <Route path="/admin/transaction-history" component={() => <LazyLoadedRoute component={TransactionHistoryPage} />} />
            <Route path="/admin/wbc-transactions" component={() => <LazyLoadedRoute component={WBCTransactionsPage} />} />
            <Route path="/backup-info" component={BackupInfo} />
            <Route path="/stripe-diagnostics" component={StripeDiagnosticsPage} />
            <Route path="/websocket-diagnostics" component={WebSocketDiagnostics} />
            <Route component={NotFound} />
          </Switch>
        </LayoutWithLegalTerms>
      </LegalTermsProvider>
    );
  }
  
  // Layout básico para cuando el usuario no está conectado
  return (
    <Layout hasAcceptedLegalTerms={true} isLoadingLegalTerms={false}>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/positions" component={Positions} />
        <Route path="/pools" component={() => <LazyLoadedRoute component={React.lazy(() => import('@/pages/pools'))} />} />
        <Route path="/add-liquidity" component={AddLiquiditySimple} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/settings" component={Settings} />
        <Route path="/support" component={Support} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/billing-profile" component={BillingProfile} />
        <Route path="/transfers" component={TransfersPage} />
        <Route path="/referrals" component={ReferralsPage} />
        <Route path="/nfts" component={NFTsPage} />
        <Route path="/uniswap-explorer" component={UniswapExplorer} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/managed-nfts" component={ManagedNftsPage} />
        <Route path="/admin/transaction-history" component={() => <LazyLoadedRoute component={TransactionHistoryPage} />} />
        <Route path="/admin/wbc-transactions" component={() => <LazyLoadedRoute component={WBCTransactionsPage} />} />
        <Route path="/backup-info" component={BackupInfo} />
        <Route path="/stripe-diagnostics" component={StripeDiagnosticsPage} />
        <Route path="/websocket-diagnostics" component={WebSocketDiagnostics} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

// Se eliminó el manejador de diálogo de recuperación
// ya que el componente useRecoveryDialog y PasswordRecoveryDialog no existen actualmente

function App() {
  
  // Botón oculto para WalletConnect
  useEffect(() => {
    // Crear botón oculto para Web3Modal si no existe
    if (!document.getElementById('web3modal-connect-button')) {
      try {
        // Crear el botón personalizado de Web3Modal
        const button = document.createElement('w3m-button');
        button.id = 'web3modal-connect-button';
        button.style.position = 'fixed';
        button.style.bottom = '-200px';
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
        
        // Añadir el atributo w3m-button para compatibilidad
        button.setAttribute('w3m-button', '');
        
        // Mostrar en consola cuando se haga clic
        button.addEventListener('click', () => {
          console.log('Web3Modal botón activado');
        });
        
        // Agregar al DOM
        document.body.appendChild(button);
        console.log('Botón Web3Modal creado correctamente');
      } catch (error) {
        console.error('Error al crear botón Web3Modal:', error);
        
        // Intentar con un enfoque alternativo si falla el primero
        try {
          const fallbackButton = document.createElement('button');
          fallbackButton.id = 'web3modal-connect-button';
          fallbackButton.style.display = 'none';
          fallbackButton.setAttribute('w3m-button', '');
          document.body.appendChild(fallbackButton);
          console.log('Botón Web3Modal fallback creado');
        } catch (fallbackError) {
          console.error('Error al crear botón Web3Modal fallback:', fallbackError);
        }
      }
    }
  }, []);
  
  // Instalar una función de emergencia global para caso de errores fatales
  useEffect(() => {
    try {
      // Poner 't' como función de emergencia en window
      if (typeof window !== 'undefined') {
        (window as any).__last_t = (key: string) => {
          console.log("[EMERGENCIA] Usando t de emergencia para:", key);
          return key;
        };
      }
    } catch (e) {
      console.error("[FATAL] No se pudo instalar protección t:", e);
    }
  }, []);
  
  // Corrección para fondos grises en modo oscuro en móviles
  useEffect(() => {
    if (window.innerWidth <= 767 && document.documentElement.classList.contains('dark')) {
      // Importar dinámicamente el script de corrección
      import('@/lib/gray-fix').then(({ setupRecurringFix }) => {
        setupRecurringFix();
        console.log("[ESCUDO] Corrección de fondos grises activada");
      }).catch(err => {
        console.error("[ESCUDO] Error al cargar corrección de fondos:", err);
      });
    }
  }, []);

  return (
    <>
      <TranslationProvider>
        {/* Escudo de protección contra errores de traducción */}
        <TranslationShield />
        
        {/* Corrección de fondos grises en móviles */}
        <GrayBackgroundFixer />
        
        {/* Corrección para el menú de footer móvil */}
        <FooterMenuFixer />
        
        <SEOManager />
        <PublicPagesEnhancer />
        <WalletProvider>
          <SimpleWalletProvider>
            <ReferralCodeProvider>
              <ExpandedPositionsProvider>
                <Router />
                {/* Chat eliminado para evitar errores WebSocket */}
                <AutoReferralHandler />
                {/* Monitor de wallet custodiada */}
                <CustodialWalletMonitor />
                {/* Sistema de login automático */}
                <AutoLoginComponent />
                <Toaster />
              </ExpandedPositionsProvider>
            </ReferralCodeProvider>
          </SimpleWalletProvider>
        </WalletProvider>
      </TranslationProvider>
    </>
  );
}

export default App;
