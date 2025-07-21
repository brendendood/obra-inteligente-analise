import { useState, useEffect, useCallback, useRef } from 'react';
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
    plan: 'basic', // Fallback padrão para 'basic'
    projectCount: 0,
    subscription: null,
    profile: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para evitar múltiplas subscrições
  const channelRef = useRef<any>(null);

  // Função para carregar dados com fallbacks robustos
  const loadUserData = useCallback(async () => {
    console.log('🔄 useUserData: Loading user data...', { isAuthenticated, user: !!user });

    if (!isAuthenticated || !user) {
      console.log('⚠️ useUserData: User not authenticated, setting defaults');
      setUserData({
        plan: 'basic',
        projectCount: 0,
        subscription: null,
        profile: null
      });
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('📡 useUserData: Fetching data for user:', user.id);

      // Buscar dados com fallbacks
      const subscriptionPromise = supabase
        .from('user_subscriptions')
        .select('plan, status, current_period_end')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(result => {
          console.log('📋 Subscription result:', result);
          return result;
        });

      const profilePromise = supabase
        .from('user_profiles')
        .select('full_name, company')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(result => {
          console.log('👤 Profile result:', result);
          return result;
        });

      const projectCountPromise = supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .then(result => {
          console.log('📊 Project count result:', result);
          return result;
        });

      // Aguardar todas as consultas com Promise.allSettled
      const [subscriptionResult, profileResult, projectCountResult] = await Promise.allSettled([
        subscriptionPromise,
        profilePromise,
        projectCountPromise
      ]);

      // Processar subscription com fallback para 'basic'
      let subscription = null;
      let plan: 'free' | 'basic' | 'pro' | 'enterprise' = 'basic';
      
      if (subscriptionResult.status === 'fulfilled' && subscriptionResult.value.data) {
        subscription = subscriptionResult.value.data;
        plan = subscription.plan || 'basic';
      } else if (subscriptionResult.status === 'rejected') {
        console.warn('⚠️ Erro ao buscar assinatura:', subscriptionResult.reason);
      }

      // Processar profile
      let profile = null;
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        profile = profileResult.value.data;
      } else if (profileResult.status === 'rejected') {
        console.warn('⚠️ Erro ao buscar perfil:', profileResult.reason);
      }

      // Processar projectCount
      let projectCount = 0;
      if (projectCountResult.status === 'fulfilled' && !projectCountResult.value.error) {
        projectCount = projectCountResult.value.count || 0;
      } else if (projectCountResult.status === 'rejected') {
        console.warn('⚠️ Erro ao contar projetos:', projectCountResult.reason);
      }

      const newUserData = {
        plan,
        projectCount,
        subscription,
        profile
      };

      console.log('✅ useUserData: Data loaded successfully:', newUserData);
      setUserData(newUserData);

    } catch (err) {
      console.error('❌ ERRO CRÍTICO ao carregar dados do usuário:', err);
      setError('Erro ao carregar dados do usuário');
      
      // Fallback para dados básicos em caso de erro crítico
      setUserData({
        plan: 'basic',
        projectCount: 0,
        subscription: null,
        profile: null
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Carregar dados iniciais
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Configurar realtime com cleanup adequado
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('🧹 useUserData: Cleaning up realtime (user not authenticated)');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    // Limpar canal anterior se existir
    if (channelRef.current) {
      console.log('🧹 useUserData: Cleaning up previous realtime channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Criar novo canal com ID único
    const channelId = `user_data_${user.id}_${Date.now()}`;
    console.log('📡 useUserData: Setting up realtime channel:', channelId);

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
        (payload) => {
          console.log('🔄 Subscription changed, reloading...', payload);
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
        (payload) => {
          console.log('🔄 Projects changed, reloading...', payload);
          loadUserData();
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });

    channelRef.current = channel;

    // Cleanup na desmontagem
    return () => {
      console.log('🧹 useUserData: Cleaning up realtime subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [isAuthenticated, user, loadUserData]);

  return {
    userData,
    loading,
    error,
    refetch: loadUserData
  };
};