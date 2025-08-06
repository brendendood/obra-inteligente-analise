import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, Check, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendDirectToN8N } from '@/utils/directN8NService';
import { AITypingIndicator } from '@/components/ai/AITypingIndicator';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ModernAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Inicializar conversa e carregar mensagens da tabela ai_messages
  useEffect(() => {
    if (!user?.id) return;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Lógica simples: buscar a ÚNICA conversa do usuário ou criar se não existir
        console.log('🔍 Buscando conversa única para user:', user.id);
        
        const { data: conversation } = await supabase
          .from('ai_conversations')
          .select('id')
          .eq('user_id', user.id)
          .is('project_id', null)
          .eq('status', 'active')
          .limit(1)
          .single();

        console.log('💬 Conversa encontrada:', conversation);

        let currentConversationId: string;

        if (conversation) {
          currentConversationId = conversation.id;
        } else {
          // Criar nova conversa
          const { data: newConversation, error } = await supabase
            .from('ai_conversations')
            .insert({
              user_id: user.id,
              title: 'Chat Geral',
              project_id: null,
              status: 'active'
            })
            .select()
            .single();

          if (error) throw error;
          currentConversationId = newConversation.id;
        }

        setConversationId(currentConversationId);

        // Carregar mensagens da tabela ai_messages
        const { data: messageData } = await supabase
          .from('ai_messages')
          .select('id, content, role, created_at')
          .eq('user_id', user.id)
          .eq('conversation_id', currentConversationId)
          .order('created_at', { ascending: true });

        if (messageData) {
          const formattedMessages: ChatMessage[] = messageData.map((msg) => ({
            id: msg.id,
            type: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at)
          }));
          setMessages(formattedMessages);
        }

      } catch (error) {
        console.error('Erro ao inicializar chat:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar mensagens.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [user?.id, toast]);

  // Subscription realtime para novas mensagens
  useEffect(() => {
    if (!user?.id || !conversationId) return;

    const channel = supabase
      .channel('ai_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Nova mensagem detectada:', payload);
          
          if (payload.new.conversation_id === conversationId) {
            const newMessage: ChatMessage = {
              id: payload.new.id,
              type: payload.new.role as 'user' | 'assistant',
              content: payload.new.content,
              timestamp: new Date(payload.new.created_at)
            };
            
            // Marcar apenas mensagens do assistente como novas para animação
            if (payload.new.role === 'assistant') {
              setNewMessageIds(prev => new Set([...prev, payload.new.id]));
              
              // Remover o ID após a animação terminar (300ms)
              setTimeout(() => {
                setNewMessageIds(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(payload.new.id);
                  return newSet;
                });
              }, 300);
            }
            
            setMessages(prev => [...prev, newMessage]);
            setIsTyping(false); // Parar animação de digitando
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, conversationId]);

  const saveMessage = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          content,
          role
        });
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping || !user?.id || !conversationId) return;

    const messageContent = inputMessage.trim();
    const messageId = crypto.randomUUID();
    setInputMessage('');
    setIsTyping(true);
    setConnectionStatus('connecting');

    // Criar mensagem do usuário e adicionar imediatamente ao estado local
    const userMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    // Adicionar mensagem do usuário imediatamente ao chat
    setMessages(prev => [...prev, userMessage]);

    try {
      // Salvar mensagem do usuário no banco
      console.log('📝 Salvando mensagem do usuário no banco...');
      await saveMessage(conversationId, messageContent, 'user');
      console.log('✅ Mensagem do usuário salva no banco');

      // Preparar histórico para contexto
      const conversationHistory = messages.map(msg => ({
        role: msg.type,
        content: msg.content
      }));

      // Enviar para N8N (resposta virá via realtime)
      console.log('🤖 Enviando para N8N...');
      await sendDirectToN8N(
        messageContent,
        user.id,
        conversationId,
        conversationHistory
      );
      console.log('✅ Chamada N8N enviada');

      setConnectionStatus('connected');

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      setConnectionStatus('disconnected');
      setIsTyping(false);
      
      toast({
        title: "Erro de conexão",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
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
        return <Wifi className="h-4 w-4 text-green-500" />;
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

// Componente MessageBubble movido para fora para evitar re-renders
const MessageBubble = React.memo(({ message, onCopy, copiedMessageId, isNewMessage }: { 
  message: ChatMessage; 
  onCopy: (content: string, messageId: string) => void;
  copiedMessageId: string | null;
  isNewMessage: boolean;
}) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[70%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar - apenas para o bot */}
        {!isUser && (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-sm text-white">🤖</span>
          </div>
        )}
        
        {/* Bubble da mensagem */}
        <div className={`rounded-2xl px-4 py-3 relative group shadow-sm ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}>
          <div className={`whitespace-pre-wrap break-words text-sm leading-relaxed ${
            message.type === 'assistant' && isNewMessage ? 'animate-fade-in' : ''
          }`}>
            {message.content}
          </div>
          
          {/* Horário */}
          <div className={`text-xs mt-2 opacity-70`}>
            {message.timestamp.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>

          {/* Botão de copiar - apenas para mensagens do bot */}
          {message.type === 'assistant' && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={() => onCopy(message.content, message.id)}
            >
              {copiedMessageId === message.id ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

  // Estilos condicionais baseados no dispositivo
  const containerClasses = isMobile 
    ? "flex flex-col h-screen bg-background overflow-hidden"
    : "flex flex-col h-full max-h-[calc(100vh-2rem)] bg-white rounded-lg border shadow-sm mx-6 mt-4 mb-4";
    
  const headerClasses = isMobile
    ? "hidden" // Ocultar header no mobile
    : "flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50";
    
  const messagesAreaClasses = isMobile
    ? "flex-1 overflow-y-auto p-4 space-y-4"
    : "flex-1 overflow-y-auto p-6 space-y-4";
    
  const inputAreaClasses = isMobile
    ? "p-4 bg-background border-t"
    : "p-4 border-t bg-gray-50";

  return (
    <div className={containerClasses}>
      {/* Header - oculto no mobile */}
      {!isMobile && (
        <div className={headerClasses}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">MadenAI Assistant</h2>
              <p className="text-sm text-gray-600">Tira-dúvidas geral de arquitetura e engenharia</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className={messagesAreaClasses}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <span className="text-2xl">🤖</span>
            </div>
            <p className="text-gray-600">Carregando conversa...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Assistente de IA MadenAI</h3>
            <p className="text-gray-600 max-w-md">
              Olá! Sou seu assistente especializado em arquitetura e engenharia. 
              Como posso ajudá-lo hoje?
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={copyMessage}
                copiedMessageId={copiedMessageId}
                isNewMessage={newMessageIds.has(message.id)}
              />
            ))}
            {isTyping && <AITypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={inputAreaClasses}>
        <div className="flex space-x-3">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isMobile ? "Digite sua pergunta..." : "Digite sua pergunta sobre arquitetura ou engenharia..."}
            className={`flex-1 min-h-[44px] max-h-32 resize-none ${
              isMobile 
                ? "border-border focus:border-primary focus:ring-primary" 
                : "border border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            }`}
            disabled={isTyping || !conversationId}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping || !conversationId}
            size="sm"
            className="px-3 py-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};