import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingStatus {
  loading: boolean;
  quizCompleted: boolean;
  planSelected: boolean;
  shouldRedirectToOnboarding: boolean;
}

export const useOnboardingGuard = (): OnboardingStatus => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [planSelected, setPlanSelected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    checkOnboardingStatus();
  }, [isAuthenticated, user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      // Verificar se o usuário tem um plano diferente de free (que não existe mais)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('plan_code')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Erro ao verificar plano do usuário:', userError);
        return;
      }

      // Verificar status do onboarding
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('quiz_completed, plan_selected')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao verificar status do onboarding:', profileError);
        return;
      }

      if (profile && userData) {
        const hasValidPlan = userData.plan_code && ['basic', 'pro', 'enterprise'].includes(userData.plan_code);
        setQuizCompleted(profile.quiz_completed || false);
        setPlanSelected(profile.plan_selected && hasValidPlan);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const shouldRedirectToOnboarding = isAuthenticated && (!quizCompleted || !planSelected);

  return {
    loading,
    quizCompleted,
    planSelected,
    shouldRedirectToOnboarding
  };
};