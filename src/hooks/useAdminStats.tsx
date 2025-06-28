
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AdminStats {
  total_users: number;
  total_projects: number;
  active_subscriptions: number;
  monthly_revenue: number;
  new_users_this_month: number;
  ai_usage_this_month: number;
}

export function useAdminStats() {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminAndLoadStats = async () => {
      if (!isAuthenticated || !user) {
        console.log('🔒 ADMIN: Usuário não autenticado');
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      try {
        console.log('🔍 ADMIN: Verificando status admin para:', user.email);
        
        // Verificar se é admin usando a tabela admin_permissions
        const { data: adminCheck, error: adminError } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .limit(1);
        
        if (adminError) {
          console.error('❌ ADMIN: Erro ao verificar status admin:', adminError);
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        const isUserAdmin = adminCheck && adminCheck.length > 0;
        console.log('🎯 ADMIN: Status verificado:', isUserAdmin ? 'É ADMIN' : 'NÃO É ADMIN');
        
        if (!mounted) return;
        
        setIsAdmin(isUserAdmin);
        
        // Se for admin, carregar estatísticas básicas
        if (isUserAdmin) {
          console.log('📊 ADMIN: Carregando estatísticas...');
          
          // Carregar estatísticas de forma simples, sem usar a função RPC
          const [usersResult, projectsResult, subscriptionsResult] = await Promise.allSettled([
            supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
            supabase.from('projects').select('*', { count: 'exact', head: true }),
            supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
          ]);

          const totalUsers = usersResult.status === 'fulfilled' ? (usersResult.value.count || 0) : 0;
          const totalProjects = projectsResult.status === 'fulfilled' ? (projectsResult.value.count || 0) : 0;
          const activeSubscriptions = subscriptionsResult.status === 'fulfilled' ? (subscriptionsResult.value.count || 0) : 0;

          const statsData = {
            total_users: totalUsers,
            total_projects: totalProjects,
            active_subscriptions: activeSubscriptions,
            monthly_revenue: 0, // Simplificado por enquanto
            new_users_this_month: 0, // Simplificado por enquanto
            ai_usage_this_month: 0 // Simplificado por enquanto
          };

          console.log('✅ ADMIN: Stats carregadas:', statsData);
          if (mounted) {
            setStats(statsData);
          }
        }
      } catch (error) {
        console.error('💥 ADMIN: Erro crítico:', error);
        if (mounted) {
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAdminAndLoadStats();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id]);

  const refetch = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // Recarregar apenas as estatísticas básicas
      const [usersResult, projectsResult, subscriptionsResult] = await Promise.allSettled([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      const totalUsers = usersResult.status === 'fulfilled' ? (usersResult.value.count || 0) : 0;
      const totalProjects = projectsResult.status === 'fulfilled' ? (projectsResult.value.count || 0) : 0;
      const activeSubscriptions = subscriptionsResult.status === 'fulfilled' ? (subscriptionsResult.value.count || 0) : 0;

      setStats({
        total_users: totalUsers,
        total_projects: totalProjects,
        active_subscriptions: activeSubscriptions,
        monthly_revenue: 0,
        new_users_this_month: 0,
        ai_usage_this_month: 0
      });
    } catch (error) {
      console.error('💥 ADMIN: Erro ao recarregar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isAdmin,
    stats,
    loading,
    refetch
  };
}
