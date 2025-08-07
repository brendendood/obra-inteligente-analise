import { Component, createContext, ReactNode } from 'react';
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

// Fallback state
const FALLBACK_AUTH_STATE: AuthState = {
  user: null,
  session: null,
  loading: false,
  isAuthenticated: false,
};

// Create context
export const AuthContext = createContext<AuthContextType>({
  ...FALLBACK_AUTH_STATE,
  refreshAuth: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthProviderState extends AuthState {}

export class AuthProvider extends Component<AuthProviderProps, AuthProviderState> {
  private mounted = true;
  private subscription: any = null;

  constructor(props: AuthProviderProps) {
    super(props);
    this.state = {
      user: null,
      session: null,
      loading: true,
      isAuthenticated: false,
    };

    this.refreshAuth = this.refreshAuth.bind(this);
  }

  async componentDidMount() {
    this.mounted = true;
    
    // Initial auth check
    await this.refreshAuth();

    // Setup auth listener
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!this.mounted) return;
        
        console.log('🔄 AUTH: Processing state change:', event);
        
        const user = session?.user || null;
        const isAuthenticated = !!user && !!session;

        if (this.mounted) {
          this.setState({
            user,
            session,
            loading: false,
            isAuthenticated,
          });
        }

        // Simple redirect logic
        if (event === 'SIGNED_IN' && isAuthenticated && window.location.pathname === '/login') {
          console.log('✅ AUTH: Redirecting after SIGNED_IN');
          setTimeout(() => {
            window.location.href = '/painel';
          }, 100);
        }

        // Background IP capture
        if (event === 'SIGNED_IN' && user) {
          console.log('📊 AUTH: Login detected for:', user.email);
          
          setTimeout(async () => {
            try {
              let realIP = null;
              try {
                const response = await fetch('https://ipapi.co/ip/');
                if (response.ok) {
                  realIP = (await response.text()).trim();
                }
              } catch (e) {
                console.warn('IP capture failed:', e);
              }
              
              await supabase.functions.invoke('capture-real-ip', {
                body: { 
                  user_id: user.id,
                  force_capture: true,
                  frontend_ip: realIP
                }
              });
            } catch (error) {
              console.error('IP capture error:', error);
            }
          }, 2000);
        }
      });
      
      this.subscription = data.subscription;
    } catch (error) {
      console.error('🔴 AUTH: Failed to setup listener:', error);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    console.log('🧹 AUTH: Cleaning up...');
    
    if (this.subscription) {
      try {
        this.subscription.unsubscribe();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
      this.subscription = null;
    }
  }

  async refreshAuth() {
    if (!this.mounted) return;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🔴 AUTH: Error getting session:', error);
        if (this.mounted) {
          this.setState(prev => ({ ...prev, loading: false }));
        }
        return;
      }

      const user = session?.user || null;
      const isAuthenticated = !!user && !!session;

      if (this.mounted) {
        this.setState({
          user,
          session,
          loading: false,
          isAuthenticated,
        });
      }

      // Simple redirect logic - only on login page
      if (isAuthenticated && window.location.pathname === '/login') {
        console.log('✅ AUTH: Redirecting to dashboard after successful login');
        setTimeout(() => {
          window.location.href = '/painel';
        }, 100);
      }
    } catch (error) {
      console.error('🔴 AUTH: Refresh error:', error);
      if (this.mounted) {
        this.setState({ user: null, session: null, loading: false, isAuthenticated: false });
      }
    }
  }

  render() {
    const contextValue: AuthContextType = {
      ...this.state,
      refreshAuth: this.refreshAuth,
    };

    return (
      <AuthContext.Provider value={contextValue}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}