
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Bot, 
  Calculator, 
  Calendar, 
  FileText, 
  BarChart3,
  Clock,
  CheckCircle,
  Plus,
  Settings,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useProject } from '@/contexts/ProjectContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const { currentProject, loadUserProjects } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProjects();
    }
  }, [isAuthenticated, loadUserProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const quickActions = [
    {
      icon: <FolderOpen className="h-6 w-6 text-indigo-600" />,
      title: "Minhas Obras",
      description: "Gerenciar todos os projetos",
      path: "/obras",
      color: "from-indigo-100 to-indigo-200"
    },
    {
      icon: <Upload className="h-6 w-6 text-blue-600" />,
      title: "Novo Projeto",
      description: "Enviar e analisar projeto PDF",
      path: "/upload",
      color: "from-blue-100 to-blue-200"
    },
    {
      icon: <Bot className="h-6 w-6 text-purple-600" />,
      title: "Assistente IA",
      description: "Chat com IA técnica",
      path: "/assistant",
      color: "from-purple-100 to-purple-200"
    },
    {
      icon: <Calculator className="h-6 w-6 text-orange-600" />,
      title: "Orçamento",
      description: "Gerar orçamento SINAPI",
      path: "/budget",
      color: "from-orange-100 to-orange-200",
      requiresProject: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Bem-vindo, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-slate-600">
                Gerencie seus projetos com inteligência artificial
              </p>
            </div>
            
            {/* Admin Access Button */}
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Painel Admin</span>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Projetos Ativos
              </CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {currentProject ? 1 : 0}
              </div>
              <p className="text-xs text-slate-600">
                {currentProject ? 'Projeto em análise' : 'Nenhum projeto ativo'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Análises Feitas
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {currentProject ? 1 : 0}
              </div>
              <p className="text-xs text-slate-600">
                Análises com IA
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Tempo Economizado
              </CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {currentProject ? '2h' : '0h'}
              </div>
              <p className="text-xs text-slate-600">
                Em análises manuais
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Project */}
        {currentProject && (
          <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                Projeto Ativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-bold text-green-900">{currentProject.name}</p>
                  <p className="text-green-700">
                    {currentProject.total_area ? `Área: ${currentProject.total_area}m² • ` : ''}
                    Tipo: {currentProject.project_type}
                  </p>
                  <p className="text-sm text-green-600">
                    Analisado em {new Date(currentProject.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    ✅ Processado
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    📊 Analisado
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    🤖 IA contextualizada
                  </span>
                </div>
                <Button 
                  onClick={() => navigate(`/obra/${currentProject.id}`)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Ver Detalhes da Obra
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const isDisabled = action.requiresProject && !currentProject;
              
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => !isDisabled && navigate(action.path)}
                >
                  <CardHeader className="pb-4">
                    <div className={`bg-gradient-to-br ${action.color} p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 mb-3`}>
                      {action.icon}
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {action.description}
                      {isDisabled && (
                        <span className="block text-xs text-slate-400 mt-1">
                          Requer projeto ativo
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Getting Started */}
        {!currentProject && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <Plus className="h-6 w-6 mr-3" />
                Começar Primeiro Projeto
              </CardTitle>
              <CardDescription className="text-blue-100">
                Envie seu primeiro projeto e veja a IA em ação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-blue-50">
                  Você ainda não tem projetos. Comece enviando um arquivo PDF para análise 
                  automática com nossa IA especializada.
                </p>
                <Button 
                  onClick={() => navigate('/upload')}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Primeiro Projeto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
