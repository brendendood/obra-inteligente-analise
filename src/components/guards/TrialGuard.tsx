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

      // Check if account is deactivated
      if (isDeactivated()) {
        await supabase.auth.signOut();
        navigate('/pricing-blocked', { 
          replace: true,
          state: { reason: 'trial_expired' }
        });
        return;
      }

      // Check if trial expired manually (in case cron hasn't run yet)
      if (account?.account_type === 'trial' && account?.account_status === 'active') {
        const createdAt = new Date(account.created_at);
        const trialExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        if (trialExpiresAt <= new Date()) {
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
