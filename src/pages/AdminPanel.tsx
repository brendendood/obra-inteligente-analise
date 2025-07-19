
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminContent } from '@/components/admin/AdminContent';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/hooks/useAuth';

const AdminPanel = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminStats();
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('🔄 ADMIN PANEL: Renderizando...', { authLoading, adminLoading, isAuthenticated, isAdmin });

  // Loading otimizado
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  // Redirecionamentos otimizados
  if (!isAuthenticated) {
    console.log('🔒 ADMIN PANEL: Não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('❌ ADMIN PANEL: Usuário não é admin');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-700 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">
            Você não possui permissões administrativas para acessar este painel.
          </p>
          <button 
            onClick={() => window.location.href = '/painel'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ ADMIN PANEL: Usuário admin confirmado, renderizando painel');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={user?.email}
      />
      <AdminContent activeTab={activeTab} />
    </div>
  );
};

export default AdminPanel;
