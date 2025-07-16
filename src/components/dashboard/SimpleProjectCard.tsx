
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
    { value: 'draft', label: 'Planejamento', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' },
    { value: 'active', label: 'Em Execução', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
    { value: 'completed', label: 'Finalizado', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
    { value: 'archived', label: 'Arquivado', color: 'text-gray-500', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' }
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
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300 w-full relative">
      <CardContent className="p-4 sm:p-6">
        {/* Status Badge no canto superior direito */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.color} ${currentStatus.borderColor} border`}>
            {currentStatus.label}
          </div>
        </div>

        {/* Layout Vertical Mobile-First */}
        <div className="space-y-4">
          {/* Nome do projeto em destaque - Tamanho otimizado para mobile */}
          <div className="pr-20">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
              {project.name}
            </h3>
          </div>
          
          {/* Informações empilhadas verticalmente */}
          <div className="space-y-3 text-sm text-gray-600">
            {project.total_area && (
              <div className="flex items-center space-x-2">
                <Ruler className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="font-medium">Área: {project.total_area}m²</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Ações Mobile-First */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100">
            {/* Status Dropdown */}
            <Select
              value={project.project_status || 'draft'}
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-full sm:w-40 h-9 text-xs bg-gray-50 border-gray-200 hover:bg-white transition-colors">
                <SelectValue>
                  <span className={currentStatus.color}>
                    {currentStatus.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg">
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <span className={status.color}>
                      {status.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botões de ação */}
            <div className="flex items-center space-x-2">
              {/* Menu de três pontinhos */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-gray-400 hover:text-gray-600 border border-gray-200 hover:bg-gray-50"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-50">
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

              {/* Botão "Ver projeto" - Mobile optimized */}
              <Button
                onClick={handleOpenProject}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-9 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex-1 sm:flex-initial min-w-0"
              >
                {isLoading ? (
                  <Hammer className="h-4 w-4 text-white mr-2 animate-hammer" />
                ) : null}
                <span className="truncate">{isLoading ? 'Carregando...' : 'Ver projeto'}</span>
                <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </div>
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
