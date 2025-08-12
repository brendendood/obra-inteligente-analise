import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  ref_code: string;
  referred_by: string | null;
  credits: number;
  has_created_first_project: boolean;
}

export interface ReferralData {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  referral_code: string;
  credits_awarded: boolean;
  referred_user_first_project: boolean;
  created_at: string;
}

export function useReferralSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [referralLink, setReferralLink] = useState<string>('');
  const [referralCount, setReferralCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, ref_code, referred_by, credits, has_created_first_project')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);

      // Generate referral link
      if (data.ref_code) {
        setReferralLink(`https://arqcloud.com.br/cadastro?ref=${data.ref_code}`);
      }

      // Fetch referral count
      const { count, error: countError } = await supabase
        .from('user_referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_user_id', user.id);

      if (!countError) {
        setReferralCount(count || 0);
      }

    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link copiado!",
        description: "Seu link de indicação foi copiado para a área de transferência.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const useCredit = async () => {
    if (!user || !userProfile || userProfile.credits <= 0) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ credits: userProfile.credits - 1 })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error using credit:', error);
        return false;
      }

      // Update local state
      setUserProfile(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
      
      toast({
        title: "Crédito usado",
        description: "Um crédito foi usado para este projeto.",
        duration: 3000,
      });

      return true;
    } catch (error) {
      console.error('Error in useCredit:', error);
      return false;
    }
  };

  const markFirstProjectCreated = async () => {
    if (!user || !userProfile || userProfile.has_created_first_project) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ has_created_first_project: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking first project:', error);
        return;
      }

      // If user was referred, mark it in the referral record
      if (userProfile.referred_by) {
        await supabase
          .from('user_referrals')
          .update({ 
            referred_user_first_project: true 
          })
          .eq('referred_user_id', user.id);
        
        toast({
          title: "🎉 Primeiro projeto criado!",
          description: "Parabéns por criar seu primeiro projeto no MadeAI!",
          duration: 3000,
        });
      }

      // Update local state
      setUserProfile(prev => prev ? { ...prev, has_created_first_project: true } : null);

    } catch (error) {
      console.error('Error in markFirstProjectCreated:', error);
    }
  };

  const hasCredits = () => {
    return userProfile ? userProfile.credits > 0 : false;
  };

  const getCreditsCount = () => {
    return userProfile ? userProfile.credits : 0;
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  return {
    userProfile,
    referralLink,
    referralCount,
    isLoading,
    copyReferralLink,
    useCredit,
    markFirstProjectCreated,
    hasCredits,
    getCreditsCount,
    refetch: fetchUserProfile
  };
}