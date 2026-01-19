import React, { useState, useEffect } from 'react';
import { LayoutBasic } from '@/components/layout/layout-basic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet';
import { AlertCircle, Copy, Info, CheckCircle } from 'lucide-react';

// Función para generar frases semilla únicas para Monero
function generateMoneroSeedPhrase() {
  // Lista de palabras simplificada (en una implementación real usaríamos el wordlist completo de Monero)
  const wordList = [
    'abort', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse',
    'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
    'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic',
    'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air',
    'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow'
  ];
  
  // Generamos 25 palabras aleatorias (Monero usa 25 palabras)
  const phrase = [];
  for (let i = 0; i < 25; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    phrase.push(wordList[randomIndex]);
  }
  
  return phrase.join(' ');
}

// Componente para mostrar una frase semilla con opciones para copiar
function SeedPhraseDisplay({ seedPhrase, onCopy }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase);
    setCopied(true);
    onCopy && onCopy();
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="relative p-3 bg-gray-50 border border-gray-200 rounded-md">
      <div className="font-mono text-xs break-all mb-2">
        {seedPhrase}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-2 right-2" 
        onClick={handleCopy}
      >
        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

// Componente para la conexión a Monero (simulado)
function MoneroSimulatedConnector() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ total: 0, unlocked: 0 });

  const generateRandomAddress = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '4';
    for (let i = 0; i < 94; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomBalance = () => {
    return {
      total: Math.random() * 10,
      unlocked: Math.random() * 8
    };
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const randomAddress = generateRandomAddress();
      const randomBalance = generateRandomBalance();
      
      setAddress(randomAddress);
      setBalance(randomBalance);
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setAddress('');
    setBalance({ total: 0, unlocked: 0 });
    setIsConnected(false);
  };

  if (isConnected) {
    return (
      <div className="p-4 border rounded-md">
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">Conectado a Monero (Simulado)</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Dirección:</div>
          <div className="p-2 bg-gray-100 rounded text-xs font-mono break-all">
            {address}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Balance:</div>
          <div className="flex space-x-4">
            <div>
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-medium">{balance.total.toFixed(6)} XMR</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Disponible</div>
              <div className="font-medium">{balance.unlocked.toFixed(6)} XMR</div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleDisconnect}
          variant="destructive"
          className="w-full"
        >
          Desconectar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md flex flex-col items-center">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium mb-2">Monero Wallet</h3>
        <p className="text-sm text-gray-500 mb-4">
          Conecta con tu wallet Monero para administrar tus fondos XMR
        </p>
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {isConnecting ? 'Conectando...' : 'Conectar Monero Wallet'}
        </Button>
      </div>
      <div className="mt-2 text-xs text-gray-400 w-full">
        <p className="text-center">Modo simulación - No se conecta a ninguna red real</p>
      </div>
    </div>
  );
}

export default function MoneroWalletPage() {
  return (
    <LayoutBasic>
      <Helmet>
        <title>Monero Wallet | WayBank</title>
        <meta name="description" content="Interfaz para conectar y gestionar una wallet de Monero (simulación)" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold">Monero Wallet</h1>
          <p className="text-gray-500 mt-2">Conectividad y gestión de Monero</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Card className="shadow-md border-slate-200">
              <CardHeader>
                <CardTitle>Conectar Wallet Monero</CardTitle>
                <CardDescription>
                  Establece conexión con tu wallet de Monero para gestionar tus fondos XMR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoneroSimulatedConnector />
                
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md text-orange-800">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Modo simulación</h3>
                      <p className="text-sm mt-1">
                        Esta es una simulación educativa de conectividad con Monero. No se conecta a ninguna red real ni realiza transacciones.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md mt-6">
              <CardHeader>
                <CardTitle>Operaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" disabled>Enviar XMR</Button>
                  <Button variant="outline" disabled>Recibir XMR</Button>
                  <Button variant="outline" disabled>Historial de Transacciones</Button>
                  <Button variant="outline" disabled>Sweeping Wallet</Button>
                </div>
                <div className="mt-4 text-center text-gray-500 text-sm">
                  <p>Conecte una wallet para activar estas operaciones</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Acerca de Monero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  Monero (XMR) es una criptomoneda enfocada en la privacidad que utiliza tecnologías avanzadas para ocultar la identidad del remitente, receptor y el monto de las transacciones.
                </p>
                
                <div>
                  <h3 className="font-medium mb-2">Características principales</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <span className="font-medium">Privacidad por defecto:</span> Todas las transacciones son privadas, no opcionales.
                    </li>
                    <li>
                      <span className="font-medium">Firmas en anillo:</span> Ocultan la identidad del remitente mezclando la firma con otras.
                    </li>
                    <li>
                      <span className="font-medium">RingCT:</span> Oculta los montos de las transacciones.
                    </li>
                    <li>
                      <span className="font-medium">Direcciones furtivas:</span> Ocultan la identidad del receptor.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Datos técnicos</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="text-gray-600">Algoritmo</div>
                    <div>RandomX (PoW)</div>
                    
                    <div className="text-gray-600">Tiempo de bloque</div>
                    <div>~2 minutos</div>
                    
                    <div className="text-gray-600">Suministro máximo</div>
                    <div>Indefinido</div>
                    
                    <div className="text-gray-600">Emisión actual</div>
                    <div>~0.6 XMR/bloque</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-medium mb-2 text-blue-800">Recursos adicionales</h3>
              <ul className="text-xs space-y-2 text-blue-600">
                <li><a href="https://www.getmonero.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">Sitio oficial de Monero</a></li>
                <li><a href="https://www.getmonero.org/downloads/" target="_blank" rel="noopener noreferrer" className="hover:underline">Descargar Monero oficial</a></li>
                <li><a href="https://monerodocs.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">Documentación técnica</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutBasic>
  );
}