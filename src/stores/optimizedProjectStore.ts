
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

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
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
          
          // Check if already loading or recently fetched
          if (state.isLoading) return;
          if (state.hasFetched && Date.now() - state.lastFetch < 30000) return; // 30s cooldown
          
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
