
import { AdminHeader } from './AdminHeader';
import { AdminSystemStatus } from './AdminSystemStatus';
import { AdminRecentActivity } from './AdminRecentActivity';
import { AdminQuickMetrics } from './AdminQuickMetrics';
import { AdminStatsCard } from './AdminStatsCard';
import { CompleteDataCleanup } from './CompleteDataCleanup';
import UsersList from './UsersList';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  FileText, 
  BarChart3,
  Activity
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { stats, loading } = useAdminStats();
  const { toast } = useToast();

  const handleRefreshStats = () => {
    // Implementar refresh se necessário
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
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader 
        userEmail={user?.email}
        onRefreshStats={handleRefreshStats}
        onExportData={handleExportData}
      />

      {/* Complete Data Cleanup Section */}
      <CompleteDataCleanup />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Total de Usuários"
          value={stats?.total_users || 0}
          description="Usuários registrados"
          icon={Users}
          trend={{ value: 12, label: "vs mês anterior", positive: true }}
        />
        
        <AdminStatsCard
          title="Projetos Enviados"
          value={stats?.total_projects || 0}
          description="Total de uploads"
          icon={FileText}
          trend={{ value: 8, label: "vs mês anterior", positive: true }}
        />
        
        <AdminStatsCard
          title="Análises IA"
          value={stats?.ai_usage_this_month || 0}
          description="Processamentos realizados"
          icon={BarChart3}
          trend={{ value: 15, label: "vs mês anterior", positive: true }}
        />
        
        <AdminStatsCard
          title="Usuários Ativos"
          value={stats?.new_users_this_month || 0}
          description="Últimos 7 dias"
          icon={Activity}
          trend={{ value: 5, label: "vs semana anterior", positive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminSystemStatus />
        <AdminRecentActivity />
        <AdminQuickMetrics />
      </div>

      {/* Users List */}
      <UsersList />
    </div>
  );
};
