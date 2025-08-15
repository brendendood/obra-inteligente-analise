import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  type: string;
  table: string;
  record?: any;
  schema: string;
  old_record?: any;
}

interface AuthEvent {
  user: {
    id: string;
    email: string;
    user_metadata?: any;
    raw_user_meta_data?: any;
  };
  email_data?: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

// Buscar template de confirmação e substituir variáveis
const getConfirmationEmailTemplate = async (supabaseClient: any, userData: any, emailData: any) => {
  const userName = userData?.raw_user_meta_data?.full_name || userData?.email?.split('@')[0] || 'Usuário';
  const confirmationUrl = `${emailData.site_url}/v?token_hash=${emailData.token_hash}&type=${emailData.email_action_type}&redirect_to=${encodeURIComponent(emailData.redirect_to || 'https://madeai.com.br/dashboard')}`;
  
  try {
    // Buscar template por template_key na tabela email_templates
    const { data: template, error } = await supabaseClient
      .from('email_templates')
      .select('subject, html')
      .eq('template_key', 'signup_confirmation')
      .eq('enabled', true)
      .single();

    if (error || !template) {
      console.warn(`⚠️ Template 'signup_confirmation' não encontrado, usando fallback`);
      return generateFallbackConfirmationEmail(userName, confirmationUrl, emailData.token);
    }

    // Substituir variáveis no subject e HTML
    let processedSubject = template.subject || 'Confirme sua conta na MadenAI';
    let processedHtml = template.html || '<p>Conteúdo não disponível</p>';

    // Variáveis do email de confirmação
    const variables = {
      '{{user_name}}': userName,
      '{{full_name}}': userName,
      '{{confirmation_url}}': confirmationUrl,
      '{{confirmation_token}}': emailData.token,
      '{{site_url}}': emailData.site_url,
      '{{dashboard_url}}': `${emailData.site_url}/dashboard`,
      '{{support_email}}': 'suporte@madeai.com.br'
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
    return generateFallbackConfirmationEmail(userName, confirmationUrl, emailData.token);
  }
};

// Fallback para email de confirmação
const generateFallbackConfirmationEmail = (userName: string, confirmationUrl: string, token: string) => {
  return {
    subject: `✅ Confirme sua conta na MadenAI`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirme sua conta - MadenAI</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                M
              </div>
              <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">MadenAI</h1>
            </div>
            
            <!-- Conteúdo -->
            <div style="text-align: center;">
              <h2 style="color: #334155; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                Bem-vindo, ${userName}! 🎉
              </h2>
              
              <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Sua conta foi criada com sucesso! Para começar a usar a plataforma MadenAI, 
                você precisa confirmar seu endereço de email clicando no botão abaixo.
              </p>
              
              <!-- Botão de Confirmação -->
              <div style="margin: 40px 0;">
                <a href="${confirmationUrl}" 
                   style="background: linear-gradient(135deg, #2563eb, #3b82f6); 
                          color: white; 
                          padding: 16px 32px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          font-size: 16px;
                          display: inline-block;
                          transition: all 0.2s;">
                  ✅ Confirmar Email
                </a>
              </div>
              
              <!-- Token alternativo -->
              <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #475569; font-size: 14px; margin-bottom: 10px;">
                  <strong>Ou use este código de confirmação:</strong>
                </p>
                <code style="font-family: 'Courier New', monospace; 
                           background: white; 
                           border: 1px solid #e2e8f0; 
                           border-radius: 4px; 
                           padding: 8px 12px; 
                           font-size: 16px; 
                           color: #1e293b; 
                           display: inline-block;">
                  ${token}
                </code>
              </div>
              
              <!-- Informações adicionais -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 40px;">
                <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                  Este link de confirmação expira em 24 horas. Se você não criou esta conta, 
                  pode ignorar este email com segurança.
                </p>
                
                <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
                  Precisa de ajuda? Entre em contato conosco em 
                  <a href="mailto:suporte@madeai.com.br" style="color: #2563eb; text-decoration: none;">
                    suporte@madeai.com.br
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 12px;">
              © 2024 MadenAI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📧 CONFIRMATION-EMAIL: Recebido webhook de confirmação');
    
    const authEvent: AuthEvent = await req.json();
    console.log('📧 CONFIRMATION-EMAIL: Event type:', authEvent);

    // Validar se é um evento de confirmação de usuário
    if (!authEvent.user || !authEvent.user.email || !authEvent.email_data) {
      console.log('❌ CONFIRMATION-EMAIL: Dados inválidos no webhook');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook data' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { user, email_data } = authEvent;
    
    // Criar cliente Supabase para buscar templates
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Buscar conteúdo do email usando templates do admin
    const emailContent = await getConfirmationEmailTemplate(
      supabaseClient,
      user,
      email_data
    );

    console.log('📧 CONFIRMATION-EMAIL: Enviando email via Resend para:', user.email);

    // Enviar email via Resend
    const emailResponse = await resend.emails.send({
      from: "MadenAI <suporte@madeai.com.br>",
      to: [user.email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (emailResponse.error) {
      console.error('❌ CONFIRMATION-EMAIL: Erro no Resend:', emailResponse.error);
      throw new Error(`Resend error: ${emailResponse.error.message}`);
    }

    console.log('✅ CONFIRMATION-EMAIL: Email enviado com sucesso:', emailResponse.data);

    // Log do envio na base de dados
    try {
      await supabaseClient.from('email_logs').insert({
        user_id: user.id,
        email_type: 'signup_confirmation',
        recipient_email: user.email,
        resend_id: emailResponse.data?.id,
        status: 'sent',
        sent_at: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('⚠️ CONFIRMATION-EMAIL: Falha ao registrar log (não crítico):', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent successfully',
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
    console.error('❌ CONFIRMATION-EMAIL: Erro geral:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send confirmation email' 
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