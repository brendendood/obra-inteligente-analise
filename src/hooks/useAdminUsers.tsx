
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  cargo: string | null;
  empresa: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  gender: string | null;
  avatar_url: string | null;
  avatar_type: string | null;
  bio: string | null;
  tags: string[] | null;
  last_login: string | null;
  created_at: string;
  subscription: {
    plan: string;
    status: string;
  } | null;
  login_history: {
    total_logins: number;
    last_ip: string | null;
    last_location: string | null;
    last_device: string | null;
  } | null;
  projects: {
    total: number;
    active: number;
    last_activity: string | null;
  } | null;
  analytics: {
    total_sessions: number;
    avg_session_duration: number;
    last_activity: string | null;
  } | null;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
    
    // Configurar realtime subscriptions
    console.log('🔄 ADMIN USERS: Configurando realtime subscriptions...');
    
    const profilesChannel = supabase
      .channel('admin-user-profiles')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log('✅ REALTIME: Novo perfil criado:', payload.new);
          toast({
            title: "Novo usuário detectado",
            description: "Um novo usuário se cadastrou na plataforma",
          });
          loadUsers(); // Recarregar dados completos
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log('✅ REALTIME: Perfil atualizado:', payload.new);
          // Atualizar apenas o usuário específico
          setUsers(prev => prev.map(user => 
            user.user_id === payload.new.user_id 
              ? { ...user, ...payload.new }
              : user
          ));
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log('✅ REALTIME: Perfil removido:', payload.old);
          setUsers(prev => prev.filter(user => user.user_id !== payload.old.user_id));
        }
      )
      .subscribe();

    const subscriptionsChannel = supabase
      .channel('admin-user-subscriptions')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_subscriptions' },
        (payload) => {
          console.log('✅ REALTIME: Assinatura atualizada:', payload.new);
          // Atualizar subscription do usuário
          setUsers(prev => prev.map(user => 
            user.user_id === payload.new.user_id 
              ? { 
                  ...user, 
                  subscription: { 
                    plan: payload.new.plan, 
                    status: payload.new.status 
                  }
                }
              : user
          ));
        }
      )
      .subscribe();

    const projectsChannel = supabase
      .channel('admin-user-projects')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'projects' },
        (payload) => {
          console.log('✅ REALTIME: Novo projeto criado:', payload.new);
          // Recarregar dados para atualizar estatísticas de projetos
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 ADMIN USERS: Removendo realtime subscriptions...');
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(subscriptionsChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 ADMIN USERS: Carregando usuários completos...');

      // Buscar perfis com assinaturas
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_subscriptions(plan, status)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ADMIN USERS: Erro ao carregar perfis:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Buscar emails dos usuários via auth
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.error('❌ ADMIN USERS: Erro ao buscar auth users:', authError);
      }
      const authUsers = authData?.users || [];

      // Buscar histórico de login para cada usuário
      const userIds = (profiles || []).map(p => p.user_id).filter(Boolean);
      
      const { data: loginHistory } = await supabase
        .from('user_login_history')
        .select('user_id, login_at, ip_address, city, country, device_type, browser')
        .in('user_id', userIds)
        .order('login_at', { ascending: false });

      // Buscar projetos para cada usuário
      const { data: projects } = await supabase
        .from('projects')
        .select('user_id, id, project_status, updated_at')
        .in('user_id', userIds);

      // Buscar analytics para cada usuário
      const { data: analytics } = await supabase
        .from('user_analytics_enhanced')
        .select('user_id, event_type, created_at, session_id')
        .in('user_id', userIds)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Mapear dados combinados
      const mappedUsers: AdminUser[] = (profiles || []).map(profile => {
        const authUser = authUsers.find(u => u.id === profile.user_id);
        const subscription = Array.isArray(profile.user_subscriptions) && profile.user_subscriptions.length > 0
          ? profile.user_subscriptions[0] 
          : null;

        // Calcular estatísticas de login
        const userLogins = loginHistory?.filter(l => l.user_id === profile.user_id) || [];
        const lastLogin = userLogins[0];

        // Calcular estatísticas de projetos
        const userProjects = projects?.filter(p => p.user_id === profile.user_id) || [];
        const activeProjects = userProjects.filter(p => p.project_status !== 'archived').length;

        // Calcular estatísticas de analytics
        const userAnalytics = analytics?.filter(a => a.user_id === profile.user_id) || [];
        const uniqueSessions = new Set(userAnalytics.map(a => a.session_id)).size;

        return {
          id: profile.id,
          user_id: profile.user_id || '',
          email: authUser?.email || 'Email não encontrado',
          full_name: profile.full_name,
          company: profile.company,
          cargo: profile.cargo,
          empresa: profile.empresa,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          country: profile.country,
          gender: profile.gender,
          avatar_url: profile.avatar_url,
          avatar_type: profile.avatar_type,
          bio: profile.bio,
          tags: profile.tags,
          last_login: profile.last_login,
          created_at: profile.created_at,
          subscription: subscription,
          login_history: {
            total_logins: userLogins.length,
            last_ip: lastLogin?.ip_address?.toString() || null,
            last_location: lastLogin ? `${lastLogin.city || ''}, ${lastLogin.country || ''}`.trim().replace(/^,|,$/, '') || null : null,
            last_device: lastLogin ? `${lastLogin.device_type || ''} - ${lastLogin.browser || ''}`.trim().replace(/^-|-$/, '') || null : null,
          },
          projects: {
            total: userProjects.length,
            active: activeProjects,
            last_activity: userProjects.length > 0 ? userProjects[0]?.updated_at || null : null,
          },
          analytics: {
            total_sessions: uniqueSessions,
            avg_session_duration: 0, // Implementar se necessário
            last_activity: userAnalytics.length > 0 ? userAnalytics[0]?.created_at || null : null,
          }
        };
      });

      console.log('✅ ADMIN USERS: Usuários carregados com dados completos:', mappedUsers.length);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('💥 ADMIN USERS: Erro crítico:', error);
      toast({
        title: "Erro crítico",
        description: "Falha ao carregar dados dos usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserTags = async (userId: string, tags: string[]) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ tags, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;

      // Atualizar localmente
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, tags } : user
      ));

      toast({
        title: "Tags atualizadas",
        description: "Tags do usuário foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao atualizar tags:', error);
      toast({
        title: "Erro ao atualizar tags",
        description: "Não foi possível atualizar as tags do usuário",
        variant: "destructive",
      });
    }
  };

  const updateUserPlan = async (userId: string, newPlan: 'free' | 'pro' | 'enterprise') => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          plan: newPlan,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Atualizar localmente
      setUsers(prev => prev.map(user => 
        user.user_id === userId 
          ? { 
              ...user, 
              subscription: user.subscription 
                ? { ...user.subscription, plan: newPlan }
                : { plan: newPlan, status: 'active' }
            }
          : user
      ));

      toast({
        title: "Plano atualizado",
        description: `Plano do usuário alterado para ${newPlan}`,
      });
    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao atualizar plano:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Não foi possível alterar o plano do usuário",
        variant: "destructive",
      });
    }
  };

  // Filtros aplicados
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = !filterPlan || user.subscription?.plan === filterPlan;

    return matchesSearch && matchesPlan;
  });

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    filterPlan,
    setFilterPlan,
    updateUserTags,
    updateUserPlan,
    refreshUsers: loadUsers,
  };
}
