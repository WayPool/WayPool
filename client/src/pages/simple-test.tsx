import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Página de prueba para la solución simplificada de wallet
export default function SimpleTest() {
  return (
    <div className="container mx-auto p-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Prueba de Conexión Simplificada
        </h1>
        <Button 
          onClick={() => window.location.href = '/simple-wallet'}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Ir a Simple Wallet
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Redirección a Simple Wallet</CardTitle>
          <CardDescription>
            Debido a problemas de compatibilidad, hemos creado una versión aún más simple.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Esta implementación está teniendo problemas, por favor usa la versión ultra-simplificada:
          </p>
          <Button 
            onClick={() => window.location.href = '/simple-wallet'}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
          >
            Ir a Simple Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}