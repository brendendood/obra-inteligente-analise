import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email_type: 'welcome' | 'password_reset' | 'project_milestone' | 'account_cancelled';
  recipient_email: string;
  user_data?: {
    full_name?: string;
    project_count?: number;
    user_id?: string;
  };
  reset_data?: {
    reset_url?: string;
    token?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email_type, recipient_email, user_data, reset_data }: EmailRequest = await req.json();
    
    console.log(`📧 SEND-EMAILS: Enviando email tipo "${email_type}" para ${recipient_email}`);

    // Inicializar Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Gerar conteúdo do email baseado no tipo
    const emailContent = generateEmailContent(email_type, user_data, reset_data);

    // Enviar email via Resend
    const emailResponse = await resend.emails.send({
      from: "MadenAI <noreply@arqcloud.com.br>",
      to: [recipient_email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("✅ SEND-EMAILS: Email enviado:", emailResponse);

    // Registrar log do email
    await supabase.from('email_logs').insert({
      user_id: user_data?.user_id || null,
      email_type,
      recipient_email,
      subject: emailContent.subject,
      status: 'sent',
      template_version: '1.0',
      metadata: { email_id: emailResponse.data?.id, user_data, reset_data }
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ SEND-EMAILS: Erro:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateEmailContent(
  emailType: string, 
  userData?: any, 
  resetData?: any
): { subject: string; html: string } {
  
  const userName = userData?.full_name || 'Usuário';
  const baseUrl = 'https://arqcloud.com.br';

  switch (emailType) {
    case 'welcome':
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