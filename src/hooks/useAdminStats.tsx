
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  total_users: number;
  total_projects: number;
  active_subscriptions: number;
  monthly_revenue: number;
  new_users_this_month: number;
  ai_usage_this_month: number;
}

export function useAdminStats() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Evitar múltiplas execuções
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const checkAdminAndLoadStats = async () => {
      try {
        // Verificar se é admin usando a função RPC
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin_user');
        
        if (!mountedRef.current) return;
        
        if (adminError) {
          console.error('❌ ADMIN: Erro ao verificar status admin:', adminError);
          setIsAdmin(false);
        } else {
          const isUserAdmin = adminCheck || false;
          setIsAdmin(isUserAdmin);
          
          // Se for admin, carregar estatísticas básicas
          if (isUserAdmin && mountedRef.current) {
            const [usersResult, projectsResult, subscriptionsResult] = await Promise.allSettled([
              supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
              supabase.from('projects').select('*', { count: 'exact', head: true }),
              supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
            ]);

            const totalUsers = usersResult.status === 'fulfilled' ? (usersResult.value.count || 0) : 0;
            const totalProjects = projectsResult.status === 'fulfilled' ? (projectsResult.value.count || 0) : 0;
            const activeSubscriptions = subscriptionsResult.status === 'fulfilled' ? (subscriptionsResult.value.count || 0) : 0;

            if (mountedRef.current) {
              setStats({
                total_users: totalUsers,
                total_projects: totalProjects,
                active_subscriptions: activeSubscriptions,
                monthly_revenue: 0,
                new_users_this_month: 0,
                ai_usage_this_month: 0
              });
            }
          }
        }
      } catch (error) {
        console.error('💥 ADMIN: Erro crítico:', error);
        if (mountedRef.current) {
          setIsAdmin(false);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    checkAdminAndLoadStats();

    return () => {
      mountedRef.current = false;
    };
  }, []); // Dependência vazia - executar apenas uma vez

  const refetch = async () => {
    if (!isAdmin || !mountedRef.current) return;
    
    setLoading(true);
    try {
      const [usersResult, projectsResult, subscriptionsResult] = await Promise.allSettled([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      const totalUsers = usersResult.status === 'fulfilled' ? (usersResult.value.count || 0) : 0;
      const totalProjects = projectsResult.status === 'fulfilled' ? (projectsResult.value.count || 0) : 0;
      const activeSubscriptions = subscriptionsResult.status === 'fulfilled' ? (subscriptionsResult.value.count || 0) : 0;

      if (mountedRef.current) {
        setStats({
          total_users: totalUsers,
          total_projects: totalProjects,
          active_subscriptions: activeSubscriptions,
          monthly_revenue: 0,
          new_users_this_month: 0,
          ai_usage_this_month: 0
        });
      }
    } catch (error) {
      console.error('💥 ADMIN: Erro ao recarregar stats:', error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  return {
    isAdmin,
    stats,
    loading,
    refetch
  };
}
