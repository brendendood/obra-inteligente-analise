import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyTokenRequest {
  token: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, email }: VerifyTokenRequest = await req.json();

    if (!token || !email) {
      return new Response(JSON.stringify({ error: 'Token e email são obrigatórios' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('🔍 VERIFY-TOKEN: Verificando token para:', email);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Configuração do Supabase não encontrada');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar usuário pelo email
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
      filter: `email.eq.${email}`
    });
    
    if (getUserError || !users || users.length === 0) {
      console.error('❌ VERIFY-TOKEN: Usuário não encontrado:', getUserError);
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = users[0];

    // Verificar se o usuário já está confirmado
    if (user.email_confirmed_at) {
      console.log('✅ VERIFY-TOKEN: Email já verificado para:', email);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Email já foi verificado anteriormente',
        already_verified: true
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Verificar token personalizado (comparação simples para demo)
    // Em produção, usar JWT ou token com timestamp e hash
    const expectedToken = btoa(`${email}:${user.id}:verify`).replace(/[+/=]/g, '');
    
    if (token !== expectedToken) {
      console.error('❌ VERIFY-TOKEN: Token inválido para:', email);
      return new Response(JSON.stringify({ error: 'Token inválido ou expirado' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Confirmar email do usuário
    const { error: confirmError } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true
    });

    if (confirmError) {
      console.error('❌ VERIFY-TOKEN: Erro ao confirmar email:', confirmError);
      throw confirmError;
    }

    console.log('✅ VERIFY-TOKEN: Email verificado com sucesso para:', email);

    // Enviar email de boas-vindas
    try {
      await supabase.functions.invoke('send-custom-emails', {
        body: {
          email_type: 'welcome_user',
          recipient_email: email,
          user_data: {
            full_name: user.user_metadata?.full_name || 'Usuário',
            user_id: user.id
          }
        }
      });
      console.log('✅ VERIFY-TOKEN: Email de boas-vindas enviado');
    } catch (emailError) {
      console.error('⚠️ VERIFY-TOKEN: Erro ao enviar email de boas-vindas:', emailError);
      // Não falhar se email de boas-vindas der erro
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email verificado com sucesso! Você já pode fazer login.',
      user_id: user.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("❌ VERIFY-TOKEN: Erro geral:", error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);