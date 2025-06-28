
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
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndLoadStats = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        // Verificar se é admin
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin_user');
        
        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(adminCheck || false);

        if (adminCheck) {
          // Carregar estatísticas
          const { data: statsData, error: statsError } = await supabase.rpc('get_admin_dashboard_stats');
          
          if (statsError) {
            console.error('Error loading admin stats:', statsError);
          } else if (statsData && statsData.length > 0) {
            setStats(statsData[0] as AdminStats);
          }
        }
      } catch (error) {
        console.error('Error in admin check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadStats();
  }, [isAuthenticated, user]);

  return {
    stats,
    isAdmin,
    loading,
  };
}
