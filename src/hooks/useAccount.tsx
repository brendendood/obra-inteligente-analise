import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type AccountType = 'trial' | 'paid';
export type AccountStatus = 'active' | 'deactivated_permanently';

export interface Account {
  id: string;
  user_id: string;
  account_type: AccountType;
  account_status: AccountStatus;
  deactivated_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_price_id: string | null;
  plan_name: string | null;
  plan_renews_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useAccount = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = async () => {
    if (!user) {
      setAccount(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setAccount(data);
    } catch (err: any) {
      console.error('Error loading account:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [user]);

  const isTrialActive = () => {
    if (!account || !user) return false;
    if (account.account_type !== 'trial') return false;
    if (account.account_status !== 'active') return false;

    const createdAt = new Date(user.created_at);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const trialDays = parseInt(import.meta.env.VITE_TRIAL_DAYS || '7');

    return daysPassed < trialDays;
  };

  const getTrialDaysRemaining = () => {
    if (!account || !user) return 0;
    if (account.account_type !== 'trial') return 0;

    const createdAt = new Date(account.created_at);
    const now = new Date();
    const trialExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const daysRemaining = Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return Math.max(0, daysRemaining);
  };

  const isPaid = () => {
    return account?.account_type === 'paid' && account?.account_status === 'active';
  };

  const isDeactivated = () => {
    return account?.account_status === 'deactivated_permanently';
  };

  return {
    account,
    loading,
    error,
    refetch: fetchAccount,
    isTrialActive,
    getTrialDaysRemaining,
    isPaid,
    isDeactivated,
  };
};
