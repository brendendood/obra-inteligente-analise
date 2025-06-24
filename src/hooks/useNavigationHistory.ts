
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useNavigationHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = useCallback(() => {
    // Check if we can go back in history
    if (window.history.length > 1 && document.referrer) {
      // Check if the referrer is from the same domain
      const referrerUrl = new URL(document.referrer);
      const currentUrl = new URL(window.location.href);
      
      if (referrerUrl.origin === currentUrl.origin) {
        window.history.back();
        return;
      }
    }

    // Fallback navigation based on current route
    const path = location.pathname;
    
    if (path.startsWith('/obra/')) {
      navigate('/obras');
    } else if (path === '/obras' || path === '/upload' || path === '/assistant') {
      navigate('/painel');
    } else if (path === '/painel') {
      navigate('/');
    } else {
      navigate('/painel');
    }
  }, [navigate, location.pathname]);

  const navigateTo = useCallback((path: string, options?: { replace?: boolean }) => {
    navigate(path, options);
  }, [navigate]);

  return {
    goBack,
    navigateTo,
    currentPath: location.pathname
  };
}
