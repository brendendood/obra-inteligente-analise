import { useAccount } from './useAccount';

type Module = 
  | 'orcamento' 
  | 'cronograma' 
  | 'assistente' 
  | 'documentos' 
  | 'ia' 
  | 'crm';

export const useFeatureAccess = () => {
  const { account, loading, isTrialActive, isPaid } = useAccount();

  const canAccessModule = (module: Module): boolean => {
    if (loading) return false;
    if (!account) return false;

    // Conta paga tem acesso total
    if (isPaid()) return true;

    // Trial só acessa orçamento
    if (isTrialActive()) {
      return module === 'orcamento';
    }

    return false;
  };

  const canUploadProject = async (): Promise<boolean> => {
    if (!account) return false;

    // Conta paga pode fazer upload ilimitado
    if (isPaid()) return true;

    // Trial só pode ter 1 projeto
    if (isTrialActive()) {
      const { supabase } = await import('@/integrations/supabase/client');
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', account.user_id);

      if (error) {
        console.error('Error checking project count:', error);
        return false;
      }

      return (count || 0) < 1;
    }

    return false;
  };

  return {
    account,
    loading,
    canAccessModule,
    canUploadProject,
    isTrialActive,
    isPaid,
  };
};
