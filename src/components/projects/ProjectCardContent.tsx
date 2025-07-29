
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, BarChart3, Eye, FolderOpen, CalendarDays, Play, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardContentProps {
  project: any;
}

export const ProjectCardContent = ({ project }: ProjectCardContentProps) => {
  const navigate = useNavigate();

  // Debug: Log do projeto completo
  console.log('🔍 ProjectCardContent - Dados do projeto:', project);
  console.log('🔍 ProjectCardContent - Campos específicos:', {
    project_type: project.project_type,
    description: project.description,
    start_date: project.start_date,
    end_date: project.end_date,
    total_area: project.total_area
  });

  return (
    <CardContent>
      <div className="space-y-3">
        {/* Informações principais */}
        <div className="space-y-2">
          {project.project_type && (
            <div className="text-sm text-muted-foreground flex items-center space-x-1">
              <FolderOpen className="h-4 w-4" />
              <span className="font-medium">{project.project_type}</span>
            </div>
          )}
          
          {project.total_area && (
            <div className="text-sm text-muted-foreground flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Área: {project.total_area}m²</span>
            </div>
          )}
        </div>

        {/* Datas do projeto */}
        {(project.start_date || project.end_date) && (
          <div className="space-y-1.5">
            {project.start_date && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Play className="h-4 w-4 mr-2" />
                <span>Início: {new Date(project.start_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            {project.end_date && (
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>Conclusão: {new Date(project.end_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        )}

        {/* Descrição */}
        {project.description && (
          <div className="text-sm text-muted-foreground/70 italic line-clamp-2">
            {project.description}
          </div>
        )}
        
        {/* Data de criação */}
        <div className="flex items-center text-sm text-muted-foreground/60">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
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
