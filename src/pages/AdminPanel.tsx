
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminUsersManagement } from '@/components/admin/AdminUsersManagement';
import { AdminProjectsManagement } from '@/components/admin/AdminProjectsManagement';
import { CompleteDataCleanup } from '@/components/admin/CompleteDataCleanup';
import { LoginHistoryTable } from '@/components/admin/LoginHistoryTable';
import { useUnifiedAdmin } from '@/hooks/useUnifiedAdmin';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Shield,
  AlertCircle,
  RefreshCw,
  Database
} from 'lucide-react';

const AdminPanel = () => {
  const { isAdmin, loading, error, user, forceRefresh } = useUnifiedAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('🔄 ADMIN PANEL: Renderizando...', { loading, isAdmin, error, user: user?.email });

  // Loading com debug detalhado
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <CardTitle>Verificando Acesso Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="break-all">{user?.email || 'Não logado'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <Badge variant="secondary">Verificando...</Badge>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">
                🔍 Executando verificação tripla de permissões...
              </p>
              <div className="space-y-2">
                <Button variant="outline" onClick={forceRefresh} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Forçar Nova Verificação
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => window.location.reload()} 
                  className="w-full text-xs"
                >
                  🆘 Recarregar Página (Emergência)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tratamento de erro melhorado
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-700">Erro no Painel Admin</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Usuário: {user?.email}
              </p>
              <Button onClick={forceRefresh} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/painel'}>
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirecionamento se não autenticado
  if (!user) {
    console.log('🔒 ADMIN PANEL: Não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Acesso negado se não é admin
  if (!isAdmin) {
    console.log('❌ ADMIN PANEL: Usuário não é admin:', user.email);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-700">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Você não possui permissões administrativas para acessar este painel.
            </p>
            <p className="text-sm text-gray-500">
              Usuário: {user.email}
            </p>
            <div className="space-y-2">
              <Button onClick={forceRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Verificar Permissões Novamente
              </Button>
              <Button onClick={() => window.location.href = '/painel'}>
                Voltar ao Dashboard
              </Button>
            </div>
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
      component: (
        <div className="space-y-6">
          <AdminUsersManagement />
          <LoginHistoryTable />
        </div>
      )
    },
    {
      id: 'projects',
      label: 'Projetos',
      icon: FolderOpen,
      component: <AdminProjectsManagement />
    },
    {
      id: 'cleanup',
      label: 'Limpeza',
      icon: Database,
      component: <CompleteDataCleanup />
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
                {user.email}
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

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 text-sm"
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
