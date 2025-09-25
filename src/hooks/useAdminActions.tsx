import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateUserPlan = async (userId: string, newPlan: string, resetMessages: boolean = false) => {
    setLoading(true);
    try {
      console.log('🔄 ADMIN ACTION: Alterando plano do usuário', { userId, newPlan, resetMessages });

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('Admin não autenticado');
      }

      const { data: result, error } = await supabase.rpc('admin_change_user_plan', {
        target_user_id: userId,
        admin_user_id: currentUser.id,
        new_plan: newPlan,
        reset_monthly_messages: resetMessages
      });

      if (error) {
        console.error('❌ ADMIN ACTION: Erro ao alterar plano:', error);
        throw error;
      }

      const typedResult = result as any;
      if (!typedResult?.success) {
        console.error('❌ ADMIN ACTION: Falha na alteração:', typedResult);
        
        if (typedResult?.error === 'SUPREME_PROTECTION_TRIGGERED') {
          toast({
            title: "Proteção de usuário supremo",
            description: typedResult.message || "Usuário supremo não pode ter o plano alterado",
            variant: "destructive",
          });
          return false;
        }

        if (typedResult?.error === 'UNAUTHORIZED') {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para alterar planos",
            variant: "destructive",
          });
          return false;
        }

        throw new Error(typedResult?.message || 'Falha na alteração do plano');
      }

      console.log('✅ ADMIN ACTION: Plano alterado com sucesso:', typedResult);
      
      toast({
        title: "Plano alterado",
        description: `Plano do usuário alterado para ${newPlan} com sucesso`,
      });

      return true;
    } catch (error) {
      console.error('❌ ADMIN ACTION: Erro ao alterar plano:', error);
      toast({
        title: "Erro ao alterar plano",
        description: error instanceof Error ? error.message : "Não foi possível alterar o plano",
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
      console.log('🔄 ADMIN ACTION: Resetando mensagens do usuário', { userId });

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('Admin não autenticado');
      }

      const { data: result, error } = await supabase.rpc('admin_reset_user_messages', {
        target_user_id: userId,
        admin_user_id: currentUser.id
      });

      if (error) {
        console.error('❌ ADMIN ACTION: Erro ao resetar mensagens:', error);
        throw error;
      }

      const typedResult = result as any;
      if (!typedResult?.success) {
        console.error('❌ ADMIN ACTION: Falha no reset:', typedResult);
        
        if (typedResult?.error === 'UNAUTHORIZED') {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para resetar mensagens",
            variant: "destructive",
          });
          return false;
        }

        throw new Error(typedResult?.message || 'Falha no reset de mensagens');
      }

      console.log('✅ ADMIN ACTION: Mensagens resetadas com sucesso:', typedResult);
      
      toast({
        title: "Mensagens resetadas",
        description: "O contador de mensagens foi zerado com sucesso",
      });

      return true;
    } catch (error) {
      console.error('❌ ADMIN ACTION: Erro ao resetar mensagens:', error);
      toast({
        title: "Erro ao resetar mensagens",
        description: error instanceof Error ? error.message : "Não foi possível resetar as mensagens",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addProjectCredit = async (userId: string, credits: number = 1) => {
    setLoading(true);
    try {
      console.log('🔄 ADMIN ACTION: Adicionando crédito de projeto', { userId, credits });

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('Admin não autenticado');
      }

      const { data: result, error } = await supabase.rpc('admin_add_project_credit', {
        target_user_id: userId,
        admin_user_id: currentUser.id,
        credits_to_add: credits
      });

      if (error) {
        console.error('❌ ADMIN ACTION: Erro ao adicionar crédito:', error);
        throw error;
      }

      const typedResult = result as any;
      if (!typedResult?.success) {
        console.error('❌ ADMIN ACTION: Falha na adição:', typedResult);
        
        if (typedResult?.error === 'UNAUTHORIZED') {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para adicionar créditos",
            variant: "destructive",
          });
          return false;
        }

        if (typedResult?.error === 'USER_NOT_FOUND') {
          toast({
            title: "Usuário não encontrado",
            description: "O usuário especificado não foi encontrado",
            variant: "destructive",
          });
          return false;
        }

        throw new Error(typedResult?.message || 'Falha na adição de crédito');
      }

      console.log('✅ ADMIN ACTION: Crédito adicionado com sucesso:', typedResult);
      
      toast({
        title: "Crédito adicionado",
        description: `${credits} crédito(s) de projeto adicionado(s) com sucesso`,
      });

      return true;
    } catch (error) {
      console.error('❌ ADMIN ACTION: Erro ao adicionar crédito:', error);
      toast({
        title: "Erro ao adicionar crédito",
        description: error instanceof Error ? error.message : "Não foi possível adicionar o crédito",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserPlan,
    resetUserMessages,
    addProjectCredit,
    loading
  };
};