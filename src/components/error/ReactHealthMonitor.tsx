import React from 'react';

interface ReactHealthMonitorProps {
  children: React.ReactNode;
  onHealthCheckFail?: () => void;
}

// Test React health WITHOUT using hooks
const testReactHealth = (): boolean => {
  try {
    // Check if React object exists
    if (!React || typeof React !== 'object') {
      console.error('🔴 HEALTH: React object missing');
      return false;
    }

    // Check essential React methods
    if (!React.useState || !React.useEffect || !React.createContext) {
      console.error('🔴 HEALTH: React methods missing');
      return false;
    }

    // Check React internals for corruption (optional check)
    try {
      const internals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      if (!internals) {
        console.warn('⚠️ HEALTH: React internals missing - non-critical');
      }
    } catch (e) {
      console.warn('⚠️ HEALTH: React internals check failed - non-critical');
    }

    return true;
  } catch (error) {
    console.error('🔴 HEALTH: React health test failed:', error);
    return false;
  }
};

export const ReactHealthMonitor: React.FC<ReactHealthMonitorProps> = ({ 
  children, 
  onHealthCheckFail 
}) => {
  // Pre-hook health check
  if (!testReactHealth()) {
    console.error('🔴 CRITICAL: React health check failed - switching to emergency mode');
    
    if (onHealthCheckFail) {
      onHealthCheckFail();
    }

    // Emergency render without hooks
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔧</div>
          
          <h2 style={{ 
            color: '#1f2937', 
            fontSize: '20px', 
            fontWeight: '600',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>
            Sistema em Manutenção
          </h2>
          
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '24px',
            lineHeight: '1.5',
            margin: '0 0 24px 0'
          }}>
            Detectamos uma instabilidade técnica. Corrigindo automaticamente...
          </p>
          
          <button 
            onClick={() => {
              // Clean and reload
              try {
                localStorage.clear();
                sessionStorage.clear();
              } catch (e) {}
              window.location.href = '/';
            }}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Reiniciar Sistema
          </button>
        </div>
      </div>
    );
  }

  // React is healthy, render normally
  return <>{children}</>;
};