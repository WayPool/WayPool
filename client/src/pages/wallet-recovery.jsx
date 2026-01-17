import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useRoute } from 'wouter';
import { LayoutBasic } from '@/components/layout/layout-basic';
import { WalletRecoveryDialog } from '@/components/wallet/wallet-recovery-fix';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImprovedSeedPhrase } from '@/components/wallet/improved-seed-phrase';
import { Shield, Key, Lock, RefreshCw } from 'lucide-react';

/**
 * Página para recuperación de wallets y gestión de frases semilla
 * Esta solución implementa frases semilla únicas para cada wallet
 */
const WalletRecoveryPage = () => {
  const [location, navigate] = useLocation();
  const [, params] = useRoute('/wallet-recovery/:walletAddress');
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [demoWalletAddress, setDemoWalletAddress] = useState(
    params?.walletAddress || '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F'
  );
  const [seedPhrases, setSeedPhrases] = useState({});
  const [loading, setLoading] = useState(false);

  // Simulamos diferentes wallets para demostración
  const walletAddresses = [
    { address: '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F', label: 'Wallet Demo 1' },
    { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', label: 'Wallet Demo 2' },
    { address: '0xf89d356809814b13C53643307b4411dA950f9012', label: 'Wallet Demo 3' }
  ];

  // Cargar frases semilla únicas para cada wallet de demostración
  useEffect(() => {
    const loadSeedPhrases = async () => {
      setLoading(true);
      
      const phrases = {};
      for (const wallet of walletAddresses) {
        try {
          const response = await fetch(`/api/wallet/seed-phrase-public?address=${wallet.address}`);
          if (response.ok) {
            const data = await response.json();
            phrases[wallet.address] = data.seedPhrase;
            console.log(`Frase cargada para ${wallet.address}: ${data.seedPhrase.substring(0, 15)}...`);
          }
        } catch (error) {
          console.error(`Error al cargar frase para ${wallet.address}:`, error);
        }
      }
      
      setSeedPhrases(phrases);
      setLoading(false);
    };
    
    loadSeedPhrases();
  }, []);

  // Función para cambiar el wallet de demostración
  const changeWallet = (address) => {
    setDemoWalletAddress(address);
    navigate(`/wallet-recovery/${address}`);
  };

  return (
    <LayoutBasic>
      <Helmet>
        <title>Recuperación de Wallet | WayBank</title>
        <meta name="description" content="Herramientas para recuperación y gestión segura de wallets" />
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Gestión y Recuperación de Wallet</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda - Frases Semilla */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Seguridad y Recuperación de Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Tu wallet tiene una frase semilla <strong>única</strong> generada específicamente 
                  para tu dirección. Esta frase te permite recuperar el acceso a tu wallet en caso 
                  de pérdida de contraseña u otras emergencias.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                  <div className="flex items-start">
                    <Key className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 mb-1">Importante</p>
                      <p className="text-sm text-amber-700">
                        Esta frase semilla es <strong>específica</strong> para tu wallet en WayBank y 
                        no funcionará en otras carteras. Guarda una copia en un lugar seguro y nunca 
                        la compartas con nadie.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Para propósitos de demostración, mostramos diferentes wallets */}
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Selecciona un wallet para la demostración:</div>
                  <div className="flex flex-wrap gap-2">
                    {walletAddresses.map((wallet) => (
                      <Button 
                        key={wallet.address}
                        variant={demoWalletAddress === wallet.address ? "default" : "outline"}
                        size="sm"
                        onClick={() => changeWallet(wallet.address)}
                      >
                        {wallet.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Componente para mostrar la frase semilla única */}
                <ImprovedSeedPhrase walletAddress={demoWalletAddress} />
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5 text-primary" />
                  Recuperar Acceso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Si has perdido el acceso a tu wallet, puedes utilizar tu frase semilla para recuperar 
                  tu cuenta y establecer una nueva contraseña.
                </p>
                
                <Button 
                  onClick={() => setShowRecoveryDialog(true)}
                  className="w-full md:w-auto"
                >
                  Iniciar Recuperación
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Columna Derecha - Información */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-primary" />
                  Mejoras de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Frases Semilla Únicas</p>
                      <p className="text-gray-600">Cada wallet tiene su propia frase semilla única, derivada matemáticamente de su dirección.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Algoritmo Determinista</p>
                      <p className="text-gray-600">Aunque no guardamos tu frase, podemos validarla porque se genera usando parámetros consistentes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Contraseñas Hasheadas</p>
                      <p className="text-gray-600">Las contraseñas se almacenan usando algoritmos de hash seguros con sal única.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-sm mb-2">¿Necesitas más ayuda?</h4>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver documentación
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-center font-medium mb-2">Protección Premium</h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  Mejora la seguridad de tu wallet con nuestro servicio premium de protección avanzada y respaldo.
                </p>
                <Button variant="default" size="sm" className="w-full">
                  Conocer más
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Diálogo de recuperación */}
      {showRecoveryDialog && (
        <WalletRecoveryDialog
          isOpen={showRecoveryDialog}
          onClose={() => setShowRecoveryDialog(false)}
          userWalletAddress={demoWalletAddress}
        />
      )}
    </LayoutBasic>
  );
};

export default WalletRecoveryPage;