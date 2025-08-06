import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, Copy, Check, Wifi, WifiOff, Plus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendDirectToN8N } from '@/utils/directN8NService';
import { AITypingIndicator } from '@/components/ai/AITypingIndicator';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
        return <Wifi className="h-3 w-3 text-green-500" />;
      case 'connecting':
        return <Wifi className="h-3 w-3 text-yellow-500 animate-pulse" />;
      case 'disconnected':
        return <WifiOff className="h-3 w-3 text-red-500" />;
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

  // Componente MessageBubble redesenhado para mobile
  const MessageBubble = memo(({ message, isNewMessage }: { 
    message: ChatMessage; 
    isNewMessage: boolean;
  }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}>
        <div className={cn(
          "flex items-end space-x-2 max-w-[85%]",
          isUser ? "flex-row-reverse space-x-reverse" : "flex-row",
          isMobile ? "max-w-[90%]" : "max-w-[85%]"
        )}>
          {/* Avatar - melhorado para mobile */}
          <div className={cn(
            "flex-shrink-0 mb-1",
            isMobile ? "w-8 h-8" : "w-10 h-10"
          )}>
            <div className={cn(
              "rounded-full flex items-center justify-center font-semibold text-white shadow-sm",
              isMobile ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm",
              isUser 
                ? "bg-gradient-to-br from-primary to-primary/90" 
                : "bg-gradient-to-br from-purple-500 to-blue-500"
            )}>
              {isUser ? "Você" : "AI"}
            </div>
          </div>
          
          {/* Message Content - redesenhado */}
          <div className="flex flex-col space-y-1 min-w-0">
            <div className={cn(
              "rounded-2xl px-4 py-3 shadow-sm relative group",
              isMobile ? "rounded-xl px-3 py-2.5" : "",
              isUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted/80 text-foreground border border-border/50"
            )}>
              <div className={cn(
                "whitespace-pre-wrap break-words leading-relaxed",
                isMobile ? "text-base" : "text-sm",
                isNewMessage && !isUser ? "animate-fade-in" : ""
              )}>
                {message.content}
              </div>
              
              {/* Botão de copiar - apenas para mensagens do AI */}
              {!isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyMessage(message.content, message.id)}
                  className={cn(
                    "absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border border-border/30",
                    isMobile ? "h-7 w-7 p-0" : "h-6 w-6 p-0"
                  )}
                >
                  {copiedMessageId === message.id ? (
                    <Check className={cn(isMobile ? "w-3.5 h-3.5" : "w-3 h-3", "text-green-600")} />
                  ) : (
                    <Copy className={isMobile ? "w-3.5 h-3.5" : "w-3 h-3"} />
                  )}
                </Button>
              )}
            </div>
            
            {/* Timestamp */}
            <span className={cn(
              "text-xs text-muted-foreground px-1",
              isUser ? "text-right" : "text-left"
            )}>
              {message.timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    );
  });

  // Layout otimizado para mobile
  const containerClasses = isMobile 
    ? "flex flex-col h-full bg-background"
    : "flex flex-col h-full max-h-[calc(100vh-2rem)] bg-white rounded-lg border shadow-sm mx-6 mt-4 mb-4";

  if (isMobile) {
    return (
      <div className={containerClasses}>
        {/* Header Mobile - Redesign completo */}
        <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-10 min-h-[70px]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
              <span className="text-lg font-bold text-primary-foreground">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MadenAI</h1>
              <div className="flex items-center space-x-1.5">
                {getStatusIcon()}
                <span className={cn("text-xs font-medium", getStatusColor())}>
                  {connectionStatus === 'connected' ? 'Online' : 
                   connectionStatus === 'connecting' ? 'Conectando...' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Area Mobile */}
        <div className="flex-1 overflow-y-auto px-4 py-2 bg-background">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center animate-pulse">
                  <span className="text-3xl">🤖</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background animate-bounce" />
              </div>
              <div className="space-y-2">
                <div className="w-32 h-3 bg-muted/50 rounded-full animate-pulse" />
                <div className="w-24 h-3 bg-muted/30 rounded-full animate-pulse" />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">Olá! 👋</h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                  Sou seu assistente especializado em arquitetura e engenharia. Como posso ajudar?
                </p>
              </div>

              {/* Sugestões rápidas */}
              <div className="w-full max-w-sm space-y-3 mt-8">
                <p className="text-sm font-semibold text-muted-foreground text-left">Sugestões:</p>
                <div className="space-y-2">
                  {[
                    { icon: "🏗️", text: "Como calcular estruturas?", prompt: "Como calcular a estrutura de uma laje?" },
                    { icon: "🧱", text: "Materiais para fundação", prompt: "Quais materiais são melhores para fundação?" },
                    { icon: "📅", text: "Cronograma de obra", prompt: "Como fazer um cronograma de obra?" },
                    { icon: "💰", text: "Estimativa de custos", prompt: "Como estimar custos de construção?" }
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(suggestion.prompt)}
                      className="w-full p-4 text-left bg-muted/30 hover:bg-muted/50 rounded-xl border border-border/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{suggestion.icon}</span>
                        <span className="text-sm font-medium text-foreground">{suggestion.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isNewMessage={newMessageIds.has(message.id)}
                />
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-center space-x-2 max-w-[90%]">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">AI</span>
                    </div>
                    <div className="bg-muted/80 rounded-xl px-4 py-3 border border-border/50">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.1s]" />
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">Pensando...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area Mobile - Redesign completo */}
        <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4 sticky bottom-0">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="resize-none border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200 min-h-[56px] max-h-40 text-base px-4 py-3 rounded-2xl placeholder:text-muted-foreground/70 pr-12"
                disabled={isTyping || !conversationId}
              />
              {inputMessage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputMessage('')}
                  className="absolute right-2 top-2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4 rotate-45" />
                </Button>
              )}
            </div>
            
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping || !conversationId}
              className="h-[56px] w-[56px] rounded-2xl bg-primary hover:bg-primary/90 p-0 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {isTyping ? (
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                </div>
              ) : (
                <Send className="w-6 h-6 text-primary-foreground" />
              )}
            </Button>
          </div>
          
          {/* Status indicator mobile */}
          {!conversationId && (
            <div className="flex items-center justify-center mt-3">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" />
                <span>Inicializando conversa...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop version (mantém o layout original)
  return (
    <div className={containerClasses}>
      {/* Header Desktop */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
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
            {connectionStatus === 'connected' ? 'Conectado' : 
             connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
          </span>
        </div>
      </div>

      {/* Messages Area Desktop */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                isNewMessage={newMessageIds.has(message.id)}
              />
            ))}
            {isTyping && <AITypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area Desktop */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex space-x-3">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre arquitetura ou engenharia..."
            className="flex-1 resize-none min-h-[60px] max-h-32 border border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            disabled={isTyping || !conversationId}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping || !conversationId}
            className="h-auto px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};