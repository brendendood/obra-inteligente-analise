import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminActionPayload {
  [key: string]: any;
  planCode?: string;
  resetMessages?: boolean;
  addCredit?: boolean;
}

export const useAdminActions = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const logAction = async (action: string, targetUserId: string, payload: AdminActionPayload = {}) => {
    if (!user) return;

    try {
      await supabase.from('admin_actions').insert({
        admin_user_id: user.id,
        target_user_id: targetUserId,
        action,
        payload
      });
    } catch (error) {
      console.error('Erro ao registrar ação:', error);
    }
  };

  const updateUserPlan = async (userId: string, planCode: string, resetMessages = false) => {
    setLoading(true);
    try {
      // Atualizar plano do usuário
      const { error: updateError } = await supabase
        .from('users')
        .update({ plan_code: planCode.toUpperCase() })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Se solicitado, zerar mensagens do mês atual
      if (resetMessages) {
        const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
        const { error: resetError } = await supabase
          .from('monthly_usage')
          .update({ messages_used: 0 })
          .eq('user_id', userId)
          .eq('period_ym', currentPeriod);

        if (resetError && resetError.code !== 'PGRST116') { // Ignorar se não existe registro
          throw resetError;
        }
      }

      // Registrar ação
      await logAction('update_plan', userId, { planCode, resetMessages });

      toast({
        title: "Plano atualizado",
        description: "O plano do usuário foi atualizado com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar plano:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar plano do usuário.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetUserMessages = async (userId: string) => {
    setLoading(true);
    try {
      const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
      const { error } = await supabase
        .from('monthly_usage')
        .update({ messages_used: 0 })
        .eq('user_id', userId)
        .eq('period_ym', currentPeriod);

      if (error && error.code !== 'PGRST116') { // Ignorar se não existe registro
        throw error;
      }

      // Registrar ação
      await logAction('reset_messages', userId);

      toast({
        title: "Mensagens zeradas",
        description: "O contador de mensagens do usuário foi zerado.",
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao zerar mensagens:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao zerar mensagens do usuário.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addProjectCredit = async (userId: string) => {
    setLoading(true);
    try {
      // Adicionar um crédito extra (implementar tabela de créditos extras se necessário)
      const { error } = await supabase.from('credit_ledger').insert({
        user_id: userId,
        type: 'ADMIN_BONUS',
        period_key: new Date().toISOString().slice(0, 7)
      });

      if (error) throw error;

      // Registrar ação
      await logAction('add_project_credit', userId, { addCredit: true });

      toast({
        title: "Crédito adicionado",
        description: "Um crédito de projeto foi adicionado ao usuário.",
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar crédito:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar crédito ao usuário.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateUserPlan,
    resetUserMessages,
    addProjectCredit
  };
};