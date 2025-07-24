
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
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
  const { getProjectById, fetchProjects, projects } = useUnifiedProjectStore();

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setError('ID do projeto não fornecido');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Busca simples: primeiro no cache, depois refresh se necessário
      let foundProject = getProjectById(projectId);
      
      if (!foundProject) {
        console.log('🔄 PROJECT DETAIL: Projeto não encontrado no cache, atualizando...');
        await fetchProjects();
        foundProject = getProjectById(projectId);
      }

      if (!foundProject) {
        setError('Projeto não encontrado');
        toast({
          title: "Projeto não encontrado",
          description: "Verifique se o projeto ainda existe.",
          variant: "destructive",
        });
        return;
      }

      setProject(foundProject);
      
    } catch (error) {
      console.error('❌ PROJECT DETAIL: Erro ao carregar projeto:', error);
      setError('Erro ao carregar projeto');
      toast({
        title: "Erro ao carregar projeto",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast, getProjectById, fetchProjects]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Auto-sync quando o ProjectStore é atualizado
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const updatedProject = getProjectById(projectId);
      if (updatedProject && (!project || project.updated_at !== updatedProject.updated_at)) {
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
