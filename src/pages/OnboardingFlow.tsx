import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import OnboardingQuiz from '@/components/onboarding/OnboardingQuiz';
import PlanSelection from '@/components/onboarding/PlanSelection';
import { PageConstructionLoading } from '@/components/ui/construction-loading';
import { Navigate } from 'react-router-dom';

const OnboardingFlow: React.FC = () => {
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
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('quiz_completed, plan_selected')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao verificar status do onboarding:', error);
        return;
      }

      if (profile) {
        setQuizCompleted(profile.quiz_completed || false);
        setPlanSelected(profile.plan_selected || false);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return <PageConstructionLoading />;
  }

  // Se completou tudo, redirecionar para o painel
  if (quizCompleted && planSelected) {
    return <Navigate to="/painel" replace />;
  }

  // Se não completou o quiz
  if (!quizCompleted) {
    return <OnboardingQuiz onComplete={handleQuizComplete} userId={user?.id || ''} />;
  }

  // Se completou o quiz mas não selecionou plano
  if (quizCompleted && !planSelected) {
    return <PlanSelection userId={user?.id || ''} />;
  }

  return <PageConstructionLoading />;
};

export default OnboardingFlow;