import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface GeolocationResult {
  success: boolean;
  captured: boolean;
  error?: string;
}

/**
 * Hook para capturar geolocalização apenas quando o usuário acessa o painel
 * Funciona de forma assíncrona e não-bloqueante
 */
export const useDashboardGeolocation = () => {
  const { user, isAuthenticated } = useAuth();
  const [result, setResult] = useState<GeolocationResult>({ success: false, captured: false });
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user || isCapturing) return;

    const captureGeolocation = async () => {
      setIsCapturing(true);
      
      try {
        console.log('🌍 DASHBOARD GEOLOCATION: Iniciando captura de localização...');
        
        // Buscar último login do usuário
        const { data: latestLogin, error: loginError } = await supabase
          .from('user_login_history')
          .select('id, ip_address, city, country')
          .eq('user_id', user.id)
          .order('login_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (loginError) {
          console.error('❌ DASHBOARD GEOLOCATION: Erro ao buscar login:', loginError);
          setResult({ success: false, captured: false, error: 'Erro ao buscar histórico de login' });
          return;
        }

        if (!latestLogin) {
          console.log('⚠️ DASHBOARD GEOLOCATION: Nenhum login encontrado');
          setResult({ success: false, captured: false, error: 'Nenhum login encontrado' });
          return;
        }

        // Se já tem localização, não precisa capturar novamente
        if (latestLogin.city && latestLogin.country) {
          console.log('✅ DASHBOARD GEOLOCATION: Localização já capturada:', {
            city: latestLogin.city,
            country: latestLogin.country
          });
          setResult({ success: true, captured: true });
          return;
        }

        // Forçar captura de geolocalização para este login
        console.log('🔄 DASHBOARD GEOLOCATION: Forçando captura para login:', latestLogin.id);
        
        const { data, error } = await supabase.functions.invoke('ip-geolocation', {
          body: {
            loginId: latestLogin.id,
            ipAddress: latestLogin.ip_address
          }
        });

        if (error) {
          console.error('❌ DASHBOARD GEOLOCATION: Erro na edge function:', error);
          setResult({ success: false, captured: false, error: 'Erro na captura de localização' });
          return;
        }

        console.log('✅ DASHBOARD GEOLOCATION: Captura iniciada com sucesso:', data);
        setResult({ success: true, captured: true });

      } catch (error) {
        console.error('💥 DASHBOARD GEOLOCATION: Erro inesperado:', error);
        setResult({ 
          success: false, 
          captured: false, 
          error: error instanceof Error ? error.message : 'Erro inesperado' 
        });
      } finally {
        setIsCapturing(false);
      }
    };

    // Executar após um pequeno delay para não interferir no carregamento do painel
    const timeoutId = setTimeout(captureGeolocation, 2000);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, isCapturing]);

  return {
    isCapturing,
    result,
    // Função para forçar nova captura se necessário
    forceCapture: () => {
      if (!isCapturing) {
        setIsCapturing(false); // Reset para trigger o useEffect
      }
    }
  };
};