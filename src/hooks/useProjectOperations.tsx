
import { useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNotificationControl } from '@/hooks/useNotificationControl';
import { Project } from '@/types/project';

export const useProjectOperations = (
  debugLog: (action: string, data?: any) => void,
  updateProjectsState: (updates: any) => void,
  setCurrentProject: (project: Project | null) => void,
  getProjectById: (id: string) => Project | null,
  state: any
) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showControlledError, showControlledSuccess } = useNotificationControl();
  const loadingRef = useRef(false);
  const lastLoadTime = useRef(0);

  // Carregar todos os projetos com controle de duplicação
  const loadProjects = useCallback(async (force = false): Promise<Project[]> => {
    if (authLoading) return [];
    
    if (!isAuthenticated || !user) {
      debugLog('❌ Não autenticado, limpando projetos');
      updateProjectsState({ 
        projects: [], 
        currentProject: null, 
        isLoading: false,
        error: null 
      });
      return [];
    }

    const now = Date.now();
    
    // Evitar múltiplas chamadas simultâneas
    if (loadingRef.current && !force) {
      debugLog('⏸️ Carregamento já em andamento');
      return state.projects;
    }

    // Throttle: evitar muitas chamadas em sequência (mínimo 2 segundos)
    if (!force && (now - lastLoadTime.current) < 2000) {
      debugLog('⏸️ Throttle ativo, usando cache');
      return state.projects;
    }

    try {
      loadingRef.current = true;
      lastLoadTime.current = now;
      
      updateProjectsState({ isLoading: true, error: null });
      debugLog('📥 Carregando projetos do usuário', { userId: user.id });

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validProjects = projects || [];
      debugLog('✅ Projetos carregados', { count: validProjects.length });

      updateProjectsState({
        projects: validProjects,
        isLoading: false,
        lastSync: now,
        error: null
      });

      return validProjects;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      debugLog('❌ Erro ao carregar projetos', { error: errorMessage });
      
      updateProjectsState({
        projects: state.projects, // Manter projetos existentes em caso de erro
        isLoading: false,
        error: errorMessage
      });

      // Usar notificação controlada
      showControlledError(
        "Erro ao carregar projetos",
        "Houve um problema ao sincronizar os projetos. Tentando novamente...",
        'load-projects-error'
      );

      return state.projects; // Retornar projetos existentes
    } finally {
      loadingRef.current = false;
    }
  }, [user?.id, isAuthenticated, authLoading, state.projects, debugLog, showControlledError, updateProjectsState]);

  // Restaurar projeto salvo sem notificação
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

  return {
    loadProjects,
    restoreSavedProject
  };
};
