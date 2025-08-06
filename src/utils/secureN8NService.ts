
import { supabase } from '@/integrations/supabase/client';
import { validateUserInput, sanitizeFileName } from './securityValidation';

interface SecureN8NRequest {
  message: string;
  sessionId: string;
  projectId?: string;
  context?: string;
}

interface N8NResponse {
  response: string;
  session_id: string;
  conversation_id?: string;
}

export class SecureN8NService {
  private static readonly MAX_MESSAGE_LENGTH = 2000;
  private static readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private static readonly RATE_LIMIT_MAX_REQUESTS = 10;
  
  private static rateLimitStore = new Map<string, { count: number; timestamp: number }>();

  // Rate limiting check
  private static checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimitStore.get(userId);

    if (!userLimit || now - userLimit.timestamp > this.RATE_LIMIT_WINDOW) {
      this.rateLimitStore.set(userId, { count: 1, timestamp: now });
      return true;
    }

    if (userLimit.count >= this.RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  // Secure message sending with authentication and validation
  static async sendSecureMessage(request: SecureN8NRequest): Promise<N8NResponse> {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required for AI chat');
    }

    // Rate limiting
    if (!this.checkRateLimit(user.id)) {
      throw new Error('Rate limit exceeded. Please wait before sending another message.');
    }

    // Input validation and sanitization
    const sanitizedMessage = validateUserInput(request.message, this.MAX_MESSAGE_LENGTH);
    if (!sanitizedMessage || sanitizedMessage.length === 0) {
      throw new Error('Invalid message content');
    }

    const sanitizedSessionId = validateUserInput(request.sessionId, 100);
    if (!sanitizedSessionId) {
      throw new Error('Invalid session ID');
    }

    try {
      console.log('🔒 Sending secure N8N request:', {
        userId: user.id,
        sessionId: sanitizedSessionId,
        messageLength: sanitizedMessage.length,
        timestamp: new Date().toISOString()
      });

      // Call the N8N webhook with security headers
      const response = await fetch('/api/n8n/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id,
          'X-Session-ID': sanitizedSessionId,
        },
        body: JSON.stringify({
          message: sanitizedMessage,
          session_id: sanitizedSessionId,
          project_id: request.projectId,
          context: request.context,
          user_id: user.id // Include for backend validation
        })
      });

      if (!response.ok) {
        throw new Error(`N8N service error: ${response.status}`);
      }

      const result = await response.json();

      // Store the conversation in secure chat history
      await supabase
        .from('n8n_chat_histories')
        .insert({
          session_id: sanitizedSessionId,
          user_id: user.id, // Required for RLS
          user_message: sanitizedMessage,
          ai_response: result.response,
          message: sanitizedMessage,
          response: result.response,
          created_at: new Date().toISOString()
        });

      return {
        response: result.response,
        session_id: sanitizedSessionId,
        conversation_id: result.conversation_id
      };

    } catch (error) {
      console.error('🚨 Secure N8N service error:', error);
      
      // Log security incident
      await supabase
        .from('chat_access_logs')
        .insert({
          user_id: user.id,
          session_id: sanitizedSessionId,
          access_type: 'write',
          user_agent: navigator.userAgent,
          // Add error details for security monitoring
        });

      throw error;
    }
  }

  // Secure chat history retrieval
  static async getSecureChatHistory(sessionId: string): Promise<any[]> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required for chat history');
    }

    const sanitizedSessionId = validateUserInput(sessionId, 100);
    if (!sanitizedSessionId) {
      throw new Error('Invalid session ID');
    }

    try {
      // Log access for audit trail
      await supabase
        .from('chat_access_logs')
        .insert({
          user_id: user.id,
          session_id: sanitizedSessionId,
          access_type: 'read',
          user_agent: navigator.userAgent
        });

      // Retrieve chat history (RLS will automatically filter by user_id)
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', sanitizedSessionId)
        .eq('user_id', user.id) // Explicit filter for clarity
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('🚨 Error retrieving secure chat history:', error);
      throw error;
    }
  }
}
