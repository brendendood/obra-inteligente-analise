
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
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Verificar se é admin
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin_user');
        
        if (adminError) {
          console.error('❌ ADMIN: Erro ao verificar status admin:', adminError);
          setIsAdmin(false);
        } else {
          setIsAdmin(adminCheck || false);
          
          // Se for admin, carregar estatísticas
          if (adminCheck) {
            const { data: statsData, error: statsError } = await supabase.rpc('get_admin_dashboard_stats');
            
            if (statsError) {
              console.error('❌ ADMIN: Erro ao carregar stats:', statsError);
            } else if (statsData && statsData.length > 0) {
              setStats(statsData[0] as AdminStats);
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
  }, [isAuthenticated, user]);

  return {
    isAdmin,
    stats,
    loading,
    refetch: () => {
      setLoading(true);
      // Re-executar a função
    }
  };
}
