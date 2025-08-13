import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthWebhookPayload {
  type: string;
  table: string;
  record: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string | null;
    phone: string | null;
    confirmed_at: string | null;
    last_sign_in_at: string | null;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: {
      full_name?: string;
      company?: string;
      cargo?: string;
      avatar_url?: string;
      avatar_type?: string;
      gender?: string;
      ref_code?: string;
    };
    identities: any[];
    created_at: string;
    updated_at: string;
  };
  schema: string;
  old_record?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se é um webhook válido
    const authHeader = req.headers.get('authorization');
    const expectedSecret = Deno.env.get('AUTH_WEBHOOK_SECRET');
    
    if (!authHeader || !expectedSecret) {
      console.log('❌ AUTH-WEBHOOK: Missing authorization or secret');
      return new Response('Unauthorized', { status: 401 });
    }

    // Validar secret do webhook
    if (authHeader !== `Bearer ${expectedSecret}`) {
      console.log('❌ AUTH-WEBHOOK: Invalid webhook secret');
      return new Response('Unauthorized', { status: 401 });
    }

    const payload: AuthWebhookPayload = await req.json();
    console.log('🔔 AUTH-WEBHOOK: Evento recebido:', payload.type);

    // Processar apenas eventos de criação de usuário (signup)
    if (payload.type === 'INSERT' && payload.table === 'users') {
      const user = payload.record;
      console.log('👤 AUTH-WEBHOOK: Novo usuário criado:', user.email);

      // Verificar se o usuário precisa de verificação de email
      if (!user.email_confirmed_at) {
        console.log('📧 AUTH-WEBHOOK: Enviando email de verificação personalizado para:', user.email);

        // Gerar link de verificação usando Supabase Auth Admin
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'signup',
          email: user.email,
          options: {
            redirectTo: `${supabaseUrl.replace('.supabase.co', '')}/auth/callback`
          }
        });

        if (linkError) {
          console.error('❌ AUTH-WEBHOOK: Erro ao gerar link de verificação:', linkError);
          throw linkError;
        }

        console.log('🔗 AUTH-WEBHOOK: Link de verificação gerado com sucesso');

        // Chamar nossa função de envio de email customizado
        const { error: emailError } = await supabase.functions.invoke('send-custom-emails', {
          body: {
            email_type: 'verified_user',
            recipient_email: user.email,
            user_data: {
              full_name: user.user_metadata?.full_name || user.email,
              company: user.user_metadata?.company || '',
              verification_url: linkData.properties?.action_link || linkData.properties?.hashed_token || ''
            },
            verification_data: {
              token: linkData.properties?.hashed_token || '',
              verification_url: linkData.properties?.action_link || '',
              redirect_url: `${supabaseUrl.replace('.supabase.co', '')}/painel`
            }
          }
        });

        if (emailError) {
          console.error('❌ AUTH-WEBHOOK: Erro ao enviar email customizado:', emailError);
          throw emailError;
        }

        console.log('✅ AUTH-WEBHOOK: Email de verificação customizado enviado com sucesso');
      }
    }

    // Processar outros eventos de auth se necessário
    if (payload.type === 'UPDATE' && payload.table === 'users') {
      const user = payload.record;
      const oldUser = payload.old_record;
      
      // Verificar se o email foi confirmado agora
      if (!oldUser?.email_confirmed_at && user.email_confirmed_at) {
        console.log('🎉 AUTH-WEBHOOK: Email confirmado para:', user.email);
        
        // Aqui podemos enviar email de boas-vindas se necessário
        // Mas já temos isso no handle_new_user_profile
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processado com sucesso' 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("❌ AUTH-WEBHOOK: Erro geral:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);