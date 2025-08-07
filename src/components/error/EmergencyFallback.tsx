import React from 'react';

interface EmergencyFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export const EmergencyFallback: React.FC<EmergencyFallbackProps> = ({ 
  error, 
  resetError 
}) => {
  const handleRestart = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => names.forEach(name => caches.delete(name)));
      }
    } catch (e) {
      console.error('Cleanup failed:', e);
    }
    
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center p-8 max-w-md bg-card rounded-lg shadow-lg border">
        <div className="text-4xl mb-4">🔄</div>
        
        <h1 className="text-xl font-semibold mb-3 text-foreground">
          Algo deu errado
        </h1>
        
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Encontramos um problema técnico. Vamos reiniciar o sistema para resolver.
        </p>

        {error && (
          <details className="mb-6 text-left text-xs text-muted-foreground bg-muted p-3 rounded">
            <summary className="cursor-pointer mb-2">
              Ver detalhes
            </summary>
            <code className="break-all">
              {error.message}
            </code>
          </details>
        )}
        
        <button 
          onClick={handleRestart}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Reiniciar Sistema
        </button>
      </div>
    </div>
  );
};