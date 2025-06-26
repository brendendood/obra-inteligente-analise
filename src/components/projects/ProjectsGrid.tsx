
import { useState } from 'react';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import ProjectCard from '@/components/projects/ProjectCard';
import { ProjectEditDialog } from '@/components/projects/ProjectEditDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectsGridProps { 
  projects: any[];
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  const {
    setDeleteProject,
    handleDeleteProject,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    updateProject,
  } = useProjectsLogic();

  const [editingProject, setEditingProject] = useState<any>(null);
  const isMobile = useIsMobile();

  const handleEditProject = (project: any) => {
    setEditingProject(project);
  };

  const handleSaveProject = (updatedProject: any) => {
    updateProject(updatedProject);
    setEditingProject(null);
  };

  // Layout vertical responsivo para todas as telas - utilizando melhor o espaço
  return (
    <>
      <div className="w-full max-w-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProjectCard
                project={project}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDelete={setDeleteProject}
                onEdit={handleEditProject}
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectEditDialog
        project={editingProject}
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveProject}
      />
    </>
  );
};

export default ProjectsGrid;
