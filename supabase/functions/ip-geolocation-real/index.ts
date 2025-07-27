import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GeolocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  isp?: string;
  timezone?: string;
}

interface GeolocationResponse {
  success: boolean;
  data?: GeolocationData;
  error?: string;
  source: string;
}

async function getGeolocationFromIP(ip: string): Promise<GeolocationResponse> {
  // Filtrar IPs locais/internos
  if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return {
      success: false,
      error: 'IP local detectado - geolocalização indisponível',
      source: 'local_ip_filter'
    };
  }

  // Tentar múltiplas APIs para garantir precisão
  const apis = [
    {
      name: 'ipapi',
      url: `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon,isp,timezone`,
      parse: (data: any) => ({
        city: data.city || 'Não disponível',
        region: data.regionName || 'Não disponível',
        country: data.country || 'Não disponível',
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        isp: data.isp,
        timezone: data.timezone
      })
    },
    {
      name: 'ipinfo',
      url: `https://ipinfo.io/${ip}/json`,
      parse: (data: any) => {
        const [lat, lon] = (data.loc || '0,0').split(',').map(Number);
        return {
          city: data.city || 'Não disponível',
          region: data.region || 'Não disponível', 
          country: data.country || 'Não disponível',
          latitude: lat || 0,
          longitude: lon || 0,
          isp: data.org,
          timezone: data.timezone
        };
      }
    }
  ];

  for (const api of apis) {
    try {
      console.log(`🌍 Tentando API ${api.name} para IP: ${ip}`);
      
      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'MadenAI-Geolocation/1.0'
        },
        signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
      });

      if (!response.ok) {
        console.log(`❌ API ${api.name} falhou: ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      // Verificar se é uma resposta válida
      if (api.name === 'ipapi' && data.status === 'fail') {
        console.log(`❌ API ${api.name} retornou erro: ${data.message}`);
        continue;
      }

      const parsed = api.parse(data);
      
      // Validar dados básicos
      if (!parsed.city || !parsed.country || parsed.city === 'Não disponível') {
        console.log(`❌ API ${api.name} retornou dados incompletos`);
        continue;
      }

      console.log(`✅ API ${api.name} retornou dados válidos:`, parsed);
      return {
        success: true,
        data: parsed,
        source: api.name
      };

    } catch (error) {
      console.log(`❌ Erro na API ${api.name}:`, error);
      continue;
    }
  }

  return {
    success: false,
    error: 'Todas as APIs de geolocalização falharam',
    source: 'all_apis_failed'
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ip_address, login_id, user_id, force_update = false } = await req.json()

    if (!ip_address) {
      throw new Error('IP address é obrigatório')
    }

    console.log('🌍 Iniciando geolocalização real para:', { ip_address, login_id, user_id, force_update });

    // Obter geolocalização real
    const geoResult = await getGeolocationFromIP(ip_address);
    
    if (!geoResult.success) {
      console.log('❌ Falha na geolocalização:', geoResult.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: geoResult.error,
          source: geoResult.source 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Conectar ao Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { city, region, country, latitude, longitude, isp, timezone } = geoResult.data!;

    // Atualizar registro de login se login_id fornecido
    if (login_id) {
      const { error: updateError } = await supabase
        .from('user_login_history')
        .update({
          city,
          region,
          country,
          latitude,
          longitude,
        })
        .eq('id', login_id);

      if (updateError) {
        console.error('❌ Erro ao atualizar login_history:', updateError);
      } else {
        console.log('✅ Login history atualizado com geolocalização real');
      }
    }

    // Se fornecido user_id, verificar se precisamos atualizar o perfil também
    if (user_id) {
      // Buscar dados atuais do perfil
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('city, state, country')
        .eq('user_id', user_id)
        .single();

      // Só atualizar se force_update=true ou se o perfil não tem localização
      const shouldUpdateProfile = force_update || 
        !profile?.city || 
        !profile?.country ||
        profile?.country === 'Brasil' && country !== 'Brazil'; // Corrigir "Brasil" genérico

      if (shouldUpdateProfile) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            city,
            state: region,
            country
          })
          .eq('user_id', user_id);

        if (profileError) {
          console.error('❌ Erro ao atualizar perfil:', profileError);
        } else {
          console.log('✅ Perfil do usuário atualizado com localização real');
        }
      }
    }

    console.log('✅ Geolocalização real capturada com sucesso:', {
      ip_address,
      location: `${city}, ${region}, ${country}`,
      coordinates: `${latitude}, ${longitude}`,
      source: geoResult.source
    });

    return new Response(
      JSON.stringify({
        success: true,
        location: {
          city,
          region,
          country,
          latitude,
          longitude,
          isp,
          timezone
        },
        source: geoResult.source,
        message: 'Geolocalização real capturada com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Erro na function de geolocalização:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})