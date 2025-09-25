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

  if (req.method !== 'DELETE') {
    return new Response(
      JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('🔄 DELETE PROJECT: Processando requisição...');
    
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

    // Extract project ID from URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const projectId = pathParts[pathParts.length - 1];

    if (!projectId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'MISSING_PROJECT_ID' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🗂️ Project ID:', projectId);

    // Check if project exists and belongs to user
    const { data: project, error: checkError } = await supabase
      .from('projects')
      .select('id, user_id, name, notes')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (checkError || !project) {
      console.log('❌ Project not found or unauthorized:', checkError);
      return new Response(
        JSON.stringify({ ok: false, error: 'PROJECT_NOT_FOUND' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Project found:', project.name);

    // Soft delete the project
    const { error: updErr } = await supabase
      .from('projects')
      .update({ 
        updated_at: new Date().toISOString(),
        // Note: Adding deleted_at column would require migration
        // For now, we'll use a status field or notes to mark as deleted
        notes: (project.notes || '') + `\n[DELETED at ${new Date().toISOString()}]`
      })
      .eq('id', projectId)
      .eq('user_id', user.id);

    if (updErr) {
      console.log('❌ Soft delete failed:', updErr);
      return new Response(
        JSON.stringify({ ok: false, error: 'SOFT_DELETE_FAILED' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Project soft deleted successfully');

    // Important: NOT touching the ledger and NOT decreasing lifetime_base_consumed
    // This preserves audit trail and prevents credit manipulation

    return new Response(
      JSON.stringify({ ok: true }),
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