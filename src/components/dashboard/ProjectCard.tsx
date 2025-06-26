
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Calendar, Ruler, Building } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProjectCardActions } from './ProjectCardActions';

interface ProjectCardProps {
  project: any;
  index: number;
  draggedItem: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const ProjectCard = ({ 
  project, 
  index, 
  draggedItem, 
  onDragStart, 
  onDragOver, 
  onDrop 
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCardClick = () => {
    navigate(`/projeto/${project.id}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      key={project.id}
      draggable={!isMobile}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
        !isMobile ? 'hover:scale-[1.02]' : ''
      } ${draggedItem === index ? 'opacity-50' : ''}`}
      onClick={handleCardClick}
    >
      {/* Header do projeto */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {project.name}
          </h3>
          <div className="flex items-center space-x-1 mt-1">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {new Date(project.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        
        {/* Badge de status - apenas ícone no mobile */}
        <Badge className="bg-green-100 text-green-700 border-green-200 shrink-0">
          {isMobile ? (
            <span className="text-xs">✓</span>
          ) : (
            'Analisado'
          )}
        </Badge>
      </div>

      {/* Informações do projeto */}
      <div className="space-y-2 mb-4">
        {project.total_area && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Ruler className="h-3 w-3" />
            <span>{project.total_area}m²</span>
          </div>
        )}
        {project.project_type && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Building className="h-3 w-3" />
            <span>{project.project_type}</span>
          </div>
        )}
      </div>

      {/* Ações rápidas */}
      <ProjectCardActions 
        projectId={project.id} 
        onActionClick={handleActionClick}
      />

      {/* Indicador de hover */}
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
    </div>
  );
};
