
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserData {
  plan: 'basic' | 'pro' | 'enterprise';
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
  account_status?: 'active' | 'deactivated_permanently';
  account_type?: 'trial' | 'paid';
  created_at?: string;
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
        .select('plan_code, created_at')
        .eq('id', user.id)
        .maybeSingle()
        .then(result => {
          console.log('🏢 User plan result:', result);
          return result;
        });

      const accountPromise = supabase
        .from('accounts')
        .select('account_type, account_status, created_at')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(result => {
          console.log('💳 Account result:', result);
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

      const [userResult, accountResult, profileResult, projectCountResult] = await Promise.allSettled([
        userPromise,
        accountPromise,
        profilePromise,
        projectCountPromise
      ]);

      // Processar plan_code com fallback para 'basic' e normalização case
      let plan: 'basic' | 'pro' | 'enterprise' = 'basic';
      let created_at: string | undefined;
      
      if (userResult.status === 'fulfilled' && userResult.value.data) {
        const planCode = userResult.value.data.plan_code;
        created_at = userResult.value.data.created_at;
        
        // Normalizar para lowercase e mapear planos válidos
        if (planCode) {
          const normalizedPlan = planCode.toLowerCase();
          plan = (normalizedPlan === 'basic' || normalizedPlan === 'pro' || normalizedPlan === 'enterprise') 
            ? normalizedPlan as 'basic' | 'pro' | 'enterprise'
            : 'basic';
        }
      } else if (userResult.status === 'rejected') {
        console.warn('⚠️ Erro ao buscar plano do usuário:', userResult.reason);
      }

      // Processar account (trial/paid status)
      let account_type: 'trial' | 'paid' = 'trial';
      let account_status: 'active' | 'deactivated_permanently' = 'active';
      
      if (accountResult.status === 'fulfilled' && accountResult.value.data) {
        account_type = accountResult.value.data.account_type || 'trial';
        account_status = accountResult.value.data.account_status || 'active';
        // Se account tem created_at, usar ele (mais preciso para trials)
        if (accountResult.value.data.created_at) {
          created_at = accountResult.value.data.created_at;
        }
      } else if (accountResult.status === 'rejected') {
        console.warn('⚠️ Erro ao buscar conta do usuário:', accountResult.reason);
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
        subscription: null,
        profile,
        account_type,
        account_status,
        created_at
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

    // Habilitar realtime para atualizações de planos
    if (!isAuthenticated || !user) return;

    console.log('🔄 useUserData: Configurando realtime para atualizações de planos');

    try {
      channelRef.current = supabase
        .channel('user-plan-updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`
        }, () => {
          console.log('📱 useUserData: Plano do usuário alterado, recarregando dados...');
          loadUserData();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('📱 useUserData: Perfil do usuário alterado, recarregando dados...');
          loadUserData();
        })
        .subscribe();

      console.log('✅ useUserData: Realtime configurado com sucesso');
    } catch (error) {
      console.warn('⚠️ useUserData: Erro ao configurar realtime:', error);
    }
    
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
  }, [isAuthenticated, user?.id]); // Add dependencies to re-run when user changes

  // Trial management functions
  const isTrialActive = () => {
    if (!userData) return false;
    return userData.account_type === 'trial' && userData.account_status === 'active';
  };

  const getTrialDaysRemaining = () => {
    if (!userData?.created_at || userData.account_type !== 'trial') return 0;
    const createdAt = new Date(userData.created_at);
    const now = new Date();
    const trialExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    return Math.max(0, Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const isDeactivated = () => {
    return userData?.account_status === 'deactivated_permanently';
  };

  const isPaid = () => {
    return userData?.account_type === 'paid' && userData?.account_status === 'active';
  };

  return {
    userData,
    loading,
    error,
    refetch: loadUserData,
    isTrialActive,
    getTrialDaysRemaining,
    isDeactivated,
    isPaid,
  };
};
