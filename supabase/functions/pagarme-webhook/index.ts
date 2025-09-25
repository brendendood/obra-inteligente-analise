import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mapear IDs de plano do Pagar.me -> code interno
const PAGARME_PLAN_MAP: Record<string, 'BASIC'|'PRO'|'ENTERPRISE'> = {
  // 'pagarme_plan_id_basic': 'BASIC',
  // 'pagarme_plan_id_pro': 'PRO',
  // 'pagarme_plan_id_enterprise': 'ENTERPRISE',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.error('Invalid method:', req.method);
    return new Response(
      JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // TODO: validar assinatura HMAC do Pagar.me (seu segredo)
    // const signature = req.headers.get('x-hub-signature');
    // if (!validatePagarmeSignature(body, signature)) {
    //   return new Response(JSON.stringify({ ok: false, error: 'INVALID_SIGNATURE' }), { status: 401 });
    // }

    const payload = await req.json();
    console.log('Pagar.me webhook payload:', JSON.stringify(payload, null, 2));

    // Extrair userId da sua referência (ex: metadata.customer_reference)
    const userId: string | undefined = payload?.metadata?.user_id;
    const pagarmePlanId: string | undefined = payload?.data?.plan?.id || payload?.plan_id;

    console.log('Extracted userId:', userId);
    console.log('Extracted pagarmePlanId:', pagarmePlanId);

    if (!userId || !pagarmePlanId) {
      console.error('Missing userId or pagarmePlanId');
      return new Response(
        JSON.stringify({ ok: false, error: 'MISSING_USER_OR_PLAN' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const targetCode = PAGARME_PLAN_MAP[pagarmePlanId];
    if (!targetCode) {
      console.error('Unknown plan ID:', pagarmePlanId);
      return new Response(
        JSON.stringify({ ok: false, error: 'UNKNOWN_PLAN' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Target plan code:', targetCode);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get plan ID from code
    const { data: planRow, error: planErr } = await supabase
      .from('plans')
      .select('id')
      .eq('code', targetCode)
      .single();

    if (planErr || !planRow) {
      console.error('Plan not found:', planErr);
      return new Response(
        JSON.stringify({ ok: false, error: 'PLAN_NOT_FOUND' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Found plan:', planRow);

    // Update user plan
    const { error: updErr } = await supabase
      .from('users')
      .update({ plan_id: planRow.id })
      .eq('id', userId);

    if (updErr) {
      console.error('Update failed:', updErr);
      return new Response(
        JSON.stringify({ ok: false, error: 'UPDATE_FAILED' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully updated user plan for userId:', userId);

    return new Response(
      JSON.stringify({ ok: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'INTERNAL_ERROR' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})