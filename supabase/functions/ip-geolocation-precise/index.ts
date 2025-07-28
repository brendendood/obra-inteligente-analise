import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeolocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  isp: string;
  timezone: string;
}

interface GeolocationResponse {
  success: boolean;
  location?: GeolocationData;
  source: string;
  error?: string;
  isDataCenter?: boolean;
  confidence?: 'high' | 'medium' | 'low';
}

interface GeolocationProvider {
  name: string;
  url: string;
  apiKey?: string;
  transform: (data: any) => GeolocationData | null;
  priority: number;
}

// Proveedores de geolocalização mais precisos
const providers: GeolocationProvider[] = [
  {
    name: 'ipgeolocation_io',
    url: 'https://api.ipgeolocation.io/ipgeo',
    priority: 1,
    transform: (data: any) => {
      if (!data.city || !data.country_name) return null;
      return {
        city: data.city,
        region: data.state_prov || data.district,
        country: data.country_name,
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        isp: data.isp || 'Unknown',
        timezone: data.time_zone?.name || 'Unknown'
      };
    }
  },
  {
    name: 'bigdatacloud',
    url: 'https://api-bdc.net/data/ip-geolocation-full',
    priority: 2,
    transform: (data: any) => {
      if (!data.city || !data.country?.name) return null;
      return {
        city: data.city,
        region: data.principalSubdivision || data.localityInfo?.administrative?.[0]?.name,
        country: data.country.name,
        latitude: parseFloat(data.location?.latitude) || 0,
        longitude: parseFloat(data.location?.longitude) || 0,
        isp: data.network?.organisation || 'Unknown',
        timezone: data.location?.timeZone?.name || 'Unknown'
      };
    }
  },
  {
    name: 'ipapi_com',
    url: 'https://ipapi.com/api',
    priority: 3,
    transform: (data: any) => {
      if (!data.city || !data.country_name) return null;
      return {
        city: data.city,
        region: data.region_name,
        country: data.country_name,
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        isp: data.connection?.isp || 'Unknown',
        timezone: data.time_zone?.name || 'Unknown'
      };
    }
  }
];

// Detectar se IP é de data center
function isDataCenterIP(isp: string, org: string = ''): boolean {
  const dataCenterKeywords = [
    'amazon', 'aws', 'google', 'microsoft', 'azure', 'cloudflare',
    'digitalocean', 'linode', 'vultr', 'ovh', 'hetzner', 'scaleway',
    'data center', 'datacenter', 'hosting', 'cloud', 'cdn', 'server'
  ];
  
  const combined = `${isp} ${org}`.toLowerCase();
  return dataCenterKeywords.some(keyword => combined.includes(keyword));
}

// Validar qualidade dos dados de geolocalização
function validateGeolocationData(data: GeolocationData): boolean {
  const genericTerms = ['unknown', 'test', 'local', 'private', 'n/a', '-'];
  
  return (
    data.city && !genericTerms.includes(data.city.toLowerCase()) &&
    data.region && !genericTerms.includes(data.region.toLowerCase()) &&
    data.country && !genericTerms.includes(data.country.toLowerCase()) &&
    data.latitude !== 0 && data.longitude !== 0 &&
    Math.abs(data.latitude) <= 90 && Math.abs(data.longitude) <= 180
  );
}

async function getGeolocationFromIP(ip: string): Promise<GeolocationResponse> {
  console.log(`🌍 GEOLOCALIZAÇÃO PRECISA: Iniciando para IP ${ip}...`);

  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      success: false,
      source: 'validation',
      error: 'IP local ou inválido'
    };
  }

  const results: GeolocationResponse[] = [];

  // Tentar todos os proveedores em paralelo
  const promises = providers.map(async (provider) => {
    try {
      const url = new URL(provider.url);
      url.searchParams.set('ip', ip);
      
      if (provider.name === 'ipgeolocation_io') {
        url.searchParams.set('fields', 'city,state_prov,country_name,latitude,longitude,isp,time_zone');
      } else if (provider.name === 'bigdatacloud') {
        url.searchParams.set('localityLanguage', 'en');
      }

      console.log(`🌍 Consultando ${provider.name}...`);

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'MadenAI-Geolocation/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const location = provider.transform(data);

      if (!location || !validateGeolocationData(location)) {
        console.log(`❌ ${provider.name}: Dados inválidos ou incompletos`);
        return null;
      }

      const isDataCenter = isDataCenterIP(location.isp);
      const confidence = isDataCenter ? 'low' : 'high';

      console.log(`✅ ${provider.name}: ${location.city}, ${location.region}, ${location.country} (${confidence})`);

      return {
        success: true,
        location,
        source: provider.name,
        isDataCenter,
        confidence
      };
    } catch (error) {
      console.error(`❌ ${provider.name} falhou:`, error);
      return null;
    }
  });

  const responses = await Promise.allSettled(promises);
  
  responses.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      results.push(result.value);
    }
  });

  if (results.length === 0) {
    return {
      success: false,
      source: 'all_failed',
      error: 'Todos os provedores de geolocalização falharam'
    };
  }

  // Ordenar por confiança e prioridade
  results.sort((a, b) => {
    if (a.confidence === 'high' && b.confidence !== 'high') return -1;
    if (b.confidence === 'high' && a.confidence !== 'high') return 1;
    
    const providerA = providers.find(p => p.name === a.source);
    const providerB = providers.find(p => p.name === b.source);
    
    return (providerA?.priority || 999) - (providerB?.priority || 999);
  });

  const bestResult = results[0];
  
  console.log(`🎯 Melhor resultado: ${bestResult.source} - ${bestResult.location?.city}, ${bestResult.location?.country} (confiança: ${bestResult.confidence})`);

  return bestResult;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🌍 GEOLOCALIZAÇÃO PRECISA: Iniciando...');

    const { ip_address, login_id, user_id, force_update } = await req.json();

    if (!ip_address) {
      throw new Error('IP address é obrigatório');
    }

    console.log(`📡 Capturando localização PRECISA para: {
  ip_address: "${ip_address}",
  login_id: "${login_id}",
  user_id: "${user_id}",
  force_update: ${force_update}
}`);

    // Obter geolocalização precisa
    const geoResult = await getGeolocationFromIP(ip_address);

    if (!geoResult.success || !geoResult.location) {
      console.error('❌ Falha na captura de geolocalização:', geoResult.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: geoResult.error || 'Falha na geolocalização',
          ip_address 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Conectar ao Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Credenciais do Supabase não configuradas');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Atualizar user_login_history se login_id fornecido
    if (login_id) {
      const { error: loginError } = await supabase
        .from('user_login_history')
        .update({
          city: geoResult.location.city,
          region: geoResult.location.region,
          country: geoResult.location.country,
          latitude: geoResult.location.latitude,
          longitude: geoResult.location.longitude
        })
        .eq('id', login_id);

      if (loginError) {
        console.error('❌ Erro ao atualizar login history:', loginError);
      } else {
        console.log('✅ Login history atualizado com geolocalização PRECISA');
      }
    }

    // Atualizar user_profiles se necessário
    if (user_id && (force_update || geoResult.confidence === 'high')) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          city: geoResult.location.city,
          state: geoResult.location.region,
          country: geoResult.location.country
        })
        .eq('user_id', user_id);

      if (profileError) {
        console.error('❌ Erro ao atualizar perfil:', profileError);
      } else {
        console.log('✅ Perfil atualizado com localização PRECISA');
      }
    }

    console.log(`🎯 GEOLOCALIZAÇÃO PRECISA CAPTURADA: {
  ip_address: "${ip_address}",
  location: "${geoResult.location.city}, ${geoResult.location.region}, ${geoResult.location.country}",
  coordinates: "${geoResult.location.latitude}, ${geoResult.location.longitude}",
  source: "${geoResult.source}",
  confidence: "${geoResult.confidence}",
  isDataCenter: ${geoResult.isDataCenter},
  isp: "${geoResult.location.isp}"
}`);

    return new Response(
      JSON.stringify({
        success: true,
        ip_address,
        location: geoResult.location,
        source: geoResult.source,
        confidence: geoResult.confidence,
        isDataCenter: geoResult.isDataCenter
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ ERRO CRÍTICO na geolocalização precisa:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro inesperado' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});