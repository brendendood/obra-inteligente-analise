
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
  
  // USAR getState() PARA EVITAR DEPENDÊNCIAS INSTÁVEIS
  const store = useOptimizedProjectStore();

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
      
      // Usar getState() direto para evitar dependências instáveis
      const state = useOptimizedProjectStore.getState();
      const cachedProject = state.projects.find(p => p.id === projectId);
      
      if (cachedProject) {
        console.log('✅ PROJECT DETAIL: Projeto encontrado:', cachedProject.name);
        setProject(cachedProject);
        setIsLoading(false);
        return;
      }

      // Se não encontrado, fazer refresh uma vez
      console.log('🔄 PROJECT DETAIL: Atualizando dados...');
      await state.fetchProjects();
      
      const newState = useOptimizedProjectStore.getState();
      const refreshedProject = newState.projects.find(p => p.id === projectId);
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
  }, [projectId]); // APENAS projectId como dependência

  // Effect que carrega o projeto APENAS quando projectId muda
  useEffect(() => {
    if (projectId) {
      console.log('🎯 PROJECT DETAIL: Carregando projeto:', projectId);
      fetchProject();
    }
  }, [projectId]); // SEM fetchProject para evitar loop

  // REMOVER completamente o auto-sync que causa loops
  // useEffect(() => {
  //   if (projectId && projects.length > 0) {
  //     const storeProject = getProjectById(projectId);
  //     if (storeProject) {
  //       setProject(storeProject);
  //       setError(null);
  //     }
  //   }
  // }, [projects.length, projectId]);

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
    projectName: project?.name
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
