import { Server as HttpServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import crypto from 'crypto';
import { log } from './vite';
import { IncomingMessage } from 'http';

// Tipos de mensajes
type MessageType = 'connect' | 'chat' | 'username' | 'subscribe' | 'poolUpdate' | 'systemAlert' | 'ping' | 'pong';

// Interfaz para los mensajes recibidos
interface WsIncomingMessage {
  type: MessageType;
  [key: string]: any;
}

// Interfaz para los clientes conectados
interface ConnectedClient {
  id: string;
  ws: WebSocket;
  username: string;
  subscriptions: string[]; // Lista de topics a los que está suscrito
}

/**
 * Verifica si el origen es permitido para CORS
 */
function isOriginAllowed(origin: string | undefined): boolean {
  // Si no hay origen, permitir (probablemente conexión local)
  if (!origin) return true;
  
  // Lista de orígenes permitidos - actualizada para resolver errores de certificado
  const allowedOrigins = [
    /^https?:\/\/localhost(:\d+)?$/,             // localhost con cualquier puerto
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/,          // 127.0.0.1 con cualquier puerto
    /^https?:\/\/.*\.replit\.(dev|app)$/,        // cualquier subdominio de replit.dev o replit.app
    /^wss?:\/\/.*\.replit\.(dev|app)$/,          // WebSocket seguro para Replit
    /^https?:\/\/.*\.run-app\.net$/,             // cualquier subdominio de run-app.net
    /^https?:\/\/waybank\.net$/,                 // waybank.info
    /^https?:\/\/.*\.waybank\.net$/,             // cualquier subdominio de waybank.info
    /^https?:\/\/waybank\.net$/,                 // waybank.info
    /^https?:\/\/.*\.waybank\.net$/              // cualquier subdominio de waybank.info
  ];
  
  // Verificar si algún patrón coincide
  return allowedOrigins.some(pattern => pattern.test(origin));
}

/**
 * Implementación del servidor WebSocket
 * Maneja conexiones de chat y actualizaciones en tiempo real
 */
export class WayBankWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;
  private pingIntervalMs = 30000; // 30 segundos entre pings
  
  constructor(server: HttpServer) {
    // Inicializar el servidor WebSocket con configuración optimizada para Replit
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws',  // Importante: Mismo path que en el cliente
      // Configuración mejorada para resolver error 4500
      perMessageDeflate: {
        zlibDeflateOptions: {
          level: 3,
          windowBits: 13,
        },
        concurrencyLimit: 10,
        clientMaxWindowBits: 13,
        serverMaxWindowBits: 13,
      },
      // Verificar el origen para CORS con manejo mejorado de errores
      verifyClient: (info: { origin: string; secure: boolean; req: IncomingMessage }) => {
        try {
          const isAllowed = isOriginAllowed(info.origin);
          if (!isAllowed) {
            log(`WebSocket connection rejected from origin: ${info.origin}`, 'websocket');
          } else {
            log(`WebSocket connection accepted from origin: ${info.origin}`, 'websocket');
          }
          return isAllowed;
        } catch (error) {
          log(`Error verifying WebSocket client: ${error}`, 'websocket');
          return false;
        }
      }
    });
    
    log('WebSocket server initialized on path: /ws', 'websocket');
    
    // Configurar event handlers
    this.setupEventHandlers();
    
    // Iniciar el intervalo de ping para mantener conexiones vivas
    this.startPingInterval();
  }
  
  /**
   * Inicia el intervalo de ping para mantener conexiones activas
   * Este es un mecanismo estándar en aplicaciones de producción
   */
  private startPingInterval() {
    // Limpiar cualquier intervalo existente
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    // Programar ping cada X milisegundos
    this.pingInterval = setInterval(() => {
      log(`Sending ping to ${this.clients.size} clients`, 'websocket');
      
      this.clients.forEach((client, id) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          try {
            // Enviar un ping como mensaje (más compatible que client.ws.ping())
            client.ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
          } catch (error) {
            log(`Error sending ping to client ${id}: ${error}`, 'websocket');
            // Si falla el envío, marcar como desconectado
            this.clients.delete(id);
          }
        } else if (client.ws.readyState !== WebSocket.CONNECTING) {
          // Si no está conectado ni conectando, eliminar
          this.clients.delete(id);
        }
      });
      
      // Actualizar el contador después de limpiar
      if (this.clients.size > 0) {
        this.broadcastUsersCount();
      }
    }, this.pingIntervalMs);
    
    log(`Ping interval started (every ${this.pingIntervalMs}ms)`, 'websocket');
  }
  
  private setupEventHandlers() {
    this.wss.on('connection', (ws) => {
      // Generar ID único para este cliente
      const clientId = crypto.randomUUID();
      
      log(`New WebSocket connection established (${clientId})`, 'websocket');
      
      // Configurar cliente temporal (sin username aún)
      this.clients.set(clientId, {
        id: clientId,
        ws,
        username: `Guest_${clientId.substring(0, 4)}`,
        subscriptions: []
      });
      
      // Enviar mensaje de bienvenida y asignar ID
      this.sendToClient(ws, {
        type: 'connection',
        clientId,
        message: 'Conexión establecida con el servidor',
        timestamp: new Date().toISOString()
      });
      
      // Enviar historial de mensajes si es necesario
      // De momento solo enviamos un mensaje de sistema
      this.sendToClient(ws, {
        type: 'chatHistory',
        messages: [{
          type: 'system',
          id: crypto.randomUUID(),
          message: 'Bienvenido al chat de WayBank',
          timestamp: new Date().toISOString()
        }]
      });
      
      // Actualizar contador de usuarios para todos
      this.broadcastUsersCount();
      
      // Manejar mensajes recibidos
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString()) as WsIncomingMessage;
          log(`Received message from client ${clientId}: ${data.type}`, 'websocket');
          
          // Manejar según el tipo de mensaje
          switch (data.type) {
            case 'connect':
              this.handleConnectMessage(clientId, data);
              break;
              
            case 'chat':
              this.handleChatMessage(clientId, data);
              break;
              
            case 'username':
              this.handleUsernameChange(clientId, data);
              break;
              
            case 'subscribe':
              this.handleSubscription(clientId, data);
              break;
              
            case 'pong':
              // Respuesta a nuestro ping, actualizar último tiempo de actividad del cliente
              log(`Received pong from client ${clientId}`, 'websocket');
              // Si es necesario, aquí podríamos actualizar un timestamp de última actividad
              break;
              
            default:
              log(`Unknown message type: ${data.type}`, 'websocket');
          }
        } catch (error) {
          log(`Error parsing message: ${error}`, 'websocket');
        }
      });
      
      // Manejar desconexión
      ws.on('close', () => {
        log(`Client disconnected: ${clientId}`, 'websocket');
        this.clients.delete(clientId);
        
        // Informar a los demás clientes
        this.broadcastMessage({
          type: 'system',
          id: crypto.randomUUID(),
          message: `Usuario desconectado`,
          timestamp: new Date().toISOString()
        });
        
        // Actualizar contador de usuarios
        this.broadcastUsersCount();
      });
      
      // Manejar errores con diagnóstico mejorado
      ws.on('error', (error: any) => {
        log(`WebSocket error for client ${clientId}: ${error}`, 'websocket');
        
        // Diagnóstico específico para error 4500
        if (error.code === 4500 || error.message?.includes('4500')) {
          log(`Error 4500 detectado - problema de certificado SSL o configuración de servidor`, 'websocket');
        }
        
        // Limpiar cliente con error
        this.clients.delete(clientId);
      });
    });
  }
  
  // Manejar mensaje de conexión inicial con nombre de usuario
  private handleConnectMessage(clientId: string, data: WsIncomingMessage) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    // Actualizar username si fue proporcionado
    if (data.username) {
      client.username = data.username;
      
      // Actualizar o mantener el clientId
      if (data.clientId) {
        client.id = data.clientId;
      }
      
      log(`Client ${clientId} identified as ${client.username}`, 'websocket');
      
      // Informar a todos los clientes
      this.broadcastMessage({
        type: 'system',
        id: crypto.randomUUID(),
        message: `${client.username} se ha unido al chat`,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Manejar mensajes de chat
  private handleChatMessage(clientId: string, data: WsIncomingMessage) {
    const client = this.clients.get(clientId);
    if (!client || !data.message) return;
    
    // Crear mensaje para broadcast
    const chatMessage = {
      type: 'chat',
      id: crypto.randomUUID(),
      clientId: client.id,
      username: client.username,
      message: data.message,
      timestamp: new Date().toISOString()
    };
    
    // Enviar a todos
    this.broadcastMessage(chatMessage);
  }
  
  // Manejar cambios de nombre de usuario
  private handleUsernameChange(clientId: string, data: WsIncomingMessage) {
    const client = this.clients.get(clientId);
    if (!client || !data.username) return;
    
    const oldUsername = client.username;
    client.username = data.username;
    
    log(`Client ${clientId} changed username from ${oldUsername} to ${client.username}`, 'websocket');
    
    // Informar al cliente que el cambio fue exitoso
    this.sendToClient(client.ws, {
      type: 'system',
      id: crypto.randomUUID(),
      message: `Tu nombre ha sido cambiado a ${client.username}`,
      timestamp: new Date().toISOString()
    });
    
    // Informar a los demás
    this.broadcastMessage({
      type: 'system',
      id: crypto.randomUUID(),
      message: `${oldUsername} ahora es ${client.username}`,
      timestamp: new Date().toISOString()
    }, [clientId]); // Excluir al cliente que hizo el cambio
  }
  
  // Manejar suscripciones a temas
  private handleSubscription(clientId: string, data: WsIncomingMessage) {
    const client = this.clients.get(clientId);
    if (!client || !data.topic) return;
    
    // Añadir a la lista de suscripciones
    if (!client.subscriptions.includes(data.topic)) {
      client.subscriptions.push(data.topic);
      
      log(`Client ${clientId} subscribed to ${data.topic}${data.address ? ` for address ${data.address}` : ''}`, 'websocket');
      
      // Confirmar suscripción
      this.sendToClient(client.ws, {
        type: 'system',
        id: crypto.randomUUID(),
        message: `Suscrito a actualizaciones de ${data.topic}`,
        topic: data.topic,
        address: data.address,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Enviar mensaje a un cliente específico
  private sendToClient(ws: WebSocket, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
  
  // Broadcast a todos los clientes conectados
  private broadcastMessage(message: any, excludeClientIds: string[] = []) {
    const messageStr = JSON.stringify(message);
    
    this.clients.forEach((client) => {
      if (!excludeClientIds.includes(client.id) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }
  
  // Broadcast selectivo a clientes suscritos a un tema
  public broadcastToTopic(topic: string, data: any, address?: string) {
    const message = JSON.stringify({
      ...data,
      type: data.type || 'poolUpdate',
      topic,
      address,
      timestamp: new Date().toISOString()
    });
    
    let recipientCount = 0;
    
    this.clients.forEach((client) => {
      if (client.subscriptions.includes(topic) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
        recipientCount++;
      }
    });
    
    if (recipientCount > 0) {
      log(`Broadcast to ${recipientCount} clients subscribed to ${topic}${address ? ` for address ${address}` : ''}`, 'websocket');
    }
  }
  
  // Enviar actualización de contador de usuarios
  private broadcastUsersCount() {
    const count = this.clients.size;
    
    this.broadcastMessage({
      type: 'usersCount',
      count,
      timestamp: new Date().toISOString()
    });
    
    log(`Broadcasting users count: ${count}`, 'websocket');
  }
  
  // Método público para enviar updates desde otros módulos
  public sendPoolUpdate(poolAddress: string, data: any) {
    this.broadcastToTopic('poolData', {
      type: 'poolUpdate',
      data
    }, poolAddress);
  }
  
  // Método público para enviar alertas del sistema
  public sendSystemAlert(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    this.broadcastMessage({
      type: 'systemAlert',
      id: crypto.randomUUID(),
      message,
      level,
      timestamp: new Date().toISOString()
    });
    
    log(`System alert sent: ${message}`, 'websocket');
  }
}

// Singleton para acceder al servidor desde cualquier parte de la aplicación
let websocketServer: WayBankWebSocketServer | null = null;

// Función para inicializar el servidor WebSocket
export function initializeWebSocketServer(httpServer: HttpServer): WayBankWebSocketServer {
  if (!websocketServer) {
    websocketServer = new WayBankWebSocketServer(httpServer);
    log('WebSocket server initialized', 'websocket');
  }
  return websocketServer;
}

// Función para obtener instancia del servidor WebSocket
export function getWebSocketServer(): WayBankWebSocketServer | null {
  return websocketServer;
}