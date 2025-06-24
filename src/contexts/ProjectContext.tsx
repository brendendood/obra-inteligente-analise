
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Project {
  id: string;
  name: string;
  file_path: string;
  file_size?: number;
  extracted_text?: string;
  analysis_data?: any;
  project_type?: string;
  total_area?: number;
  created_at: string;
  updated_at: string;
}

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  uploadProject: (file: File, projectName: string) => Promise<boolean>;
  setCurrentProject: (project: Project | null) => void;
  loadUserProjects: () => Promise<Project[]>;
  requiresAuth: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Carregar projeto do localStorage ao inicializar
  useEffect(() => {
    if (isAuthenticated) {
      const savedProject = localStorage.getItem('currentProject');
      if (savedProject) {
        try {
          const project = JSON.parse(savedProject);
          setCurrentProjectState(project);
          console.log('Projeto carregado do localStorage:', project);
        } catch (error) {
          console.error('Erro ao carregar projeto do localStorage:', error);
          localStorage.removeItem('currentProject');
        }
      }
      // Load user projects when authenticated
      loadUserProjects();
    } else {
      // Limpar projeto se não estiver autenticado
      setCurrentProjectState(null);
      setProjects([]);
      localStorage.removeItem('currentProject');
    }
  }, [isAuthenticated]);

  // Função para atualizar o projeto atual com persistência
  const setCurrentProject = useCallback((project: Project | null) => {
    setCurrentProjectState(project);
    if (project && isAuthenticated) {
      localStorage.setItem('currentProject', JSON.stringify(project));
      console.log('Projeto salvo no localStorage:', project);
    } else {
      localStorage.removeItem('currentProject');
      console.log('Projeto removido do localStorage');
    }
  }, [isAuthenticated]);

  const uploadProject = useCallback(async (file: File, projectName: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "❌ Acesso necessário",
        description: "Faça login para enviar projetos.",
        variant: "destructive",
      });
      return false;
    }

    if (!projectName.trim()) {
      toast({
        title: "❌ Nome obrigatório",
        description: "Informe um nome para o projeto.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;

      console.log('Enviando arquivo:', file.name, 'Como projeto:', projectName, 'Usuário:', user.email);

      // Upload do arquivo para o storage
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      // Chamar edge function para processar metadados
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada. Faça login novamente.');
      }

      const { data, error: processError } = await supabase.functions
        .invoke('upload-project', {
          body: {
            fileName,
            originalName: file.name,
            projectName: projectName.trim(),
            fileSize: file.size
          }
        });

      if (processError) {
        console.error('Edge function error:', processError);
        throw new Error(`Erro no processamento: ${processError.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro no processamento');
      }
      
      // Atualizar o projeto atual imediatamente
      if (data.project) {
        setCurrentProject(data.project);
        // Add to projects list
        setProjects(prev => [data.project, ...prev.filter(p => p.id !== data.project.id)]);
      }
      
      toast({
        title: data.analysis?.isRealProject ? "🎉 Projeto técnico analisado!" : "📄 PDF processado!",
        description: data.message,
      });
      
      console.log('Upload bem-sucedido, projeto definido:', data.project);
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        toast({
          title: "🔐 Acesso necessário",
          description: "Faça login para enviar projetos.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Erro no upload",
          description: error instanceof Error ? error.message : "Não foi possível processar o arquivo.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, setCurrentProject, isAuthenticated, user]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, não carregando projetos');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const projectsData = data || [];
      setProjects(projectsData);
      
      // Se não tiver projeto atual mas tiver projetos, pegar o mais recente
      if (!currentProject && projectsData && projectsData.length > 0) {
        setCurrentProject(projectsData[0]);
        console.log('Projeto mais recente definido como atual:', projectsData[0]);
      }
      
      return projectsData;
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }, [currentProject, setCurrentProject, isAuthenticated]);

  return (
    <ProjectContext.Provider value={{
      currentProject,
      projects,
      isLoading,
      uploadProject,
      setCurrentProject,
      loadUserProjects,
      requiresAuth: !isAuthenticated,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
