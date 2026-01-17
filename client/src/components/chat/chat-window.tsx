import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
// WebSocket temporalmente deshabilitado para evitar errores
// import { useWebSocket } from "@/hooks/use-websocket";
import { formatAddress } from "@/lib/ethereum";
import { Wifi, Send, User, MessageSquare, X, Minimize, Maximize, Users, Info } from "lucide-react";

// Interface para el mensaje de WebSocket
interface WebSocketEvent {
  data: string;
}

// Mock del hook useWebSocket para evitar errores de DOM
const useWebSocket = (config: any = {}) => {
  // Ignoramos la configuración pasada pero la aceptamos para mantener compatibilidad
  return {
    isConnected: false,
    send: (data: any) => false,
    setOnMessage: (callback: (event: WebSocketEvent) => void) => {},
    disconnect: () => {},
    status: 'disconnected' as const
  };
};

interface Message {
  id: string;
  type: 'chat' | 'system';
  clientId?: string;
  username?: string;
  message: string;
  timestamp: string;
}

interface ChatWindowProps {
  title?: string;
  minimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  title = "Chat Comunitario",
  minimized = false,
  onToggleMinimize,
  onClose
}) => {
  const { toast } = useToast();
  const { address } = useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [usersCount, setUsersCount] = useState(0);
  const [showUsernamePicker, setShowUsernamePicker] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  
  // Usar el hook personalizado de WebSocket para gestionar la conexión
  const { 
    isConnected, 
    send, 
    setOnMessage, 
    disconnect
  } = useWebSocket({
    endpoint: '/ws',
    autoReconnect: true,
    reconnectAttempts: 3,
    reconnectDelay: 2000,
    onOpen: () => {
      console.log("WebSocket connection opened for chat");
      
      toast({
        title: "Conectado al chat",
        description: "Ahora puedes interactuar con otros usuarios",
        duration: 3000
      });
    },
    onClose: () => {
      console.log("WebSocket connection closed for chat");
    },
    onError: () => {
      toast({
        title: "No se pudo conectar al chat",
        description: "El servicio de chat no está disponible en este momento",
        variant: "destructive",
        duration: 3000
      });
    }
  });
  
  // Inicializar nombre de usuario
  useEffect(() => {
    // Inicializar nombre de usuario primero, para que esté disponible incluso si WS falla
    if (address) {
      setUsername(formatAddress(address));
      setUsernameInput(formatAddress(address));
    } else {
      const randomName = `Anónimo${Math.floor(Math.random() * 1000)}`;
      setUsername(randomName);
      setUsernameInput(randomName);
    }
  }, [address]);
  
  // Enviar mensaje de conexión cuando el nombre de usuario y la conexión estén listos
  useEffect(() => {
    if (isConnected && username) {
      console.log("Enviando mensaje de conexión con username:", username);
      
      send(JSON.stringify({
        type: 'connect',
        username: username,
        clientId: clientId || crypto.randomUUID()
      }));
    }
  }, [isConnected, username, clientId, send]);
  
  // Configurar manejador de mensajes WebSocket
  useEffect(() => {
    if (isConnected) {
      setOnMessage((event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("[CHAT] Message received:", data);
          
          switch (data.type) {
            case 'connection':
              setClientId(data.clientId);
              break;
              
            case 'chat':
            case 'system':
              const newMessage: Message = data;
              setMessages(prev => [...prev, newMessage]);
              break;
              
            case 'chatHistory':
              if (Array.isArray(data.messages)) {
                setMessages(data.messages);
              }
              break;
              
            case 'usersCount':
              setUsersCount(data.count || 0);
              break;
              
            case 'poolUpdate':
              // Ignoramos este tipo de mensaje aquí ya que es manejado por otro componente
              break;
              
            default:
              console.log("Mensaje de tipo desconocido:", data);
          }
        } catch (error) {
          console.error("Error al procesar mensaje:", error);
        }
      });
    }
    
    // Limpiar al desmontar
    return () => {
      // El hook useWebSocket se encarga de cerrar la conexión
    };
  }, [isConnected, setOnMessage]);
  
  // Auto-scroll al recibir nuevos mensajes
  const scrollToBottom = () => {
    const scrollableArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollableArea) {
      scrollableArea.scrollTop = scrollableArea.scrollHeight;
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const sendMessage = () => {
    if (!input.trim() || !isConnected) return;
    
    send(JSON.stringify({
      type: 'chat',
      message: input.trim()
    }));
    
    setInput("");
  };
  
  const updateUsername = () => {
    if (!usernameInput.trim() || !isConnected) return;
    
    send(JSON.stringify({
      type: 'username',
      username: usernameInput.trim()
    }));
    
    setUsername(usernameInput.trim());
    setShowUsernamePicker(false);
    
    toast({
      title: "Nombre actualizado",
      description: `Tu nombre ha sido cambiado a ${usernameInput.trim()}`,
      duration: 3000
    });
  };
  
  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  const handleUsernameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateUsername();
    }
  };
  
  const toggleUsernamePicker = () => {
    setShowUsernamePicker(!showUsernamePicker);
  };
  
  if (minimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <Card className="shadow-lg w-60 overflow-hidden">
          <CardHeader className="p-3 cursor-pointer" onClick={onToggleMinimize}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{title}</span>
              </div>
              <div className="flex items-center space-x-1">
                {isConnected ? 
                  <Badge variant="outline" className="px-1 py-0 h-5">
                    <Wifi className="h-3 w-3 text-green-500 mr-1" /> 
                    <span className="text-xs">{usersCount}</span>
                  </Badge> :
                  <Badge variant="outline" className="px-1 py-0 h-5 text-destructive">
                    <Wifi className="h-3 w-3 mr-1" />
                  </Badge>
                }
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onToggleMinimize}>
                  <Maximize className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Card className="shadow-lg w-80 md:w-96 h-[30rem] flex flex-col">
        <CardHeader className="p-3 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              {title}
              {isConnected ? 
                <Badge variant="outline" className="ml-2 px-1 py-0 h-5">
                  <Users className="h-3 w-3 text-green-500 mr-1" /> 
                  <span className="text-xs">{usersCount}</span>
                </Badge> :
                <Badge variant="outline" className="ml-2 px-1 py-0 h-5 text-destructive">
                  <Users className="h-3 w-3 mr-1" /> 
                  <span className="text-xs">0</span>
                </Badge>
              }
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleUsernamePicker}>
                <User className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggleMinimize}>
                <Minimize className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative overflow-hidden">
          {showUsernamePicker && (
            <div className="absolute top-0 right-0 left-0 bg-background border-b p-3 shadow-md z-10">
              <div className="text-sm font-medium mb-2">Cambiar nombre de usuario</div>
              <div className="flex space-x-2">
                <Input 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyPress={handleUsernameKeyPress}
                  placeholder="Nuevo nombre"
                  className="text-sm h-8"
                  maxLength={20}
                />
                <Button size="sm" onClick={updateUsername} className="h-8">
                  Guardar
                </Button>
              </div>
            </div>
          )}
          
          <ScrollArea className="h-full p-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No hay mensajes aún.</p>
                  <p>¡Sé el primero en saludar!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'system' ? 'justify-center' : 'items-start'}`}>
                    {msg.type === 'chat' && (
                      <Avatar className="h-6 w-6 mr-2 mt-1">
                        <AvatarFallback className="text-xs">
                          {msg.username?.substring(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex-1 ${msg.type === 'system' ? '' : 'bg-muted rounded-lg p-2'}`}>
                      {msg.type === 'chat' && (
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-xs font-medium text-foreground">
                            {msg.username}
                            {msg.clientId === clientId && 
                              <span className="ml-1 text-[10px] text-muted-foreground">(tú)</span>
                            }
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      )}
                      
                      <div className={`text-sm ${msg.type === 'system' ? 'text-muted-foreground text-xs text-center italic' : ''}`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="p-2 border-t">
          <div className="flex space-x-1 w-full items-center">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleInputKeyPress}
              placeholder="Escribir mensaje..."
              className="text-sm"
              maxLength={500}
              disabled={!isConnected}
            />
            <Button 
              size="icon" 
              onClick={sendMessage} 
              disabled={!isConnected || !input.trim()}
              className={`${isConnected ? 'bg-primary' : 'bg-muted'}`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatWindow;