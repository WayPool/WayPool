import React from 'react';
import { BasicWalletConnector } from '@/components/wallet/BasicWalletConnector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WalletDemoBasicPage() {
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="container mx-auto max-w-screen-lg">
        <div className="space-y-6">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Demostración de Conexión Blockchain</h1>
            <p className="text-muted-foreground mt-2">
              Conecta tu wallet para interactuar con aplicaciones blockchain
            </p>
          </header>

          <Tabs defaultValue="connect" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connect">Conectar Wallet</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connect" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <BasicWalletConnector />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Instrucciones</CardTitle>
                    <CardDescription>Cómo probar la conexión</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium">Escritorio</h3>
                      <p className="text-sm text-muted-foreground">
                        Se requiere MetaMask u otra wallet compatible con Web3. Haz clic en "Conectar Wallet" para comenzar.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Móvil</h3>
                      <p className="text-sm text-muted-foreground">
                        En dispositivos móviles, utiliza un navegador con soporte para wallets (como MetaMask Browser) o una aplicación de wallet con navegador integrado.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Características</CardTitle>
                    <CardDescription>Lo que ofrece esta demo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Conexión directa con MetaMask y wallets compatibles</li>
                      <li>Detección automática de cambios de cuenta</li>
                      <li>Soporte para múltiples redes blockchain</li>
                      <li>Interfaz adaptada a dispositivos móviles</li>
                      <li>Gestión de errores y estados de conexión</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tecnologías</CardTitle>
                    <CardDescription>Stack tecnológico implementado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      <li><strong>ethers.js</strong> - Biblioteca para interactuar con Ethereum</li>
                      <li><strong>Web3 Provider</strong> - Conexión con el proveedor de Web3</li>
                      <li><strong>React</strong> - Framework de UI</li>
                      <li><strong>TypeScript</strong> - Tipado estático para mayor seguridad</li>
                      <li><strong>Shadcn/UI</strong> - Componentes de UI accesibles</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Card className="mt-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Notas sobre seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                Esta es una demostración técnica. En producción, siempre verifica la conexión segura
                a redes y contratos. Nunca compartas tu frase semilla o claves privadas.
                Solo conecta tu wallet a sitios en los que confíes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}