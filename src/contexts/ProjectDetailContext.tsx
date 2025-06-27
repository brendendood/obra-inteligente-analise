
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

  const fetchProject = async () => {
    if (!projectId) {
      setError('ID do projeto não fornecido');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('ProjectDetailProvider: Carregando projeto', projectId);
      
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (fetchError) {
        console.error('ProjectDetailProvider: Erro ao buscar projeto:', fetchError);
        setError(`Erro ao carregar projeto: ${fetchError.message}`);
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível carregar os dados do projeto. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        setError('Projeto não encontrado');
        toast({
          title: "Projeto não encontrado",
          description: "O projeto que você está tentando acessar não foi encontrado.",
          variant: "destructive",
        });
        return;
      }

      console.log('ProjectDetailProvider: Projeto carregado com sucesso:', data.name);
      setProject(data);
    } catch (error) {
      console.error('ProjectDetailProvider: Erro inesperado:', error);
      setError('Erro inesperado ao carregar projeto');
      toast({
        title: "Erro ao carregar projeto",
        description: "Não foi possível carregar os dados do projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

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
