
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
  hasFetched: boolean;
  
  // Optimized actions
  fetchProjects: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<boolean>;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  clearError: () => void;
  getProjectById: (projectId: string) => Project | null;
}

// Cache configuration - less aggressive in development for better HMR
const CACHE_TTL = import.meta.env.DEV ? 30 * 1000 : 5 * 60 * 1000; // 30s in dev, 5min in prod
const CACHE_KEY = 'madenai_projects_cache';

// Cache helpers
const getCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
};

const setCache = (data: Project[]) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache projects:', error);
  }
};

export const useOptimizedProjectStore = create<ProjectState>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        projects: [],
        isLoading: false,
        error: null,
        lastFetch: 0,
        hasFetched: false,

        fetchProjects: async () => {
          const state = get();
          
          // Check if already loading - reduce cooldown for better UX
          if (state.isLoading) return;
          const cooldown = import.meta.env.DEV ? 2000 : 10000; // 2s in dev, 10s in prod 
          if (state.hasFetched && Date.now() - state.lastFetch < cooldown) {
            console.log('📦 STORE: Cache ainda válido, usando dados existentes');
            return;
          }
          
          // Try cache first
          const cached = getCache();
          if (cached && cached.length > 0) {
            set({ 
              projects: cached, 
              hasFetched: true, 
              lastFetch: Date.now() 
            });
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
              throw new Error('User not authenticated');
            }

            const { data: projects, error } = await supabase
              .from('projects')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            if (error) throw error;

            const projectList = projects || [];
            
            set({ 
              projects: projectList,
              isLoading: false,
              error: null,
              lastFetch: Date.now(),
              hasFetched: true
            });

            // Cache the results
            setCache(projectList);
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
            set({ 
              projects: [],
              isLoading: false,
              error: errorMessage,
              hasFetched: true
            });
          }
        },

        deleteProject: async (projectId: string) => {
          const currentProjects = get().projects;
          const projectToDelete = currentProjects.find(p => p.id === projectId);
          
          if (!projectToDelete) {
            console.error('❌ STORE: Projeto não encontrado para exclusão:', projectId);
            return false;
          }

          console.log('🔄 STORE: Iniciando exclusão FORÇADA do projeto:', projectToDelete.name);

          try {
            // Optimistic update
            const newProjects = currentProjects.filter(p => p.id !== projectId);
            set({ projects: newProjects, error: null });
            setCache(newProjects);

            // EXCLUSÃO FORÇADA - Primeiro remover dados relacionados
            console.log('🗑️ STORE: Removendo dados relacionados...');
            
            // Remover análises relacionadas
            await supabase
              .from('project_analyses')
              .delete()
              .eq('project_id', projectId);
            
            // Remover conversas relacionadas
            await supabase
              .from('project_conversations')
              .delete()
              .eq('project_id', projectId);
            
            // Remover documentos relacionados
            await supabase
              .from('project_documents')
              .delete()
              .eq('project_id', projectId);

            // Finalmente, remover o projeto principal
            console.log('🗑️ STORE: Removendo projeto principal...');
            const { error } = await supabase
              .from('projects')
              .delete()
              .eq('id', projectId);

            if (error) {
              console.error('❌ STORE: Erro na exclusão do projeto:', error);
              throw error;
            }

            console.log('✅ STORE: Projeto excluído com sucesso (inclusindo dados relacionados)');
            return true;
            
          } catch (error) {
            console.error('💥 STORE: Falha na exclusão - executando rollback:', error);
            // Rollback
            set({ 
              projects: currentProjects,
              error: error instanceof Error ? error.message : 'Falha ao excluir projeto'
            });
            setCache(currentProjects);
            return false;
          }
        },

        addProject: (project: Project) => {
          const newProjects = [project, ...get().projects];
          set({ projects: newProjects, error: null });
          setCache(newProjects);
        },

        updateProject: (projectId: string, updates: Partial<Project>) => {
          const newProjects = get().projects.map(p => 
            p.id === projectId ? { ...p, ...updates } : p
          );
          set({ projects: newProjects, error: null });
          setCache(newProjects);
        },

        clearError: () => set({ error: null }),

        getProjectById: (projectId: string) => {
          return get().projects.find(p => p.id === projectId) || null;
        }
      })
    ),
    { name: 'optimized-project-store' }
  )
);

// Memoized selectors for better performance
export const useProjectStats = () => {
  return useOptimizedProjectStore((state) => ({
    totalProjects: state.projects.length,
    processedProjects: state.projects.filter(p => p.analysis_data).length,
    recentProjects: state.projects.slice(0, 6),
  }));
};
