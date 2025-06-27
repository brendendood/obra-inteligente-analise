
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';

export const useOptimizedProjectNavigation = () => {
  const navigate = useNavigate();
  const { projectExists, getProject } = useProjectsConsistency();
  const { setCurrentProject } = useProject();
  const { toast } = useToast();

  const navigateToProject = useCallback(async (
    projectId: string, 
    section?: 'orcamento' | 'cronograma' | 'assistente' | 'documentos'
  ) => {
    console.log('🚀 NAVEGAÇÃO OTIMIZADA: Iniciando navegação para projeto', { projectId, section });
    
    // Verificar se o projeto existe no cache
    if (!projectExists(projectId)) {
      console.error('❌ NAVEGAÇÃO: Projeto não encontrado no cache:', projectId);
      toast({
        title: "❌ Projeto não encontrado",
        description: "O projeto pode ter sido removido ou você não tem acesso.",
        variant: "destructive"
      });
      navigate('/projetos');
      return false;
    }

    const project = getProject(projectId);
    if (!project) {
      console.error('❌ NAVEGAÇÃO: Erro ao obter projeto:', projectId);
      navigate('/projetos');
      return false;
    }

    // Definir projeto atual no contexto
    console.log('✅ NAVEGAÇÃO: Definindo projeto atual:', project.name);
    setCurrentProject(project);

    // Navegar para a rota correta
    const basePath = `/projeto/${projectId}`;
    let targetPath = basePath;

    if (section) {
      // Mapear seções para rotas corretas
      const sectionRoutes = {
        orcamento: `${basePath}/orcamento`,
        cronograma: `${basePath}/cronograma`,
        assistente: `/ia/${projectId}`,
        documentos: `${basePath}/documentos`
      };
      targetPath = sectionRoutes[section];
    }

    console.log('📍 NAVEGAÇÃO: Redirecionando para:', targetPath);
    navigate(targetPath);
    return true;
  }, [projectExists, getProject, setCurrentProject, navigate, toast]);

  const quickNavigateToSection = useCallback((
    projectId: string,
    section: 'orcamento' | 'cronograma' | 'assistente' | 'documentos'
  ) => {
    return navigateToProject(projectId, section);
  }, [navigateToProject]);

  return {
    navigateToProject,
    quickNavigateToSection
  };
};
