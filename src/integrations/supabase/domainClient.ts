
import { createClient } from '@supabase/supabase-js';
import { isCustomDomain } from '@/utils/domainConfig';

// Configuração específica para domínio personalizado
const getSupabaseConfig = () => {
  const supabaseUrl = 'https://mozqijzvtbuwuzgemzsm.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1venFpanp2dGJ1d3V6Z2VtenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTI2NTcsImV4cCI6MjA2NjEyODY1N30.03WIeunsXuTENSrXfsFjCYy7jehJVYaWK2Nt00Fx8sA';
  
  const config = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Configurações específicas para domínio personalizado
      ...(isCustomDomain() && {
        flowType: 'implicit' as const,
        redirectTo: 'https://arqcloud.com.br/painel'
      })
    },
    global: {
      headers: {
        'X-Client-Info': isCustomDomain() ? 'arqcloud.com.br' : 'lovable-app'
      }
    }
  };
  
  return { supabaseUrl, supabaseAnonKey, config };
};

const { supabaseUrl, supabaseAnonKey, config } = getSupabaseConfig();

export const domainSupabase = createClient(supabaseUrl, supabaseAnonKey, config);

// Função para verificar conectividade
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await domainSupabase.from('projects').select('count').limit(1);
    
    if (error) {
      console.error('🔴 SUPABASE: Erro de conexão:', error);
      return false;
    }
    
    console.log('✅ SUPABASE: Conexão estabelecida com sucesso');
    return true;
  } catch (err) {
    console.error('🔴 SUPABASE: Falha na conexão:', err);
    return false;
  }
};
