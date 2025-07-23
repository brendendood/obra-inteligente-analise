import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  name: string;
  created_at: string;
  total_area?: number;
  project_type?: string;
  analysis_data?: any;
  user_id: string;
}

interface SafeProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => Promise<void>;
  clearError: () => void;
  getProjectById: (projectId: string) => Project | undefined;
}

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

// Prevent rapid successive calls
let fetchPromise: Promise<void> | null = null;

export const useSafeProjectStore = create<SafeProjectState>()(
  devtools(
    (set, get) => ({
      projects: [],
      isLoading: false,
      error: null,
      lastFetch: null,

      fetchProjects: async () => {
        const state = get();
        
        // Prevent multiple simultaneous calls
        if (fetchPromise) {
          return fetchPromise;
        }
        
        // Check cache validity
        const now = Date.now();
        if (state.lastFetch && (now - state.lastFetch) < CACHE_TTL && state.projects.length > 0) {
          console.log('🔒 SAFE STORE: Using cached projects');
          return;
        }

        // Prevent loading if already loading
        if (state.isLoading) {
          console.log('🔒 SAFE STORE: Already loading, skipping');
          return;
        }

        console.log('🔒 SAFE STORE: Fetching projects...');
        
        fetchPromise = (async () => {
          try {
            set({ isLoading: true, error: null });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              throw new Error('User not authenticated');
            }

            const { data, error } = await supabase
              .from('projects')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            if (error) throw error;

            set({ 
              projects: data || [], 
              isLoading: false, 
              error: null,
              lastFetch: Date.now()
            });
            
            console.log('🔒 SAFE STORE: Projects loaded:', data?.length || 0);
          } catch (error) {
            console.error('🔒 SAFE STORE: Error fetching projects:', error);
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          } finally {
            fetchPromise = null;
          }
        })();

        return fetchPromise;
      },

      addProject: (project: Project) => {
        set(state => ({
          projects: [project, ...state.projects],
          lastFetch: Date.now() // Update cache timestamp
        }));
        console.log('🔒 SAFE STORE: Project added:', project.name);
      },

      updateProject: (projectId: string, updates: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(project =>
            project.id === projectId ? { ...project, ...updates } : project
          ),
          lastFetch: Date.now() // Update cache timestamp
        }));
        console.log('🔒 SAFE STORE: Project updated:', projectId);
      },

      deleteProject: async (projectId: string) => {
        try {
          console.log('🔒 SAFE STORE: Deleting project:', projectId);
          
          // Optimistic update
          const originalProjects = get().projects;
          set(state => ({
            projects: state.projects.filter(p => p.id !== projectId)
          }));

          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

          if (error) {
            // Rollback on error
            set({ projects: originalProjects });
            throw error;
          }

          console.log('🔒 SAFE STORE: Project deleted successfully');
        } catch (error) {
          console.error('🔒 SAFE STORE: Error deleting project:', error);
          set({ error: error instanceof Error ? error.message : 'Delete failed' });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      getProjectById: (projectId: string) => {
        return get().projects.find(project => project.id === projectId);
      },
    }),
    {
      name: 'safe-project-store',
    }
  )
);

// Selector hooks for better performance
export const useProjectCount = () => useSafeProjectStore(state => state.projects.length);
export const useProjectsLoading = () => useSafeProjectStore(state => state.isLoading);
export const useProjectsError = () => useSafeProjectStore(state => state.error);

// Memoized selector for project stats
export const useProjectStats = () => {
  return useSafeProjectStore(state => {
    const projects = state.projects;
    
    if (projects.length === 0) {
      return {
        total: 0,
        recent: 0,
        processed: 0,
        totalArea: 0
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let recent = 0;
    let processed = 0;
    let totalArea = 0;

    projects.forEach(project => {
      totalArea += project.total_area || 0;
      
      if (project.analysis_data && Object.keys(project.analysis_data).length > 0) {
        processed++;
      }
      
      const createdAt = new Date(project.created_at);
      if (createdAt >= weekAgo) recent++;
    });

    return {
      total: projects.length,
      recent,
      processed,
      totalArea: Math.round(totalArea)
    };
  });
};