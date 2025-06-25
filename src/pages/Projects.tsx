
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  BarChart3, 
  Building2,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Projects = () => {
  const navigate = useNavigate();
  const {
    projects,
    filteredProjects,
    isLoading,
    loading,
    isAuthenticated,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    deleteProject,
    setDeleteProject,
    handleDeleteProject,
  } = useProjectsLogic();

  if (loading || isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando seus projetos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return <ErrorFallback title="Acesso Negado" message="Você precisa estar logado para ver seus projetos." />;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header da página */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Projetos</h1>
              <p className="text-gray-600">
                Gerencie e acesse todos os seus projetos de construção
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Projeto</span>
            </Button>
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              
              <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'area') => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-50 border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="date">Mais Recentes</SelectItem>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="area">Maior Área</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Building2 className="h-4 w-4" />
                <span>{projects.length} projeto(s)</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>{projects.filter(p => p.analysis_data).length} analisado(s)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade de projetos */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 bg-white"
                onClick={() => navigate(`/projeto/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {project.name}
                      </CardTitle>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteProject(project);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={project.analysis_data ? "default" : "secondary"}
                        className={project.analysis_data 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {project.analysis_data ? 'Analisado' : 'Processando'}
                      </Badge>
                      
                      {project.total_area && (
                        <span className="text-sm font-medium text-gray-600">
                          {project.total_area.toFixed(0)}m²
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {project.project_type && (
                      <p className="text-sm text-gray-600 truncate">
                        Tipo: {project.project_type}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {projects.length === 0 ? 'Nenhum projeto encontrado' : 'Nenhum resultado na busca'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {projects.length === 0 
                    ? 'Comece enviando seu primeiro projeto PDF para análise com IA.'
                    : 'Tente ajustar os filtros de busca ou criar um novo projeto.'
                  }
                </p>
                <Button 
                  onClick={() => navigate('/upload')}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {projects.length === 0 ? 'Enviar Primeiro Projeto' : 'Novo Projeto'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog de confirmação de exclusão */}
        <AlertDialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
          <AlertDialogContent className="bg-white border border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">Excluir Projeto</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Tem certeza que deseja excluir o projeto "{deleteProject?.name}"? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-50">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteProject && handleDeleteProject(deleteProject.id)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default Projects;
