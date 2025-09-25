import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    console.log('🔄 DEV SEED BASIC: Criando usuário de desenvolvimento...');
    
    // Check if we're in development environment
    const isDev = Deno.env.get('ENVIRONMENT') === 'development' || 
                  Deno.env.get('SUPABASE_URL')?.includes('localhost');
    
    if (!isDev) {
      console.log('❌ Not in development environment');
      return new Response(
        JSON.stringify({ ok: false, error: 'NOT_DEV_ENVIRONMENT' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if BASIC plan exists
    const { data: plan, error: pErr } = await supabase
      .from('plans')
      .select('id, code, base_quota')
      .eq('code', 'BASIC')
      .single();
    
    if (pErr || !plan) {
      console.log('❌ BASIC plan not found:', pErr);
      return new Response(
        JSON.stringify({ ok: false, error: 'NO_BASIC_PLAN' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Found BASIC plan:', plan);

    // Generate test user data
    const randomId = crypto.randomUUID().substring(0, 8);
    const testEmail = `dev-user-${randomId}@test.com`;
    const testPassword = 'devpassword123';

    // Create user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Skip email confirmation for dev
      user_metadata: {
        full_name: `Dev User ${randomId}`,
        company: 'Development Company',
        cargo: 'Developer',
        avatar_type: 'initials',
        gender: 'male'
      }
    });

    if (authError || !authData.user) {
      console.log('❌ Failed to create auth user:', authError);
      return new Response(
        JSON.stringify({ ok: false, error: 'AUTH_USER_CREATE_FAILED', details: authError?.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const userId = authData.user.id;
    console.log('✅ Created auth user:', userId);

    // Create user profile (this should trigger the handle_new_user_profile function)
    // But let's also ensure the profile is created correctly
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        full_name: `Dev User ${randomId}`,
        company: 'Development Company',
        cargo: 'Developer',
        avatar_type: 'initials',
        gender: 'male',
        ref_code: `DEV_${randomId.toUpperCase()}`,
        credits: 0 // Start with 0 credits for testing
      });

    if (profileError) {
      console.log('❌ Failed to create user profile:', profileError);
      return new Response(
        JSON.stringify({ ok: false, error: 'PROFILE_CREATE_FAILED', details: profileError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Created user profile');

    // Create subscription record with BASIC plan (assuming this table exists)
    const { error: subError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        plan: 'basic',
        status: 'active'
      });

    if (subError) {
      console.log('⚠️ Failed to create subscription (table may not exist):', subError);
    } else {
      console.log('✅ Created subscription record');
    }

    // Clear any existing credit ledger entries for this user (for clean testing)
    const { error: ledgerClearError } = await supabase
      .from('credit_ledger')
      .delete()
      .eq('user_id', userId);

    if (ledgerClearError) {
      console.log('⚠️ Failed to clear credit ledger:', ledgerClearError);
    } else {
      console.log('✅ Cleared credit ledger for fresh start');
    }

    // Initialize gamification with base points
    const { error: gamificationError } = await supabase
      .from('user_gamification')
      .upsert({
        user_id: userId,
        total_points: 100,
        current_level: 1,
        current_level_points: 100,
        daily_streak: 1,
        last_action_date: new Date().toISOString().split('T')[0],
        last_login_date: new Date().toISOString().split('T')[0],
        achievements: []
      });

    if (gamificationError) {
      console.log('⚠️ Failed to initialize gamification:', gamificationError);
    } else {
      console.log('✅ Initialized gamification');
    }

    console.log('🎉 DEV SEED BASIC: Usuário criado com sucesso');

    return new Response(
      JSON.stringify({ 
        ok: true, 
        userId,
        email: testEmail,
        password: testPassword,
        plan: plan.code,
        base_quota: plan.base_quota,
        message: 'Development user created successfully'
      }),
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