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

    // Buscar usuário pelo email usando listUsers (método correto)
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
      filter: `email.eq.${email}`
    });
    
    if (getUserError || !users || users.length === 0) {
      console.error('❌ SEND-VERIFICATION: Usuário não encontrado:', getUserError);
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = users[0];

    // Gerar novo link de verificação usando generateLink
    const { data: linkData, error: generateError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: `https://madeai.com.br/painel`
      }
    });

    if (generateError || !linkData) {
      console.error('❌ SEND-VERIFICATION: Erro ao gerar token:', generateError);
      throw generateError;
    }

    // Extrair o token do URL gerado
    const tokenUrl = new URL(linkData.properties.action_link);
    const token = tokenUrl.searchParams.get('token');
    const tokenHash = tokenUrl.searchParams.get('token_hash');
    
    // Gerar URL de verificação personalizada com token correto
    const baseUrl = 'https://madeai.com.br';
    const verificationUrl = `${supabaseUrl}/functions/v1/email-verification?token=${tokenHash}&type=signup&email=${encodeURIComponent(email)}&redirect_to=${encodeURIComponent('https://madeai.com.br/painel')}`;

    // Enviar email customizado via nossa edge function
    const emailResponse = await supabase.functions.invoke('send-custom-emails', {
      body: {
        email_type: 'verified_user',
        recipient_email: email,
        user_data: {
          full_name: user_data?.full_name || user.user_metadata?.full_name || 'Usuário',
          user_id: user.id,
          email: email
        },
        verification_data: {
          verification_url: verificationUrl,
          token: token || tokenHash
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
      message: 'Email de verificação enviado com sucesso!' 
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