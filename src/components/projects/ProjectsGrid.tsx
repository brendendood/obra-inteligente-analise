
import { ProjectCardEnhanced } from '@/components/ui/project-card-enhanced';
import { Project } from '@/types/project';

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProjectCardEnhanced
            project={project}
            showQuickActions={true}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectsGrid;
