import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function StripeDiagnostics() {
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runDiagnostics() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stripe/diagnostics');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDiagnosticResults(data);
    } catch (err) {
      console.error('Error running diagnostics:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  async function testPaymentIntent() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stripe/test-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100,
          currency: 'usd',
          description: 'Test payment intent',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDiagnosticResults({
        ...diagnosticResults,
        testPaymentIntent: data
      });
    } catch (err) {
      console.error('Error testing payment intent:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico de integración con Stripe</CardTitle>
          <CardDescription>
            Utilice esta herramienta para verificar la configuración de Stripe y solucionar problemas de pago
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={runDiagnostics} 
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? 'Ejecutando diagnóstico...' : 'Ejecutar diagnóstico completo'}
            </Button>
            
            <Button 
              onClick={testPaymentIntent} 
              disabled={loading}
              variant="outline"
              className="w-full md:w-auto"
            >
              Probar creación de PaymentIntent
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {diagnosticResults && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Resultados del diagnóstico</h3>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  {diagnosticResults.apiKeyValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Clave API de Stripe</p>
                    <p className="text-sm text-muted-foreground">
                      {diagnosticResults.apiKeyValid 
                        ? 'Válida y funcionando correctamente' 
                        : 'No válida o no configurada correctamente'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  {diagnosticResults.webhookConfigured ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Configuración de webhook</p>
                    <p className="text-sm text-muted-foreground">
                      {diagnosticResults.webhookConfigured 
                        ? 'Webhooks configurados correctamente' 
                        : 'Webhooks no configurados o con problemas'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  {diagnosticResults.mode ? (
                    <div className={`h-5 w-5 mt-0.5 ${diagnosticResults.mode === 'real' ? 'text-green-500' : 'text-amber-500'}`}>
                      {diagnosticResults.mode === 'real' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">Modo de operación</p>
                    <p className="text-sm text-muted-foreground">
                      {diagnosticResults.mode === 'real' 
                        ? 'Funcionando en modo real (producción)' 
                        : diagnosticResults.mode === 'simulation' 
                          ? 'Funcionando en modo simulación' 
                          : 'No se pudo determinar el modo de operación'}
                    </p>
                  </div>
                </div>
              </div>

              {diagnosticResults.testPaymentIntent && (
                <>
                  <Separator />
                  <h3 className="text-lg font-medium">Prueba de PaymentIntent</h3>
                  
                  <div className="rounded-md bg-muted p-4">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(diagnosticResults.testPaymentIntent, null, 2)}
                    </pre>
                  </div>
                </>
              )}

              {diagnosticResults.error && (
                <>
                  <Separator />
                  <h3 className="text-lg font-medium">Detalles del error</h3>
                  
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error en diagnóstico</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">
                      {diagnosticResults.error}
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
          <p className="text-sm text-muted-foreground">
            Si encuentra problemas, verifique la configuración de claves API en el servidor.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}