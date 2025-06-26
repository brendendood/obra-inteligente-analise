
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import { Project } from '@/types/project';
import { getProjectAIResponse } from '@/utils/projectAIService';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ModernProjectAIChatProps {
  project: Project;
}

export const ModernProjectAIChat = ({ project }: ModernProjectAIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Olá! Sou a **MadenAI**, sua assistente especializada no projeto **${project.name}**.\n\nAnalisei todos os dados técnicos deste projeto de ${project.total_area}m² e estou pronta para responder suas perguntas sobre quantitativos, materiais, orçamentos, cronogramas e documentos.\n\nComo posso ajudá-lo hoje?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Auto scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputMessage]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const response = await getProjectAIResponse(inputMessage, project);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.message,
        timestamp: new Date()
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {line.includes('**') ? (
          <span dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }} />
        ) : (
          line
        )}
      </p>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header Mobile */}
      {isMobile && (
        <div className="flex items-center p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/projeto/${project.id}`)}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">MadenAI</h3>
              <p className="text-xs text-gray-500">{project.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.map((message) => (
              <div key={message.id} className="mb-8">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-sm max-w-none text-gray-900">
                      {formatMessage(message.content)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="mb-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto p-4">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mensagem MadenAI..."
              disabled={isTyping}
              className="min-h-[60px] max-h-[200px] resize-none border-gray-300 rounded-xl pr-12 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontSize: isMobile ? '16px' : '14px' }}
            />
            
            <Button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              className="absolute bottom-2 right-2 w-8 h-8 p-0 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            MadenAI pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
};
