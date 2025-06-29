
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertEmailRequest {
  alert_type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  project_id?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      alert_type, 
      message, 
      severity, 
      user_id, 
      project_id, 
      metadata 
    }: AlertEmailRequest = await req.json();

    console.log(`📧 SEND-ALERT-EMAIL: Processando alerta ${alert_type} com severidade ${severity}`);

    // Obter dados do usuário se fornecido
    let userData = null;
    if (user_id) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, user_id')
        .eq('user_id', user_id)
        .single();

      if (profile) {
        // Obter email do usuário via auth
        const { data: authUser } = await supabase.auth.admin.getUserById(user_id);
        userData = {
          name: profile.full_name || 'Usuário',
          email: authUser.user?.email
        };
      }
    }

    // Obter dados do projeto se fornecido
    let projectData = null;
    if (project_id) {
      const { data: project } = await supabase
        .from('projects')
        .select('name')
        .eq('id', project_id)
        .single();

      projectData = project;
    }

    // Preparar conteúdo do email baseado no tipo de alerta
    const emailContent = generateEmailContent(alert_type, message, severity, userData, projectData, metadata);

    // Lista de emails administrativos para receber alertas críticos
    const adminEmails = ['admin@madenai.com', 'suporte@madenai.com'];
    const recipientEmails = [];

    // Adicionar email do usuário se disponível e alerta for para usuário
    if (userData?.email && ['user_inactive', 'subscription_expiring', 'project_stalled'].includes(alert_type)) {
      recipientEmails.push(userData.email);
    }

    // Adicionar admins para alertas do sistema
    if (['ai_cost_spike', 'system_error', 'high_usage'].includes(alert_type) || severity === 'critical') {
      recipientEmails.push(...adminEmails);
    }

    if (recipientEmails.length === 0) {
      console.log('📧 SEND-ALERT-EMAIL: Nenhum destinatário definido para este tipo de alerta');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Nenhum destinatário necessário para este alerta' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simular envio de email (aqui você integraria com Resend, SendGrid, etc.)
    console.log('📧 EMAIL SIMULADO:');
    console.log(`Para: ${recipientEmails.join(', ')}`);
    console.log(`Assunto: ${emailContent.subject}`);
    console.log(`Conteúdo: ${emailContent.html}`);

    // Registrar tentativa de envio
    await supabase
      .from('alert_logs')
      .insert({
        alert_type: `email_${alert_type}`,
        message: `Email enviado para: ${recipientEmails.join(', ')}`,
        severity: 'low',
        metadata: {
          recipients: recipientEmails,
          subject: emailContent.subject,
          original_alert: { alert_type, message, severity, metadata }
        }
      });

    console.log('✅ SEND-ALERT-EMAIL: Email de alerta processado com sucesso');

    return new Response(JSON.stringify({
      success: true,
      recipients: recipientEmails,
      subject: emailContent.subject
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 SEND-ALERT-EMAIL: Erro crítico:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateEmailContent(
  alertType: string, 
  message: string, 
  severity: string, 
  userData: any, 
  projectData: any, 
  metadata: any
) {
  const baseSubject = 'MadenAI - Alerta do Sistema';
  const severityEmoji = {
    low: '🔵',
    medium: '🟡', 
    high: '🟠',
    critical: '🔴'
  };

  const templates: Record<string, any> = {
    user_inactive: {
      subject: `${severityEmoji[severity as keyof typeof severityEmoji]} Que tal voltar aos seus projetos?`,
      html: `
        <h2>Olá ${userData?.name || 'Usuário'}!</h2>
        <p>Notamos que você não acessa a MadenAI há alguns dias.</p>
        <p>Seus projetos estão te esperando! Que tal continuar de onde parou?</p>
        <p><strong>Mensagem:</strong> ${message}</p>
        <p><a href="https://app.madenai.com/painel" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Acessar Meus Projetos</a></p>
        <p>Equipe MadenAI</p>
      `
    },
    project_stalled: {
      subject: `${severityEmoji[severity as keyof typeof severityEmoji]} Projeto aguardando cronograma`,
      html: `
        <h2>Olá ${userData?.name || 'Usuário'}!</h2>
        <p>Seu projeto <strong>${projectData?.name || 'projeto'}</strong> está pronto para o próximo passo.</p>
        <p>Que tal gerar o cronograma de execução?</p>
        <p><strong>Detalhes:</strong> ${message}</p>
        <p><a href="https://app.madenai.com/projetos" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Gerar Cronograma</a></p>
        <p>Equipe MadenAI</p>
      `
    },
    ai_cost_spike: {
      subject: `${severityEmoji[severity as keyof typeof severityEmoji]} Alerta: Pico de Custo IA`,
      html: `
        <h2>Alerta Administrativo - MadenAI</h2>
        <p><strong>Tipo:</strong> Pico de Custo de IA</p>
        <p><strong>Severidade:</strong> ${severity.toUpperCase()}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
        <p><strong>Dados:</strong></p>
        <ul>
          <li>Custo Diário: $${metadata?.daily_cost || 'N/A'}</li>
          <li>Limite Configurado: $${metadata?.limit || 'N/A'}</li>
        </ul>
        <p>Verifique o painel administrativo para mais detalhes.</p>
      `
    },
    subscription_expiring: {
      subject: `${severityEmoji[severity as keyof typeof severityEmoji]} Seu plano MadenAI está expirando`,
      html: `
        <h2>Olá ${userData?.name || 'Usuário'}!</h2>
        <p>Seu plano <strong>${metadata?.plan_name || 'atual'}</strong> expira em breve.</p>
        <p><strong>Detalhes:</strong> ${message}</p>
        <p>Para continuar aproveitando todos os recursos da MadenAI, renove seu plano:</p>
        <p><a href="https://app.madenai.com/conta" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Renovar Plano</a></p>
        <p>Equipe MadenAI</p>
      `
    }
  };

  return templates[alertType] || {
    subject: `${baseSubject} - ${alertType}`,
    html: `
      <h2>Alerta do Sistema MadenAI</h2>
      <p><strong>Tipo:</strong> ${alertType}</p>
      <p><strong>Severidade:</strong> ${severity}</p>
      <p><strong>Mensagem:</strong> ${message}</p>
      <p>Equipe MadenAI</p>
    `
  };
}
