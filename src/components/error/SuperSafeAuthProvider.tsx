import React from 'react';

// Verificação EXTREMA de segurança para React
const isReactSafe = (): boolean => {
  try {
    // Verificar se React existe globalmente
    if (typeof React === 'undefined') {
      console.error('🔴 CRITICAL: React is undefined');
      return false;
    }
    
    // Verificar se métodos essenciais existem
    if (!React.useState || !React.useEffect || !React.createContext) {
      console.error('🔴 CRITICAL: React methods missing');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('🔴 CRITICAL: React check failed:', error);
    return false;
  }
};

// Fallback para quando React está corrompido
const CriticalErrorFallback: React.FC<{ error?: string }> = ({ error }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#dc2626',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{ fontSize: '72px', marginBottom: '20px' }}>💥</div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        SISTEMA CORROMPIDO
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '30px', lineHeight: '1.5' }}>
        React não está funcionando corretamente.
        <br />
        {error && `Erro: ${error}`}
        <br />
        Recarregando automaticamente...
      </p>
      <button 
        onClick={() => {
          // Limpeza TOTAL
          try {
            localStorage.clear();
            sessionStorage.clear();
            if ('caches' in window) {
              caches.keys().then(names => names.forEach(name => caches.delete(name)));
            }
          } catch (e) {
            console.error('Cleanup failed:', e);
          }
          // Força reload completo
          window.location.href = '/';
        }}
        style={{
          backgroundColor: 'white',
          color: '#dc2626',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        REINICIAR SISTEMA
      </button>
    </div>
  </div>
);

interface SuperSafeAuthProviderProps {
  children: React.ReactNode;
}

export const SuperSafeAuthProvider: React.FC<SuperSafeAuthProviderProps> = ({ 
  children 
}) => {
  // Verificação ANTES de qualquer hook
  if (!isReactSafe()) {
    return <CriticalErrorFallback error="React não está disponível" />;
  }
  
  // Se chegou aqui, React está OK
  try {
    // Importar AuthProvider dinamicamente
    const { AuthProvider } = require('@/contexts/AuthProvider');
    return <AuthProvider>{children}</AuthProvider>;
  } catch (error) {
    console.error('🔴 CRITICAL: AuthProvider failed to load:', error);
    return <CriticalErrorFallback error="AuthProvider falhou" />;
  }
};