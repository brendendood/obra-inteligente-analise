
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { EnhancedBreadcrumb } from '@/components/navigation/EnhancedBreadcrumb';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { ProjectEditDialog } from '@/components/projects/ProjectEditDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import ProjectsPageHeader from '@/components/projects/ProjectsPageHeader';
import ProjectsFiltersBar from '@/components/projects/ProjectsFiltersBar';
import ProjectsEmptyState from '@/components/projects/ProjectsEmptyState';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
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

  const analyzedProjects = projects.filter(p => p.analysis_data).length;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <EnhancedBreadcrumb />
        
        <ProjectsPageHeader />

        <ProjectsFiltersBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalProjects={projects.length}
          analyzedProjects={analyzedProjects}
        />

        {filteredProjects.length > 0 ? (
          <ProjectsGrid />
        ) : (
          <ProjectsEmptyState hasProjects={projects.length > 0} />
        )}

        <ProjectEditDialog
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveProject}
        />

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
