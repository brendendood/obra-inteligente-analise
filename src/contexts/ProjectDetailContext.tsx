
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProjectStore } from '@/stores/projectStore';
import { Project } from '@/types/project';

interface ProjectDetailContextType {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  refetchProject: () => Promise<void>;
}

const ProjectDetailContext = createContext<ProjectDetailContextType | undefined>(undefined);

interface ProjectDetailProviderProps {
  children: ReactNode;
}

export const ProjectDetailProvider = ({ children }: ProjectDetailProviderProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { getProjectById, fetchProjects, projects } = useProjectStore();

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      console.log('🔍 PROJECT DETAIL: Nenhum projectId fornecido na URL');
      setError('ID do projeto não fornecido');
      setIsLoading(false);
      return;
    }

    console.log('🔍 PROJECT DETAIL: Iniciando busca inteligente para projeto ID:', projectId);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // 1. PRIMEIRA TENTATIVA: Buscar no ProjectStore (cache)
      console.log('📦 PROJECT DETAIL: Verificando ProjectStore primeiro...');
      const cachedProject = getProjectById(projectId);
      
      if (cachedProject) {
        console.log('✅ PROJECT DETAIL: Projeto encontrado no cache:', cachedProject.name);
        setProject(cachedProject);
        setIsLoading(false);
        return;
      }

      // 2. SEGUNDA TENTATIVA: Forçar refresh do ProjectStore
      console.log('🔄 PROJECT DETAIL: Projeto não encontrado no cache, atualizando dados...');
      await fetchProjects();
      
      // Verificar novamente após o refresh
      const refreshedProject = getProjectById(projectId);
      if (refreshedProject) {
        console.log('✅ PROJECT DETAIL: Projeto encontrado após refresh:', refreshedProject.name);
        setProject(refreshedProject);
        setIsLoading(false);
        return;
      }

      // 3. TERCEIRA TENTATIVA: Busca direta no Supabase (fallback)
      console.log('🌐 PROJECT DETAIL: Fazendo busca direta no Supabase como fallback...');
      const { data: projectDataFromAPI, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ PROJECT DETAIL: Erro do Supabase:', fetchError);
        const errorMessage = `Erro ao carregar projeto: ${fetchError.message}`;
        setError(errorMessage);
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível carregar os dados do projeto. Clique em 'Atualizar Projetos' e tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (!projectDataFromAPI) {
        console.log('❌ PROJECT DETAIL: Nenhum projeto encontrado');
        setError('Projeto não encontrado - dados podem não estar sincronizados');
        toast({
          title: "Projeto não encontrado",
          description: "Os dados podem não estar sincronizados. Clique em 'Atualizar Projetos' no painel principal.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ PROJECT DETAIL: Projeto encontrado via Supabase:', projectDataFromAPI.name);
      setProject(projectDataFromAPI);
      
    } catch (error) {
      console.error('💥 PROJECT DETAIL: Erro inesperado:', error);
      const errorMessage = 'Erro inesperado ao carregar projeto';
      setError(errorMessage);
      toast({
        title: "Erro ao carregar projeto",
        description: "Erro inesperado. Tente atualizar a página ou clique em 'Atualizar Projetos'.",
        variant: "destructive",
      });
    } finally {
      console.log('🏁 PROJECT DETAIL: Busca finalizada');
      setIsLoading(false);
    }
  }, [projectId, toast, getProjectById, fetchProjects]);

  useEffect(() => {
    console.log('🎯 PROJECT DETAIL: useEffect disparado. ProjectId atual:', projectId);
    fetchProject();
  }, [fetchProject]);

  // Auto-sync quando o ProjectStore é atualizado
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const updatedProject = getProjectById(projectId);
      if (updatedProject && (!project || project.updated_at !== updatedProject.updated_at)) {
        console.log('🔄 PROJECT DETAIL: Sincronizando com ProjectStore atualizado');
        setProject(updatedProject);
        setError(null);
      }
    }
  }, [projects, projectId, getProjectById, project]);

  const value: ProjectDetailContextType = {
    project,
    isLoading,
    error,
    refetchProject: fetchProject
  };

  console.log('🎬 PROJECT DETAIL: Provider renderizado. Estado atual:', {
    projectId,
    hasProject: !!project,
    isLoading,
    error,
    projectName: project?.name,
    cacheSize: projects.length
  });

  return (
    <ProjectDetailContext.Provider value={value}>
      {children}
    </ProjectDetailContext.Provider>
  );
};

export const useProjectDetail = (): ProjectDetailContextType => {
  const context = useContext(ProjectDetailContext);
  if (context === undefined) {
    throw new Error('useProjectDetail deve ser usado dentro de um ProjectDetailProvider');
  }
  return context;
};
