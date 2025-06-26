
import ProjectCard from './ProjectCard';
import ProjectDeleteDialog from './ProjectDeleteDialog';
import { ProjectEditDialog } from './ProjectEditDialog';
import ProjectsEmptyState from './ProjectsEmptyState';
import { DropIndicator } from '@/components/ui/DropIndicator';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { GripVertical } from 'lucide-react';

export const ProjectsGrid = () => {
  const {
    filteredProjects,
    isLoading,
    deleteProject,
    setDeleteProject,
    handleDeleteProject,
    updateProject,
    // Drag & Drop
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  } = useProjectsLogic();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return <ProjectsEmptyState hasProjects={false} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <div key={project.id} className="relative group">
            {/* Drop Indicator */}
            <DropIndicator {...getDropIndicatorProps(index)} className="mb-4" />
            
            {/* Project Card Container */}
            <div
              {...getDragItemProps(project, index)}
              {...getDropZoneProps(index)}
              className={`relative transition-all duration-300 ${
                isDragging ? 'select-none' : ''
              } hover:scale-[1.02] hover:shadow-lg`}
            >
              {/* Drag Handle */}
              <div className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing hover:bg-white">
                <GripVertical className="h-4 w-4 text-gray-600" />
              </div>
              
              {/* Project Card */}
              <ProjectCard
                project={project}
                onEdit={() => {}}
                onDelete={() => setDeleteProject(project)}
              />
            </div>
            
            {/* Drop Indicator no final */}
            {index === filteredProjects.length - 1 && (
              <DropIndicator {...getDropIndicatorProps(filteredProjects.length)} className="mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <ProjectDeleteDialog
        project={deleteProject}
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={() => {
          if (deleteProject) {
            handleDeleteProject(deleteProject.id);
          }
        }}
      />
    </>
  );
};
