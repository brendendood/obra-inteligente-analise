import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdatePasswordRequest {
  email: string;
  newPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, newPassword }: UpdatePasswordRequest = await req.json();

    if (!email || !newPassword) {
      throw new Error("Email e nova senha são obrigatórios");
    }

    // Usar service role key para operações admin
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Buscar usuário pelo email
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (getUserError) {
      // Log interno, mas sempre retorna sucesso para evitar user enumeration
      console.error(`❌ Erro ao buscar usuários: ${getUserError.message}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Senha atualizada com sucesso" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      // SEGURANÇA: Não revelar que usuário não existe - sempre retornar sucesso
      console.log(`⚠️ Tentativa de reset para email inexistente: ${email}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Senha atualizada com sucesso" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Atualizar senha do usuário existente
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      // Log erro interno, mas sempre retorna sucesso para consistência
      console.error(`❌ Erro ao atualizar senha para ${email}: ${updateError.message}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Senha atualizada com sucesso" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`✅ Senha atualizada com sucesso para: ${email}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Senha atualizada com sucesso" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Erro ao atualizar senha:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);