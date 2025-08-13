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
  verified_user: { email: 'verificacao@madeai.com.br', name: 'MadenAI Verificação' },
  welcome_user: { email: 'boas-vindas@madeai.com.br', name: 'Equipe MadenAI' },
  onboarding_step1: { email: 'onboarding@madeai.com.br', name: 'MadenAI Onboarding' },
  project_milestone: { email: 'notificacoes@madeai.com.br', name: 'MadenAI' },
  usage_limit_reached: { email: 'notificacoes@madeai.com.br', name: 'MadenAI' },
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

    // Buscar usuários para envio em massa usando RPC
    const { data: users, error: usersError } = await supabase
      .rpc('get_bulk_email_users', { limit_count: limit });

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
        const userEmail = user.email;
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
            
            // Preparar variáveis para o template
            const templateVars = {
              full_name: userName,
              app_name: 'MadenAI',
              login_url: 'https://app.madeai.com.br/login',
              support_email: 'suporte@madeai.com.br',
              user_email: userEmail
            };
            
            // Buscar template no banco
            const template = await getEmailTemplate(supabase, emailType, templateVars);
            
            if (!template) {
              results.failed++;
              results.errors.push(`${emailType} para ${userEmail}: Template não encontrado no banco de dados`);
              continue;
            }
            
            if (test_mode) {
              console.log(`🧪 TEST-MODE: Email ${emailType} para ${userEmail}:`, template.subject);
              results.successful++;
              continue;
            }

            // Send real email using template from database
            const emailResponse = await resend.emails.send({
              from: `${template.fromName} <${template.fromEmail}>`,
              to: [userEmail],
              subject: template.subject,
              html: template.html,
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

// Buscar template no banco de dados
async function getEmailTemplate(supabase: any, emailType: string, vars: Record<string, any>): Promise<{ subject: string; html: string; fromEmail: string; fromName: string } | null> {
  console.log(`📧 BULK-SENDER: Buscando template para tipo: ${emailType}`);
  
  // Mapear tipos para chaves de template
  const typeToKey: Record<string, string> = {
    'verified_user': 'verified_user',
    'welcome_user': 'welcome_user', 
    'onboarding_step1': 'onboarding_step1',
    'project_milestone': 'project_milestone',
    'usage_limit_reached': 'usage_limit_reached'
  };
  
  const templateKey = typeToKey[emailType];
  if (!templateKey) {
    console.error(`❌ BULK-SENDER: Tipo de email não mapeado: ${emailType}`);
    return null;
  }
  
  try {
    const { data: template, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('enabled', true)
      .single();
    
    if (error) {
      console.error(`❌ BULK-SENDER: Erro ao buscar template ${templateKey}:`, error);
      return null;
    }
    
    if (!template) {
      console.error(`❌ BULK-SENDER: Template não encontrado: ${templateKey}`);
      return null;
    }
    
    console.log(`✅ BULK-SENDER: Template encontrado: ${templateKey}`);
    
    // Substituir variáveis no subject e html
    const subject = mergePlaceholders(template.subject, vars);
    const html = mergePlaceholders(template.html, vars);
    
    return {
      subject,
      html,
      fromEmail: template.from_email || 'noreply@madeai.com.br',
      fromName: template.from_name || 'MadenAI'
    };
    
  } catch (err) {
    console.error(`❌ BULK-SENDER: Erro inesperado ao buscar template ${templateKey}:`, err);
    return null;
  }
}

// Função para substituir placeholders
function mergePlaceholders(text: string, vars: Record<string, any>): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value || ''));
  }
  return result;
}

serve(handler);