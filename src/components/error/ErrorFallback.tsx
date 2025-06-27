
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

export const ErrorFallback = ({ 
  error, 
  resetError, 
  title = "Oops! Algo deu errado",
  message = "Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial."
}: ErrorFallbackProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/painel', { replace: true });
  };

  const handleGoToProjects = () => {
    navigate('/projetos', { replace: true });
  };

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              <p className="text-gray-600 text-sm">{message}</p>
              
              {error && process.env.NODE_ENV === 'development' && (
                <details className="mt-4 p-3 bg-gray-100 rounded text-left">
                  <summary className="cursor-pointer text-sm font-medium">
                    Detalhes técnicos
                  </summary>
                  <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handleRefresh} variant="outline" className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Tentar Novamente</span>
              </Button>
              <Button onClick={handleGoToProjects} className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Ver Projetos</span>
              </Button>
              <Button onClick={handleGoHome} variant="ghost" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Ir para o Painel</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
