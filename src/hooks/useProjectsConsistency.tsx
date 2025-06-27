
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/project';

interface ProjectsConsistencyState {
  allProjects: Project[];
  isLoading: boolean;
  lastRefresh: number;
  error: string | null;
}

export const useProjectsConsistency = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<ProjectsConsistencyState>({
    allProjects: [],
    isLoading: true,
    lastRefresh: 0,
    error: null
  });

  // Função centralizada para carregar projetos
  const loadAllProjects = useCallback(async (): Promise<Project[]> => {
    if (authLoading) {
      return [];
    }

    if (!isAuthenticated || !user) {
      setState(prev => ({ ...prev, allProjects: [], isLoading: false, error: null }));
      return [];
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const validProjects = projects || [];
      setState(prev => ({
        ...prev,
        allProjects: validProjects,
        isLoading: false,
        lastRefresh: Date.now(),
        error: null
      }));

      return validProjects;
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState(prev => ({
        ...prev,
        allProjects: [],
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
  }, [user?.id, isAuthenticated, authLoading, toast]);

  // Carregar projetos quando auth estiver pronto
  useEffect(() => {
    if (!authLoading) {
      loadAllProjects();
    }
  }, [authLoading, loadAllProjects]);

  // Função para forçar refresh
  const forceRefresh = useCallback(async () => {
    await loadAllProjects();
  }, [loadAllProjects]);

  // Função para verificar se projeto existe
  const projectExists = useCallback((projectId: string): boolean => {
    return state.allProjects.some(p => p.id === projectId);
  }, [state.allProjects]);

  // Função para obter projeto específico
  const getProject = useCallback((projectId: string): Project | null => {
    return state.allProjects.find(p => p.id === projectId) || null;
  }, [state.allProjects]);

  return {
    projects: state.allProjects,
    isLoading: state.isLoading,
    error: state.error,
    lastRefresh: state.lastRefresh,
    loadAllProjects,
    forceRefresh,
    projectExists,
    getProject
  };
};
