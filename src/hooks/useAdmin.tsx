
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
        
        // Verificar se é admin através da nova função
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin_user');
        
        if (adminError) {
          console.error('❌ ADMIN: Erro ao verificar status admin:', adminError);
          setIsAdmin(false);
        } else {
          console.log('🎯 ADMIN: Status verificado:', adminCheck ? 'É ADMIN' : 'NÃO É ADMIN');
          setIsAdmin(adminCheck || false);
          
          // Se for admin, buscar o role específico
          if (adminCheck) {
            const { data: roleData, error: roleError } = await supabase
              .from('admin_permissions')
              .select('role')
              .eq('user_id', user.id)
              .eq('active', true)
              .single();
            
            if (!roleError && roleData) {
              console.log('👑 ADMIN: Role encontrado:', roleData.role);
              setUserRole(roleData.role);
            } else {
              console.log('⚠️ ADMIN: Erro ao buscar role ou role não encontrado:', roleError);
            }
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
    if (!isAdmin || userRole !== 'super_admin') {
      console.log('🚫 ADMIN: Sem permissão para criar admin');
      return false;
    }

    try {
      // Buscar o usuário pelo email na tabela user_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .ilike('full_name', `%${email}%`)
        .single();
      
      if (profileError || !profileData) {
        console.error('❌ ADMIN: Usuário não encontrado:', profileError);
        return false;
      }

      // Adicionar permissão administrativa
      const { error: permError } = await supabase
        .from('admin_permissions')
        .insert({
          user_id: profileData.user_id,
          role: role,
          granted_by: user?.id,
          active: true
        });

      if (permError) {
        if (permError.code === '23505') { // Unique constraint violation
          console.error('⚠️ ADMIN: Usuário já possui permissões admin');
          return false;
        }
        throw permError;
      }

      // Log da ação
      await supabase.from('admin_audit_logs').insert({
        admin_user_id: user?.id,
        action_type: 'admin_created',
        target_type: 'user',
        target_id: profileData.user_id,
        new_values: { role, email }
      });

      console.log('✅ ADMIN: Usuário admin criado com sucesso');
      return true;
    } catch (error) {
      console.error('💥 ADMIN: Erro ao criar usuário admin:', error);
      return false;
    }
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
