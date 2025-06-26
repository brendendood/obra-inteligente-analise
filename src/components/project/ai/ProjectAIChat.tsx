
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { Project } from '@/types/project';
import { AIMessage } from './AIMessage';
import { AITypingIndicator } from './AITypingIndicator';
import { getProjectAIResponse } from '@/utils/projectAIService';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

interface ProjectAIChatProps {
  project: Project;
  onQuestionClick?: (question: string) => void;
}

export const ProjectAIChat = ({ project, onQuestionClick }: ProjectAIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Olá! Sou a IA MadenAI especializada no projeto **${project.name}**.\n\nAnalisei todos os dados técnicos deste projeto de ${project.total_area}m² e estou pronto para responder suas perguntas sobre:\n\n• **Áreas e dimensões** dos ambientes\n• **Quantitativos de materiais** necessários\n• **Especificações técnicas** e instalações\n• **Análise estrutural** e fundações\n• **Documentos** e arquivos do projeto\n\nComo posso ajudá-lo hoje?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isTyping) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const response = await getProjectAIResponse(textToSend, project);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message,
        timestamp: new Date(),
        data: response.data
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Response error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Expor função para componentes pais
  useEffect(() => {
    if (onQuestionClick) {
      (window as any).sendAIQuestion = sendMessage;
    }
  }, [onQuestionClick]);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-8rem)]">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 md:p-4">
        <div className="space-y-3 md:space-y-4">
          {messages.map((message) => (
            <AIMessage key={message.id} message={message} />
          ))}
          
          {isTyping && <AITypingIndicator />}
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 p-3 md:p-4 bg-gray-50/50 backdrop-blur-sm">
        <div className="flex space-x-2 md:space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Pergunte sobre ${project.name}...`}
            disabled={isTyping}
            className="flex-1 bg-white text-sm md:text-base"
          />
          <Button 
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700 px-3 md:px-4"
            size="default"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
