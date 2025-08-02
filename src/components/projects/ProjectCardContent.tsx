
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

  return (
    <CardContent>
      <div className="space-y-3">
        {/* Informações principais */}
        <div className="space-y-2">
          {project.project_type && project.project_type.trim() !== '' && (
            <div className="text-sm text-muted-foreground flex items-center space-x-1">
              <FolderOpen className="h-4 w-4" />
              <span className="font-medium">{project.project_type}</span>
            </div>
          )}
          
          {project.total_area && project.total_area > 0 && (
            <div className="text-sm text-muted-foreground flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Área: {project.total_area}m²</span>
            </div>
          )}
        </div>

        {/* Datas do projeto ou data de criação */}
        {(project.start_date || project.end_date) ? (
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
                <span>Término: {new Date(project.end_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground/60">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        )}

        {/* Descrição */}
        {project.description && project.description.trim() !== '' && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="line-clamp-2">{project.description}</p>
          </div>
        )}
        
        {/* Botões de ação */}
        <div className="space-y-2">
          {/* Botão Ver Detalhes se houver descrição longa */}
          {project.description && project.description.length > 100 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => {
                // TODO: Implementar modal de detalhes
                alert(`Detalhes do Projeto:\n\nTipo: ${project.project_type || 'Não informado'}\nDescrição: ${project.description || 'Não informado'}\nÁrea: ${project.total_area || 'Não informado'}m²`);
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver Detalhes
            </Button>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => navigate(`/projeto/${project.id}`)}
                className="w-32 bg-apple-blue text-white hover:bg-apple-blue/90 border-0 rounded-xl font-medium transition-all duration-200 hover:scale-[0.98]"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Acessar todas as ferramentas do projeto</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </CardContent>
  );
};
