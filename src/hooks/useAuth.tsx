
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const initializationStartedRef = useRef(false);

  useEffect(() => {
    // Prevenir múltiplas inicializações
    if (initializationStartedRef.current) return;
    initializationStartedRef.current = true;

    console.log('🔄 AUTH: Inicializando autenticação...');
    
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        // Verificar sessão existente primeiro
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;
        
        if (error) {
          console.error('❌ AUTH: Erro ao verificar sessão:', error);
        } else {
          console.log('✅ AUTH: Sessão verificada', { 
            hasSession: !!existingSession, 
            hasUser: !!existingSession?.user 
          });
          
          setSession(existingSession);
          setUser(existingSession?.user ?? null);
        }
        
        // Configurar listener de mudanças de estado
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('🔄 AUTH: State change event:', event);
            
            if (!mountedRef.current) return;
            
            setSession(session);
            setUser(session?.user ?? null);
          }
        );
        
        authSubscription = subscription;
        
        // Finalizar loading
        if (mountedRef.current) {
          setLoading(false);
        }
        
      } catch (error) {
        console.error('💥 AUTH: Erro crítico na inicialização:', error);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 AUTH: Limpando recursos...');
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
