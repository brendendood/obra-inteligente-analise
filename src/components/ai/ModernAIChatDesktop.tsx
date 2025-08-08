import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, Copy, Check, Wifi, WifiOff, MessageSquare } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ModernAIChatDesktop = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());
  const [showContinueChat, setShowContinueChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const messagesEndRef = useRef<HTMLDivElement>(null);
const textareaRef = useRef<HTMLTextAreaElement>(null);
const optimisticAssistantContentsRef = useRef<Set<string>>(new Set());
const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Inicializar conversa e carregar mensagens
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

        // Carregar mensagens existentes
        const { data: messageData } = await supabase
          .from('ai_messages')
          .select('id, content, role, created_at')
          .eq('user_id', user.id)
          .eq('conversation_id', currentConversationId)
          .order('created_at', { ascending: true });

        if (messageData && messageData.length > 0) {
          const formattedMessages: ChatMessage[] = messageData.map((msg) => ({
            id: msg.id,
            type: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at)
          }));
          setShowContinueChat(true);
          // Não mostrar mensagens por padrão, apenas as sugestões
          // setMessages(formattedMessages);
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

  // Subscription realtime para novas mensagens da IA
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
          
          if (payload.new.conversation_id === conversationId && payload.new.role === 'assistant') {
            // Dedupe contra mensagens assistente otimistas
            if (optimisticAssistantContentsRef.current.has(payload.new.content)) {
              optimisticAssistantContentsRef.current.delete(payload.new.content);
              setIsTyping(false);
              return;
            }

            const newMessage: ChatMessage = {
              id: payload.new.id,
              type: 'assistant',
              content: payload.new.content,
              timestamp: new Date(payload.new.created_at)
            };
            
            setNewMessageIds(prev => new Set([...prev, payload.new.id]));
            
            setTimeout(() => {
              setNewMessageIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(payload.new.id);
                return newSet;
              });
            }, 300);
            
            setMessages(prev => [...prev, newMessage]);
            setIsTyping(false);
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
        // Remover o prefixo data:type;base64,
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
    setIsTyping(true);
    setConnectionStatus('connecting');

    // Se estava mostrando sugestões, mudar para o histórico
    if (!showHistory) {
      setShowHistory(true);
      // Carregar mensagens existentes se necessário
      const { data: messageData } = await supabase
        .from('ai_messages')
        .select('id, content, role, created_at')
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId)
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
    }

    // Criar mensagem do usuário
    const userMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Salvar mensagem do usuário
      await saveMessage(conversationId, messageContent, 'user');

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

      // Enviar para N8N e renderizar resposta de forma otimista
      const aiResponse = await sendDirectToN8N(
        inputMessage.trim() || '',
        user.id,
        conversationId,
        conversationHistory,
        attachments
      );

      setConnectionStatus('connected');

      if (aiResponse && aiResponse.trim()) {
        const assistantMessage: ChatMessage = {
          id: 'optimistic-' + crypto.randomUUID(),
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        optimisticAssistantContentsRef.current.add(aiResponse);
        // Salvar no Supabase em background
        saveMessage(conversationId, aiResponse, 'assistant').catch((e) => {
          console.error('Erro ao salvar resposta da IA:', e);
        });
      }

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

  const handleContinueChat = () => {
    setShowHistory(true);
    // Carregar mensagens se ainda não foram carregadas
    if (messages.length === 0 && conversationId) {
      supabase
        .from('ai_messages')
        .select('id, content, role, created_at')
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .then(({ data: messageData }) => {
          if (messageData) {
            const formattedMessages: ChatMessage[] = messageData.map((msg) => ({
              id: msg.id,
              type: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.created_at)
            }));
            setMessages(formattedMessages);
          }
        });
    }
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

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Online';
      case 'connecting':
        return 'Processando...';
      case 'disconnected':
        return 'Desconectado';
    }
  };

  // Componente MessageBubble
  const MessageBubble = memo(({ message, isNewMessage }: { 
    message: ChatMessage; 
    isNewMessage: boolean;
  }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}>
        <div className={cn(
          "flex items-start space-x-3 max-w-[80%]",
          isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
        )}>
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              isUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              {isUser ? "V" : "AI"}
            </div>
          </div>
          
          {/* Message Content */}
          <div className="flex flex-col space-y-1 min-w-0">
            <div className={cn(
              "rounded-lg px-4 py-3 shadow-sm relative group",
              isUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-foreground",
              isNewMessage && !isUser ? "animate-fade-in" : ""
            )}>
              <MessageFormatter 
                content={message.content}
                className="text-sm leading-relaxed"
              />
              
              {/* Botão de copiar - apenas para mensagens do AI */}
              {!isUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyMessage(message.content, message.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-2xl">🤖</span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="w-32 h-3 bg-muted/50 rounded-full animate-pulse" />
          <div className="w-24 h-3 bg-muted/30 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Assistente Lumi</h1>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm text-muted-foreground">{getStatusText()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {!showHistory ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground">Assistente Lumi</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Especializado em arquitetura e engenharia, pronto para ajudar com seus projetos e dúvidas técnicas.
                </p>
              </div>

              {showContinueChat && (
                <Button 
                  onClick={handleContinueChat}
                  variant="outline"
                  className="mb-6"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Continuar conversa anterior
                </Button>
              )}

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Como posso ajudar?</h2>
                <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
              </div>
            </div>
          </div>
        ) : (
          /* Chat History */
          <div className="px-6 py-4">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Nenhuma mensagem ainda</h3>
                    <p className="text-muted-foreground">Comece uma conversa usando o campo abaixo.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isNewMessage={newMessageIds.has(message.id)}
                    />
                  ))}
                  {isTyping && (
                    <div className="flex justify-start mb-6">
                      <div className="flex items-start space-x-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
                          AI
                        </div>
                        <div className="bg-muted rounded-lg px-4 py-3">
                          <AITypingIndicator />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-end space-x-3">
              {/* File Uploader */}
              <FileUploader 
                onFileSelected={setSelectedFile}
                disabled={isSending}
              />

              {/* Voice Recorder */}
              <VoiceRecorder 
                onAudioRecorded={handleAudioRecorded}
                disabled={isSending}
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
                  className="min-h-[48px] max-h-32 resize-none pr-12 py-3"
                />
                <Button
                  onClick={sendMessage}
                  disabled={(!inputMessage.trim() && !selectedFile) || isSending}
                  size="default"
                  className="absolute right-2 bottom-2 h-12 w-12 p-0 hover:scale-105 transition-transform aspect-square rounded-lg"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};