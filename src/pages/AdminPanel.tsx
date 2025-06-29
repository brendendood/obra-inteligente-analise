import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  BarChart3, 
  CreditCard, 
  Shield,
  Brain
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

  const tabItems = [
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
      id: 'advanced-analytics',
      label: 'Analytics Avançado',
      icon: Brain,
      component: <AdminAdvancedAnalytics />
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">MadenAI Admin</h1>
                  <p className="text-sm text-gray-500">Painel Administrativo</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Super Admin
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/painel'}
              >
                Voltar ao App
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal otimizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabItems.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
