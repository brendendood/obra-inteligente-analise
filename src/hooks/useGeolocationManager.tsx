import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGeolocationManager = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const forceUpdateUserGeolocation = async (userEmail: string) => {
    setIsUpdating(true);
    try {
      console.log('🔄 Forçando atualização PRECISA de geolocalização para:', userEmail);
      
      // Primeiro capturar IP real do usuário atual
      let realIP = null;
      try {
        const response = await fetch('https://ipapi.co/ip/');
        if (response.ok) {
          realIP = (await response.text()).trim();
          console.log(`✅ IP real capturado: ${realIP}`);
        }
      } catch (e) {
        console.warn('❌ Falha ao capturar IP real:', e);
      }

      // Se temos IP real, usar geolocalização precisa
      if (realIP && realIP !== '127.0.0.1') {
        const { data: preciseData, error: preciseError } = await supabase.functions.invoke('ip-geolocation-precise', {
          body: {
            ip_address: realIP,
            force_update: true,
            manual_update: true
          }
        });

        if (preciseError) {
          console.warn('⚠️ Falha na geolocalização precisa:', preciseError);
        } else {
          console.log('✅ Geolocalização precisa atualizada:', preciseData);
          toast({
            title: "✅ Localização Precisa Atualizada",
            description: `${preciseData.location?.city || 'Localização'} capturada com alta precisão`,
          });
          return { success: true, data: preciseData };
        }
      }

      // Fallback para método antigo
      const { data, error } = await supabase.rpc('force_user_geolocation_update', {
        user_email: userEmail
      });

      if (error) {
        console.error('❌ Erro ao forçar atualização:', error);
        toast({
          title: "Erro na atualização",
          description: "Não foi possível atualizar a geolocalização",
          variant: "destructive",
        });
        return { success: false, error };
      }

      const result = data as any;
      if (!result.success) {
        toast({
          title: "Falha na atualização",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
        return { success: false, error: result.error };
      }

      toast({
        title: "Geolocalização atualizada",
        description: `IP ${result.ip_address} sendo processado`,
      });

      console.log('✅ Atualização de geolocalização iniciada:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Erro na função de atualização:', error);
      toast({
        title: "Erro no sistema",
        description: "Falha ao executar atualização",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  };

  const updateAllGeolocations = async () => {
    setIsUpdating(true);
    try {
      console.log('🔄 Atualizando geolocalizações de todos os usuários...');
      
      const { data, error } = await supabase.functions.invoke('ip-geolocation', {
        body: { 
          action: 'update_all',
          force: true 
        }
      });

      if (error) {
        console.error('❌ Erro na atualização em lote:', error);
        toast({
          title: "Erro na atualização",
          description: "Não foi possível atualizar as geolocalizações",
          variant: "destructive",
        });
        return { success: false, error };
      }

      toast({
        title: "Geolocalizações atualizadas",
        description: "Processo de atualização iniciado",
      });

      console.log('✅ Atualização em lote iniciada:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro na atualização em lote:', error);
      toast({
        title: "Erro no sistema",
        description: "Falha ao executar atualização em lote",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    forceUpdateUserGeolocation,
    updateAllGeolocations,
    isUpdating
  };
};