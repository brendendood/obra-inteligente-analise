import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOnboardingGuard } from '@/hooks/useOnboardingGuard';
import { PageConstructionLoading } from '@/components/ui/construction-loading';

interface OnboardingProtectedRouteProps {
  children: React.ReactNode;
}

const OnboardingProtectedRoute: React.FC<OnboardingProtectedRouteProps> = ({ children }) => {
  const { loading, shouldRedirectToOnboarding } = useOnboardingGuard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageConstructionLoading text="Verificando onboarding..." />
      </div>
    );
  }

  if (shouldRedirectToOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default OnboardingProtectedRoute;