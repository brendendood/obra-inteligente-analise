import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Mapeamento de remetentes - USANDO DOMÍNIO @madeai.com.br UNIFICADO
const SENDER_MAP: Record<string, { fromEmail: string; fromName: string; replyTo?: string }> = {
  password_reset: { fromEmail: "autenticacao@madeai.com.br", fromName: "MadenAI Autenticação" },
  verified_user: { fromEmail: "verificacao@madeai.com.br", fromName: "MadenAI Verificação" },
  welcome_user:   { fromEmail: "boas-vindas@madeai.com.br", fromName: "MadenAI" },
  onboarding_step1: { fromEmail: "onboarding@madeai.com.br", fromName: "MadenAI" },
  usage_limit_reached: { fromEmail: "notificacoes@madeai.com.br", fromName: "MadenAI" },
  account_deactivated: { fromEmail: "suporte@madeai.com.br", fromName: "Suporte MadenAI", replyTo: "suporte@madeai.com.br" },
  default: { fromEmail: "noreply@madeai.com.br", fromName: "MadenAI" }, // Fallback unificado
};

function getSenderByType(emailType: string) {
  return SENDER_MAP[emailType] || SENDER_MAP.default;
}

function stripHtmlToText(html: string): string {
  try {
    return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map de tipos -> chaves de template
const TYPE_TO_KEY: Record<string, string> = {
  welcome: 'welcome_user',
  welcome_user: 'welcome_user',
  verified_user: 'verified_user',
  onboarding_step1: 'onboarding_step1',
  password_reset: 'password_reset',
  project_milestone: 'project_milestone',
  account_cancelled: 'account_deactivated',
  account_deactivated: 'account_deactivated',
  usage_limit_reached: 'usage_limit_reached',
};

function mergePlaceholders(str: string, vars: Record<string, any>) {
  if (!str) return '';
  return str.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const v = vars[key];
    return v === undefined || v === null ? '' : String(v);
  });
}

async function resolveTemplate(supabase: any, emailType: string, vars: Record<string, any>) {
  const key = TYPE_TO_KEY[emailType] || emailType;
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('template_key', key)
    .eq('locale', 'pt-BR')
    .eq('enabled', true)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.warn('⚠️ SEND-EMAILS: Falha ao buscar template do DB:', error.message);
    return null;
  }
  if (!data) return null;
  const subject = mergePlaceholders(data.subject || '', vars);
  const html = mergePlaceholders(data.html || '', vars);
  const fromEmail = data.from_email || getSenderByType(emailType).fromEmail;
  const fromName = data.from_name || getSenderByType(emailType).fromName;
  const replyTo = data.reply_to || getSenderByType(emailType).replyTo;
  return { subject, html, fromEmail, fromName, replyTo, template_key: key };
}

interface EmailRequest {
  email_type: 'welcome' | 'welcome_user' | 'verified_user' | 'onboarding_step1' | 'password_reset' | 'project_milestone' | 'usage_limit_reached' | 'account_cancelled' | 'account_deactivated';
  recipient_email: string;
  user_data?: {
    full_name?: string;
    email?: string;
    project_count?: number;
    user_id?: string;
    plan_name?: string;
    used_projects?: number;
    onboarding_step?: number;
  };
  reset_data?: {
    reset_url?: string;
    token?: string;
    token_expires_minutes?: number;
  };
  verification_data?: {
    verification_url?: string;
    token?: string;
  };
  extra_data?: {
    upgrade_url?: string;
    onboarding_cta_url?: string;
    deactivated_at?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email_type, recipient_email, user_data, reset_data, verification_data, extra_data }: EmailRequest = await req.json();

    const allowedTypes = [
      'welcome', 'welcome_user', 'verified_user', 'onboarding_step1', 'password_reset', 'project_milestone', 'usage_limit_reached', 'account_cancelled', 'account_deactivated'
    ];
    if (!allowedTypes.includes(email_type)) {
      return new Response(JSON.stringify({ error: 'Unsupported email_type' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`📧 SEND-EMAILS: Enviando email tipo "${email_type}" para ${recipient_email}`);

    // Inicializar Supabase client (para buscar templates e fazer logging)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

    // Garantir que a API key do Resend existe
    if (!Deno.env.get('RESEND_API_KEY')) {
      const msg = 'RESEND_API_KEY ausente. Configure em Supabase > Functions > Secrets.';
      console.error('❌ SEND-EMAILS:', msg);
      return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Throttle para limite de uso (1x por semana)
    if (email_type === 'usage_limit_reached' && supabase && user_data?.user_id) {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from('email_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user_data.user_id)
        .eq('email_type', 'usage_limit_reached')
        .gte('sent_at', since);
      if ((count || 0) > 0) {
        console.log('⏳ SEND-EMAILS: Throttled usage_limit_reached para usuário', user_data.user_id);
        return new Response(JSON.stringify({ status: 'throttled' }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
    }

    // Variáveis globais para merge
    const appName = 'MadenAI';
    const baseUrl = 'https://madeai.com.br';
    const vars: Record<string, any> = {
      app_name: appName,
      app_url: baseUrl,
      dashboard_url: `${baseUrl}/painel`,
      today: new Date().toLocaleDateString('pt-BR'),
      full_name: user_data?.full_name || 'Usuário',
      first_name: (user_data?.full_name || 'Usuário').split(' ')[0],
      email: user_data?.email || recipient_email,
      user_id: user_data?.user_id || '',
      project_count: user_data?.project_count || '',
      plan_name: user_data?.plan_name || '',
      used_projects: user_data?.used_projects || '',
      onboarding_step: user_data?.onboarding_step || 1,
      reset_url: reset_data?.reset_url || '',
      token_expires_minutes: reset_data?.token_expires_minutes || 60,
      verification_url: verification_data?.verification_url || '',
      verification_token: verification_data?.token || '',
      upgrade_url: extra_data?.upgrade_url || `${baseUrl}/planos`,
      onboarding_cta_url: extra_data?.onboarding_cta_url || `${baseUrl}/painel`,
      deactivated_at: extra_data?.deactivated_at || new Date().toLocaleString('pt-BR'),
      support_email: 'suporte@madeai.com.br',
    };

    // Resolver template EXCLUSIVAMENTE do banco de dados
    let resolved;
    try {
      resolved = await resolveTemplate(supabase, email_type, vars);
      
      if (!resolved) {
        throw new Error(`Template '${email_type}' não encontrado no banco de dados`);
      }
      
      console.log(`✅ SEND-EMAILS: Template encontrado e processado: ${email_type}`);
    } catch (err) {
      console.error(`❌ SEND-EMAILS: Template obrigatório '${email_type}' não encontrado no banco:`, err);
      
      return new Response(
        JSON.stringify({ 
          error: `Template '${email_type}' não encontrado no banco de dados. Configure o template no painel administrativo.`,
          template_key: email_type
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // USAR DOMÍNIO @madeai.com.br UNIFICADO
    const finalFrom = `${resolved.fromName} <${resolved.fromEmail}>`;
    
    let emailResponse: any = null;

    console.log(`📧 SEND-EMAILS: Enviando ${email_type} para ${recipient_email} usando: ${finalFrom}`);
    
    try {
      emailResponse = await resend.emails.send({
        from: finalFrom,
        to: [recipient_email],
        subject: resolved.subject,
        html: resolved.html,
        text: stripHtmlToText(resolved.html),
        tags: [
          { name: 'category', value: TYPE_TO_KEY[email_type] || email_type }, 
          { name: 'type', value: 'transactional' },
          { name: 'environment', value: 'production' }
        ],
      });
      console.log(`✅ SEND-EMAILS: Email ${email_type} enviado com sucesso! ID: ${emailResponse?.data?.id}`);
    } catch (sendErr: any) {
      console.error('❌ SEND-EMAILS: Falha ao enviar email:', sendErr?.message || sendErr);
      
      // Tentar diagnóstico detalhado
      if (sendErr?.message?.includes('API key')) {
        console.error('❌ SEND-EMAILS: Problema com API key do Resend');
      }
      if (sendErr?.message?.includes('domain')) {
        console.error('❌ SEND-EMAILS: Problema com domínio não verificado');
      }
      if (sendErr?.message?.includes('rate limit')) {
        console.error('❌ SEND-EMAILS: Rate limit atingido');
      }
      
      throw sendErr;
    }

    // Log do sucesso
    try {
      if (supabase) {
        await supabase.from('email_logs').insert({
          user_id: user_data?.user_id || null,
          email_type,
          recipient_email,
          subject: resolved.subject,
          status: 'sent',
          template_key: TYPE_TO_KEY[email_type] || email_type,
          template_version: '1.0',
          metadata: { 
            email_id: emailResponse?.data?.id, 
            vars, 
            used_from: finalFrom,
            resend_response: emailResponse?.data 
          }
        });
      }
    } catch (logErr) {
      console.warn('⚠️ SEND-EMAILS: Não foi possível registrar o log do email:', logErr);
    }

    return new Response(JSON.stringify({
      ...emailResponse,
      debug: {
        email_type,
        template_used: resolved.template_key,
        from_used: finalFrom,
        verification_url: verification_data?.verification_url,
        email_id: emailResponse?.data?.id,
        resend_status: 'sent'
      }
    }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });

  } catch (error: any) {
    console.error("❌ SEND-EMAILS: Erro:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

// Função removida - agora usamos APENAS templates do banco de dados
// Se não há template no banco, retornamos erro (não fallback)
function generateEmailContent(): never {
  throw new Error('Template não encontrado no banco de dados e fallbacks foram removidos por política de segurança');
}

// Todas as funções de template estático foram removidas - usamos APENAS templates do banco

// Código removido - templates agora vêm exclusivamente do banco de dados

serve(handler);
