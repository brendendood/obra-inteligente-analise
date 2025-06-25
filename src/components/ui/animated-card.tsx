
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
  Edit,
  Trash2,
  BarChart3,
  Zap
} from 'lucide-react';

interface AnimatedProjectCardProps {
  project: any;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AnimatedProjectCard = ({ 
  project, 
  onClick, 
  onEdit, 
  onDelete 
}: AnimatedProjectCardProps) => {
  const getStatusBadge = (project: any) => {
    if (project.analysis_data) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 transition-all duration-200 hover:bg-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Processado
        </Badge>
      );
    }
    return (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200 transition-all duration-200 hover:bg-orange-200">
        <Clock className="h-3 w-3 mr-1" />
        <Zap className="h-3 w-3 ml-1 animate-pulse" />
      </Badge>
    );
  };

  return (
    <Card 
      className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] animate-fade-in card-hover"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 font-semibold">
              {project.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {getStatusBadge(project)}
              {project.project_type && (
                <Badge 
                  variant="outline" 
                  className="text-xs hover:bg-gray-50 transition-colors duration-200"
                >
                  {project.project_type}
                </Badge>
              )}
            </div>
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-xl">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="flex items-center space-x-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                >
                  <Eye className="h-4 w-4" />
                  <span>Abrir Projeto</span>
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="flex items-center space-x-2 hover:bg-green-50 cursor-pointer transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {project.total_area && (
            <div className="text-sm text-gray-600 flex items-center space-x-1">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Área: {project.total_area}m²</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span>Abrir Projeto</span>
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
