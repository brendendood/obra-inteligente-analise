
import { AdminDashboard } from './AdminDashboard';
import { AdminUsersManagement } from './AdminUsersManagement';
import { AdminProjectsManagement } from './AdminProjectsManagement';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminPayments } from './AdminPayments';
import { AdminAIMetrics } from './AdminAIMetrics';
import { AdminReports } from './AdminReports';
import { AdminAlertsManager } from './AdminAlertsManager';

interface AdminContentProps {
  activeTab: string;
}

export const AdminContent = ({ activeTab }: AdminContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsersManagement />;
      case 'projects':
        return <AdminProjectsManagement />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'payments':
        return <AdminPayments />;
      case 'ai-metrics':
        return <AdminAIMetrics />;
      case 'reports':
        return <AdminReports />;
      case 'alerts':
        return <AdminAlertsManager />;
      default:
        return <AdminDashboard />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      users: 'Usuários',
      projects: 'Projetos',
      analytics: 'Analytics',
      payments: 'Pagamentos',
      'ai-metrics': 'IA Metrics',
      reports: 'Relatórios',
      alerts: 'Alertas'
    };
    return titles[activeTab as keyof typeof titles] || 'Dashboard';
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header do Conteúdo */}
      <header className="bg-white shadow-sm border-b px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Painel administrativo da MadenAI
            </p>
          </div>
        </div>
      </header>

      {/* Conteúdo da Página */}
      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        {renderContent()}
      </main>
    </div>
  );
};
