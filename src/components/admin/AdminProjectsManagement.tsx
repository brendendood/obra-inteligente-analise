
import { ProjectsHeader } from './projects/ProjectsHeader';
import { ProjectsFilters } from './projects/ProjectsFilters';
import { ProjectsTable } from './projects/ProjectsTable';
import { useAdminProjects } from '@/hooks/useAdminProjects';

export const AdminProjectsManagement = () => {
  const {
    projects,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    updateProjectStatus,
    deleteProject,
    clearFilters
  } = useAdminProjects();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectsHeader totalProjects={projects.length} />
      
      <ProjectsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
        onClearFilters={clearFilters}
      />

      <ProjectsTable
        projects={projects}
        onUpdateStatus={updateProjectStatus}
        onDelete={deleteProject}
      />
    </div>
  );
};
