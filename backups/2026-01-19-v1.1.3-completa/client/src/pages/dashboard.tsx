import React, { useEffect, useState, lazy, Suspense } from "react";
import ConnectButton from "@/components/wallet/connect-button";
import ConnectModal from "@/components/wallet/connect-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { useTranslation } from "@/hooks/use-translation";
import { useUserNFTs } from "@/hooks/use-nfts";
import { usePositions } from "@/hooks/use-positions";
import { dashboardTranslations } from "@/translations/dashboard";

// Lazy loading de componentes pesados
const PortfolioStats = lazy(() => import("@/components/dashboard/portfolio-stats"));
const RewardsSimulator = lazy(() => import("@/components/dashboard/rewards-simulator"));
const UserPositions = lazy(() => import("@/components/dashboard/user-positions"));
const ActiveNFTPositions = lazy(() => import("@/components/dashboard/active-nft-positions").then(module => ({ default: module.ActiveNFTPositions })));
const SafeTranslationProvider = lazy(() => import("@/components/dashboard/safe-translation-provider"));
const NFTFlowProcess = lazy(() => import("@/components/dashboard/nft-flow-process"));
const NFTPoolCreationBanner = lazy(() => import("@/components/nft-pool-creation-banner"));

const Dashboard: React.FC = () => {
  console.log('[Dashboard] Component rendering...');
  const { address, setIsModalOpen } = useWallet();
  console.log('[Dashboard] address from useWallet:', address);
  const { t, language } = useTranslation();
  const { data: nfts = [] } = useUserNFTs();
  const { dbPositions = [] } = usePositions();
  
  // Estado para verificar si el usuario tiene posiciones
  const [hasPositions, setHasPositions] = useState(false);
  
  // Verificar si hay alguna posición de forma optimizada
  useEffect(() => {
    const hasDbPositions = Array.isArray(dbPositions) && dbPositions.length > 0;
    const hasNfts = Array.isArray(nfts) && nfts.length > 0;
    setHasPositions(hasDbPositions || hasNfts);
  }, [dbPositions, nfts]);

  return (
    <div className="dashboard-page">
      {/* Header with Wallet Connection */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{dashboardTranslations[language]?.title || 'Dashboard'}</h1>
          <p className="text-slate-500 dark:text-slate-400">{dashboardTranslations[language]?.subtitle || 'View your liquidity positions and metrics'}</p>
        </div>
        {/* Solo mostrar en desktop, ocultar en móvil */}
        <div className="hidden md:block w-full md:w-auto">
          <ConnectButton />
        </div>
      </div>

      {/* Only show portfolio section if wallet is connected */}
      {address && (
        <>
          {console.log('[Dashboard] Rendering NFT banner section for address:', address)}
          {/* NFT Pool Creation Banner - shows when user has pending NFT creations */}
          <Suspense fallback={null}>
            <NFTPoolCreationBanner />
          </Suspense>

          {/* NFT Flow Process con carga lazy */}
          <Suspense fallback={<div className="h-32 flex items-center justify-center"><Spinner /></div>}>
            <NFTFlowProcess />
          </Suspense>
          
          {/* Portfolio Overview con carga lazy */}
          <div className="mt-6">
            <Suspense fallback={<div className="h-48 flex items-center justify-center"><Spinner /></div>}>
              <PortfolioStats />
            </Suspense>
          </div>

          {/* Componentes que requieren posiciones - carga condicional optimizada */}
          {hasPositions && (
            <>
              {/* User Positions con carga lazy */}
              <div className="mt-6">
                <Suspense fallback={<div className="h-64 flex items-center justify-center"><Spinner /></div>}>
                  <SafeTranslationProvider>
                    <UserPositions />
                  </SafeTranslationProvider>
                </Suspense>
              </div>
              
              {/* NFT Positions con carga lazy */}
              <div className="mt-6">
                <Suspense fallback={<div className="h-48 flex items-center justify-center"><Spinner /></div>}>
                  <SafeTranslationProvider>
                    <ActiveNFTPositions />
                  </SafeTranslationProvider>
                </Suspense>
              </div>
            </>
          )}

          {/* Rewards Simulator con carga lazy */}
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><Spinner /></div>}>
            <RewardsSimulator />
          </Suspense>
        </>
      )}

      {/* Show intro section if wallet is not connected */}
      {!address && (
        <>
          {/* Versión Móvil - Solo mostrar el botón */}
          <div className="md:hidden flex flex-col items-center justify-center bg-[#0b101e] rounded-xl overflow-hidden p-6 mb-8">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-600/20">
              <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-medium mb-6">{t(dashboardTranslations[language]?.connectWallet || 'Connect Wallet')}</h3>
            <Button 
              size="lg" 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {t(dashboardTranslations[language]?.connectWallet || 'Connect')}
            </Button>
            <p className="text-[#8a9fc0] text-xs mt-4 text-center">
              {dashboardTranslations[language]?.agreeToTerms || 'By connecting your wallet, you agree to our'} <a href="/terms-of-use" className="text-indigo-400 hover:underline">{dashboardTranslations[language]?.termsOfService || 'Terms of Service'}</a>
            </p>
          </div>

          {/* Versión Desktop - Mostrar todo el contenido */}
          <div className="hidden md:block bg-[#0b101e] rounded-xl overflow-hidden mb-8">
            {/* Sección principal conexión segura */}
            <div className="p-6 border-b border-[#1c2438]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1a1f35] flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-white">{t(dashboardTranslations[language]?.secureConnection || 'Secure Connection')}</h2>
                    <div className="flex items-center gap-2 bg-[#15212e] px-3 py-1 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-400">{t(dashboardTranslations[language]?.allConnectionsEncrypted || 'All connections are encrypted and audited')}</span>
                    </div>
                  </div>
                  <p className="text-[#8a9fc0] text-sm mb-4">
                    {t(dashboardTranslations[language]?.connectBlockchainWallet || 'Connect your blockchain wallet securely to access advanced liquidity management and trading features.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Connect Section */}
            <div className="p-6 border-b border-[#1c2438]">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white">WalletConnect</h3>
                  </div>
                  <p className="text-[#8a9fc0] text-sm mb-4 ml-12">
                    {t(dashboardTranslations[language]?.connectWalletMessage || "Connect your wallet to view your dashboard")}
                  </p>

                  <div className="ml-12 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 mt-0.5 text-green-500 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{t(dashboardTranslations[language]?.militaryGradeSecurity || 'Military-grade security')}</h4>
                        <p className="text-xs text-[#8a9fc0]">{t(dashboardTranslations[language]?.encryptedConnections || 'E2E encrypted connections using the highest cryptographic standards. Private keys never leave your device.')}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 mt-0.5 text-green-500 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{t(dashboardTranslations[language]?.compatibleWallets || 'Compatible with +170 wallets')}</h4>
                        <p className="text-xs text-[#8a9fc0]">{t(dashboardTranslations[language]?.walletCompatibilityDesc || 'MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow and many more supported wallets.')}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 mt-0.5 text-green-500 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{t(dashboardTranslations[language]?.mobileDesktopConnection || 'Mobile and desktop connection')}</h4>
                        <p className="text-xs text-[#8a9fc0]">{t(dashboardTranslations[language]?.qrCodeScanning || 'QR code scanning for mobile wallets and direct connection for browser extensions.')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-[#111827] rounded-xl p-6 min-w-[300px]">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-600/20">
                    <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-6">{t(dashboardTranslations[language]?.connectWallet || 'Connect Wallet')}</h3>
                  <Button 
                    size="lg" 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    {t(dashboardTranslations[language]?.connect || 'Connect')}
                  </Button>
                  <p className="text-[#8a9fc0] text-xs mt-4 text-center">
                    {t(dashboardTranslations[language]?.agreeToTerms || 'By connecting your wallet, you agree to our')} <a href="/terms-of-use" className="text-indigo-400 hover:underline">{t(dashboardTranslations[language]?.termsOfService || 'Terms of Service')}</a>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Información de seguridad */}
            <div className="p-6 bg-[#0d121f]">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-white font-medium">{t(dashboardTranslations[language]?.securityInformation || 'Security Information')}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[#8a9fc0] text-xs">
                    <span className="text-white font-medium">{t(dashboardTranslations[language]?.neverStoreKeys || 'We never store your private keys.')}</span> {t(dashboardTranslations[language]?.credentialsOnDevice || 'All credentials are kept exclusively on your device and authentication is performed using secure cryptographic signatures.')}
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[#8a9fc0] text-xs">
                    <span className="text-white font-medium">{t(dashboardTranslations[language]?.verifiableConnections || 'Verifiable and audited connections.')}</span> {t(dashboardTranslations[language]?.auditedConnectionCode || 'Our wallet connection code is fully audited by cybersecurity firms and uses industry standard protocols.')}
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[#8a9fc0] text-xs">
                    <span className="text-white font-medium">{t(dashboardTranslations[language]?.completeControlTransactions || 'Complete control over transactions.')}</span> {t(dashboardTranslations[language]?.transactionApprovalDesc || 'Each transaction requires your explicit approval and you can review all details before confirming any operation.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Wallet connection modal */}
      <ConnectModal />
    </div>
  );
};

export default Dashboard;
