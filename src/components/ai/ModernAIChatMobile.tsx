import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, Copy, Check, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendDirectToN8N } from '@/utils/directN8NService';
import { AITypingIndicator } from '@/components/ai/AITypingIndicator';
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
          if (payload.new.conversation_id === conversationId && payload.new.role === 'assistant') {
            const newMessage: ChatMessage = {
              id: payload.new.id,
              type: 'assistant',
              content: payload.new.content,
              timestamp: new Date(payload.new.created_at)
            };
            
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

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping || isSending || !user?.id || !conversationId) return;

    const messageContent = inputMessage.trim();
    const messageId = crypto.randomUUID();
    setInputMessage('');
    setIsSending(true);
    setIsTyping(true);

    const userMessage: ChatMessage = {
      id: messageId,
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      await saveMessage(conversationId, messageContent, 'user');

      const conversationHistory = messages.map(msg => ({
        role: msg.type,
        content: msg.content
      }));

      await sendDirectToN8N(
        messageContent,
        user.id,
        conversationId,
        conversationHistory
      );

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: "Gravando...",
        description: "Toque novamente para parar e transcrever.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      if (data?.text) {
        setInputMessage(prev => prev + (prev ? ' ' : '') + data.text);
        toast({
          title: "Transcrição concluída",
          description: "Áudio convertido para texto.",
        });
      }
    } catch (error) {
      console.error('Erro na transcrição:', error);
      toast({
        title: "Erro na transcrição",
        description: "Não foi possível converter o áudio.",
        variant: "destructive",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Componente de mensagem inspirado na imagem
  const MessageBubble = memo(({ message }: { message: ChatMessage }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={cn(
        "flex w-full mb-3",
        isUser ? "justify-end" : "justify-start"
      )}>
        <div className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 relative group",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className={cn(
              "text-xs opacity-70"
            )}>
              {message.timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyMessage(message.content, message.id)}
                className="ml-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
              >
                {copiedMessageId === message.id ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground/60" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] min-h-[100svh] bg-white overflow-hidden">
      {/* Header com Navegação - Altura fixa */}
      <div className="flex items-center p-4 h-16 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/painel')}
          className="mr-3 h-8 w-8 p-0 hover:bg-white/20 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-lg">Lumi AI</h1>
        </div>
        
        <div className="text-right">
          <p className="text-xs opacity-90">Online</p>
        </div>
      </div>

      {/* Área de Mensagens - Altura dinâmica com scroll interno */}
      <div className="flex-1 overflow-y-auto p-4 bg-white" style={{ height: 'calc(100dvh - 64px - 120px)' }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Olá!</h2>
              <p className="text-muted-foreground text-sm">
                Como posso ajudar você hoje?
              </p>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-muted rounded-2xl px-4 py-3 max-w-[80%]">
                  <AITypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Área Redesenhada - Altura fixa */}
      <div className="p-4 bg-white border-t border-border h-[120px] flex-shrink-0">
        <div className="flex items-center space-x-3 mb-3">
          {/* Botão de Microfone */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            disabled={isSending}
            className={cn(
              "h-10 w-10 p-0 rounded-full",
              isRecording 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          {/* Input de Mensagem */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Write a Message"
              disabled={isSending || isRecording}
              className="min-h-[44px] max-h-[44px] resize-none pr-12 text-sm border-input rounded-3xl bg-muted/30 placeholder:text-muted-foreground overflow-hidden"
            />
            
            {/* Botão de Envio */}
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isSending || isRecording}
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Footer Personalizado */}
        <div className="text-center">
          <span className="text-xs text-muted-foreground">
            Lumi AI Chat V1.0.1 - Desenvolvida para Engenheiros e Arquitetos
          </span>
        </div>
      </div>
    </div>
  );
};