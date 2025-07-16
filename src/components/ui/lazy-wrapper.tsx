import React, { Suspense, ComponentType } from 'react';
import { SmartLoading } from './smart-loading';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
}

// Error Boundary simples sem dependências externas
class SimpleErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
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

const DefaultFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <SmartLoading 
      isLoading={true}
      loadingText="Carregando..."
      hasData={false}
    />
  </div>
);

export const LazyWrapper = ({ 
  children, 
  fallback: Fallback = DefaultFallback
}: LazyWrapperProps) => {
  return (
    <SimpleErrorBoundary>
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