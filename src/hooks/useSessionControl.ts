
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useSessionControl() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Force logout when page is loaded/refreshed
    const handlePageLoad = () => {
      // Check if user was previously authenticated
      const wasLoggedIn = sessionStorage.getItem('was_logged_in');
      
      if (wasLoggedIn) {
        // Clear the flag and force logout
        sessionStorage.removeItem('was_logged_in');
        supabase.auth.signOut();
        toast({
          title: "🔒 Sessão expirada",
          description: "Por segurança, você foi desconectado automaticamente.",
        });
        navigate('/');
      }
    };

    // Set flag when user logs in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        sessionStorage.setItem('was_logged_in', 'true');
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('was_logged_in');
      }
    });

    // Handle page visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handlePageLoad();
      }
    };

    // Force logout on page load
    handlePageLoad();

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Session timeout (30 minutes of inactivity)
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.auth.signOut();
          toast({
            title: "⏰ Sessão expirada",
            description: "Sua sessão expirou por inatividade.",
          });
          navigate('/');
        }
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Reset timer on user activity
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
