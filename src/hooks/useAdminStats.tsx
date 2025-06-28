
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
    const checkAdminAndLoadStats = async () => {
      if (!isAuthenticated || !user) {
        console.log('🔒 ADMIN: Usuário não autenticado');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 ADMIN: Verificando status admin para:', user.email);
        
        // Verificar se é admin de forma simples - sem usar RLS
        const { data: adminCheck, error: adminError } = await supabase
          .from('admin_permissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .limit(1);
        
        if (adminError) {
          console.error('❌ ADMIN: Erro ao verificar status admin:', adminError);
          setIsAdmin(false);
        } else {
          const isUserAdmin = adminCheck && adminCheck.length > 0;
          console.log('🎯 ADMIN: Status verificado:', isUserAdmin ? 'É ADMIN' : 'NÃO É ADMIN');
          setIsAdmin(isUserAdmin);
          
          // Se for admin, carregar estatísticas usando a função
          if (isUserAdmin) {
            console.log('📊 ADMIN: Carregando estatísticas...');
            
            const { data: statsData, error: statsError } = await supabase.rpc('get_admin_dashboard_stats');
            
            if (statsError) {
              console.error('❌ ADMIN: Erro ao carregar stats:', statsError);
            } else if (statsData && statsData.length > 0) {
              console.log('✅ ADMIN: Stats carregadas:', statsData[0]);
              setStats(statsData[0] as AdminStats);
            } else {
              console.log('⚠️ ADMIN: Nenhuma estatística encontrada');
              // Definir stats padrão se não houver dados
              setStats({
                total_users: 0,
                total_projects: 0,
                active_subscriptions: 0,
                monthly_revenue: 0,
                new_users_this_month: 0,
                ai_usage_this_month: 0
              });
            }
          }
        }
      } catch (error) {
        console.error('💥 ADMIN: Erro crítico:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadStats();
  }, [isAuthenticated, user?.id]); // Simplificado para evitar re-renders

  const refetch = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const { data: statsData, error: statsError } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (statsError) {
        console.error('❌ ADMIN: Erro ao recarregar stats:', statsError);
      } else if (statsData && statsData.length > 0) {
        setStats(statsData[0] as AdminStats);
      }
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
