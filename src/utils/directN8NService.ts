import { supabase } from '@/integrations/supabase/client';

// URL completa do webhook N8N para o chat geral (fornecida pelo cliente)
const N8N_TARGET_WEBHOOK = 'https://madeai-br.app.n8n.cloud/webhook-test/aa02ca52-8850-452e-9e72-4f79966aa544';

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
      .maybeSingle();

    const { data: userSubscription } = await supabase
      .from('user_subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .maybeSingle();

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
        plan: (userSubscription as any)?.plan || 'free',
        location: userProfile ? `${(userProfile as any).city || ''}, ${(userProfile as any).state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') : undefined,
        specialization: (userProfile as any)?.cargo || undefined,
      },
      conversation_history: conversationHistory.slice(-10),
      context: {
        source: 'general_chat',
        chat_type: 'tira_duvidas'
      },
      ...(attachments && attachments.length > 0 && { attachments })
    };

    // Enviar via edge function segura (general agent)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    console.info('[N8N] encaminhando via proxy', { conversationId, ts: new Date().toISOString() });
    const invokePromise = supabase.functions.invoke('secure-n8n-proxy', {
      body: { agentType: 'general', targetWebhook: N8N_TARGET_WEBHOOK, payload },
    });

    const result = await Promise.race([
      invokePromise,
      new Promise((_, reject) => controller.signal.addEventListener('abort', () => reject(new Error('timeout')))),
    ]) as { data: any; error: any };

    clearTimeout(timeout);

    if ((result as any)?.error) throw (result as any).error;

    const data = (result as any)?.data || {};
    const extracted =
      (typeof data?.response === 'string' && data.response) ||
      (typeof data?.raw?.response === 'string' && data.raw.response) ||
      (typeof data?.raw?.text === 'string' && data.raw.text) ||
      '';

    if (!extracted) {
      console.info('[N8N] resposta vazia, aguardando realtime', { conversationId });
      return '';
    }

    return extracted;

  } catch (error: any) {
    if (error?.message === 'timeout') {
      throw new Error('Tempo esgotado ao conectar ao assistente. Tente novamente.');
    }
    console.error('Erro ao enviar para N8N (proxy):', error);
    throw new Error('Erro de conexão com o assistente. Tente novamente.');
  }
};