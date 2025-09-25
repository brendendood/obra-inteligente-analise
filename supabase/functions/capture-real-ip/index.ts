import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IPResult {
  ip: string;
  source: string;
}

// Capturar IP real do usuário usando múltiplas APIs
async function getRealUserIP(): Promise<IPResult> {
  const apis = [
    { name: 'ipify', url: 'https://api.ipify.org?format=json' },
    { name: 'httpbin', url: 'https://httpbin.org/ip' },
    { name: 'icanhazip', url: 'https://icanhazip.com' }
  ];

  for (const api of apis) {
    try {
      console.log(`🔍 Tentando capturar IP via ${api.name}...`);
      
      const response = await fetch(api.url, {
        method: 'GET',
        headers: { 'User-Agent': 'MadenAI-IPCapture/1.0' },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) continue;

      let data;
      const text = await response.text();
      
      if (api.name === 'icanhazip') {
        data = { ip: text.trim() };
      } else {
        data = JSON.parse(text);
      }

      const ip = data.ip || data.origin?.split(',')[0]?.trim();
      
      if (ip && ip !== '127.0.0.1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
        console.log(`✅ IP real capturado via ${api.name}: ${ip}`);
        return { ip, source: api.name };
      }
    } catch (error) {
      console.log(`❌ Falha em ${api.name}:`, error instanceof Error ? error.message : String(error));
      continue;
    }
  }

  return { ip: '127.0.0.1', source: 'fallback' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🌐 CAPTURA IP REAL: Iniciando...');
    
    const { user_id, force_capture = false, frontend_ip } = await req.json();

    if (!user_id) {
      throw new Error('user_id é obrigatório');
    }

    console.log('👤 Capturando IP real para usuário:', user_id);

    // Usar IP capturado do frontend se disponível, senão tentar APIs
    let ipResult: IPResult;
    
    if (frontend_ip && frontend_ip !== '127.0.0.1') {
      console.log(`✅ Usando IP real do frontend: ${frontend_ip}`);
      ipResult = { ip: frontend_ip, source: 'frontend' };
    } else {
      console.log('🔍 IP do frontend não disponível, tentando APIs...');
      ipResult = await getRealUserIP();
      
      if (ipResult.ip === '127.0.0.1') {
        console.log('⚠️ Não foi possível capturar IP real, usando fallback');
      }
    }

    // Conectar ao Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Criar registro de login em tempo real
    const { data: loginRecord, error: loginError } = await supabase
      .from('user_login_history')
      .insert({
        user_id,
        login_at: new Date().toISOString(),
        ip_address: ipResult.ip,
        user_agent: req.headers.get('user-agent') || 'Real IP Capture',
        device_type: 'Desktop',
        browser: 'Real Capture',
        os: 'Unknown'
      })
      .select('id')
      .single();

    if (loginError) {
      console.error('❌ Erro ao criar registro de login:', loginError);
      throw loginError;
    }

    console.log('✅ Registro de login criado:', loginRecord.id);

    // Disparar geolocalização ENHANCED para o IP capturado
    if (ipResult.ip !== '127.0.0.1') {
      console.log('🌍 Iniciando geolocalização ENHANCED para IP:', ipResult.ip);
      
      try {
        // Usar URL completa para chamar a edge function
        const geoResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ip-geolocation-enhanced`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ip_address: ipResult.ip,
            login_id: loginRecord.id,
            user_id,
            force_update: true
          })
        });

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          console.log('✅ Geolocalização ENHANCED concluída:', geoData);
        } else {
          console.error('❌ Erro na geolocalização ENHANCED:', geoResponse.status);
        }
      } catch (error) {
        console.error('❌ Falha ao chamar geolocalização ENHANCED:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ip_address: ipResult.ip,
        source: ipResult.source,
        login_id: loginRecord.id,
        message: `IP real capturado via ${ipResult.source}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ ERRO na captura de IP real:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});