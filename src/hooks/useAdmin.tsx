
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

interface ExtendedAdminStats {
  total_users: number;
  total_projects: number;
  active_subscriptions: number;
  monthly_revenue: number;
  new_users_this_month: number;
  ai_usage_this_month: number;
}

export function useAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [extendedStats, setExtendedStats] = useState<ExtendedAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        console.log('🔒 ADMIN: Usuário não autenticado');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 ADMIN: Verificando status admin para:', user.email);
        
        // Timeout para evitar loading infinito
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Admin check timeout')), 5000)
        );
        
        const adminCheckPromise = supabase.rpc('is_superuser');
        
        const { data: adminCheck, error: adminError } = await Promise.race([
          adminCheckPromise, 
          timeoutPromise
        ]) as any;
        
        if (adminError) {
          console.error('❌ ADMIN: Erro ao verificar status admin:', adminError);
          setIsAdmin(false);
        } else {
          console.log('🎯 ADMIN: Status verificado:', adminCheck ? 'É ADMIN' : 'NÃO É ADMIN');
          setIsAdmin(adminCheck || false);
          
          // Se for admin, usar super_admin como role padrão (não consultar admin_permissions)
          if (adminCheck) {
            console.log('👑 ADMIN: Definindo role como super_admin (fallback seguro)');
            setUserRole('super_admin');
          }
        }
      } catch (error) {
        console.error('💥 ADMIN: Erro crítico ao verificar status admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user]);

  const loadAdminStats = async () => {
    if (!isAdmin) {
      console.log('🚫 ADMIN: Não é admin, não carregando stats');
      return;
    }

    try {
      console.log('📊 ADMIN: Carregando estatísticas...');
      
      // Carregar stats básicas (mantendo compatibilidade)
      const { data: basicStats, error: basicError } = await supabase.rpc('get_admin_stats');
      
      if (basicError) {
        console.error('❌ ADMIN: Erro ao carregar stats básicas:', basicError);
      } else if (basicStats && basicStats.length > 0) {
        console.log('✅ ADMIN: Stats básicas carregadas:', basicStats[0]);
        setAdminStats(basicStats[0] as AdminStats);
      }

      // Carregar stats estendidas
      const { data: extStats, error: extError } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (extError) {
        console.error('❌ ADMIN: Erro ao carregar stats estendidas:', extError);
      } else if (extStats && extStats.length > 0) {
        console.log('✅ ADMIN: Stats estendidas carregadas:', extStats[0]);
        setExtendedStats(extStats[0] as ExtendedAdminStats);
      }
    } catch (error) {
      console.error('💥 ADMIN: Erro crítico ao carregar stats:', error);
    }
  };

  const createAdminUser = async (email: string, role: 'super_admin' | 'marketing' | 'financial' | 'support') => {
    console.log('⚠️ ADMIN: createAdminUser temporariamente desabilitado para evitar recursão');
    console.log('💡 ADMIN: Use SQL direto ou aguarde refatoração completa da gestão de admins');
    return false;
  };

  return {
    isAdmin,
    adminStats,
    extendedStats,
    userRole,
    loading,
    loadAdminStats,
    createAdminUser,
  };
}
