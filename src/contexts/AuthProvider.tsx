
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
    let subscription: any = null;

    console.log('🔄 AUTH: Inicializando AuthProvider...');

    // Initial auth check
    refreshAuth();

    // Função para configurar listener apenas uma vez
    const setupAuthListener = () => {
      if (subscription) {
        console.log('🔄 AUTH: Listener já existe, pulando...');
        return;
      }

      console.log('🔄 AUTH: Configurando listener de autenticação...');
      
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) {
            console.log('🔄 AUTH: Componente desmontado, ignorando evento:', event);
            return;
          }
          
          // Prevent duplicate events durante HMR em desenvolvimento
          const eventKey = `${event}-${session?.user?.id || 'null'}`;
          if (lastAuthEventRef.current === eventKey) {
            console.log('🔄 AUTH: Evento duplicado ignorado (HMR):', event);
            return;
          }
          lastAuthEventRef.current = eventKey;
          
          // Clear existing debounce timer
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          
          // Debounce para HMR melhor em desenvolvimento
          debounceTimerRef.current = setTimeout(async () => {
            if (!mounted) return;
            
            console.log('🔄 AUTH: Processando mudança de estado:', event);
            
            const user = session?.user || null;

            setState({
              user,
              session,
              loading: false,
              isAuthenticated: !!user && !!session,
            });

            // Ativar tracking de login quando usuário faz login real
            if (event === 'SIGNED_IN' && user) {
              console.log('📍 Iniciando tracking de localização para login...');
              // Delay para garantir que o login foi processado
              setTimeout(() => trackLogin(user), 1000);
            }
          }, import.meta.env.DEV ? 50 : 0); // Delay menor para desenvolvimento
        }
      );
      
      subscription = data.subscription;
    };

    // Setup do listener
    setupAuthListener();

    return () => {
      mounted = false;
      console.log('🔄 AUTH: Limpando AuthProvider...');
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      if (subscription) {
        console.log('🔄 AUTH: Removendo subscription...');
        subscription.unsubscribe();
        subscription = null;
      }
      
      // Reset para evitar memory leaks
      lastAuthEventRef.current = null;
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
