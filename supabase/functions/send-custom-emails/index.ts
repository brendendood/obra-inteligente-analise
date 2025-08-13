import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Mapeamento de remetentes - USANDO APENAS FALLBACK VERIFICADO
const SENDER_MAP: Record<string, { fromEmail: string; fromName: string; replyTo?: string }> = {
  password_reset: { fromEmail: "onboarding@resend.dev", fromName: "MadenAI Autenticação" },
  verified_user: { fromEmail: "onboarding@resend.dev", fromName: "MadenAI Verificação" },
  welcome_user:   { fromEmail: "onboarding@resend.dev", fromName: "MadenAI" },
  onboarding_step1: { fromEmail: "onboarding@resend.dev", fromName: "MadenAI" },
  usage_limit_reached: { fromEmail: "onboarding@resend.dev", fromName: "MadenAI" },
  account_deactivated: { fromEmail: "onboarding@resend.dev", fromName: "Suporte MadenAI", replyTo: "onboarding@resend.dev" },
  default: { fromEmail: "onboarding@resend.dev", fromName: "MadenAI" }, // Fallback verificado
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

    // Tentar usar template do DB
    let resolved = await resolveTemplate(supabase, email_type, vars);

    // Caso não encontre, usar geradores padrão
    if (!resolved) {
      const fallback = generateEmailContent(email_type, user_data, reset_data, verification_data);
      resolved = {
        subject: mergePlaceholders(fallback.subject, vars),
        html: mergePlaceholders(fallback.html, vars),
        fromEmail: getSenderByType(email_type).fromEmail,
        fromName: getSenderByType(email_type).fromName,
        replyTo: getSenderByType(email_type).replyTo,
        template_key: TYPE_TO_KEY[email_type] || email_type,
      } as any;
    }

    // USAR APENAS DOMÍNIO VERIFICADO PARA GARANTIR ENTREGA
    const verifiedFrom = 'MadenAI <onboarding@resend.dev>';
    
    let emailResponse: any = null;

    console.log(`📧 SEND-EMAILS: Enviando ${email_type} para ${recipient_email} usando domínio verificado: ${verifiedFrom}`);
    
    try {
      emailResponse = await resend.emails.send({
        from: verifiedFrom,
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
            used_from: verifiedFrom,
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
        from_used: verifiedFrom,
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

function generateEmailContent(
  emailType: string, 
  userData?: any, 
  resetData?: any,
  verificationData?: any
): { subject: string; html: string } {
  const userName = userData?.full_name || 'Usuário';
  const baseUrl = 'https://madeai.com.br';

  switch (emailType) {
    case 'verified_user':
      return {
        subject: '✉️ Confirme seu email - MadenAI',
        html: generateVerificationTemplate(userName, verificationData?.verification_url || '', baseUrl)
      };
    
    case 'welcome':
    case 'welcome_user':
      return {
        subject: '🎉 Bem-vindo à MadenAI!',
        html: generateWelcomeTemplate(userName, baseUrl)
      };
    
    case 'password_reset':
      return {
        subject: '🔑 Redefinir sua senha - MadenAI',
        html: generatePasswordResetTemplate(userName, resetData?.reset_url || '', baseUrl)
      };
    
    case 'project_milestone':
      return {
        subject: '🏆 Parabéns! 10 projetos concluídos - MadenAI',
        html: generateMilestoneTemplate(userName, userData?.project_count || 10, baseUrl)
      };
    
    case 'account_cancelled':
    case 'account_deactivated':
      return {
        subject: '😢 Sentiremos sua falta - MadenAI',
        html: generateCancelledTemplate(userName, baseUrl)
      };
    
    default:
      return {
        subject: 'MadenAI - Notificação',
        html: generateDefaultTemplate(userName, baseUrl)
      };
  }
}

function generateVerificationTemplate(userName: string, verificationUrl: string, baseUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirme seu Email - MadenAI</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 20px; }
            .title { color: #2d3748; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .text { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; text-align: center; }
            .verification-box { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .footer { background: #f7fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0; }
            .security-notice { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0; }
            .security-notice-text { color: #dc2626; font-size: 14px; margin: 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MadenAI</div>
                <div class="header-subtitle">Confirme seu email para ativar sua conta</div>
            </div>
            
            <div class="content">
                <h1 class="title">Confirme seu email, ${userName}! ✉️</h1>
                
                <p class="text">
                    Obrigado por se cadastrar na MadenAI! Para garantir a segurança da sua conta e ter acesso completo à plataforma, você precisa confirmar seu endereço de email.
                </p>
                
                <div class="verification-box">
                    <p style="margin: 0 0 15px 0; color: #374151; font-weight: 500;">
                        Clique no botão abaixo para confirmar seu email:
                    </p>
                    <a href="${verificationUrl}" class="cta-button" style="display: inline-block;">
                        ✅ Confirmar Email
                    </a>
                </div>
                
                <p class="text">
                    Após a confirmação, você terá acesso completo aos recursos da MadenAI:
                </p>
                
                <ul style="color: #4a5568; line-height: 1.8; margin-left: 20px;">
                    <li>🤖 Assistente de IA especializado em construção</li>
                    <li>💰 Geração automática de orçamentos</li>
                    <li>📅 Cronogramas inteligentes</li>
                    <li>📊 Análises detalhadas de projetos</li>
                </ul>
                
                <div class="security-notice">
                    <p class="security-notice-text">
                        <strong>⚠️ Importante:</strong> Este link expira em 24 horas. Se não confirmou a tempo, você pode solicitar um novo email de confirmação.
                    </p>
                </div>
                
                <p class="text" style="font-size: 14px; color: #6b7280;">
                    Se você não criou uma conta na MadenAI, pode ignorar este email com segurança.
                </p>
            </div>
            
            <div class="footer">
                <p style="color: #718096; margin-bottom: 10px;">
                    Precisa de ajuda? Entre em contato conosco!
                </p>
                <p style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                    © 2024 MadenAI. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateWelcomeTemplate(userName: string, baseUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo à MadenAI</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 20px; }
            .title { color: #2d3748; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .text { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .features { margin: 30px 0; }
            .feature { display: flex; align-items: center; margin: 15px 0; }
            .feature-icon { color: #667eea; margin-right: 15px; font-size: 20px; }
            .footer { background: #f7fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0; }
            .contact-btn { background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MadenAI</div>
                <div class="header-subtitle">Transforme seus projetos com Inteligência Artificial</div>
            </div>
            
            <div class="content">
                <h1 class="title">Bem-vindo, ${userName}! 🎉</h1>
                
                <p class="text">
                    Estamos muito felizes em tê-lo(a) conosco! A MadenAI é a plataforma que vai revolucionar a forma como você gerencia seus projetos de construção.
                </p>
                
                <div class="features">
                    <div class="feature">
                        <span class="feature-icon">🤖</span>
                        <span>Assistente de IA especializado em construção</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">💰</span>
                        <span>Orçamentos automáticos e precisos</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📅</span>
                        <span>Cronogramas inteligentes</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📊</span>
                        <span>Análises detalhadas de projetos</span>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <a href="${baseUrl}/painel" class="cta-button">Começar Agora</a>
                </div>
                
                <p class="text">
                    Pronto para criar seu primeiro projeto? Nossa IA está esperando para ajudá-lo a transformar suas ideias em realidade!
                </p>
            </div>
            
            <div class="footer">
                <p style="color: #718096; margin-bottom: 10px;">
                    Precisa de ajuda? Estamos aqui para você!
                </p>
                <a href="${baseUrl}/#contact" class="contact-btn">Entrar em Contato</a>
                <p style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                    © 2024 MadenAI. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generatePasswordResetTemplate(userName: string, resetUrl: string, baseUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha - MadenAI</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 20px; }
            .title { color: #2d3748; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .text { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .security-note { background: #fef5e7; border-left: 4px solid #f6ad55; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { background: #f7fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0; }
            .contact-btn { background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MadenAI</div>
                <div class="header-subtitle">Redefinição de Senha</div>
            </div>
            
            <div class="content">
                <h1 class="title">Redefinir Senha 🔑</h1>
                
                <p class="text">
                    Olá, ${userName}! Recebemos uma solicitação para redefinir a senha da sua conta MadenAI.
                </p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="cta-button">Redefinir Minha Senha</a>
                </div>
                
                <div class="security-note">
                    <strong>🔒 Importante:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Este link é válido por apenas 1 hora</li>
                        <li>Use apenas este link oficial da MadenAI</li>
                        <li>Se você não solicitou esta alteração, ignore este email</li>
                    </ul>
                </div>
                
                <p class="text">
                    Se o botão não funcionar, copie e cole este link no seu navegador:<br>
                    <code style="background: #f1f1f1; padding: 8px; border-radius: 4px; word-break: break-all; display: inline-block; margin-top: 10px;">${resetUrl}</code>
                </p>
            </div>
            
            <div class="footer">
                <p style="color: #718096; margin-bottom: 10px;">
                    Problemas com a redefinição? Entre em contato conosco!
                </p>
                <a href="${baseUrl}/#contact" class="contact-btn">Entrar em Contato</a>
                <p style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                    © 2024 MadenAI. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateMilestoneTemplate(userName: string, projectCount: number, baseUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Parabéns! Marcos Alcançados - MadenAI</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 20px; }
            .title { color: #2d3748; font-size: 28px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .text { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .stats-card { background: linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
            .stat-number { font-size: 48px; font-weight: bold; display: block; }
            .stat-label { font-size: 16px; opacity: 0.9; }
            .achievement { text-align: center; margin: 30px 0; }
            .achievement-icon { font-size: 48px; margin-bottom: 10px; }
            .footer { background: #f7fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0; }
            .contact-btn { background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MadenAI</div>
                <div class="header-subtitle">Marco Especial Alcançado</div>
            </div>
            
            <div class="content">
                <div class="achievement">
                    <div class="achievement-icon">🏆</div>
                    <h1 class="title">Parabéns, ${userName}!</h1>
                </div>
                
                <div class="stats-card">
                    <span class="stat-number">${projectCount}</span>
                    <div class="stat-label">Projetos Concluídos</div>
                </div>
                
                <p class="text">
                    Que conquista incrível! Você acabou de completar ${projectCount} projetos usando a MadenAI. 
                    Isso mostra sua dedicação e expertise em gestão de projetos.
                </p>
                
                <p class="text">
                    Com nossa IA, você já economizou centenas de horas de trabalho e gerou orçamentos e cronogramas 
                    mais precisos. Continue assim!
                </p>
                
                <div style="text-align: center;">
                    <a href="${baseUrl}/painel" class="cta-button">Ver Meus Projetos</a>
                </div>
                
                <div style="background: #e6fffa; border-left: 4px solid #48bb78; padding: 20px; margin: 30px 0; border-radius: 4px;">
                    <strong>🎁 Recompensa Especial:</strong><br>
                    Como reconhecimento pela sua dedicação, você ganhou créditos extras de IA! 
                    Use-os para explorar ainda mais recursos da plataforma.
                </div>
            </div>
            
            <div class="footer">
                <p style="color: #718096; margin-bottom: 10px;">
                    Continue construindo o futuro com a MadenAI!
                </p>
                <a href="${baseUrl}/#contact" class="contact-btn">Entrar em Contato</a>
                <p style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                    © 2024 MadenAI. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateCancelledTemplate(userName: string, baseUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sentiremos sua falta - MadenAI</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #a0aec0 0%, #718096 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 20px; }
            .title { color: #2d3748; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .text { color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .feedback-section { background: #f7fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 30px 0; }
            .footer { background: #f7fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0; }
            .contact-btn { background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MadenAI</div>
                <div class="header-subtitle">Até logo!</div>
            </div>
            
            <div class="content">
                <h1 class="title">Sentiremos sua falta, ${userName} 😢</h1>
                
                <p class="text">
                    Sua conta foi cancelada com sucesso. Esperamos que a MadenAI tenha sido útil durante o tempo que esteve conosco.
                </p>
                
                <p class="text">
                    Embora esteja partindo agora, saiba que você sempre será bem-vindo(a) de volta. 
                    Continuaremos inovando e melhorando nossa plataforma.
                </p>
                
                <div class="feedback-section">
                    <strong>💬 Sua opinião é importante:</strong>
                    <p style="margin: 10px 0;">
                        Gostaríamos muito de saber o que podemos melhorar. Seu feedback nos ajuda a criar uma experiência ainda melhor para nossos usuários.
                    </p>
                    <a href="${baseUrl}/#contact" style="color: #667eea; text-decoration: none; font-weight: bold;">
                        → Compartilhar Feedback
                    </a>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}/cadastro" class="cta-button">Criar Nova Conta</a>
                </div>
                
                <div style="background: #e6fffa; border-left: 4px solid #48bb78; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <strong>🔄 Mudou de ideia?</strong><br>
                    Você pode criar uma nova conta a qualquer momento. Todos os seus dados foram mantidos seguros e podem ser restaurados.
                </div>
                
                <p class="text" style="text-align: center; font-style: italic;">
                    "A inovação na construção nunca para. Quando estiver pronto, estaremos aqui."
                </p>
            </div>
            
            <div class="footer">
                <p style="color: #718096; margin-bottom: 10px;">
                    Obrigado por ter feito parte da nossa jornada!
                </p>
                <a href="${baseUrl}/#contact" class="contact-btn">Entrar em Contato</a>
                <p style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                    © 2024 MadenAI. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateDefaultTemplate(userName: string, baseUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MadenAI - Notificação</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; }
            .content { padding: 40px 20px; text-align: center; }
            .footer { background: #f7fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0; }
            .contact-btn { background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MadenAI</div>
            </div>
            <div class="content">
                <h1>Olá, ${userName}!</h1>
                <p>Esta é uma notificação da MadenAI.</p>
            </div>
            <div class="footer">
                <a href="${baseUrl}/#contact" class="contact-btn">Entrar em Contato</a>
                <p style="color: #a0aec0; font-size: 14px; margin-top: 20px;">
                    © 2024 MadenAI. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

serve(handler);
