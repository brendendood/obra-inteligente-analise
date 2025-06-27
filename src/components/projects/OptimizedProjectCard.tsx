
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartProjectLink } from '@/components/navigation/SmartProjectLink';
import { Project } from '@/types/project';
import { Calendar, Ruler, ExternalLink, Calculator, Clock, Bot } from 'lucide-react';

interface OptimizedProjectCardProps {
  project: Project;
  onQuickAction?: (action: string) => void;
}

export const OptimizedProjectCard = ({ project, onQuickAction }: OptimizedProjectCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <SmartProjectLink 
            projectId={project.id}
            className="flex-1 min-w-0"
          >
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {project.name}
            </CardTitle>
          </SmartProjectLink>
          
          {project.analysis_data && (
            <Badge className="bg-green-100 text-green-800 border-green-200 ml-2 flex-shrink-0">
              ✅ Processado
            </Badge>
          )}
        </div>
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
              onClick={() => onQuickAction?.('budget')}
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
              onClick={() => onQuickAction?.('schedule')}
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
            onClick={() => onQuickAction?.('ai')}
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
