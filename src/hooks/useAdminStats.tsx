
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
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadAdminData = async () => {
      try {
        const { data: adminCheck } = await supabase.rpc('is_admin_user');
        
        if (!mountedRef.current) return;
        
        setIsAdmin(adminCheck || false);
        
        if (adminCheck) {
          // Buscar stats básicas
          const { data: statsData } = await supabase.rpc('get_admin_dashboard_stats');
          
          if (mountedRef.current && statsData?.[0]) {
            setStats(statsData[0]);
          }
        }
      } catch (error) {
        console.error('❌ ADMIN: Erro ao carregar dados:', error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadAdminData();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    isAdmin,
    stats,
    loading,
    refetch: () => {} // Função vazia para compatibilidade
  };
}
