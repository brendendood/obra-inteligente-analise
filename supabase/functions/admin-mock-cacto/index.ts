import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MockWebhookPayload {
  type: 'subscription_created' | 'subscription_updated' | 'subscription_canceled' | 'subscription_unpaid';
  email?: string;
  user_id?: string;
  plan?: 'basic' | 'pro' | 'enterprise';
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

    // Parse payload
    const payload: MockWebhookPayload = await req.json();

    if (!payload.type || !['subscription_created', 'subscription_updated', 'subscription_canceled', 'subscription_unpaid'].includes(payload.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid type. Must be: subscription_created, subscription_updated, subscription_canceled, subscription_unpaid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se é o usuário supremo e bloquear alterações
    if (payload.email === 'brendendood2014@gmail.com') {
      console.log('🛡️ SUPREME USER PROTECTION: Tentativa de alteração bloqueada para usuário supremo');
      
      // Log da tentativa bloqueada
      await supabase.from('admin_actions').insert({
        admin_user_id: user.id,
        target_user_id: payload.user_id || null,
        action: 'SUPREME_PROTECTION_TRIGGERED',
        payload: {
          source: 'mock_cacto_webhook',
          attempted_change: 'plan_code',
          attempted_value: payload.plan,
          blocked_at: new Date().toISOString(),
          reason: 'Supreme user protection - all plan changes blocked'
        }
      });

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Supreme user protected - plan change blocked',
        user_email: payload.email,
        protection_active: true
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Encontrar usuário
    let targetUserId = payload.user_id;
    if (!targetUserId && payload.email) {
      const { data: foundUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', payload.email)
        .single();
      targetUserId = foundUser?.id;
    }

    if (!targetUserId) {
      return new Response(
        JSON.stringify({ error: 'User not found. Provide valid user_id or email' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let newPlanCode: string | null = null;

    switch (payload.type) {
      case 'subscription_created':
      case 'subscription_updated':
        if (!payload.plan || !['basic', 'pro', 'enterprise'].includes(payload.plan)) {
          return new Response(
            JSON.stringify({ error: 'Invalid plan. Must be: basic, pro, enterprise' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        newPlanCode = payload.plan.toUpperCase();
        break;
        
      case 'subscription_canceled':
      case 'subscription_unpaid':
        newPlanCode = null; // Remove plano
        break;
    }

    // Atualizar plano do usuário
    const { error: updateError } = await supabase
      .from('users')
      .update({ plan_code: newPlanCode })
      .eq('id', targetUserId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Failed to update user plan: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Registrar ação no admin_actions
    await supabase.from('admin_actions').insert({
      admin_user_id: user.id,
      target_user_id: targetUserId,
      action: 'MOCK_WEBHOOK_CACTO',
      payload: {
        webhook_type: payload.type,
        old_plan: 'unknown',
        new_plan: newPlanCode,
        email: payload.email,
        mock: true,
        timestamp: new Date().toISOString()
      }
    });

    // Buscar dados atualizados do usuário
    const { data: updatedUser } = await supabase
      .from('users')
      .select('email, plan_code')
      .eq('id', targetUserId)
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Mock webhook processed successfully`,
        user: {
          id: targetUserId,
          email: updatedUser?.email,
          plan_code: updatedUser?.plan_code
        },
        webhook: {
          type: payload.type,
          plan: payload.plan || null
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Mock webhook error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});