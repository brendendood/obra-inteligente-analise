
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedProjectStore } from '@/stores/optimizedProjectStore';
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
  const { getProjectById, fetchProjects, projects } = useOptimizedProjectStore();

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      console.log('🔍 PROJECT DETAIL: Nenhum projectId fornecido na URL');
      setError('ID do projeto não fornecido');
      setIsLoading(false);
      return;
    }

    console.log('🔍 PROJECT DETAIL: Iniciando busca para projeto ID:', projectId);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar no ProjectStore primeiro
      const cachedProject = getProjectById(projectId);
      
      if (cachedProject) {
        console.log('✅ PROJECT DETAIL: Projeto encontrado:', cachedProject.name);
        setProject(cachedProject);
        setIsLoading(false);
        return;
      }

      // Se não encontrado, fazer refresh uma vez
      console.log('🔄 PROJECT DETAIL: Atualizando dados...');
      await fetchProjects();
      
      const refreshedProject = getProjectById(projectId);
      if (refreshedProject) {
        console.log('✅ PROJECT DETAIL: Projeto encontrado após refresh:', refreshedProject.name);
        setProject(refreshedProject);
        setIsLoading(false);
        return;
      }

      // Fallback direto no Supabase
      console.log('🌐 PROJECT DETAIL: Busca direta no Supabase...');
      const { data: projectData, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ PROJECT DETAIL: Erro do Supabase:', fetchError);
        setError(`Erro ao carregar projeto: ${fetchError.message}`);
        return;
      }

      if (!projectData) {
        console.log('❌ PROJECT DETAIL: Projeto não encontrado');
        setError('Projeto não encontrado');
        return;
      }

      console.log('✅ PROJECT DETAIL: Projeto carregado via Supabase:', projectData.name);
      setProject(projectData);
      
    } catch (error) {
      console.error('💥 PROJECT DETAIL: Erro inesperado:', error);
      setError('Erro inesperado ao carregar projeto');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]); // DEPENDÊNCIAS ESTÁVEIS - sem funções que podem mudar

  // Effect que carrega o projeto apenas quando projectId muda
  useEffect(() => {
    if (projectId) {
      console.log('🎯 PROJECT DETAIL: Carregando projeto:', projectId);
      fetchProject();
    }
  }, [projectId, fetchProject]);

  // Auto-sync com store - SEM dependência em 'project' para evitar loop
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const storeProject = getProjectById(projectId);
      if (storeProject) {
        console.log('🔄 PROJECT DETAIL: Sincronizando com store');
        setProject(storeProject);
        setError(null);
      }
    }
  }, [projects.length, projectId]); // SEM 'project' nas dependências

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
