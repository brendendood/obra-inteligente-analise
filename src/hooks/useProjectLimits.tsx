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

  const needsCredit = () => {
    const basePlanLimit = getPlanLimit(userData.plan, 0);
    
    // Se já passou do limite base do plano, precisa usar crédito
    return userData.projectCount >= basePlanLimit;
  };

  const checkAndConsumeCredit = async (): Promise<boolean> => {
    if (!needsCredit()) {
      // Não precisa de crédito, pode criar normalmente
      return true;
    }

    if (!hasCredits()) {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de ${getPlanLimit(userData.plan, 0)} projetos do seu plano. Indique amigos para ganhar projetos extras ou faça upgrade.`,
        variant: "destructive",
        duration: 5000,
      });
      return false;
    }

    // Consumir crédito
    const creditUsed = await useCredit();
    
    if (!creditUsed) {
      toast({
        title: "Erro ao usar crédito",
        description: "Não foi possível usar o crédito. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }

    // Atualizar dados do usuário após consumir crédito
    await refetchUserData();

    toast({
      title: "✨ Crédito usado!",
      description: `Um projeto extra foi usado. Você ainda tem ${getCreditsCount() - 1} projetos extras disponíveis.`,
      duration: 4000,
    });

    return true;
  };

  const getLimitInfo = () => {
    const basePlanLimit = getPlanLimit(userData.plan, 0);
    const totalLimit = getPlanLimit(userData.plan, userData.credits);
    
    return {
      current: userData.projectCount,
      baseLimit: basePlanLimit,
      totalLimit: totalLimit,
      extraCredits: userData.credits,
      canCreate: canCreateProject(),
      needsCredit: needsCredit(),
      isAtBaseLimit: userData.projectCount >= basePlanLimit,
      isAtTotalLimit: userData.projectCount >= totalLimit
    };
  };

  return {
    canCreateProject,
    needsCredit,
    checkAndConsumeCredit,
    getLimitInfo,
    hasCredits,
    getCreditsCount: () => userData.credits
  };
};