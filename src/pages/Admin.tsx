
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  BarChart3,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSystemStatus } from '@/components/admin/AdminSystemStatus';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { AdminQuickMetrics } from '@/components/admin/AdminQuickMetrics';
import UsersList from '@/components/admin/UsersList';
import { CompleteDataCleanup } from '@/components/admin/CompleteDataCleanup';

const Admin = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { isAdmin, adminStats, loading: adminLoading, loadAdminStats } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "🔐 Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate, toast]);

  useEffect(() => {
    if (!adminLoading && isAuthenticated && !isAdmin) {
      toast({
        title: "🚫 Acesso restrito",
        description: "Você não tem permissão para acessar o painel administrativo.",
        variant: "destructive",
      });
      navigate('/painel');
    }
  }, [isAdmin, adminLoading, isAuthenticated, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminStats();
    }
  }, [isAdmin, loadAdminStats]);

  const handleRefreshStats = () => {
    loadAdminStats();
    toast({
      title: "📊 Dados atualizados",
      description: "Estatísticas recarregadas com sucesso.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "📁 Exportação iniciada",
      description: "Os dados estão sendo preparados para download.",
    });
    // Implementar lógica de exportação
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminHeader 
          userEmail={user?.email}
          onRefreshStats={handleRefreshStats}
          onExportData={handleExportData}
        />

        {/* Complete Data Cleanup Section */}
        <div className="mb-8">
          <CompleteDataCleanup />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total de Usuários"
            value={adminStats?.total_users || 0}
            description="Usuários registrados"
            icon={Users}
            trend={{ value: 12, label: "vs mês anterior", positive: true }}
          />
          
          <AdminStatsCard
            title="Projetos Enviados"
            value={adminStats?.total_projects || 0}
            description="Total de uploads"
            icon={FileText}
            trend={{ value: 8, label: "vs mês anterior", positive: true }}
          />
          
          <AdminStatsCard
            title="Análises IA"
            value={adminStats?.total_analyses || 0}
            description="Processamentos realizados"
            icon={BarChart3}
            trend={{ value: 15, label: "vs mês anterior", positive: true }}
          />
          
          <AdminStatsCard
            title="Usuários Ativos"
            value={adminStats?.active_users_week || 0}
            description="Últimos 7 dias"
            icon={Activity}
            trend={{ value: 5, label: "vs semana anterior", positive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AdminSystemStatus />
          <AdminRecentActivity />
          <AdminQuickMetrics />
        </div>

        {/* Users List */}
        <UsersList />
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
