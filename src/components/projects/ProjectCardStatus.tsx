
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Clock, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectCardStatusProps {
  project: any;
}

export const ProjectCardStatus = ({ project }: ProjectCardStatusProps) => {
  const isMobile = useIsMobile();

  const getStatusBadge = (project: any) => {
    if (project.analysis_data) {
      if (isMobile) {
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
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Processado
          </Badge>
        );
      }
    }
    
    if (isMobile) {
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
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          Processando
        </Badge>
      );
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {getStatusBadge(project)}
      {project.project_type && (
        <Badge variant="outline" className="text-xs">
          {project.project_type}
        </Badge>
      )}
    </div>
  );
};
