
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
  isLoading: boolean;
  uploadProject: (file: File, projectName: string) => Promise<boolean>;
  setCurrentProject: (project: Project | null) => void;
  loadUserProjects: () => Promise<Project[]>;
  clearAllProjects: () => void;
  requiresAuth: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Função para limpar todos os projetos do estado local
  const clearAllProjects = useCallback(() => {
    console.log('Limpando todos os projetos do estado local');
    setCurrentProjectState(null);
    localStorage.removeItem('currentProject');
  }, []);

  // Carregar projeto do localStorage ao inicializar, mas validar se ainda existe no DB
  useEffect(() => {
    const validateAndLoadProject = async () => {
      if (isAuthenticated) {
        const savedProject = localStorage.getItem('currentProject');
        if (savedProject) {
          try {
            const project = JSON.parse(savedProject);
            console.log('Verificando se projeto do localStorage ainda existe no DB:', project.id);
            
            // Verificar se o projeto ainda existe no banco
            const { data, error } = await supabase
              .from('projects')
              .select('*')
              .eq('id', project.id)
              .eq('user_id', user?.id)
              .maybeSingle();
            
            if (error) {
              console.error('Erro ao verificar projeto:', error);
              clearAllProjects();
              return;
            }
            
            if (data) {
              console.log('Projeto validado e carregado do localStorage:', data);
              setCurrentProjectState(data);
            } else {
              console.log('Projeto do localStorage não existe mais no DB, limpando...');
              clearAllProjects();
            }
          } catch (error) {
            console.error('Erro ao validar projeto do localStorage:', error);
            clearAllProjects();
          }
        }
      } else {
        clearAllProjects();
      }
    };

    if (user) {
      validateAndLoadProject();
    }
  }, [isAuthenticated, user, clearAllProjects]);

  // Função para atualizar o projeto atual com validação
  const setCurrentProject = useCallback((project: Project | null) => {
    console.log('Atualizando projeto atual:', project);
    setCurrentProjectState(project);
    if (project && isAuthenticated) {
      localStorage.setItem('currentProject', JSON.stringify(project));
      console.log('Projeto salvo no localStorage:', project.name);
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
      
      // Atualizar o projeto atual com dados frescos do servidor
      if (data.project) {
        console.log('Definindo novo projeto como atual:', data.project);
        setCurrentProject(data.project);
      }
      
      toast({
        title: data.analysis?.isRealProject ? "🎉 Projeto técnico analisado!" : "📄 PDF processado!",
        description: data.message,
      });
      
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
    if (!isAuthenticated || !user) {
      console.log('Usuário não autenticado, limpando projetos locais');
      clearAllProjects();
      return [];
    }

    try {
      console.log('Carregando projetos do usuário:', user.email);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar projetos:', error);
        throw error;
      }
      
      console.log('Projetos carregados do DB:', data?.length || 0);
      
      // Se não há projetos no DB, limpar estado local
      if (!data || data.length === 0) {
        console.log('Nenhum projeto encontrado no DB, limpando estado local');
        clearAllProjects();
        return [];
      }
      
      // Se há projetos, mas não temos projeto atual, definir o mais recente
      if (!currentProject && data.length > 0) {
        console.log('Definindo projeto mais recente como atual:', data[0].name);
        setCurrentProject(data[0]);
      }
      
      // Se temos projeto atual, verificar se ainda existe nos dados carregados
      if (currentProject) {
        const projectStillExists = data.find(p => p.id === currentProject.id);
        if (!projectStillExists) {
          console.log('Projeto atual não existe mais, limpando...');
          clearAllProjects();
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error loading projects:', error);
      clearAllProjects();
      return [];
    }
  }, [currentProject, setCurrentProject, isAuthenticated, user, clearAllProjects]);

  return (
    <ProjectContext.Provider value={{
      currentProject,
      isLoading,
      uploadProject,
      setCurrentProject,
      loadUserProjects,
      clearAllProjects,
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
