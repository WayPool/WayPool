import React, { useState, useEffect } from 'react';
import { LayoutBasic } from '@/components/layout/layout-basic';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EnhancedMultiBlockchainConnector } from '@/components/wallet/EnhancedMultiBlockchainConnector';
import { WagmiWrapper } from '@/lib/wagmi-provider';
import { initializeWeb3Modal } from '@/lib/web3modal-config';

// Inicializar Web3Modal en el lado del cliente
if (typeof window !== 'undefined') {
  try {
    initializeWeb3Modal();
  } catch (err) {
    console.error('Error inicializando Web3Modal:', err);
  }
}

/**
 * Página de demostración simple de Monero
 */
export default function MoneroSimplePage() {
  const { toast } = useToast();
  const [activeBlockchain, setActiveBlockchain] = useState<'ethereum' | 'monero' | 'other'>('monero');
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean,
    address?: string,
    network?: string,
  }>({ connected: false });

  // Efecto para mostrar un mensaje de bienvenida
  useEffect(() => {
    setTimeout(() => {
      toast({
        title: "🌐 Multi-Blockchain Hub",
        description: "Conecta con múltiples redes blockchain desde una sola interfaz",
      });
    }, 1000);
  }, [toast]);
  
  // Efecto para inicializar Web3Modal
  useEffect(() => {
    const initW3m = async () => {
      if (typeof window !== 'undefined') {
        try {
          // El botón se creará automáticamente
          console.log('Intentando inicializar Web3Modal...');
          
          // Verificar que el PROJECTID existe
          console.log('ProjectID disponible:', !!import.meta.env.WALLET_CONNECT_PROJECT_ID);
        } catch (err) {
          console.error('Error inicializando Web3Modal:', err);
        }
      }
    };
    
    initW3m();
  }, []);

  return (
    <LayoutBasic>
      <Helmet>
        <title>Centro Multi-Blockchain | WayBank</title>
        <meta name="description" content="Conecta con múltiples blockchains (Ethereum, Monero, Solana, Bitcoin) desde una única plataforma." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Centro Multi-Blockchain</h1>
            <p className="text-gray-500 mt-2">Conexión unificada para múltiples blockchains y tecnologías descentralizadas</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <WagmiWrapper>
              <EnhancedMultiBlockchainConnector defaultTab="ethereum" showDescription={true} />
            </WagmiWrapper>
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Ventajas de la integración multi-blockchain</CardTitle>
                <CardDescription>
                  Por qué integrar múltiples blockchains en una sola aplicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Para empresas y desarrolladores</h3>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li>
                        <span className="font-medium">Ampliación del mercado:</span>
                        <p className="text-gray-600 mt-1">Alcance a usuarios de diferentes ecosistemas blockchain</p>
                      </li>
                      <li>
                        <span className="font-medium">Flexibilidad tecnológica:</span>
                        <p className="text-gray-600 mt-1">Aprovechamiento de las fortalezas de cada red para diferentes funcionalidades</p>
                      </li>
                      <li>
                        <span className="font-medium">Tolerancia a fallos:</span>
                        <p className="text-gray-600 mt-1">Continuidad del servicio ante problemas en una blockchain específica</p>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Para usuarios finales</h3>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li>
                        <span className="font-medium">Experiencia unificada:</span>
                        <p className="text-gray-600 mt-1">Una sola plataforma para gestionar múltiples activos digitales</p>
                      </li>
                      <li>
                        <span className="font-medium">Optimización de costos:</span>
                        <p className="text-gray-600 mt-1">Elección de la red con menores comisiones según las condiciones del mercado</p>
                      </li>
                      <li>
                        <span className="font-medium">Mayor privacidad:</span>
                        <p className="text-gray-600 mt-1">Uso de redes centradas en privacidad cuando sea necesario</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Comparativa Técnica</CardTitle>
                <CardDescription>
                  Propiedades principales de las blockchains más populares
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b">
                      <tr>
                        <th className="py-2 text-left">Blockchain</th>
                        <th className="py-2 text-left">Consenso</th>
                        <th className="py-2 text-left">TPS</th>
                        <th className="py-2 text-left">Privacidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Ethereum</td>
                        <td>PoS</td>
                        <td>15-30</td>
                        <td>Baja</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Monero</td>
                        <td>PoW</td>
                        <td>~4</td>
                        <td>Alta</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Solana</td>
                        <td>PoH+PoS</td>
                        <td>~65,000</td>
                        <td>Baja</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Bitcoin</td>
                        <td>PoW</td>
                        <td>~7</td>
                        <td>Media-Baja</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Casos de uso óptimos</h3>
                  <div className="space-y-2 text-xs">
                    <p><span className="font-medium text-indigo-600">Ethereum:</span> DeFi, NFTs, Smart Contracts</p>
                    <p><span className="font-medium text-orange-600">Monero:</span> Pagos privados, confidencialidad</p>
                    <p><span className="font-medium text-purple-600">Solana:</span> DApps de alto rendimiento, GameFi</p>
                    <p><span className="font-medium text-yellow-600">Bitcoin:</span> Reserva de valor, liquidaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Futuras Integraciones</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p>Polkadot y parachain ecosystem</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p>Cosmos y IBC blockchains</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p>Layer 2 solutions (Optimism, zkSync)</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p>Decentralized identities (DIDs)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
              <h3 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Sobre esta plataforma</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Esta plataforma demuestra la integración de múltiples tecnologías blockchain en una única interfaz. La conectividad con redes EVM (Ethereum, Polygon, etc.) está completamente implementada, mientras que la conectividad con Monero se presenta en modo simulación. Las integraciones con Bitcoin y Solana están en desarrollo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutBasic>
  );
}