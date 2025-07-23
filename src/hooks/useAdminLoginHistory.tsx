import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LoginHistory {
  id: string;
  user_id: string;
  login_at: string;
  ip_address?: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  device_type?: string;
  browser?: string;
  os?: string;
  user_agent?: string;
  session_duration?: number;
}

export const useAdminLoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLoginHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📈 ADMIN: Carregando histórico real de logins...');
      
      const { data, error: queryError } = await supabase
        .from('user_login_history')
        .select('*')
        .order('login_at', { ascending: false })
        .limit(100);

      if (queryError) {
        throw queryError;
      }

      console.log(`📊 Histórico de login carregado: ${data?.length || 0} registros reais`);
      setLoginHistory((data || []).map(item => ({
        ...item,
        ip_address: item.ip_address?.toString() || undefined
      })));
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar histórico de logins:', err);
      setError(err.message);
      setLoginHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoginHistory();
  }, []);

  return {
    loginHistory,
    loading,
    error,
    refreshHistory: loadLoginHistory
  };
};