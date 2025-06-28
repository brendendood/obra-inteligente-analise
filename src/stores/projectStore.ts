
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

interface ProjectState {
  // Estado dos projetos
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  lastRefresh: number;
  
  // Ações assíncronas
  fetchProjects: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<boolean>;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  
  // Ações utilitárias
  clearError: () => void;
  forceRefresh: () => Promise<void>;
  getProjectById: (projectId: string) => Project | null;
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        projects: [],
        isLoading: false,
        error: null,
        lastRefresh: 0,

        // Buscar projetos da API
        fetchProjects: async () => {
          set({ isLoading: true, error: null });
          
          try {
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
              lastRefresh: Date.now()
            });
            
            console.log('✅ STORE: Projetos carregados com sucesso:', projects?.length || 0);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar projetos';
            console.error('❌ STORE: Erro ao buscar projetos:', error);
            
            set({ 
              projects: [], 
              isLoading: false, 
              error: errorMessage 
            });
          }
        },

        // Deletar projeto com integridade atômica
        deleteProject: async (projectId: string) => {
          const currentProjects = get().projects;
          const projectToDelete = currentProjects.find(p => p.id === projectId);
          
          if (!projectToDelete) {
            console.error('❌ STORE: Projeto não encontrado para exclusão:', projectId);
            return false;
          }

          console.log('🔄 STORE: Iniciando exclusão atômica para:', projectToDelete.name);
          
          try {
            // FASE 1: Otimistic update - remove da interface imediatamente
            console.log('📱 STORE: Removendo da interface (Fase 1)...');
            set({ 
              projects: currentProjects.filter(p => p.id !== projectId),
              error: null 
            });

            // FASE 2: Exclusão permanente da base de dados
            console.log('🗄️ STORE: Removendo da base de dados (Fase 2)...');
            const { error } = await supabase
              .from('projects')
              .delete()
              .eq('id', projectId);

            if (error) {
              throw error;
            }

            // FASE 3: Confirmação de integridade
            console.log('✅ STORE: Exclusão atômica concluída com sucesso');
            console.log('📊 STORE: Dashboard será recalculado automaticamente');
            
            return true;
            
          } catch (error) {
            // ROLLBACK: Reverter otimistic update em caso de falha
            console.error('💥 STORE: Falha na exclusão - executando rollback');
            set({ 
              projects: currentProjects,
              error: error instanceof Error ? error.message : 'Erro ao excluir projeto'
            });
            
            console.error('❌ STORE: Integridade preservada após falha:', error);
            return false;
          }
        },

        // Adicionar novo projeto ao estado
        addProject: (project: Project) => {
          set(state => ({
            projects: [project, ...state.projects],
            error: null
          }));
          console.log('➕ STORE: Projeto adicionado ao estado:', project.name);
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
          await get().fetchProjects();
        },

        // Obter projeto por ID
        getProjectById: (projectId: string) => {
          return get().projects.find(p => p.id === projectId) || null;
        }
      }),
      {
        name: 'project-store',
        partialize: (state) => ({ 
          projects: state.projects,
          lastRefresh: state.lastRefresh 
        }),
      }
    ),
    {
      name: 'project-store'
    }
  )
);

// Hook para estatísticas sincronizadas com exclusões
export const useProjectStats = () => {
  const projects = useProjectStore(state => state.projects);
  
  return {
    totalProjects: projects.length,
    processedProjects: projects.filter(p => p.analysis_data).length,
    recentProjects: projects.slice(0, 6),
  };
};
