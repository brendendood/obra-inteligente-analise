
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  emailType: string;
  recipient: string;
  customSubject?: string;
  customMessage?: string;
  templateData: {
    userName: string;
    projectName?: string;
    loginUrl?: string;
    resetUrl?: string;
    projectUrl?: string;
    supportUrl?: string;
    platformUrl?: string;
    processingTime?: string;
    documentType?: string;
    downloadUrl?: string;
    expiresIn?: string;
    errorDetails?: string;
    featureTitle?: string;
    featureDescription?: string;
  };
}

const generateEmailHTML = (emailType: string, templateData: any, customMessage?: string): { subject: string; html: string } => {
  const baseStyle = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
      .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center; }
      .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
      .content { padding: 40px 30px; }
      .title { color: #1e293b; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
      .text { color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 20px; }
      .cta-button { display: inline-block; background: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
      .footer { background-color: #f1f5f9; padding: 30px 20px; text-align: center; }
      .footer-text { color: #64748b; font-size: 14px; line-height: 20px; margin-bottom: 10px; }
      .footer-links { margin-top: 15px; }
      .footer-link { color: #3b82f6; text-decoration: none; margin: 0 10px; font-size: 14px; }
      .alert-success { background: #d1fae5; border: 1px solid #10b981; color: #047857; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
      .alert-error { background: #fee2e2; border: 1px solid #ef4444; color: #dc2626; padding: 20px; margin: 20px 0; border-radius: 8px; }
      .alert-warning { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; margin: 20px 0; border-radius: 8px; }
      .alert-info { background: #f0f9ff; border: 1px solid #0ea5e9; color: #0c4a6e; padding: 20px; margin: 20px 0; border-radius: 8px; }
      ul { margin-left: 20px; margin-bottom: 20px; }
      li { margin-bottom: 8px; }
      @media (max-width: 600px) {
        .content { padding: 30px 20px; }
        .title { font-size: 20px; }
        .text { font-size: 15px; }
        .cta-button { display: block; text-align: center; }
      }
    </style>
  `;

  const header = `
    <div class="header">
      <h1 class="logo">MadenAI</h1>
    </div>
  `;

  const footer = `
    <div class="footer">
      <p class="footer-text">
        <strong>Equipe MadenAI</strong><br />
        Plataforma de gestão e análise de obras com IA<br />
        arqcloud.com.br
      </p>
      <div class="footer-links">
        <a href="https://arqcloud.com.br/suporte" class="footer-link">Suporte</a>
        <a href="https://arqcloud.com.br/privacidade" class="footer-link">Privacidade</a>
        <a href="https://arqcloud.com.br/termos" class="footer-link">Termos</a>
      </div>
    </div>
  `;

  let subject = "";
  let content = "";
  let ctaButton = "";

  switch (emailType) {
    case 'welcome':
      subject = "Bem-vindo à MadenAI!";
      ctaButton = `<div style="text-align: center;"><a href="${templateData.loginUrl}" class="cta-button">Acessar Plataforma</a></div>`;
      content = `
        <h2 class="title">Bem-vindo à MadenAI!</h2>
        <p class="text">Olá, <strong>${templateData.userName}</strong>!</p>
        <p class="text">Seja muito bem-vindo à <strong>MadenAI</strong>, a plataforma de gestão e análise de obras com inteligência artificial mais avançada do mercado.</p>
        <p class="text">Sua conta foi criada com sucesso e você já pode começar a usar todas as funcionalidades disponíveis:</p>
        <ul>
          <li>📊 Análise automática de projetos com IA</li>
          <li>💰 Geração de orçamentos detalhados</li>
          <li>📅 Cronogramas inteligentes</li>
          <li>🤖 Assistente virtual especializado</li>
          <li>📄 Gestão completa de documentos</li>
        </ul>
        <p class="text">Estamos aqui para revolucionar a forma como você gerencia seus projetos. Qualquer dúvida, nossa equipe de suporte está sempre disponível.</p>
        ${ctaButton}
      `;
      break;

    case 'password-reset':
      subject = "Redefinição de Senha - MadenAI";
      ctaButton = `<div style="text-align: center;"><a href="${templateData.resetUrl}" class="cta-button">Redefinir Senha</a></div>`;
      content = `
        <h2 class="title">Redefinição de Senha</h2>
        <p class="text">Olá, <strong>${templateData.userName}</strong>!</p>
        <p class="text">Recebemos uma solicitação para redefinir a senha da sua conta na <strong>MadenAI</strong>.</p>
        <p class="text">Se você fez esta solicitação, clique no botão abaixo para criar uma nova senha. Este link é válido por <strong>24 horas</strong>.</p>
        <div class="alert-warning">
          <p style="margin: 0; font-size: 14px;">⚠️ <strong>Importante:</strong> Se você não solicitou esta redefinição, ignore este e-mail. Sua senha permanecerá inalterada.</p>
        </div>
        <p class="text">Por segurança, recomendamos que você escolha uma senha forte e única para proteger sua conta.</p>
        ${ctaButton}
      `;
      break;

    case 'project-processed':
      subject = `Projeto "${templateData.projectName}" Processado com Sucesso!`;
      ctaButton = `<div style="text-align: center;"><a href="${templateData.projectUrl}" class="cta-button">Ver Projeto</a></div>`;
      content = `
        <h2 class="title">Projeto Processado com Sucesso!</h2>
        <p class="text">Olá, <strong>${templateData.userName}</strong>!</p>
        <p class="text">Temos ótimas notícias! Seu projeto <strong>"${templateData.projectName}"</strong> foi processado com sucesso pela nossa inteligência artificial.</p>
        <div class="alert-success">
          <p style="margin: 0; font-weight: bold;">✅ Análise Concluída</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Tempo de processamento: ${templateData.processingTime}</p>
        </div>
        <p class="text">Agora você pode acessar:</p>
        <ul>
          <li>📊 Análise detalhada do projeto</li>
          <li>💰 Orçamento automatizado</li>
          <li>📅 Cronograma otimizado</li>
          <li>📄 Relatórios em PDF</li>
        </ul>
        <p class="text">Clique no botão abaixo para visualizar todos os resultados e começar a trabalhar com os dados gerados.</p>
        ${ctaButton}
      `;
      break;

    case 'document-export':
      subject = `Documento "${templateData.documentType}" Pronto para Download`;
      ctaButton = `<div style="text-align: center;"><a href="${templateData.downloadUrl}" class="cta-button">Baixar Documento</a></div>`;
      content = `
        <h2 class="title">Documento Pronto para Download</h2>
        <p class="text">Olá, <strong>${templateData.userName}</strong>!</p>
        <p class="text">Seu <strong>${templateData.documentType}</strong> do projeto <strong>"${templateData.projectName}"</strong> foi gerado com sucesso e está pronto para download.</p>
        <div class="alert-info">
          <p style="margin: 0; font-weight: bold;">📄 Documento Disponível</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Tipo: ${templateData.documentType}</p>
        </div>
        <p class="text">O documento contém todas as informações processadas pela nossa IA, incluindo análises detalhadas, cálculos precisos e recomendações personalizadas para seu projeto.</p>
        <div class="alert-warning">
          <p style="margin: 0; font-size: 14px;">⏰ <strong>Atenção:</strong> Este link de download expira em ${templateData.expiresIn}. Faça o download assim que possível.</p>
        </div>
        <p class="text">Após o download, você pode visualizar, imprimir ou compartilhar o documento conforme necessário.</p>
        ${ctaButton}
      `;
      break;

    case 'project-error':
      subject = `Erro no Processamento do Projeto "${templateData.projectName}"`;
      ctaButton = `<div style="text-align: center;"><a href="${templateData.supportUrl}" class="cta-button">Contatar Suporte</a></div>`;
      content = `
        <h2 class="title">Erro no Processamento do Projeto</h2>
        <p class="text">Olá, <strong>${templateData.userName}</strong>!</p>
        <p class="text">Infelizmente, encontramos um problema ao processar seu projeto <strong>"${templateData.projectName}"</strong> em nossa plataforma.</p>
        <div class="alert-error">
          <p style="margin: 0; font-weight: bold;">⚠️ Erro Detectado</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">${templateData.errorDetails}</p>
        </div>
        <p class="text"><strong>O que estamos fazendo:</strong></p>
        <ul>
          <li>Nossa equipe técnica foi notificada automaticamente</li>
          <li>Estamos investigando a causa do problema</li>
          <li>Trabalharemos para processar seu projeto o mais rápido possível</li>
        </ul>
        <p class="text"><strong>O que você pode fazer:</strong></p>
        <ul>
          <li>Verificar se o arquivo está no formato correto (PDF, DWG, etc.)</li>
          <li>Tentar fazer upload novamente em alguns minutos</li>
          <li>Entrar em contato conosco se o problema persistir</li>
        </ul>
        <p class="text">Pedimos desculpas pelo inconveniente e agradecemos sua paciência. Nossa equipe de suporte está disponível 24/7 para ajudá-lo.</p>
        ${ctaButton}
      `;
      break;

    case 'feature-update':
      subject = `Nova Funcionalidade: ${templateData.featureTitle}`;
      ctaButton = `<div style="text-align: center;"><a href="${templateData.platformUrl}" class="cta-button">Explorar Novidades</a></div>`;
      content = `
        <h2 class="title">Nova Funcionalidade Disponível!</h2>
        <p class="text">Olá, <strong>${templateData.userName}</strong>!</p>
        <p class="text">Temos o prazer de anunciar uma nova funcionalidade na <strong>MadenAI</strong> que vai tornar sua experiência ainda melhor!</p>
        <div class="alert-info">
          <p style="margin: 0; font-weight: bold; font-size: 18px;">🚀 ${templateData.featureTitle}</p>
          <p style="margin: 10px 0 0 0; font-size: 15px;">${templateData.featureDescription}</p>
        </div>
        <p class="text"><strong>Por que isso é importante para você:</strong></p>
        <ul>
          <li>Maior produtividade em seus projetos</li>
          <li>Análises mais precisas e detalhadas</li>
          <li>Interface mais intuitiva e fácil de usar</li>
          <li>Economia de tempo significativa</li>
        </ul>
        <p class="text">A funcionalidade já está disponível em sua conta e pode ser acessada imediatamente. Preparamos também tutoriais e guias para ajudá-lo a aproveitar ao máximo esta novidade.</p>
        <p class="text">Continue acompanhando nossas atualizações - temos muitas outras melhorias chegando em breve!</p>
        ${ctaButton}
      `;
      break;

    default:
      subject = "Mensagem da MadenAI";
      content = `
        <h2 class="title">Mensagem da MadenAI</h2>
        <p class="text">Olá, <strong>${templateData.userName}</strong>!</p>
        <p class="text">Você recebeu uma mensagem da equipe MadenAI.</p>
      `;
      break;
  }

  // Adicionar mensagem personalizada se fornecida
  if (customMessage) {
    content += `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <p style="margin: 0; color: #475569; font-style: italic;">${customMessage}</p>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        ${baseStyle}
      </head>
      <body>
        <div class="container">
          ${header}
          <div class="content">
            ${content}
          </div>
          ${footer}
        </div>
      </body>
    </html>
  `;

  return { subject, html };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailType, recipient, customSubject, customMessage, templateData }: EmailRequest = await req.json();

    console.log(`Enviando e-mail tipo: ${emailType} para: ${recipient}`);

    // Gerar HTML do e-mail
    const { subject: defaultSubject, html } = generateEmailHTML(emailType, templateData, customMessage);
    const finalSubject = customSubject || defaultSubject;

    // Enviar e-mail via Resend
    const emailResponse = await resend.emails.send({
      from: "MadenAI <noreply@arqcloud.com.br>",
      to: [recipient],
      subject: finalSubject,
      html: html,
      replyTo: "suporte@arqcloud.com.br",
      headers: {
        'X-Mailer': 'MadenAI Platform',
        'X-Priority': '3',
      }
    });

    console.log("E-mail enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.data?.id,
      recipient,
      emailType,
      subject: finalSubject
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Erro ao enviar e-mail:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Erro desconhecido ao enviar e-mail"
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
