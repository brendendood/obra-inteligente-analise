
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
  });

  // Use refs to prevent unnecessary re-renders during HMR
  const lastAuthEventRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para tracking de login integrada
  const trackLoginLocation = useCallback(async (user: User) => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              // Buscar último login para este usuário
              const { data: lastLogin, error } = await supabase
                .from('user_login_history')
                .select('id')
                .eq('user_id', user.id)
                .order('login_at', { ascending: false })
                .limit(1)
                .single();

              if (!error && lastLogin) {
                // Buscar informações da cidade
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`);
                const locationData = await response.json();
                
                // Atualizar com dados reais
                await supabase
                  .from('user_login_history')
                  .update({
                    latitude: latitude,
                    longitude: longitude,
                    city: locationData.city || locationData.locality || 'Desconhecida',
                    region: locationData.principalSubdivision || 'Desconhecido',
                    country: locationData.countryName || 'Brasil'
                  })
                  .eq('id', lastLogin.id);
                
                console.log('📍 Localização real capturada:', {
                  lat: latitude,
                  lng: longitude,
                  city: locationData.city,
                  region: locationData.principalSubdivision
                });
              }
            } catch (error) {
              console.error('Erro ao buscar dados de localização:', error);
            }
          },
          (error) => {
            console.warn('Não foi possível obter localização:', error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      }
    } catch (error) {
      console.error('Erro no tracking de localização:', error);
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

    // Initial auth check
    refreshAuth();

    // Auth state listener with improved HMR handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Prevent duplicate events during HMR
        const eventKey = `${event}-${session?.user?.id || 'null'}`;
        if (lastAuthEventRef.current === eventKey) {
          console.log('🔄 AUTH: Duplicate event ignored for HMR:', event);
          return;
        }
        lastAuthEventRef.current = eventKey;
        
        // Clear existing debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        // Debounce auth state changes for better HMR
        debounceTimerRef.current = setTimeout(async () => {
          console.log('🔄 AUTH: Processing state change:', event);
          
          const user = session?.user || null;

          setState({
            user,
            session,
            loading: false,
            isAuthenticated: !!user && !!session,
          });

          // Ativar tracking de login quando usuário faz login
          if (event === 'SIGNED_IN' && user) {
            console.log('📍 Iniciando tracking de localização para login real...');
            setTimeout(() => trackLoginLocation(user), 1000);
          }
        }, import.meta.env.DEV ? 100 : 0); // Small delay in development
      }
    );

    return () => {
      mounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      subscription.unsubscribe();
    };
  }, [refreshAuth, trackLoginLocation]);

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
