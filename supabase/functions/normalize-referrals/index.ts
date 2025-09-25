import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Time zone configuration (copied from lib/time.ts)
const APP_BILLING_TZ = 'Europe/Madrid';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('🔄 CRON NORMALIZE REFERRALS: Iniciando normalização...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get referrals from the last 90 days to reduce scan
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    console.log('📅 Cutoff date:', cutoffDate.toISOString());

    const { data, error } = await supabase
      .from('referrals')
      .select('id, qualified_at, period_key')
      .eq('status', 'APPROVED')
      .gte('qualified_at', cutoffDate.toISOString());

    if (error) {
      console.log('❌ Query failed:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'QUERY_FAILED', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!data || data.length === 0) {
      console.log('✅ No referrals found to normalize');
      return new Response(
        JSON.stringify({ ok: true, updated: 0, message: 'No referrals to normalize' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`📋 Found ${data.length} referrals to check`);

    const updates = [];
    let processedCount = 0;
    
    for (const r of data) {
      processedCount++;
      
      if (!r.qualified_at) {
        console.log(`⚠️ Skipping referral ${r.id}: no qualified_at`);
        continue;
      }

      const dt = new Date(r.qualified_at);
      const parts = new Intl.DateTimeFormat('en-CA', { 
        timeZone: APP_BILLING_TZ, 
        year: 'numeric', 
        month: '2-digit' 
      }).formatToParts(dt);
      
      const y = parts.find(p => p.type === 'year')?.value ?? '1970';
      const m = parts.find(p => p.type === 'month')?.value ?? '01';
      const correctPk = `${y}-${m}`;

      // Only update if period_key is different
      if (r.period_key !== correctPk) {
        updates.push({ 
          id: r.id, 
          current_period_key: r.period_key,
          correct_period_key: correctPk,
          qualified_at: r.qualified_at
        });
      }
    }

    console.log(`🔍 Processed ${processedCount} referrals, ${updates.length} need updates`);

    // Perform updates
    let updatedCount = 0;
    for (const u of updates) {
      const { error: updateError } = await supabase
        .from('referrals')
        .update({ period_key: u.correct_period_key })
        .eq('id', u.id);

      if (updateError) {
        console.log(`❌ Failed to update referral ${u.id}:`, updateError);
      } else {
        updatedCount++;
        console.log(`✅ Updated referral ${u.id}: ${u.current_period_key} → ${u.correct_period_key}`);
      }
    }

    console.log(`✅ CRON NORMALIZE REFERRALS: Completed. ${updatedCount}/${updates.length} updates successful`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        updated: updatedCount,
        total_checked: processedCount,
        needed_updates: updates.length,
        summary: `Successfully updated ${updatedCount} out of ${updates.length} referrals that needed normalization`
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