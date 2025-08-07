import React, { useEffect, useState } from 'react';

interface ReactHealthCheckProps {
  children: React.ReactNode;
}

export const ReactHealthCheck: React.FC<ReactHealthCheckProps> = ({ children }) => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if React hooks are working properly
    try {
      // Test basic hook functionality
      const testState = useState(true);
      if (!testState || typeof testState[1] !== 'function') {
        throw new Error('useState hook is not functioning properly');
      }
      
      // Check if React context is available
      if (!React.createContext) {
        throw new Error('React.createContext is not available');
      }

      setIsHealthy(true);
      setError(null);
    } catch (err) {
      console.error('🔴 REACT HEALTH CHECK FAILED:', err);
      setIsHealthy(false);
      setError(err instanceof Error ? err.message : 'Unknown React error');
    }
  }, []);

  if (!isHealthy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            React System Error
          </h1>
          <p className="text-gray-700 mb-4">
            Erro crítico detectado no sistema React: {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Recarregar Sistema
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};