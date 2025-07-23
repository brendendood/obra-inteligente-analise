
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
  console.log('🔄 AUTH PROVIDER: Componente renderizado');
  
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  // Use refs to prevent unnecessary re-renders during HMR
  const lastAuthEventRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const renderCountRef = useRef(0);
  
  renderCountRef.current += 1;
  console.log('🔄 AUTH PROVIDER: Render #', renderCountRef.current);

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
    console.log('🔄 AUTH: refreshAuth chamado');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const user = session?.user || null;
      console.log('🔄 AUTH: setState chamado em refreshAuth');

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
  }, []); // SEM DEPENDÊNCIAS para evitar loop

  useEffect(() => {
    console.log('🎯 AUTH: useEffect principal iniciado');
    let mounted = true;

    // Initial auth check
    refreshAuth();

    // Auth state listener with improved HMR handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AUTH: onAuthStateChange disparado:', event);
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
          console.log('🔄 AUTH: setState chamado em onAuthStateChange');

          setState({
            user,
            session,
            loading: false,
            isAuthenticated: !!user && !!session,
          });

          // Ativar tracking de login quando usuário faz login
          if (event === 'SIGNED_IN' && user) {
            console.log('📍 Iniciando tracking de localização para login real...');
            setTimeout(() => trackLoginByIP(user), 1000);
          }
        }, import.meta.env.DEV ? 100 : 0); // Small delay in development
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
  }, []); // SEM refreshAuth e trackLoginByIP para evitar loop!

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    console.log('🔄 AUTH: contextValue memo recalculado');
    return {
      ...state,
      refreshAuth,
    };
  }, [state, refreshAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
