
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2 } from 'lucide-react';
import { SidebarGroup } from '@/components/ui/sidebar';
import { useProject } from '@/contexts/ProjectContext';
import { useContextualNavigation } from '@/hooks/useContextualNavigation';
import { useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectContextHeaderProps {
  isInProject: boolean;
}

export const ProjectContextHeader = ({ isInProject }: ProjectContextHeaderProps) => {
  const { currentProject } = useProject();
  const { navigateContextual } = useContextualNavigation();
  const { open } = useSidebar();

  const handleBackToDashboard = () => {
    navigateContextual('/painel');
  };

  // Verificação de segurança: só renderiza se estiver em projeto E tiver projeto atual
  if (!isInProject || !currentProject) {
    return null;
  }

  if (!open) {
    // Estado colapsado - mostrar apenas ícone com tooltip
    return (
      <SidebarGroup>
        <div className="p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToDashboard}
                  className="w-full h-10 p-0 text-blue-700 hover:bg-blue-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Voltar para Dashboard</p>
                <p className="text-xs opacity-75">{currentProject.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarGroup>
    );
  }

  // Estado expandido - mostrar interface completa
  return (
    <SidebarGroup>
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToDashboard}
          className="w-full justify-start mb-2 text-blue-700 hover:bg-blue-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Dashboard
        </Button>
        <div className="flex items-center space-x-2 px-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800 truncate">
            {currentProject.name}
          </span>
        </div>
      </div>
    </SidebarGroup>
  );
};
