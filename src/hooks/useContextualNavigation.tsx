
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface NavigationHistory {
  projectId?: string;
  previousPath: string;
  timestamp: number;
}

export const useContextualNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const getNavigationHistory = (): NavigationHistory[] => {
    const history = localStorage.getItem('navigationHistory');
    return history ? JSON.parse(history) : [];
  };

  const saveToHistory = useCallback((path: string, projectId?: string) => {
    const history = getNavigationHistory();
    const newEntry: NavigationHistory = {
      projectId,
      previousPath: path,
      timestamp: Date.now()
    };
    
    // Manter apenas os últimos 10 registros
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    localStorage.setItem('navigationHistory', JSON.stringify(updatedHistory));
  }, []);

  const navigateContextual = useCallback((path: string, projectId?: string) => {
    // Salvar caminho atual no histórico
    saveToHistory(location.pathname, projectId);
    
    // Se usuário autenticado tentar ir para landing page, redirecionar para painel
    if (isAuthenticated && path === '/') {
      navigate('/painel');
      return;
    }
    
    navigate(path);
  }, [navigate, location.pathname, isAuthenticated, saveToHistory]);

  const goBack = useCallback((currentProjectId?: string) => {
    const history = getNavigationHistory();
    
    if (history.length === 0) {
      // Se não há histórico, ir para página apropriada baseada no contexto
      if (currentProjectId) {
        navigate('/obras');
      } else {
        navigate('/painel');
      }
      return;
    }

    // Encontrar a última página relevante no histórico
    let targetPath = '/painel';
    
    if (currentProjectId) {
      // Se estamos em um projeto, tentar encontrar última página do mesmo projeto
      const projectHistory = history.find(h => h.projectId === currentProjectId);
      if (projectHistory) {
        targetPath = projectHistory.previousPath;
      } else {
        // Se não há histórico do projeto, ir para lista de obras
        targetPath = '/obras';
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
      targetPath = currentProjectId ? '/obras' : '/painel';
    }

    // Nunca permitir voltar para landing page se autenticado
    if (isAuthenticated && targetPath === '/') {
      targetPath = '/painel';
    }

    navigate(targetPath);
  }, [navigate, location.pathname, isAuthenticated]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('navigationHistory');
  }, []);

  return {
    navigateContextual,
    goBack,
    clearHistory,
    saveToHistory
  };
};
