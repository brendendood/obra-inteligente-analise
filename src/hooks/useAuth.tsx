
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    let authSubscription: any = null;

    const initAuth = async () => {
      try {
        // Verificar sessão inicial apenas uma vez
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;
        
        if (error) {
          console.error('❌ AUTH: Erro ao obter sessão inicial:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('💥 AUTH: Erro crítico na autenticação:', error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Configurar listener de mudanças de auth (apenas uma vez)
    const setupAuthListener = () => {
      authSubscription = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mountedRef.current) return;
          
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Log apenas para eventos importantes
          if (event === 'SIGNED_IN') {
            console.log('✅ LOGIN: Sucesso para:', session?.user?.email);
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 LOGOUT: Usuário desconectado');
          }
        }
      );
    };

    initAuth();
    setupAuthListener();

    return () => {
      mountedRef.current = false;
      if (authSubscription) {
        authSubscription.subscription.unsubscribe();
      }
    };
  }, []); // Dependência vazia - executar apenas uma vez

  const isAuthenticated = !!user && !!session;

  return {
    user,
    session,
    loading,
    isAuthenticated,
  };
}
