import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Sistema de loading centralizado para toda a aplicação
 * Evita múltiplos spinners e conflitos de estado
 */

export interface LoadingState {
  id: string;
  message: string;
  progress?: number;
  type: 'default' | 'upload' | 'sync' | 'navigation' | 'auth';
  timestamp: number;
}

interface UnifiedLoadingState {
  loadingStates: Record<string, LoadingState>;
  globalLoading: boolean;
  
  // Ações
  setLoading: (id: string, message: string, type?: LoadingState['type'], progress?: number) => void;
  updateProgress: (id: string, progress: number) => void;
  clearLoading: (id: string) => void;
  clearAllLoading: () => void;
  
  // Getters
  isLoading: (id?: string) => boolean;
  getLoadingMessage: () => string;
  getLoadingProgress: () => number | undefined;
  getAllLoadingStates: () => LoadingState[];
}

export const useUnifiedLoadingStore = create<UnifiedLoadingState>()(
  devtools(
    (set, get) => ({
      loadingStates: {},
      globalLoading: false,

      setLoading: (id: string, message: string, type = 'default', progress?: number) => {
        console.log(`🔄 UNIFIED LOADING: Iniciando [${id}] - ${message}`);
        
        const newState: LoadingState = {
          id,
          message,
          progress,
          type,
          timestamp: Date.now()
        };

        set(state => {
          const newLoadingStates = {
            ...state.loadingStates,
            [id]: newState
          };
          
          return {
            loadingStates: newLoadingStates,
            globalLoading: Object.keys(newLoadingStates).length > 0
          };
        });
      },

      updateProgress: (id: string, progress: number) => {
        const state = get();
        const existingState = state.loadingStates[id];
        
        if (existingState) {
          console.log(`📊 UNIFIED LOADING: Progresso [${id}] - ${progress}%`);
          
          set(state => ({
            loadingStates: {
              ...state.loadingStates,
              [id]: {
                ...existingState,
                progress
              }
            }
          }));
        }
      },

      clearLoading: (id: string) => {
        console.log(`✅ UNIFIED LOADING: Finalizando [${id}]`);
        
        set(state => {
          const newLoadingStates = { ...state.loadingStates };
          delete newLoadingStates[id];
          
          return {
            loadingStates: newLoadingStates,
            globalLoading: Object.keys(newLoadingStates).length > 0
          };
        });
      },

      clearAllLoading: () => {
        console.log('🧹 UNIFIED LOADING: Limpando todos os loading states');
        set({
          loadingStates: {},
          globalLoading: false
        });
      },

      isLoading: (id?: string) => {
        const state = get();
        if (id) {
          return Boolean(state.loadingStates[id]);
        }
        return state.globalLoading;
      },

      getLoadingMessage: () => {
        const state = get();
        const states = Object.values(state.loadingStates);
        
        if (states.length === 0) return '';
        
        // Priorizar por tipo
        const priorities = {
          'auth': 1,
          'navigation': 2,
          'upload': 3,
          'sync': 4,
          'default': 5
        };
        
        states.sort((a, b) => {
          const priorityA = priorities[a.type] || 999;
          const priorityB = priorities[b.type] || 999;
          return priorityA - priorityB;
        });
        
        return states[0].message;
      },

      getLoadingProgress: () => {
        const state = get();
        const states = Object.values(state.loadingStates);
        
        // Encontrar estado com progresso
        const stateWithProgress = states.find(s => s.progress !== undefined);
        return stateWithProgress?.progress;
      },

      getAllLoadingStates: () => {
        const state = get();
        return Object.values(state.loadingStates);
      }
    }),
    { name: 'unified-loading-store' }
  )
);

/**
 * Hook principal para gerenciar loading
 */
export const useUnifiedLoading = (id?: string) => {
  const store = useUnifiedLoadingStore();
  
  return {
    // Estado
    isLoading: store.isLoading(id),
    isGlobalLoading: store.globalLoading,
    message: store.getLoadingMessage(),
    progress: store.getLoadingProgress(),
    allStates: store.getAllLoadingStates(),
    
    // Ações
    setLoading: store.setLoading,
    updateProgress: store.updateProgress,
    clearLoading: store.clearLoading,
    clearAllLoading: store.clearAllLoading,
    
    // Helpers específicos
    startLoading: (message: string, type: LoadingState['type'] = 'default') => {
      if (id) {
        store.setLoading(id, message, type);
      } else {
        console.warn('UNIFIED LOADING: ID é necessário para startLoading');
      }
    },
    
    stopLoading: () => {
      if (id) {
        store.clearLoading(id);
      } else {
        console.warn('UNIFIED LOADING: ID é necessário para stopLoading');
      }
    },
    
    updateLoadingProgress: (progress: number) => {
      if (id) {
        store.updateProgress(id, progress);
      } else {
        console.warn('UNIFIED LOADING: ID é necessário para updateLoadingProgress');
      }
    }
  };
};

/**
 * Hook para controle específico de upload
 */
export const useUploadLoading = () => {
  const { setLoading, updateProgress, clearLoading, isLoading } = useUnifiedLoading('upload');
  
  return {
    isUploading: isLoading,
    startUpload: (fileName: string) => setLoading('upload', `Enviando ${fileName}...`, 'upload', 0),
    updateUploadProgress: (progress: number) => updateProgress('upload', progress),
    finishUpload: () => clearLoading('upload')
  };
};

/**
 * Hook para controle específico de navegação
 */
export const useNavigationLoading = () => {
  const { setLoading, clearLoading, isLoading } = useUnifiedLoading('navigation');
  
  return {
    isNavigating: isLoading,
    startNavigation: (destination: string) => setLoading('navigation', `Carregando ${destination}...`, 'navigation'),
    finishNavigation: () => clearLoading('navigation')
  };
};

/**
 * Hook para controle específico de sincronização
 */
export const useSyncLoading = () => {
  const { setLoading, clearLoading, isLoading } = useUnifiedLoading('sync');
  
  return {
    isSyncing: isLoading,
    startSync: (message = 'Sincronizando dados...') => setLoading('sync', message, 'sync'),
    finishSync: () => clearLoading('sync')
  };
};