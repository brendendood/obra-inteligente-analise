import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageConstructionLoading } from '@/components/ui/construction-loading';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Timeout de segurança para evitar loading infinito
        const timeoutId = setTimeout(() => {
          console.log('Auth callback timeout - redirecionando para sucesso');
          navigate('/email/sucesso', { replace: true });
        }, 8000);

        const hash = window.location.hash;
        const searchParams = new URLSearchParams(window.location.search);

        // Verificar se há tokens no hash
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            try {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });

              if (error) {
                console.log('Erro na setSession, mas continuando:', error);
              }
            } catch (err) {
              console.log('Erro técnico na setSession, mas continuando:', err);
            }
          }
        }

        // Verificar se há code no search params
        const code = searchParams.get('code');
        if (code) {
          try {
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (error) {
              console.log('Erro no exchangeCodeForSession, mas continuando:', error);
            }
          } catch (err) {
            console.log('Erro técnico no exchangeCodeForSession, mas continuando:', err);
          }
        }

        // Limpar timeout se chegou até aqui
        clearTimeout(timeoutId);

        // SEMPRE redirecionar para sucesso, independente do resultado
        navigate('/onboarding', { replace: true }); // Redirecionar para onboarding após confirmação

      } catch (error) {
        console.log('Erro geral no callback, redirecionando para onboarding:', error);
        navigate('/onboarding', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <PageConstructionLoading text="Confirmando e-mail..." />
    </div>
  );
}