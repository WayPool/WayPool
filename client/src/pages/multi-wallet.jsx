import React from 'react';
import { LayoutBasic } from '@/components/layout/layout-basic';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WagmiRootProvider } from '@/lib/WagmiRootProvider';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';
import { MoneroConnector } from '@/components/wallet/MoneroConnector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function MultiWalletPage() {
  return (
    <LayoutBasic>
      <Helmet>
        <title>Centro Multi-Blockchain | WayBank</title>
        <meta name="description" content="Conecta con múltiples blockchains desde una sola interfaz" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold">Centro Multi-Blockchain</h1>
          <p className="text-gray-500 mt-2">Gestiona tus activos digitales a través de múltiples blockchains</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel principal con pestañas de conexión */}
          <div className="lg:col-span-2">
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle>Conectividad Multi-Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ethereum" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                    <TabsTrigger value="monero">Monero</TabsTrigger>
                    <TabsTrigger value="solana">Solana</TabsTrigger>
                    <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
                  </TabsList>
                  
                  {/* Ethereum y redes compatibles */}
                  <TabsContent value="ethereum" className="mt-4 space-y-4">
                    <WagmiRootProvider>
                      <ConnectWalletButton />
                    </WagmiRootProvider>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-3">Conecta con redes basadas en EVM:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                        <li>Ethereum Mainnet</li>
                        <li>Polygon</li>
                        <li>Arbitrum</li>
                        <li>Optimism</li>
                        <li>Binance Smart Chain</li>
                        <li>Avalanche C-Chain</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  {/* Monero (Simulación) */}
                  <TabsContent value="monero" className="mt-4 space-y-4">
                    <MoneroConnector />
                    
                    <Alert className="mt-3 bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/30">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Modo simulación</AlertTitle>
                      <AlertDescription>
                        La conexión con Monero está en modo simulación con fines educativos. No se conecta a ninguna red real.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  
                  {/* Solana (Próximamente) */}
                  <TabsContent value="solana" className="mt-4 space-y-4">
                    <div className="flex justify-center p-6 border border-dashed rounded-md border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50">
                      <div className="text-center">
                        <p className="text-gray-500 mb-3">Próximamente</p>
                        <button 
                          className="px-4 py-2 bg-purple-600 text-white rounded-md opacity-70 cursor-not-allowed"
                          disabled
                        >
                          Conectar con Solana
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Bitcoin (Próximamente) */}
                  <TabsContent value="bitcoin" className="mt-4 space-y-4">
                    <div className="flex justify-center p-6 border border-dashed rounded-md border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50">
                      <div className="text-center">
                        <p className="text-gray-500 mb-3">Próximamente</p>
                        <button 
                          className="px-4 py-2 bg-orange-500 text-white rounded-md opacity-70 cursor-not-allowed"
                          disabled
                        >
                          Conectar con Bitcoin
                        </button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Panel de operaciones */}
            <Card className="shadow-md mt-6">
              <CardHeader>
                <CardTitle>Operaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center text-gray-500">
                  <p>Conecte una wallet para ver las operaciones disponibles</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Panel lateral con información */}
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Información de Blockchains</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b">
                      <tr>
                        <th className="py-2 text-left">Blockchain</th>
                        <th className="py-2 text-center">Modelo</th>
                        <th className="py-2 text-right">TPS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Ethereum</td>
                        <td className="py-2 text-center">PoS</td>
                        <td className="py-2 text-right">15-30</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Monero</td>
                        <td className="py-2 text-center">PoW</td>
                        <td className="py-2 text-right">~4</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Solana</td>
                        <td className="py-2 text-center">PoH+PoS</td>
                        <td className="py-2 text-right">~65,000</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Bitcoin</td>
                        <td className="py-2 text-center">PoW</td>
                        <td className="py-2 text-right">~7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Estado de la red</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Ethereum:</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div> Activa
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Polygon:</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div> Activa
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Monero:</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div> Simulado
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Solana:</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div> Pendiente
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
              <h3 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Acerca de Multi-Wallet</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Este centro de conectividad permite gestionar activos digitales en múltiples blockchains desde una única interfaz. La conectividad con Ethereum y redes compatibles está completamente funcional. Monero opera en modo simulación, mientras que las integraciones de Solana y Bitcoin están en desarrollo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutBasic>
  );
}