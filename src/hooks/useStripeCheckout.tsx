import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createCheckout = async (priceId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Erro ao criar checkout',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('stripe-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error: any) {
      console.error('Portal error:', error);
      toast({
        title: 'Erro ao abrir portal',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
    openCustomerPortal,
    loading,
  };
};
