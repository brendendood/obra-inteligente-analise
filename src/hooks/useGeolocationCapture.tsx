import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para capturar geolocalização real após login
 * Monitora novos logins e chama a edge function de geolocalização
 */
export const useGeolocationCapture = () => {
  useEffect(() => {
    console.log('🌍 GEOLOCATION: Iniciando monitoramento de novos logins...');

    // Listener para quando um novo login ocorre
    const handleAuthChange = async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔐 GEOLOCATION: Novo login detectado, capturando geolocalização...');
        
        try {
          // Buscar o último login deste usuário
          const { data: latestLogin, error: loginError } = await supabase
            .from('user_login_history')
            .select('id, ip_address, city')
            .eq('user_id', session.user.id)
            .order('login_at', { ascending: false })
            .limit(1)
            .single();

          if (loginError) {
            console.error('❌ GEOLOCATION: Erro ao buscar último login:', loginError);
            return;
          }

          // Se o login não tem localização ainda, capturar
          if (latestLogin && (!latestLogin.city || latestLogin.city === 'Desconhecida')) {
            console.log('📍 GEOLOCATION: Chamando edge function para capturar localização...');
            
            const { data: geoResult, error: geoError } = await supabase.functions
              .invoke('ip-geolocation', {
                body: {
                  loginId: latestLogin.id,
                  ipAddress: latestLogin.ip_address
                }
              });

            if (geoError) {
              console.error('❌ GEOLOCATION: Erro na edge function:', geoError);
            } else {
              console.log('✅ GEOLOCATION: Localização capturada:', geoResult);
            }
          } else {
            console.log('ℹ️ GEOLOCATION: Login já tem localização, pulando captura');
          }
        } catch (error) {
          console.error('❌ GEOLOCATION: Erro geral:', error);
        }
      }
    };

    // Configurar listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      console.log('🧹 GEOLOCATION: Removendo listener de geolocalização');
      subscription.unsubscribe();
    };
  }, []);

  return {
    // Função para forçar captura de geolocalização de um login específico
    forceGeolocationCapture: async (loginId: string, ipAddress?: string) => {
      try {
        console.log('🔄 GEOLOCATION: Forçando captura para login:', loginId);
        
        const { data, error } = await supabase.functions
          .invoke('ip-geolocation', {
            body: {
              loginId,
              ipAddress
            }
          });

        if (error) {
          console.error('❌ GEOLOCATION: Erro na captura forçada:', error);
          return { success: false, error };
        }

        console.log('✅ GEOLOCATION: Captura forçada bem-sucedida:', data);
        return { success: true, data };
      } catch (error) {
        console.error('❌ GEOLOCATION: Erro na captura forçada:', error);
        return { success: false, error };
      }
    }
  };
};