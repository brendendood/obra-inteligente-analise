import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

interface UnifiedProjectState {
  // Estado dos projetos
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  lastRefresh: number;
  hasLoadedOnce: boolean;
  
  // Debug info
  debugInfo: {
    lastCacheCheck: number;
    lastAuthCheck: number;
    lastQueryTime: number;
    retryCount: number;
  };
  
  // Ações principais
  fetchProjects: () => Promise<void>;
  deleteProject: (projectId: string, isExternalDelete?: boolean) => Promise<boolean>;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  
  // Utilitárias
  clearError: () => void;
  clearCache: () => void;
  forceRefresh: () => Promise<void>;
  getProjectById: (projectId: string) => Project | null;
}

// Cache configuration - otimizado para desenvolvimento
const CACHE_TTL = import.meta.env.DEV ? 30 * 1000 : 5 * 60 * 1000; // 30s dev, 5min prod
const CACHE_KEY = 'madeai_projects_unified_cache';

// Cache helpers robustos
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
    console.warn('⚠️ UNIFIED STORE: Falha ao salvar cache:', error);
  }
};

export const useUnifiedProjectStore = create<UnifiedProjectState>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        // Estado inicial
        projects: [],
        isLoading: false,
        error: null,
        lastRefresh: 0,
        hasLoadedOnce: false,
        debugInfo: {
          lastCacheCheck: 0,
          lastAuthCheck: 0,
          lastQueryTime: 0,
          retryCount: 0,
        },

        // Fetch otimizado com cache inteligente
        fetchProjects: async () => {
          const state = get();
          const timestamp = new Date().toISOString();
          
          console.log(`🔄 [${timestamp}] UNIFIED STORE: Iniciando fetchProjects...`);
          
          // Prevenção de múltiplas cargas simultâneas
          if (state.isLoading) {
            console.log(`⏸️ [${timestamp}] UNIFIED STORE: Já está carregando, cancelando...`);
            return;
          }
          
          // Cooldown para evitar spam de requests
          const cooldown = import.meta.env.DEV ? 5000 : 30000;
          if (state.hasLoadedOnce && Date.now() - state.lastRefresh < cooldown) {
            console.log(`⏱️ [${timestamp}] UNIFIED STORE: Cooldown ativo, usando dados existentes`);
            return;
          }
          
          // Verificar cache primeiro
          const cached = getCache();
          if (cached && cached.length > 0 && !state.hasLoadedOnce) {
            console.log(`💾 [${timestamp}] UNIFIED STORE: Usando cache com ${cached.length} projetos`);
            set({ 
              projects: cached, 
              hasLoadedOnce: true, 
              lastRefresh: Date.now(),
              debugInfo: {
                ...state.debugInfo,
                lastCacheCheck: Date.now()
              }
            });
            return;
          }

          console.log(`🌐 [${timestamp}] UNIFIED STORE: Buscando dados frescos do servidor...`);
          set({ isLoading: true, error: null });

          try {
            console.log(`🔐 [${timestamp}] UNIFIED STORE: Verificando autenticação...`);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
              throw new Error(`Usuário não autenticado: ${authError?.message || 'User is null'}`);
            }

            console.log(`✅ [${timestamp}] UNIFIED STORE: Usuário autenticado: ${user.id}`);
            
            const queryStartTime = Date.now();
            console.log(`📡 [${timestamp}] UNIFIED STORE: Executando query...`);
            
            const { data: projects, error } = await supabase
              .from('projects')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            const queryTime = Date.now() - queryStartTime;

            if (error) {
              console.error(`❌ [${timestamp}] UNIFIED STORE: Erro na query (${queryTime}ms):`, error);
              throw error;
            }

            const projectList = projects || [];
            console.log(`✅ [${timestamp}] UNIFIED STORE: Query concluída (${queryTime}ms):`, {
              count: projectList.length,
              projects: projectList.map(p => ({ 
                id: p.id, 
                name: p.name, 
                project_type: p.project_type,
                description: p.description,
                start_date: p.start_date,
                end_date: p.end_date,
                total_area: p.total_area
              }))
            });
            
            set({ 
              projects: projectList,
              isLoading: false,
              error: null,
              lastRefresh: Date.now(),
              hasLoadedOnce: true,
              debugInfo: {
                ...state.debugInfo,
                lastAuthCheck: Date.now(),
                lastQueryTime: queryTime
              }
            });

            // Salvar no cache
            setCache(projectList);
            console.log(`💾 [${timestamp}] UNIFIED STORE: Cache atualizado`);
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar projetos';
            console.error(`❌ [${timestamp}] UNIFIED STORE: Erro completo:`, {
              error: errorMessage,
              stack: error instanceof Error ? error.stack : 'No stack'
            });
            
            set({ 
              projects: [],
              isLoading: false,
              error: errorMessage,
              hasLoadedOnce: true,
              debugInfo: {
                ...state.debugInfo,
                retryCount: state.debugInfo.retryCount + 1
              }
            });
          }
        },

        // Delete atômico com rollback
        deleteProject: async (projectId: string, isExternalDelete = false) => {
          const currentProjects = get().projects;
          const projectToDelete = currentProjects.find(p => p.id === projectId);
          
          if (!projectToDelete) {
            console.error('❌ UNIFIED STORE: Projeto não encontrado para exclusão:', projectId);
            return false;
          }

          console.log('🔄 UNIFIED STORE: Iniciando exclusão atômica:', projectToDelete.name);
          
          try {
            // Optimistic update
            const newProjects = currentProjects.filter(p => p.id !== projectId);
            set({ projects: newProjects, error: null });
            setCache(newProjects);

            // Se for exclusão externa (realtime), não chamar API
            if (!isExternalDelete) {
              const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

              if (error) throw error;
            }

            console.log('✅ UNIFIED STORE: Exclusão concluída com sucesso');
            return true;
            
          } catch (error) {
            // Rollback em caso de falha
            console.error('💥 UNIFIED STORE: Falha na exclusão - executando rollback');
            set({ 
              projects: currentProjects,
              error: error instanceof Error ? error.message : 'Erro ao excluir projeto'
            });
            setCache(currentProjects);
            return false;
          }
        },

        // Adicionar projeto
        addProject: (project: Project) => {
          const newProjects = [project, ...get().projects];
          set({ projects: newProjects, error: null });
          setCache(newProjects);
          console.log('➕ UNIFIED STORE: Projeto adicionado:', project.name);
        },

        // Atualizar projeto
        updateProject: (projectId: string, updates: Partial<Project>) => {
          const newProjects = get().projects.map(p => 
            p.id === projectId ? { ...p, ...updates } : p
          );
          set({ projects: newProjects, error: null });
          setCache(newProjects);
          console.log('📝 UNIFIED STORE: Projeto atualizado:', projectId);
        },

        // Limpar erro
        clearError: () => set({ error: null }),

        // Limpar cache
        clearCache: () => {
          console.log('🗑️ UNIFIED STORE: Limpando cache completo...');
          localStorage.removeItem(CACHE_KEY);
          set({ 
            projects: [], 
            hasLoadedOnce: false, 
            lastRefresh: 0,
            debugInfo: {
              lastCacheCheck: Date.now(),
              lastAuthCheck: 0,
              lastQueryTime: 0,
              retryCount: 0,
            }
          });
        },

        // Forçar refresh
        forceRefresh: async () => {
          console.log('🔄 UNIFIED STORE: Forçando refresh completo...');
          localStorage.removeItem(CACHE_KEY);
          set({ 
            hasLoadedOnce: false, 
            lastRefresh: 0, 
            isLoading: false 
          });
          await get().fetchProjects();
        },

        // Obter projeto por ID
        getProjectById: (projectId: string) => {
          return get().projects.find(p => p.id === projectId) || null;
        }
      })
    ),
    { name: 'unified-project-store' }
  )
);

// Hook para estatísticas otimizadas
export const useProjectStats = () => {
  return useUnifiedProjectStore((state) => ({
    totalProjects: state.projects.length,
    processedProjects: state.projects.filter(p => p.analysis_data).length,
    recentProjects: state.projects.slice(0, 6),
  }));
};

// Hook para debug info
export const useProjectDebugInfo = () => {
  return useUnifiedProjectStore((state) => ({
    debugInfo: state.debugInfo,
    isLoading: state.isLoading,
    error: state.error,
    lastRefresh: state.lastRefresh,
    hasLoadedOnce: state.hasLoadedOnce,
    projectsCount: state.projects.length
  }));
};