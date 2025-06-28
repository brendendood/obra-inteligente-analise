
import { useState, useEffect, useRef } from 'react';
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
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_subscriptions(plan, status)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!mountedRef.current) return;

      if (error) throw error;

      if (data) {
        const usersWithFormattedData = data.map(user => ({
          ...user,
          subscription: Array.isArray(user.user_subscriptions) && user.user_subscriptions.length > 0 
            ? user.user_subscriptions[0] 
            : { plan: 'free', status: 'active' }
        }));
        
        setUsers(usersWithFormattedData);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error);
      if (mountedRef.current) {
        toast({
          title: "❌ Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários.",
          variant: "destructive"
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    loadUsers();

    return () => {
      mountedRef.current = false;
    };
  }, []);

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

  // Filtros aplicados localmente
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === '' || user.subscription?.plan === filterPlan;
    const matchesStatus = filterStatus === '' || user.subscription?.status === filterStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return {
    users: filteredUsers,
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
