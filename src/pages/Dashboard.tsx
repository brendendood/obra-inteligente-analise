
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  Plus, 
  TrendingUp, 
  FileText, 
  Clock,
  BarChart3,
  Calculator,
  Users,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/contexts/ProjectContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const { loadUserProjects, clearAllProjects } = useProject();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    timeSaved: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      console.log('Carregando projetos no Dashboard...');
      const userProjects = await loadUserProjects();
      console.log('Projetos carregados no Dashboard:', userProjects);
      setProjects(userProjects);
      
      // Calcular estatísticas com dados reais
      const totalArea = userProjects.reduce((sum: number, project: any) => {
        return sum + (project.total_area || 0);
      }, 0);

      const recentProjects = userProjects.filter((project: any) => {
        const createdAt = new Date(project.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length;

      const newStats = {
        totalProjects: userProjects.length,
        totalArea,
        recentProjects,
        timeSaved: userProjects.length * 2 // 2 horas por projeto
      };

      setStats(newStats);

      console.log('Estatísticas calculadas:', newStats);
    } catch (error) {
      console.error('Erro ao carregar projetos no Dashboard:', error);
      // Em caso de erro, limpar estado local
      clearAllProjects();
      setProjects([]);
      setStats({
        totalProjects: 0,
        totalArea: 0,
        recentProjects: 0,
        timeSaved: 0
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleDeleteAllProjects = async () => {
    try {
      console.log('Excluindo todos os projetos...');
      
      // Buscar todos os projetos do usuário
      const { data: userProjects, error: fetchError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user?.id);

      if (fetchError) throw fetchError;

      if (userProjects && userProjects.length > 0) {
        // Excluir todos os projetos
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('user_id', user?.id);

        if (deleteError) throw deleteError;

        console.log(`${userProjects.length} projetos excluídos com sucesso`);
        
        // Limpar estado local e dados
        clearAllProjects();
        setProjects([]);
        setStats({
          totalProjects: 0,
          totalArea: 0,
          recentProjects: 0,
          timeSaved: 0
        });
        
        toast({
          title: "✅ Projetos excluídos!",
          description: `${userProjects.length} projeto(s) foram removidos com sucesso.`,
        });
      } else {
        toast({
          title: "ℹ️ Nenhum projeto encontrado",
          description: "Não há projetos para excluir.",
        });
      }
      
      setShowDeleteAll(false);
    } catch (error) {
      console.error('Erro ao excluir projetos:', error);
      toast({
        title: "❌ Erro ao excluir",
        description: "Não foi possível excluir os projetos.",
        variant: "destructive",
      });
      setShowDeleteAll(false);
    }
  };

  if (loading || isLoadingProjects) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const quickActions = [
    {
      icon: Plus,
      title: "Nova Obra",
      description: "Enviar novo projeto",
      path: "/upload",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      icon: FolderOpen,
      title: "Ver Obras",
      description: "Todos os projetos",
      path: "/obras",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      icon: Calculator,
      title: "Orçamento",
      description: "Gerar orçamento",
      path: "/budget",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600">
              Gerencie seus projetos com inteligência artificial
            </p>
          </div>
          
          {projects.length > 0 && (
            <Button 
              variant="destructive"
              onClick={() => setShowDeleteAll(true)}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir Todos os Projetos</span>
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-800">
                  Total de Projetos
                </CardTitle>
                <FolderOpen className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {stats.totalProjects}
              </div>
              <p className="text-xs text-blue-700">
                Projetos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-800">
                  Área Total
                </CardTitle>
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {stats.totalArea.toLocaleString()}m²
              </div>
              <p className="text-xs text-green-700">
                Área construída total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-800">
                  Últimos 7 dias
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {stats.recentProjects}
              </div>
              <p className="text-xs text-purple-700">
                Novos projetos
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-800">
                  Tempo Economizado
                </CardTitle>
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 mb-1">
                {stats.timeSaved}h
              </div>
              <p className="text-xs text-orange-700">
                Em análises manuais
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${action.color} ${action.hoverColor} transition-colors`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Projetos Recentes</h2>
              <Button 
                variant="outline" 
                onClick={() => navigate('/obras')}
                className="flex items-center space-x-2"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Ver Todos</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <Card 
                  key={project.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/obra/${project.id}`)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-900 line-clamp-2">
                      {project.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.total_area && (
                        <p className="text-sm text-gray-600">
                          Área: {project.total_area}m²
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <Card className="border-0 shadow-lg text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Comece enviando seu primeiro projeto
              </p>
              <Button 
                onClick={() => navigate('/upload')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Enviar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete All Projects Dialog */}
        <AlertDialog open={showDeleteAll} onOpenChange={setShowDeleteAll}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão de todos os projetos</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir TODOS os seus projetos? 
                Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAllProjects}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir Todos os Projetos
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
