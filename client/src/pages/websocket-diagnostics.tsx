import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useWebSocket } from '@/hooks/use-websocket';
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface DiagnosticData {
  timestamp: string;
  environment: {
    nodeEnv: string;
    isReplit: boolean;
    replitDomain: string;
    host: string;
    protocol: string;
    isSecure: boolean;
    headers: Record<string, string>;
  };
  websocket: {
    recommendedProtocol: string;
    currentUrl: string;
  };
  replit: {
    configuredCorrectly: boolean;
    domains: string;
    suggestions: string[];
  };
}

interface WebSocketTestData {
  timestamp: string;
  websocketUrl: string;
  isSecureConnection: boolean;
  expectedToWork: boolean;
  troubleshooting: Record<string, string>;
  recommendations: string[];
}

export default function WebSocketDiagnostics() {
  const [sslDiagnostics, setSslDiagnostics] = useState<DiagnosticData | null>(null);
  const [wsTestData, setWsTestData] = useState<WebSocketTestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook de WebSocket para prueba en vivo
  const { 
    status, 
    isConnected, 
    isConnecting, 
    isFailed, 
    reconnect, 
    setOnMessage 
  } = useWebSocket({
    autoReconnect: true,
    reconnectAttempts: 3,
    reconnectDelay: 2000,
    onOpen: () => console.log('[Diagnostics] WebSocket conectado'),
    onClose: (event) => console.log(`[Diagnostics] WebSocket cerrado: ${event.code} ${event.reason}`),
    onError: (error) => console.error('[Diagnostics] Error WebSocket:', error)
  });

  const fetchSSLDiagnostics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ssl-diagnostics');
      const data = await response.json();
      
      if (data.status === 'success') {
        setSslDiagnostics(data.data);
      } else {
        setError(`Error: ${data.message}`);
      }
    } catch (err) {
      setError(`Error al obtener diagnósticos SSL: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchWebSocketTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/websocket-test');
      const data = await response.json();
      
      if (data.status === 'success') {
        setWsTestData(data.data);
      } else {
        setError(`Error: ${data.message}`);
      }
    } catch (err) {
      setError(`Error al obtener test WebSocket: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const runAllDiagnostics = async () => {
    await Promise.all([
      fetchSSLDiagnostics(),
      fetchWebSocketTest()
    ]);
  };

  useEffect(() => {
    runAllDiagnostics();
    
    // Configurar manejador de mensajes WebSocket
    setOnMessage((event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[Diagnostics] Mensaje WebSocket recibido:', data);
      } catch (e) {
        console.log('[Diagnostics] Mensaje WebSocket (raw):', event.data);
      }
    });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="h-5 w-5 text-gray-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diagnósticos WebSocket y SSL</h1>
          <p className="text-muted-foreground">
            Herramientas para diagnosticar problemas de conexión, incluyendo el error 4500
          </p>
        </div>
        <Button onClick={runAllDiagnostics} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Actualizar Diagnósticos
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estado WebSocket en Vivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Estado WebSocket en Vivo
          </CardTitle>
          <CardDescription>
            Conexión WebSocket actual y su estado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            {getStatusIcon(status)}
            <Badge className={getStatusColor(status)}>
              {status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isConnected && "Conectado exitosamente"}
              {isConnecting && "Conectando..."}
              {isFailed && "Conexión fallida - Revisar configuración SSL"}
              {status === 'disconnected' && "Desconectado"}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reconnect}
              disabled={isConnecting}
            >
              Reconectar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diagnósticos SSL */}
      {sslDiagnostics && (
        <Card>
          <CardHeader>
            <CardTitle>Configuración SSL/HTTPS</CardTitle>
            <CardDescription>
              Información sobre certificados y configuración HTTPS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Entorno</h4>
                <div className="space-y-1 text-sm">
                  <div>Protocolo: <Badge>{sslDiagnostics.environment.protocol}</Badge></div>
                  <div>Seguro: <Badge className={sslDiagnostics.environment.isSecure ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {sslDiagnostics.environment.isSecure ? 'Sí' : 'No'}
                  </Badge></div>
                  <div>Host: <code className="bg-muted px-1 rounded">{sslDiagnostics.environment.host}</code></div>
                  <div>Replit: <Badge className={sslDiagnostics.environment.isReplit ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                    {sslDiagnostics.environment.isReplit ? 'Sí' : 'No'}
                  </Badge></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">WebSocket</h4>
                <div className="space-y-1 text-sm">
                  <div>Protocolo recomendado: <Badge>{sslDiagnostics.websocket.recommendedProtocol}</Badge></div>
                  <div>URL: <code className="bg-muted px-1 rounded text-xs">{sslDiagnostics.websocket.currentUrl}</code></div>
                </div>
              </div>
            </div>

            {sslDiagnostics.replit.suggestions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Sugerencias</h4>
                  <ul className="text-sm space-y-1">
                    {sslDiagnostics.replit.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-muted-foreground">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Test WebSocket */}
      {wsTestData && (
        <Card>
          <CardHeader>
            <CardTitle>Test de Conectividad WebSocket</CardTitle>
            <CardDescription>
              Información técnica y resolución de problemas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Configuración de Conexión</h4>
              <div className="space-y-1 text-sm">
                <div>URL WebSocket: <code className="bg-muted px-1 rounded text-xs">{wsTestData.websocketUrl}</code></div>
                <div>Conexión segura: <Badge className={wsTestData.isSecureConnection ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {wsTestData.isSecureConnection ? 'Sí (wss://)' : 'No (ws://)'}
                </Badge></div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Códigos de Error Comunes</h4>
              <div className="grid gap-2">
                {Object.entries(wsTestData.troubleshooting).map(([code, description]) => (
                  <div key={code} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="min-w-fit">{code}</Badge>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Recomendaciones</h4>
              <ul className="text-sm space-y-1">
                {wsTestData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Solución Error 4500:</strong> Este error generalmente indica problemas con certificados SSL. 
          La configuración actualizada debería resolver automáticamente el protocolo correcto (wss:// para HTTPS, ws:// para HTTP local).
          Si persiste el problema, verificar la configuración de dominios en Replit.
        </AlertDescription>
      </Alert>
    </div>
  );
}