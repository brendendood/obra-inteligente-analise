import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  email_types: string[];
  test_mode?: boolean;
  limit?: number;
}

const SENDER_MAP: Record<string, { email: string; name: string; replyTo?: string }> = {
  welcome_user: { email: 'boas-vindas@madeai.com.br', name: 'Equipe MadenAI' },
  onboarding_step1: { email: 'onboarding@madeai.com.br', name: 'MadenAI Onboarding' },
  default: { email: 'noreply@madeai.com.br', name: 'MadenAI' }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email_types, test_mode = false, limit }: BulkEmailRequest = await req.json();

    console.log(`📧 BULK-SENDER: Iniciando envio em massa`, { email_types, test_mode, limit });

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all users with valid emails - JOIN correto com auth.users
    let query = supabase
      .from('user_profiles')
      .select(`
        user_id,
        full_name,
        email:user_id (email)
      `)
      .not('user_id', 'is', null);

    if (limit) {
      query = query.limit(limit);
    }

    const { data: users, error: usersError } = await query;

    if (usersError) {
      console.error('❌ BULK-SENDER: Erro ao buscar usuários:', usersError);
      throw new Error(`Erro ao buscar usuários: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Nenhum usuário encontrado' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`📧 BULK-SENDER: Encontrados ${users.length} usuários`);

    // Process emails in batches to avoid rate limiting
    const batchSize = 5;
    const results = {
      total_users: users.length,
      total_emails: users.length * email_types.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      // Process each user in the batch
      for (const user of batch) {
        const userEmail = (user.email as any)?.email;
        const userName = user.full_name || 'Usuário';

        if (!userEmail) {
          results.failed++;
          results.errors.push(`Usuário ${user.user_id}: email não encontrado`);
          continue;
        }

        // Send each selected email type
        for (const emailType of email_types) {
          try {
            const senderInfo = SENDER_MAP[emailType] || SENDER_MAP.default;
            
            // Get email content based on type
            const emailContent = getEmailContent(emailType, userName, userEmail);
            
            if (test_mode) {
              console.log(`🧪 TEST-MODE: Email ${emailType} para ${userEmail}:`, emailContent.subject);
              results.successful++;
              continue;
            }

            // Send real email
            const emailResponse = await resend.emails.send({
              from: `${senderInfo.name} <${senderInfo.email}>`,
              to: [userEmail],
              subject: emailContent.subject,
              html: emailContent.html,
              replyTo: senderInfo.replyTo || senderInfo.email
            });

            if (emailResponse.error) {
              throw new Error(emailResponse.error.message);
            }

            results.successful++;
            console.log(`✅ BULK-SENDER: Email ${emailType} enviado para ${userEmail}`);

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (error: any) {
            results.failed++;
            results.errors.push(`${emailType} para ${userEmail}: ${error.message}`);
            console.error(`❌ BULK-SENDER: Erro ao enviar ${emailType} para ${userEmail}:`, error);
          }
        }
      }

      // Longer delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Log bulk sending activity
    try {
      await supabase.from('admin_security_logs').insert({
        admin_id: '00000000-0000-0000-0000-000000000000', // System action
        action_type: 'bulk_email_sent',
        details: {
          email_types,
          test_mode,
          total_users: results.total_users,
          successful: results.successful,
          failed: results.failed,
          timestamp: new Date().toISOString()
        },
        success: true
      });
    } catch (logError) {
      console.error('❌ BULK-SENDER: Erro ao registrar log:', logError);
    }

    console.log(`📧 BULK-SENDER: Concluído`, results);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Envio concluído: ${results.successful} sucessos, ${results.failed} falhas`,
        ...results
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error: any) {
    console.error('❌ BULK-SENDER: Erro geral:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

function getEmailContent(emailType: string, userName: string, userEmail: string): { subject: string; html: string } {
  const baseUrl = 'https://madeai.com.br';
  
  switch (emailType) {
    case 'welcome_user':
      return {
        subject: `🎉 Bem-vindo(a) à MadenAI, ${userName}!`,
        html: `
          <h1>Bem-vindo(a) à MadenAI!</h1>
          <p>Olá <strong>${userName}</strong>,</p>
          <p>É com grande satisfação que damos as boas-vindas à nossa plataforma de gestão de obras com inteligência artificial!</p>
          <p>Agora você pode:</p>
          <ul>
            <li>✅ Criar e gerenciar projetos de construção</li>
            <li>🤖 Usar nossa IA para análises inteligentes</li>
            <li>📊 Gerar orçamentos automáticos</li>
            <li>📅 Criar cronogramas otimizados</li>
          </ul>
          <p>
            <a href="${baseUrl}/dashboard" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Acessar Plataforma
            </a>
          </p>
          <p>Equipe MadenAI</p>
        `
      };

    case 'onboarding_step1':
      return {
        subject: `🚀 Primeiros passos na MadenAI - ${userName}`,
        html: `
          <h1>Seus primeiros passos na MadenAI</h1>
          <p>Olá <strong>${userName}</strong>,</p>
          <p>Para aproveitar ao máximo nossa plataforma, preparamos um guia rápido:</p>
          <ol>
            <li><strong>Faça upload do seu primeiro projeto</strong> - Adicione plantas, documentos ou dados</li>
            <li><strong>Explore o assistente IA</strong> - Faça perguntas sobre seu projeto</li>
            <li><strong>Gere um orçamento</strong> - Nossa IA criará estimativas precisas</li>
            <li><strong>Crie um cronograma</strong> - Planeje todas as etapas da obra</li>
          </ol>
          <p>
            <a href="${baseUrl}/upload" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Começar Agora
            </a>
          </p>
          <p>Qualquer dúvida, estamos aqui para ajudar!</p>
          <p>Equipe MadenAI</p>
        `
      };

    case 'project_milestone':
      return {
        subject: `🎯 Parabéns pelo marco alcançado, ${userName}!`,
        html: `
          <h1>Parabéns pelo seu progresso!</h1>
          <p>Olá <strong>${userName}</strong>,</p>
          <p>Você está indo muito bem na MadenAI! Continue explorando todas as funcionalidades.</p>
          <p>Que tal experimentar:</p>
          <ul>
            <li>🔄 Atualizar um orçamento existente</li>
            <li>📈 Exportar relatórios em PDF</li>
            <li>🎯 Usar filtros avançados</li>
          </ul>
          <p>
            <a href="${baseUrl}/dashboard" style="background: #fd7e14; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver Projetos
            </a>
          </p>
          <p>Continue o excelente trabalho!</p>
          <p>Equipe MadenAI</p>
        `
      };

    case 'usage_limit_reached':
      return {
        subject: `⚡ Expanda suas possibilidades na MadenAI, ${userName}`,
        html: `
          <h1>Hora de expandir suas possibilidades</h1>
          <p>Olá <strong>${userName}</strong>,</p>
          <p>Vemos que você está aproveitando muito bem a MadenAI! 🎉</p>
          <p>Para continuar criando projetos ilimitados, considere nossos planos pagos:</p>
          <ul>
            <li>✅ Projetos ilimitados</li>
            <li>🤖 IA avançada</li>
            <li>📊 Relatórios premium</li>
            <li>🎯 Suporte prioritário</li>
          </ul>
          <p>
            <a href="${baseUrl}/plan" style="background: #6f42c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver Planos
            </a>
          </p>
          <p>Equipe MadenAI</p>
        `
      };

    default:
      return {
        subject: `Mensagem da MadenAI para ${userName}`,
        html: `
          <h1>Olá ${userName}!</h1>
          <p>Esta é uma mensagem de teste da MadenAI.</p>
          <p>
            <a href="${baseUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Acessar MadenAI
            </a>
          </p>
          <p>Equipe MadenAI</p>
        `
      };
  }
}

serve(handler);