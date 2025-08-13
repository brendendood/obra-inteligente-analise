
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  user_data?: {
    full_name?: string;
    user_id?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, user_data }: VerificationEmailRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email obrigatório' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('📧 SEND-VERIFICATION: Enviando email de verificação para:', email);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Gerar link de verificação usando o método oficial do Supabase
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: `${supabaseUrl.replace('.supabase.co', '')}/auth/callback?next=/painel`
      }
    });

    if (linkError || !linkData.properties?.action_link) {
      console.error('❌ SEND-VERIFICATION: Erro ao gerar link:', linkError);
      throw new Error('Falha ao gerar link de verificação');
    }

    const verificationUrl = linkData.properties.action_link;
    console.log('🔗 SEND-VERIFICATION: Link gerado:', verificationUrl);

    // Enviar email customizado via nossa edge function
    const emailResponse = await supabase.functions.invoke('send-custom-emails', {
      body: {
        email_type: 'verified_user',
        recipient_email: email,
        user_data: {
          full_name: user_data?.full_name || 'Usuário',
          user_id: user_data?.user_id,
          email: email
        },
        verification_data: {
          verification_url: verificationUrl
        }
      }
    });

    if (emailResponse.error) {
      console.error('❌ SEND-VERIFICATION: Erro ao enviar email:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log('✅ SEND-VERIFICATION: Email de verificação enviado com sucesso');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email de verificação enviado com sucesso!',
      verification_url: verificationUrl
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("❌ SEND-VERIFICATION: Erro geral:", error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno' 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);
