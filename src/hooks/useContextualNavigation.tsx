
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
    const currentPath = location.pathname;
    console.log('🔄 NAVIGATION: Caminho atual:', currentPath);
    
    // Não salvar caminhos problemáticos
    if (currentPath.includes('/404') || 
        currentPath.includes('/login') || 
        currentPath.includes('/error')) {
      return;
    }
    
    const storedPreviousPath = sessionStorage.getItem('contextualPreviousPath');
    
    if (storedPreviousPath && storedPreviousPath !== currentPath) {
      setNavigationState(prev => ({
        ...prev,
        previousPath: storedPreviousPath,
        canGoBack: true
      }));
    }

    // Atualizar path anterior para navegações válidas
    sessionStorage.setItem('contextualPreviousPath', currentPath);
  }, [location.pathname]);

  const goBack = useCallback(() => {
    const currentPath = location.pathname;
    console.log('🔙 Navegação contextual:', {
      currentPath,
      canGoBack: navigationState.canGoBack,
      previousPath: navigationState.previousPath,
      fallbackPath: navigationState.fallbackPath
    });

    // CORREÇÃO: Sempre redirecionar para /projetos como fallback seguro
    console.log('📍 Navegação segura para /projetos');
    navigate('/projetos', { replace: true });
  }, [navigate, navigationState, location.pathname]);

  const navigateContextual = useCallback((path: string, projectId?: string) => {
    // Salvar contexto atual
    const currentPath = location.pathname;
    if (!currentPath.includes('/404') && !currentPath.includes('/error')) {
      sessionStorage.setItem('contextualPreviousPath', currentPath);
    }
    
    console.log('🔄 Navegação contextual para:', path);
    navigate(path, { replace: true });
  }, [navigate, location.pathname]);

  const clearHistory = useCallback(() => {
    console.log('🧹 Limpando histórico de navegação');
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
