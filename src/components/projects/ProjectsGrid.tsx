
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
              className={`relative transition-all duration-300 ${
                isDragging ? 'select-none' : ''
              } hover:scale-[1.02] hover:shadow-lg`}
            >
              {/* Project Card with all required props */}
              <ProjectCard
                project={project}
                onDragStart={(e) => getDragItemProps(project, index).onDragStart?.(e)}
                onDragEnd={(e) => getDragItemProps(project, index).onDragEnd?.(e)}
                onDragOver={(e) => getDropZoneProps(index).onDragOver?.(e)}
                onDrop={(e) => getDropZoneProps(index).onDrop?.(e)}
                onEdit={() => {}}
                onDelete={() => setDeleteProject(project)}
                onUpdate={updateProject}
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
