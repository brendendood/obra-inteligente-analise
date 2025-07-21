import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserData {
  plan: 'basic' | 'pro' | 'enterprise';
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
    plan: 'basic',
    projectCount: 0,
    subscription: null,
    profile: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    if (!isAuthenticated || !user) {
      setUserData({
        plan: 'basic',
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
          .single(),
        supabase
          .from('user_profiles')
          .select('full_name, company')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ]);

      // Processar subscription com fallback
      let subscription = null;
      if (subscriptionResult.status === 'fulfilled' && !subscriptionResult.value.error) {
        subscription = subscriptionResult.value.data;
      } else if (subscriptionResult.status === 'fulfilled' && subscriptionResult.value.error?.code !== 'PGRST116') {
        console.warn('Erro ao buscar assinatura:', subscriptionResult.value.error);
      }

      // Processar profile com fallback
      let profile = null;
      if (profileResult.status === 'fulfilled' && !profileResult.value.error) {
        profile = profileResult.value.data;
      } else if (profileResult.status === 'fulfilled' && profileResult.value.error?.code !== 'PGRST116') {
        console.warn('Erro ao buscar perfil:', profileResult.value.error);
      }

      // Processar projectCount com fallback
      let projectCount = 0;
      if (projectCountResult.status === 'fulfilled' && !projectCountResult.value.error) {
        projectCount = projectCountResult.value.count || 0;
      } else if (projectCountResult.status === 'fulfilled' && projectCountResult.value.error) {
        console.warn('Erro ao contar projetos:', projectCountResult.value.error);
      }

      setUserData({
        plan: (subscription?.plan === 'free' ? 'basic' : subscription?.plan) || 'basic',
        projectCount,
        subscription,
        profile
      });

    } catch (err) {
      console.warn('Erro ao carregar dados do usuário:', err);
      // Manter dados padrão em caso de erro total
      setUserData({
        plan: 'basic',
        projectCount: 0,
        subscription: null,
        profile: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadUserData();
  }, [isAuthenticated, user]);

  // Recarregar dados quando auth mudar
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  // Configurar realtime para atualizações automáticas
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const channel = supabase
      .channel('user_data_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        () => loadUserData()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        () => loadUserData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user]);

  return {
    userData,
    loading,
    error,
    refetch: loadUserData
  };
};