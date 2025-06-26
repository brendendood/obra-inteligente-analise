
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
      className={`group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer w-full min-w-0 max-w-full ${
        draggedItem === index ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'
      }`}
      onClick={handleCardClick}
    >
      {/* Card Content */}
      <div className="p-4 sm:p-6 w-full min-w-0">
        {/* Header do projeto */}
        <div className="flex items-start justify-between mb-4 w-full min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 truncate">
              {project.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-500 truncate">
                {new Date(project.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          
          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">
            Analisado
          </Badge>
        </div>

        {/* Informações do projeto */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {project.total_area && (
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Ruler className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{project.total_area}m²</span>
            </div>
          )}
          {project.project_type && (
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{project.project_type}</span>
            </div>
          )}
        </div>

        {/* Ações rápidas */}
        <div className="space-y-2 sm:space-y-3 w-full">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              onClick={(e) => handleActionClick(e, `/projeto/${project.id}/orcamento`)}
              variant="outline"
              size="sm"
              className="h-8 sm:h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs sm:text-sm min-w-0"
              style={{ fontSize: isMobile ? '12px' : '14px' }}
            >
              <span className="truncate">💰 Orçamento</span>
            </Button>
            
            <Button
              onClick={(e) => handleActionClick(e, `/ia/${project.id}`)}
              variant="outline"
              size="sm"
              className="h-8 sm:h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs sm:text-sm min-w-0"
              style={{ fontSize: isMobile ? '12px' : '14px' }}
            >
              <span className="truncate">🤖 IA</span>
            </Button>
          </div>
          
          <Button
            onClick={(e) => handleActionClick(e, `/projeto/${project.id}/cronograma`)}
            variant="outline"
            size="sm"
            className="w-full h-8 sm:h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs sm:text-sm min-w-0"
            style={{ fontSize: isMobile ? '12px' : '14px' }}
          >
            <span className="truncate">📅 Cronograma</span>
          </Button>

          <Button
            onClick={handleCardClick}
            className="w-full h-8 sm:h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm min-w-0"
            style={{ fontSize: isMobile ? '12px' : '14px' }}
          >
            Ver Projeto
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
};
