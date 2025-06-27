
import ProjectCard from './ProjectCard';
import ProjectsEmptyState from './ProjectsEmptyState';
import { DropIndicator } from '@/components/ui/DropIndicator';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { Project } from '@/types/project';

interface ProjectsGridProps {
  projects: Project[];
  onDeleteProject?: (project: Project) => void;
}

export const ProjectsGrid = ({ projects, onDeleteProject }: ProjectsGridProps) => {
  const {
    updateProject,
    // Drag & Drop
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  } = useProjectsLogic();

  if (projects.length === 0) {
    return <ProjectsEmptyState />;
  }

  const handleDelete = (project: Project) => {
    onDeleteProject?.(project);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
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
              onDelete={() => handleDelete(project)}
              onUpdate={updateProject}
            />
          </div>
          
          {/* Drop Indicator no final */}
          {index === projects.length - 1 && (
            <DropIndicator {...getDropIndicatorProps(projects.length)} className="mt-4" />
          )}
        </div>
      ))}
    </div>
  );
};
