
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/hooks/useAuth';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';

interface UseProjectLoaderResult {
  loading: boolean;
  error: Error | null;
  currentProject: any;
}

export const useProjectLoader = (): UseProjectLoaderResult => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { currentProject, setCurrentProject } = useProject();
  const { getProject, projectExists } = useProjectsConsistency();
  const { saveToHistory } = useContextualNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      console.log('🏗️ WORKSPACE: Carregando projeto', { projectId, isAuthenticated, userId: user?.id });
      
      if (!projectId || !isAuthenticated || !user) {
        console.log('❌ WORKSPACE: Parâmetros inválidos para carregar projeto');
        navigate('/painel');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Verificar se o projeto existe usando o hook de consistência
        if (!projectExists(projectId)) {
          console.error('❌ WORKSPACE: Projeto não encontrado na lista:', projectId);
          throw new Error('Projeto não encontrado ou acesso negado');
        }

        const project = getProject(projectId);
        if (!project) {
          console.error('❌ WORKSPACE: Projeto não retornado pelo getProject:', projectId);
          throw new Error('Projeto não encontrado');
        }

        console.log('✅ WORKSPACE: Projeto carregado:', {
          id: project.id,
          name: project.name,
          userId: project.user_id
        });
        
        setCurrentProject(project);
        
        // Salvar no histórico para navegação contextual
        saveToHistory(location.pathname, projectId, project.name);
        
      } catch (error) {
        console.error('💥 WORKSPACE: Erro ao carregar projeto:', error);
        setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, isAuthenticated, user, setCurrentProject, navigate, saveToHistory, location.pathname, projectExists, getProject]);

  return { loading, error, currentProject };
};
