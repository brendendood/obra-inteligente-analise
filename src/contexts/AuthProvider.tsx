
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
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

  // Use refs to prevent unnecessary re-renders and track state
  const lastAuthEventRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const stateRef = useRef(state);
  
  // Always keep stateRef updated
  stateRef.current = state;

  // Função para tracking de login baseado em IP real
  const trackLoginByIP = useCallback(async (user: User) => {
    try {
      console.log('📍 Iniciando tracking de localização baseado em IP...');
      
      // Buscar último login para este usuário
      const { data: lastLogin, error } = await supabase
        .from('user_login_history')
        .select('id')
        .eq('user_id', user.id)
        .order('login_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && lastLogin) {
        // Chamar Edge Function para capturar IP e localização
        const { data, error: functionError } = await supabase.functions.invoke('ip-geolocation', {
          body: { loginId: lastLogin.id }
        });

        if (functionError) {
          console.error('❌ Erro na Edge Function:', functionError);
        } else {
          console.log('✅ Localização capturada via IP:', data);
        }
      }
    } catch (error) {
      console.error('❌ Erro no tracking de localização por IP:', error);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    if (isInitializedRef.current) {
      console.log('🔄 AUTH: refreshAuth ignorado - já inicializado');
      return;
    }
    
    console.log('🔄 AUTH: refreshAuth executado');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const user = session?.user || null;
      const newState = {
        user,
        session,
        loading: false,
        isAuthenticated: !!user && !!session,
      };
      
      // Only update if state actually changed
      if (!stateRef.current.isAuthenticated !== !newState.isAuthenticated || 
          stateRef.current.user?.id !== newState.user?.id) {
        console.log('🔄 AUTH: Estado mudou, atualizando');
        setState(newState);
      }
      
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Auth refresh error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []); // EMPTY dependencies

  useEffect(() => {
    console.log('🎯 AUTH: useEffect principal iniciado');
    let mounted = true;

    // Initial auth check ONLY ONCE
    if (!isInitializedRef.current) {
      refreshAuth();
    }

    // Auth state listener with VERY STRICT filtering
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AUTH: onAuthStateChange event:', event);
        if (!mounted) return;
        
        // IGNORE token refresh events to prevent loops
        if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 AUTH: TOKEN_REFRESHED ignorado para evitar loop');
          return;
        }
        
        // Prevent duplicate events
        const eventKey = `${event}-${session?.user?.id || 'null'}-${Date.now()}`;
        if (lastAuthEventRef.current === eventKey) {
          console.log('🔄 AUTH: Duplicate event ignored:', event);
          return;
        }
        lastAuthEventRef.current = eventKey;
        
        // Clear existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        // Process only SIGNIFICANT auth changes
        debounceTimerRef.current = setTimeout(async () => {
          console.log('🔄 AUTH: Processing significant auth change:', event);
          
          const user = session?.user || null;
          const newState = {
            user,
            session,
            loading: false,
            isAuthenticated: !!user && !!session,
          };
          
          // ONLY update if authentication status actually changed
          if (stateRef.current.isAuthenticated !== newState.isAuthenticated) {
            console.log('🔄 AUTH: Authentication status changed');
            setState(newState);
            
            // Track login only for real sign-in events
            if (event === 'SIGNED_IN' && user) {
              console.log('📍 Tracking login...');
              setTimeout(() => trackLoginByIP(user), 1000);
            }
          } else {
            console.log('🔄 AUTH: Status não mudou, ignorando update');
          }
        }, 300); // Longer debounce
      }
    );

    return () => {
      console.log('🧹 AUTH: Cleanup useEffect');
      mounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      subscription.unsubscribe();
    };
  }, []); // COMPLETELY EMPTY dependencies!

  // Memoize context value MORE AGGRESSIVELY
  const contextValue = useMemo(() => {
    return {
      user: state.user,
      session: state.session,
      loading: state.loading,
      isAuthenticated: state.isAuthenticated,
      refreshAuth,
    };
  }, [state.user?.id, state.isAuthenticated, state.loading]); // MINIMAL dependencies

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
