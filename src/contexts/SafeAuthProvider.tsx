import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  // Refs para controle de estado e prevenção de loops
  const isInitializedRef = useRef(false);
  const mountedRef = useRef(true);

  const refreshAuth = async () => {
    if (!mountedRef.current) return;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const user = session?.user || null;
      
      setState({
        user,
        session,
        loading: false,
        isAuthenticated: !!user && !!session,
      });
    } catch (error) {
      console.error('Auth refresh error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    let authSubscription: any = null;

    const initializeAuth = async () => {
      if (isInitializedRef.current || !mountedRef.current) return;
      
      // 1. PRIMEIRO: Configurar listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!mountedRef.current) return;
          
          // IGNORAR token refresh para evitar loops
          if (event === 'TOKEN_REFRESHED') {
            return;
          }
          
          console.log('🔐 AUTH: Event processado:', event);
          
          const user = session?.user || null;
          setState({
            user,
            session,
            loading: false,
            isAuthenticated: !!user && !!session,
          });
        }
      );
      
      authSubscription = subscription;
      
      // 2. DEPOIS: Verificar sessão atual
      await refreshAuth();
      isInitializedRef.current = true;
    };

    initializeAuth();

    return () => {
      mountedRef.current = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []); // DEPS VAZIAS - crítico para evitar loops

  const contextValue: AuthContextType = {
    user: state.user,
    session: state.session,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};