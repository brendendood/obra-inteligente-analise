
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, BarChart3, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardContentProps {
  project: any;
}

export const ProjectCardContent = ({ project }: ProjectCardContentProps) => {
  const navigate = useNavigate();

  return (
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
  );
};
