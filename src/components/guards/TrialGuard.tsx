import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { PageConstructionLoading } from '@/components/ui/construction-loading';

interface TrialGuardProps {
  children: React.ReactNode;
}

export const TrialGuard: React.FC<TrialGuardProps> = ({ children }) => {
  const { userData, loading, isDeactivated, getTrialDaysRemaining } = useUserData();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccount = async () => {
      if (loading) return;

      // Check if account is deactivated
      if (isDeactivated()) {
        await supabase.auth.signOut();
        navigate('/pricing-blocked', { 
          replace: true,
          state: { reason: 'trial_expired' }
        });
        return;
      }

      // Check if trial expired manually
      if (userData?.account_type === 'trial' && userData?.account_status === 'active') {
        const daysRemaining = getTrialDaysRemaining();
        
        if (daysRemaining <= 0) {
          await supabase.auth.signOut();
          navigate('/pricing-blocked', { 
            replace: true,
            state: { reason: 'trial_expired' }
          });
          return;
        }
      }

      setChecking(false);
    };

    checkAccount();
  }, [loading, userData, isDeactivated, getTrialDaysRemaining, navigate]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageConstructionLoading text="Verificando conta..." />
      </div>
    );
  }

  return <>{children}</>;
};
