
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useSessionControl() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Força logout quando a página é carregada/recarregada
    const handlePageLoad = () => {
      const wasLoggedIn = sessionStorage.getItem('was_logged_in');
      
      if (wasLoggedIn) {
        sessionStorage.removeItem('was_logged_in');
        supabase.auth.signOut();
        toast({
          title: "🔒 Nova sessão iniciada",
          description: "Por segurança, você foi desconectado automaticamente.",
        });
        navigate('/');
      }
    };

    // Define flag quando usuário faz login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        sessionStorage.setItem('was_logged_in', 'true');
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('was_logged_in');
      }
    });

    // Força logout ao carregar página
    handlePageLoad();

    // Escuta mudanças de visibilidade (quando usuário volta para a aba)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handlePageLoad();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Timeout de sessão (30 minutos de inatividade)
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.auth.signOut();
          toast({
            title: "⏰ Sessão expirada",
            description: "Sua sessão expirou por inatividade (30 minutos).",
          });
          navigate('/');
        }
      }, 30 * 60 * 1000); // 30 minutos
    };

    // Eventos que resetam o timer
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    resetTimer();

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [navigate, toast]);
}
