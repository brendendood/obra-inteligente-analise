
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
        console.log('🔍 UNIFIED ADMIN: Iniciando verificação tripla para:', user.email, 'ID:', user.id);
        setError(null);
        
        // PRIMEIRA TENTATIVA: Query direta na tabela admin_permissions
        console.log('📊 UNIFIED ADMIN: Tentativa 1 - Query direta admin_permissions...');
        const { data: directCheck, error: directError } = await supabase
          .from('admin_permissions')
          .select('role, active')
          .eq('user_id', user.id)
          .eq('active', true)
          .in('role', ['super_admin', 'marketing', 'financial', 'support'])
          .limit(1);
        
        if (!directError && directCheck && directCheck.length > 0) {
          console.log('✅ UNIFIED ADMIN: Query direta bem-sucedida! Roles encontradas:', directCheck);
          setIsAdmin(true);
          setLoading(false);
          return;
        } else {
          console.log('⚠️ UNIFIED ADMIN: Query direta não encontrou permissões:', { directError, directCheck });
        }

        // SEGUNDA TENTATIVA: Usar RPC com user_id como parâmetro
        console.log('🔧 UNIFIED ADMIN: Tentativa 2 - RPC check_user_admin_status...');
        const { data: rpcCheck, error: rpcError } = await supabase.rpc('check_user_admin_status', {
          target_user_id: user.id
        });
        
        if (!rpcError && rpcCheck) {
          console.log('✅ UNIFIED ADMIN: RPC check_user_admin_status bem-sucedido:', rpcCheck);
          setIsAdmin(true);
          setLoading(false);
          return;
        } else {
          console.log('⚠️ UNIFIED ADMIN: RPC check_user_admin_status falhou:', { rpcError, rpcCheck });
        }

        // TERCEIRA TENTATIVA: Verificar na tabela admin_users por email
        console.log('📧 UNIFIED ADMIN: Tentativa 3 - Verificação por email na admin_users...');
        const { data: emailCheck, error: emailError } = await supabase.rpc('check_admin_by_email', {
          user_email: user.email
        });
        
        if (!emailError && emailCheck) {
          console.log('✅ UNIFIED ADMIN: Verificação por email bem-sucedida:', emailCheck);
          setIsAdmin(true);
          setLoading(false);
          return;
        } else {
          console.log('⚠️ UNIFIED ADMIN: Verificação por email falhou:', { emailError, emailCheck });
        }

        // FALLBACK FINAL: Verificar se é superuser PostgreSQL
        console.log('🔄 UNIFIED ADMIN: Tentativa final - is_superuser...');
        const { data: superuserCheck, error: superuserError } = await supabase.rpc('is_superuser');
        
        if (!superuserError && superuserCheck) {
          console.log('✅ UNIFIED ADMIN: Superuser check bem-sucedido:', superuserCheck);
          setIsAdmin(true);
        } else {
          console.log('❌ UNIFIED ADMIN: Todas as verificações falharam - NÃO É ADMIN');
          setIsAdmin(false);
        }

      } catch (error) {
        console.error('💥 UNIFIED ADMIN: Erro crítico durante verificação:', error);
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
