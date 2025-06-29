
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const authInitializedRef = useRef(false);

  useEffect(() => {
    // Prevenir múltiplas inicializações
    if (authInitializedRef.current) return;
    authInitializedRef.current = true;

    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('🔄 AUTH: Inicializando autenticação...');
        
        // Configurar listener de mudanças de estado
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('🔄 AUTH: State change event:', event);
            
            if (!mountedRef.current) return;
            
            setSession(session);
            setUser(session?.user ?? null);
            
            // Definir loading como false apenas após receber o primeiro evento
            if (loading) {
              setLoading(false);
            }
          }
        );
        
        authSubscription = subscription;
        
        // Verificar sessão existente
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;
        
        if (error) {
          console.error('❌ AUTH: Erro ao verificar sessão:', error);
          setLoading(false);
          return;
        }
        
        // Atualizar estado inicial
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        setLoading(false);
        
        console.log('✅ AUTH: Inicialização concluída', { 
          hasSession: !!existingSession, 
          hasUser: !!existingSession?.user 
        });
        
      } catch (error) {
        console.error('💥 AUTH: Erro crítico na inicialização:', error);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mountedRef.current = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []); // Array vazio - executa apenas uma vez

  const isAuthenticated = !!user && !!session;

  console.log('🔍 AUTH: Current state', { 
    loading, 
    isAuthenticated, 
    hasUser: !!user, 
    hasSession: !!session 
  });

  return {
    user,
    session,
    loading,
    isAuthenticated,
  };
}
