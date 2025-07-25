import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  conversationId?: string;
}

interface UseAIChatProps {
  projectId?: string;
  conversationId?: string;
}

export const useAIChat = ({ projectId, conversationId }: UseAIChatProps = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'fallback' | 'error'>('connected');
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  
  const { user } = useAuth();
  const { currentProject } = useProject();

  const loadConversationHistory = useCallback(async (convId: string) => {
    if (!convId) return;

    try {
      const { data: messagesData, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages: ChatMessage[] = messagesData.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant',
        timestamp: new Date(msg.created_at),
        conversationId: msg.conversation_id
      }));

      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  }, []);

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setConnectionStatus('connected');

    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const { data, error } = await supabase.functions.invoke('chat-assistant', {
          body: {
            message: content,
            conversationId: currentConversationId,
            projectId: projectId || currentProject?.id
          }
        });

        if (error) throw error;

        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
          conversationId: data.conversationId
        };

        // Update conversation ID if it was created
        if (data.conversationId && !currentConversationId) {
          setCurrentConversationId(data.conversationId);
        }

        setMessages(prev => [...prev.slice(0, -1), 
          { ...userMessage, id: `user-${Date.now()}`, conversationId: data.conversationId },
          assistantMessage
        ]);

        setConnectionStatus('connected');
        return; // Sucesso, sai da função
        
      } catch (error) {
        console.error(`Error sending message (attempt ${retryCount + 1}):`, error);
        retryCount++;
        
        if (retryCount <= maxRetries) {
          // Tenta novamente em modo fallback
          setConnectionStatus('fallback');
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        } else {
          // Falha final
          setConnectionStatus('error');
          
          // Remove the temporary user message on error
          setMessages(prev => prev.slice(0, -1));
          
          // Add enhanced error message
          const errorMessage: ChatMessage = {
            id: `error-${Date.now()}`,
            content: '🔧 **Sistema Temporariamente Indisponível**\n\nNosso assistente especializado está passando por manutenção. Tente novamente em alguns instantes ou reformule sua pergunta.\n\n💡 **Dica**: Para consultas urgentes, você pode acessar as seções de Orçamento e Cronograma do seu projeto.',
            role: 'assistant',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, errorMessage]);
        }
      }
    }
    
    setIsLoading(false);
  }, [user, currentConversationId, projectId, currentProject?.id]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(undefined);
  }, []);

  const rateMessage = useCallback(async (messageId: string, rating: number) => {
    try {
      await supabase
        .from('ai_messages')
        .update({ rating })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error rating message:', error);
    }
  }, []);

  return {
    messages,
    isLoading,
    connectionStatus,
    conversationId: currentConversationId,
    sendMessage,
    clearConversation,
    loadConversationHistory,
    rateMessage
  };
};