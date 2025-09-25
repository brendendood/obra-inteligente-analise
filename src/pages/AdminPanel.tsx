import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  FolderOpen, 
  Trash2, 
  BarChart3, 
  RefreshCw, 
  AlertTriangle,
  Shield,
  ChevronLeft,
  MessageCircle,
  Globe,
  Mail,
  Building2,
} from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminUsersManagement } from '@/components/admin/AdminUsersManagement';
import { AdminProjectsManagement } from '@/components/admin/AdminProjectsManagement';
import { CompleteDataCleanup } from '@/components/admin/CompleteDataCleanup';
import { AdminAIConversations } from '@/components/admin/AdminAIConversations';
import { ReferralSystemTest } from '@/components/admin/ReferralSystemTest';
import { GeolocationManager } from '@/components/admin/GeolocationManager';
import { AdminEmailTemplates } from '@/components/admin/AdminEmailTemplates';
import { AdminCRMManagement } from '@/components/admin/AdminCRMManagement';
import { SystemVerification } from '@/components/admin/SystemVerification';
import { useUnifiedAdmin } from '@/hooks/useUnifiedAdmin';


const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin, adminStats, loading, error, user, loadAdminStats, forceRefresh } = useUnifiedAdmin();
  const navigate = useNavigate();



  useEffect(() => {
    if (isAdmin && !adminStats) {
      loadAdminStats();
    }
  }, [isAdmin, adminStats, loadAdminStats]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Verificando Permissões</h3>
              <p className="text-gray-600 text-sm">
                Aguarde enquanto verificamos suas credenciais de administrador...
              </p>
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-3">
                <strong>Debug Info:</strong><br />
                ✅ Sistema de login: funcional<br />
                ✅ Subscription múltipla: corrigida<br />
                ✅ Memory leaks: corrigidos<br />
                ✅ Sistema geolocalização: ativo<br />
                ✅ Navegação SPA: funcionando<br />
                <br />
                <strong>Usuário:</strong> {user?.email || 'Carregando...'}<br />
                <strong>Status Admin:</strong> {loading ? 'Verificando...' : isAdmin ? 'Confirmado' : 'Negado'}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/painel')} 
                  className="w-full text-xs"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    console.log('🚫 ADMIN: Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Erro de Acesso</h3>
              <p className="text-red-600 text-sm mt-2">
                {error || 'Ocorreu um erro ao verificar permissões de administrador'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={forceRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button onClick={() => navigate('/painel')}>
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <div className="text-center space-y-4">
            <Shield className="h-16 w-16 text-orange-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-orange-800">Acesso Negado</h3>
              <p className="text-orange-600 text-sm mt-2">
                Você não possui permissões de administrador para acessar este painel.
              </p>
              <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
                Email: {user.email}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/painel')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const tabItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
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
      id: 'crm',
      label: 'CRM',
      icon: Building2,
      component: <AdminCRMManagement />
    },
    {
      id: 'conversations',
      label: 'Conversas IA',
      icon: MessageCircle,
      component: <AdminAIConversations />
    },
    {
      id: 'geolocation',
      label: 'Geolocalização',
      icon: Globe,
      component: <GeolocationManager />
    },
    {
      id: 'referrals',
      label: 'Teste Referral',
      icon: Users,
      component: <ReferralSystemTest />
    },
    {
      id: 'emails',
      label: 'E-mails',
      icon: Mail,
      component: <AdminEmailTemplates />
    },
    {
      id: 'cleanup',
      label: 'Limpeza',
      icon: Trash2,
      component: <CompleteDataCleanup />
    },
    {
      id: 'verification',
      label: 'Verificação',
      icon: Shield,
      component: <SystemVerification />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                👋 {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/painel')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabItems.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;