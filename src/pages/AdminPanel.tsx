
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminUsersManagement } from '@/components/admin/AdminUsersManagement';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  BarChart3, 
  CreditCard, 
  Settings,
  Shield,
  Brain
} from 'lucide-react';

const AdminPanel = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminStats();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Loading state
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões administrativas...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
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
      component: (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Gestão de Projetos em desenvolvimento</p>
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Analytics avançadas em desenvolvimento</p>
        </div>
      )
    },
    {
      id: 'payments',
      label: 'Pagamentos',
      icon: CreditCard,
      component: (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Gestão de Pagamentos em desenvolvimento</p>
        </div>
      )
    },
    {
      id: 'ai-metrics',
      label: 'IA Metrics',
      icon: Brain,
      component: (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Métricas de IA em desenvolvimento</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2"
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
