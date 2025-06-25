
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { ProjectCardEnhanced } from '@/components/ui/project-card-enhanced';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { ProjectEditDialog } from '@/components/projects/ProjectEditDialog';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { 
  Plus, 
  Search, 
  Filter, 
  Building2,
  BarChart3,
  Zap
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
  const { preferences, addRecentProject } = useUserPreferences();
  const [editingProject, setEditingProject] = useState<any>(null);
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
    updateProject,
  } = useProjectsLogic();

  const handleEditProject = (project: any) => {
    setEditingProject(project);
  };

  const handleSaveProject = (updatedProject: any) => {
    updateProject(updatedProject);
    setEditingProject(null);
  };

  if (loading || isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <EnhancedBreadcrumb />
          <EnhancedSkeleton variant="card" className="h-32" />
          <EnhancedSkeleton variant="card" className="h-20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <EnhancedSkeleton key={i} variant="card" />
            ))}
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
      <div className="space-y-6 animate-fade-in">
        <EnhancedBreadcrumb />
        
        {/* Header da página com MadenAI */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Projetos</h1>
                <p className="text-gray-600">
                  Gerencie e analise seus projetos com inteligência artificial MadenAI
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Projeto</span>
            </Button>
          </div>
        </div>

        {/* Filtros e busca melhorados */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all duration-200"
                />
              </div>
              
              <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'area') => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-50 border-gray-200 hover:bg-white transition-all duration-200">
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

        {/* Grade de projetos melhorada */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCardEnhanced
                  project={project}
                  showQuickActions={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {projects.length === 0 ? 'Nenhum projeto encontrado' : 'Nenhum resultado na busca'}
              </h3>
              <p className="text-gray-600 mb-6">
                {projects.length === 0 
                  ? 'Comece enviando seu primeiro projeto PDF para análise com IA MadenAI.'
                  : 'Tente ajustar os filtros de busca ou criar um novo projeto.'
                }
              </p>
              <Button 
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                {projects.length === 0 ? 'Enviar Primeiro Projeto' : 'Novo Projeto'}
              </Button>
            </div>
          </div>
        )}

        {/* Dialog de edição */}
        <ProjectEditDialog
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveProject}
        />

        {/* Dialog de confirmação de exclusão */}
        <AlertDialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
          <AlertDialogContent className="bg-white border border-gray-200 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 text-xl">Excluir Projeto</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-base">
                Tem certeza que deseja excluir o projeto "{deleteProject?.name}"? 
                <br />
                <strong className="text-red-600">Esta ação não pode ser desfeita.</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteProject && handleDeleteProject(deleteProject.id)}
                className="bg-red-600 text-white hover:bg-red-700 shadow-lg transition-all duration-200"
              >
                Excluir Projeto
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default Projects;
