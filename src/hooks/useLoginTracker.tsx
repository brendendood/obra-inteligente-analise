import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useLoginTracker = () => {
  const { user, isAuthenticated } = useAuth();

  const getLocationAndUpdate = async (loginId: string) => {
    try {
      // Solicitar geolocalização real do usuário
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              // Buscar informações da cidade através do IP/coordenadas
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`);
              const locationData = await response.json();
              
              // Atualizar no banco com dados reais
              const { error: updateError } = await supabase
                .from('user_login_history')
                .update({
                  latitude: latitude,
                  longitude: longitude,
                  city: locationData.city || locationData.locality || 'Desconhecida',
                  region: locationData.principalSubdivision || 'Desconhecido',
                  country: locationData.countryName || 'Brasil'
                })
                .eq('id', loginId);
              
              console.log('📍 Localização real capturada:', {
                lat: latitude,
                lng: longitude,
                city: locationData.city,
                region: locationData.principalSubdivision,
                country: locationData.countryName
              });
            } catch (error) {
              console.error('Erro ao buscar dados de localização:', error);
            }
          },
          (error) => {
            console.warn('Não foi possível obter localização:', error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      }
    } catch (error) {
      console.error('Erro no tracking de localização:', error);
    }
  };

  const trackLogin = async () => {
    if (!user) return;
    
    try {
      // Buscar o último login registrado para este usuário
      const { data: lastLogin, error } = await supabase
        .from('user_login_history')
        .select('id')
        .eq('user_id', user.id)
        .order('login_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && lastLogin) {
        // Buscar e atualizar localização para o último login
        await getLocationAndUpdate(lastLogin.id);
      }
    } catch (error) {
      console.error('Erro ao buscar último login:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      // Aguardar um pouco para que o trigger do banco tenha processado o login
      setTimeout(() => {
        trackLogin();
      }, 2000);
    }
  }, [isAuthenticated, user]);

  return { trackLogin };
};