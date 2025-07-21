
import { useState, useEffect, useRef } from 'react';
import { sendMessageToAgent } from '@/utils/sendToAgent';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const ModernAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'fallback' | 'error'>('connected');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { currentProject } = useProject();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setConnectionStatus('connected');

    try {
      console.log('📤 Enviando mensagem com contexto:', {
        user_id: user?.id,
        project_id: currentProject?.id,
        project_name: currentProject?.name
      });

      const response = await sendMessageToAgent(inputMessage, {
        user,
        project: currentProject
      });
      
      // Detectar se é resposta simulada
      const isSimulated = response.includes('*Nota: Esta é uma resposta simulada');
      if (isSimulated) {
        setConnectionStatus('fallback');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      setConnectionStatus('error');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Houve um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white rounded-xl border border-gray-200 shadow-sm">
      <ChatHeader connectionStatus={connectionStatus} projectName={currentProject?.name} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
        projectName={currentProject?.name}
      />
    </div>
  );
};
