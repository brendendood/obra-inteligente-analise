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
    
    // Extrair IP real do usuário (priorizar headers de proxy)
    const realIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   req.headers.get('cf-connecting-ip') ||
                   req.headers.get('x-client-ip') ||
                   'unknown';
    
    console.log('📡 IP Real detectado:', realIP);

    // Parse do body da requisição
    let loginId: string | null = null;
    let targetIP = realIP;
    
    try {
      const body = await req.json();
      loginId = body.loginId;
      // Permitir override do IP se fornecido no body
      if (body.ipAddress) {
        targetIP = body.ipAddress;
      }
    } catch (error) {
      console.log('⚠️ Body inválido, usando apenas IP dos headers');
    }
    
    if (!loginId) {
      return new Response(
        JSON.stringify({ 
          error: 'Login ID é obrigatório',
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Fazer lookup de geolocalização baseado no IP
    let geoData: GeolocationResponse | null = null;
    
    if (targetIP !== 'unknown' && targetIP !== '127.0.0.1' && targetIP !== '::1') {
      try {
        console.log('🔍 Fazendo lookup de geolocalização para IP:', targetIP);
        
        // Usar ipapi.co para lookup de geolocalização
        const geoResponse = await fetch(`https://ipapi.co/${targetIP}/json/`, {
          headers: {
            'User-Agent': 'MadenAI/1.0 (Geolocation Service)'
          }
        });
        
        if (!geoResponse.ok) {
          throw new Error(`HTTP ${geoResponse.status}: ${geoResponse.statusText}`);
        }
        
        const geoJson = await geoResponse.json();
        console.log('📍 Resposta da API de geolocalização:', geoJson);
        
        if (geoJson && !geoJson.error && geoJson.latitude && geoJson.longitude) {
          geoData = {
            ip: targetIP,
            city: geoJson.city || 'Desconhecida',
            region: geoJson.region || 'Desconhecido', 
            country: geoJson.country_name || 'Desconhecido',
            latitude: parseFloat(geoJson.latitude) || 0,
            longitude: parseFloat(geoJson.longitude) || 0
          };
          
          console.log('✅ Localização capturada com sucesso:', geoData);
        } else {
          console.warn('⚠️ API retornou dados inválidos:', geoJson);
        }
      } catch (error) {
        console.error('❌ Erro no lookup de geolocalização:', error);
        
        // Fallback: tentar uma segunda API
        try {
          console.log('🔄 Tentando API alternativa...');
          const fallbackResponse = await fetch(`http://ip-api.com/json/${targetIP}?fields=status,country,region,city,lat,lon`, {
            headers: {
              'User-Agent': 'MadenAI/1.0 (Geolocation Service)'
            }
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            
            if (fallbackData.status === 'success') {
              geoData = {
                ip: targetIP,
                city: fallbackData.city || 'Desconhecida',
                region: fallbackData.region || 'Desconhecido',
                country: fallbackData.country || 'Desconhecido', 
                latitude: fallbackData.lat || 0,
                longitude: fallbackData.lon || 0
              };
              
              console.log('✅ Localização capturada via API alternativa:', geoData);
            }
          }
        } catch (fallbackError) {
          console.error('❌ API alternativa também falhou:', fallbackError);
        }
      }
    } else {
      console.log('⚠️ IP local ou inválido detectado, pulando geolocalização');
    }

    // Conectar ao Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Atualizar registro de login com dados de geolocalização
    if (geoData) {
      console.log('💾 Atualizando registro de login com geolocalização...');
      
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
      // Se não conseguiu capturar localização, ao menos salvar o IP real
      console.log('💾 Salvando apenas IP (sem geolocalização)...');
      
      const { error: updateError } = await supabase
        .from('user_login_history')
        .update({
          ip_address: targetIP,
          city: 'Desconhecida',
          region: 'Desconhecido',
          country: 'Desconhecido'
        })
        .eq('id', loginId);

      if (updateError) {
        console.error('❌ Erro ao atualizar IP:', updateError);
        throw updateError;
      }
      
      console.log('⚠️ Login atualizado apenas com IP (geolocalização falhou)');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: geoData,
        ip: targetIP,
        message: geoData ? 'Localização capturada com sucesso' : 'IP salvo, mas geolocalização falhou'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Erro fatal na Edge Function:', error);
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