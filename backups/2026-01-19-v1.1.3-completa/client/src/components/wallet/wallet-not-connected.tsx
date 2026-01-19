import React from 'react';
import { SimpleConnectButton } from './simple-connect-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

type WalletNotConnectedProps = {
  title?: string;
  description?: string;
};

export function WalletNotConnected({ 
  title = "Conecta tu Wallet", 
  description = "Para acceder a esta página, necesitas conectar tu wallet de Ethereum." 
}: WalletNotConnectedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Acceso Restringido</AlertTitle>
            <AlertDescription>
              Esta página requiere una wallet conectada para funcionar correctamente.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center">
          <SimpleConnectButton />
        </CardFooter>
      </Card>
    </div>
  );
}