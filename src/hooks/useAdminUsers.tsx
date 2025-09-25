import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  email_confirmed_at: string | null;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  cargo: string | null;
  avatar_url: string | null;
  gender: string | null;
  tags: string[] | null;
  created_at: string;
  last_sign_in_at: string | null;
  plan: string;
  status: string;
  real_location: string;
  last_login_ip: string | null;
  quiz_context: string | null;
  quiz_role: string | null;
  quiz_challenges: string[] | null;
  quiz_completed_at: string | null;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const { toast } = useToast();

  // Listener para atualizações em tempo real
  useEffect(() => {
    const subscription = supabase
      .channel('admin-users-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_profiles'
      }, () => {
        console.log('🔄 ADMIN USERS: Perfil de usuário alterado, atualizando lista...');
        loadUsers();
      })
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'users'
      }, () => {
        console.log('🔄 ADMIN USERS: Plano de usuário alterado, atualizando lista...');
        loadUsers();
      })
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'user_plans'
      }, () => {
        console.log('🔄 ADMIN USERS: user_plans alterado, atualizando lista...');
        loadUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const loadUsers = async () => {
    console.log('🔄 ADMIN USERS: Iniciando carregamento de usuários...');
    setLoading(true);
    
    try {
      // Carregar total de usuários e dados dos usuários em paralelo
      const [usersResponse, totalResponse] = await Promise.all([
        supabase.rpc('get_admin_users_with_quiz_data'),
        supabase.rpc('get_total_users_count')
      ]);
      
      if (usersResponse.error) {
        console.error('❌ ADMIN USERS: Erro na RPC users:', usersResponse.error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários",
          variant: "destructive",
        });
        return;
      }

      if (totalResponse.error) {
        console.error('❌ ADMIN USERS: Erro na RPC total:', totalResponse.error);
      } else {
        console.log('📊 ADMIN USERS: Total de usuários:', totalResponse.data);
        setTotalUsers(totalResponse.data || 0);
      }

      if (!usersResponse.data) {
        console.warn('⚠️ ADMIN USERS: RPC retornou null');
        setUsers([]);
        return;
      }

      console.log('✅ ADMIN USERS: RPC retornou:', usersResponse.data.length, 'usuários');

      const mappedUsers: AdminUser[] = usersResponse.data.map((user: any) => ({
        id: user.profile_id,
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        plan: user.subscription_plan,
        status: user.subscription_status === 'active' ? 'active' : 'inactive',
        tags: user.tags || [],
        company: user.company,
        phone: user.phone,
        city: user.city,
        state: user.state,
        country: user.country,
        cargo: user.cargo,
        avatar_url: user.avatar_url,
        gender: user.gender,
        real_location: user.real_location,
        last_login_ip: user.last_login_ip,
        email_confirmed_at: user.email_confirmed_at,
        quiz_context: user.quiz_context,
        quiz_role: user.quiz_role,
        quiz_challenges: user.quiz_challenges,
        quiz_completed_at: user.quiz_completed_at
      }));

      console.log('✅ ADMIN USERS: Usuários mapeados:', mappedUsers.length);
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
      console.log('🏷️ ADMIN USERS: Atualizando tags do usuário:', userId, tags);

      const { error } = await supabase
        .from('user_profiles')
        .update({ tags, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;

      // Atualizar estado local
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, tags } : user
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

  const updateUserProfile = async (userId: string, data: any) => {
    try {
      console.log('👤 ADMIN USERS: Atualizando perfil via nova função admin:', userId, data);

      // Buscar ID do usuário autenticado (admin)
      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) {
        throw new Error('Admin não autenticado');
      }

      // Separar dados de perfil e assinatura
      const profileData = {
        full_name: data.full_name,
        company: data.company, 
        phone: data.phone,
        city: data.city,
        state: data.state,
        cargo: data.cargo
      };

      const subscriptionData = data.plan || data.status ? {
        plan: data.plan,
        status: data.status
      } : {};

      // Usar nova função RPC para atualização completa e sincronizada
      const { data: updateResult, error } = await supabase.rpc('admin_update_user_complete', {
        target_user_id: userId,
        admin_user_id: adminUser.id,
        profile_data: profileData,
        subscription_data: subscriptionData
      });

      if (error) {
        console.error('❌ ADMIN USERS: Erro na RPC:', error);
        throw error;
      }

      const result = updateResult as any;
      if (!result?.success) {
        throw new Error(result?.error || 'Falha na atualização');
      }

      console.log('✅ ADMIN USERS: Atualização bem-sucedida:', result);

      // Toast específico baseado no que foi atualizado
      let description = "Perfil atualizado com sucesso";
      if (result.subscription_updated) {
        description = data.plan 
          ? `Plano alterado para ${data.plan.toUpperCase()} com sucesso`
          : "Assinatura atualizada com sucesso";
      }

      toast({
        title: "Usuário atualizado",
        description,
      });

      // Recarregar dados imediatamente para garantir sincronização
      await loadUsers();

    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar",
        description: error instanceof Error ? error.message : "Não foi possível atualizar o perfil do usuário",
        variant: "destructive",
      });
      throw error; // Re-throw para que o componente possa tratar
    }
  };

  const updateUserPlan = async (userId: string, plan: string) => {
    await updateUserProfile(userId, { plan });
  };

  const resetUserMessages = async (userId: string) => {
    try {
      console.log('🔄 ADMIN USERS: Resetando mensagens do usuário:', userId);

      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) {
        throw new Error('Admin não autenticado');
      }

      const { data: result, error } = await supabase.rpc('admin_reset_user_messages', {
        target_user_id: userId,
        admin_user_id: adminUser.id
      });

      if (error) {
        console.error('❌ ADMIN USERS: Erro na RPC resetar mensagens:', error);
        throw error;
      }

      const typedResult = result as any;
      if (!typedResult?.success) {
        throw new Error(typedResult?.error || 'Falha ao resetar mensagens');
      }

      console.log('✅ ADMIN USERS: Mensagens resetadas com sucesso');

      toast({
        title: "Mensagens resetadas",
        description: `Contador de mensagens zerado para o período ${typedResult.period}`,
      });

      await loadUsers(); // Recarregar dados

    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao resetar mensagens:', error);
      toast({
        title: "Erro ao resetar mensagens",
        description: error instanceof Error ? error.message : "Não foi possível resetar as mensagens do usuário",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addProjectCredit = async (userId: string, credits: number = 1) => {
    try {
      console.log('🏗️ ADMIN USERS: Adicionando créditos de projeto:', userId, credits);

      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) {
        throw new Error('Admin não autenticado');
      }

      const { data: result, error } = await supabase.rpc('admin_add_project_credit', {
        target_user_id: userId,
        admin_user_id: adminUser.id,
        credits_to_add: credits
      });

      if (error) {
        console.error('❌ ADMIN USERS: Erro na RPC adicionar créditos:', error);
        throw error;
      }

      const typedResult = result as any;
      if (!typedResult?.success) {
        throw new Error(typedResult?.error || 'Falha ao adicionar créditos');
      }

      console.log('✅ ADMIN USERS: Créditos adicionados com sucesso');

      toast({
        title: "Créditos adicionados",
        description: `${typedResult.credits_added} crédito(s) adicionado(s). Total: ${typedResult.new_total}`,
      });

      await loadUsers(); // Recarregar dados

    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao adicionar créditos:', error);
      toast({
        title: "Erro ao adicionar créditos",
        description: error instanceof Error ? error.message : "Não foi possível adicionar créditos ao usuário",
        variant: "destructive",
      });
      throw error;
    }
  };

  const changeUserPlan = async (userId: string, plan: string, resetMessages: boolean = false) => {
    try {
      console.log('📊 ADMIN USERS: Alterando plano do usuário:', userId, plan, resetMessages);

      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) {
        throw new Error('Admin não autenticado');
      }

      const { data: result, error } = await supabase.rpc('admin_change_user_plan', {
        target_user_id: userId,
        admin_user_id: adminUser.id,
        new_plan: plan,
        reset_monthly_messages: resetMessages
      });

      if (error) {
        console.error('❌ ADMIN USERS: Erro na RPC alterar plano:', error);
        throw error;
      }

      const typedResult = result as any;
      if (!typedResult?.success) {
        if (typedResult?.error === 'SUPREME_PROTECTION_TRIGGERED') {
          toast({
            title: "Proteção de usuário supremo",
            description: typedResult.message || "Usuário supremo não pode ter o plano reduzido",
            variant: "destructive",
          });
          return typedResult;
        }
        throw new Error(typedResult?.error || 'Falha ao alterar plano');
      }

      console.log('✅ ADMIN USERS: Plano alterado com sucesso');

      let description = `Plano alterado de ${typedResult.original_plan} para ${typedResult.new_plan}`;
      if (typedResult.reset_messages) {
        description += ' (mensagens resetadas)';
      }

      toast({
        title: "Plano alterado",
        description,
      });

      await loadUsers(); // Recarregar dados
      return typedResult;

    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao alterar plano:', error);
      toast({
        title: "Erro ao alterar plano",
        description: error instanceof Error ? error.message : "Não foi possível alterar o plano do usuário",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      console.log('🗑️ ADMIN USERS: Deletando usuário:', userId);

      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      // Remover do estado local
      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: "Usuário deletado",
        description: "Usuário foi removido com sucesso",
      });

    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao deletar usuário:', error);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível remover o usuário",
        variant: "destructive",
      });
    }
  };

  const refreshUsers = () => {
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuários com base em pesquisa e filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cargo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;

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
    updateUserProfile,
    updateUserPlan,
    resetUserMessages,
    addProjectCredit,
    changeUserPlan,
    deleteUser,
    refreshUsers,
    totalUsers,
    allUsers: users // Para exportação completa
  };
};