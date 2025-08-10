import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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
      url: N8N_TARGET_WEBHOOK,
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
        plan: 'free',
      },
      conversation_history: conversationHistory.slice(-10),
      context: { source: 'general_chat', chat_type: 'tira_duvidas' },
      ...(attachments && attachments.length > 0 ? { attachments } : {}),
    };

    const fullPayload = { ...legacyPayload, ...minimalPayload };

    // 1) Envio DIRETO ao webhook (sem proxy, sem bloqueios)
    try {
      const directResp = (await Promise.race([
        fetch(N8N_TARGET_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullPayload),
          signal: controller.signal,
          credentials: 'omit',
        }),
        new Promise((_, reject) => controller.signal.addEventListener('abort', () => reject(new Error('timeout')))),
      ])) as Response;

      const ct = directResp.headers.get('content-type') || '';
      const directBody: any = ct.includes('application/json')
        ? await directResp.json().catch(() => ({}))
        : await directResp.text().catch(() => '');

      if (!directResp.ok) {
        const snippet = typeof directBody === 'string' ? directBody.slice(0, 500) : JSON.stringify(directBody).slice(0, 500);
        throw new Error(`http_${directResp.status}: ${snippet}`);
      }

      console.info(`Webhook delivery: OK | status=${directResp.status} | traceId=${traceId} | ts=${ts}`);

      const extracted =
        (typeof directBody?.response === 'string' && directBody.response) ||
        (typeof directBody === 'string' ? directBody : '') ||
        '';

      clearTimeout(timeout);
      return extracted;
    } catch (directErr: any) {
      console.warn('[Webhook] Direct send failed, falling back to proxy', { traceId, reason: directErr?.message });
    }

    // 2) Fallback via edge function segura (2 tentativas)
    const tryInvoke = async () =>
      supabase.functions.invoke('secure-n8n-proxy', {
        body: { agentType: 'general', targetWebhook: N8N_TARGET_WEBHOOK, payload: fullPayload },
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