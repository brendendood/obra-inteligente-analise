
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';

interface ProjectsGridProps {
  filteredProjects: any[];
  totalProjects: number;
  onDragStart: (e: React.DragEvent, project: any) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, project: any) => void;
  onDeleteProject: (project: any) => void;
}

const ProjectsGrid = ({ 
  filteredProjects, 
  totalProjects, 
  onDragStart, 
  onDragEnd, 
  onDragOver, 
  onDrop, 
  onDeleteProject 
}: ProjectsGridProps) => {
  const navigate = useNavigate();

  if (filteredProjects.length === 0) {
    return (
      <Card className="border-0 shadow-lg text-center py-8 sm:py-12">
        <CardContent>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
              {totalProjects === 0 ? 'Nenhuma obra encontrada' : 'Nenhum resultado na busca'}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              {totalProjects === 0 
                ? 'Comece enviando seu primeiro projeto PDF'
                : 'Tente ajustar os filtros de busca'
              }
            </p>
            {totalProjects === 0 && (
              <Button 
                onClick={() => navigate('/upload')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Enviar Primeiro Projeto
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
