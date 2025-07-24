import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para capturar geolocalização real após login
 * Versão simplificada para evitar conflitos com AuthProvider
 */
export const useGeolocationCapture = () => {
  // Remover o listener automático para evitar conflitos com AuthProvider
  // O AuthProvider já faz o tracking de login

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