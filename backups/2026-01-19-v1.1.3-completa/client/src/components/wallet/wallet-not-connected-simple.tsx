import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleConnectButton } from "./simple-connect-button";

interface WalletNotConnectedSimpleProps {
  title?: string;
  description?: string;
}

/**
 * Componente que muestra un mensaje cuando el wallet no está conectado
 * Versión simplificada para usar con SimpleWallet
 */
export function WalletNotConnectedSimple({
  title = "Conecta tu wallet",
  description = "Conecta tu wallet para acceder a esta funcionalidad"
}: WalletNotConnectedSimpleProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-center text-muted-foreground mb-6">
            Para utilizar esta funcionalidad, necesitas conectar tu wallet Ethereum.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <SimpleConnectButton />
      </CardFooter>
    </Card>
  );
}

export default WalletNotConnectedSimple;