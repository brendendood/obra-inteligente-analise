
import ProjectCard from './ProjectCard';
import ProjectsEmptyState from './ProjectsEmptyState';
import { DropIndicator } from '@/components/ui/DropIndicator';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useProjectActions } from '@/hooks/useProjectActions';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ProjectsGridProps {
  projects: Project[];
  onDeleteProject?: (project: Project) => void;
}

export const ProjectsGrid = ({ projects, onDeleteProject }: ProjectsGridProps) => {
  const { updateProject } = useProjectActions();
  const { toast } = useToast();
  const [orderedProjects, setOrderedProjects] = useState(projects);

  // Drag & Drop
  const {
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  } = useDragAndDrop({
    items: orderedProjects,
    onReorder: (reordered) => {
      setOrderedProjects(reordered);
      const projectOrder = reordered.map(p => p.id);
      localStorage.setItem('projectOrder', JSON.stringify(projectOrder));
      
      toast({
        title: "✅ Ordem atualizada",
        description: "A nova ordem dos projetos foi salva.",
      });
    },
    keyExtractor: (project) => project.id,
  });

  if (projects.length === 0) {
    return <ProjectsEmptyState />;
  }

  const handleDelete = (project: Project) => {
    onDeleteProject?.(project);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orderedProjects.map((project, index) => (
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
          {index === orderedProjects.length - 1 && (
            <DropIndicator {...getDropIndicatorProps(orderedProjects.length)} className="mt-4" />
          )}
        </div>
      ))}
    </div>
  );
};
