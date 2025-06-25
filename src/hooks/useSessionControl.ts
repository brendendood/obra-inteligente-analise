
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useSessionControl() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Define flag quando usuário faz login/logout (apenas para controle interno)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        sessionStorage.setItem('was_logged_in', 'true');
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('was_logged_in');
      }
    });

    // Timeout de sessão (40 minutos de inatividade)
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.auth.signOut();
          toast({
            title: "⏰ Sessão expirada",
            description: "Sua sessão expirou por inatividade (40 minutos).",
          });
          navigate('/');
        }
      }, 40 * 60 * 1000); // 40 minutos
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
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [navigate, toast]);
}
