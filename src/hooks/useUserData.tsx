import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserData {
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  projectCount: number;
  subscription: {
    status: string;
    current_period_end?: string;
  } | null;
  profile: {
    full_name?: string;
    company?: string;
  } | null;
}

export const useUserData = () => {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    plan: 'free',
    projectCount: 0,
    subscription: null,
    profile: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoizar função para evitar re-renders desnecessários
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUserData({
        plan: 'free',
        projectCount: 0,
        subscription: null,
        profile: null
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Usar Promise.allSettled para evitar que um erro quebre tudo
      const [subscriptionResult, profileResult, projectCountResult] = await Promise.allSettled([
        supabase
          .from('user_subscriptions')
          .select('plan, status, current_period_end')
          .eq('user_id', user.id)
          .maybeSingle(), // Usar maybeSingle em vez de single
        supabase
          .from('user_profiles')
          .select('full_name, company')
          .eq('user_id', user.id)
          .maybeSingle(), // Usar maybeSingle em vez de single
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ]);

      // Processar subscription com fallback mais simples
      let subscription = null;
      if (subscriptionResult.status === 'fulfilled' && subscriptionResult.value.data) {
        subscription = subscriptionResult.value.data;
      }

      // Processar profile com fallback mais simples
      let profile = null;
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        profile = profileResult.value.data;
      }

      // Processar projectCount com fallback mais simples
      let projectCount = 0;
      if (projectCountResult.status === 'fulfilled' && !projectCountResult.value.error) {
        projectCount = projectCountResult.value.count || 0;
      }

      setUserData({
        plan: subscription?.plan || 'free', // Usar 'free' como padrão
        projectCount,
        subscription,
        profile
      });

    } catch (err) {
      console.error('Erro crítico ao carregar dados do usuário:', err);
      setError('Erro ao carregar dados do usuário');
      // Manter dados padrão em caso de erro total
      setUserData({
        plan: 'free',
        projectCount: 0,
        subscription: null,
        profile: null
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Carregar dados iniciais - apenas uma vez
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Configurar realtime para atualizações automáticas - com cleanup adequado
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Criar canal único com ID específico para evitar múltiplas subscrições
    const channelId = `user_data_${user.id}_${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('🔄 Subscription changed, reloading user data...');
          loadUserData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('🔄 Projects changed, reloading user data...');
          loadUserData();
        }
      )
      .subscribe();

    // Cleanup adequado para evitar múltiplas subscrições
    return () => {
      console.log('🧹 Cleaning up user data subscription...');
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user, loadUserData]);

  return {
    userData,
    loading,
    error,
    refetch: loadUserData
  };
};