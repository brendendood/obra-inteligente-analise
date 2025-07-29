
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, Clock, Check, FileText, Play, CheckCircle2, Archive } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectCardStatusProps {
  project: any;
}

export const ProjectCardStatus = ({ project }: ProjectCardStatusProps) => {
  const isMobile = useIsMobile();

  const getProjectStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { 
        icon: FileText, 
        label: 'Rascunho', 
        className: 'bg-gray-100 text-gray-800 border-gray-200' 
      },
      active: { 
        icon: Play, 
        label: 'Ativo', 
        className: 'bg-blue-100 text-blue-800 border-blue-200' 
      },
      completed: { 
        icon: CheckCircle2, 
        label: 'Concluído', 
        className: 'bg-green-100 text-green-800 border-green-200' 
      },
      archived: { 
        icon: Archive, 
        label: 'Arquivado', 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    
    return (
      <Badge className={`text-xs ${config.className}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

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
      {project.project_status && getProjectStatusBadge(project.project_status)}
    </div>
  );
};
