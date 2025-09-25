import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Check {
  key: string;
  status: 'pass' | 'fail';
  details: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar autenticação admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se é admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!userData?.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Access denied - admin required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const checks: Check[] = [];

    // 1. Schema - verificar tabelas essenciais
    try {
      const tables = ['users', 'user_quiz_responses', 'credit_ledger', 'referrals', 'admin_actions', 'monthly_usage'];
      for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
          checks.push({
            key: `schema_table_${table}`,
            status: 'fail',
            details: `Table ${table} not accessible: ${error.message}`
          });
        } else {
          checks.push({
            key: `schema_table_${table}`,
            status: 'pass',
            details: `Table ${table} exists and accessible`
          });
        }
      }
    } catch (error: any) {
      checks.push({
        key: 'schema_tables',
        status: 'fail',
        details: `Schema check failed: ${error.message}`
      });
    }

    // 2. Planos válidos - não deve existir 'free'
    try {
      const { data: freeUsers, error } = await supabase
        .from('users')
        .select('id')
        .eq('plan_code', 'free');

      if (error) {
        checks.push({
          key: 'no_free_plans',
          status: 'fail',
          details: `Error checking free plans: ${error.message}`
        });
      } else if (freeUsers && freeUsers.length > 0) {
        checks.push({
          key: 'no_free_plans',
          status: 'fail',
          details: `Found ${freeUsers.length} users with plan_code='free' - migration incomplete`
        });
      } else {
        checks.push({
          key: 'no_free_plans',
          status: 'pass',
          details: 'No users with plan_code=free found'
        });
      }
    } catch (error: any) {
      checks.push({
        key: 'no_free_plans',
        status: 'fail',
        details: `Free plans check failed: ${error.message}`
      });
    }

    // 3. Quiz obrigatório - verificar se há registros recentes
    try {
      const { data: quizResponses, error } = await supabase
        .from('user_quiz_responses')
        .select('id')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (error) {
        checks.push({
          key: 'quiz_recent_responses',
          status: 'fail',
          details: `Error checking quiz responses: ${error.message}`
        });
      } else if (!quizResponses || quizResponses.length === 0) {
        checks.push({
          key: 'quiz_recent_responses',
          status: 'fail',
          details: 'No quiz responses in the last 7 days'
        });
      } else {
        checks.push({
          key: 'quiz_recent_responses',
          status: 'pass',
          details: 'Quiz responses found in the last 7 days'
        });
      }
    } catch (error: any) {
      checks.push({
        key: 'quiz_recent_responses',
        status: 'fail',
        details: `Quiz check failed: ${error.message}`
      });
    }

    // 4. Verificar usuário enterprise fixo
    try {
      const { data: enterpriseUser, error } = await supabase
        .from('users')
        .select('plan_code')
        .eq('email', 'brendendood2014@gmail.com')
        .single();

      if (error) {
        checks.push({
          key: 'enterprise_user_fixed',
          status: 'fail',
          details: `Error checking enterprise user: ${error.message}`
        });
      } else if (enterpriseUser?.plan_code !== 'ENTERPRISE') {
        checks.push({
          key: 'enterprise_user_fixed',
          status: 'fail',
          details: `Enterprise user plan is ${enterpriseUser?.plan_code}, should be ENTERPRISE`
        });
      } else {
        checks.push({
          key: 'enterprise_user_fixed',
          status: 'pass',
          details: 'Enterprise user has correct plan_code'
        });
      }
    } catch (error: any) {
      checks.push({
        key: 'enterprise_user_fixed',
        status: 'fail',
        details: `Enterprise user check failed: ${error.message}`
      });
    }

    // 5. Verificar contadores funcionais
    try {
      const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
      const { data: usageData, error } = await supabase
        .from('monthly_usage')
        .select('*')
        .eq('period_ym', currentPeriod)
        .limit(5);

      if (error) {
        checks.push({
          key: 'monthly_usage_tracking',
          status: 'fail',
          details: `Error checking monthly usage: ${error.message}`
        });
      } else {
        checks.push({
          key: 'monthly_usage_tracking',
          status: 'pass',
          details: `Monthly usage tracking active with ${usageData?.length || 0} records this month`
        });
      }
    } catch (error: any) {
      checks.push({
        key: 'monthly_usage_tracking',
        status: 'fail',
        details: `Monthly usage check failed: ${error.message}`
      });
    }

    // 6. Verificar funções de limite existem
    try {
      const functions = ['check_user_limits', 'increment_message_usage', 'increment_project_usage'];
      for (const funcName of functions) {
        const { error } = await supabase.rpc(funcName, { p_user_id: user.id });
        if (error && !error.message.includes('not found') && !error.message.includes('does not exist')) {
          checks.push({
            key: `function_${funcName}`,
            status: 'pass',
            details: `Function ${funcName} exists and callable`
          });
        } else {
          checks.push({
            key: `function_${funcName}`,
            status: 'fail',
            details: `Function ${funcName} not found or not callable`
          });
        }
      }
    } catch (error: any) {
      checks.push({
        key: 'database_functions',
        status: 'fail',
        details: `Functions check failed: ${error.message}`
      });
    }

    // Determinar resultado geral
    const allPassed = checks.every(check => check.status === 'pass');

    // Registrar resultado no admin_actions
    try {
      await supabase.from('admin_actions').insert({
        admin_user_id: user.id,
        action: allPassed ? 'SELFTEST_PASSED' : 'SELFTEST_FAILED',
        payload: { 
          checks: checks.length,
          passed: checks.filter(c => c.status === 'pass').length,
          failed: checks.filter(c => c.status === 'fail').length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log selftest result:', error);
    }

    return new Response(
      JSON.stringify({
        passed: allPassed,
        checks,
        summary: {
          total: checks.length,
          passed: checks.filter(c => c.status === 'pass').length,
          failed: checks.filter(c => c.status === 'fail').length
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Selftest error:', error);
    return new Response(
      JSON.stringify({ 
        passed: false,
        error: error.message,
        checks: [{
          key: 'system_error',
          status: 'fail',
          details: `System error: ${error.message}`
        }]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});