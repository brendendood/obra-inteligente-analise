
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
  
  // Debug info
  debugInfo: {
    lastCacheCheck: number;
    lastAuthCheck: number;
    lastQueryTime: number;
    retryCount: number;
  };
  
  // Optimized actions
  fetchProjects: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<boolean>;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  clearError: () => void;
  clearCache: () => void;
  forceRefresh: () => Promise<void>;
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
        debugInfo: {
          lastCacheCheck: 0,
          lastAuthCheck: 0,
          lastQueryTime: 0,
          retryCount: 0,
        },

        fetchProjects: async () => {
          const state = get();
          const timestamp = new Date().toISOString();
          
          console.log(`🔄 [${timestamp}] OPTIMIZED STORE: Iniciando fetchProjects...`);
          console.log(`📊 [${timestamp}] Estado atual:`, {
            isLoading: state.isLoading,
            projectsCount: state.projects.length,
            hasFetched: state.hasFetched,
            lastFetch: new Date(state.lastFetch).toISOString(),
            error: state.error
          });
          
          // Check if already loading or recently fetched - reduce cooldown in dev
          if (state.isLoading) {
            console.log(`⏸️ [${timestamp}] OPTIMIZED STORE: Já está carregando, cancelando...`);
            return;
          }
          
          const cooldown = import.meta.env.DEV ? 5000 : 30000; // 5s in dev, 30s in prod
          if (state.hasFetched && Date.now() - state.lastFetch < cooldown) {
            console.log(`⏱️ [${timestamp}] OPTIMIZED STORE: Cooldown ativo, cancelando...`);
            return;
          }
          
          // Try cache first
          const cached = getCache();
          if (cached && cached.length > 0) {
            console.log(`💾 [${timestamp}] OPTIMIZED STORE: Usando cache com ${cached.length} projetos`);
            set({ 
              projects: cached, 
              hasFetched: true, 
              lastFetch: Date.now() 
            });
            return;
          }

          console.log(`🌐 [${timestamp}] OPTIMIZED STORE: Cache vazio, buscando do servidor...`);
          set({ isLoading: true, error: null });

          try {
            console.log(`🔐 [${timestamp}] OPTIMIZED STORE: Verificando autenticação...`);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
              throw new Error(`Usuário não autenticado: ${authError?.message || 'User is null'}`);
            }

            console.log(`✅ [${timestamp}] OPTIMIZED STORE: Usuário autenticado: ${user.id}`);
            
            console.log(`📡 [${timestamp}] OPTIMIZED STORE: Buscando projetos do usuário...`);
            const { data: projects, error } = await supabase
              .from('projects')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            if (error) {
              console.error(`❌ [${timestamp}] OPTIMIZED STORE: Erro na query:`, error);
              throw error;
            }

            const projectList = projects || [];
            console.log(`✅ [${timestamp}] OPTIMIZED STORE: Projetos carregados com sucesso:`, {
              count: projectList.length,
              projects: projectList.map(p => ({ id: p.id, name: p.name, created_at: p.created_at }))
            });
            
            set({ 
              projects: projectList,
              isLoading: false,
              error: null,
              lastFetch: Date.now(),
              hasFetched: true
            });

            // Cache the results
            setCache(projectList);
            console.log(`💾 [${timestamp}] OPTIMIZED STORE: Projetos salvos em cache`);
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
            console.error(`❌ [${timestamp}] OPTIMIZED STORE: Erro completo:`, {
              error: errorMessage,
              fullError: error,
              stack: error instanceof Error ? error.stack : 'No stack'
            });
            
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
          
          if (!projectToDelete) return false;

          try {
            // Optimistic update
            const newProjects = currentProjects.filter(p => p.id !== projectId);
            set({ projects: newProjects, error: null });
            setCache(newProjects); // Update cache immediately

            const { error } = await supabase
              .from('projects')
              .delete()
              .eq('id', projectId);

            if (error) throw error;
            return true;
            
          } catch (error) {
            // Rollback
            set({ 
              projects: currentProjects,
              error: error instanceof Error ? error.message : 'Delete failed'
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

        clearCache: () => {
          console.log('🗑️ OPTIMIZED STORE: Limpando cache...');
          localStorage.removeItem(CACHE_KEY);
          set({ 
            projects: [], 
            hasFetched: false, 
            lastFetch: 0,
            debugInfo: {
              lastCacheCheck: Date.now(),
              lastAuthCheck: 0,
              lastQueryTime: 0,
              retryCount: 0,
            }
          });
        },

        forceRefresh: async () => {
          console.log('🔄 OPTIMIZED STORE: Forçando refresh completo...');
          localStorage.removeItem(CACHE_KEY);
          set({ 
            projects: [], 
            hasFetched: false, 
            lastFetch: 0, 
            isLoading: false,
            debugInfo: {
              ...get().debugInfo,
              retryCount: get().debugInfo.retryCount + 1,
            }
          });
          await get().fetchProjects();
        },

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
