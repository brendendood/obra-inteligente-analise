import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserLimits {
  plan: string;
  current_period: string;
  projects_used: number;
  messages_used: number;
  project_limit: number;
  message_limit: number;
  can_create_project: boolean;
  can_send_message: boolean;
}

export const useUserLimits = () => {
  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLimits = async () => {
    if (!user) {
      setLimits(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('check_user_limits', {
        p_user_id: user.id
      });

      if (error) throw error;
      setLimits(data as unknown as UserLimits);
    } catch (err: any) {
      console.error('Erro ao carregar limites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, [user]);

  const incrementMessageUsage = async () => {
    if (!user) return;

    try {
      await supabase.rpc('increment_message_usage', {
        p_user_id: user.id
      });
      // Recarregar limites após incrementar
      await fetchLimits();
    } catch (err: any) {
      console.error('Erro ao incrementar uso de mensagens:', err);
    }
  };

  return {
    limits,
    loading,
    error,
    refetch: fetchLimits,
    incrementMessageUsage
  };
};