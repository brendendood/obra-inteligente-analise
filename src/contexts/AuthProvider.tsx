import { createContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from 'react';
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
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

// Fallback state para casos críticos
const FALLBACK_AUTH_STATE: AuthState = {
  user: null,
  session: null,
  loading: false,
  isAuthenticated: false,
};

// Create context with safe defaults
export const AuthContext = createContext<AuthContextType>({
  ...FALLBACK_AUTH_STATE,
  refreshAuth: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // VERSÃO ULTRA-SEGURA - Usando imports diretos
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  const mountedRef = useRef(true);
  const listenerSetupRef = useRef(false);

  const refreshAuth = useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🔴 AUTH: Error getting session:', error);
        if (mountedRef.current) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
        return;
      }

      const user = session?.user || null;
      const isAuthenticated = !!user && !!session;

      if (mountedRef.current) {
        setAuthState({
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
        setAuthState({ user: null, session: null, loading: false, isAuthenticated: false });
      }
    }
  }, []);

  // Enhanced Sign In with Remember Me functionality
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log('🔑 AUTH: Iniciando login para:', email, 'Remember me:', rememberMe);
      
      // Configure session persistence
      const persistSession = rememberMe ? 'local' : 'session';
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });
      
      if (error) {
        console.error('🔴 AUTH: Login error:', error);
        return { error };
      }

      // Set session storage based on remember me preference
      if (rememberMe) {
        localStorage.setItem('supabase.auth.remember_me', 'true');
      } else {
        localStorage.removeItem('supabase.auth.remember_me');
      }

      console.log('✅ AUTH: Login successful for:', email);
      return { error: null };
    } catch (error) {
      console.error('🔴 AUTH: Sign in error:', error);
      return { error };
    }
  }, []);

  // Enhanced Sign Up with email verification
  const signUp = useCallback(async (email: string, password: string, userData?: any) => {
    try {
      console.log('📝 AUTH: Iniciando cadastro para:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          ...(userData && { data: userData }),
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('🔴 AUTH: Signup error:', error);
        return { error };
      }

      console.log('✅ AUTH: Signup successful, verification email sent to:', email);
      return { error: null };
    } catch (error) {
      console.error('🔴 AUTH: Sign up error:', error);
      return { error };
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      console.log('🚪 AUTH: Signing out...');
      
      // Clear remember me preference
      localStorage.removeItem('supabase.auth.remember_me');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔴 AUTH: Logout error:', error);
      } else {
        console.log('✅ AUTH: Logout successful');
        // Redirect to login page
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('🔴 AUTH: Sign out error:', error);
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

    // Check if user wants to stay logged in
    const rememberMe = localStorage.getItem('supabase.auth.remember_me') === 'true';
    console.log('🔐 AUTH: Remember me preference:', rememberMe);

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
          setAuthState({
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
    ...authState,
    refreshAuth,
    signIn,
    signUp,
    signOut,
  }), [authState, refreshAuth, signIn, signUp, signOut]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}