
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const hasInitialized = useRef(false);
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    if (!mountedRef.current) return;
    
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

      if (!mountedRef.current) return;

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
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
  }, [searchTerm, toast]);

  // Carregar usuarios apenas uma vez na montagem
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    loadUsers();

    return () => {
      mountedRef.current = false;
    };
  }, []); // Dependência vazia - carregar apenas uma vez

  // Debounce para search term
  useEffect(() => {
    if (!hasInitialized.current) return;
    
    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        loadUsers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, loadUsers]);

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
