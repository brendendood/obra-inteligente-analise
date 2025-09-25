import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface EmailQueueItem {
  queue_id: string;
  user_id: string;
  template_type: string;
  recipient_email: string;
  payload: any;
  retries: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 PROCESS-EMAIL-QUEUE: Iniciando processamento da fila de emails');

    // Buscar emails pendentes para retry
    const { data: pendingEmails, error: queryError } = await supabase.rpc(
      'get_pending_emails_for_retry',
      { batch_size: 10 }
    );

    if (queryError) {
      console.error('❌ Erro ao buscar emails pendentes:', queryError);
      throw queryError;
    }

    console.log(`📊 Encontrados ${pendingEmails?.length || 0} emails para processar`);

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Nenhum email pendente para processar',
          processed: 0 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    let successCount = 0;
    let errorCount = 0;

    // Processar cada email da fila
    for (const emailItem of pendingEmails as EmailQueueItem[]) {
      try {
        console.log(`📧 Processando email ${emailItem.template_type} para ${emailItem.recipient_email} (tentativa ${emailItem.retries + 1})`);

        // Buscar template do email
        const { data: template, error: templateError } = await supabase
          .from('email_templates')
          .select('subject, html')
          .eq('template_key', emailItem.template_type)
          .eq('enabled', true)
          .single();

        if (templateError || !template) {
          console.warn(`⚠️ Template '${emailItem.template_type}' não encontrado, usando fallback`);
          await supabase.rpc('mark_email_failed', {
            p_queue_id: emailItem.queue_id,
            p_error_message: `Template não encontrado: ${emailItem.template_type}`
          });
          errorCount++;
          continue;
        }

        // Processar variáveis do template
        const userData = emailItem.payload.user_data || {};
        const userName = userData.full_name || emailItem.recipient_email;
        
        const variables = {
          '{{user_name}}': userName,
          '{{full_name}}': userName,
          '{{dashboard_url}}': `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'}/dashboard`,
          '{{site_url}}': Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://madenai.vercel.app'
        };

        let processedSubject = template.subject || 'Notificação MadenAI';
        let processedHtml = template.html || '<p>Conteúdo não disponível</p>';

        // Aplicar substituições
        Object.entries(variables).forEach(([key, value]) => {
          processedSubject = processedSubject.replace(new RegExp(key, 'g'), value);
          processedHtml = processedHtml.replace(new RegExp(key, 'g'), value);
        });

        // Enviar email via Resend
        const emailResponse = await resend.emails.send({
          from: "MadenAI <suporte@madeai.com.br>",
          to: [emailItem.recipient_email],
          subject: processedSubject,
          html: processedHtml,
        });

        if (emailResponse.error) {
          console.error(`❌ Erro no Resend para ${emailItem.recipient_email}:`, emailResponse.error);
          
          // Marcar como falha e reagendar
          await supabase.rpc('mark_email_failed', {
            p_queue_id: emailItem.queue_id,
            p_error_message: `Resend error: ${emailResponse.error.message}`
          });
          
          errorCount++;
        } else {
          console.log(`✅ Email enviado com sucesso para ${emailItem.recipient_email}`);
          
          // Marcar como enviado
          await supabase.rpc('mark_email_sent', {
            p_queue_id: emailItem.queue_id,
            p_resend_id: emailResponse.data?.id
          });

          // Registrar no log histórico
          await supabase.from('email_logs').insert({
            user_id: emailItem.user_id,
            email_type: emailItem.template_type,
            recipient_email: emailItem.recipient_email,
            resend_id: emailResponse.data?.id,
            status: 'sent',
            sent_at: new Date().toISOString()
          });
          
          successCount++;
        }

      } catch (emailError: any) {
        console.error(`❌ Erro ao processar email ${emailItem.queue_id}:`, emailError);
        
        // Marcar como falha
        await supabase.rpc('mark_email_failed', {
          p_queue_id: emailItem.queue_id,
          p_error_message: emailError.message || 'Erro desconhecido'
        });
        
        errorCount++;
      }
    }

    console.log(`📈 PROCESS-EMAIL-QUEUE concluído: ${successCount} sucessos, ${errorCount} erros`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processamento concluído: ${successCount} emails enviados, ${errorCount} erros`,
        processed: successCount,
        errors: errorCount,
        total_queued: pendingEmails.length
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
    console.error('❌ PROCESS-EMAIL-QUEUE: Erro geral:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process email queue' 
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