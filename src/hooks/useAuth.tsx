
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 Inicializando autenticação...');
    
    // Verificar sessão inicial primeiro
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Erro ao obter sessão inicial:', error);
        } else {
          console.log('✅ Sessão inicial:', session?.user?.id ? `Usuário ${session.user.id}` : 'Não autenticado');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('❌ Erro crítico na autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.id ? `Usuário ${session.user.id}` : 'Logout');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    getInitialSession();

    return () => {
      console.log('🧹 Limpando subscription de auth');
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user && !!session;
  
  console.log('🔍 Estado auth atual:', { 
    loading, 
    isAuthenticated, 
    userId: user?.id,
    email: user?.email 
  });

  return {
    user,
    session,
    loading,
    isAuthenticated,
  };
}
