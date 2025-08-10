
// supabase/functions/secure-n8n-proxy/index.ts
// Secure N8N proxy to prevent exposing PII and webhooks from the client
// Uses JWT auth, validates allowed routes, and forwards payload server-side

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map agent types to allowed N8N webhook paths
const AGENT_ROUTE_MAP: Record<string, string> = {
  // Ajuste direto para o webhook fornecido pelo cliente (chat geral)
  general: 'webhook-test/aa02ca52-8850-452e-9e72-4f79966aa544',
  project: 'projeto-chat',
  budget: 'orcamento-ia',
  schedule: 'cronograma-ia',
  analysis: 'analise-tecnica',
};

// Build full target URL safely
function buildTargetUrl(path: string) {
  const base = Deno.env.get('N8N_BASE_URL') || 'https://madeai-br.app.n8n.cloud/webhook';
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${normalizedBase}/${normalizedPath}`;
}

// Minimal sanitization to avoid oversized/unsafe payloads
function sanitizePayload(payload: any) {
  try {
    const json = JSON.stringify(payload);
    // Hard cap 256KB body
    if (json.length > 256 * 1024) {
      return { error: 'payload_too_large' };
    }
    return payload;
  } catch {
    return { error: 'invalid_payload' };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require auth
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ error: 'missing_supabase_env' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') || '' } },
    });

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const body = await req.json().catch(() => ({}));

    // Proxy-only fast path: PRIMARY/SECONDARY with retries, timeout and detailed logs
    if (body.primaryWebhook) {
      const payload = body.payload ?? body;
      const primary: string = String(body.primaryWebhook);
      const secondary: string | undefined = body.secondaryWebhook ? String(body.secondaryWebhook) : undefined;

      // Minimal validation: require message string
      const msg = typeof payload?.message === 'string' ? payload.message : '';
      if (!msg.trim()) {
        return new Response(JSON.stringify({ error: 'missing_message' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Size limit: 10KB
      const str = JSON.stringify(payload);
      if (str.length > 10 * 1024) {
        return new Response(JSON.stringify({ error: 'payload_too_large' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const traceId = typeof payload?.traceId === 'string' ? payload.traceId : crypto.randomUUID();
      const chatId = payload?.chatId || payload?.conversation_id || null;
      const userId = payload?.userId || payload?.user_id || payload?.user_data?.id || authData.user.id;
      const ts = new Date().toISOString();

      console.info('[Proxy] Pre-send', {
        ts,
        traceId,
        chatId,
        userId,
        url: primary,
        preview: msg.slice(0, 200),
      });

      const timeoutMs = 30000;

      const sendOnce = async (url: string): Promise<{ ok: boolean; status: number; statusText: string; text: string; notRegistered404: boolean } > => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain; q=0.9' },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
          const ct = resp.headers.get('content-type') || '';
          const text = ct.includes('application/json') ? JSON.stringify(await resp.json().catch(() => ({}))) : await resp.text().catch(() => '');
          const snippet = typeof text === 'string' ? text.slice(0, 500) : String(text).slice(0, 500);
          const notRegistered404 = resp.status === 404 && /not registered/i.test(snippet);
          return { ok: resp.ok, status: resp.status, statusText: resp.statusText, text: snippet, notRegistered404 };
        } finally {
          clearTimeout(timeout);
        }
      };

      const backoffs = [500, 1500];

      // Try primary with retries
      let result = null as null | { ok: boolean; status: number; statusText: string; text: string; notRegistered404: boolean };
      let attempt = 0;
      let reason: string | undefined;

      while (attempt < 2) {
        try {
          result = await sendOnce(primary);
          if (result.ok) {
            console.info(`Webhook delivery: OK | status=${result.status} | traceId=${traceId} | ts=${new Date().toISOString()}`);
            return new Response(
              JSON.stringify({ status: result.status, statusText: result.statusText, response: result.text }),
              { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
            );
          }
          if (result.notRegistered404) break; // immediate fallback to secondary
          reason = `http_${result.status}`;
        } catch (e: any) {
          reason = e?.message || 'network_error';
        }
        attempt++;
        if (attempt < 2) await new Promise((r) => setTimeout(r, backoffs[attempt - 1] || 1500));
      }

      // Fallback to secondary if provided
      if (secondary) {
        console.warn('[Proxy] Primary failed or not registered, trying secondary');
        attempt = 0;
        while (attempt < 2) {
          try {
            result = await sendOnce(secondary);
            if (result.ok) {
              console.info(`Webhook delivery: OK | status=${result.status} | traceId=${traceId} | ts=${new Date().toISOString()}`);
              return new Response(
                JSON.stringify({ status: result.status, statusText: result.statusText, response: result.text }),
                { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
              );
            }
            reason = `http_${result.status}`;
          } catch (e: any) {
            reason = e?.message || 'network_error';
          }
          attempt++;
          if (attempt < 2) await new Promise((r) => setTimeout(r, backoffs[attempt - 1] || 1500));
        }
      }

      const failStatus = result?.status ?? 599;
      const failText = result?.text ?? '';
      console.error(`Webhook delivery: FAIL | status=${failStatus} | reason=${reason || 'unknown'} | traceId=${traceId} | ts=${new Date().toISOString()} | body=${failText}`);
      return new Response(
        JSON.stringify({ status: failStatus, statusText: result?.statusText || 'error', response: failText }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Resolve destino com regras seguras e flexíveis para o agente "general"
    const normalizeGeneralTarget = (): { url?: string; path?: string } => {
      const full = Deno.env.get('N8N_GENERAL_WEBHOOK')?.trim();
      const token = Deno.env.get('N8N_GENERAL_TOKEN')?.trim();
      const pathOrToken = Deno.env.get('N8N_GENERAL_PATH')?.trim();

      const asPath = (val: string) => {
        if (val.startsWith('webhook/')) return val;
        // UUID v4 -> vira webhook/<uuid>
        if (/^[0-9a-fA-F-]{36}$/.test(val)) return `webhook/${val}`;
        return val;
      };

      if (full) {
        if (/^https?:\/\//i.test(full)) {
          try {
            const u = new URL(full);
            if (u.pathname.includes('/webhook/')) return { url: `${u.origin}${u.pathname}`.replace(/\/$/, '') };
            const t = token || (pathOrToken && /^[0-9a-fA-F-]{36}$/.test(pathOrToken) ? pathOrToken : undefined);
            if (t) return { url: `${u.origin}/webhook/${t}` };
            // Se vier domínio puro sem token, cai para outros segredos
          } catch (_) {}
        } else {
          return { path: asPath(full) };
        }
      }

      if (token) return { path: `webhook/${token}` };
      if (pathOrToken) return { path: asPath(pathOrToken) };
      return {};
    };

    const agentType: string | undefined = body.agentType;
    const explicitPath: string | undefined = body.path || body.route; // support both keys
    const clientTargetWebhook: string | undefined = body.targetWebhook;

    let path: string | undefined;
    let targetOverrideUrl: string | undefined;

    // 1) Se o cliente fornecer uma URL completa e segura (apenas para agentType general), permitir
    if (
      agentType === 'general' && clientTargetWebhook && /^https?:\/\//i.test(clientTargetWebhook)
    ) {
      try {
        const url = new URL(clientTargetWebhook);
        const allowedHost = new URL(Deno.env.get('N8N_BASE_URL') || 'https://madeai-br.app.n8n.cloud').hostname;
        const allowedPath = url.pathname.startsWith('/webhook/') || url.pathname.startsWith('/webhook-test/');
        if (url.hostname === allowedHost && allowedPath) {
          targetOverrideUrl = `${url.origin}${url.pathname}`.replace(/\/$/, '');
        }
      } catch (_) {}
    }

    // 2) Caminho explícito: aceitar mapeados e também UUIDs para general
    if (!targetOverrideUrl && explicitPath) {
      if (Object.values(AGENT_ROUTE_MAP).includes(explicitPath)) {
        path = explicitPath;
      } else if (agentType === 'general' && (/^((webhook|webhook-test)\/)?.+/.test(explicitPath))) {
        // Permite "webhook/<uuid>", "webhook-test/<uuid>" ou apenas "<uuid>"
        if (explicitPath.startsWith('webhook/') || explicitPath.startsWith('webhook-test/')) {
          path = explicitPath;
        } else {
          path = `webhook/${explicitPath}`;
        }
      }
    }

    // 3) Overrides por segredo (prioridade alta)
    if (!path && !targetOverrideUrl && agentType === 'general') {
      const resolved = normalizeGeneralTarget();
      if (resolved.url) targetOverrideUrl = resolved.url;
      if (resolved.path) path = resolved.path;
    }

    // 4) Fallback para mapeamento padrão por agente
    if (!path && !targetOverrideUrl && agentType && AGENT_ROUTE_MAP[agentType]) {
      path = AGENT_ROUTE_MAP[agentType];
    }

    if (!path && !targetOverrideUrl) {
      return new Response(JSON.stringify({ error: 'invalid_route' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const forwardPayload = sanitizePayload(body.payload ?? body.context ?? body);
    if ((forwardPayload as any).error) {
      return new Response(JSON.stringify(forwardPayload), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Attach minimal user context server-side
    const safePayload = {
      ...forwardPayload,
      _meta: {
        user_id: authData.user.id,
        email: authData.user.email,
        timestamp: new Date().toISOString(),
        agentType: agentType || null,
        via: 'secure-n8n-proxy',
      },
    };

    const targetUrl = targetOverrideUrl || buildTargetUrl(path!);

    // Log básico para diagnóstico (apenas nos logs da função)
    console.log('Forwarding to N8N:', {
      agentType,
      used: targetOverrideUrl ? 'override_url' : 'mapped_path',
      pathOrUrl: targetOverrideUrl || path,
      targetUrl,
      user: authData.user.id,
      time: new Date().toISOString(),
    });

    const controller = new AbortController();
    const timeoutMs = Number(Deno.env.get('N8N_TIMEOUT_MS') || '30000');
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const n8nHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain; q=0.9',
    };

    const n8nToken = Deno.env.get('N8N_TOKEN');
    if (n8nToken) n8nHeaders['Authorization'] = `Bearer ${n8nToken}`;

    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers: n8nHeaders,
      body: JSON.stringify(safePayload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const contentType = resp.headers.get('content-type') || '';
    let result: any = {};

    if (contentType.includes('application/json')) {
      result = await resp.json().catch(() => ({}));
    } else {
      result = { response: await resp.text().catch(() => '') };
    }

    // Normalize output
    const extracted =
      (typeof result?.response === 'string' && result.response) ||
      (typeof result?.text === 'string' && result.text) ||
      (typeof result?.data?.response === 'string' && result.data.response) ||
      (typeof result?.data?.text === 'string' && result.data.text) ||
      '';

    return new Response(
      JSON.stringify({ response: extracted, raw: result, status: resp.status, statusText: resp.statusText }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err) {
    const isAbort = (err as any)?.name === 'AbortError';
    const status = isAbort ? 504 : 500;
    return new Response(
      JSON.stringify({ error: isAbort ? 'timeout' : 'proxy_error' }),
      { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
