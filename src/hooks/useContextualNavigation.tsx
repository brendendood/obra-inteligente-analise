
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
      
      // Manter apenas os últimos 10 registros e remover duplicatas
      const filteredHistory = history.filter(h => h.previousPath !== path);
      const updatedHistory = [newEntry, ...filteredHistory].slice(0, 10);
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

  const goBack = useCallback(() => {
    const currentPath = location.pathname;
    console.log('🔙 Tentando voltar de:', currentPath);
    
    // Se estamos em uma subseção de projeto (orçamento, cronograma, etc.)
    if (currentPath.includes('/projeto/') && !currentPath.match(/^\/projeto\/[^\/]+\/?$/)) {
      const projectId = currentPath.split('/')[2];
      const projectMainPath = `/projeto/${projectId}`;
      console.log('🔙 Voltando para página principal do projeto:', projectMainPath);
      navigate(projectMainPath);
      return;
    }
    
    // Se estamos na página principal de um projeto específico
    if (currentPath.match(/^\/projeto\/[^\/]+\/?$/)) {
      console.log('🔙 Voltando para lista de projetos');
      navigate('/projetos');
      return;
    }
    
    // Se estamos na página de projetos
    if (currentPath === '/projetos') {
      console.log('🔙 Voltando para painel');
      navigate('/painel');
      return;
    }
    
    // Se estamos no upload
    if (currentPath === '/upload') {
      console.log('🔙 Voltando para painel');
      navigate('/painel');
      return;
    }
    
    // Para outras páginas, tentar usar histórico
    const history = getNavigationHistory();
    if (history.length > 0) {
      const lastEntry = history[0];
      // Evitar loops - não voltar para a mesma página
      if (lastEntry.previousPath !== currentPath) {
        console.log('🔙 Voltando via histórico para:', lastEntry.previousPath);
        navigate(lastEntry.previousPath);
        return;
      }
    }
    
    // Fallback: voltar para painel
    console.log('🔙 Fallback: voltando para painel');
    navigate('/painel');
  }, [navigate, location.pathname]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem('navigationHistory');
      console.log('🧹 Histórico de navegação limpo');
    } catch (error) {
      console.warn('Erro ao limpar histórico:', error);
    }
  }, []);

  return {
    navigateContextual,
    goBack,
    clearHistory,
    saveToHistory
  };
};
