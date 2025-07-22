
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AdminStats {
  total_users: number;
  total_projects: number;
  active_subscriptions: number;
  monthly_revenue: number;
  new_users_this_month: number;
  ai_usage_this_month: number;
}

export function useUnifiedAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        console.log('🔒 UNIFIED ADMIN: Usuário não autenticado');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 UNIFIED ADMIN: Verificando status admin para:', user.email);
        
        // Verificar com timeout para evitar loading infinito
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Admin check timeout')), 8000)
        );
        
        // Tentar primeira abordagem: check_admin_permissions
        const adminCheckPromise = supabase.rpc('check_admin_permissions');
        
        const { data: adminCheck, error: adminError } = await Promise.race([
          adminCheckPromise, 
          timeoutPromise
        ]) as any;
        
        if (adminError) {
          console.error('❌ UNIFIED ADMIN: Erro na primeira verificação:', adminError);
          
          // Fallback: tentar is_superuser
          console.log('🔄 UNIFIED ADMIN: Tentando fallback com is_superuser...');
          const { data: fallbackCheck, error: fallbackError } = await supabase.rpc('is_superuser');
          
          if (fallbackError) {
            console.error('❌ UNIFIED ADMIN: Erro no fallback:', fallbackError);
            setError(`Erro ao verificar permissões: ${fallbackError.message}`);
            setIsAdmin(false);
          } else {
            console.log('✅ UNIFIED ADMIN: Fallback bem-sucedido:', fallbackCheck);
            setIsAdmin(!!fallbackCheck);
          }
        } else {
          console.log('✅ UNIFIED ADMIN: Status verificado:', adminCheck ? 'É ADMIN' : 'NÃO É ADMIN');
          setIsAdmin(!!adminCheck);
        }
      } catch (error) {
        console.error('💥 UNIFIED ADMIN: Erro crítico:', error);
        setError(`Erro crítico: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user]);

  const loadAdminStats = async () => {
    if (!isAdmin) {
      console.log('🚫 UNIFIED ADMIN: Não é admin, não carregando stats');
      return;
    }

    try {
      console.log('📊 UNIFIED ADMIN: Carregando estatísticas...');
      
      const { data: stats, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) {
        console.error('❌ UNIFIED ADMIN: Erro ao carregar stats:', error);
        setError(`Erro ao carregar estatísticas: ${error.message}`);
      } else if (stats && stats.length > 0) {
        console.log('✅ UNIFIED ADMIN: Stats carregadas:', stats[0]);
        setAdminStats(stats[0] as AdminStats);
      }
    } catch (error) {
      console.error('💥 UNIFIED ADMIN: Erro crítico ao carregar stats:', error);
      setError(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Função para forçar nova verificação (debug)
  const forceRefresh = () => {
    setLoading(true);
    setError(null);
    // Recarregar componente
    window.location.reload();
  };

  return {
    isAdmin,
    adminStats,
    loading,
    error,
    user,
    loadAdminStats,
    forceRefresh,
  };
}
