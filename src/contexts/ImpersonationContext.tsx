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

// Safe defaults for context
const FALLBACK_IMPERSONATION_STATE: ImpersonationContextType = {
  isImpersonating: false,
  impersonationData: null,
  setImpersonationData: () => {},
};

const ImpersonationContext = React.createContext<ImpersonationContextType>(FALLBACK_IMPERSONATION_STATE);

export const useImpersonation = () => {
  const context = React.useContext(ImpersonationContext);
  if (!context) {
    console.warn('useImpersonation used outside provider, using defaults');
    return FALLBACK_IMPERSONATION_STATE;
  }
  return context;
};

interface ImpersonationProviderProps {
  children: React.ReactNode;
}

// Safe hook check
const isSafeToUseHooks = (): boolean => {
  try {
    const testRef = React.useRef(null);
    return true;
  } catch (error) {
    console.error('🔴 CRITICAL: React hooks not available in ImpersonationProvider:', error);
    return false;
  }
};

export const ImpersonationProvider = ({ children }: ImpersonationProviderProps) => {
  // Emergency fallback if React hooks are corrupted
  if (!isSafeToUseHooks()) {
    console.error('🔴 EMERGENCY: ImpersonationProvider using fallback');
    return (
      <ImpersonationContext.Provider value={FALLBACK_IMPERSONATION_STATE}>
        {children}
      </ImpersonationContext.Provider>
    );
  }

  // Safe hook usage with error boundaries
  let impersonationData: ImpersonationData | null;
  let setImpersonationData: React.Dispatch<React.SetStateAction<ImpersonationData | null>>;
  
  try {
    [impersonationData, setImpersonationData] = React.useState<ImpersonationData | null>(null);
  } catch (error) {
    console.error('🔴 CRITICAL: useState failed in ImpersonationProvider:', error);
    // Emergency fallback render
    return (
      <ImpersonationContext.Provider value={FALLBACK_IMPERSONATION_STATE}>
        {children}
      </ImpersonationContext.Provider>
    );
  }

  React.useEffect(() => {
    try {
      // Check for impersonation data on mount
      const urlParams = new URLSearchParams(window.location.search);
      const isImpersonated = urlParams.get('impersonated') === 'true';
      const sessionId = urlParams.get('session_id');
      const adminId = urlParams.get('admin_id');

      if (isImpersonated && sessionId && adminId) {
        // Get user data from auth or other source
        const savedData = localStorage.getItem('impersonation_data');
        if (savedData) {
          const data = JSON.parse(savedData);
          setImpersonationData(data);
        }
      } else {
        // Check localStorage for existing impersonation session
        const savedData = localStorage.getItem('impersonation_data');
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            setImpersonationData(data);
          } catch (error) {
            console.error('Error parsing impersonation data:', error);
            localStorage.removeItem('impersonation_data');
          }
        }
      }
    } catch (error) {
      console.error('🔴 Error in ImpersonationProvider useEffect:', error);
    }
  }, []);

  const isImpersonating = impersonationData !== null;

  const contextValue = React.useMemo(() => ({
    isImpersonating,
    impersonationData,
    setImpersonationData,
  }), [isImpersonating, impersonationData]);

  return (
    <ImpersonationContext.Provider value={contextValue}>
      {children}
    </ImpersonationContext.Provider>
  );
};