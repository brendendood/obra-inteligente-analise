import { useUserData } from '@/hooks/useUserData';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { getPlanLimit } from '@/utils/planUtils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useProjectLimits = () => {
  const { userData, refetch: refetchUserData } = useUserData();
  const { useCredit, hasCredits, getCreditsCount } = useReferralSystem();
  const { toast } = useToast();
  const { user } = useAuth();

  const canCreateProject = () => {
    const basePlanLimit = getPlanLimit(userData.plan, 0);
    const totalLimit = getPlanLimit(userData.plan, userData.credits);
    
    // Enterprise tem projetos ilimitados
    if (userData.plan === 'enterprise') {
      return true;
    }

    // Verificar se ainda está dentro do limite total (base + créditos)
    return userData.projectCount < totalLimit;
  };

  const checkAndCreateProject = async (): Promise<boolean> => {
    const totalLimit = getPlanLimit(userData.plan, userData.credits);
    
    if (!canCreateProject()) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de ${totalLimit} projetos. Indique amigos para ganhar projetos extras ou faça upgrade.`,
        variant: "destructive",
        duration: 5000,
      });
      return false;
    }

    return true;
  };

  const getLimitInfo = () => {
    const totalLimit = getPlanLimit(userData.plan, userData.credits);
    
    return {
      current: userData.projectCount,
      totalLimit: totalLimit,
      extraCredits: userData.credits,
      canCreate: canCreateProject(),
      isAtLimit: userData.projectCount >= totalLimit
    };
  };

  return {
    canCreateProject,
    checkAndCreateProject,
    getLimitInfo,
    hasCredits,
    getCreditsCount: () => userData.credits
  };
};