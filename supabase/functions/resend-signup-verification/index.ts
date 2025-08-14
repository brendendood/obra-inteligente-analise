import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupVerificationRequest {
  email: string;
  full_name?: string;
  verification_token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, full_name, verification_token }: SignupVerificationRequest = await req.json();

    if (!email || !verification_token) {
      return new Response(JSON.stringify({ error: 'Email e token são obrigatórios' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('📧 RESEND-SIGNUP: Enviando email de verificação para:', email);

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    // Gerar URL de verificação
    const verificationUrl = `https://madeai.com.br/verify-email?token=${verification_token}&email=${encodeURIComponent(email)}`;

    // Template HTML do email de verificação
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificação de Email - MadenAI</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">MadenAI</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Plataforma de Análise de Obras</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Bem-vindo${full_name ? `, ${full_name}` : ''}!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Obrigado por se cadastrar na MadenAI! Para completar seu cadastro e acessar nossa plataforma, 
                você precisa verificar seu email clicando no botão abaixo:
              </p>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: transform 0.2s;">
                  ✅ Verificar Email
                </a>
              </div>

              <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="color: #1e40af; font-weight: bold; margin: 0 0 10px 0; font-size: 14px;">
                  🔒 Link alternativo:
                </p>
                <p style="color: #64748b; font-size: 14px; word-break: break-all; margin: 0;">
                  ${verificationUrl}
                </p>
              </div>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 25px 0 0 0;">
                <strong>⚠️ Importante:</strong> Este link expira em 24 horas por motivos de segurança.
                Se você não solicitou este cadastro, ignore este email.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; text-align: center;">
                MadenAI - Transformando a gestão de obras com Inteligência Artificial
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                © 2024 MadenAI. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: 'MadenAI <noreply@madeai.com.br>',
      to: [email],
      subject: '🔐 Verificação de Email - MadenAI',
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error('❌ RESEND-SIGNUP: Erro ao enviar email:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log('✅ RESEND-SIGNUP: Email enviado com sucesso:', emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email de verificação enviado com sucesso!',
      email_id: emailResponse.data?.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("❌ RESEND-SIGNUP: Erro geral:", error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);