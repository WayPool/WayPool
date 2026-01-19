import { useEffect, useRef, useState, useCallback } from 'react';

// Tipos de eventos a los que se puede suscribir
type EventType = 'poolUpdate' | 'chat' | 'systemAlert';

// Configuración de la conexión WebSocket
export interface WebSocketConfig {
  endpoint?: string;  // Endpoint relativo, por defecto /ws
  autoReconnect?: boolean;  // Intentar reconexión automática
  reconnectAttempts?: number;  // Número máximo de intentos de reconexión
  reconnectDelay?: number;  // Retraso entre intentos de reconexión en ms
  onOpen?: (event: Event) => void;  // Callback cuando la conexión se abre
  onClose?: (event: CloseEvent) => void;  // Callback cuando la conexión se cierra
  onError?: (event: Event) => void;  // Callback en caso de error
}

// Estado de la conexión
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'failed';

/**
 * Hook para gestionar conexiones WebSocket con manejo de errores mejorado
 * Detecta automáticamente el entorno y se conecta al servidor correcto
 */
export const useWebSocket = (config?: WebSocketConfig) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const reconnectCount = useRef<number>(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Valores por defecto
  const {
    endpoint = '/ws',
    autoReconnect = true,
    reconnectAttempts = 5,  // Incrementado de 3 a 5
    reconnectDelay = 1000,  // Reducido de 2000 a 1000
    onOpen,
    onClose,
    onError
  } = config || {};

  // Determinar la URL del WebSocket
  const getWebSocketUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    
    // Configuración específica para Replit y compatibilidad con certificados SSL
    const isReplit = window.location.hostname.includes('replit') || 
                     window.location.hostname.includes('.replit.app') ||
                     window.location.hostname.includes('.replit.dev');
    
    // Para Replit, usar wss siempre ya que maneja automáticamente los certificados
    let protocol = 'wss:';
    
    // Solo usar ws en desarrollo local
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'http:' && !isReplit) {
      protocol = 'ws:';
    }
    
    // Determinar host
    const host = window.location.host;
    
    // Construir la URL final - usar siempre el host actual, que es lo más seguro
    // Esta configuración resuelve el error 4500 en Replit
    const url = `${protocol}//${host}${endpoint}`;
    
    console.log(`[WebSocket] Conectando a WebSocket en: ${url} (Replit: ${isReplit})`);
    
    return url;
  }, [endpoint]);

  // Iniciar la conexión WebSocket
  const connect = useCallback(() => {
    try {
      // Limpiar conexión existente
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      const wsUrl = getWebSocketUrl();
      console.log(`[WebSocket] Conectando a: ${wsUrl}`);
      
      if (!wsUrl) {
        console.error('[WebSocket] No se pudo determinar la URL');
        setStatus('failed');
        return;
      }

      // Actualizar estado
      setStatus('connecting');
      
      // Crear nueva conexión
      wsRef.current = new WebSocket(wsUrl);
      
      // Configurar manejadores de eventos
      wsRef.current.onopen = (event) => {
        console.log('[WebSocket] Conexión establecida');
        setStatus('connected');
        reconnectCount.current = 0;
        
        // Callback personalizado
        if (onOpen && isMountedRef.current) onOpen(event);
      };
      
      wsRef.current.onclose = (event) => {
        console.log(`[WebSocket] Conexión cerrada: ${event.code} ${event.reason}`);
        
        // Verificar códigos de error específicos
        if (event.code === 4500) {
          console.error('[WebSocket] Error 4500 - Internal server error. Esto puede indicar problemas de certificado SSL.');
        } else if (event.code === 1006) {
          console.warn('[WebSocket] Conexión cerrada de forma anormal (código 1006)');
        }
        
        setStatus('disconnected');
        
        // Callback personalizado
        if (onClose && isMountedRef.current) onClose(event);
        
        // Intentar reconexión si está habilitada y no se ha alcanzado el límite
        // Añadir delay extra para errores de certificado
        const extraDelay = event.code === 4500 ? 3000 : 0;
        
        if (autoReconnect && reconnectCount.current < reconnectAttempts && isMountedRef.current) {
          console.log(`[WebSocket] Intentando reconexión ${reconnectCount.current + 1}/${reconnectAttempts} en ${reconnectDelay + extraDelay}ms`);
          
          reconnectTimerRef.current = setTimeout(() => {
            reconnectCount.current++;
            connect();
          }, reconnectDelay + extraDelay);
        } else if (reconnectCount.current >= reconnectAttempts) {
          console.warn('[WebSocket] Se alcanzó el límite de reconexiones');
          setStatus('failed');
        }
      };
      
      wsRef.current.onerror = (event) => {
        console.error('[WebSocket] Error en la conexión', event);
        
        // Callback personalizado
        if (onError && isMountedRef.current) onError(event);
      };
      
    } catch (error) {
      console.error('[WebSocket] Error al crear la conexión:', error);
      setStatus('failed');
    }
  }, [getWebSocketUrl, autoReconnect, reconnectAttempts, reconnectDelay, onOpen, onClose, onError]);

  // Enviar mensaje a través del WebSocket
  const send = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        wsRef.current.send(message);
        return true;
      } catch (error) {
        console.error('[WebSocket] Error al enviar mensaje:', error);
        return false;
      }
    }
    console.warn('[WebSocket] Intento de envío con conexión no disponible');
    return false;
  }, []);

  // Suscribirse a un tipo de evento
  const subscribe = useCallback((topic: string, address?: string) => {
    return send({
      type: 'subscribe',
      topic,
      address
    });
  }, [send]);

  // Desconectar manualmente
  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setStatus('disconnected');
  }, []);

  // Establecer el manejador de mensajes con soporte para ping/pong
  const setOnMessage = useCallback((handler: (event: MessageEvent) => void) => {
    if (wsRef.current) {
      // Establecer directamente el manejador de mensajes
      // con soporte para ping/pong integrado
      wsRef.current.onmessage = (event: MessageEvent) => {
        try {
          // Intentar parsear como JSON
          const data = JSON.parse(event.data);
          
          // Si es un ping, responder con un pong
          if (data.type === 'ping') {
            console.log("[WebSocket] Ping recibido, enviando pong");
            
            // Responder con un pong
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                type: 'pong',
                timestamp: new Date().toISOString()
              }));
            }
            
            // No pasar este mensaje al handler personalizado
            return;
          }
        } catch (e) {
          // No es JSON o hubo un error al procesarlo, pasarlo al handler
        }
        
        // Para todos los demás mensajes, invocar el handler personalizado
        if (handler) {
          handler(event);
        }
      };
    }
  }, []);

  // Iniciar la conexión al montar el componente
  useEffect(() => {
    isMountedRef.current = true;
    connect();
    
    // Limpiar recursos al desmontar
    return () => {
      isMountedRef.current = false;
      
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    status,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isDisconnected: status === 'disconnected', 
    isFailed: status === 'failed',
    send,
    subscribe,
    disconnect,
    reconnect: connect,
    setOnMessage,
    webSocket: wsRef.current
  };
};