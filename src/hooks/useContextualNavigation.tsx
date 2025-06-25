
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface NavigationHistory {
  projectId?: string;
  previousPath: string;
  timestamp: number;
  title?: string;
}

export const useContextualNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const getNavigationHistory = (): NavigationHistory[] => {
    try {
      const history = localStorage.getItem('navigationHistory');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  };

  const saveToHistory = useCallback((path: string, projectId?: string, title?: string) => {
    try {
      const history = getNavigationHistory();
      const newEntry: NavigationHistory = {
        projectId,
        previousPath: path,
        timestamp: Date.now(),
        title
      };
      
      // Manter apenas os últimos 15 registros e remover duplicatas
      const filteredHistory = history.filter(h => h.previousPath !== path);
      const updatedHistory = [newEntry, ...filteredHistory].slice(0, 15);
      localStorage.setItem('navigationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.warn('Erro ao salvar histórico de navegação:', error);
    }
  }, []);

  const navigateContextual = useCallback((path: string, projectId?: string, title?: string) => {
    // Salvar caminho atual no histórico antes de navegar
    saveToHistory(location.pathname, projectId, title);
    
    // Se usuário autenticado tentar ir para landing page, redirecionar para painel
    if (isAuthenticated && path === '/') {
      console.log('🔄 Redirecionando usuário autenticado para painel');
      navigate('/painel');
      return;
    }
    
    console.log('🧭 Navegação contextual:', { from: location.pathname, to: path, projectId });
    navigate(path);
  }, [navigate, location.pathname, isAuthenticated, saveToHistory]);

  const goBack = useCallback((currentProjectId?: string) => {
    const history = getNavigationHistory();
    
    if (history.length === 0) {
      // Se não há histórico, determinar página apropriada baseada no contexto
      if (currentProjectId) {
        console.log('🔙 Sem histórico, voltando para lista de projetos');
        navigate('/projetos');
      } else {
        console.log('🔙 Sem histórico, voltando para painel');
        navigate('/painel');
      }
      return;
    }

    // Encontrar a página apropriada no histórico
    let targetPath = '/painel';
    
    if (currentProjectId) {
      // Se estamos em um projeto, tentar encontrar última página relevante
      const relevantHistory = history.find(h => 
        h.projectId === currentProjectId || 
        (!h.projectId && !h.previousPath.includes('/projeto/'))
      );
      
      if (relevantHistory) {
        targetPath = relevantHistory.previousPath;
      } else {
        // Se não há histórico relevante, ir para lista de projetos
        targetPath = '/projetos';
      }
    } else {
      // Se não estamos em projeto específico, pegar última página geral
      const generalHistory = history.find(h => !h.projectId);
      if (generalHistory) {
        targetPath = generalHistory.previousPath;
      }
    }

    // Evitar loops (não voltar para a mesma página)
    if (targetPath === location.pathname) {
      targetPath = currentProjectId ? '/projetos' : '/painel';
    }

    // Nunca permitir voltar para landing page se autenticado
    if (isAuthenticated && targetPath === '/') {
      targetPath = '/painel';
    }

    console.log('🔙 Navegação de volta:', { from: location.pathname, to: targetPath, projectId: currentProjectId });
    navigate(targetPath);
  }, [navigate, location.pathname, isAuthenticated]);

  const getHistoryForDisplay = () => {
    return getNavigationHistory()
      .filter(h => h.previousPath !== location.pathname)
      .slice(0, 5);
  };

  const navigateToHistoryItem = useCallback((historyItem: NavigationHistory) => {
    navigate(historyItem.previousPath);
  }, [navigate]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem('navigationHistory');
      console.log('🧹 Histórico de navegação limpo');
    } catch (error) {
      console.warn('Erro ao limpar histórico:', error);
    }
  }, []);

  const canGoBack = () => {
    const history = getNavigationHistory();
    return history.length > 0 || location.pathname !== '/painel';
  };

  return {
    navigateContextual,
    goBack,
    clearHistory,
    saveToHistory,
    getHistoryForDisplay,
    navigateToHistoryItem,
    canGoBack
  };
};
