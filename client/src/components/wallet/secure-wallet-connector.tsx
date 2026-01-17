import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Shield, Lock, QrCode, WalletCards, ShieldCheck, Fingerprint, LucideWallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useWeb3React } from '@/hooks/use-web3-react';
import { useTranslation } from '@/hooks/use-translation';

// Componente de selección de wallet para producción
export function SecureWalletConnector() {
  const [_, navigate] = useLocation();
  const { account, active } = useWeb3React();
  const { t } = useTranslation();
  
  // Efecto para redirigir al dashboard si el usuario ya está conectado
  useEffect(() => {
    // Solo redirijimos si:
    // 1. El usuario está activo y conectado
    // 2. Ya se ha completado la carga inicial (cuenta disponible)
    // 3. La conexión es producto de conectarse ahora, no una conexión previa
    if (active && account) {
      // Añadimos un pequeño retraso por si hay otras operaciones pendientes
      console.log("Usuario conectado detectado:", account);
      // No redirigimos automáticamente, dejamos que sea hecho por los componentes de wallet
    }
  }, [active, account]);

  return (
    <div className="container mx-auto p-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">
              {t('Secure Connection')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl">
            {t('Connect your blockchain wallet securely to access advanced liquidity management and trading functions.')}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-lg">
          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-400 font-medium">
            {t('All connections are encrypted and audited')}
          </span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
            <Lock className="h-12 w-12 text-primary mx-auto mb-2" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {t('Institutional-grade security')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              {t('All our wallet connections use advanced security protocols without storing private keys. Your information never leaves your device and transactions require your explicit approval.')}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="recommended" className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {t('Select your connection method')}
          </h2>
          <TabsList>
            <TabsTrigger value="recommended">{t('Recommended')}</TabsTrigger>
            <TabsTrigger value="all">{t('All options')}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="recommended">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/10 shadow-md hover:shadow-lg transition-shadow border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <WalletCards className="h-5 w-5 text-primary" />
                    WalletConnect
                  </CardTitle>
                  <CardDescription>
                    {t('Universal multi-wallet connection compatible with all major blockchain wallets')}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                  {t('Industry standard')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:flex-1 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-green-100 dark:bg-green-900/50 p-1 rounded-full">
                      <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t('Military-grade security')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('E2E encrypted connections using the highest cryptographic standards. Private keys never leave your device.')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 p-1 rounded-full">
                      <Fingerprint className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t('Compatible with +170 wallets')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('MetaMask, Coinbase Wallet, Trust Wallet, Ledger, Trezor, Rainbow and many more supported wallets.')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-indigo-100 dark:bg-indigo-900/50 p-1 rounded-full">
                      <QrCode className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t('Mobile and desktop connection')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('QR code scanning for mobile wallets and direct connection for browser extensions.')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:flex-1 rounded-lg overflow-hidden relative flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full text-center">
                    <WalletCards className="h-16 w-16 mx-auto mb-4 text-indigo-600" />
                    <h3 className="font-semibold text-lg mb-1">{t('WalletConnect Connection')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      {t('Standard protocol used by financial institutions and top-tier Web3 services')}
                    </p>
                    <Button 
                      onClick={() => navigate('/wallet-connect')}
                      className="w-full mt-auto bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
                      size="lg"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      {t('Connect securely')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-primary/10 bg-indigo-50/50 dark:bg-transparent">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t('Production support:')}</span> 
                {' '}{t('This connection is fully tested and optimized for production environments, offering the best user experience and compatibility.')}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* WalletConnect */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow border-primary/20 bg-gradient-to-tr from-indigo-50/70 to-transparent dark:from-indigo-950/30 dark:to-transparent">
              <CardHeader className="pb-3">
                <div className="absolute -top-3 -right-2">
                  <Badge className="bg-green-600 hover:bg-green-700">{t('Recommended')}</Badge>
                </div>
                <CardTitle className="flex items-center gap-2">
                  <WalletCards className="h-5 w-5 text-indigo-600" />
                  WalletConnect
                </CardTitle>
                <CardDescription>
                  {t('Universal multi-wallet solution')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 text-sm mb-4">
                  <p>
                    ✓ <span className="font-medium">{t('Advanced security')}</span> {t('with E2E encryption')}
                  </p>
                  <p>
                    ✓ {t('Compatible with')} <span className="font-medium">{t('+170 wallets')}</span>
                  </p>
                  <p>
                    ✓ {t('QR connection for')} <span className="font-medium">{t('mobile devices')}</span>
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/wallet-connect')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
                >
                  <WalletCards className="mr-2 h-4 w-4" />
                  {t('Connect')}
                </Button>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500">{t('High security standard protocol')}</p>
              </CardFooter>
            </Card>

            {/* Coinbase QR */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  Coinbase Wallet QR
                </CardTitle>
                <CardDescription>
                  {t('For Coinbase mobile users')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 text-sm mb-4">
                  <p>
                    ✓ <span className="font-medium">{t('Specific for Coinbase')}</span> Wallet
                  </p>
                  <p>
                    ✓ {t('Ideal for')} <span className="font-medium">{t('mobile users')}</span>
                  </p>
                  <p>
                    ✓ <span className="font-medium">{t('Instant connection')}</span> {t('via QR')}
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/coinbase-qr-wallet-simplified')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                  variant="default"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  {t('Scan QR')}
                </Button>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500">{t('No browser extensions needed')}</p>
              </CardFooter>
            </Card>

            {/* MetaMask */}
            <Card className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <LucideWallet className="h-5 w-5 text-orange-600" />
                  MetaMask
                </CardTitle>
                <CardDescription>
                  {t('Direct connection for MetaMask')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 text-sm mb-4">
                  <p>
                    ✓ <span className="font-medium">{t('Direct connection')}</span> {t('with the extension')}
                  </p>
                  <p>
                    ✓ <span className="font-medium">{t('Fast')}</span> {t('and no QR code')}
                  </p>
                  <p>
                    ✓ {t('Specifically designed for')} <span className="font-medium">MetaMask</span>
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/simple-wallet')}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                >
                  <LucideWallet className="mr-2 h-4 w-4" />
                  {t('Connect MetaMask')}
                </Button>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500">{t('Requires browser extension installed')}</p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {t('Security Information')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-gray-900 dark:text-gray-100">{t('We never store your private keys.')}</span> 
              {' '}{t('All credentials are kept exclusively on your device and authentication is done through secure cryptographic signatures.')}
            </p>
          </div>
          
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-gray-900 dark:text-gray-100">{t('Verifiable and audited connections.')}</span>
              {' '}{t('Our wallet connection code is fully audited by cybersecurity firms and uses industry standard protocols.')}
            </p>
          </div>
          
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-gray-900 dark:text-gray-100">{t('Full control over transactions.')}</span>
              {' '}{t('Each transaction requires your explicit approval and you can review all details before confirming any operation.')}
            </p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('For security inquiries or questions related to connecting your wallet, please contact our specialized support team.')}
        </p>
      </div>
    </div>
  );
}