
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Copy, 
  Trash2, 
  Download,
  CheckCircle 
} from 'lucide-react';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
      content: `Olá! Sou a **MadenAI**, sua assistente especializada no projeto **${project.name}**.\n\nAnalisei todos os dados técnicos deste projeto de ${project.total_area || 0}m² e estou pronta para responder suas perguntas sobre:\n\n• **Quantitativos e materiais**\n• **Especificações técnicas**\n• **Orçamentos e custos**\n• **Cronogramas de obra**\n• **Documentos do projeto**\n\nComo posso ajudá-lo hoje?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Auto-scroll para última mensagem
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
    
    // Simular resposta da IA (aqui você conectaria com N8N)
    try {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Entendi sua pergunta sobre "${inputMessage}". Como especialista no projeto ${project.name}, posso fornecer informações detalhadas baseadas na análise técnica.\n\nEsta é uma resposta simulada que será substituída pela integração com o N8N.`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "❌ Erro na comunicação",
        description: "Não foi possível obter resposta da IA. Tente novamente.",
        variant: "destructive"
      });
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
        title: "✅ Copiado!",
        description: "Mensagem copiada para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível copiar a mensagem.",
        variant: "destructive"
      });
    }
  };

  const clearConversation = () => {
    setMessages([messages[0]]); // Manter apenas mensagem inicial
    toast({
      title: "🗑️ Conversa limpa",
      description: "Histórico de mensagens foi removido.",
    });
  };

  const exportToPDF = () => {
    // Implementar exportação para PDF
    toast({
      title: "📄 Exportando...",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.type === 'user';
    const isCopied = copiedMessageId === message.id;
    
    return (
      <div className={`flex items-start space-x-3 mb-6 group ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
        <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-4 rounded-2xl relative group ${
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
            
            {/* Botão de copiar para mensagens da IA */}
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0 bg-gray-100 hover:bg-gray-200"
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
    <div className="flex items-start space-x-3 mb-6 animate-fade-in">
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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header com informações do projeto */}
      <div className="shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">MadenAI</h3>
              <p className="text-sm text-gray-500">Especialista em {project.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToPDF}
              className="text-gray-600 hover:text-gray-900"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="text-gray-600 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Área de mensagens */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div className="h-4"></div>
        </div>
      </ScrollArea>
      
      {/* Input área */}
      <div className="shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Pergunte qualquer coisa sobre ${project.name}...`}
                disabled={isTyping}
                className="min-h-[48px] max-h-32 bg-gray-50 border-gray-200 rounded-2xl py-3 px-4 pr-12 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={isMobile ? { fontSize: '16px' } : {}}
              />
            </div>
            
            <Button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 rounded-2xl w-12 h-12 p-0 shrink-0"
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
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
