import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminUsersManagement } from '@/components/admin/AdminUsersManagement';
import { AdminProjectsManagement } from '@/components/admin/AdminProjectsManagement';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminPayments } from '@/components/admin/AdminPayments';
import { AdminAIMetrics } from '@/components/admin/AdminAIMetrics';
import { AdminAdvancedAnalytics } from '@/components/admin/AdminAdvancedAnalytics';
import { AdminReports } from '@/components/admin/AdminReports';
import { AdminAlertsManager } from '@/components/admin/AdminAlertsManager';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  BarChart3, 
  CreditCard, 
  Shield,
  Brain,
  FileText,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-700">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Você não possui permissões administrativas para acessar este painel.
            </p>
            <Button onClick={() => window.location.href = '/painel'}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('✅ ADMIN PANEL: Usuário admin confirmado, renderizando painel');

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      component: <AdminDashboard />
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      component: <AdminUsersManagement />
    },
    {
      id: 'projects',
      label: 'Projetos',
      icon: FolderOpen,
      component: <AdminProjectsManagement />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: <AdminAnalytics />
    },
    {
      id: 'payments',
      label: 'Pagamentos',
      icon: CreditCard,
      component: <AdminPayments />
    },
    {
      id: 'ai-metrics',
      label: 'IA Metrics',
      icon: Brain,
      component: <AdminAIMetrics />
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: FileText,
      component: <AdminReports />
    },
    {
      id: 'alerts',
      label: 'Alertas',
      icon: Bell,
      component: <AdminAlertsManager />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Vertical */}
      <div className="w-64 bg-white shadow-lg border-r flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">MadenAI</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
            Super Admin
          </Badge>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-xs"
              onClick={() => window.location.href = '/painel'}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Voltar ao App
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header do Conteúdo */}
        <header className="bg-white shadow-sm border-b px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Painel administrativo da MadenAI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="flex-1 p-8 overflow-auto">
          {sidebarItems.find(item => item.id === activeTab)?.component}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
