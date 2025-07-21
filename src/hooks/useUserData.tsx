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

      // Buscar dados de assinatura
      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select('plan, status, current_period_end')
        .eq('user_id', user.id)
        .single();

      if (subError && subError.code !== 'PGRST116') {
        console.error('Erro ao buscar assinatura:', subError);
      }

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('full_name, company')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', profileError);
      }

      // Contar projetos reais do usuário
      const { count: projectCount, error: projectError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (projectError) {
        console.error('Erro ao contar projetos:', projectError);
      }

      setUserData({
        plan: (subscription?.plan === 'free' ? 'basic' : subscription?.plan) || 'basic',
        projectCount: projectCount || 0,
        subscription,
        profile
      });

    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err);
      setError('Erro ao carregar dados do usuário');
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