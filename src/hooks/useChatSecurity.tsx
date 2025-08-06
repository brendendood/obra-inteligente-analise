
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useChatSecurity = () => {
  const { user } = useAuth();

  // Log chat access for security auditing
  const logChatAccess = async (sessionId: string, accessType: 'read' | 'write' | 'delete') => {
    if (!user) return;

    try {
      await supabase
        .from('chat_access_logs')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          access_type: accessType,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Failed to log chat access:', error);
    }
  };

  // Secure chat message insertion with user_id
  const insertChatMessage = async (messageData: {
    session_id: string;
    message: string;
    response?: string;
    user_message?: string;
    ai_response?: string;
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to send chat messages');
    }

    try {
      // Log the write access
      await logChatAccess(messageData.session_id, 'write');

      // Insert message with user_id for RLS compliance
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .insert({
          ...messageData,
          user_id: user.id, // Required for RLS policy
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to insert chat message:', error);
      throw error;
    }
  };

  // Secure chat history retrieval
  const getChatHistory = async (sessionId?: string) => {
    if (!user) {
      throw new Error('User must be authenticated to view chat history');
    }

    try {
      // Log the read access
      if (sessionId) {
        await logChatAccess(sessionId, 'read');
      }

      let query = supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('user_id', user.id) // RLS will enforce this anyway, but explicit is better
        .order('created_at', { ascending: true });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get chat history:', error);
      throw error;
    }
  };

  // Secure chat message deletion
  const deleteChatMessage = async (messageId: string | number, sessionId: string) => {
    if (!user) {
      throw new Error('User must be authenticated to delete chat messages');
    }

    try {
      // Log the delete access
      await logChatAccess(sessionId, 'delete');

      // Convert messageId to number since Supabase expects numeric id
      const numericMessageId = typeof messageId === 'string' ? parseInt(messageId, 10) : messageId;
      
      if (isNaN(numericMessageId)) {
        throw new Error('Invalid message ID format');
      }

      const { error } = await supabase
        .from('n8n_chat_histories')
        .delete()
        .eq('id', numericMessageId) // Use numeric id
        .eq('user_id', user.id); // Ensure user can only delete their own messages

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete chat message:', error);
      throw error;
    }
  };

  return {
    logChatAccess,
    insertChatMessage,
    getChatHistory,
    deleteChatMessage,
    isAuthenticated: !!user
  };
};
