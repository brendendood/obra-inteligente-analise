import { supabase } from '@/integrations/supabase/client';

interface DirectN8NPayload {
  message: string;
  user_id: string;
  conversation_id: string;
  timestamp: string;
  user_data: {
    id: string;
    email?: string;
    plan: string;
    location?: string;
    specialization?: string;
  };
  conversation_history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context: {
    source: string;
    chat_type: string;
  };
  attachments?: Array<{
    type: 'image' | 'document' | 'audio';
    filename: string;
    content: string; // base64
    mimeType: string;
  }>;
}

interface N8NResponse {
  response: string;
}

const N8N_WEBHOOK_URL = 'https://madeai-br.app.n8n.cloud/webhook/aa02ca52-8850-452e-9e72-4f79966aa544';

export const sendDirectToN8N = async (
  message: string,
  userId: string,
  conversationId: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  attachments?: Array<{ type: 'image' | 'document' | 'audio'; filename: string; content: string; mimeType: string }> 
): Promise<string> => {
  try {
    // Buscar dados do usuário
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('full_name, city, state, cargo')
      .eq('user_id', userId)
      .single();

    const { data: userSubscription } = await supabase
      .from('user_subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .single();

    const { data: authUser } = await supabase.auth.getUser();

    // Preparar payload
    const payload: DirectN8NPayload = {
      message,
      user_id: userId,
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
      user_data: {
        id: userId,
        email: authUser.user?.email,
        plan: userSubscription?.plan || 'free',
        location: userProfile ? `${userProfile.city || ''}, ${userProfile.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') : undefined,
        specialization: userProfile?.cargo || undefined,
      },
      conversation_history: conversationHistory.slice(-10), // Últimas 10 mensagens para contexto
      context: {
        source: 'general_chat',
        chat_type: 'tira_duvidas'
      },
      ...(attachments && attachments.length > 0 && { attachments })
    };

    console.log('Enviando para N8N:', payload);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: N8NResponse = await response.json();
    return result.response || 'Desculpe, ocorreu um erro na resposta.';

  } catch (error) {
    console.error('Erro ao enviar para N8N:', error);
    throw new Error('Erro de conexão com o assistente. Tente novamente.');
  }
};