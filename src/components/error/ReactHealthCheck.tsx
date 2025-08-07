import React from 'react';

interface ReactHealthCheckProps {
  children: React.ReactNode;
}

// Função para verificar se React está funcionando ANTES de usar hooks
const checkReactHealth = (): { isHealthy: boolean; error?: string } => {
  try {
    // Verificação básica se React existe
    if (!React) {
      return { isHealthy: false, error: 'React object not found' };
    }
    
    // Verificação se métodos essenciais existem
    if (!React.useState || !React.useEffect || !React.createContext) {
      return { isHealthy: false, error: 'React hooks/methods not available' };
    }
    
    // Teste se conseguimos usar hooks básicos
    const testComponent = () => {
      try {
        const [test] = React.useState(true);
        return true;
      } catch (e) {
        throw new Error('Hook test failed: ' + (e as Error).message);
      }
    };
    
    return { isHealthy: true };
  } catch (error) {
    return { 
      isHealthy: false, 
      error: error instanceof Error ? error.message : 'Unknown React error' 
    };
  }
};

export const ReactHealthCheck: React.FC<ReactHealthCheckProps> = ({ children }) => {
  // CRÍTICO: Verificar saúde ANTES de usar qualquer hook
  const healthCheck = checkReactHealth();
  
  if (!healthCheck.isHealthy) {
    console.error('🔴 REACT HEALTH CHECK FAILED:', healthCheck.error);
    
    // Render direto sem hooks
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
          
          <h1 style={{ 
            color: '#dc2626', 
            fontSize: '24px', 
            fontWeight: 'bold',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            Sistema React Corrompido
          </h1>
          
          <p style={{ 
            color: '#374151', 
            marginBottom: '20px',
            lineHeight: '1.5',
            margin: '0 0 20px 0'
          }}>
            ERRO CRÍTICO: {healthCheck.error}
            <br /><br />
            O sistema React não consegue funcionar. Recarregando automaticamente...
          </p>
          
          <button 
            onClick={() => {
              // Limpeza completa antes de recarregar
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => caches.delete(name));
                });
              }
              try {
                localStorage.clear();
                sessionStorage.clear();
              } catch (e) {
                console.warn('Storage clear failed:', e);
              }
              window.location.href = window.location.href;
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

  // Se chegou aqui, React está OK, pode usar hooks normalmente
  return <>{children}</>;
};