
import { AppLayout } from '@/components/layout/AppLayout';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsFilters from '@/components/projects/ProjectsFilters';
import ProjectsStats from '@/components/projects/ProjectsStats';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import ProjectDeleteDialog from '@/components/projects/ProjectDeleteDialog';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { ErrorFallback } from '@/components/error/ErrorFallback';

const Projects = () => {
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
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
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
      <div className="space-y-6 sm:space-y-8">
        <ProjectsHeader />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          <ProjectsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <ProjectsStats
            totalProjects={projects.length}
            processedProjects={projects.filter(p => p.analysis_data).length}
          />
        </div>

        <ProjectsGrid
          filteredProjects={filteredProjects}
          totalProjects={projects.length}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDeleteProject={setDeleteProject}
        />

        <ProjectDeleteDialog
          project={deleteProject}
          isOpen={!!deleteProject}
          onClose={() => setDeleteProject(null)}
          onConfirm={() => deleteProject && handleDeleteProject(deleteProject.id)}
        />
      </div>
    </AppLayout>
  );
};

export default Projects;
