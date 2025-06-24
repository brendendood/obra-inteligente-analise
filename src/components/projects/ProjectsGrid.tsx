
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';

interface Project {
  id: string;
  name: string;
  analysis_data?: any;
  project_type?: string;
  total_area?: number;
  created_at: string;
}

interface ProjectsGridProps {
  projects: Project[];
  filteredProjects: Project[];
  editingProject: string | null;
  editName: string;
  onStartEdit: (projectId: string, currentName: string) => void;
  onSaveEdit: (projectId: string, newName: string) => void;
  onCancelEdit: () => void;
  onEditNameChange: (name: string) => void;
}

const ProjectsGrid = ({
  projects,
  filteredProjects,
  editingProject,
  editName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditNameChange
}: ProjectsGridProps) => {
  const navigate = useNavigate();

  if (filteredProjects.length === 0) {
    return (
      <Card className="shadow-lg border-0 text-center py-12">
        <CardContent>
          <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            {projects.length === 0 ? 'Nenhuma obra encontrada' : 'Nenhum resultado encontrado'}
          </h3>
          <p className="text-slate-500 mb-6">
            {projects.length === 0 
              ? 'Comece enviando seu primeiro projeto'
              : 'Tente ajustar os filtros de busca'
            }
          </p>
          {projects.length === 0 && (
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Enviar Primeiro Projeto
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          editingProject={editingProject}
          editName={editName}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEditNameChange={onEditNameChange}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
