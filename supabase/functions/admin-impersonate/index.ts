import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImpersonateRequest {
  targetUserId: string;
  reason?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize regular client for auth validation
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the admin user's token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser }, error: authError } = await supabaseClient.auth.getUser(
      token
    );

    if (authError || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create an auth-scoped client so auth.uid() is set inside RPC/Policies
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Check if user is admin using their auth context
    const { data: isAdmin, error: adminCheckError } = await supabaseAuth.rpc('is_admin_user');
    
    if (adminCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { targetUserId, reason }: ImpersonateRequest = await req.json();

    if (!targetUserId) {
      return new Response(
        JSON.stringify({ error: 'Target user ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify target user exists
    const { data: targetUser, error: targetUserError } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
    
    if (targetUserError || !targetUser) {
      return new Response(
        JSON.stringify({ error: 'Target user not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client info for logging
    const userAgent = req.headers.get('User-Agent') || '';
    const clientIP = req.headers.get('X-Forwarded-For') || req.headers.get('X-Real-IP') || '';

    // Log security action
    await supabaseAdmin.rpc('log_admin_security_action', {
      p_admin_id: adminUser.id,
      p_action_type: 'impersonation_start',
      p_target_user_id: targetUserId,
      p_details: {
        reason: reason || 'Support session',
        ip_address: clientIP,
        user_agent: userAgent
      }
    });

    // Create impersonation session log
    const { data: sessionLog, error: logError } = await supabaseAdmin
      .from('admin_impersonation_logs')
      .insert({
        admin_id: adminUser.id,
        user_impersonated_id: targetUserId,
        reason: reason || 'Support session',
        ip_address: clientIP,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (logError) {
      console.error('Error creating impersonation log:', logError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session log' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate access token for the target user (expires in 30 minutes)
    const allowedOrigins = ['https://app.madenai.com', 'https://madenai.com', 'http://localhost:5173'];
    const origin = req.headers.get('Origin') || '';
    const safeOrigin = allowedOrigins.find(o => o === origin) ?? allowedOrigins[0];
    const { data: tokenData, error: tokenError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email!,
      options: {
        redirectTo: `${safeOrigin}/dashboard?impersonated=true&session_id=${sessionLog.id}&admin_id=${adminUser.id}`
      }
    });

    if (tokenError) {
      console.error('Error generating impersonation token:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate impersonation token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        impersonationUrl: tokenData.properties?.action_link,
        sessionId: sessionLog.id,
        targetUser: {
          id: targetUser.user.id,
          email: targetUser.user.email,
          full_name: targetUser.user.user_metadata?.full_name || targetUser.user.email
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in admin-impersonate function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});