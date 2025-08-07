import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, Copy, Check, Wifi, WifiOff, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendDirectToN8N } from '@/utils/directN8NService';
import { AITypingIndicator } from '@/components/ai/AITypingIndicator';
import { MessageFormatter } from '@/components/ai/MessageFormatter';
import { ChatSuggestions } from '@/components/ai/ChatSuggestions';
import { VoiceRecorder } from '@/components/ai/VoiceRecorder';
import { FileUploader } from '@/components/ai/FileUploader';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ModernAIChatMobile = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
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

  // Subscription realtime para novas mensagens (APENAS DA IA)
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
          
          // APENAS processar mensagens da IA para evitar duplicação
          if (payload.new.conversation_id === conversationId && payload.new.role === 'assistant') {
            const newMessage: ChatMessage = {
              id: payload.new.id,
              type: 'assistant',
              content: payload.new.content,
              timestamp: new Date(payload.new.created_at)
            };
            
            // Marcar mensagem como nova para animação
            setNewMessageIds(prev => new Set([...prev, payload.new.id]));
            
            // Remover o ID após a animação terminar (300ms)
            setTimeout(() => {
              setNewMessageIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(payload.new.id);
                return newSet;
              });
            }, 300);
            
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

  // Converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && !selectedFile) || isTyping || isSending || !user?.id || !conversationId) return;

    const messageContent = inputMessage.trim() || (selectedFile ? `[Arquivo: ${selectedFile.name}]` : '');
    const messageId = crypto.randomUUID();
    setInputMessage('');
    setIsSending(true);
    
    // SEMPRE ativar a animação de digitação quando enviar mensagem
    setIsTyping(true);
    setConnectionStatus('connecting');

    // Criar mensagem do usuário e adicionar APENAS localmente (não duplicar via subscription)
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

      // Preparar anexos se houver
      let attachments = undefined;
      if (selectedFile) {
        const base64Content = await fileToBase64(selectedFile);
        attachments = [{
          type: selectedFile.type.startsWith('image/') ? 'image' as const : 
                selectedFile.type === 'application/pdf' ? 'document' as const : 'document' as const,
          filename: selectedFile.name,
          content: base64Content,
          mimeType: selectedFile.type
        }];
        setSelectedFile(null); // Limpar arquivo após envio
      }

      // Preparar histórico para contexto
      const conversationHistory = messages.map(msg => ({
        role: msg.type,
        content: msg.content
      }));

      // Enviar para N8N (resposta virá via realtime)
      console.log('🤖 Enviando para N8N...');
      await sendDirectToN8N(
        inputMessage.trim() || '',
        user.id,
        conversationId,
        conversationHistory,
        attachments
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
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
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

  const handleSuggestionClick = (prompt: string) => {
    setInputMessage(prompt);
    textareaRef.current?.focus();
  };

  const handleAudioRecorded = async (audioBlob: Blob) => {
    setIsTyping(true);
    toast({
      title: "Transcrevendo áudio...",
      description: "Convertendo sua fala em texto",
    });

    try {
      // Convert Blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          
          // Call voice-to-text edge function
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });

          if (error) {
            throw new Error(error.message || 'Erro na transcrição');
          }

          if (data.error) {
            throw new Error(data.error);
          }

          const transcribedText = data.text?.trim();
          
          if (transcribedText) {
            setInputMessage(transcribedText);
            toast({
              title: "Transcrição concluída",
              description: "Você pode editar o texto antes de enviar",
            });
          } else {
            throw new Error('Nenhum texto foi detectado no áudio');
          }
        } catch (error) {
          console.error('Erro na transcrição:', error);
          toast({
            title: "Erro na transcrição",
            description: error instanceof Error ? error.message : 'Não foi possível transcrever o áudio',
            variant: "destructive",
          });
        } finally {
          setIsTyping(false);
        }
      };

      reader.onerror = () => {
        setIsTyping(false);
        toast({
          title: "Erro no áudio",
          description: "Não foi possível processar o arquivo de áudio",
          variant: "destructive",
        });
      };
    } catch (error) {
      setIsTyping(false);
      console.error('Erro ao processar áudio:', error);
      toast({
        title: "Erro no áudio",
        description: "Não foi possível processar o arquivo de áudio",
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

  // Componente MessageBubble com suporte a formatação
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
          "flex items-end space-x-2 max-w-[90%]",
          isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
        )}>
          {/* Avatar */}
          <div className="flex-shrink-0 mb-1 w-8 h-8">
            <div className={cn(
              "rounded-full flex items-center justify-center font-semibold text-white shadow-sm w-8 h-8 text-xs",
              isUser 
                ? "bg-gradient-to-br from-primary to-primary/90" 
                : "bg-gradient-to-br from-purple-500 to-blue-500"
            )}>
              {isUser ? "Você" : "AI"}
            </div>
          </div>
          
          {/* Message Content */}
          <div className="flex flex-col space-y-1 min-w-0">
            <div className={cn(
              "rounded-xl px-3 py-2.5 shadow-sm relative group",
              isUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted/80 text-foreground border border-border/50",
              isNewMessage && !isUser ? "animate-fade-in" : ""
            )}>
              <MessageFormatter 
                content={message.content}
                className="text-base"
              />
              
              {/* Botão de copiar - apenas para mensagens do AI */}
              {!isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyMessage(message.content, message.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border border-border/30 h-7 w-7 p-0"
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Mobile */}
      <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-10 min-h-[70px]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
            <span className="text-lg font-bold text-primary-foreground">AI</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Assistente Lumi</h1>
            <div className="flex items-center space-x-1.5">
              {getStatusIcon()}
              <span className={cn("text-xs font-medium", getStatusColor())}>
                {connectionStatus === 'connected' ? 'Online' : 
                 connectionStatus === 'connecting' ? 'Conectando...' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 p-0"
          onClick={() => navigate('/painel')}
        >
          <ArrowLeft className="w-5 h-5" />
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

            <div className="w-full max-w-sm space-y-3 mt-8">
              <p className="text-sm font-semibold text-muted-foreground text-left">Sugestões:</p>
              <ChatSuggestions onSuggestionClick={handleSuggestionClick} isMobile={true} />
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
                <div className="flex items-end space-x-2 max-w-[85%]">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">AI</span>
                  </div>
                  <div className="bg-muted/80 rounded-xl px-3 py-2.5 border border-border/50">
                    <AITypingIndicator />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area Mobile */}
      <div className="p-4 bg-background border-t border-border">
        <div className="flex items-end space-x-2">
          {/* File Uploader */}
          <FileUploader 
            onFileSelected={setSelectedFile}
            disabled={isSending}
            isMobile={true}
          />

          {/* Voice Recorder */}
          <VoiceRecorder 
            onAudioRecorded={handleAudioRecorded}
            disabled={isSending}
            isMobile={true}
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isSending}
              className="min-h-[44px] max-h-32 resize-none pr-12 py-3 text-base rounded-xl"
            />
            <Button
              onClick={sendMessage}
              disabled={(!inputMessage.trim() && !selectedFile) || isSending}
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};