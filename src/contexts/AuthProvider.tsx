import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  refreshAuth: () => Promise<void>;
}

// Fallback state para casos críticos
const FALLBACK_AUTH_STATE: AuthState = {
  user: null,
  session: null,
  loading: false,
  isAuthenticated: false,
};

// Create context with safe defaults
export const AuthContext = React.createContext<AuthContextType>({
  ...FALLBACK_AUTH_STATE,
  refreshAuth: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// Safe hook check - verify React is properly loaded
const isSafeToUseHooks = (): boolean => {
  try {
    // Test if React hooks dispatcher is available
    const testRef = React.useRef(null);
    return true;
  } catch (error) {
    console.error('🔴 CRITICAL: React hooks not available:', error);
    return false;
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  // Emergency fallback if React hooks are corrupted
  if (!isSafeToUseHooks()) {
    console.error('🔴 EMERGENCY: React hooks corrupted, using fallback');
    return (
      <AuthContext.Provider value={{
        ...FALLBACK_AUTH_STATE,
        refreshAuth: async () => {
          console.warn('AuthProvider in emergency mode - reloading page');
          window.location.reload();
        }
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Safe hook usage with error boundaries
  let state: AuthState;
  let setState: React.Dispatch<React.SetStateAction<AuthState>>;
  
  try {
    [state, setState] = React.useState<AuthState>(() => ({
      user: null,
      session: null,
      loading: true,
      isAuthenticated: false,
    }));
  } catch (error) {
    console.error('🔴 CRITICAL: useState failed:', error);
    // Emergency fallback render
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1 style={{ color: '#dc2626', fontSize: '24px', marginBottom: '16px' }}>
            Sistema React Corrompido
          </h1>
          <p style={{ color: '#374151', marginBottom: '20px' }}>
            Detectamos um erro crítico no React. Recarregando...
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Recarregar Agora
          </button>
        </div>
      </div>
    );
  }

  const mountedRef = React.useRef(true);
  const listenerSetupRef = React.useRef(false);

  const refreshAuth = React.useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🔴 AUTH: Error getting session:', error);
        if (mountedRef.current) {
          setState(prev => ({ ...prev, loading: false }));
        }
        return;
      }

      const user = session?.user || null;
      const isAuthenticated = !!user && !!session;

      if (mountedRef.current) {
        setState({
          user,
          session,
          loading: false,
          isAuthenticated,
        });
      }

      // Simple redirect logic - only on login page
      if (isAuthenticated && window.location.pathname === '/login') {
        console.log('✅ AUTH: Redirecting to dashboard after successful login');
        window.location.href = '/painel';
      }
    } catch (error) {
      console.error('🔴 AUTH: Refresh error:', error);
      if (mountedRef.current) {
        setState({ user: null, session: null, loading: false, isAuthenticated: false });
      }
    }
  }, []);

  React.useEffect(() => {
    if (listenerSetupRef.current) {
      console.log('⚠️ AUTH: Already initialized, skipping...');
      return;
    }

    mountedRef.current = true;
    listenerSetupRef.current = true;
    let subscription: any = null;

    console.log('✅ AUTH: Initializing AuthProvider...');

    // Initial auth check
    refreshAuth();

    // Setup auth listener
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mountedRef.current) {
          console.log('⚠️ AUTH: Component unmounted, ignoring event:', event);
          return;
        }
        
        console.log('🔄 AUTH: Processing state change:', event);
        
        const user = session?.user || null;
        const isAuthenticated = !!user && !!session;

        if (mountedRef.current) {
          setState({
            user,
            session,
            loading: false,
            isAuthenticated,
          });
        }

        // Simple redirect logic
        if (event === 'SIGNED_IN' && isAuthenticated && window.location.pathname === '/login') {
          console.log('✅ AUTH: Redirecting after SIGNED_IN');
          window.location.href = '/painel';
        }

        // Background IP capture
        if (event === 'SIGNED_IN' && user) {
          console.log('📊 AUTH: Login detected for:', user.email);
          
          setTimeout(async () => {
            try {
              let realIP = null;
              try {
                const response = await fetch('https://ipapi.co/ip/');
                if (response.ok) {
                  realIP = (await response.text()).trim();
                }
              } catch (e) {
                console.warn('IP capture failed:', e);
              }
              
              await supabase.functions.invoke('capture-real-ip', {
                body: { 
                  user_id: user.id,
                  force_capture: true,
                  frontend_ip: realIP
                }
              });
            } catch (error) {
              console.error('IP capture error:', error);
            }
          }, 2000);
        }
      });
      
      subscription = data.subscription;
    } catch (error) {
      console.error('🔴 AUTH: Failed to setup listener:', error);
    }

    return () => {
      mountedRef.current = false;
      listenerSetupRef.current = false;
      console.log('🧹 AUTH: Cleaning up...');
      
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
        subscription = null;
      }
    };
  }, [refreshAuth]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    ...state,
    refreshAuth,
  }), [state, refreshAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}