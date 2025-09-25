
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  event_type: string;
  user_data: {
    id: string;
    email: string;
    name?: string;
  };
  event_data?: Record<string, any>;
  webhook_urls: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Require admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: isAdmin } = await supabaseAuth.rpc('is_admin_user');
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { event_type, user_data, event_data, webhook_urls }: WebhookPayload = await req.json();

    // Validate and sanitize webhook URLs
    const allowedDomains = ['n8n.cloud', 'hooks.zapier.com', 'make.com', 'discord.com', 'hooks.slack.com', 'slack.com'];
    const isPrivateHost = (host: string) => /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(host);
    const isAllowedUrl = (urlStr: string) => {
      try {
        const u = new URL(urlStr);
        if (u.protocol !== 'https:') return false;
        const host = u.hostname;
        if (isPrivateHost(host)) return false;
        return allowedDomains.some(d => host === d || host.endsWith(`.${d}`));
      } catch {
        return false;
      }
    };

    const urls = Array.isArray(webhook_urls) ? webhook_urls.slice(0, 5).filter(isAllowedUrl) : [];
    if (urls.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid webhook URLs provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`🔔 WEBHOOK: Processando evento ${event_type} para usuário ${user_data.email}`);

    // Preparar payload para envio
    const webhookPayload = {
      event_type,
      user: user_data,
      data: event_data,
      timestamp: new Date().toISOString(),
      source: 'MadenAI'
    };

    // Enviar para cada webhook URL
    const results = await Promise.allSettled(
      webhook_urls.map(async (url) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'MadenAI-Webhook/1.0'
            },
            body: JSON.stringify(webhookPayload)
          });

          // Log do webhook
          await supabase
            .from('webhook_logs')
            .insert({
              webhook_url: url,
              event_type,
              payload: webhookPayload,
              status_code: response.status,
              response_body: await response.text()
            });

          return {
            url,
            success: response.ok,
            status: response.status
          };
        } catch (error) {
          console.error(`❌ WEBHOOK: Erro ao enviar para ${url}:`, error);
          
          // Log de erro
          await supabase
            .from('webhook_logs')
            .insert({
              webhook_url: url,
              event_type,
              payload: webhookPayload,
              status_code: 0,
              response_body: `Error: ${error instanceof Error ? error.message : String(error)}`
            });

          return {
            url,
            success: false,
            error: error instanceof Error ? error.message : String(error)
          };
        }
      })
    );

    console.log('✅ WEBHOOK: Processamento concluído');

    return new Response(JSON.stringify({
      success: true,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason })
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 WEBHOOK: Erro crítico:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error) 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
