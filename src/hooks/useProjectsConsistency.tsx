
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

  // Função centralizada para carregar projetos com logs detalhados
  const loadAllProjects = useCallback(async (): Promise<Project[]> => {
    console.log('🔍 CONSISTÊNCIA: Carregando todos os projetos', {
      authLoading,
      isAuthenticated,
      userId: user?.id,
      userEmail: user?.email
    });

    if (authLoading) {
      console.log('⏳ CONSISTÊNCIA: Auth ainda carregando');
      return [];
    }

    if (!isAuthenticated || !user) {
      console.log('🚫 CONSISTÊNCIA: Usuário não autenticado');
      setState(prev => ({ ...prev, allProjects: [], isLoading: false, error: null }));
      return [];
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Consulta direta e completa
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ CONSISTÊNCIA: Erro na consulta:', error);
        throw error;
      }

      console.log('✅ CONSISTÊNCIA: Projetos carregados:', {
        total: projects?.length || 0,
        userId: user.id,
        userEmail: user.email,
        projetos: projects?.map(p => ({ id: p.id, name: p.name, created_at: p.created_at }))
      });

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
      console.error('💥 CONSISTÊNCIA: Erro ao carregar projetos:', error);
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
      console.log('🔄 CONSISTÊNCIA: Iniciando carregamento inicial');
      loadAllProjects();
    }
  }, [authLoading, loadAllProjects]);

  // Função para forçar refresh
  const forceRefresh = useCallback(async () => {
    console.log('🔄 CONSISTÊNCIA: Refresh forçado');
    await loadAllProjects();
  }, [loadAllProjects]);

  // Função para verificar se projeto existe
  const projectExists = useCallback((projectId: string): boolean => {
    const exists = state.allProjects.some(p => p.id === projectId);
    console.log('🔍 CONSISTÊNCIA: Verificando existência do projeto:', { projectId, exists });
    return exists;
  }, [state.allProjects]);

  // Função para obter projeto específico
  const getProject = useCallback((projectId: string): Project | null => {
    const project = state.allProjects.find(p => p.id === projectId) || null;
    console.log('📋 CONSISTÊNCIA: Obtendo projeto:', { projectId, found: !!project });
    return project;
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
