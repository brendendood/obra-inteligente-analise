import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LocationUpdate {
  user_id: string;
  ip_address: string;
  city: string;
  region: string;
  country: string;
  timestamp: string;
}

/**
 * Hook para monitorar atualizações de localização em tempo real
 */
export const useRealTimeLocation = (onLocationUpdate?: (update: LocationUpdate) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 Configurando realtime para monitoramento de localização...');

    const channel = supabase
      .channel('location-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_login_history'
        },
        (payload) => {
          console.log('📍 Atualização de localização recebida:', payload);
          
          const newRecord = payload.new as any;
          
          // Verificar se a atualização inclui dados de localização
          if (newRecord.city && newRecord.country) {
            const locationUpdate: LocationUpdate = {
              user_id: newRecord.user_id,
              ip_address: newRecord.ip_address,
              city: newRecord.city,
              region: newRecord.region,
              country: newRecord.country,
              timestamp: newRecord.login_at
            };

            // Mostrar notificação de nova localização
            toast({
              title: "Localização atualizada",
              description: `${newRecord.city}, ${newRecord.country}`,
              duration: 3000,
            });

            // Chamar callback se fornecido
            if (onLocationUpdate) {
              onLocationUpdate(locationUpdate);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_login_history'
        },
        (payload) => {
          console.log('🔥 Novo login detectado:', payload);
          
          const newLogin = payload.new as any;
          
          toast({
            title: "Novo login detectado",
            description: `IP: ${newLogin.ip_address}`,
            duration: 5000,
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Status do canal realtime:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('🔄 Removendo canal realtime...');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [onLocationUpdate, toast]);

  return {
    isConnected,
    // Função para forçar atualização de localização de um usuário
    forceLocationUpdate: async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc('force_update_user_location', {
          target_user_id: userId
        });

        if (error) throw error;

        return { success: true, data };
      } catch (error) {
        console.error('❌ Erro ao forçar atualização:', error);
        return { success: false, error };
      }
    }
  };
};