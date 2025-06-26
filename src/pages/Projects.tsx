
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { ProjectEditDialog } from '@/components/projects/ProjectEditDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { FolderOpen, Search, Plus, Filter } from 'lucide-react';
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
        <div className="space-y-8">
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

  const analyzedProjects = projects.filter(p => p.analysis_data).length;

  return (
    <AppLayout>
      <div className="space-y-8">
        <EnhancedBreadcrumb />
        
        {/* Header clean e minimalista */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Meus Projetos
              </h1>
              <p className="text-lg text-gray-600">
                Gerencie todos os seus projetos de construção
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/upload'}
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Filtros e busca simplificados */}
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 h-10 border-gray-200">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mais recentes</SelectItem>
                    <SelectItem value="oldest">Mais antigos</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                    <SelectItem value="name-desc">Nome Z-A</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="text-sm text-gray-500">
                  {filteredProjects.length} de {projects.length} projetos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de projetos ou estado vazio */}
        {filteredProjects.length > 0 ? (
          <ProjectsGrid />
        ) : (
          <Card className="border border-gray-200 bg-white">
            <CardContent className="text-center py-16">
              <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {projects.length === 0 ? 'Nenhum projeto ainda' : 'Nenhum projeto encontrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {projects.length === 0 
                  ? 'Comece criando seu primeiro projeto'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
              {projects.length === 0 && (
                <Button 
                  onClick={() => window.location.href = '/upload'}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <ProjectEditDialog
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveProject}
        />

        <AlertDialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
          <AlertDialogContent className="bg-white border border-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 text-xl">Excluir Projeto</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-base">
                Tem certeza que deseja excluir o projeto "{deleteProject?.name}"? 
                <br />
                <strong className="text-red-600">Esta ação não pode ser desfeita.</strong>
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
