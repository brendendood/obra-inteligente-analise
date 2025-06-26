
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectSync } from '@/hooks/useProjectSync';
import { useToast } from '@/hooks/use-toast';

export const useProjectNavigation = () => {
  const navigate = useNavigate();
  const { projectExists, getProjectById, setCurrentProject } = useProjectSync();
  const { toast } = useToast();

  const navigateToProject = useCallback((projectId: string, section?: string) => {
    console.log('🚀 NAVEGAÇÃO: Iniciando navegação', { projectId, section });
    
    // Verificar se o projeto existe
    if (!projectExists(projectId)) {
      console.error('❌ NAVEGAÇÃO: Projeto não encontrado:', projectId);
      toast({
        title: "❌ Projeto não encontrado",
        description: "O projeto que você está tentando acessar não foi encontrado.",
        variant: "destructive"
      });
      navigate('/projetos');
      return false;
    }

    // Obter e definir projeto atual
    const project = getProjectById(projectId);
    if (!project) {
      console.error('❌ NAVEGAÇÃO: Falha ao obter projeto:', projectId);
      navigate('/projetos');
      return false;
    }

    console.log('✅ NAVEGAÇÃO: Projeto encontrado, definindo como atual:', project.name);
    setCurrentProject(project);

    // Navegar para a rota correta
    const basePath = `/projeto/${projectId}`;
    const targetPath = section ? `${basePath}/${section}` : basePath;
    
    console.log('📍 NAVEGAÇÃO: Redirecionando para:', targetPath);
    navigate(targetPath);
    return true;
  }, [projectExists, getProjectById, setCurrentProject, navigate, toast]);

  const navigateToProjectSection = useCallback((projectId: string, section: 'orcamento' | 'cronograma' | 'assistente' | 'documentos') => {
    return navigateToProject(projectId, section);
  }, [navigateToProject]);

  return {
    navigateToProject,
    navigateToProjectSection
  };
};
