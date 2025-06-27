
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Building, Calendar, Ruler } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  total_area?: number;
  project_type?: string;
  created_at: string;
}

interface ProjectDetailHeaderProps {
  project: Project;
  onBackClick: () => void;
}

export const ProjectDetailHeader = ({ project, onBackClick }: ProjectDetailHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600">
          {project.total_area && (
            <div className="flex items-center space-x-1">
              <Ruler className="h-4 w-4" />
              <span>Área: {project.total_area}m²</span>
            </div>
          )}
          {project.project_type && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Building className="h-3 w-3" />
              <span>{project.project_type}</span>
            </Badge>
          )}
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <Badge className="bg-green-100 text-green-800 border-green-200">
          ✅ Projeto Processado
        </Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onBackClick}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Projetos
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Retornar à lista de projetos</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
