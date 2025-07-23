
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
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
  subscription: {
    plan: string;
    status: string;
  } | null;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('👥 ADMIN USERS: Carregando usuários reais com dados completos...');

      // Buscar dados reais do auth.users usando query direta
      const { data: authUsersData, error: authError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          full_name,
          company,
          phone,
          city,
          state,
          country,
          cargo,
          avatar_url,
          gender,
          tags,
          created_at,
          updated_at
        `);

      if (authError) throw authError;

      // Buscar assinaturas
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('user_subscriptions')
        .select('user_id, plan, status');

      if (subscriptionsError) throw subscriptionsError;

      // Para cada usuário, buscar o email real do auth.users via RPC administrativa
      const combinedUsers: AdminUser[] = [];

      for (const profile of authUsersData || []) {
        // Buscar email real diretamente
        const { data: authUserData, error: emailError } = await supabase.auth.admin.getUserById(profile.user_id);
        
        if (emailError) {
          console.warn('⚠️ Não foi possível buscar email do usuário:', profile.user_id, emailError);
          continue; // Pular usuários sem dados de auth válidos
        }

        // Encontrar assinatura do usuário
        const userSubscription = subscriptions?.find(s => s.user_id === profile.user_id);

        // Só adicionar usuários com email real válido
        if (authUserData?.user?.email) {
          combinedUsers.push({
            id: profile.id,
            user_id: profile.user_id,
            email: authUserData.user.email, // EMAIL REAL
            email_confirmed_at: authUserData.user.email_confirmed_at || null,
            full_name: profile.full_name || authUserData.user.user_metadata?.full_name || null,
            company: profile.company || authUserData.user.user_metadata?.company || null,
            phone: profile.phone || authUserData.user.user_metadata?.phone || null,
            city: profile.city || authUserData.user.user_metadata?.city || null,
            state: profile.state || authUserData.user.user_metadata?.state || null,
            country: profile.country || authUserData.user.user_metadata?.country || 'Brasil',
            cargo: profile.cargo || authUserData.user.user_metadata?.cargo || null,
            avatar_url: profile.avatar_url || authUserData.user.user_metadata?.avatar_url || null,
            gender: profile.gender || authUserData.user.user_metadata?.gender || null,
            tags: profile.tags || [],
            created_at: authUserData.user.created_at || profile.created_at,
            last_sign_in_at: authUserData.user.last_sign_in_at || null,
            subscription: userSubscription ? {
              plan: userSubscription.plan || 'free',
              status: userSubscription.status || 'active'
            } : {
              plan: 'free',
              status: 'active'
            }
          });
        }
      }

      setUsers(combinedUsers);
      console.log('✅ ADMIN USERS: Usuários carregados com dados reais:', combinedUsers.length);

    } catch (error) {
      console.error('❌ ADMIN USERS: Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários",
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
        user.user_id === userId 
          ? { 
              ...user,
              full_name: data.full_name || user.full_name,
              company: data.company || user.company,
              phone: data.phone || user.phone,
              city: data.city || user.city,
              state: data.state || user.state,
              cargo: data.cargo || user.cargo,
              subscription: data.plan || data.status ? {
                plan: data.plan || user.subscription?.plan || 'free',
                status: data.status || user.subscription?.status || 'active'
              } : user.subscription
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
      setUsers(prev => prev.filter(user => user.user_id !== userId));

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

    const matchesPlan = filterPlan === 'all' || user.subscription?.plan === filterPlan;

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
