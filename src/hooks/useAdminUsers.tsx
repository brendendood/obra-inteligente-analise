
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
  sector: string | null;
  tags: string[] | null;
  last_login: string | null;
  created_at: string;
  subscription: {
    plan: string;
    status: string;
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
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 ADMIN USERS: Carregando usuários...');

      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_subscriptions!inner(plan, status)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ADMIN USERS: Erro ao carregar usuários:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Buscar emails dos usuários via auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ ADMIN USERS: Erro ao buscar auth users:', authError);
      }

      // Mapear dados combinados
      const mappedUsers: AdminUser[] = profiles?.map(profile => {
        const authUser = authUsers?.users?.find(u => u.id === profile.user_id);
        const subscription = Array.isArray(profile.user_subscriptions) 
          ? profile.user_subscriptions[0] 
          : profile.user_subscriptions;

        return {
          id: profile.id,
          user_id: profile.user_id || '',
          email: authUser?.email || 'Email não encontrado',
          full_name: profile.full_name,
          company: profile.company,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          sector: profile.sector,
          tags: profile.tags,
          last_login: profile.last_login,
          created_at: profile.created_at,
          subscription: subscription || null,
        };
      }) || [];

      console.log('✅ ADMIN USERS: Usuários carregados:', mappedUsers.length);
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

  const updateUserPlan = async (userId: string, newPlan: string) => {
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
