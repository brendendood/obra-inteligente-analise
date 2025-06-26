
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Eye,
  MoreVertical,
  Calendar,
  CheckCircle,
  Clock,
  GripVertical,
  Trash2,
  Edit,
  BarChart3,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';

interface ProjectCardProps {
  project: any;
  onDragStart: (e: React.DragEvent, project: any) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, project: any) => void;
  onDelete: (project: any) => void;
  onEdit?: (project: any) => void;
}

const ProjectCard = ({ 
  project, 
  onDragStart, 
  onDragEnd, 
  onDragOver, 
  onDrop, 
  onDelete,
  onEdit 
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const getStatusBadge = (project: any) => {
    if (project.analysis_data) {
      if (isMobile) {
        // Mobile: apenas ícone
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full border border-green-200">
                <Check className="h-3 w-3 text-green-700" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Projeto processado</p>
            </TooltipContent>
          </Tooltip>
        );
      } else {
        // Desktop: texto completo
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Processado
          </Badge>
        );
      }
    }
    
    if (isMobile) {
      // Mobile: apenas ícone
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full border border-orange-200">
              <Clock className="h-3 w-3 text-orange-700" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Processando projeto</p>
          </TooltipContent>
        </Tooltip>
      );
    } else {
      // Desktop: texto completo
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          Processando
        </Badge>
      );
    }
  };

  return (
    <Card 
      draggable
      onDragStart={(e) => onDragStart(e, project)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, project)}
      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing group hover:scale-[1.02] animate-fade-in relative"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 flex-1 min-w-0">
            <GripVertical className="h-5 w-5 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {project.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {getStatusBadge(project)}
                {project.project_type && (
                  <Badge variant="outline" className="text-xs">
                    {project.project_type}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 hover:bg-gray-100 absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
              <DropdownMenuItem 
                onClick={() => navigate(`/projeto/${project.id}`)}
                className="flex items-center space-x-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
              >
                <Eye className="h-4 w-4" />
                <span>Abrir Projeto</span>
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem 
                  onClick={() => onEdit(project)}
                  className="flex items-center space-x-2 hover:bg-green-50 cursor-pointer transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(project)}
                className="flex items-center space-x-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {project.total_area && (
            <div className="text-sm text-gray-600 flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Área: {project.total_area}m²</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(project.created_at).toLocaleDateString('pt-BR')}
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => navigate(`/projeto/${project.id}`)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Projeto
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Acessar todas as ferramentas do projeto</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
