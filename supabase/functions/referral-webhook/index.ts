import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Utility function for current period key (copied from lib/time.ts)
const APP_BILLING_TZ = 'Europe/Madrid';

function currentPeriodKey(date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_BILLING_TZ,
    year: 'numeric', month: '2-digit'
  });
  const parts = fmt.formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value ?? '1970';
  const m = parts.find(p => p.type === 'month')?.value ?? '01';
  return `${y}-${m}`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('🔄 REFERRAL WEBHOOK: Processando requisição...');
    
    const payload = await req.json();
    console.log('📋 PAYLOAD:', JSON.stringify(payload, null, 2));

    const referrerUserId: string | undefined = payload?.referrer_user_id;
    const referredUserId: string | undefined = payload?.referred_user_id ?? null;

    if (!referrerUserId) {
      console.log('❌ ERRO: referrer_user_id obrigatório');
      return new Response(
        JSON.stringify({ ok: false, error: 'MISSING_REFERRER' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const period_key = currentPeriodKey();
    console.log('📅 Period Key:', period_key);

    // Insert referral record
    const { error: insErr, data } = await supabase
      .from('referrals')
      .insert({
        referrer_user_id: referrerUserId,
        referred_user_id: referredUserId,
        status: 'APPROVED',
        qualified_at: new Date().toISOString(),
        period_key
      })
      .select()
      .single();

    if (insErr) {
      console.log('❌ ERRO ao inserir referral:', insErr);
      return new Response(
        JSON.stringify({ ok: false, error: 'INSERT_FAILED', details: insErr.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ REFERRAL criado com sucesso:', data);

    return new Response(
      JSON.stringify({ ok: true, referral: data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.log('❌ ERRO geral:', error instanceof Error ? error.message : String(error));
    
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: 'INTERNAL_ERROR',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});