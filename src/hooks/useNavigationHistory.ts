
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useNavigationHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = useCallback(() => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback navigation based on current route
      const path = location.pathname;
      
      if (path.startsWith('/obra/')) {
        navigate('/obras');
      } else if (path === '/obras' || path === '/upload' || path === '/assistant') {
        navigate('/painel');
      } else {
        navigate('/');
      }
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
