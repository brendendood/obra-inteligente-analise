import React, { useState, useEffect, useContext } from 'react';

interface SafeHooksContextType {
  isReactHealthy: boolean;
  error?: string;
}

// Create context without hooks to avoid React corruption issues
let SafeHooksContext: React.Context<SafeHooksContextType | null> | null = null;

interface SafeHooksProviderProps {
  children: React.ReactNode;
}

// Enhanced static check with more rigorous validation
const checkReactHealthStatic = () => {
  try {
    // Check if React exists and is the correct type
    if (typeof React === 'undefined' || React === null || typeof React !== 'object') {
      return { isHealthy: false, error: 'React object not found or corrupted' };
    }
    
    // Check if React has essential properties
    if (!React.useState || !React.useEffect || !React.createContext) {
      return { isHealthy: false, error: 'React hooks/methods not available' };
    }
    
    // Check if React dispatcher is available (this is what's null in the error)
    try {
      const testDispatcher = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher?.current;
      if (testDispatcher === null) {
        return { isHealthy: false, error: 'React dispatcher is null - React is corrupted' };
      }
    } catch (dispatcherError) {
      // If we can't access dispatcher, that's also a sign of corruption
      return { isHealthy: false, error: 'Cannot access React dispatcher' };
    }
    
    // Try to safely create context
    try {
      if (!SafeHooksContext) {
        SafeHooksContext = React.createContext<SafeHooksContextType | null>(null);
      }
    } catch (contextError) {
      return { isHealthy: false, error: 'Cannot create React context' };
    }
    
    return { isHealthy: true };
  } catch (error) {
    return { 
      isHealthy: false, 
      error: error instanceof Error ? error.message : 'Unknown React error' 
    };
  }
};

// Component class to avoid hooks entirely in case of React corruption
class SafeHooksProviderClass extends React.Component<SafeHooksProviderProps> {
  constructor(props: SafeHooksProviderProps) {
    super(props);
    
    // Check React health immediately in constructor
    const healthCheck = checkReactHealthStatic();
    
    if (!healthCheck.isHealthy) {
      console.error('🔴 CRITICAL: SafeHooksProvider - React corrupted:', healthCheck.error);
      
      // Force immediate page reload to clear corruption
      setTimeout(() => {
        try {
          if ('caches' in window) {
            caches.keys().then(names => names.forEach(name => caches.delete(name)));
          }
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          console.warn('Storage clear failed:', e);
        }
        window.location.reload();
      }, 100);
    }
  }

  render() {
    const healthCheck = checkReactHealthStatic();
    
    if (!healthCheck.isHealthy) {
      // Render error message without any React features
      return React.createElement('div', {
        style: {
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
        }
      }, 
        React.createElement('div', {
          style: {
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center' as const,
            maxWidth: '500px',
            margin: '20px'
          }
        },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '16px' } }, '⚠️'),
          React.createElement('h1', { 
            style: { color: '#dc2626', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' } 
          }, 'Sistema React Corrompido'),
          React.createElement('p', { 
            style: { color: '#374151', marginBottom: '20px', lineHeight: '1.5' } 
          }, `ERRO CRÍTICO: ${healthCheck.error}. Recarregando automaticamente...`)
        )
      );
    }

    // If React is healthy, render normally with context
    if (!SafeHooksContext) {
      return React.createElement('div', {}, this.props.children);
    }

    const contextValue: SafeHooksContextType = {
      isReactHealthy: true,
      error: undefined
    };

    return React.createElement(
      SafeHooksContext.Provider,
      { value: contextValue },
      this.props.children
    );
  }
}

export const SafeHooksProvider: React.FC<SafeHooksProviderProps> = ({ children }) => {
  return React.createElement(SafeHooksProviderClass, { children });
};

export const useSafeHooks = (): SafeHooksContextType => {
  try {
    if (!SafeHooksContext) {
      return { isReactHealthy: false, error: 'SafeHooksContext not available' };
    }
    
    const context = useContext(SafeHooksContext);
    if (!context) {
      return { isReactHealthy: true }; // Fallback seguro
    }
    return context;
  } catch (error) {
    console.error('🔴 useSafeHooks failed:', error);
    return { isReactHealthy: false, error: 'Context access failed' };
  }
};