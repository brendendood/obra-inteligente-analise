
import { useState, useEffect } from 'react';
import { SecureN8NService } from '@/utils/secureN8NService';
import { useChatSecurity } from './useChatSecurity';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useSecureChat = (sessionId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useChatSecurity();
  const { user } = useAuth();
  const { toast } = useToast();

  // Load chat history on component mount
  useEffect(() => {
    if (isAuthenticated && sessionId) {
      loadChatHistory();
    }
  }, [isAuthenticated, sessionId]);

  const loadChatHistory = async () => {
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }

    try {
      setLoading(true);
      const history = await SecureN8NService.getSecureChatHistory(sessionId);
      setMessages(history);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat history';
      setError(errorMessage);
      
      toast({
        title: "🔒 Erro de Segurança",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, projectId?: string, context?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "🔒 Autenticação Necessária",
        description: "Você precisa estar logado para usar o chat.",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Mensagem Inválida",
        description: "Por favor, digite uma mensagem válida.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await SecureN8NService.sendSecureMessage({
        message: message.trim(),
        sessionId,
        projectId,
        context
      });

      // Reload chat history to get the updated conversation
      await loadChatHistory();

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      
      // Show specific error messages for rate limiting
      if (errorMessage.includes('Rate limit')) {
        toast({
          title: "🚦 Limite de Mensagens",
          description: "Você enviou muitas mensagens. Aguarde um momento antes de tentar novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "🚨 Erro no Chat",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    loadChatHistory,
    isAuthenticated
  };
};
