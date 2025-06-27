
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Ruler, Building, ArrowRight, GripVertical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Project } from '@/types/project';

interface DragDropProjectCardProps {
  project: Project;
  index: number;
  isDragging: boolean;
  dragOverIndex: number | null;
  onDragStart: (e: React.DragEvent, project: Project) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

export const DragDropProjectCard = ({
  project,
  index,
  isDragging,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}: DragDropProjectCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCardClick = () => {
    navigate(`/projeto/${project.id}`);
  };

  const handleActionClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigate(path);
  };

  const isBeingDragged = isDragging;
  const isDropTarget = dragOverIndex === index;

  return (
    <div
      className={`
        relative group transition-all duration-200
        ${isBeingDragged ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'}
        ${isDropTarget ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
      `}
      draggable
      onDragStart={(e) => onDragStart(e, project)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
    >
      {/* Drop Indicator */}
      {isDropTarget && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-blue-400 rounded-full animate-pulse" />
      )}

      {/* Drag Handle */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing">
        <div className="bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm border border-gray-200">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Project Card */}
      <div
        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="p-4 sm:p-6">
          {/* Header do projeto */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 ml-6">
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
              {project.analysis_data ? 'Analisado' : 'Processando'}
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
          <div className="space-y-2 sm:space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={(e) => handleActionClick(e, `/projeto/${project.id}/orcamento`)}
                variant="outline"
                size="sm"
                className="h-8 sm:h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs sm:text-sm"
              >
                <span className="truncate">💰 Orçamento</span>
              </Button>
              
              <Button
                onClick={(e) => handleActionClick(e, `/projeto/${project.id}/assistente`)}
                variant="outline"
                size="sm"
                className="h-8 sm:h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs sm:text-sm"
              >
                <span className="truncate">🤖 IA</span>
              </Button>
            </div>
            
            <Button
              onClick={(e) => handleActionClick(e, `/projeto/${project.id}/cronograma`)}
              variant="outline"
              size="sm"
              className="w-full h-8 sm:h-10 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-xs sm:text-sm"
            >
              <span className="truncate">📅 Cronograma</span>
            </Button>

            <Button
              onClick={handleCardClick}
              className="w-full h-8 sm:h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
            >
              Ver Projeto
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
