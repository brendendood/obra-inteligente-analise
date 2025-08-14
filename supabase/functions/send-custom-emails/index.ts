import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email_type: 'welcome_user' | 'onboarding_step1' | 'password_reset' | 'project_milestone' | 'account_deactivated' | 'usage_limit_reached';
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

const generateEmailContent = (emailType: string, userData: any, resetData?: any, extraData?: any) => {
  const userName = userData?.full_name || 'Usuário';
  
  switch (emailType) {
    case 'welcome_user':
      return {
        subject: `🎉 Bem-vindo à MadenAI, ${userName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">MadenAI</h1>
              <p style="color: #64748b; font-size: 18px;">Bem-vindo à plataforma de gestão inteligente de obras!</p>
            </div>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
              <h2 style="color: #1e293b; margin-bottom: 15px;">Olá ${userName}! 👋</h2>
              <p style="color: #475569; line-height: 1.6; margin-bottom: 15px;">
                Sua conta na MadenAI foi criada com sucesso! Agora você pode começar a revolucionar a gestão dos seus projetos de construção com o poder da inteligência artificial.
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e293b; margin-bottom: 15px;">🚀 Próximos passos:</h3>
              <ul style="color: #475569; line-height: 1.8;">
                <li>Faça o upload do seu primeiro projeto</li>
                <li>Explore o assistente de IA para análise de documentos</li>
                <li>Gere orçamentos automáticos</li>
                <li>Crie cronogramas inteligentes</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'}/dashboard" 
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Acessar Painel
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; color: #64748b; font-size: 14px; text-align: center;">
              <p>Se você não criou esta conta, pode ignorar este email com segurança.</p>
              <p style="margin-top: 10px;">
                <strong>MadenAI</strong> - Inteligência Artificial para Construção Civil
              </p>
            </div>
          </div>
        `
      };

    case 'password_reset':
      return {
        subject: '🔐 Redefinir senha - MadenAI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">MadenAI</h1>
              <p style="color: #64748b; font-size: 18px;">Redefinição de Senha</p>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #92400e; margin-bottom: 15px;">🔐 Solicitação de Nova Senha</h2>
              <p style="color: #92400e; line-height: 1.6;">
                Olá ${userName}, recebemos uma solicitação para redefinir a senha da sua conta MadenAI.
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                Para criar uma nova senha, clique no botão abaixo. Este link expira em 1 hora por segurança.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetData?.reset_url}" 
                 style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Redefinir Minha Senha
              </a>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1e293b; margin-bottom: 10px;">🛡️ Dicas de Segurança:</h3>
              <ul style="color: #475569; line-height: 1.8; margin: 0;">
                <li>Use uma senha forte com pelo menos 8 caracteres</li>
                <li>Combine letras maiúsculas, minúsculas, números e símbolos</li>
                <li>Não reutilize senhas de outras contas</li>
              </ul>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; color: #64748b; font-size: 14px; text-align: center;">
              <p>Se você não solicitou esta alteração, ignore este email. Sua senha permanecerá inalterada.</p>
              <p style="margin-top: 10px;">
                <strong>MadenAI</strong> - Inteligência Artificial para Construção Civil
              </p>
            </div>
          </div>
        `
      };

    case 'project_milestone':
      return {
        subject: `🎉 Parabéns! Você completou ${userData?.project_count} projetos na MadenAI!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">MadenAI</h1>
              <p style="color: #64748b; font-size: 18px;">Marco Conquistado!</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
              <h2 style="margin-bottom: 15px; font-size: 24px;">🏆 PARABÉNS ${userName}!</h2>
              <p style="font-size: 18px; margin-bottom: 10px;">
                Você completou <strong>${userData?.project_count} projetos</strong> na MadenAI!
              </p>
              <p style="opacity: 0.9;">
                Este é um marco importante na sua jornada de inovação na construção civil.
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e293b; margin-bottom: 15px;">🎯 Seus Próximos Desafios:</h3>
              <ul style="color: #475569; line-height: 1.8;">
                <li>Explore recursos avançados de IA</li>
                <li>Otimize ainda mais seus orçamentos</li>
                <li>Use cronogramas preditivos</li>
                <li>Convide sua equipe para colaborar</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'}/dashboard" 
                 style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Continuar Inovando
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; color: #64748b; font-size: 14px; text-align: center;">
              <p>Continue transformando a construção civil com inteligência artificial!</p>
              <p style="margin-top: 10px;">
                <strong>MadenAI</strong> - Inteligência Artificial para Construção Civil
              </p>
            </div>
          </div>
        `
      };

    default:
      return {
        subject: `Notificação MadenAI - ${userName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">MadenAI</h1>
              <p style="color: #64748b;">Você tem uma nova notificação</p>
            </div>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 8px;">
              <h2 style="color: #1e293b; margin-bottom: 15px;">Olá ${userName}!</h2>
              <p style="color: #475569; line-height: 1.6;">
                Você recebeu uma notificação da MadenAI. Acesse sua conta para mais detalhes.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'}/dashboard" 
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Acessar Conta
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; color: #64748b; font-size: 14px; text-align: center;">
              <p><strong>MadenAI</strong> - Inteligência Artificial para Construção Civil</p>
            </div>
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

    // Para reset de senha, não requer autenticação
    if (emailRequest.email_type === 'password_reset') {
      console.log('🔓 EMAIL-SYSTEM: Reset de senha - sem autenticação requerida');
      
      // Rate limiting básico para prevenir spam
      const rateLimitKey = `reset_${emailRequest.recipient_email}`;
      // Em produção, implementar rate limiting adequado com Redis ou similar
      
    } else {
      // Para outros tipos de email, requer autenticação
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
    }

    // Gerar conteúdo do email
    const emailContent = generateEmailContent(
      emailRequest.email_type,
      emailRequest.user_data,
      emailRequest.reset_data,
      emailRequest.extra_data
    );

    console.log('📧 EMAIL-SYSTEM: Enviando email via Resend para:', emailRequest.recipient_email);

    // Enviar email via Resend usando domínio verificado
    const emailResponse = await resend.emails.send({
      from: "MadenAI <onboarding@resend.dev>",
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