
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Calendar, 
  Ruler, 
  Eye, 
  Calculator,
  Clock,
  Bot,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useProjectNavigation } from '@/hooks/useProjectNavigation';
import { Project } from '@/types/project';

interface ProjectCardEnhancedProps {
  project: Project;
  showQuickActions?: boolean;
}

export const ProjectCardEnhanced = ({ project, showQuickActions = false }: ProjectCardEnhancedProps) => {
  const { navigateToProject, navigateToProjectSection } = useProjectNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenProject = async () => {
    console.log('🔄 CARD: Abrindo projeto:', project.name);
    setIsLoading(true);
    
    const success = navigateToProject(project.id);
    if (!success) {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (section: 'orcamento' | 'cronograma' | 'assistente' | 'documentos') => {
    console.log('⚡ CARD: Ação rápida:', section, 'para projeto:', project.name);
    navigateToProjectSection(project.id, section);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300 w-full min-w-0 max-w-full">
      <CardHeader className="pb-3 w-full">
        <div className="flex items-start justify-between w-full min-w-0 gap-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {project.name}
            </CardTitle>
          </div>
          
          <Badge className={`
            flex-shrink-0 text-xs
            ${project.analysis_data 
              ? 'bg-green-100 text-green-700 border-green-200' 
              : 'bg-yellow-100 text-yellow-700 border-yellow-200'
            }
          `}>
            {project.analysis_data ? '✅ Analisado' : '⏳ Processando'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 w-full">
        {/* Informações do projeto */}
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 w-full">
          {project.total_area && (
            <div className="flex items-center space-x-2 min-w-0">
              <Ruler className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Área: {project.total_area}m²</span>
            </div>
          )}
          <div className="flex items-center space-x-2 min-w-0">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Criado: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Botão principal */}
        <Button
          onClick={handleOpenProject}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-700 transition-all duration-200 h-10 min-w-0"
          style={{ fontSize: '16px' }}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 flex-shrink-0"></div>
          ) : (
            <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          <span className="truncate">{isLoading ? 'Carregando...' : 'Abrir Projeto'}</span>
          <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
        </Button>

        {/* Ações rápidas */}
        {showQuickActions && project.analysis_data && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction('orcamento');
              }}
              className="flex items-center justify-center space-x-1 text-xs min-w-0 h-9"
              style={{ fontSize: '14px' }}
            >
              <Calculator className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Orçamento</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction('cronograma');
              }}
              className="flex items-center justify-center space-x-1 text-xs min-w-0 h-9"
              style={{ fontSize: '14px' }}
            >
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Cronograma</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction('assistente');
              }}
              className="flex items-center justify-center space-x-1 text-xs min-w-0 h-9"
              style={{ fontSize: '14px' }}
            >
              <Bot className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">IA</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction('documentos');
              }}
              className="flex items-center justify-center space-x-1 text-xs min-w-0 h-9"
              style={{ fontSize: '14px' }}
            >
              <FileText className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Docs</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
