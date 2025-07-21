import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useAdminAccess() {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<number | null>(null);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em ms

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const checkAdminStatus = async () => {
      const now = Date.now();
      
      // Verificar se o cache ainda é válido
      if (lastChecked && (now - lastChecked) < CACHE_DURATION) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        console.log('🔍 ADMIN: Verificando status admin para:', user.email);
        
        const { data: adminCheck, error } = await supabase.rpc('is_superuser');
        
        if (error) {
          console.error('❌ ADMIN: Erro ao verificar status:', error);
          setIsAdmin(false);
        } else {
          console.log('✅ ADMIN: Status verificado:', adminCheck);
          setIsAdmin(!!adminCheck);
        }
        
        setLastChecked(now);
      } catch (error) {
        console.error('💥 ADMIN: Erro crítico na verificação:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user, lastChecked]);

  return {
    isAdmin,
    isLoading,
    refetch: () => setLastChecked(null) // Força nova verificação
  };
}