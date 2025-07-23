import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GeolocationResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🌍 IP Geolocation: Iniciando captura de localização...');
    
    // Extrair IP real do usuário
    const realIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   req.headers.get('cf-connecting-ip') ||
                   'unknown';
    
    console.log('📡 IP Real detectado:', realIP);

    const { loginId } = await req.json();
    
    if (!loginId) {
      throw new Error('Login ID é obrigatório');
    }

    // Fazer lookup de geolocalização baseado no IP
    let geoData: GeolocationResponse | null = null;
    
    if (realIP !== 'unknown' && realIP !== '127.0.0.1') {
      try {
        // Usar ipapi.co para lookup de geolocalização
        const geoResponse = await fetch(`https://ipapi.co/${realIP}/json/`);
        const geoJson = await geoResponse.json();
        
        if (geoJson && !geoJson.error) {
          geoData = {
            ip: realIP,
            city: geoJson.city || 'Desconhecida',
            region: geoJson.region || 'Desconhecido', 
            country: geoJson.country_name || 'Desconhecido',
            latitude: parseFloat(geoJson.latitude) || 0,
            longitude: parseFloat(geoJson.longitude) || 0
          };
          
          console.log('📍 Localização capturada:', geoData);
        }
      } catch (error) {
        console.error('❌ Erro no lookup de geolocalização:', error);
      }
    }

    // Conectar ao Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Atualizar registro de login com dados de geolocalização
    if (geoData) {
      const { error: updateError } = await supabase
        .from('user_login_history')
        .update({
          ip_address: geoData.ip,
          city: geoData.city,
          region: geoData.region,
          country: geoData.country,
          latitude: geoData.latitude,
          longitude: geoData.longitude
        })
        .eq('id', loginId);

      if (updateError) {
        console.error('❌ Erro ao atualizar login history:', updateError);
        throw updateError;
      }

      console.log('✅ Login atualizado com geolocalização real');
    } else {
      // Se não conseguiu capturar localização, ao menos salvar o IP
      const { error: updateError } = await supabase
        .from('user_login_history')
        .update({
          ip_address: realIP,
          city: 'Desconhecida',
          country: 'Desconhecido'
        })
        .eq('id', loginId);

      if (updateError) {
        console.error('❌ Erro ao atualizar IP:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: geoData,
        ip: realIP
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Erro na Edge Function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});