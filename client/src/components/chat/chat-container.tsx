import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import ChatWindow from "./chat-window";

// Este componente maneja el estado de visualización del chat 
// y proporciona un botón flotante para abrirlo cuando esté cerrado
const ChatContainer: React.FC = () => {
  const [chatState, setChatState] = useState<'closed' | 'minimized' | 'open'>('closed');
  
  // Opcional: Guardar/cargar el estado del chat en localStorage para persistencia
  useEffect(() => {
    const savedState = localStorage.getItem('waybankChatState');
    if (savedState && ['closed', 'minimized', 'open'].includes(savedState)) {
      setChatState(savedState as 'closed' | 'minimized' | 'open');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('waybankChatState', chatState);
  }, [chatState]);
  
  const toggleChat = () => {
    if (chatState === 'closed') {
      setChatState('open');
    } else {
      setChatState('closed');
    }
  };
  
  const minimizeChat = () => {
    setChatState('minimized');
  };
  
  const maximizeChat = () => {
    setChatState('open');
  };
  
  const closeChat = () => {
    setChatState('closed');
  };
  
  return (
    <>
      {/* Botón flotante para abrir el chat cuando está cerrado */}
      {chatState === 'closed' && (
        <div className="fixed bottom-5 right-5 z-50">
          <Button 
            onClick={toggleChat}
            className="rounded-full h-12 w-12 shadow-lg flex items-center justify-center"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Ventana de chat (abierta o minimizada) */}
      {chatState !== 'closed' && (
        <ChatWindow 
          minimized={chatState === 'minimized'}
          onToggleMinimize={chatState === 'minimized' ? maximizeChat : minimizeChat}
          onClose={closeChat}
          title="Chat de la Comunidad"
        />
      )}
    </>
  );
};

export default ChatContainer;