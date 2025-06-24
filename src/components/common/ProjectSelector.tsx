
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderOpen } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  project_type?: string;
  total_area?: number;
}

interface ProjectSelectorProps {
  projects: Project[];
  currentProject: Project | null;
  onProjectChange: (projectId: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  currentProject,
  onProjectChange
}) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3 p-4 rounded-xl glass-card">
      <div className="bg-primary p-2 rounded-lg">
        <FolderOpen className="h-5 w-5 text-primary-foreground" />
      </div>
      
      <div className="flex-1">
        <label className="text-sm font-medium text-muted-foreground mb-1 block">
          Projeto Ativo
        </label>
        <Select value={currentProject?.id || ''} onValueChange={onProjectChange}>
          <SelectTrigger className="w-full border-border bg-background">
            <SelectValue placeholder="Selecione um projeto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {project.project_type} {project.total_area && `• ${project.total_area}m²`}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProjectSelector;
