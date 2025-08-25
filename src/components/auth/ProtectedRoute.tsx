
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageConstructionLoading } from '@/components/ui/construction-loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Timeout duro para evitar loading infinito
    timeoutRef.current = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ PROTECTED_ROUTE: Timeout atingido, forçando navegação para login');
        navigate('/login');
      }
    }, 8000); // 8 segundos de timeout máximo

    // Se não está carregando e não está autenticado, redirecionar
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, loading, navigate]);

  // Limpar timeout quando o loading terminar
  useEffect(() => {
    if (!loading && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageConstructionLoading text="Verificando autenticação..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
