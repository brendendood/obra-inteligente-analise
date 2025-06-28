
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const authInitializedRef = useRef(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    // Prevenir múltiplas inicializações
    if (authInitializedRef.current) return;
    authInitializedRef.current = true;

    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // PASSO 1: Configurar listener PRIMEIRO
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('🔄 AUTH: State change event:', event);
            
            if (!mountedRef.current) return;
            
            // Debounce para evitar updates excessivos
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              if (mountedRef.current) {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
              }
            }, 100);
          }
        );
        
        subscriptionRef.current = subscription;
        
        // PASSO 2: Verificar sessão existente DEPOIS do listener
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;
        
        if (error) {
          console.error('❌ AUTH: Erro ao verificar sessão:', error);
        }
        
        // Update inicial sem conflitar com o listener
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        setLoading(false);
        
        console.log('✅ AUTH: Inicialização concluída');
        
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
      clearTimeout(timeoutId);
      
      if (subscriptionRef.current?.unsubscribe) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []); // Array vazio - executa apenas uma vez

  const isAuthenticated = !!user && !!session;

  return {
    user,
    session,
    loading,
    isAuthenticated,
  };
}
