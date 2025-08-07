
import React, { 
  createContext, 
  useEffect, 
  useState, 
  useMemo, 
  useCallback, 
  useRef,
  type ReactNode 
} from 'react';
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  }));

  // Simplified refs - remove complex logic that can cause issues
  const mountedRef = useRef(true);
  const listenerSetupRef = useRef(false);

  const refreshAuth = useCallback(async () => {
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

  useEffect(() => {
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
  const contextValue = useMemo(() => ({
    ...state,
    refreshAuth,
  }), [state, refreshAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
