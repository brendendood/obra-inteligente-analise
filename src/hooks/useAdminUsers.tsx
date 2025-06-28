
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  sector: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  email?: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          user_subscriptions(plan, status)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Transformar os dados para o formato esperado
        const usersWithFormattedData = data.map(user => ({
          ...user,
          subscription: Array.isArray(user.user_subscriptions) && user.user_subscriptions.length > 0 
            ? user.user_subscriptions[0] 
            : { plan: 'free', status: 'active' }
        }));
        
        setUsers(usersWithFormattedData);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "❌ Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
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

      toast({
        title: "✅ Tags atualizadas",
        description: "Tags do usuário foram atualizadas com sucesso."
      });

      loadUsers();
    } catch (error) {
      console.error('Error updating tags:', error);
      toast({
        title: "❌ Erro ao atualizar tags",
        description: "Não foi possível atualizar as tags.",
        variant: "destructive"
      });
    }
  };

  const updateUserPlan = async (userId: string, plan: 'free' | 'pro' | 'enterprise') => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ plan, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;

      // Log da ação
      await supabase.from('admin_audit_logs').insert({
        action_type: 'plan_changed',
        target_type: 'user',
        target_id: userId,
        new_values: { plan }
      });

      toast({
        title: "✅ Plano atualizado",
        description: `Plano do usuário alterado para ${plan.toUpperCase()}.`
      });

      loadUsers();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "❌ Erro ao atualizar plano",
        description: "Não foi possível atualizar o plano.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchTerm, filterPlan, filterStatus]);

  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filterPlan,
    setFilterPlan,
    filterStatus,
    setFilterStatus,
    updateUserTags,
    updateUserPlan,
    refetch: loadUsers
  };
}
