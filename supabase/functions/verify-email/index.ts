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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const type = url.searchParams.get("type");

    if (!token || !type) {
      // Redirect to error page
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "https://madeai.com.br/cadastro?error=token-ausente",
          ...corsHeaders
        }
      });
    }

    // Verify the email using Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any
    });

    if (error) {
      console.error("Verification error:", error);
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "https://madeai.com.br/cadastro?error=token-invalido",
          ...corsHeaders
        }
      });
    }

    if (data.user) {
      // Send welcome email notification
      try {
        await supabase.functions.invoke('send-confirmation-email', {
          body: {
            type: 'welcome',
            user_id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.email
          }
        });
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the verification if email sending fails
      }

      // Redirect to success page
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "https://madeai.com.br/cadastro?success=verificado",
          ...corsHeaders
        }
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        "Location": "https://madeai.com.br/cadastro?error=token-invalido",
        ...corsHeaders
      }
    });

  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "https://madeai.com.br/cadastro?error=erro-interno",
        ...corsHeaders
      }
    });
  }
};

serve(handler);