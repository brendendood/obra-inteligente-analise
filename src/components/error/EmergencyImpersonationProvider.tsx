import React from 'react';

interface ImpersonationData {
  sessionId: string;
  targetUser: {
    id: string;
    name: string;
    email: string;
  };
  adminId: string;
}

interface ImpersonationContextType {
  isImpersonating: boolean;
  impersonationData: ImpersonationData | null;
  setImpersonationData: (data: ImpersonationData | null) => void;
}

// Emergency impersonation state using sessionStorage only
const getEmergencyImpersonationData = (): ImpersonationData | null => {
  try {
    const stored = sessionStorage.getItem('emergency_impersonation');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Emergency impersonation read failed:', error);
    return null;
  }
};

export const EmergencyImpersonationContext = React.createContext<ImpersonationContextType>({
  isImpersonating: false,
  impersonationData: null,
  setImpersonationData: () => {},
});

interface EmergencyImpersonationProviderProps {
  children: React.ReactNode;
}

export const EmergencyImpersonationProvider: React.FC<EmergencyImpersonationProviderProps> = ({ children }) => {
  const [impersonationData, setImpersonationDataState] = React.useState<ImpersonationData | null>(
    getEmergencyImpersonationData()
  );

  const setImpersonationData = React.useCallback((data: ImpersonationData | null) => {
    setImpersonationDataState(data);
    try {
      if (data) {
        sessionStorage.setItem('emergency_impersonation', JSON.stringify(data));
      } else {
        sessionStorage.removeItem('emergency_impersonation');
      }
    } catch (error) {
      console.warn('Emergency impersonation save failed:', error);
    }
  }, []);

  const contextValue = React.useMemo(() => ({
    isImpersonating: !!impersonationData,
    impersonationData,
    setImpersonationData,
  }), [impersonationData, setImpersonationData]);

  return (
    <EmergencyImpersonationContext.Provider value={contextValue}>
      {children}
    </EmergencyImpersonationContext.Provider>
  );
};