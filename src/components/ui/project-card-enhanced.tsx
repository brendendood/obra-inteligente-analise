
import { useState, memo, useCallback } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useProjectNavigation } from '@/hooks/useProjectNavigation';
import { Project } from '@/types/project';

interface ProjectCardEnhancedProps {
  project: Project;
  showQuickActions?: boolean;
}

export const ProjectCardEnhanced = memo(({ project, showQuickActions = false }: ProjectCardEnhancedProps) => {
  const { navigateToProject, navigateToProjectSection } = useProjectNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenProject = useCallback(async () => {
    console.log('🔄 CARD: Abrindo projeto:', project.name);
    setIsLoading(true);
    
    const success = navigateToProject(project.id);
    if (!success) {
      setIsLoading(false);
    }
  }, [project.id, project.name, navigateToProject]);

  const handleQuickAction = useCallback((section: 'orcamento' | 'cronograma' | 'assistente' | 'documentos') => {
    console.log('⚡ CARD: Ação rápida:', section, 'para projeto:', project.name);
    navigateToProjectSection(project.id, section);
  }, [project.id, project.name, navigateToProjectSection]);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300 w-full min-w-0 max-w-full hover-lift bg-white">
      <CardHeader className="pb-3 w-full">
        <div className="flex items-start justify-between w-full min-w-0 gap-2">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
              {project.name}
            </CardTitle>
          </div>
          
          <Badge className={`
            flex-shrink-0 text-xs transition-all duration-200
            ${project.analysis_data 
              ? 'bg-green-100 text-green-700 border-green-200 group-hover:bg-green-200' 
              : 'bg-yellow-100 text-yellow-700 border-yellow-200 group-hover:bg-yellow-200'
            }
          `}>
            {project.analysis_data ? '✅ Processado' : '⏳ Processando'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 w-full">
        {/* Informações do projeto */}
        <div className="space-y-2 text-sm text-gray-600 w-full">
          {project.total_area && (
            <div className="flex items-center space-x-2 min-w-0">
              <Ruler className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Área: {project.total_area}m²</span>
            </div>
          )}
          <div className="flex items-center space-x-2 min-w-0">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Criado: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Botão principal */}
        <Button
          onClick={handleOpenProject}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-700 transition-all duration-200 h-12 min-w-0 hover:shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Carregando...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 w-full">
              <Eye className="h-4 w-4" />
              <span>Abrir Projeto</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </Button>

        {/* Ações rápidas */}
        {showQuickActions && project.analysis_data && (
          <div className="space-y-3 pt-3 border-t border-gray-100 w-full">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Acesso Rápido</div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAction('orcamento');
                }}
                className="flex items-center justify-center space-x-1 text-xs min-w-0 h-10 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
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
                className="flex items-center justify-center space-x-1 text-xs min-w-0 h-10 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
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
                className="flex items-center justify-center space-x-1 text-xs min-w-0 h-10 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200"
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
                className="flex items-center justify-center space-x-1 text-xs min-w-0 h-10 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-200"
              >
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">Docs</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ProjectCardEnhanced.displayName = 'ProjectCardEnhanced';
