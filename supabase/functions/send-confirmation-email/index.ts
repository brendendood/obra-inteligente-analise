import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "https://esm.sh/resend@4.0.0";

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

// Template de confirmação anti-spam otimizado
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
      console.warn(`⚠️ Template 'signup_confirmation' não encontrado, usando template padrão`);
      return generateDefaultConfirmationEmail(userName, confirmationUrl);
    }

    // Substituir variáveis no subject e HTML
    let processedSubject = template.subject || 'Verifique sua conta MadeAI';
    let processedHtml = template.html || '';

    // Variáveis do email de confirmação
    const variables = {
      '{{ .ConfirmationURL }}': confirmationUrl,
      '{{user_name}}': userName,
      '{{full_name}}': userName,
      '{{confirmation_url}}': confirmationUrl,
      '{{confirmation_token}}': emailData.token,
      '{{site_url}}': emailData.site_url,
      '{{dashboard_url}}': `${emailData.site_url}/dashboard`,
      '{{support_email}}': 'contato@madeai.com.br'
    };

    // Aplicar substituições
    Object.entries(variables).forEach(([key, value]) => {
      processedSubject = processedSubject.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
      processedHtml = processedHtml.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });

    return {
      subject: processedSubject,
      html: processedHtml
    };

  } catch (error) {
    console.error('❌ Erro ao buscar template:', error);
    return generateDefaultConfirmationEmail(userName, confirmationUrl);
  }
};

// Template padrão anti-spam com HTML especificado
const generateDefaultConfirmationEmail = (userName: string, confirmationUrl: string) => {
  return {
    subject: 'Verifique sua conta MadeAI',
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="pt">
<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Verifique sua conta MadeAI</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 20px;
      background-color: #018CFF;
      font-family: Arial, sans-serif;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 30px;
      padding: 20px;
      max-width: 600px;
      margin: auto;
    }
    .es-button {
      background: #31CB4B;
      color: #ffffff;
      font-weight: bold;
      border-radius: 15px;
      padding: 15px 30px;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
    }
    .es-button:hover {
      background: #28a73e;
    }
    .link-fallback {
      word-break: break-all;
      color: #1376C8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding-bottom: 20px;">
          <img src="https://fvlfgss.stripocdn.email/content/guids/CABINET_370106225da0f9388993368c1eb7e1b1d2aa0ebf1eed50a23d34716d8e4cad58/images/1.png" alt="Logo MadeAI" width="200" style="display:block; border:0; outline:none; text-decoration:none;">
        </td>
      </tr>
      <tr>
        <td>
          <h1 style="color:#333333; font-family: Arial, sans-serif; font-size: 24px; margin-bottom: 10px;">Verifique sua conta MadeAI.</h1>
          <hr style="border:none; border-top:1px solid #cccccc; margin: 20px 0;">
          <p style="font-size:18px; color:#333333; font-family: Arial, sans-serif; line-height: 1.5;">
            Bem vindo(a) à MadeAI, clique no botão abaixo para <strong>verificar seu e-mail</strong> e começar a explorar a Made.
          </p>
          <div style="text-align:center; margin: 30px 0;">
            <a href="${confirmationUrl}" target="_blank" class="es-button">Verificar endereço de e-mail</a>
          </div>
          <p style="font-size:14px; color:#666666; font-family: Arial, sans-serif; line-height: 1.5;">
            Se o botão não funcionar, clique no link abaixo:<br>
            <a href="${confirmationUrl}" class="link-fallback">${confirmationUrl}</a>
          </p>
          <p style="font-size:16px; color:#333333; font-family: Arial, sans-serif; line-height: 1.5; margin-top: 30px;">
            Se você acha que recebeu esse e-mail por engano, não hesite em enviar uma mensagem para 
            <a href="mailto:contato@madeai.com.br" style="color:#1376C8; text-decoration: none;">contato@madeai.com.br</a>. 
            <strong>Nosso time de suporte 💬 irá te responder e te ajudar com isso.</strong>
          </p>
          <p style="font-size:16px; color:#333333; font-family: Arial, sans-serif; line-height: 1.5;">
            <strong>Obrigado.<br>Equipe MadeAI.</strong>
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
            <p style="font-size:12px; color:#999999; font-family: Arial, sans-serif;">
              © 2024 MadeAI. Todos os direitos reservados.<br>
              Este é um e-mail automático, não responda a esta mensagem.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('🔍 CONFIRMATION-EMAIL: Payload recebido:', JSON.stringify(payload, null, 2));

    const { user, email_data }: AuthEvent = payload;

    if (!user?.email || !email_data?.token_hash) {
      console.error('❌ CONFIRMATION-EMAIL: Dados obrigatórios ausentes');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required data' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Buscar template e montar email
    const emailTemplate = await getConfirmationEmailTemplate(supabaseClient, user, email_data);

    // Configuração anti-spam para Resend
    const emailResponse = await resend.emails.send({
      from: 'MadeAI <noreply@madeai.com.br>',
      to: [user.email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      // Headers anti-spam
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'List-Unsubscribe': '<mailto:contato@madeai.com.br?subject=Unsubscribe>',
        'X-Mailer': 'MadeAI Email System',
      },
      // Tags para tracking
      tags: [
        { name: 'category', value: 'confirmation' },
        { name: 'environment', value: 'production' }
      ]
    });
    
    console.log(`✅ CONFIRMATION-EMAIL: Email enviado com sucesso para ${user.email}:`, emailResponse);

    // ========== AGENDAR EMAIL DE BOAS-VINDAS (10 segundos) ==========
    const welcomeEmailPromise = new Promise<void>((resolve) => {
      setTimeout(async () => {
        try {
          console.log('🎉 WELCOME-EMAIL: Iniciando envio do email de boas-vindas com delay de 10 segundos...');
          
          // Buscar dados do usuário para personalização
          const { data: userData, error: userError } = await supabaseClient
            .from('user_profiles')
            .select('full_name, user_id')
            .eq('user_id', user.id)
            .single();

          const userName = userData?.full_name || user?.raw_user_meta_data?.full_name || user?.email?.split('@')[0] || 'Usuário';
          
          const welcomeResponse = await fetch(`https://mozqijzvtbuwuzgemzsm.supabase.co/functions/v1/send-custom-emails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              email_type: 'welcome_user',
              recipient_email: user.email,
              user_data: {
                full_name: userName,
                user_id: user.id,
                email: user.email
              }
            })
          });

          if (welcomeResponse.ok) {
            const welcomeResult = await welcomeResponse.json();
            console.log('✅ WELCOME-EMAIL: Email de boas-vindas enviado com sucesso após 10 segundos:', welcomeResult);
          } else {
            const errorText = await welcomeResponse.text();
            console.error('❌ WELCOME-EMAIL: Falha no envio do email de boas-vindas:', errorText);
          }
          
        } catch (welcomeError) {
          console.error('❌ WELCOME-EMAIL: Erro no processamento do email de boas-vindas:', welcomeError);
        } finally {
          resolve();
        }
      }, 10000); // 10 segundos de delay conforme solicitado
    });

    // Aguardar o email de boas-vindas em background usando EdgeRuntime.waitUntil
    EdgeRuntime.waitUntil(welcomeEmailPromise);

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