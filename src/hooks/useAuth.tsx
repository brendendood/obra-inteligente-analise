
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial primeiro
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ AUTH: Erro ao obter sessão inicial:', error);
        } else {
          console.log('🔐 AUTH: Sessão inicial carregada:', session ? 'Autenticado' : 'Não autenticado');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('💥 AUTH: Erro crítico na autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AUTH: Evento de mudança:', event, session ? 'Autenticado' : 'Não autenticado');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log específico para login/logout
        if (event === 'SIGNED_IN') {
          console.log('✅ LOGIN: Sucesso para:', session?.user?.email);
          
          // Verificar se é admin após login bem-sucedido
          if (session?.user) {
            try {
              const { data: isAdmin, error } = await supabase.rpc('is_admin_user');
              if (!error && isAdmin) {
                console.log('👑 AUTH: Usuário admin detectado:', session.user.email);
              }
            } catch (error) {
              console.error('⚠️ AUTH: Erro ao verificar status admin:', error);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 LOGOUT: Usuário desconectado');
        }
      }
    );

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user && !!session;

  return {
    user,
    session,
    loading,
    isAuthenticated,
  };
}
