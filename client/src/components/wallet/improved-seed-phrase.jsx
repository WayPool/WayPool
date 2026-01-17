import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Copy, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Componente para mostrar y gestionar frases semilla únicas
 * Esta versión corrige el error de que todas las cuentas usan la misma frase
 */
export const ImprovedSeedPhrase = ({ walletAddress }) => {
  const { toast } = useToast();
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState('');

  // Generar o recuperar la frase semilla única para esta wallet
  const fetchSeedPhrase = async () => {
    if (!walletAddress) {
      setError('No hay una wallet conectada');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Obtener la frase semilla única desde nuestra API pública
      const response = await fetch(`/api/wallet/seed-phrase-public?address=${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSeedPhrase(data.seedPhrase);
        console.log(`Frase semilla cargada para ${walletAddress.substring(0, 6)}...`);
      } else {
        // Si hay un error en la API, mostrar el mensaje
        const errorData = await response.json();
        setError(errorData.error || 'Error al obtener la frase semilla');
      }
    } catch (error) {
      console.error('Error al obtener frase semilla:', error);
      setError('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Esta función fue eliminada porque causaba una vulnerabilidad de seguridad
  // al usar la misma frase semilla para todos los usuarios
  // Ahora siempre usamos fetchSeedPhrase() que obtiene frases únicas de la API

  // Mostrar/ocultar la frase semilla
  const toggleSeedPhrase = () => {
    if (!showSeedPhrase && !seedPhrase) {
      // Obtenemos la frase semilla única desde el servidor
      fetchSeedPhrase();
    }
    setShowSeedPhrase(!showSeedPhrase);
  };

  // Copiar la frase semilla al portapapeles
  const copySeedPhrase = () => {
    if (seedPhrase) {
      navigator.clipboard.writeText(seedPhrase);
      setHasCopied(true);
      
      toast({
        title: "Frase semilla copiada",
        description: "La frase semilla se ha copiado al portapapeles",
        duration: 3000,
      });
      
      setTimeout(() => {
        setHasCopied(false);
      }, 3000);
    }
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          Frase Semilla de Recuperación
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSeedPhrase}
            disabled={isLoading}
            className="h-8 px-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Cargando...</span>
            ) : showSeedPhrase ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="text-sm text-gray-500 mb-3">
          Esta frase semilla es única para tu wallet y te permite recuperar el acceso si pierdes tu contraseña.
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-3 flex items-start">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}
        
        {showSeedPhrase && seedPhrase ? (
          <div className="space-y-3">
            <div className="relative p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="font-mono text-sm break-all">
                {seedPhrase}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 h-7 w-7 p-0"
                onClick={copySeedPhrase}
              >
                {hasCopied ? 
                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                  <Copy className="h-4 w-4" />
                }
              </Button>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-700">
              <div className="font-medium mb-1">Importante:</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Guarda esta frase en un lugar seguro y privado.</li>
                <li>Nunca compartas tu frase semilla con nadie.</li>
                <li>WayBank nunca te pedirá tu frase semilla.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
            <div className="flex justify-center mb-2">
              <Shield className="h-10 w-10 text-blue-400" />
            </div>
            <p className="text-gray-600">
              {isLoading 
                ? "Generando frase semilla única..." 
                : "Tu frase semilla está oculta por seguridad"}
            </p>
            
            {!isLoading && !showSeedPhrase && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={toggleSeedPhrase}
              >
                Mostrar frase semilla
              </Button>
            )}
          </div>
        )}
        
        <div className="flex items-center mt-3 text-xs text-blue-600">
          <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>Tu frase semilla nunca se almacena en nuestros servidores</span>
        </div>
      </CardContent>
    </Card>
  );
};