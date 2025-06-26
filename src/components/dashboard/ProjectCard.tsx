
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Ruler, Building, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const handleActionClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigate(path);
  };

  return (
    <div
      key={project.id}
      className={`group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer ${
        draggedItem === index ? 'opacity-50' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header do projeto */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base mb-2">
            {project.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {new Date(project.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        
        <Badge className="bg-green-50 text-green-700 border-green-200 shrink-0">
          Analisado
        </Badge>
      </div>

      {/* Informações do projeto */}
      <div className="space-y-3 mb-6">
        {project.total_area && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Ruler className="h-4 w-4" />
            <span>{project.total_area}m²</span>
          </div>
        )}
        {project.project_type && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building className="h-4 w-4" />
            <span>{project.project_type}</span>
          </div>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={(e) => handleActionClick(e, `/projeto/${project.id}/orcamento`)}
            variant="outline"
            size="sm"
            className="h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
          >
            💰 Orçamento
          </Button>
          
          <Button
            onClick={(e) => handleActionClick(e, `/ia/${project.id}`)}
            variant="outline"
            size="sm"
            className="h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
          >
            🤖 IA
          </Button>
        </div>
        
        <Button
          onClick={(e) => handleActionClick(e, `/projeto/${project.id}/cronograma`)}
          variant="outline"
          size="sm"
          className="w-full h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
        >
          📅 Cronograma
        </Button>

        <Button
          onClick={handleCardClick}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Ver Projeto
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
