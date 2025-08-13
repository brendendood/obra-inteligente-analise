import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  token: string;
  type: string;
  email?: string;
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

    if (req.method === 'POST') {
      // Verificação de token via POST (para ser chamado via JavaScript)
      const { token, type, email }: VerificationRequest = await req.json();
      
      console.log('📧 EMAIL-VERIFICATION: Verificando token:', { token: token?.substring(0, 8) + '...', type, email });

      // Verificar o token com Supabase Auth
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as any,
        email: email,
      });

      if (error) {
        console.error('❌ EMAIL-VERIFICATION: Erro na verificação:', error);
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      console.log('✅ EMAIL-VERIFICATION: Token verificado com sucesso');

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Email verificado com sucesso!' 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (req.method === 'GET') {
      // Verificação via GET (para links de email)
      const url = new URL(req.url);
      const token = url.searchParams.get('token');
      const type = url.searchParams.get('type') || 'signup';
      const email = url.searchParams.get('email');
      const redirectTo = url.searchParams.get('redirect_to') || '/painel';

      if (!token) {
        return new Response('Token obrigatório', { status: 400, headers: corsHeaders });
      }

      console.log('📧 EMAIL-VERIFICATION (GET): Verificando token:', { token: token.substring(0, 8) + '...', type, email });

      try {
        // Verificar o token com Supabase Auth
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
          email: email || undefined,
        });

        if (error) {
          console.error('❌ EMAIL-VERIFICATION (GET): Erro na verificação:', error);
          
          // Redirecionar para página de erro
          const errorUrl = `/login?error=${encodeURIComponent('Token inválido ou expirado')}`;
          return new Response(null, {
            status: 302,
            headers: { 
              'Location': errorUrl,
              ...corsHeaders 
            }
          });
        }

        console.log('✅ EMAIL-VERIFICATION (GET): Token verificado com sucesso');

        // Redirecionar para página de sucesso ou login
        const successUrl = `/login?verified=true&message=${encodeURIComponent('Email verificado com sucesso! Agora você pode fazer login.')}`;
        return new Response(null, {
          status: 302,
          headers: { 
            'Location': successUrl,
            ...corsHeaders 
          }
        });
      } catch (verifyError: any) {
        console.error('❌ EMAIL-VERIFICATION (GET): Erro na verificação:', verifyError);
        
        const errorUrl = `/login?error=${encodeURIComponent('Erro ao verificar email')}`;
        return new Response(null, {
          status: 302,
          headers: { 
            'Location': errorUrl,
            ...corsHeaders 
          }
        });
      }
    }

    return new Response('Método não permitido', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error: any) {
    console.error("❌ EMAIL-VERIFICATION: Erro geral:", error);
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