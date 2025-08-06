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
 * Funciona de forma assíncrona e não-bloqueante com cache inteligente
 */
export const useDashboardGeolocation = () => {
  const { user, isAuthenticated } = useAuth();
  const [result, setResult] = useState<GeolocationResult>({ success: false, captured: false });
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Cache para evitar múltiplas capturas
  const captureCache = useState(() => new Map<string, GeolocationResult>())[0];
  const lastCaptureTime = useState(() => new Map<string, number>())[0];
  const minCaptureInterval = 300000; // 5 minutos

  useEffect(() => {
    if (!isAuthenticated || !user || isCapturing) return;

    const userId = user.id;
    const now = Date.now();
    
    // Verificar cache e throttling
    const cachedResult = captureCache.get(userId);
    const lastCapture = lastCaptureTime.get(userId) || 0;
    
    if (cachedResult && (now - lastCapture) < minCaptureInterval) {
      console.log('💾 DASHBOARD GEOLOCATION: Usando resultado em cache');
      setResult(cachedResult);
      return;
    }

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
        const successResult = { success: true, captured: true };
        setResult(successResult);
        
        // Atualizar cache
        captureCache.set(userId, successResult);
        lastCaptureTime.set(userId, now);

      } catch (error) {
        console.error('💥 DASHBOARD GEOLOCATION: Erro inesperado:', error);
        setResult({ 
          success: false, 
          captured: false, 
          error: error instanceof Error ? error.message : 'Erro inesperado' 
        });
        
        // Cache também os erros por um tempo menor
        const errorResult = { 
          success: false, 
          captured: false, 
          error: error instanceof Error ? error.message : 'Erro inesperado' 
        };
        captureCache.set(userId, errorResult);
        lastCaptureTime.set(userId, now - (minCaptureInterval * 0.8)); // Cache erro por menos tempo
      } finally {
        setIsCapturing(false);
      }
    };

    // Executar após um pequeno delay para não interferir no carregamento do painel
    const timeoutId = setTimeout(captureGeolocation, 2000);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, isCapturing, captureCache, lastCaptureTime, minCaptureInterval]);

  return {
    isCapturing,
    result,
    // Função para forçar nova captura se necessário
    forceCapture: () => {
      if (!isCapturing && user) {
        // Limpar cache para forçar nova captura
        captureCache.delete(user.id);
        lastCaptureTime.delete(user.id);
        setIsCapturing(false); // Reset para trigger o useEffect
      }
    }
  };
};