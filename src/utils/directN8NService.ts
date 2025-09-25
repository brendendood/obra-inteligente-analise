import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Webhooks primário e secundário do N8N (proxy-only)
const PRIMARY_WEBHOOK = 'https://madeai-br.app.n8n.cloud/webhook/aa02ca52-8850-452e-9e72-4f79966aa544';
const SECONDARY_WEBHOOK = 'https://madeai-br.app.n8n.cloud/webhook-test/aa02ca52-8850-452e-9e72-4f79966aa544';

console.info(`READY | proxy-only active | primary=${PRIMARY_WEBHOOK} | secondary=${SECONDARY_WEBHOOK}`);

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
    const traceId = uuidv4();
    const ts = new Date().toISOString();

    // Payload mínimo solicitado
    const minimalPayload = {
      message,
      chatId: conversationId,
      userId,
      timestamp: ts,
      traceId,
      ...(attachments && attachments.length > 0 ? { attachments } : {}),
    };

    // Logs antes do envio
    console.info('[Webhook] Pre-send', {
      ts,
      traceId,
      chatId: conversationId,
      userId,
      preview: message.slice(0, 200),
      url: PRIMARY_WEBHOOK,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    // Compatibilidade com payload antigo (inclui email e campos legados)
    const { data: authUser } = await supabase.auth.getUser().catch(() => ({ data: { user: undefined } as any }));

    const legacyPayload: DirectN8NPayload = {
      message,
      user_id: userId,
      conversation_id: conversationId,
      timestamp: ts,
      user_data: {
        id: userId,
        email: authUser?.user?.email,
        plan: 'basic',
      },
      conversation_history: conversationHistory.slice(-10),
      context: { source: 'general_chat', chat_type: 'tira_duvidas' },
      ...(attachments && attachments.length > 0 ? { attachments } : {}),
    };

    const fullPayload = { ...legacyPayload, ...minimalPayload };

    // Proxy-only: desabilitado envio direto do browser. Sempre usar edge function segura.
    console.info('[Webhook] Proxy-only mode ativo - usando secure-n8n-proxy');
    
    // Definir função de invocação do proxy com PRIMARY/SECONDARY e payload completo
    const tryInvoke = async () =>
      supabase.functions.invoke('secure-n8n-proxy', {
        body: { primaryWebhook: PRIMARY_WEBHOOK, secondaryWebhook: SECONDARY_WEBHOOK, payload: fullPayload },
      });


    let attempt = 0;
    let lastError: any = null;
    let result: { data: any; error: any } | null = null;

    const backoffs = [500, 1500];

    while (attempt < 2) {
      try {
        const invokePromise = tryInvoke();
        result = (await Promise.race([
          invokePromise,
          new Promise((_, reject) => controller.signal.addEventListener('abort', () => reject(new Error('timeout')))),
        ])) as { data: any; error: any };

        if (result?.error) throw result.error;

        const data = result?.data || {};
        const status = typeof data?.status === 'number' ? data.status : 200;

        if (status >= 400) {
          throw new Error(`n8n_status_${status}: ${String((data?.raw && (data.raw.error || data.raw.message || data.raw)) || '')}`.slice(0, 500));
        }

        console.info(`Webhook delivery: OK | status=${status} | traceId=${traceId} | ts=${ts}`);

        const extracted =
          (typeof data?.response === 'string' && data.response) ||
          (typeof data?.raw?.response === 'string' && data.raw.response) ||
          (typeof data?.raw?.text === 'string' && data.raw.text) ||
          '';

        clearTimeout(timeout);
        return extracted;
      } catch (err: any) {
        lastError = err;
        attempt++;
        if (attempt >= 2) break;
        const wait = backoffs[attempt - 1] || 1500;
        await new Promise((res) => setTimeout(res, wait));
      }
    }

    clearTimeout(timeout);
    const reason = lastError?.message || 'unknown_error';
    console.error(`Webhook delivery: FAIL | status=? | reason=${reason} | traceId=${traceId} | ts=${ts}`);
    throw lastError || new Error('Falha ao enviar para o webhook');

  } catch (error: any) {
    if (error?.message === 'timeout') {
      throw new Error('Tempo esgotado ao conectar ao assistente. Tente novamente.');
    }
    console.error('Erro ao enviar para N8N (proxy):', error);
    throw new Error('Erro de conexão com o assistente. Tente novamente.');
  }
};