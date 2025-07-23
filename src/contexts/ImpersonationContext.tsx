import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export const useImpersonation = () => {
  const context = useContext(ImpersonationContext);
  if (context === undefined) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
};

interface ImpersonationProviderProps {
  children: ReactNode;
}

export const ImpersonationProvider = ({ children }: ImpersonationProviderProps) => {
  const [impersonationData, setImpersonationData] = useState<ImpersonationData | null>(null);

  useEffect(() => {
    // Check for impersonation data on mount
    const urlParams = new URLSearchParams(window.location.search);
    const isImpersonated = urlParams.get('impersonated') === 'true';
    const sessionId = urlParams.get('session_id');
    const adminId = urlParams.get('admin_id');

    if (isImpersonated && sessionId && adminId) {
      // Get user data from auth or other source
      // For now, we'll use a placeholder and get real data when auth is available
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
  }, []);

  const isImpersonating = impersonationData !== null;

  return (
    <ImpersonationContext.Provider
      value={{
        isImpersonating,
        impersonationData,
        setImpersonationData,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
};