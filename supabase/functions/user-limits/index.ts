import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Utility functions copied from lib files
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

type UserContext = {
  userId: string;
  planCode: 'BASIC' | 'PRO' | 'ENTERPRISE';
  baseQuota: number | null;
  lifetimeBaseConsumed: number;
};

async function getUserContext(
  serverSupabase: any,
  userId: string
): Promise<UserContext> {
  // Get user's current plan
  const { data: planData, error: planError } = await serverSupabase
    .from('plans')
    .select('code, base_quota')
    .single();

  if (planError) {
    throw new Error(`Failed to get user plan: ${planError.message}`);
  }

  // Count total base consumption (lifetime projects created)
  const { count: projectCount, error: projectError } = await serverSupabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (projectError) {
    throw new Error(`Failed to get project count: ${projectError.message}`);
  }

  // Count credit ledger base usage
  const { count: baseUsed, error: ledgerError } = await serverSupabase
    .from('credit_ledger')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', 'BASE');

  if (ledgerError) {
    throw new Error(`Failed to get credit ledger: ${ledgerError.message}`);
  }

  return {
    userId,
    planCode: (planData.code as 'BASIC' | 'PRO' | 'ENTERPRISE') || 'BASIC',
    baseQuota: planData.base_quota as number | null,
    lifetimeBaseConsumed: (projectCount as number || 0) + (baseUsed as number || 0)
  };
}

type Limits = {
  planCode: 'BASIC'|'PRO'|'ENTERPRISE';
  periodKey: string;
  baseQuota: number|null;
  baseUsed: number;
  baseRemaining: number|null;
  bonusGrantedThisMonth: number;
  bonusUsedThisMonth: number;
  bonusRemainingThisMonth: number;
};

async function getLimits(serverSupabase: any, userId: string): Promise<Limits> {
  const periodKey = currentPeriodKey();
  const ctx = await getUserContext(serverSupabase, userId);

  const baseQuota = ctx.baseQuota;
  const baseUsed = ctx.lifetimeBaseConsumed;
  const baseRemaining = baseQuota === null ? null : Math.max(baseQuota - baseUsed, 0);

  const { count: granted, error: gErr } = await serverSupabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_user_id', ctx.userId)
    .eq('status', 'APPROVED')
    .eq('period_key', periodKey);

  const { count: used, error: uErr } = await serverSupabase
    .from('credit_ledger')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', ctx.userId)
    .eq('type', 'BONUS_MONTHLY')
    .eq('period_key', periodKey);

  if (gErr || uErr) throw new Error('LIMITS_QUERY_ERROR');

  const bonusGrantedThisMonth = granted ?? 0;
  const bonusUsedThisMonth = used ?? 0;
  const bonusRemainingThisMonth = Math.max(bonusGrantedThisMonth - bonusUsedThisMonth, 0);

  return {
    planCode: ctx.planCode,
    periodKey,
    baseQuota,
    baseUsed,
    baseRemaining,
    bonusGrantedThisMonth,
    bonusUsedThisMonth,
    bonusRemainingThisMonth
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('🔄 USER LIMITS: Processando requisição...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ ok: false, error: 'UNAUTHENTICATED' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log('❌ Auth error:', authError);
      return new Response(
        JSON.stringify({ ok: false, error: 'INVALID_TOKEN' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Get user limits
    const limits = await getLimits(supabase, user.id);
    console.log('📊 Limits calculated:', limits);

    return new Response(
      JSON.stringify(limits),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.log('❌ ERRO:', error instanceof Error ? error.message : String(error));
    
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});