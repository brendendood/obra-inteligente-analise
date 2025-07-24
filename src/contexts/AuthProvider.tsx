
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useGeolocationCapture } from '@/hooks/useGeolocationCapture';

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
  // Hook para capturar geolocalização automaticamente (simplificado)
  const { forceGeolocationCapture } = useGeolocationCapture();
  
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  // Use refs to prevent unnecessary re-renders during HMR
  const lastAuthEventRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Simplificado: apenas tracking básico via database trigger
  const trackLogin = useCallback((user: User) => {
    console.log('📍 Login registrado automaticamente via database trigger para:', user.email);
    // O tracking real é feito pelo trigger handle_user_login() no banco
    // A geolocalização é capturada via pg_notify e edge function
  }, []);

  const refreshAuth = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial auth check
    refreshAuth();

    // Auth state listener with improved HMR handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Prevent duplicate events during HMR
        const eventKey = `${event}-${session?.user?.id || 'null'}`;
        if (lastAuthEventRef.current === eventKey) {
          console.log('🔄 AUTH: Duplicate event ignored for HMR:', event);
          return;
        }
        lastAuthEventRef.current = eventKey;
        
        // Clear existing debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        // Debounce auth state changes for better HMR
        debounceTimerRef.current = setTimeout(async () => {
          console.log('🔄 AUTH: Processing state change:', event);
          
          const user = session?.user || null;

          setState({
            user,
            session,
            loading: false,
            isAuthenticated: !!user && !!session,
          });

          // Ativar tracking de login quando usuário faz login
          if (event === 'SIGNED_IN' && user) {
            console.log('📍 Iniciando tracking de localização para login real...');
            setTimeout(() => trackLogin(user), 1000);
          }
        }, import.meta.env.DEV ? 100 : 0); // Small delay in development
      }
    );

    return () => {
      mounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      subscription.unsubscribe();
    };
  }, [refreshAuth, trackLogin]);

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
};
