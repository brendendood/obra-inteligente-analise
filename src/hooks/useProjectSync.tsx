
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/project';

interface ProjectSyncState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  lastSync: number;
  error: string | null;
}

export const useProjectSync = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<ProjectSyncState>({
    projects: [],
    currentProject: null,
    isLoading: true,
    lastSync: 0,
    error: null
  });

  // Debug logger
  const debugLog = useCallback((action: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 PROJECT_SYNC [${new Date().toISOString()}]: ${action}`, data);
    }
  }, []);

  // Carregar todos os projetos
  const loadProjects = useCallback(async (force = false): Promise<Project[]> => {
    if (authLoading) return [];
    
    if (!isAuthenticated || !user) {
      debugLog('❌ Não autenticado, limpando projetos');
      setState(prev => ({ 
        ...prev, 
        projects: [], 
        currentProject: null, 
        isLoading: false,
        error: null 
      }));
      return [];
    }

    // Evitar múltiplas chamadas simultâneas
    const now = Date.now();
    if (!force && state.isLoading && (now - state.lastSync) < 1000) {
      debugLog('⏸️ Carregamento já em andamento');
      return state.projects;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      debugLog('📥 Carregando projetos do usuário', { userId: user.id });

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validProjects = projects || [];
      debugLog('✅ Projetos carregados', { count: validProjects.length });

      setState(prev => ({
        ...prev,
        projects: validProjects,
        isLoading: false,
        lastSync: now,
        error: null
      }));

      return validProjects;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      debugLog('❌ Erro ao carregar projetos', { error: errorMessage });
      
      setState(prev => ({
        ...prev,
        projects: [],
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "❌ Erro ao carregar projetos",
        description: errorMessage,
        variant: "destructive"
      });

      return [];
    }
  }, [user?.id, isAuthenticated, authLoading, state.isLoading, state.lastSync, debugLog, toast]);

  // Definir projeto atual
  const setCurrentProject = useCallback((project: Project | null) => {
    debugLog('📌 Definindo projeto atual', { 
      projectId: project?.id, 
      projectName: project?.name 
    });

    setState(prev => ({ ...prev, currentProject: project }));

    // Salvar no localStorage para persistência
    if (project) {
      localStorage.setItem('maden_current_project', JSON.stringify({
        id: project.id,
        name: project.name,
        timestamp: Date.now()
      }));
    } else {
      localStorage.removeItem('maden_current_project');
    }
  }, [debugLog]);

  // Obter projeto por ID
  const getProjectById = useCallback((projectId: string): Project | null => {
    const project = state.projects.find(p => p.id === projectId);
    debugLog('🔍 Buscando projeto por ID', { projectId, found: !!project });
    return project || null;
  }, [state.projects, debugLog]);

  // Verificar se projeto existe
  const projectExists = useCallback((projectId: string): boolean => {
    const exists = state.projects.some(p => p.id === projectId);
    debugLog('✅ Verificando existência do projeto', { projectId, exists });
    return exists;
  }, [state.projects, debugLog]);

  // Restaurar projeto salvo
  const restoreSavedProject = useCallback(() => {
    if (!isAuthenticated) return;

    try {
      const saved = localStorage.getItem('maden_current_project');
      if (saved) {
        const { id, timestamp } = JSON.parse(saved);
        
        // Verificar se não é muito antigo (mais de 1 dia)
        if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('maden_current_project');
          return;
        }

        const project = getProjectById(id);
        if (project) {
          debugLog('🔄 Restaurando projeto salvo', { projectId: id });
          setCurrentProject(project);
        } else {
          debugLog('❌ Projeto salvo não encontrado, removendo');
          localStorage.removeItem('maden_current_project');
        }
      }
    } catch (error) {
      debugLog('❌ Erro ao restaurar projeto salvo', error);
      localStorage.removeItem('maden_current_project');
    }
  }, [isAuthenticated, getProjectById, setCurrentProject, debugLog]);

  // Carregar projetos quando auth estiver pronto
  useEffect(() => {
    if (!authLoading) {
      loadProjects();
    }
  }, [authLoading, loadProjects]);

  // Restaurar projeto salvo quando projetos carregarem
  useEffect(() => {
    if (state.projects.length > 0 && !state.currentProject) {
      restoreSavedProject();
    }
  }, [state.projects.length, state.currentProject, restoreSavedProject]);

  // Auto-refresh periódico (a cada 30 segundos)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      debugLog('🔄 Auto-refresh dos projetos');
      loadProjects();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, loadProjects, debugLog]);

  return {
    // Estado
    projects: state.projects,
    currentProject: state.currentProject,
    isLoading: state.isLoading,
    error: state.error,
    lastSync: state.lastSync,
    
    // Ações
    loadProjects,
    setCurrentProject,
    getProjectById,
    projectExists,
    
    // Utilities
    forceRefresh: () => loadProjects(true),
    clearCurrentProject: () => setCurrentProject(null)
  };
};
