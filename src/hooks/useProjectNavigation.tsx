
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { useToast } from '@/hooks/use-toast';

export const useProjectNavigation = () => {
  const navigate = useNavigate();
  const { getProjectById } = useProjectStore();
  const { toast } = useToast();

  const navigateToProject = useCallback((projectId: string, section?: string) => {
    console.log('🔄 NAVEGAÇÃO: Navegando para projeto', { projectId, section });
    
    // Verificar se o projeto existe antes de navegar
    const project = getProjectById(projectId);
    if (!project) {
      console.error('❌ NAVEGAÇÃO: Projeto não encontrado:', projectId);
      toast({
        title: "❌ Projeto não encontrado",
        description: "O projeto que você está tentando acessar não foi encontrado.",
        variant: "destructive"
      });
      navigate('/projetos');
      return false;
    }

    console.log('✅ NAVEGAÇÃO: Projeto encontrado:', project.name);

    const basePath = `/projeto/${projectId}`;
    const targetPath = section ? `${basePath}/${section}` : basePath;
    
    console.log('📍 NAVEGAÇÃO: Redirecionando para:', targetPath);
    navigate(targetPath);
    return true;
  }, [getProjectById, navigate, toast]);

  const navigateToProjectSection = useCallback((projectId: string, section: 'orcamento' | 'cronograma' | 'assistente' | 'documentos') => {
    return navigateToProject(projectId, section);
  }, [navigateToProject]);

  return {
    navigateToProject,
    navigateToProjectSection
  };
};
