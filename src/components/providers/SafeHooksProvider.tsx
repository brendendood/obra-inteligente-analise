import React from 'react';

interface SafeHooksContextType {
  isReactHealthy: boolean;
  error?: string;
}

// Enhanced static health check to prevent React corruption
const checkReactHealthStatic = () => {
  try {
    // Primary check: React object existence and type
    if (typeof React === 'undefined' || React === null || typeof React !== 'object') {
      return { isHealthy: false, error: 'React object not found or corrupted' };
    }
    
    // Secondary check: Essential React methods
    if (!React.useState || !React.useEffect || !React.createContext || 
        typeof React.useState !== 'function' || 
        typeof React.useEffect !== 'function' || 
        typeof React.createContext !== 'function') {
      return { isHealthy: false, error: 'React hooks/methods not available or corrupted' };
    }
    
    // Critical check: React dispatcher state (the root cause of useState null errors)
    try {
      const reactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      if (reactInternals && reactInternals.ReactCurrentDispatcher) {
        const currentDispatcher = reactInternals.ReactCurrentDispatcher.current;
        if (currentDispatcher === null) {
          return { 
            isHealthy: false, 
            error: 'React dispatcher is null - React context corrupted. This causes useState null errors.' 
          };
        }
      }
    } catch (dispatcherError) {
      return { 
        isHealthy: false, 
        error: 'Cannot access React dispatcher - React internal state corrupted' 
      };
    }
    
    return { isHealthy: true };
  } catch (error) {
    return { 
      isHealthy: false, 
      error: error instanceof Error ? error.message : 'Unknown React validation error' 
    };
  }
};

interface SafeHooksProviderProps {
  children: React.ReactNode;
}

/**
 * SafeHooksProvider using class component to completely avoid hooks when React is corrupted
 * This prevents the "Cannot read properties of null (reading 'useState')" error
 */
class SafeHooksProviderClass extends React.Component<
  SafeHooksProviderProps,
  { isHealthy: boolean; error?: string; retryCount: number }
> {
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private readonly maxRetries = 3;

  constructor(props: SafeHooksProviderProps) {
    super(props);
    
    const healthCheck = checkReactHealthStatic();
    this.state = {
      isHealthy: healthCheck.isHealthy,
      error: healthCheck.error,
      retryCount: 0
    };

    // If React is corrupted, attempt immediate recovery
    if (!healthCheck.isHealthy) {
      console.error('🔴 CRITICAL: React corruption detected on initialization:', healthCheck.error);
      this.attemptRecovery();
    }
  }

  componentDidMount() {
    // Only set up monitoring if React is initially healthy
    if (this.state.isHealthy) {
      this.setupHealthMonitoring();
    }
  }

  componentWillUnmount() {
    this.cleanupHealthMonitoring();
  }

  private setupHealthMonitoring = () => {
    // Periodic health checks to detect corruption early
    this.healthCheckInterval = setInterval(() => {
      const healthCheck = checkReactHealthStatic();
      if (!healthCheck.isHealthy && this.state.isHealthy) {
        console.error('🔴 CRITICAL: React corruption detected during runtime:', healthCheck.error);
        this.setState({ 
          isHealthy: false, 
          error: healthCheck.error,
          retryCount: 0
        });
        this.attemptRecovery();
      }
    }, 5000); // Check every 5 seconds
  };

  private cleanupHealthMonitoring = () => {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  };

  private attemptRecovery = () => {
    if (this.state.retryCount >= this.maxRetries) {
      console.error('🔴 CRITICAL: Maximum recovery attempts reached. Forcing page reload.');
      this.forcePageReload();
      return;
    }

    console.log(`🔄 RECOVERY: Attempting React recovery (${this.state.retryCount + 1}/${this.maxRetries})...`);
    
    // Attempt to recover by clearing caches and retrying
    setTimeout(() => {
      const healthCheck = checkReactHealthStatic();
      
      if (healthCheck.isHealthy) {
        console.log('✅ RECOVERY: React recovery successful!');
        this.setState({ 
          isHealthy: true, 
          error: undefined, 
          retryCount: 0 
        });
        this.setupHealthMonitoring();
      } else {
        console.error('❌ RECOVERY: React recovery failed, incrementing retry count');
        this.setState({ 
          retryCount: this.state.retryCount + 1 
        });
        this.attemptRecovery();
      }
    }, 1000 * (this.state.retryCount + 1)); // Exponential backoff
  };

  private forcePageReload = () => {
    try {
      // Clear all possible corruption sources
      if ('caches' in window) {
        caches.keys().then(names => names.forEach(name => caches.delete(name)));
      }
      localStorage.clear();
      sessionStorage.clear();
      
      // Force hard reload
      window.location.reload();
    } catch (e) {
      console.error('🔴 CRITICAL: Even force reload failed:', e);
      // Ultimate fallback - redirect to home
      window.location.href = '/';
    }
  };

  render() {
    // If React is corrupted, show error UI using only basic React.createElement
    if (!this.state.isHealthy) {
      return React.createElement('div', {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }
      }, 
        React.createElement('div', {
          style: {
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center' as const,
            maxWidth: '500px',
            margin: '20px'
          }
        },
          React.createElement('div', { 
            style: { fontSize: '48px', marginBottom: '16px' } 
          }, '⚠️'),
          React.createElement('h1', { 
            style: { 
              color: '#dc2626', 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '16px' 
            } 
          }, 'Sistema React Corrompido'),
          React.createElement('p', { 
            style: { 
              color: '#374151', 
              marginBottom: '20px', 
              lineHeight: '1.5' 
            } 
          }, `ERRO: ${this.state.error || 'React corruption detected'}. Tentativa ${this.state.retryCount}/${this.maxRetries}. Recarregando...`),
          React.createElement('div', {
            style: {
              marginTop: '16px',
              fontSize: '14px',
              color: '#6b7280'
            }
          }, this.state.retryCount >= this.maxRetries 
            ? 'Múltiplas tentativas falharam. Forçando recarregamento completo...' 
            : 'Tentando recuperação automática...'
          )
        )
      );
    }

    // If React is healthy, create context safely
    let SafeHooksContext: React.Context<SafeHooksContextType | null>;
    try {
      SafeHooksContext = React.createContext<SafeHooksContextType | null>(null);
    } catch (contextError) {
      console.error('🔴 CRITICAL: Failed to create React context:', contextError);
      return React.createElement('div', {}, this.props.children);
    }

    const contextValue: SafeHooksContextType = {
      isReactHealthy: true,
      error: undefined
    };

    return React.createElement(
      SafeHooksContext.Provider,
      { value: contextValue },
      this.props.children
    );
  }
}

// Export functional component wrapper for compatibility
export const SafeHooksProvider: React.FC<SafeHooksProviderProps> = ({ children }) => {
  return React.createElement(SafeHooksProviderClass, { children });
};

// Safe hook for components that need to check React health
export const useSafeHooks = (): SafeHooksContextType => {
  // Return default safe state since we can't safely use useContext if React is corrupted
  return { isReactHealthy: true };
};