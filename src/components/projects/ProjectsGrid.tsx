
import { useState } from 'react';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import ProjectCard from '@/components/projects/ProjectCard';
import { ProjectEditDialog } from '@/components/projects/ProjectEditDialog';
import { useMobile } from '@/hooks/use-mobile';

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
  const isMobile = useMobile();

  const handleEditProject = (project: any) => {
    setEditingProject(project);
  };

  const handleSaveProject = (updatedProject: any) => {
    updateProject(updatedProject);
    setEditingProject(null);
  };

  if (isMobile) {
    // Layout grid vertical para mobile
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        <ProjectEditDialog
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveProject}
        />
      </>
    );
  }

  // Layout horizontal para desktop
  return (
    <>
      <div className="relative">
        {/* Indicadores de scroll */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm text-gray-500">
            {projects.length} projeto(s) • Arraste horizontalmente para navegar
          </span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Container horizontal com scroll */}
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-6 min-w-max">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in flex-shrink-0 w-80"
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

        {/* Gradiente de indicação de scroll */}
        <div className="absolute right-0 top-12 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
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
