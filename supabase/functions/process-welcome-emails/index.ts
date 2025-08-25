import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface WelcomeEmailNotification {
  user_id: string;
  email: string;
  full_name: string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 PROCESS-WELCOME-EMAILS: Processando notificações de welcome email');

    // Buscar usuários que precisam receber welcome email
    // (confirmados nos últimos 30 dias mas sem email de welcome enviado)
    const { data: usersNeedingWelcome, error: queryError } = await supabase
      .from('user_profiles')
      .select(`
        user_id,
        full_name,
        created_at
      `)
      .eq('email_confirmed_at', null)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (queryError) {
      console.error('❌ Erro ao buscar usuários:', queryError);
      throw queryError;
    }

    console.log(`📊 Encontrados ${usersNeedingWelcome?.length || 0} usuários precisando de welcome email`);

    if (!usersNeedingWelcome || usersNeedingWelcome.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Nenhum usuário precisando de welcome email',
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

    // Processar cada usuário
    for (const userProfile of usersNeedingWelcome) {
      try {
        // Buscar dados do auth.users
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userProfile.user_id);
        
        if (authError || !authUser.user) {
          console.error(`❌ Usuário ${userProfile.user_id} não encontrado no auth:`, authError);
          errorCount++;
          continue;
        }

        // Verificar se email está confirmado
        if (!authUser.user.email_confirmed_at) {
          console.log(`⏳ Usuário ${authUser.user.email} ainda não confirmou email, pulando...`);
          continue;
        }

        // Verificar se já foi enviado welcome email
        const { data: existingLog, error: logError } = await supabase
          .from('email_logs')
          .select('id')
          .eq('user_id', userProfile.user_id)
          .eq('email_type', 'welcome_user')
          .eq('status', 'sent')
          .single();

        if (existingLog) {
          console.log(`✅ Welcome email já enviado para ${authUser.user.email}`);
          continue;
        }

        console.log(`📧 Enviando welcome email para ${authUser.user.email}`);

        // Chamar send-custom-emails
        const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-custom-emails', {
          body: {
            email_type: 'welcome_user',
            recipient_email: authUser.user.email,
            user_data: {
              full_name: userProfile.full_name || authUser.user.email,
              user_id: userProfile.user_id
            }
          }
        });

        if (emailError) {
          console.error(`❌ Erro ao enviar welcome email para ${authUser.user.email}:`, emailError);
          errorCount++;
        } else {
          console.log(`✅ Welcome email enviado com sucesso para ${authUser.user.email}`);
          successCount++;
        }

      } catch (userError: any) {
        console.error(`❌ Erro ao processar usuário ${userProfile.user_id}:`, userError);
        errorCount++;
      }
    }

    console.log(`📈 PROCESS-WELCOME-EMAILS concluído: ${successCount} sucessos, ${errorCount} erros`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processamento concluído: ${successCount} emails enviados, ${errorCount} erros`,
        processed: successCount,
        errors: errorCount
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
    console.error('❌ PROCESS-WELCOME-EMAILS: Erro geral:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process welcome emails' 
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