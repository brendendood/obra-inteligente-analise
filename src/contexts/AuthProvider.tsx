import * as React from 'react';
import { createContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  // Use refs to prevent unnecessary re-renders during HMR
  const lastAuthEventRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);
  const mountedRef = useRef(true);

  const refreshAuth = useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
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

      // Redirecionamento centralizado - apenas uma vez após login bem-sucedido
      if (isAuthenticated && !isInitializedRef.current && window.location.pathname === '/login') {
        console.log('🔄 AUTH: Redirecionando para painel após login bem-sucedido');
        window.location.href = '/painel';
      }
      
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Auth refresh error:', error);
      if (mountedRef.current) {
        setState(prev => ({ ...prev, loading: false }));
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
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
        (event, session) => {
          if (!mountedRef.current) {
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
          
          console.log('🔄 AUTH: Processando mudança de estado:', event);
          
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

          // Redirecionamento centralizado - apenas para login bem-sucedido
          if (event === 'SIGNED_IN' && isAuthenticated && window.location.pathname === '/login') {
            console.log('🔄 AUTH: Redirecionando para painel após SIGNED_IN');
            window.location.href = '/painel';
          }

          // Capturar IP real e criar registro de login em background (sem bloquear UX)
          if (event === 'SIGNED_IN' && user) {
            console.log('📊 AUTH: Login detectado para:', user.email);
            
            // Executar em background após redirecionamento
            setTimeout(async () => {
              try {
                console.log('🌐 Capturando IP real via frontend (background)...');
                
                // Capturar IP real do frontend primeiro
                let realIP = null;
                try {
                  const response = await fetch('https://ipapi.co/ip/');
                  if (response.ok) {
                    realIP = (await response.text()).trim();
                    console.log(`✅ IP real capturado do frontend: ${realIP}`);
                  }
                } catch (e) {
                  console.warn('❌ Falha ao capturar IP do frontend:', e);
                }
                
                const { data, error } = await supabase.functions.invoke('capture-real-ip', {
                  body: { 
                    user_id: user.id,
                    force_capture: true,
                    frontend_ip: realIP
                  }
                });

                if (error) {
                  console.error('❌ Erro na captura de IP:', error);
                } else {
                  console.log('✅ Geolocalização precisa iniciada:', data);
                }
              } catch (error) {
                console.error('❌ Falha na captura de IP:', error);
              }
            }, 2000); // Delay maior para não interferir no redirecionamento
          }
        }
      );
      
      subscription = data.subscription;
    };

    // Setup do listener
    setupAuthListener();

    return () => {
      mountedRef.current = false;
      console.log('🔄 AUTH: Limpando AuthProvider...');
      
      if (subscription) {
        console.log('🔄 AUTH: Removendo subscription...');
        subscription.unsubscribe();
        subscription = null;
      }
      
      // Reset para evitar memory leaks
      lastAuthEventRef.current = null;
      isInitializedRef.current = false;
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
};