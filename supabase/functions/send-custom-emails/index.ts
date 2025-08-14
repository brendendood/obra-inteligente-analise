import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email_type: 'welcome_user' | 'onboarding_step1' | 'project_milestone' | 'account_deactivated' | 'usage_limit_reached' | 'password_reset';
  recipient_email: string;
  user_data?: {
    full_name?: string;
    user_id?: string;
    plan_name?: string;
    used_projects?: number;
    project_count?: number;
  };
  reset_data?: {
    reset_url: string;
  };
  extra_data?: {
    upgrade_url?: string;
  };
}

// Buscar template do HTML no admin e substituir variáveis
const getEmailTemplateWithVariables = async (supabaseClient: any, emailType: string, userData: any, resetData?: any, extraData?: any) => {
  const userName = userData?.full_name || 'Usuário';
  
  try {
    // Buscar template por template_key na tabela email_templates
    const { data: template, error } = await supabaseClient
      .from('email_templates')
      .select('subject, html')
      .eq('template_key', emailType)
      .eq('enabled', true)
      .single();

    if (error || !template) {
      console.warn(`⚠️ Template '${emailType}' não encontrado no admin, usando fallback`);
      return generateFallbackEmailContent(emailType, userData, resetData, extraData);
    }

    // Substituir variáveis no subject e HTML
    let processedSubject = template.subject || 'Notificação MadenAI';
    let processedHtml = template.html || '<p>Conteúdo não disponível</p>';

    // Variáveis básicas do usuário
    const variables = {
      '{{user_name}}': userName,
      '{{full_name}}': userName,
      '{{dashboard_url}}': `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'}/dashboard`,
      '{{project_count}}': userData?.project_count?.toString() || '0',
      '{{plan_name}}': userData?.plan_name || 'Free',
      '{{used_projects}}': userData?.used_projects?.toString() || '0',
      '{{reset_url}}': resetData?.reset_url || '#',
      '{{upgrade_url}}': extraData?.upgrade_url || '#',
      '{{site_url}}': Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'
    };

    // Aplicar substituições
    Object.entries(variables).forEach(([key, value]) => {
      processedSubject = processedSubject.replace(new RegExp(key, 'g'), value);
      processedHtml = processedHtml.replace(new RegExp(key, 'g'), value);
    });

    return {
      subject: processedSubject,
      html: processedHtml
    };

  } catch (error) {
    console.error('❌ Erro ao buscar template:', error);
    return generateFallbackEmailContent(emailType, userData, resetData, extraData);
  }
};

// Fallback para quando não há template no admin
const generateFallbackEmailContent = (emailType: string, userData: any, resetData?: any, extraData?: any) => {
  const userName = userData?.full_name || 'Usuário';
  
  switch (emailType) {
    case 'welcome_user':
      return {
        subject: `🎉 Bem-vindo à MadenAI, ${userName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">MadenAI</h1>
            <h2>Bem-vindo, ${userName}!</h2>
            <p>Sua conta foi criada com sucesso. Acesse a plataforma e comece a usar nossos recursos de IA.</p>
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'}/dashboard" 
               style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Acessar Painel
            </a>
          </div>
        `
      };

    case 'project_milestone':
      return {
        subject: `🎉 Parabéns! Você completou ${userData?.project_count} projetos!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">MadenAI</h1>
            <h2>🏆 Parabéns, ${userName}!</h2>
            <p>Você completou <strong>${userData?.project_count} projetos</strong> na plataforma!</p>
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'}/dashboard" 
               style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Ver Projetos
            </a>
          </div>
        `
      };

    default:
      return {
        subject: `Notificação MadenAI - ${userName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">MadenAI</h1>
            <h2>Olá, ${userName}!</h2>
            <p>Você tem uma nova notificação. Acesse sua conta para mais detalhes.</p>
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'}/dashboard" 
               style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Acessar Conta
            </a>
          </div>
        `
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log('📧 EMAIL-SYSTEM: Processando email do tipo:', emailRequest.email_type);

    // Validar campos obrigatórios
    if (!emailRequest.email_type || !emailRequest.recipient_email) {
      throw new Error('Missing required fields: email_type and recipient_email');
    }

    let user = null;

    // Requer autenticação para todos os tipos de email personalizados
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header required for this email type');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verificar se o usuário está autenticado
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authUser) {
      throw new Error('Authentication required for this email type');
    }
    user = authUser;

    // Buscar conteúdo do email usando templates do admin
    const emailContent = await getEmailTemplateWithVariables(
      supabaseClient,
      emailRequest.email_type,
      emailRequest.user_data,
      emailRequest.reset_data,
      emailRequest.extra_data
    );

    console.log('📧 EMAIL-SYSTEM: Enviando email via Resend para:', emailRequest.recipient_email);

    // Enviar email via Resend usando domínio verificado
    const emailResponse = await resend.emails.send({
      from: "MadenAI <suporte@madeai.com.br>",
      to: [emailRequest.recipient_email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (emailResponse.error) {
      console.error('❌ EMAIL-SYSTEM: Erro no Resend:', emailResponse.error);
      throw new Error(`Resend error: ${emailResponse.error.message}`);
    }

    console.log('✅ EMAIL-SYSTEM: Email enviado com sucesso:', emailResponse.data);

    // Log do envio na base de dados (opcional)
    if (user) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );
        
        await supabaseClient.from('email_logs').insert({
          user_id: user.id,
          email_type: emailRequest.email_type,
          recipient_email: emailRequest.recipient_email,
          resend_id: emailResponse.data?.id,
          status: 'sent',
          sent_at: new Date().toISOString()
        });
      } catch (logError) {
        console.warn('⚠️ EMAIL-SYSTEM: Falha ao registrar log (não crítico):', logError);
      }
    } else {
      console.log('📝 EMAIL-SYSTEM: Log não registrado - email não autenticado (reset senha)');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        email_id: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('❌ EMAIL-SYSTEM: Erro geral:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);