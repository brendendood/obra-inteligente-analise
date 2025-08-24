
import React, { Suspense, ComponentType } from 'react';
import { UnifiedLoading } from './unified-loading';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
}

// Error Boundary simples sem dependências externas
class SimpleErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: () => React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: () => React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
    
    // Se é erro de carregamento de módulo, tenta recarregar automaticamente
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback();
      }
      
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar</h2>
            <p className="text-gray-600">{this.state.error?.message || 'Erro desconhecido'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const DefaultFallback = () => <UnifiedLoading />;

export const LazyWrapper = ({ 
  children, 
  fallback: Fallback = DefaultFallback
}: LazyWrapperProps) => {
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      window.location.reload();
    }
  };

  return (
    <SimpleErrorBoundary fallback={() => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erro ao carregar módulo
          </h2>
          <p className="text-gray-600 mb-4">
            Falha no carregamento dinâmico. Tentativa {retryCount + 1}/{maxRetries + 1}
          </p>
          {retryCount < maxRetries ? (
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          ) : (
            <button 
              onClick={() => window.location.href = '/painel'}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Voltar ao Dashboard
            </button>
          )}
        </div>
      </div>
    )}>
      <Suspense fallback={<Fallback />}>
        {children}
      </Suspense>
    </SimpleErrorBoundary>
  );
};

// HOC para criar componentes lazy facilmente
export const withLazyWrapper = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ComponentType
) => {
  return (props: P) => (
    <LazyWrapper fallback={fallback}>
      <Component {...props} />
    </LazyWrapper>
  );
};
