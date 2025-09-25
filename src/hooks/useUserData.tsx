
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserData {
  plan: 'basic' | 'pro' | 'enterprise' | null;
  projectCount: number;
  credits: number;
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
    plan: 'basic', // Default para basic até carregar dados reais
    projectCount: 0,
    credits: 0,
    subscription: null,
    profile: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const channelRef = useRef<any>(null);

  const loadUserData = useCallback(async () => {
    console.log('🔄 useUserData: Loading user data...', { isAuthenticated, user: !!user });

    if (!isAuthenticated || !user) {
      console.log('⚠️ useUserData: User not authenticated, setting defaults');
      setUserData({
        plan: 'basic', // Default para basic para usuários não autenticados
        projectCount: 0,
        credits: 0,
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

      const userPromise = supabase
        .from('users')
        .select('plan_code')
        .eq('id', user.id)
        .maybeSingle()
        .then(result => {
          console.log('🏢 User plan result:', result);
          return result;
        });

      const profilePromise = supabase
        .from('user_profiles')
        .select('full_name, company, credits')
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

      const [userResult, profileResult, projectCountResult] = await Promise.allSettled([
        userPromise,
        profilePromise,
        projectCountPromise
      ]);

      // Processar plan_code com fallback para 'basic' e normalização case
      let plan: 'basic' | 'pro' | 'enterprise' | null = 'basic'; // Default para basic
      
      if (userResult.status === 'fulfilled' && userResult.value.data) {
        const planCode = userResult.value.data.plan_code;
        // Normalizar para lowercase e mapear planos válidos
        if (planCode) {
          const normalizedPlan = planCode.toLowerCase();
          plan = (normalizedPlan === 'basic' || normalizedPlan === 'pro' || normalizedPlan === 'enterprise') ? normalizedPlan : 'basic';
        }
      } else if (userResult.status === 'rejected') {
        console.warn('⚠️ Erro ao buscar plano do usuário:', userResult.reason);
      }

      // Processar profile
      let profile = null;
      let credits = 0;
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        profile = profileResult.value.data;
        credits = profile.credits || 0;
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
        credits,
        subscription: null, // Removido: agora usamos apenas plan_code
        profile
      };

      console.log('✅ useUserData: Data loaded successfully:', newUserData);
      setUserData(newUserData);

    } catch (err) {
      console.error('❌ ERRO CRÍTICO ao carregar dados do usuário:', err);
      setError('Erro ao carregar dados do usuário');
      
      setUserData({
        plan: 'basic', // Fallback para basic quando há erro
        projectCount: 0,
        credits: 0,
        subscription: null, // Removido: não mais usado
        profile: null
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (channelRef.current) {
      console.log('🧹 useUserData: Limpando canais existentes');
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.warn('Erro ao limpar canal:', error);
      }
      channelRef.current = null;
    }

    console.log('⚠️ useUserData: Realtime DESABILITADO para evitar múltiplas subscrições');
    console.log('💡 useUserData: Dados serão atualizados apenas no reload da página');
    
    return () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.warn('Erro no cleanup final:', error);
        }
        channelRef.current = null;
      }
    };
  }, []);

  return {
    userData,
    loading,
    error,
    refetch: loadUserData
  };
};
