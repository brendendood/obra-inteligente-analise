
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
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

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      console.log('1. Nenhum projectId fornecido na URL');
      setError('ID do projeto não fornecido');
      setIsLoading(false);
      return;
    }

    console.log('1. Iniciando busca de dados para o projeto ID:', projectId);
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('2. Fazendo busca no Supabase...');
      
      const { data: projectDataFromAPI, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (fetchError) {
        console.error('3. Erro do Supabase ao buscar dados:', fetchError);
        const errorMessage = `Erro ao carregar projeto: ${fetchError.message}`;
        setError(errorMessage);
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível carregar os dados do projeto. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (!projectDataFromAPI) {
        console.log('3. Nenhum projeto encontrado com o ID fornecido');
        setError('Projeto não encontrado');
        toast({
          title: "Projeto não encontrado",
          description: "O projeto que você está tentando acessar não foi encontrado.",
          variant: "destructive",
        });
        return;
      }

      console.log('2. Dados recebidos com sucesso:', projectDataFromAPI);
      setProject(projectDataFromAPI);
      
    } catch (error) {
      console.error('3. Erro inesperado durante a busca:', error);
      const errorMessage = 'Erro inesperado ao carregar projeto';
      setError(errorMessage);
      toast({
        title: "Erro ao carregar projeto",
        description: "Não foi possível carregar os dados do projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      console.log('4. Busca de dados finalizada. isLoading será definido como false.');
      setIsLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    console.log('useEffect disparado. ProjectId atual:', projectId);
    fetchProject();
  }, [fetchProject]);

  const value: ProjectDetailContextType = {
    project,
    isLoading,
    error,
    refetchProject: fetchProject
  };

  console.log('Provider renderizado. Estado atual:', {
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
