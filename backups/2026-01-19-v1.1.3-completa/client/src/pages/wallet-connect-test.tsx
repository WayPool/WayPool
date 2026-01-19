import React from 'react';
import Layout from '@/components/layout';
import { Helmet } from 'react-helmet';
import Web3Connector from '@/components/wallet/Web3Connector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LucideWallet, ArrowRightLeft, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LayoutBasic } from '@/components/layout/layout-basic';

export default function WalletConnectTestPage() {
  const { toast } = useToast();

  const handleConnect = (address: string, chainId: string) => {
    toast({
      title: "Wallet conectada",
      description: `Dirección: ${address.substring(0, 8)}...${address.slice(-6)} en la red ${chainId}`,
    });
  };

  return (
    <LayoutBasic>
      <Helmet>
        <title>Prueba de conexión WalletConnect | WayBank</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Wallet className="mr-3 h-8 w-8 text-indigo-500" />
          Prueba de WalletConnect
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LucideWallet className="mr-2 h-5 w-5 text-indigo-500" />
                Nueva implementación WalletConnect v2
              </CardTitle>
              <CardDescription>
                Implementación mejorada usando Web3Modal y WalletConnect v2
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Web3Connector onConnect={handleConnect} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRightLeft className="mr-2 h-5 w-5 text-emerald-500" />
                Comparación con implementación actual
              </CardTitle>
              <CardDescription>
                La implementación anterior de WalletConnect tenía problemas de compatibilidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Ventajas de la nueva implementación:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Compatibilidad mejorada con navegadores modernos</li>
                  <li>Soporte para más proveedores de wallet</li>
                  <li>Interfaz de usuario mejorada y personalizable</li>
                  <li>Mejor manejo de errores y reconexiones</li>
                  <li>Soporte nativo para redes Ethereum y Polygon</li>
                </ul>
              </div>

              <Button variant="outline" asChild className="w-full">
                <Link href="/wallet-connect-page">
                  Ver información detallada de WalletConnect
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-blue-500" />
              Instrucciones de integración
            </CardTitle>
            <CardDescription>
              Cómo integrar este componente en otras partes de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                <h3 className="text-sm font-medium mb-2">Importación del componente:</h3>
                <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded overflow-x-auto">
                  {`import Web3Connector from '@/components/wallet/Web3Connector';`}
                </pre>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                <h3 className="text-sm font-medium mb-2">Uso básico:</h3>
                <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded overflow-x-auto">
                  {`<Web3Connector 
  onConnect={(address, chainId) => {
    console.log("Wallet conectada:", address, chainId);
    // Realizar acciones con la dirección conectada
  }} 
/>`}
                </pre>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Este componente gestiona automáticamente el estado de conexión, los cambios de cuenta
                y los errores. La función <code>onConnect</code> es llamada cuando se establece una conexión exitosa.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutBasic>
  );
}