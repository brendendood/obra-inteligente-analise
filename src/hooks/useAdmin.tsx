
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
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Verificar se é admin através da nova função
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin_user');
        
        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
        } else {
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
              setUserRole(roleData.role);
            }
          }
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
      // Carregar stats básicas (mantendo compatibilidade)
      const { data: basicStats, error: basicError } = await supabase.rpc('get_admin_stats');
      
      if (basicError) {
        console.error('Error loading basic admin stats:', basicError);
      } else if (basicStats && basicStats.length > 0) {
        setAdminStats(basicStats[0] as AdminStats);
      }

      // Carregar stats estendidas
      const { data: extStats, error: extError } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (extError) {
        console.error('Error loading extended admin stats:', extError);
      } else if (extStats && extStats.length > 0) {
        setExtendedStats(extStats[0] as ExtendedAdminStats);
      }
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  };

  const createAdminUser = async (email: string, role: 'super_admin' | 'marketing' | 'financial' | 'support') => {
    if (!isAdmin || userRole !== 'super_admin') return false;

    try {
      // Buscar o usuário pelo email
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (userError || !userData.user) {
        console.error('User not found:', userError);
        return false;
      }

      // Adicionar permissão administrativa
      const { error: permError } = await supabase
        .from('admin_permissions')
        .insert({
          user_id: userData.user.id,
          role: role,
          granted_by: user?.id,
          active: true
        });

      if (permError) {
        if (permError.code === '23505') { // Unique constraint violation
          console.error('User already has admin permissions');
          return false;
        }
        throw permError;
      }

      // Log da ação
      await supabase.from('admin_audit_logs').insert({
        admin_user_id: user?.id,
        action_type: 'admin_created',
        target_type: 'user',
        target_id: userData.user.id,
        new_values: { role, email }
      });

      return true;
    } catch (error) {
      console.error('Error creating admin user:', error);
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
