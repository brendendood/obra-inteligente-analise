import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type PlanTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

const AI_LIMITS: Record<PlanTier, number | "unlimited"> = {
  FREE: 50,
  BASIC: 500,
  PRO: 2000,
  ENTERPRISE: "unlimited",
};

function currentPeriodYM(date = new Date()) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ allowed: false, reason: "not_authenticated" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Buscar plano do usuário
    const { data: planRow, error: planErr } = await supabaseClient
      .from("user_plans")
      .select("plan_tier")
      .eq("user_id", user.id)
      .maybeSingle();

    if (planErr) throw planErr;

    const tier = (planRow?.plan_tier ?? "FREE") as PlanTier;
    const limit = AI_LIMITS[tier];
    const period = currentPeriodYM();

    if (limit === "unlimited") {
      // Usar a função atômica para incrementar
      await supabaseClient.rpc("increment_ai_usage", { 
        p_user: user.id, 
        p_period: period 
      });
      
      return new Response(
        JSON.stringify({
          allowed: true,
          limit,
          remaining: Number.POSITIVE_INFINITY,
          nearLimit: false,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ler uso atual
    const { data: usage } = await supabaseClient
      .from("ai_message_usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("period_ym", period)
      .maybeSingle();

    const current = usage?.count ?? 0;
    if (current >= limit) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: "limit_reached", 
          count: current, 
          limit, 
          remaining: 0, 
          nearLimit: true 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Incremento atômico via RPC
    const { data: inc, error: incErr } = await supabaseClient.rpc("increment_ai_usage", {
      p_user: user.id,
      p_period: period,
    });
    
    if (incErr) throw incErr;

    const newCount = Array.isArray(inc) ? inc[0]?.count ?? current + 1 : current + 1;
    const remaining = Math.max(0, limit - newCount);
    const nearLimit = newCount / limit >= 0.8;

    return new Response(
      JSON.stringify({
        allowed: true,
        count: newCount,
        limit,
        remaining,
        nearLimit,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (e: any) {
    console.error('Error in ai-track-message:', e);
    return new Response(
      JSON.stringify({ allowed: false, reason: e?.message ?? "server_error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});