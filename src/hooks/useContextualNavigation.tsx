
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

interface NavigationState {
  previousPath: string | null;
  canGoBack: boolean;
  fallbackPath: string;
}

export const useContextualNavigation = (fallbackPath: string = '/projetos') => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    previousPath: null,
    canGoBack: false,
    fallbackPath
  });

  useEffect(() => {
    // Manter histórico de navegação contextual
    const currentPath = location.pathname;
    const storedPreviousPath = sessionStorage.getItem('contextualPreviousPath');
    
    if (storedPreviousPath && storedPreviousPath !== currentPath) {
      setNavigationState(prev => ({
        ...prev,
        previousPath: storedPreviousPath,
        canGoBack: true
      }));
    }

    // Atualizar o path anterior apenas para navegações válidas
    if (!currentPath.includes('/404') && !currentPath.includes('/login')) {
      sessionStorage.setItem('contextualPreviousPath', currentPath);
    }
  }, [location.pathname]);

  const goBack = useCallback(() => {
    console.log('🔙 Navegação contextual:', {
      canGoBack: navigationState.canGoBack,
      previousPath: navigationState.previousPath,
      fallbackPath: navigationState.fallbackPath,
      currentPath: location.pathname
    });

    // CORREÇÃO: Sempre redirecionar para projetos em caso de dúvida
    if (location.pathname.includes('/projeto/')) {
      navigate('/projetos', { replace: true });
      return;
    }

    if (location.pathname.includes('/upload')) {
      navigate('/projetos', { replace: true });
      return;
    }

    // Usar path anterior se disponível e seguro
    if (navigationState.canGoBack && navigationState.previousPath && 
        !navigationState.previousPath.includes('/404') &&
        !navigationState.previousPath.includes('/login')) {
      navigate(navigationState.previousPath, { replace: true });
      return;
    }

    // Fallback seguro para projetos
    console.log('📍 Usando fallback seguro: /projetos');
    navigate('/projetos', { replace: true });
  }, [navigate, navigationState, location.pathname]);

  const navigateContextual = useCallback((path: string, projectId?: string) => {
    // Salvar contexto atual
    sessionStorage.setItem('contextualPreviousPath', location.pathname);
    
    // Navegar
    navigate(path, { replace: true });
  }, [navigate, location.pathname]);

  const clearHistory = useCallback(() => {
    sessionStorage.removeItem('contextualPreviousPath');
    setNavigationState(prev => ({
      ...prev,
      previousPath: null,
      canGoBack: false
    }));
  }, []);

  return {
    goBack,
    navigateContextual,
    clearHistory,
    canGoBack: navigationState.canGoBack,
    previousPath: navigationState.previousPath
  };
};
