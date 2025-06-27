
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOptimizedProjectNavigation } from '@/hooks/useOptimizedProjectNavigation';
import { useProjectStateManager } from '@/hooks/useProjectStateManager';
import { Calculator, Clock, Bot, ExternalLink } from 'lucide-react';

interface ProjectNavigationExampleProps {
  projectId: string;
  projectName: string;
}

export const ProjectNavigationExample = ({ projectId, projectName }: ProjectNavigationExampleProps) => {
  const { navigateToProject, quickNavigateToSection } = useOptimizedProjectNavigation();
  const { currentProject, isProjectValid, refreshCurrentProject } = useProjectStateManager();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">
          {projectName}
        </CardTitle>
        <div className="text-sm text-gray-600">
          Status: {isProjectValid ? '✅ Válido' : '❌ Inválido'}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Navegação principal */}
        <Button 
          onClick={() => navigateToProject(projectId)}
          variant="outline"
          className="w-full justify-start"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Projeto Completo
        </Button>

        {/* Navegação para seções específicas */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => quickNavigateToSection(projectId, 'orcamento')}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Calculator className="h-3 w-3 mr-1" />
            Orçamento
          </Button>
          
          <Button 
            onClick={() => quickNavigateToSection(projectId, 'cronograma')}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Cronograma
          </Button>
        </div>

        <Button 
          onClick={() => quickNavigateToSection(projectId, 'assistente')}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          <Bot className="h-3 w-3 mr-1" />
          Assistente IA
        </Button>

        {/* Atualizar projeto atual */}
        {currentProject?.id === projectId && (
          <Button 
            onClick={refreshCurrentProject}
            variant="ghost"
            size="sm"
            className="w-full text-xs text-gray-600"
          >
            🔄 Atualizar Dados
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
