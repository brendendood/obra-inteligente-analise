import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordEmailRequest {
  email: string;
  resetUrl: string;
}

// Buscar template do email de reset de senha no sistema de templates
const getPasswordResetTemplate = async (resetUrl: string) => {
  try {
    // Conectar ao Supabase usando service key para acessar templates
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Buscar template de password_reset
    const { data: template, error } = await supabaseClient
      .from('email_templates')
      .select('subject, html')
      .eq('template_key', 'password_reset')
      .eq('enabled', true)
      .single();

    if (error || !template) {
      console.warn('⚠️ Template password_reset não encontrado, usando fallback');
      return getFallbackTemplate(resetUrl);
    }

    // Substituir variável {{reset_url}} no template
    const processedSubject = template.subject || 'Recuperação de Senha - MadeAI';
    const processedHtml = template.html?.replace(/\{\{reset_url\}\}/g, resetUrl) || getFallbackTemplate(resetUrl).html;

    return {
      subject: processedSubject,
      html: processedHtml
    };

  } catch (error) {
    console.error('❌ Erro ao buscar template de reset:', error);
    return getFallbackTemplate(resetUrl);
  }
};

// Template fallback caso não consiga acessar o banco
const getFallbackTemplate = (resetUrl: string) => {
  return {
    subject: 'Recuperação de Senha - MadeAI',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha - MadeAI</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">MadeAI</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Recuperação de Senha</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Redefinir sua senha</h2>
            <p style="color: #475569; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
              Você solicitou a recuperação de senha para sua conta MadeAI. Clique no botão abaixo para criar uma nova senha:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Redefinir Senha
              </a>
            </div>
            <p style="color: #64748b; margin: 20px 0 0 0; font-size: 14px; line-height: 1.6;">
              Se você não solicitou esta recuperação, pode ignorar este email com segurança.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0; font-size: 14px;">© 2024 MadeAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl }: ResetPasswordEmailRequest = await req.json();

    if (!email || !resetUrl) {
      throw new Error("Email e URL de reset são obrigatórios");
    }

    console.log('📧 RESET-EMAIL: Buscando template de reset para:', email);

    // Buscar template do sistema de templates gerenciáveis
    const emailContent = await getPasswordResetTemplate(resetUrl);

    console.log('📧 RESET-EMAIL: Enviando email via Resend');

    const emailResponse = await resend.emails.send({
      from: "MadeAI <noreply@madeai.com.br>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("✅ Email de reset enviado:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Erro ao enviar email de reset:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);