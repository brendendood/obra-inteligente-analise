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
  verified_user: { email: 'verificacao@madeai.com.br', name: 'MadeAI Verificação' },
  welcome_user: { email: 'boas-vindas@madeai.com.br', name: 'Equipe MadeAI' },
  onboarding_step1: { email: 'onboarding@madeai.com.br', name: 'MadeAI Onboarding' },
  project_milestone: { email: 'notificacoes@madeai.com.br', name: 'MadeAI' },
  usage_limit_reached: { email: 'notificacoes@madeai.com.br', name: 'MadeAI' },
  default: { email: 'noreply@madeai.com.br', name: 'MadeAI' }
};

// Rate limiting configuration - Resend allows 2 emails/second max
const RATE_LIMIT_CONFIG = {
  emailDelay: 600, // 600ms delay = 1.67 emails/second (safe margin)
  batchSize: 3, // Smaller batches for better control
  batchDelay: 2000, // 2 seconds between batches
  retryDelay: 2000, // 2 seconds wait on rate limit error
  maxRetries: 3 // Maximum retry attempts per email
};

// Smart delay function
const smartDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limit retry function
const sendEmailWithRetry = async (resend: any, emailData: any, maxRetries: number = RATE_LIMIT_CONFIG.maxRetries) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.emails.send(emailData);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response;
    } catch (error: any) {
      const isRateLimit = error.message?.includes('Too many requests') || error.message?.includes('rate limit');
      
      if (isRateLimit && attempt < maxRetries) {
        console.log(`⏳ BULK-SENDER: Rate limit detectado, tentativa ${attempt}/${maxRetries}, aguardando ${RATE_LIMIT_CONFIG.retryDelay}ms...`);
        await smartDelay(RATE_LIMIT_CONFIG.retryDelay);
        continue;
      }
      
      throw error;
    }
  }
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

    // Process emails with robust rate limiting
    const results = {
      total_users: users.length,
      total_emails: users.length * email_types.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    let emailCount = 0;
    const totalEmails = results.total_emails;

    for (let i = 0; i < users.length; i += RATE_LIMIT_CONFIG.batchSize) {
      const batch = users.slice(i, i + RATE_LIMIT_CONFIG.batchSize);
      
      console.log(`📦 BULK-SENDER: Processando lote ${Math.ceil((i + 1) / RATE_LIMIT_CONFIG.batchSize)} de ${Math.ceil(users.length / RATE_LIMIT_CONFIG.batchSize)}`);
      
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
          emailCount++;
          
          try {
            // Preparar variáveis para o template
            const templateVars = {
              full_name: userName,
              app_name: 'MadeAI',
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
              console.log(`🧪 TEST-MODE: Email ${emailType} para ${userEmail} (${emailCount}/${totalEmails})`);
              results.successful++;
              await smartDelay(RATE_LIMIT_CONFIG.emailDelay);
              continue;
            }

            console.log(`📧 BULK-SENDER: Enviando ${emailType} para ${userEmail} (${emailCount}/${totalEmails})...`);

            // Send email with retry logic
            const emailData = {
              from: `${template.fromName} <${template.fromEmail}>`,
              to: [userEmail],
              subject: template.subject,
              html: template.html,
            };

            await sendEmailWithRetry(resend, emailData);

            results.successful++;
            console.log(`✅ BULK-SENDER: Email ${emailType} enviado para ${userEmail}`);

            // Robust delay between emails (600ms = 1.67 emails/second)
            if (emailCount < totalEmails) {
              console.log(`⏳ BULK-SENDER: Aguardando ${RATE_LIMIT_CONFIG.emailDelay}ms para próximo email...`);
              await smartDelay(RATE_LIMIT_CONFIG.emailDelay);
            }

          } catch (error: any) {
            results.failed++;
            results.errors.push(`${emailType} para ${userEmail}: ${error.message}`);
            console.error(`❌ BULK-SENDER: Erro ao enviar ${emailType} para ${userEmail}:`, error);
            
            // Even on error, wait to avoid hitting rate limits
            await smartDelay(RATE_LIMIT_CONFIG.emailDelay);
          }
        }
      }

      // Longer delay between batches
      if (i + RATE_LIMIT_CONFIG.batchSize < users.length) {
        console.log(`⏸️ BULK-SENDER: Aguardando ${RATE_LIMIT_CONFIG.batchDelay}ms entre lotes...`);
        await smartDelay(RATE_LIMIT_CONFIG.batchDelay);
      }
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
      fromName: template.from_name || 'MadeAI'
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