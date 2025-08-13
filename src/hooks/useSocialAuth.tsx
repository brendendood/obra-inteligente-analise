import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useSocialAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://madeai.com.br'
        }
      });

      if (error) throw error;

      toast({
        title: "🚀 Redirecionando...",
        description: "Você será redirecionado para o Google para autenticação."
      });
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      toast({
        title: "❌ Erro no login",
        description: error.message || "Não foi possível fazer login com Google.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'https://madeai.com.br'
        }
      });

      if (error) throw error;

      toast({
        title: "🚀 Redirecionando...",
        description: "Você será redirecionado para a Apple para autenticação."
      });
    } catch (error: any) {
      console.error('Erro no login com Apple:', error);
      toast({
        title: "❌ Erro no login",
        description: error.message || "Não foi possível fazer login com Apple.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signInWithApple,
    loading
  };
};