
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

    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    console.log(`📧 [${requestId}] SEND-VERIFICATION: Iniciando processo para ${email} em ${timestamp}`);
    console.log(`📧 [${requestId}] SEND-VERIFICATION: User data:`, JSON.stringify(user_data, null, 2));

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`❌ [${requestId}] SEND-VERIFICATION: Configuração do Supabase ausente`);
      throw new Error('Missing Supabase configuration');
    }

    console.log(`🔧 [${requestId}] SEND-VERIFICATION: Conectando ao Supabase...`);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Gerar link de verificação usando o método oficial do Supabase
    console.log(`🔗 [${requestId}] SEND-VERIFICATION: Gerando link de verificação...`);
    
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: `https://madeai.com.br/auth/callback?next=/painel`
      }
    });

    if (linkError || !linkData.properties?.action_link) {
      console.error(`❌ [${requestId}] SEND-VERIFICATION: Erro ao gerar link:`, linkError);
      throw new Error('Falha ao gerar link de verificação');
    }

    const verificationUrl = linkData.properties.action_link;
    console.log(`🔗 [${requestId}] SEND-VERIFICATION: Link gerado com sucesso (${verificationUrl.length} caracteres)`);
    console.log(`🔗 [${requestId}] SEND-VERIFICATION: URL completa: ${verificationUrl}`);

    // Enviar email customizado via nossa edge function (RESEND)
    console.log(`📧 [${requestId}] SEND-VERIFICATION: Invocando send-custom-emails...`);
    console.log(`📧 [${requestId}] SEND-VERIFICATION: Payload:`, JSON.stringify({
      email_type: 'verified_user',
      recipient_email: email,
      user_data: {
        full_name: user_data?.full_name || 'Usuário',
        user_id: user_data?.user_id,
        email: email
      }
    }, null, 2));
    
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

    console.log(`📧 [${requestId}] SEND-VERIFICATION: Resposta da função:`, JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error(`❌ [${requestId}] SEND-VERIFICATION: Erro ao enviar email:`, emailResponse.error);
      throw emailResponse.error;
    }

    console.log(`✅ [${requestId}] SEND-VERIFICATION: Email de verificação enviado via RESEND com sucesso`);
    console.log(`✅ [${requestId}] SEND-VERIFICATION: Template usado: verified_user`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email de verificação enviado via RESEND com sucesso!',
      request_id: requestId,
      email_service: 'RESEND',
      template_used: 'verified_user',
      verification_url: verificationUrl,
      timestamp: timestamp
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json", 
        "X-Request-ID": requestId,
        "X-Email-Service": "RESEND",
        ...corsHeaders 
      }
    });

  } catch (error: any) {
    const errorId = crypto.randomUUID();
    console.error(`❌ [${errorId}] SEND-VERIFICATION: Erro geral:`, error);
    console.error(`❌ [${errorId}] SEND-VERIFICATION: Stack trace:`, error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno',
      error_id: errorId,
      email_service: 'RESEND',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json", 
        "X-Error-ID": errorId,
        "X-Email-Service": "RESEND",
        ...corsHeaders 
      }
    });
  }
};

serve(handler);
