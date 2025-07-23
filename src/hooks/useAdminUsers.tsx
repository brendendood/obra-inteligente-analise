
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  tags: string[] | null;
  created_at: string;
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
      console.log('👥 ADMIN USERS: Carregando usuários reais...');

      // Carregar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Carregar assinaturas
      const { data: subscriptions, error: subsError } = await supabase
        .from('user_subscriptions')
        .select('user_id, plan, status');

      if (subsError) throw subsError;

      // Combinar dados
      const combinedUsers: AdminUser[] = [];

      for (const profile of profiles || []) {
        // Usar fallback simples para email
        const userEmail = `user-${profile.user_id.slice(0, 8)}@madenai.com`;

        const userSubscription = subscriptions?.find(s => s.user_id === profile.user_id);

        combinedUsers.push({
          id: profile.id,
          user_id: profile.user_id,
          email: userEmail,
          full_name: profile.full_name,
          company: profile.company,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          tags: profile.tags,
          created_at: profile.created_at,
          subscription: userSubscription ? {
            plan: userSubscription.plan,
            status: userSubscription.status
          } : {
            plan: 'free',
            status: 'active'
          }
        });
      }

      setUsers(combinedUsers);
      console.log('✅ ADMIN USERS: Usuários carregados:', combinedUsers.length);

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

  const updateUserPlan = async (userId: string, plan: string) => {
    try {
      console.log('💳 ADMIN USERS: Atualizando plano do usuário:', userId, plan);

      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan: plan as 'free' | 'pro' | 'enterprise',
          status: 'active' as 'active' | 'canceled' | 'past_due' | 'trialing',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Atualizar estado local
      setUsers(prev => prev.map(user => 
        user.user_id === userId 
          ? { 
              ...user, 
              subscription: { 
                plan, 
                status: 'active' 
              } 
            } 
          : user
      ));

      toast({
        title: "Plano atualizado",
        description: `Plano do usuário alterado para ${plan.toUpperCase()}`,
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

  const refreshUsers = () => {
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

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
    updateUserPlan,
    refreshUsers
  };
};
