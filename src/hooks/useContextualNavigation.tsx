
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

interface NavigationState {
  previousPath: string | null;
  canGoBack: boolean;
  fallbackPath: string;
}

export const useContextualNavigation = (fallbackPath: string = '/painel') => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    previousPath: null,
    canGoBack: false,
    fallbackPath
  });

  useEffect(() => {
    // Manter histórico de navegação no localStorage
    const currentPath = location.pathname;
    const storedPreviousPath = localStorage.getItem('previousPath');
    
    if (storedPreviousPath && storedPreviousPath !== currentPath) {
      setNavigationState(prev => ({
        ...prev,
        previousPath: storedPreviousPath,
        canGoBack: true
      }));
    }

    // Atualizar o path anterior
    localStorage.setItem('previousPath', currentPath);
  }, [location.pathname]);

  const goBack = useCallback(() => {
    console.log('🔙 Tentativa de navegação:', {
      canGoBack: navigationState.canGoBack,
      previousPath: navigationState.previousPath,
      fallbackPath: navigationState.fallbackPath,
      currentPath: location.pathname
    });

    // Tentar usar o histórico do browser primeiro
    if (window.history.length > 1) {
      try {
        window.history.back();
        return;
      } catch (error) {
        console.warn('⚠️ Erro no history.back():', error);
      }
    }

    // Usar path anterior armazenado
    if (navigationState.canGoBack && navigationState.previousPath) {
      navigate(navigationState.previousPath);
      return;
    }

    // Fallback final
    console.log('📍 Usando fallback:', navigationState.fallbackPath);
    navigate(navigationState.fallbackPath);
  }, [navigate, navigationState, location.pathname]);

  const navigateWithHistory = useCallback((path: string) => {
    // Salvar path atual antes de navegar
    localStorage.setItem('previousPath', location.pathname);
    navigate(path);
  }, [navigate, location.pathname]);

  const navigateContextual = useCallback((path: string, projectId?: string) => {
    // Salvar path atual antes de navegar
    localStorage.setItem('previousPath', location.pathname);
    
    // Se estamos num projeto e navegando para uma área geral, manter contexto
    if (projectId && path.startsWith('/') && !path.includes(projectId)) {
      // Para navegação contextual dentro do projeto
      if (path === '/painel' || path === '/projetos') {
        navigate(path);
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  }, [navigate, location.pathname]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('previousPath');
    setNavigationState(prev => ({
      ...prev,
      previousPath: null,
      canGoBack: false
    }));
  }, []);

  return {
    goBack,
    navigateWithHistory,
    navigateContextual,
    clearHistory,
    canGoBack: navigationState.canGoBack,
    previousPath: navigationState.previousPath
  };
};
