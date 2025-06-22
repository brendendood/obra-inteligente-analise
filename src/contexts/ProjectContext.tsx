
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  uploadProject: (file: File) => Promise<boolean>;
  setCurrentProject: (project: Project | null) => void;
  loadUserProjects: () => Promise<Project[]>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Carregar projeto do localStorage ao inicializar
  useEffect(() => {
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
  }, []);

  // Função para atualizar o projeto atual com persistência
  const setCurrentProject = useCallback((project: Project | null) => {
    setCurrentProjectState(project);
    if (project) {
      localStorage.setItem('currentProject', JSON.stringify(project));
      console.log('Projeto salvo no localStorage:', project);
    } else {
      localStorage.removeItem('currentProject');
      console.log('Projeto removido do localStorage');
    }
  }, []);

  const uploadProject = useCallback(async (file: File): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "❌ Erro de autenticação",
          description: "Faça login para enviar projetos.",
          variant: "destructive",
        });
        return false;
      }

      const response = await fetch(`https://mozqijzvtbuwuzgemzsm.supabase.co/functions/v1/upload-project`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload project');
      }

      const result = await response.json();
      
      if (result.success) {
        // Atualizar o projeto atual imediatamente
        setCurrentProject(result.project);
        
        toast({
          title: "🎉 Projeto analisado!",
          description: result.message,
        });
        
        console.log('Upload bem-sucedido, projeto definido:', result.project);
        return true;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Verificar se é erro de validação de PDF
      if (error instanceof Error && error.message.includes('Não identificamos elementos de projeto')) {
        toast({
          title: "📄 PDF não é um projeto técnico",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Erro no upload",
          description: "Não foi possível processar o projeto.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, setCurrentProject]);

  const loadUserProjects = useCallback(async (): Promise<Project[]> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Se não tiver projeto atual mas tiver projetos, pegar o mais recente
      if (!currentProject && data && data.length > 0) {
        setCurrentProject(data[0]);
        console.log('Projeto mais recente definido como atual:', data[0]);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }, [currentProject, setCurrentProject]);

  return (
    <ProjectContext.Provider value={{
      currentProject,
      isLoading,
      uploadProject,
      setCurrentProject,
      loadUserProjects,
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
