import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type PlanTier = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

const FEATURE_MIN: Record<string, PlanTier> = {
  budget: "BASIC",
  schedule: "BASIC", 
  export: "BASIC",
  ai_assistant: "FREE"
};

const POWER: PlanTier[] = ["FREE", "BASIC", "PRO", "ENTERPRISE"];
const atLeast = (cur: PlanTier, req: PlanTier) => POWER.indexOf(cur) >= POWER.indexOf(req);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feature } = await req.json();
    
    if (!feature || !FEATURE_MIN[feature]) {
      return new Response(
        JSON.stringify({ error: "invalid_feature" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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
    const { data: plan } = await supabaseClient
      .from("user_plans")
      .select("plan_tier")
      .eq("user_id", user.id)
      .maybeSingle();

    const tier = (plan?.plan_tier ?? "FREE") as PlanTier;
    const requiredTier = FEATURE_MIN[feature];
    
    if (!atLeast(tier, requiredTier)) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: "forbidden_plan",
          current_tier: tier,
          required_tier: requiredTier
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        allowed: true, 
        tier,
        feature 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (e: any) {
    console.error('Error in check-feature-access:', e);
    return new Response(
      JSON.stringify({ allowed: false, reason: e?.message ?? "server_error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});