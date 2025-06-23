
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AdminStats {
  total_users: number;
  total_projects: number;
  total_analyses: number;
  recent_projects: number;
  active_users_week: number;
}

export function useAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Verificar se é admin através da função SQL
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user]);

  const loadAdminStats = async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase.rpc('get_admin_stats');
      
      if (error) {
        console.error('Error loading admin stats:', error);
        return;
      }

      if (data && data.length > 0) {
        setAdminStats(data[0] as AdminStats);
      }
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  };

  return {
    isAdmin,
    adminStats,
    loading,
    loadAdminStats,
  };
}
