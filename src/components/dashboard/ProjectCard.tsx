
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartProjectLink } from '@/components/navigation/SmartProjectLink';
import { Project } from '@/types/project';
import { 
  Calendar, 
  Ruler, 
  ExternalLink, 
  Calculator, 
  Clock, 
  Bot,
  GripVertical,
  MoreVertical 
} from 'lucide-react';
import { ProjectCardActions } from './ProjectCardActions';

interface ProjectCardProps {
  project: Project;
  index: number;
  draggedItem: any;
  onDragStart: (e: React.DragEvent, project: Project, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const ProjectCard = ({ 
  project, 
  index, 
  draggedItem, 
  onDragStart, 
  onDragOver, 
  onDrop 
}: ProjectCardProps) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md relative"
      draggable
      onDragStart={(e) => onDragStart(e, project, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      {/* Grip Handle */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm border border-gray-200">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200"
          onClick={() => setShowActions(!showActions)}
        >
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </Button>
        
        {showActions && (
          <ProjectCardActions 
            projectId={project.id}
            onActionClick={() => setShowActions(false)}
          />
        )}
      </div>

      <CardHeader className="pb-3 pt-8">
        <SmartProjectLink 
          projectId={project.id}
          className="flex-1 min-w-0"
        >
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors pr-8">
            {project.name}
          </CardTitle>
        </SmartProjectLink>
        
        {project.analysis_data && (
          <Badge className="bg-green-100 text-green-800 border-green-200 self-start mt-2">
            ✅ Processado
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informações do Projeto */}
        <div className="space-y-2 text-sm text-gray-600">
          {project.total_area && (
            <div className="flex items-center space-x-2">
              <Ruler className="h-4 w-4 text-gray-400" />
              <span>Área: {project.total_area}m²</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 gap-2">
          <SmartProjectLink 
            projectId={project.id} 
            section="orcamento"
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs hover:bg-green-50 hover:border-green-300"
            >
              <Calculator className="h-3 w-3 mr-1" />
              Orçamento
            </Button>
          </SmartProjectLink>
          
          <SmartProjectLink 
            projectId={project.id} 
            section="cronograma"
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs hover:bg-blue-50 hover:border-blue-300"
            >
              <Clock className="h-3 w-3 mr-1" />
              Cronograma
            </Button>
          </SmartProjectLink>
        </div>

        <SmartProjectLink 
          projectId={project.id} 
          section="assistente"
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs hover:bg-purple-50 hover:border-purple-300"
          >
            <Bot className="h-3 w-3 mr-1" />
            Assistente IA
          </Button>
        </SmartProjectLink>

        {/* Link para ver detalhes completos */}
        <SmartProjectLink 
          projectId={project.id}
          className="block"
        >
          <Button variant="ghost" size="sm" className="w-full text-xs text-blue-600 hover:bg-blue-50">
            <ExternalLink className="h-3 w-3 mr-1" />
            Ver Detalhes Completos
          </Button>
        </SmartProjectLink>
      </CardContent>
    </Card>
  );
};
