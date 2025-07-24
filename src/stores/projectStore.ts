
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

interface ProjectState {
  // Estado dos projetos
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  lastRefresh: number;
  hasLoadedOnce: boolean; // NOVO: Flag para evitar múltiplas cargas
  
  // Ações assíncronas
  fetchProjects: () => Promise<void>;
  deleteProject: (projectId: string, isExternalDelete?: boolean) => Promise<boolean>;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  
  // Ações utilitárias
  clearError: () => void;
  forceRefresh: () => Promise<void>;
  getProjectById: (projectId: string) => Project | null;
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      projects: [],
      isLoading: false,
      error: null,
      lastRefresh: 0,
      hasLoadedOnce: false, // NOVO

      // Buscar projetos com cache inteligente
      fetchProjects: async () => {
        const state = get();
        
        // CACHE INTELIGENTE: Só carrega se nunca carregou ou se forçado
        if (state.hasLoadedOnce && state.projects.length > 0) {
          console.log('📦 STORE: Usando cache - projetos já carregados');
          return;
        }
        
        if (state.isLoading) {
          console.log('⏳ STORE: Já carregando, ignorando nova requisição');
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 STORE: Carregando projetos da API...');
          
          // Obter usuário atual
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          
          if (authError || !user) {
            throw new Error('Usuário não autenticado');
          }

          // Buscar projetos do usuário
          const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          set({ 
            projects: projects || [], 
            isLoading: false, 
            error: null,
            lastRefresh: Date.now(),
            hasLoadedOnce: true // IMPORTANTE: Marca como carregado
          });
          
          console.log('✅ STORE: Projetos carregados com sucesso:', projects?.length || 0);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar projetos';
          console.error('❌ STORE: Erro ao buscar projetos:', error);
          
          set({ 
            projects: [], 
            isLoading: false, 
            error: errorMessage,
            hasLoadedOnce: true // Marca como tentou carregar
          });
        }
      },

      // Deletar projeto mantendo integridade
      deleteProject: async (projectId: string, isExternalDelete = false) => {
        const currentProjects = get().projects;
        const projectToDelete = currentProjects.find(p => p.id === projectId);
        
        if (!projectToDelete) {
          console.error('❌ STORE: Projeto não encontrado para exclusão:', projectId);
          return false;
        }

        console.log('🔄 STORE: Iniciando exclusão atômica para:', projectToDelete.name);
        
        try {
          // Otimistic update
          set({ 
            projects: currentProjects.filter(p => p.id !== projectId),
            error: null 
          });

          // Se for exclusão externa (via realtime), não chamar API
          if (!isExternalDelete) {
            // Exclusão na base de dados
            const { error } = await supabase
              .from('projects')
              .delete()
              .eq('id', projectId);

            if (error) {
              throw error;
            }
          }

          console.log('✅ STORE: Exclusão concluída com sucesso');
          return true;
          
        } catch (error) {
          // Rollback em caso de falha
          console.error('💥 STORE: Falha na exclusão - executando rollback');
          set({ 
            projects: currentProjects,
            error: error instanceof Error ? error.message : 'Erro ao excluir projeto'
          });
          
          return false;
        }
      },

      // Adicionar novo projeto
      addProject: (project: Project) => {
        set(state => ({
          projects: [project, ...state.projects],
          error: null
        }));
        console.log('➕ STORE: Projeto adicionado:', project.name);
      },

      // Atualizar projeto existente
      updateProject: (projectId: string, updates: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(p => 
            p.id === projectId ? { ...p, ...updates } : p
          ),
          error: null
        }));
        console.log('📝 STORE: Projeto atualizado:', projectId);
      },

      // Limpar erro
      clearError: () => {
        set({ error: null });
      },

      // Forçar refresh completo
      forceRefresh: async () => {
        console.log('🔄 STORE: Forçando refresh completo...');
        set({ hasLoadedOnce: false }); // Reset flag
        await get().fetchProjects();
      },

      // Obter projeto por ID
      getProjectById: (projectId: string) => {
        return get().projects.find(p => p.id === projectId) || null;
      }
    }),
    {
      name: 'project-store'
    }
  )
);

// Hook para estatísticas sincronizadas
export const useProjectStats = () => {
  const projects = useProjectStore(state => state.projects);
  
  return {
    totalProjects: projects.length,
    processedProjects: projects.filter(p => p.analysis_data).length,
    recentProjects: projects.slice(0, 6),
  };
};
