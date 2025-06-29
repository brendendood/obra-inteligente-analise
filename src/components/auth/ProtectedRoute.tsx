
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  console.log('🔒 PROTECTED ROUTE: Verificando acesso', { loading, isAuthenticated });

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado, redirecionar para login
  if (!isAuthenticated) {
    console.log('🔒 PROTECTED ROUTE: Usuário não autenticado, redirecionando');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ PROTECTED ROUTE: Acesso autorizado');
  return <>{children}</>;
};

export default ProtectedRoute;
