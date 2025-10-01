import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionStatus {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
  loading: boolean;
}

const PLAN_MAPPING = {
  basic: {
    price_id: 'price_1SDN8fDEqBbry6TZAN7xmxJC',
    product_id: 'prod_T9gVntY2x6gnIE',
  },
  pro: {
    price_id: 'price_1SDN8xDEqBbry6TZx69L8X4E',
    product_id: 'prod_T9gVdwQyOMqXJf',
  },
  enterprise: {
    price_id: 'price_1SDN9IDEqBbry6TZWwyynoUf',
    product_id: 'prod_T9gWDhyOO3PIbk',
  },
} as const;

export const useStripeSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    product_id: null,
    subscription_end: null,
    loading: true,
  });

  const checkSubscription = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setStatus({
        subscribed: data.subscribed || false,
        product_id: data.product_id || null,
        subscription_end: data.subscription_end || null,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus({
        subscribed: false,
        product_id: null,
        subscription_end: null,
        loading: false,
      });
    }
  };

  const createCheckout = async (plan: 'basic' | 'pro' | 'enterprise') => {
    try {
      const priceId = PLAN_MAPPING[plan].price_id;
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  const getCurrentPlan = (): 'basic' | 'pro' | 'enterprise' | null => {
    if (!status.product_id) return null;
    
    for (const [plan, config] of Object.entries(PLAN_MAPPING)) {
      if (config.product_id === status.product_id) {
        return plan as 'basic' | 'pro' | 'enterprise';
      }
    }
    
    return null;
  };

  useEffect(() => {
    checkSubscription();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(checkSubscription, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    status,
    currentPlan: getCurrentPlan(),
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
