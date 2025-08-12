import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface GeolocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  isp?: string;
  timezone?: string;
  accuracy?: string;
}

interface GeolocationResponse {
  success: boolean;
  location?: GeolocationData;
  source?: string;
  error?: string;
  ip_address?: string;
}

interface GeolocationProvider {
  name: string;
  url: (ip: string) => string;
  transform: (data: any) => GeolocationData | null;
  priority: number;
}

// Múltiplos provedores com fallback inteligente
const providers: GeolocationProvider[] = [
  // 1. BigDataCloud - Mais preciso, 10k requests/mês grátis
  {
    name: 'BigDataCloud',
    url: (ip: string) => `https://api.bigdatacloud.net/data/ip-geolocation?ip=${ip}&key=free`,
    transform: (data: any) => {
      if (!data || data.status === 'fail' || !data.city) return null;
      return {
        city: data.city,
        region: data.principalSubdivision || data.countryCode,
        country: data.countryName,
        latitude: parseFloat(data.location?.latitude || 0),
        longitude: parseFloat(data.location?.longitude || 0),
        isp: data.network?.organisation,
        timezone: data.location?.timeZone?.ianaTimeId,
        accuracy: 'high'
      };
    },
    priority: 1
  },
  
  // 2. ip-api.com - Sem limites, boa precisão
  {
    name: 'IP-API',
    url: (ip: string) => `https://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,isp,timezone,query`,
    transform: (data: any) => {
      if (!data || data.status !== 'success' || !data.city) return null;
      return {
        city: data.city,
        region: data.regionName,
        country: data.country,
        latitude: parseFloat(data.lat || 0),
        longitude: parseFloat(data.lon || 0),
        isp: data.isp,
        timezone: data.timezone,
        accuracy: 'medium'
      };
    },
    priority: 2
  },
  
  // 3. ipinfo.io - 50k requests/mês grátis
  {
    name: 'IPInfo',
    url: (ip: string) => `https://ipinfo.io/${ip}/json`,
    transform: (data: any) => {
      if (!data || data.bogon || !data.city) return null;
      const [lat, lon] = (data.loc || '0,0').split(',');
      return {
        city: data.city,
        region: data.region,
        country: data.country,
        latitude: parseFloat(lat || 0),
        longitude: parseFloat(lon || 0),
        isp: data.org,
        timezone: data.timezone,
        accuracy: 'medium'
      };
    },
    priority: 3
  },
  
  // 4. ipapi.co - 30k requests/mês grátis
  {
    name: 'IPAPI',
    url: (ip: string) => `https://ipapi.co/${ip}/json/`,
    transform: (data: any) => {
      if (!data || data.error || !data.city) return null;
      return {
        city: data.city,
        region: data.region,
        country: data.country_name,
        latitude: parseFloat(data.latitude || 0),
        longitude: parseFloat(data.longitude || 0),
        isp: data.org,
        timezone: data.timezone,
        accuracy: 'medium'
      };
    },
    priority: 4
  }
];

// Validação rigorosa de IPs
function isValidPublicIP(ip: string): boolean {
  try {
    const ipAddress = new URL(`http://${ip}`).hostname;
    
    // IPs locais e privados
    const privateRanges = [
      /^127\./, // Loopback
      /^10\./, // Classe A privada
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Classe B privada
      /^192\.168\./, // Classe C privada
      /^169\.254\./, // Link-local
      /^::1$/, // IPv6 loopback
      /^fc00:/, // IPv6 unique local
      /^fe80:/, // IPv6 link-local
      /^::ffff:/, // IPv4-mapped IPv6
    ];
    
    // Verificar se é IP privado
    for (const range of privateRanges) {
      if (range.test(ipAddress)) {
        return false;
      }
    }
    
    // Verificar se é IP de broadcast ou multicast
    if (ipAddress === '0.0.0.0' || ipAddress === '255.255.255.255') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Validação de qualidade dos dados
function validateGeolocationData(data: GeolocationData): boolean {
  // Verificar campos obrigatórios
  if (!data.city || !data.region || !data.country) {
    return false;
  }
  
  // Verificar se não são dados genéricos
  const genericValues = ['unknown', 'teste', 'test', 'local', 'private', 'n/a', '-', ''];
  if (genericValues.includes(data.city.toLowerCase()) ||
      genericValues.includes(data.region.toLowerCase()) ||
      genericValues.includes(data.country.toLowerCase())) {
    return false;
  }
  
  // Verificar coordenadas válidas
  if (data.latitude === 0 && data.longitude === 0) {
    return false;
  }
  
  if (data.latitude < -90 || data.latitude > 90 ||
      data.longitude < -180 || data.longitude > 180) {
    return false;
  }
  
  return true;
}

// Buscar geolocalização com múltiplos provedores
async function getGeolocationFromIP(ip: string): Promise<GeolocationResponse> {
  console.log(`🌍 ENHANCED GEOLOCATION: Iniciando busca para IP ${ip}`);
  
  // Validar IP público
  if (!isValidPublicIP(ip)) {
    console.log(`❌ IP inválido ou privado: ${ip}`);
    return {
      success: false,
      error: `IP inválido ou privado: ${ip}`,
      ip_address: ip
    };
  }
  
  // Tentar cada provedor em ordem de prioridade
  for (const provider of providers.sort((a, b) => a.priority - b.priority)) {
    try {
      console.log(`🔄 Tentando ${provider.name} para IP ${ip}`);
      
      const response = await fetch(provider.url(ip), {
        method: 'GET',
        headers: {
          'User-Agent': 'MadenAI-Geolocation/1.0',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      });
      
      if (!response.ok) {
        console.log(`❌ ${provider.name} retornou status ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      const location = provider.transform(data);
      
      if (!location) {
        console.log(`❌ ${provider.name} retornou dados inválidos`);
        continue;
      }
      
      // Validar qualidade dos dados
      if (!validateGeolocationData(location)) {
        console.log(`❌ ${provider.name} retornou dados de baixa qualidade`);
        continue;
      }
      
      console.log(`✅ ${provider.name} retornou dados válidos:`, {
        city: location.city,
        region: location.region,
        country: location.country,
        accuracy: location.accuracy
      });
      
      return {
        success: true,
        location,
        source: provider.name,
        ip_address: ip
      };
      
    } catch (error) {
      console.log(`❌ Erro no ${provider.name}:`, error.message);
      continue;
    }
  }
  
  return {
    success: false,
    error: 'Todos os provedores de geolocalização falharam',
    ip_address: ip
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { ip_address, login_id, user_id, force_update = false } = await req.json();

    // Auth required
    const authHeader = req.headers.get('Authorization') || '';
    const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') || '', { global: { headers: { Authorization: authHeader } } });
    const { data: auth } = await supabaseAuth.auth.getUser();
    if (!auth?.user) {
      return new Response(JSON.stringify({ success: false, error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (user_id && user_id !== auth.user.id) {
      return new Response(JSON.stringify({ success: false, error: 'forbidden_user_mismatch' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (!ip_address) {
      return new Response(
        JSON.stringify({ success: false, error: 'IP address é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If login_id provided, ensure it belongs to caller
    if (login_id) {
      const { data: loginRow } = await supabase
        .from('user_login_history')
        .select('user_id')
        .eq('id', login_id)
        .single();
      if (!loginRow || loginRow.user_id !== auth.user.id) {
        return new Response(JSON.stringify({ success: false, error: 'forbidden_login_ownership' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    console.log(`🔄 ENHANCED GEOLOCATION: Processando IP ${ip_address}, login_id: ${login_id}, user_id: ${user_id}`);

    // Buscar geolocalização
    const geoResult = await getGeolocationFromIP(ip_address);
    
    if (!geoResult.success || !geoResult.location) {
      console.log(`❌ Falha na geolocalização: ${geoResult.error}`);
      return new Response(
        JSON.stringify(geoResult),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const location = geoResult.location;
    console.log(`✅ Localização obtida de ${geoResult.source}:`, location);

    // Atualizar histórico de login se login_id fornecido
    if (login_id) {
      const { error: loginError } = await supabase
        .from('user_login_history')
        .update({
          city: location.city,
          region: location.region,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude
        })
        .eq('id', login_id);

      if (loginError) {
        console.error('❌ Erro ao atualizar login history:', loginError);
      } else {
        console.log('✅ Login history atualizado com sucesso');
      }
    }

    // Atualizar perfil do usuário se necessário
    if (user_id && (force_update || !login_id)) {
      // Verificar se perfil precisa de atualização
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('city, state, country')
        .eq('user_id', user_id)
        .single();

      const needsUpdate = !profile || 
                         !profile.city || 
                         !profile.state || 
                         profile.country !== location.country ||
                         force_update;

      if (needsUpdate) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            city: location.city,
            state: location.region,
            country: location.country
          })
          .eq('user_id', user_id);

        if (profileError) {
          console.error('❌ Erro ao atualizar profile:', profileError);
        } else {
          console.log('✅ Profile atualizado com sucesso');
        }
      }
    }

    const result = {
      success: true,
      location,
      source: geoResult.source,
      ip_address,
      login_id,
      user_id,
      quality_score: location.accuracy === 'high' ? 95 : 80
    };

    console.log('✅ ENHANCED GEOLOCATION: Processamento concluído:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 ENHANCED GEOLOCATION: Erro inesperado:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});