
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useToast } from '@/hooks/use-toast';

export const useProjectNavigation = () => {
  const navigate = useNavigate();
  const { getProjectById, fetchProjects, projects } = useUnifiedProjectStore();
  const { toast } = useToast();

  const navigateToProject = useCallback(async (projectId: string, section?: string) => {
    console.log('🔄 NAVEGAÇÃO: Navegando para projeto', { projectId, section });
    
    try {
      // Primeiro, tentar encontrar o projeto no estado atual
      let project = getProjectById(projectId);
      
      // Se não encontrar e não temos projetos carregados, buscar
      if (!project && projects.length === 0) {
        console.log('📥 NAVEGAÇÃO: Projetos não carregados, buscando...');
        await fetchProjects();
        project = getProjectById(projectId);
      }
      
      // Se ainda não encontrar, buscar forçadamente
      if (!project) {
        console.log('🔄 NAVEGAÇÃO: Projeto não encontrado localmente, forçando refresh...');
        await fetchProjects();
        project = getProjectById(projectId);
      }
      
      if (!project) {
        console.error('❌ NAVEGAÇÃO: Projeto não encontrado após busca:', projectId);
        toast({
          title: "Projeto não encontrado",
          description: "O projeto que você está tentando acessar não existe ou foi removido.",
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
    } catch (error) {
      console.error('💥 NAVEGAÇÃO: Erro durante navegação:', error);
      toast({
        title: "Erro de navegação",
        description: "Não foi possível acessar o projeto. Tente novamente.",
        variant: "destructive"
      });
      navigate('/projetos');
      return false;
    }
  }, [getProjectById, fetchProjects, projects.length, navigate, toast]);

  const navigateToProjectSection = useCallback((projectId: string, section: 'orcamento' | 'cronograma' | 'assistente' | 'documentos') => {
    return navigateToProject(projectId, section);
  }, [navigateToProject]);

  return {
    navigateToProject,
    navigateToProjectSection
  };
};
