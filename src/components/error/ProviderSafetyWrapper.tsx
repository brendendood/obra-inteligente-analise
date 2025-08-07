import React from 'react';
import { ReactHealthMonitor } from './ReactHealthMonitor';
import { EmergencyAuthProvider } from './EmergencyAuthProvider';
import { EmergencyProjectProvider } from './EmergencyProjectProvider';
import { EmergencyImpersonationProvider } from './EmergencyImpersonationProvider';

interface ProviderSafetyWrapperProps {
  children: React.ReactNode;
  NormalProviders: React.ComponentType<{ children: React.ReactNode }>;
}

export const ProviderSafetyWrapper: React.FC<ProviderSafetyWrapperProps> = ({ 
  children, 
  NormalProviders 
}) => {
  const [useEmergencyMode, setUseEmergencyMode] = React.useState(false);

  const handleHealthCheckFail = React.useCallback(() => {
    console.error('🚨 CRITICAL: Switching to emergency providers');
    setUseEmergencyMode(true);
  }, []);

  return (
    <ReactHealthMonitor onHealthCheckFail={handleHealthCheckFail}>
      {useEmergencyMode ? (
        // Emergency provider stack
        <EmergencyAuthProvider>
          <EmergencyImpersonationProvider>
            <EmergencyProjectProvider>
              {children}
            </EmergencyProjectProvider>
          </EmergencyImpersonationProvider>
        </EmergencyAuthProvider>
      ) : (
        // Normal provider stack with error boundary
        <ErrorBoundary onError={handleHealthCheckFail}>
          <NormalProviders>
            {children}
          </NormalProviders>
        </ErrorBoundary>
      )}
    </ReactHealthMonitor>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 PROVIDER ERROR:', error, errorInfo);
    
    // Check if it's a React hook error
    if (error.message.includes('useState') || 
        error.message.includes('useEffect') || 
        error.message.includes('Invalid hook call')) {
      console.error('🚨 HOOK ERROR DETECTED: Switching to emergency mode');
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      // Switch to emergency mode
      this.props.onError();
      return null;
    }

    return this.props.children;
  }
}