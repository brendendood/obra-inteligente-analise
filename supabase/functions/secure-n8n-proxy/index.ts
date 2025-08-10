
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
  general: 'chat-geral',
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

    // Determine route
    const agentType: string | undefined = body.agentType;
    const explicitPath: string | undefined = body.path || body.route; // support both keys

    // Novo: permitir override para "general" via segredo
    const generalOverride = Deno.env.get('N8N_GENERAL_PATH')?.trim();

    let path: string | undefined;
    let targetOverrideUrl: string | undefined;

    // Explicit path only if it's an allowed mapped path (mantém segurança)
    if (explicitPath && Object.values(AGENT_ROUTE_MAP).includes(explicitPath)) {
      path = explicitPath;
    } else if (agentType === 'general' && generalOverride) {
      // Se for URL completa, usar diretamente; se não, tratar como path (ex.: UUID do webhook)
      if (/^https?:\/\//i.test(generalOverride)) {
        targetOverrideUrl = generalOverride;
      } else {
        path = generalOverride;
      }
    } else if (agentType && AGENT_ROUTE_MAP[agentType]) {
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
      JSON.stringify({ response: extracted, raw: result }),
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
