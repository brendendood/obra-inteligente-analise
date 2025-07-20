
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
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

  // Memoized auth check to avoid unnecessary re-renders
  const checkAdminPermissions = useCallback(async (user: User) => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Admin check timeout')), 3000)
      );
      
      const adminCheckPromise = supabase
        .from('admin_permissions')
        .select('user_id')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle();
      
      const { data } = await Promise.race([adminCheckPromise, timeoutPromise]) as any;
      return !!data;
    } catch (error) {
      console.error('Admin permission check failed:', error);
      return false;
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

    // Auth state listener with debouncing
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
      }
    );

    return () => {
      mounted = false;
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
