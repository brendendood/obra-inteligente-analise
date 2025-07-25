import { useState, useRef, useEffect } from 'react';
import { Bot, User, Copy, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { AITypingIndicator } from './AITypingIndicator';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { sendMessageToAgent } from '@/utils/sendToAgent';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ModernAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Inicializar conversa quando componente carregar
  useEffect(() => {
    if (user && !conversationId) {
      initializeConversation();
    }
  }, [user, conversationId]);

  const initializeConversation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title: 'Conversa com MadenAI',
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      setConversationId(data.id);
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
    }
  };

  const saveMessage = async (content: string, role: 'user' | 'assistant') => {
    if (!conversationId || !user) return;

    try {
      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        content,
        role
      });
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setConnectionStatus('connecting');

    // Salvar mensagem do usuário
    await saveMessage(userMessage.content, 'user');

    try {
      const response = await sendMessageToAgent(userMessage.content, { user });
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConnectionStatus('connected');
      
      // Salvar resposta do assistente
      await saveMessage(response, 'assistant');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
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
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      case 'disconnected':
        return 'Desconectado';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
        return 'text-red-600';
    }
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-8`}>
      <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[70%] ${
        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
          message.type === 'user' 
            ? 'bg-blue-600' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500'
        }`}>
          {message.type === 'user' ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>
        
        <div className={`rounded-2xl px-4 py-3 relative group ${
          message.type === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.type === 'assistant' ? (
              <TypewriterText text={message.content} speed={25} />
            ) : (
              message.content
            )}
          </div>
          
          <div className={`text-xs mt-2 ${
            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>

          {message.type === 'assistant' && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={() => copyMessage(message.content, message.id)}
            >
              {copiedMessageId === message.id ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-gray-500" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const TypingIndicator = () => <AITypingIndicator />;

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-2rem)] bg-white rounded-lg border shadow-sm ml-6 mr-6 mt-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">MadenAI Assistant</h2>
            <p className="text-sm text-gray-600">Assistente inteligente para construção</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Olá! Como posso ajudar?
              </h3>
              <p className="text-gray-600 text-sm max-w-md">
                Faça perguntas sobre construção, orçamentos, cronogramas ou qualquer dúvida sobre seu projeto.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex space-x-3">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 min-h-[44px] max-h-32 resize-none border border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            disabled={isTyping}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-6"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ModernAIChat };