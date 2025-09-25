import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { PageConstructionLoading } from '@/components/ui/construction-loading';
import PaywallPage from '@/components/paywall/PaywallPage';

interface PaywallGuardProps {
  children: React.ReactNode;
}

const PaywallGuard: React.FC<PaywallGuardProps> = ({ children }) => {
  const { userData, loading } = useUserData();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageConstructionLoading text="Verificando plano..." />
      </div>
    );
  }

  // Se não tem plano (plan_code = null), mostrar paywall
  if (!userData.plan) {
    return <PaywallPage userId={user?.id || ''} />;
  }

  // Se tem plano, permitir acesso
  return <>{children}</>;
};

export default PaywallGuard;