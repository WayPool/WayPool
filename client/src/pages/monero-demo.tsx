import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Demo de Monero - Esta página muestra una simulación básica de conexión con Monero
 */
export default function MoneroDemo() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ total: 0, unlocked: 0 });

  const connect = () => {
    setLoading(true);
    
    // Simulamos una conexión con un retraso de 1.5 segundos
    setTimeout(() => {
      setConnected(true);
      setAddress('43Scx7Aph8UUiibG8AyZP1QdcXZiHhbJ6AeCSixjKHeSKZVpUyiHDGki5q1BxSfQNin3GZ7cNgc4wUHkS9TNnpYdSUoK1b1');
      setBalance({
        total: 3.14159,
        unlocked: 2.71828
      });
      setLoading(false);
    }, 1500);
  };

  const disconnect = () => {
    setConnected(false);
    setAddress('');
    setBalance({ total: 0, unlocked: 0 });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-2">Monero Demo</h1>
      <p className="text-center text-gray-500 mb-8">Simulación de conexión con wallet Monero</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Wallet Monero 
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                Simulación
              </span>
            </CardTitle>
            <CardDescription>
              Simula la conexión con una wallet de Monero (XMR)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
              <p className="text-sm">
                <span className="font-medium">Nota:</span> Esta es una demostración
                con fines educativos. No se conecta a ninguna red real de Monero.
              </p>
            </div>
            
            {!connected ? (
              <Button 
                onClick={connect} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Conectando...' : 'Simular Conexión'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="mb-3">
                    <span className="text-sm text-gray-500 block mb-1">Dirección:</span>
                    <span className="font-mono text-xs break-all">{address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Balance Total:</span>
                      <span className="font-medium">{balance.total.toFixed(4)} XMR</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">Disponible:</span>
                      <span className="font-medium">{balance.unlocked.toFixed(4)} XMR</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={disconnect} 
                  variant="outline" 
                  className="w-full"
                >
                  Desconectar
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-gray-500">
            Una implementación real utilizaría monero-javascript o similar.
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acerca de Monero</CardTitle>
              <CardDescription>
                Criptomoneda centrada en la privacidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Monero (XMR) es una criptomoneda que implementa tecnologías avanzadas
                para garantizar la privacidad de las transacciones, ocultando
                direcciones, montos y el origen de los fondos.
              </p>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Tecnologías de privacidad:</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><span className="font-medium">Firmas de anillo:</span> Ocultan el origen de los fondos</li>
                  <li><span className="font-medium">RingCT:</span> Protege la privacidad de los montos</li>
                  <li><span className="font-medium">Direcciones ocultas:</span> Generación de dirección única por transacción</li>
                  <li><span className="font-medium">Bulletproofs:</span> Pruebas de rango optimizadas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Implementación</CardTitle>
              <CardDescription>
                Cómo funciona esta demostración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">
                Esta simulación imita el comportamiento básico de una wallet de Monero, mostrando:
              </p>
              
              <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                <li>Proceso de conexión (simulado)</li>
                <li>Dirección pública de la wallet</li>
                <li>Balance total de fondos</li>
                <li>Fondos desbloqueados (disponibles)</li>
              </ul>
              
              <p className="text-sm">
                En una implementación real, se utilizaría un nodo Monero o un servicio RPC para
                interactuar con la blockchain, usando bibliotecas como monero-javascript.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}