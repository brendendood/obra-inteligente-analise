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
        maxWidth: '400px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '20px' }}>🔧</div>
        
        <h2 style={{ 
          color: '#1f2937', 
          fontSize: '18px', 
          fontWeight: '600',
          marginBottom: '12px',
          margin: '0 0 12px 0'
        }}>
          Instabilidade Detectada
        </h2>
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '24px',
          lineHeight: '1.5',
          fontSize: '14px',
          margin: '0 0 24px 0'
        }}>
          Sistema temporariamente instável. Corrigindo automaticamente...
        </p>
        
        <button 
          onClick={handleReset}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginRight: '8px'
          }}
        >
          Tentar Novamente
        </button>
        
        <button 
          onClick={handleReload}
          style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Reiniciar
        </button>
        
        <p style={{ 
          fontSize: '12px', 
          color: '#9ca3af', 
          marginTop: '16px',
          margin: '16px 0 0 0'
        }}>
          Problemas temporários serão resolvidos automaticamente
        </p>
      </div>
    </div>
  );
};