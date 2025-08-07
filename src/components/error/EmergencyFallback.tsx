import React from 'react';

interface EmergencyFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export const EmergencyFallback: React.FC<EmergencyFallbackProps> = ({ 
  error, 
  resetError 
}) => {
  const handleReload = () => {
    // Clear all caches and force reload
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear localStorage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Storage clear failed:', e);
    }
    
    // Force reload
    window.location.reload();
  };

  const handleReset = () => {
    if (resetError) {
      resetError();
    } else {
      handleReload();
    }
  };

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
          Detectamos um erro crítico no sistema React (múltiplas instâncias ou hooks corrompidos).
          {error && (
            <>
              <br /><br />
              <strong>Erro:</strong> {error.message}
            </>
          )}
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={handleReset}
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
            Tentar Novamente
          </button>
          
          <button 
            onClick={handleReload}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Recarregar Completo
          </button>
        </div>
        
        <p style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          marginTop: '16px',
          margin: '16px 0 0 0'
        }}>
          Este erro é causado por múltiplas instâncias do React. O recarregamento deve resolver.
        </p>
      </div>
    </div>
  );
};