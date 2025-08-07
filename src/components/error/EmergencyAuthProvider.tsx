import React from 'react';

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  refreshAuth: () => Promise<void>;
}

// Emergency auth state using localStorage only
const getEmergencyAuthState = (): AuthState => {
  try {
    const storedUser = localStorage.getItem('emergency_user');
    const storedSession = localStorage.getItem('emergency_session');
    
    if (storedUser && storedSession) {
      return {
        user: JSON.parse(storedUser),
        session: JSON.parse(storedSession),
        loading: false,
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.warn('Emergency auth state read failed:', error);
  }
  
  return {
    user: null,
    session: null,
    loading: false,
    isAuthenticated: false
  };
};

const emergencyAuthState = getEmergencyAuthState();

export const EmergencyAuthContext = React.createContext<AuthContextType>({
  ...emergencyAuthState,
  refreshAuth: async () => {},
});

interface EmergencyAuthProviderProps {
  children: React.ReactNode;
}

export const EmergencyAuthProvider: React.FC<EmergencyAuthProviderProps> = ({ children }) => {
  const [state, setState] = React.useState<AuthState>(emergencyAuthState);

  const refreshAuth = React.useCallback(async () => {
    console.log('🚨 EMERGENCY: Using localStorage auth only');
    setState(getEmergencyAuthState());
  }, []);

  const contextValue = React.useMemo(() => ({
    ...state,
    refreshAuth,
  }), [state, refreshAuth]);

  return (
    <EmergencyAuthContext.Provider value={contextValue}>
      {children}
    </EmergencyAuthContext.Provider>
  );
};