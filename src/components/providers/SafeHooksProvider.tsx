import React, { useState, useEffect, createContext, useContext } from 'react';

interface SafeHooksContextType {
  isReactHealthy: boolean;
  error?: string;
}

const SafeHooksContext = createContext<SafeHooksContextType | null>(null);

interface SafeHooksProviderProps {
  children: React.ReactNode;
}

// Simple static check without external dependencies
const checkReactHealthStatic = () => {
  try {
    if (typeof React === 'undefined' || !React) {
      return { isHealthy: false, error: 'React object not found' };
    }
    if (!React.useState || !React.useEffect || !React.createContext) {
      return { isHealthy: false, error: 'React hooks/methods not available' };
    }
    return { isHealthy: true };
  } catch (error) {
    return { 
      isHealthy: false, 
      error: error instanceof Error ? error.message : 'Unknown React error' 
    };
  }
};

export const SafeHooksProvider: React.FC<SafeHooksProviderProps> = ({ children }) => {
  // Verificação de saúde ANTES de usar qualquer hook
  const healthCheck = checkReactHealthStatic();
  
  if (!healthCheck.isHealthy) {
    console.error('🔴 CRITICAL: SafeHooksProvider - React não está saudável:', healthCheck.error);
    
    // Render direto sem hooks em caso de React corrompido
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{ color: '#dc2626', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            Sistema React Corrompido
          </h1>
          <p style={{ color: '#374151', marginBottom: '20px', lineHeight: '1.5' }}>
            ERRO CRÍTICO: {healthCheck.error}
            <br /><br />
            O sistema React não consegue funcionar. Recarregando automaticamente...
          </p>
          <button 
            onClick={() => {
              if ('caches' in window) {
                caches.keys().then(names => names.forEach(name => caches.delete(name)));
              }
              try {
                localStorage.clear();
                sessionStorage.clear();
              } catch (e) {
                console.warn('Storage clear failed:', e);
              }
              window.location.reload();
            }}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Recarregar Sistema
          </button>
        </div>
      </div>
    );
  }

  // Verificação adicional de segurança antes de usar hooks
  let safeToUseHooks = false;
  try {
    if (React && React.useState && React.useEffect && typeof React.useState === 'function') {
      safeToUseHooks = true;
    }
  } catch (error) {
    console.error('🔴 SafeHooksProvider: Hook safety check failed:', error);
    safeToUseHooks = false;
  }

  if (!safeToUseHooks) {
    // Fallback sem hooks se React não está seguro
    return (
      <SafeHooksContext.Provider value={{ isReactHealthy: false, error: 'React hooks não seguros' }}>
        {children}
      </SafeHooksContext.Provider>
    );
  }

  // Se chegou aqui, React está OK - pode usar hooks normalmente
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    // Simplified monitoring without external dependencies
    const checkHealth = () => {
      try {
        if (!React || !React.useState) {
          console.error('🔴 React health degraded');
          setIsHealthy(false);
        }
      } catch (error) {
        console.error('🔴 React health check failed:', error);
        setIsHealthy(false);
      }
    };

    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const contextValue: SafeHooksContextType = {
    isReactHealthy: isHealthy,
    error: healthCheck.error
  };

  return (
    <SafeHooksContext.Provider value={contextValue}>
      {children}
    </SafeHooksContext.Provider>
  );
};

export const useSafeHooks = (): SafeHooksContextType => {
  const context = useContext(SafeHooksContext);
  if (!context) {
    return { isReactHealthy: true }; // Fallback seguro
  }
  return context;
};