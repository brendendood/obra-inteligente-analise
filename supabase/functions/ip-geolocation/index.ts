import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

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
  // Filtrar IPs locais/internos - retorna erro claro
  if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return {
      success: false,
      error: 'IP local detectado - geolocalização não disponível',
      source: 'local_ip_filter'
    };
  }

  // APIs múltiplas para garantir precisão máxima
  const apis = [
    {
      name: 'ipapi_com',
      url: `https://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon,isp,timezone`,
      parse: (data: any) => {
        if (data.status !== 'success') {
          throw new Error(data.message || 'Falha na API');
        }
        return {
          city: data.city || 'Localização não capturada',
          region: data.regionName || 'Região não capturada',
          country: data.country || 'País não capturado',
          latitude: data.lat || 0,
          longitude: data.lon || 0,
          isp: data.isp,
          timezone: data.timezone
        };
      }
    },
    {
      name: 'ipinfo_io',
      url: `https://ipinfo.io/${ip}/json`,
      parse: (data: any) => {
        if (data.bogon) {
          throw new Error('IP privado ou reservado');
        }
        const [lat, lon] = (data.loc || '0,0').split(',').map(Number);
        return {
          city: data.city || 'Localização não capturada',
          region: data.region || 'Região não capturada', 
          country: data.country || 'País não capturado',
          latitude: lat || 0,
          longitude: lon || 0,
          isp: data.org,
          timezone: data.timezone
        };
      }
    },
    {
      name: 'ipapi_co',
      url: `https://ipapi.co/${ip}/json/`,
      parse: (data: any) => {
        if (data.error) {
          throw new Error(data.reason || 'Erro na API');
        }
        return {
          city: data.city || 'Localização não capturada',
          region: data.region || 'Região não capturada',
          country: data.country_name || 'País não capturado',
          latitude: parseFloat(data.latitude) || 0,
          longitude: parseFloat(data.longitude) || 0,
          isp: data.org,
          timezone: data.timezone
        };
      }
    }
  ];

  for (const api of apis) {
    try {
      console.log(`🌍 Tentando ${api.name} para IP: ${ip}`);
      
      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'MadenAI-GeoLocation/2.0',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(8000) // 8 segundos timeout
      });

      if (!response.ok) {
        console.log(`❌ ${api.name} retornou status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const parsed = api.parse(data);
      
      // Validação rigorosa - dados DEVEM ser reais
      if (!parsed.city || !parsed.country || 
          parsed.city === 'Localização não capturada' || 
          parsed.country === 'País não capturado' ||
          (parsed.latitude === 0 && parsed.longitude === 0)) {
        console.log(`❌ ${api.name} retornou dados incompletos ou inválidos`);
        continue;
      }

      console.log(`✅ ${api.name} capturou localização REAL:`, {
        location: `${parsed.city}, ${parsed.region}, ${parsed.country}`,
        coordinates: `${parsed.latitude}, ${parsed.longitude}`
      });

      return {
        success: true,
        data: parsed,
        source: api.name
      };

    } catch (error) {
      console.log(`❌ Erro em ${api.name}:`, error.message);
      continue;
    }
  }

  return {
    success: false,
    error: 'TODAS as APIs de geolocalização falharam - IP pode ser inválido ou bloqueado',
    source: 'all_apis_failed'
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🌍 GEOLOCALIZAÇÃO REAL: Iniciando captura precisa...');
    
    // Extrair dados da requisição
    const { ip_address, login_id, user_id, force_update = false } = await req.json();

    // Validar autenticação via JWT
    const authHeader = req.headers.get('Authorization') || '';
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: auth } = await supabaseAuth.auth.getUser();
    if (!auth?.user) {
      return new Response(JSON.stringify({ success: false, error: 'unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Se user_id for fornecido, deve corresponder ao usuário autenticado
    if (user_id && user_id !== auth.user.id) {
      return new Response(JSON.stringify({ success: false, error: 'forbidden_user_mismatch' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!ip_address) {
      throw new Error('IP address é obrigatório');
    }

    if (!login_id) {
      throw new Error('Login ID é obrigatório');
    }

    // Verificar se o login_id pertence ao usuário autenticado
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const { data: loginRow } = await supabaseAdmin
      .from('user_login_history')
      .select('user_id')
      .eq('id', login_id)
      .single();
    if (!loginRow || loginRow.user_id !== auth.user.id) {
      return new Response(JSON.stringify({ success: false, error: 'forbidden_login_ownership' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('📡 Capturando localização REAL para:', { 
      ip_address, 
      login_id, 
      user_id, 
      force_update, 
      caller: auth.user.id 
    });

    // Obter geolocalização REAL e PRECISA
    const geoResult = await getGeolocationFromIP(ip_address);
    
    if (!geoResult.success) {
      console.log('❌ FALHA na captura de geolocalização real:', geoResult.error);
      
      // Para IPs locais, não salvar localização falsa
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabase
        .from('user_login_history')
        .update({
          ip_address,
          city: null,
          region: null,
          country: null,
          latitude: null,
          longitude: null
        })
        .eq('id', login_id);

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: geoResult.error,
          source: geoResult.source,
          message: 'Geolocalização não disponível - IP local ou inválido'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Conectar ao Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { city, region, country, latitude, longitude, isp, timezone } = geoResult.data!;

    // Atualizar login_history com localização REAL
    const { error: updateError } = await supabase
      .from('user_login_history')
      .update({
        ip_address,
        city,
        region,
        country,
        latitude,
        longitude,
      })
      .eq('id', login_id);

    if (updateError) {
      console.error('❌ Erro ao atualizar login_history:', updateError);
      throw updateError;
    }

    console.log('✅ Login history atualizado com geolocalização REAL');

    // Se user_id fornecido, atualizar perfil conforme necessário
    if (user_id) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('city, state, country')
        .eq('user_id', user_id)
        .single();

      // Atualizar perfil se:
      // 1. force_update=true OU
      // 2. Perfil não tem localização OU  
      // 3. Perfil tem localização genérica como "Brasil"
      const shouldUpdateProfile = force_update || 
        !profile?.city || 
        !profile?.country ||
        (profile?.country === 'Brasil' && country !== 'Brazil') ||
        (profile?.country === 'Brazil' && city !== profile?.city);

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
          console.log('✅ Perfil atualizado com localização REAL');
        }
      }
    }

    console.log('🎯 GEOLOCALIZAÇÃO REAL CAPTURADA:', {
      ip_address,
      location: `${city}, ${region}, ${country}`,
      coordinates: `${latitude}, ${longitude}`,
      source: geoResult.source,
      isp: isp?.substring(0, 50) // Truncar ISP se muito longo
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
        ip_address,
        message: `Geolocalização REAL capturada via ${geoResult.source}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ ERRO CRÍTICO na geolocalização:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Falha crítica na captura de geolocalização'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});