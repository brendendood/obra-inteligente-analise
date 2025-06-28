
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
  const loadedRef = useRef(false);

  useEffect(() => {
    // Executa apenas uma vez por mount
    if (loadedRef.current) return;
    loadedRef.current = true;

    let timeoutId: NodeJS.Timeout;

    const loadAdminData = async () => {
      try {
        console.log('🔄 ADMIN: Iniciando verificação admin...');
        
        // ÚNICA chamada admin check
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin_user');
        
        if (!mountedRef.current) return;
        
        if (adminError) {
          console.error('❌ ADMIN: Erro na verificação admin:', adminError);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        const isUserAdmin = adminCheck === true;
        setIsAdmin(isUserAdmin);
        
        if (!isUserAdmin) {
          console.log('👤 ADMIN: Usuário não é admin');
          setLoading(false);
          return;
        }
        
        console.log('👑 ADMIN: Usuário é admin, carregando stats...');
        
        // Debounce para evitar chamadas múltiplas
        timeoutId = setTimeout(async () => {
          try {
            const { data: statsData, error: statsError } = await supabase.rpc('get_admin_dashboard_stats');
            
            if (!mountedRef.current) return;
            
            if (statsError) {
              console.error('❌ ADMIN: Erro ao carregar stats:', statsError);
            } else if (statsData?.[0]) {
              console.log('✅ ADMIN: Stats carregadas com sucesso');
              setStats(statsData[0]);
            }
          } catch (error) {
            console.error('💥 ADMIN: Erro crítico ao carregar stats:', error);
          } finally {
            if (mountedRef.current) {
              setLoading(false);
            }
          }
        }, 200);
        
      } catch (error) {
        console.error('💥 ADMIN: Erro crítico geral:', error);
        if (mountedRef.current) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    loadAdminData();

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, []); // Array vazio - executa apenas uma vez

  return {
    isAdmin,
    stats,
    loading,
    refetch: () => {
      // Reset para permitir nova carga se necessário
      loadedRef.current = false;
    }
  };
}
