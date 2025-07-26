import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EndImpersonationRequest {
  sessionId: string;
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

    const { sessionId }: EndImpersonationRequest = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get session info for logging
    const { data: sessionInfo } = await supabaseAdmin
      .from('admin_impersonation_logs')
      .select('admin_id, user_impersonated_id')
      .eq('id', sessionId)
      .single();

    // Log security action
    if (sessionInfo) {
      await supabaseAdmin.rpc('log_admin_security_action', {
        p_admin_id: sessionInfo.admin_id,
        p_action_type: 'impersonation_end',
        p_target_user_id: sessionInfo.user_impersonated_id,
        p_details: { session_id: sessionId }
      });
    }

    // End the impersonation session
    const { error: endError } = await supabaseAdmin.rpc('end_impersonation_session', {
      session_id: sessionId
    });

    if (endError) {
      console.error('Error ending impersonation session:', endError);
      return new Response(
        JSON.stringify({ error: 'Failed to end impersonation session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in admin-end-impersonation function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});