
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

    // CORREÇÃO: Lógica específica para páginas de projeto
    if (currentPath.includes('/projeto/')) {
      console.log('📍 Voltando de página de projeto para /projetos');
      navigate('/projetos', { replace: true });
      return;
    }

    // CORREÇÃO: Para páginas de upload, voltar para projetos
    if (currentPath.includes('/upload')) {
      console.log('📍 Voltando de upload para /projetos');
      navigate('/projetos', { replace: true });
      return;
    }

    // CORREÇÃO: Para páginas de documentos
    if (currentPath.includes('/documentos')) {
      // Se tem projeto ID na URL, voltar para o projeto
      const projectIdMatch = currentPath.match(/\/projeto\/([^\/]+)/);
      if (projectIdMatch) {
        const projectId = projectIdMatch[1];
        console.log('📍 Voltando de documentos para projeto:', projectId);
        navigate(`/projeto/${projectId}`, { replace: true });
        return;
      }
      // Senão, voltar para projetos
      console.log('📍 Voltando de documentos para /projetos');
      navigate('/projetos', { replace: true });
      return;
    }

    // CORREÇÃO: Para páginas específicas de projeto (orçamento, cronograma, etc)
    if (currentPath.match(/\/projeto\/[^\/]+\/(orcamento|cronograma|assistente)/)) {
      const projectIdMatch = currentPath.match(/\/projeto\/([^\/]+)/);
      if (projectIdMatch) {
        const projectId = projectIdMatch[1];
        console.log('📍 Voltando de seção específica para projeto:', projectId);
        navigate(`/projeto/${projectId}`, { replace: true });
        return;
      }
    }

    // Usar path anterior se disponível e seguro
    if (navigationState.canGoBack && 
        navigationState.previousPath && 
        !navigationState.previousPath.includes('/404') &&
        !navigationState.previousPath.includes('/login') &&
        !navigationState.previousPath.includes('/error')) {
      console.log('📍 Usando path anterior:', navigationState.previousPath);
      navigate(navigationState.previousPath, { replace: true });
      return;
    }

    // Fallback seguro para projetos
    console.log('📍 Usando fallback seguro: /projetos');
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
