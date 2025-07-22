
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
    isAdmin: false,
  });
  
  // Refs para evitar múltiplas chamadas
  const isCheckingAdmin = useRef(false);
  const lastAdminCheck = useRef<string | null>(null);
  
  // Debounce para auth state changes
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Memoized auth check usando is_superuser para evitar recursão
  const checkAdminPermissions = useCallback(async (user: User) => {
    try {
      // Evitar múltiplas chamadas simultâneas
      if (isCheckingAdmin.current || lastAdminCheck.current === user.id) {
        return false;
      }
      
      isCheckingAdmin.current = true;
      lastAdminCheck.current = user.id;
      
      console.log('🔍 AuthProvider: Verificando permissões admin com is_superuser...');
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Admin check timeout')), 2000)
      );
      
      const adminCheckPromise = supabase.rpc('is_superuser');
      
      const { data } = await Promise.race([adminCheckPromise, timeoutPromise]) as any;
      console.log('✅ AuthProvider: Resultado check admin:', data);
      
      return !!data;
    } catch (error) {
      console.error('❌ AuthProvider: Admin permission check failed:', error);
      return false;
    } finally {
      isCheckingAdmin.current = false;
    }
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
      const isAdmin = user ? await checkAdminPermissions(user) : false;

      setState({
        user,
        session,
        loading: false,
        isAuthenticated: !!user && !!session,
        isAdmin,
      });
    } catch (error) {
      console.error('Auth refresh error:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [checkAdminPermissions]);

  useEffect(() => {
    let mounted = true;

    // Initial auth check
    refreshAuth();

    // Auth state listener com debouncing para melhor HMR
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Debounce auth state changes
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(async () => {
          if (!mounted) return;
          
          console.log('🔄 AUTH: State change:', event);
          
          const user = session?.user || null;
          const isAdmin = user ? await checkAdminPermissions(user) : false;

          setState({
            user,
            session,
            loading: false,
            isAuthenticated: !!user && !!session,
            isAdmin,
          });
        }, 100); // 100ms debounce
      }
    );

    return () => {
      mounted = false;
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      subscription.unsubscribe();
    };
  }, [refreshAuth, checkAdminPermissions]);

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
