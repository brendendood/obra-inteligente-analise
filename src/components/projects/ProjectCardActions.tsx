
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { useOptimizedProjectNavigation } from '@/hooks/useOptimizedProjectNavigation';

interface ProjectCardActionsProps {
  project: any;
  onDelete: (project: any) => void;
  onEdit: () => void;
  onEditComplete?: () => void;
}

export const ProjectCardActions = ({ project, onDelete, onEdit, onEditComplete }: ProjectCardActionsProps) => {
  const { navigateToProject } = useOptimizedProjectNavigation();

  const handleViewProject = () => {
    console.log('🎯 VER PROJETO: Iniciando navegação para projeto:', project.name);
    navigateToProject(project.id);
  };

  return (
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
          onClick={handleViewProject}
          className="flex items-center space-x-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
        >
          <Eye className="h-4 w-4" />
          <span>Abrir Projeto</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onEdit}
          className="flex items-center space-x-2 hover:bg-green-50 cursor-pointer transition-colors duration-200"
        >
          <Edit className="h-4 w-4" />
          <span>Editar Nome</span>
        </DropdownMenuItem>
        
        {onEditComplete && (
          <DropdownMenuItem 
            onClick={onEditComplete}
            className="flex items-center space-x-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
          >
            <Edit className="h-4 w-4" />
            <span>Editar Projeto Completo</span>
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
  );
};
