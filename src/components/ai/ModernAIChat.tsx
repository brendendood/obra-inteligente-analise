import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, Check, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendDirectToN8N } from '@/utils/directN8NService';
import { AITypingIndicator } from '@/components/ai/AITypingIndicator';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { useAuth } from '@/hooks/useAuth';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Inicializar conversa única e carregar histórico
  useEffect(() => {
    if (!user?.id) return;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Buscar conversa existente (chat geral, sem project_id)
        let { data: existingConversation } = await supabase
          .from('ai_conversations')
          .select('id')
          .eq('user_id', user.id)
          .is('project_id', null)
          .eq('status', 'active')
          .single();

        let currentConversationId: string;

        if (existingConversation) {
          // Usar conversa existente
          currentConversationId = existingConversation.id;
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

        // Carregar histórico de mensagens
        const { data: messageHistory } = await supabase
          .from('ai_messages')
          .select('content, role, created_at')
          .eq('conversation_id', currentConversationId)
          .order('created_at', { ascending: true });

        if (messageHistory && messageHistory.length > 0) {
          const formattedMessages: ChatMessage[] = messageHistory.map((msg, index) => ({
            id: `msg-${index}`,
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
          description: "Erro ao carregar conversa. Tente recarregar a página.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [user?.id, toast]);

  const saveMessage = async (conversationId: string, content: string, role: 'user' | 'assistant') => {
    try {
      await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
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
    setInputMessage('');
    setIsTyping(true);
    setConnectionStatus('connecting');

    // Adicionar mensagem do usuário
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Salvar mensagem do usuário
      await saveMessage(conversationId, messageContent, 'user');

      // Preparar histórico para contexto
      const conversationHistory = messages.map(msg => ({
        role: msg.type,
        content: msg.content
      }));

      // Enviar direto para N8N
      const response = await sendDirectToN8N(
        messageContent,
        user.id,
        conversationId,
        conversationHistory
      );

      setConnectionStatus('connected');

      // Adicionar resposta da IA
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Salvar resposta da IA
      await saveMessage(conversationId, response, 'assistant');

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setConnectionStatus('disconnected');
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'Desculpe, estou com dificuldades para responder no momento. Tente novamente em alguns instantes.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Erro de conexão",
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

  const MessageBubble = ({ message, onCopy, copiedMessageId }: { 
    message: ChatMessage; 
    onCopy: (content: string, messageId: string) => void;
    copiedMessageId: string | null;
  }) => (
    <div className={`flex justify-start`}>
      <div className="flex items-start space-x-3 max-w-[85%] sm:max-w-[70%]">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-sm text-white">{message.type === 'user' ? '👤' : '🤖'}</span>
        </div>
        
        <div className={`rounded-2xl px-4 py-3 relative group ${
          message.type === 'user'
            ? 'bg-blue-600 text-white ml-auto'
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
              onClick={() => onCopy(message.content, message.id)}
            >
              {copiedMessageId === message.id ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-gray-500" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-2rem)] bg-white rounded-lg border shadow-sm mx-6 mt-4 mb-4">
      {/* Header */}
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
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Messages Area */}
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
                onCopy={copyMessage}
                copiedMessageId={copiedMessageId}
              />
            ))}
            {isTyping && <AITypingIndicator />}
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
            placeholder="Digite sua pergunta sobre arquitetura ou engenharia..."
            className="flex-1 min-h-[44px] max-h-32 resize-none border border-gray-200 focus:border-purple-500 focus:ring-purple-500"
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