import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Loader2, 
  Bot, 
  User,
  Copy,
  CheckCircle,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { sendMessageToAgent } from '@/utils/sendToAgent';
import { Badge } from '@/components/ui/badge';
import { sanitizeAIContent } from '@/facades/core';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ModernAIChatProps {
  project: Project;
}

export const ModernAIChat = ({ project }: ModernAIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Olá! Sou a **MadeAI**, sua assistente especializada no projeto **${project.name}**.\n\nAnalisei todos os dados técnicos e estou pronta para responder suas perguntas sobre quantitativos, especificações, orçamentos e cronogramas.\n\nComo posso ajudá-lo?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'fallback' | 'error'>('connected');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();

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
    setConnectionStatus('connected');
    
    try {
      console.log('📤 Enviando mensagem do projeto com contexto:', {
        user_id: user?.id,
        project_id: project.id,
        project_name: project.name
      });

      const response = await sendMessageToAgent(inputMessage, {
        user,
        project
      });
      
      // Detectar se é resposta simulada
      const isSimulated = response.includes('*Nota: Esta é uma resposta simulada');
      if (isSimulated) {
        setConnectionStatus('fallback');
      }
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      setConnectionStatus('error');
      
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível obter resposta da IA. Tente novamente.",
        variant: "destructive"
      });
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

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      toast({
        title: "Copiado!",
        description: "Mensagem copiada para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a mensagem.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3 text-green-600" />;
      case 'fallback':
        return <AlertTriangle className="h-3 w-3 text-amber-600" />;
      case 'error':
        return <WifiOff className="h-3 w-3 text-red-600" />;
      default:
        return <Wifi className="h-3 w-3 text-green-600" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'fallback':
        return 'Modo Backup';
      case 'error':
        return 'Desconectado';
      default:
        return 'Conectado';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'fallback':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.type === 'user';
    const isCopied = copiedMessageId === message.id;
    
    return (
      <div className={`flex items-start gap-4 mb-8 ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-blue-600' : 'bg-gray-900'
        }`}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
        
        {/* Message Content */}
        <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-4 rounded-2xl relative group ${
            isUser 
              ? 'bg-blue-600 text-white ml-auto' 
              : 'bg-gray-50 text-gray-900'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content.split('\n').map((line, i) => (
                <p key={i} className="mb-1 last:mb-0">
                  <span dangerouslySetInnerHTML={{
                    __html: sanitizeAIContent(
                      line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    )
                  }} />
                </p>
              ))}
            </div>
            
            {/* Copy button for AI messages */}
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0 bg-white hover:bg-gray-100 shadow-sm"
                onClick={() => copyMessage(message.content, message.id)}
              >
                {isCopied ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-600" />
                )}
              </Button>
            )}
          </div>
          
          <p className={`text-xs mt-2 text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
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
    <div className="flex items-start gap-4 mb-8">
      <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-gray-600 ml-2">Conectando com a IA especializada...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with connection status */}
      <div className="shrink-0 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">MadeAI</h3>
              <p className="text-sm text-gray-500">{project.name}</p>
            </div>
          </div>
          
          <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div className="h-4"></div>
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="shrink-0 p-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Pergunte sobre ${project.name}...`}
                disabled={isTyping}
                className="min-h-[50px] max-h-32 bg-gray-50 border-gray-200 rounded-xl py-3 px-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={isMobile ? { fontSize: '16px' } : {}}
              />
            </div>
            
            <Button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl w-12 h-12 p-0 shrink-0"
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
    </div>
  );
};
