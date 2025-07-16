
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Ruler, 
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Hammer
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjectNavigation } from '@/hooks/useProjectNavigation';
import { Project } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProjectEditDialog } from '@/components/projects/ProjectEditDialog';

interface SimpleProjectCardProps {
  project: Project;
  onDeleteProject?: (project: Project) => void;
  onProjectUpdate?: (project: Project) => void;
}

export const SimpleProjectCard = ({ project, onDeleteProject, onProjectUpdate }: SimpleProjectCardProps) => {
  const { navigateToProject } = useProjectNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const statusOptions = [
    { value: 'draft', label: 'Rascunho', color: 'text-gray-600' },
    { value: 'active', label: 'Ativo', color: 'text-blue-600' },
    { value: 'completed', label: 'Concluído', color: 'text-green-600' },
    { value: 'archived', label: 'Arquivado', color: 'text-gray-500' }
  ];

  const currentStatus = statusOptions.find(s => s.value === project.project_status) || statusOptions[0];

  const handleOpenProject = async () => {
    console.log('🔄 CARD: Abrindo projeto:', project.name);
    setIsLoading(true);
    
    const success = navigateToProject(project.id);
    if (!success) {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteProject?.(project);
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditDialog(true);
  };

  const handleProjectSave = (updatedProject: Project) => {
    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          project_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status do projeto');
        return;
      }

      toast.success('Status do projeto atualizado com sucesso!');
      
      // Atualizar o projeto localmente
      if (onProjectUpdate) {
        onProjectUpdate({ ...project, project_status: newStatus });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do projeto');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300 w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between w-full">
          {/* Informações do projeto */}
          <div className="flex-1 min-w-0 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {project.name}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              {project.total_area && (
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>Área: {project.total_area}m²</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Status Dropdown */}
            <Select
              value={project.project_status || 'draft'}
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue>
                  <span className={currentStatus.color}>
                    {currentStatus.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <span className={status.color}>
                      {status.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Menu de três pontinhos */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleRenameClick} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Renomear projeto
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {onDeleteProject && (
                  <DropdownMenuItem 
                    onClick={handleDeleteClick}
                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir projeto
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Botão "Ver projeto" */}
            <Button
              onClick={handleOpenProject}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-10 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <Hammer className="h-4 w-4 text-white mr-2 animate-hammer" />
              ) : null}
              <span className="mr-2">{isLoading ? 'Carregando...' : 'Ver projeto'}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Dialog de edição */}
      <ProjectEditDialog
        project={project}
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleProjectSave}
      />
    </Card>
  );
};
