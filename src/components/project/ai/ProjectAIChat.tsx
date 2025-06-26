
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Project } from '@/types/project';
import { getProjectAIResponse } from '@/utils/projectAIService';
import { useIsMobile } from '@/hooks/use-mobile';

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
      content: `Olá! Sou a **MadenAI**, sua assistente especializada no projeto **${project.name}**.\n\nAnalisei todos os dados técnicos deste projeto de ${project.total_area}m² e estou pronta para responder suas perguntas sobre:\n\n• **Quantitativos e materiais**\n• **Especificações técnicas**\n• **Orçamentos e custos**\n• **Cronogramas de obra**\n• **Documentos do projeto**\n\nComo posso ajudá-lo hoje?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Scroll automático estilo ChatGPT
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages, isTyping]);

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
    
    // Foco no input após enviar (mobile)
    if (inputRef.current && isMobile) {
      inputRef.current.blur();
    }
    
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
        content: 'Desculpe, ocorreu um erro temporário. Tente novamente.',
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

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={`flex items-start space-x-3 mb-6 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-600' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600'
        }`}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
        
        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block max-w-[85%] p-4 rounded-2xl ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200 shadow-sm text-gray-900'
          }`}>
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={`mb-2 last:mb-0 text-sm leading-relaxed ${
                  isUser ? 'text-white' : 'text-gray-900'
                }`}>
                  {line.includes('**') ? (
                    <span dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                  ) : line.includes('•') ? (
                    <span dangerouslySetInnerHTML={{
                      __html: line.replace(/•/g, '<span class="text-blue-600 font-bold">•</span>')
                    }} />
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          </div>
          
          <p className={`text-xs mt-2 text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex items-start space-x-3 mb-6">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${isMobile ? 'bg-white' : ''}`}>
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">MadenAI</h3>
            <p className="text-sm text-gray-500">Assistente especializada em {project.name}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          {/* Espaço extra no final */}
          <div className="h-4"></div>
        </div>
      </ScrollArea>
      
      {/* Input Area - Estilo ChatGPT */}
      <div className="shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Pergunte sobre ${project.name}...`}
                disabled={isTyping}
                className="w-full bg-gray-50 border-gray-200 rounded-2xl py-3 px-4 pr-12 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={isMobile ? {
                  fontSize: '16px', // Previne zoom no iOS
                } : {}}
              />
            </div>
            
            <Button 
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 rounded-2xl w-10 h-10 p-0 shrink-0"
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-2">
            MadenAI pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};
