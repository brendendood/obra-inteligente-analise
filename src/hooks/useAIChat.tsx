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

    // Timeout para evitar loading infinito
    const timeoutId = setTimeout(() => {
      console.error('⏰ Request timeout - forcing completion');
      setIsLoading(false);
      setConnectionStatus('error');
      
      const timeoutMessage: ChatMessage = {
        id: `timeout-${Date.now()}`,
        content: '⏰ **Tempo de resposta esgotado**\n\nO sistema demorou mais que o esperado para responder. Tente novamente com uma pergunta mais específica.\n\n💡 **Sugestão**: "Preciso do orçamento para uma casa de 100m²" ou "Como fazer fundação em terreno inclinado?"',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev.slice(0, -1), 
        { ...userMessage, id: `user-${Date.now()}` },
        timeoutMessage
      ]);
    }, 15000); // 15 segundos timeout

    let retryCount = 0;
    const maxRetries = 2;

    try {
      while (retryCount <= maxRetries) {
        try {
          console.log(`🚀 Sending message (attempt ${retryCount + 1}):`, content.substring(0, 50));
          
          const { data, error } = await supabase.functions.invoke('chat-assistant', {
            body: {
              message: content,
              conversationId: currentConversationId,
              projectId: projectId || currentProject?.id
            }
          });

          if (error) {
            console.error('❌ Supabase function error:', error);
            throw error;
          }

          // Validar se a resposta é válida
          if (!data || !data.response || typeof data.response !== 'string') {
            console.error('❌ Invalid response data:', data);
            throw new Error('Resposta inválida do servidor');
          }

          const assistantMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            content: data.response.trim(),
            role: 'assistant',
            timestamp: new Date(),
            conversationId: data.conversationId
          };

          console.log('✅ useAIChat: Assistant message created successfully');

          // Update conversation ID if it was created
          if (data.conversationId && !currentConversationId) {
            setCurrentConversationId(data.conversationId);
          }

          // Clear timeout - sucesso
          clearTimeout(timeoutId);

          setMessages(prev => [...prev.slice(0, -1), 
            { ...userMessage, id: `user-${Date.now()}`, conversationId: data.conversationId },
            assistantMessage
          ]);

          setConnectionStatus('connected');
          setIsLoading(false);
          return; // Sucesso, sai da função
          
        } catch (error) {
          console.error(`❌ Error sending message (attempt ${retryCount + 1}):`, error);
          retryCount++;
          
          if (retryCount <= maxRetries) {
            // Tenta novamente em modo fallback
            setConnectionStatus('fallback');
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
          } else {
            // Falha final
            break;
          }
        }
      }

      // Se chegou aqui, todas as tentativas falharam
      clearTimeout(timeoutId);
      setConnectionStatus('error');
      setIsLoading(false);
      
      // Remove the temporary user message on error
      setMessages(prev => prev.slice(0, -1));
      
      // Add enhanced error message with fallback
      const fallbackMessage: ChatMessage = {
        id: `fallback-${Date.now()}`,
        content: `**🔧 MadenAI - Modo Offline Ativado**

Olá! O sistema principal está temporariamente indisponível, mas posso ajudar com informações básicas:

**📊 ORÇAMENTO RESIDENCIAL (2024):**
• Padrão Popular: R$ 1.200-1.800/m²
• Padrão Médio: R$ 2.500-3.500/m²
• Alto Padrão: R$ 3.500-5.000/m²

**⏱️ CRONOGRAMA BÁSICO:**
• Fundações: 15-30 dias
• Estrutura: 45-90 dias
• Acabamentos: 45-60 dias

**🏗️ MATERIAIS PRINCIPAIS:**
• Concreto: fck 25-30 MPa (NBR 6118)
• Blocos: 14x19x29cm cerâmico
• Aço CA-50: conforme projeto

**💡 Para informações detalhadas, tente novamente em alguns minutos ou reformule sua pergunta de forma mais específica.**

Como posso ajudá-lo com esses dados básicos?`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, 
        { ...userMessage, id: `user-${Date.now()}` },
        fallbackMessage
      ]);

    } catch (finalError) {
      // Erro catastrófico
      console.error('❌ Final error in sendMessage:', finalError);
      clearTimeout(timeoutId);
      setIsLoading(false);
      setConnectionStatus('error');
    }
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