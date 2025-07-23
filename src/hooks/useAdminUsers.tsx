import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
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
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 ADMIN USERS: Carregando usuários via função SQL...');
      
      // Usar a nova função SQL que faz JOIN seguro entre auth.users e user_profiles
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_admin_users_with_auth_data');

      if (usersError) {
        console.error('❌ ADMIN USERS: Erro ao buscar usuários:', usersError);
        toast({
          title: "Erro ao carregar usuários",
          description: `Erro: ${usersError.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!usersData || usersData.length === 0) {
        console.log('⚠️ ADMIN USERS: Nenhum usuário encontrado');
        setUsers([]);
        return;
      }

      console.log(`📊 ADMIN USERS: ${usersData.length} usuários encontrados`);

      // Mapear os dados para o formato AdminUser
      const adminUsers: AdminUser[] = usersData.map((userData: any) => ({
        id: userData.user_id,
        email: userData.email || '',
        full_name: userData.full_name || userData.email || '',
        company: userData.company || '',
        phone: userData.phone || '',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || 'Brasil',
        cargo: userData.cargo || '',
        avatar_url: userData.avatar_url,
        gender: userData.gender || '',
        tags: userData.tags || [],
        created_at: userData.created_at,
        last_sign_in_at: userData.last_sign_in_at,
        email_confirmed_at: userData.email_confirmed_at,
        plan: userData.subscription_plan || 'free',
        status: userData.subscription_status || 'active'
      }));

      console.log(`🎉 ADMIN USERS: ${adminUsers.length} usuários carregados com sucesso`);
      setUsers(adminUsers);
      
    } catch (error) {
      console.error('💥 ADMIN USERS: Erro crítico no carregamento:', error);
      toast({
        title: "Erro crítico",
        description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
      console.log('👤 ADMIN USERS: Atualizando perfil do usuário:', userId, data);

      // Atualizar perfil do usuário
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.full_name,
          company: data.company,
          phone: data.phone,
          city: data.city,
          state: data.state,
          cargo: data.cargo,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Atualizar assinatura se necessário
      if (data.plan || data.status) {
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            plan: (data.plan || 'free') as 'free' | 'pro' | 'enterprise',
            status: (data.status || 'active') as 'active' | 'canceled' | 'past_due' | 'trialing',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (subscriptionError) throw subscriptionError;
      }

      // Atualizar estado local
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { 
              ...user,
              full_name: data.full_name || user.full_name,
              company: data.company || user.company,
              phone: data.phone || user.phone,
              city: data.city || user.city,
              state: data.state || user.state,
              cargo: data.cargo || user.cargo,
              plan: data.plan || user.plan,
              status: data.status || user.status
            } 
          : user
      ));

      toast({
        title: "Usuário atualizado",
        description: "Perfil do usuário foi atualizado com sucesso",
      });

    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o perfil do usuário",
        variant: "destructive",
      });
    }
  };

  const updateUserPlan = async (userId: string, plan: string) => {
    await updateUserProfile(userId, { plan });
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
    deleteUser,
    refreshUsers
  };
};