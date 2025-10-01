import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '@/hooks/useAccount';
import { supabase } from '@/integrations/supabase/client';
import { PageConstructionLoading } from '@/components/ui/construction-loading';

interface TrialGuardProps {
  children: React.ReactNode;
}

export const TrialGuard: React.FC<TrialGuardProps> = ({ children }) => {
  const { account, loading, isDeactivated } = useAccount();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccount = async () => {
      if (loading) return;

      if (isDeactivated()) {
        await supabase.auth.signOut();
        navigate('/pricing-blocked', { 
          replace: true,
          state: { reason: 'trial_expired' }
        });
      } else {
        setChecking(false);
      }
    };

    checkAccount();
  }, [loading, account, isDeactivated, navigate]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageConstructionLoading text="Verificando conta..." />
      </div>
    );
  }

  return <>{children}</>;
};
