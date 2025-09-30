
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  CalendarDays,
  Ruler, 
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Hammer,
  Building2,
  Home,
  Briefcase,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { toast } from '@/components/ui/sonner';
import { ProjectEditDialog } from '@/components/projects/ProjectEditDialog';
import { 
  FloatingActionPanelRoot,
  FloatingActionPanelTrigger,
  FloatingActionPanelContent,
  FloatingActionPanelButton,
  FloatingActionPanelForm,
  FloatingActionPanelTextarea
} from '@/components/ui/floating-action-panel';
import { DocumentPreview } from '@/components/projects/DocumentPreview';

interface SimpleProjectCardProps {
  project: Project;
  onDeleteProject?: (project: Project) => void;
  onProjectUpdate?: (project: Project) => void;
}

export const SimpleProjectCard = ({ project, onDeleteProject, onProjectUpdate }: SimpleProjectCardProps) => {
  const { navigateToProject } = useProjectNavigation();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  // Função para obter ícone do tipo de projeto
  const getProjectTypeIcon = (projectType: string) => {
    switch (projectType?.toLowerCase()) {
      case 'residencial':
      case 'residential':
        return Home;
      case 'comercial':
      case 'commercial':
        return Briefcase;
      case 'industrial':
        return Building2;
      default:
        return Building2;
    }
  };

  // Função para formatar tipo de projeto
  const formatProjectType = (projectType: string) => {
    if (!projectType?.trim()) return null;
    
    const typeMap: Record<string, string> = {
      'residential': 'Residencial',
      'commercial': 'Comercial', 
      'industrial': 'Industrial',
      'residencial': 'Residencial',
      'comercial': 'Comercial'
    };
    
    return typeMap[projectType.toLowerCase()] || projectType;
  };

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
    
    try {
      navigateToProject(project.id);
    } catch (error) {
      console.error('❌ CARD: Erro ao navegar:', error);
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
      const { data, error } = await supabase
        .from('projects')
        .update({ 
          project_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status do projeto');
        return;
      }

      toast.success('Status do projeto atualizado com sucesso!');
      
      // Atualizar o projeto com dados atualizados do banco
      if (onProjectUpdate) {
        onProjectUpdate(data);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do projeto');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const saveNote = async (projectId: string, note: string) => {
    const { error } = await supabase
      .from("projects")
      .update({ notes: note })
      .eq("id", projectId);
    
    if (error) {
      console.error(error);
      toast.error("Falha ao salvar a nota");
    } else {
      toast.success("Nota salva");
      // Atualizar localmente
      if (onProjectUpdate) {
        onProjectUpdate({ ...project, notes: note });
      }
    }
  };

  if (isMobile) {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300 w-full">
        <CardContent className="p-6 sm:p-4">
          {/* Cabeçalho Mobile: Nome + Status */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight flex-1">
                {project.name}
              </h3>
              {!!project.notes && (
                <FloatingActionPanelRoot>
                  {({ setIsOpen, setMode, mode }) => (
                    <>
                      <button
                        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-muted flex-shrink-0"
                        title="Ver nota"
                        aria-label="Ver nota"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMode('note');
                          setIsOpen(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </button>
                      
                      <FloatingActionPanelContent>
                        <div className="p-4 max-w-sm">
                          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">Nota do Projeto</h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                            {project.notes}
                          </p>
                        </div>
                      </FloatingActionPanelContent>
                    </>
                  )}
                </FloatingActionPanelRoot>
              )}
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.color} ${currentStatus.borderColor} border flex-shrink-0`}>
              {currentStatus.label}
            </div>
          </div>

          {/* Preview do Documento */}
          {project.file_path && (
            <div className="mb-3">
              <DocumentPreview fileName={project.file_path} className="bg-blue-50 border-blue-200" />
            </div>
          )}
          {/* Detalhes Expandíveis */}
          {showMobileDetails && (
            <div className="space-y-3 text-sm mb-4 animate-accordion-down">
              {/* Tipo de projeto */}
              {formatProjectType(project.project_type) && (
                <div className="flex items-center space-x-2 text-gray-600">
                  {(() => {
                    const IconComponent = getProjectTypeIcon(project.project_type);
                    return <IconComponent className="h-4 w-4 text-blue-500 flex-shrink-0" />;
                  })()}
                  <span className="font-medium">{formatProjectType(project.project_type)}</span>
                </div>
              )}

              {/* Área do projeto */}
              {project.total_area && project.total_area > 0 && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Ruler className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Área: {project.total_area}m²</span>
                </div>
              )}

              {/* Datas do projeto */}
              {(project.start_date || project.end_date) ? (
                <div className="space-y-1.5">
                  {project.start_date && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarDays className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>Início: {new Date(project.start_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  {project.end_date && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarDays className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span>Término: {new Date(project.end_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              )}

              {/* Descrição do projeto */}
              {project.description && project.description.trim() !== '' && (
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 leading-relaxed flex-1">
                    {project.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMobileDetails(!showMobileDetails);
                }}
                className="text-gray-600 hover:text-gray-800 p-1.5 h-auto font-medium"
              >
                <span className="text-xs">Ver Detalhes</span>
                {showMobileDetails ? (
                  <ChevronUp className="h-3 w-3 ml-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-1" />
                )}
              </Button>

              {/* Botão de notas - Mobile */}
              <FloatingActionPanelRoot>
                {({ mode }) => (
                  <>
                    <FloatingActionPanelTrigger title="Adicionar nota" mode="note" className="text-xs">
                      Notas
                    </FloatingActionPanelTrigger>

                    <FloatingActionPanelContent>
                      <FloatingActionPanelForm onSubmit={(note) => saveNote(project.id, note)} className="p-4">
                        <FloatingActionPanelTextarea 
                          className="mb-3 h-28" 
                          id={`note-${project.id}`} 
                          defaultValue={project.notes || ''}
                        />
                        <div className="flex justify-end">
                          <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">
                            Salvar nota
                          </button>
                        </div>
                      </FloatingActionPanelForm>
                    </FloatingActionPanelContent>
                  </>
                )}
              </FloatingActionPanelRoot>
            </div>

            <Button
              onClick={handleOpenProject}
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-2 py-1.5 h-auto text-xs w-16 sm:w-20"
            >
              {isLoading ? (
                <Hammer className="h-3 w-3 animate-pulse" />
              ) : (
                <span>Ver</span>
              )}
            </Button>
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
  }

  // Layout Desktop
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300 w-full relative">
      <CardContent className="p-6">
        {/* Status Badge no canto superior direito */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.color} ${currentStatus.borderColor} border`}>
            {currentStatus.label}
          </div>
        </div>

        {/* Layout Desktop: Duas Colunas */}
        <div className="grid grid-cols-12 gap-6 mb-4">
          {/* Coluna Esquerda: Nome + Descrição (60%) */}
          <div className="col-span-7 space-y-3">
            <div className="pr-16">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-tight flex-1">
                  {project.name}
                </h3>
                {!!project.notes && (
                  <FloatingActionPanelRoot>
                    {({ setIsOpen, setMode, mode }) => (
                      <>
                        <button
                          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-muted flex-shrink-0"
                          title="Ver nota"
                          aria-label="Ver nota"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMode('note');
                            setIsOpen(true);
                          }}
                        >
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </button>
                        
                        <FloatingActionPanelContent>
                          <div className="p-4 max-w-sm">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">Nota do Projeto</h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                              {project.notes}
                            </p>
                          </div>
                        </FloatingActionPanelContent>
                      </>
                    )}
                  </FloatingActionPanelRoot>
                )}
              </div>
            </div>
            
            {/* Preview do Documento */}
            {project.file_path && (
              <DocumentPreview fileName={project.file_path} className="bg-blue-50 border-blue-200" />
            )}
            {/* Descrição se houver */}
            {project.description && project.description.trim() !== '' && (
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className={`text-gray-600 leading-relaxed text-sm ${
                      !showFullDescription && project.description.length > 120 
                        ? 'line-clamp-2' 
                        : ''
                    }`}>
                      {project.description}
                    </p>
                    {project.description.length > 120 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowFullDescription(!showFullDescription);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium mt-1 transition-colors"
                      >
                        {showFullDescription ? 'Ver menos' : 'Ver descrição completa'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita: Detalhes Técnicos em Grid 2x2 (40%) */}
          <div className="col-span-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Tipo de projeto */}
              {formatProjectType(project.project_type) ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  {(() => {
                    const IconComponent = getProjectTypeIcon(project.project_type);
                    return <IconComponent className="h-4 w-4 text-blue-500 flex-shrink-0" />;
                  })()}
                  <span className="font-medium text-xs">{formatProjectType(project.project_type)}</span>
                </div>
              ) : (
                <div></div>
              )}

              {/* Área do projeto */}
              {project.total_area && project.total_area > 0 ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Ruler className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-xs">{project.total_area}m²</span>
                </div>
              ) : (
                <div></div>
              )}

              {/* Data de início */}
              {project.start_date ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <CalendarDays className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs">{new Date(project.start_date).toLocaleDateString('pt-BR')}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs">Criado {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              )}

              {/* Data de término */}
              {project.end_date ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <CalendarDays className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span className="text-xs">{new Date(project.end_date).toLocaleDateString('pt-BR')}</span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé: Status + Ações */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Status Dropdown */}
          <Select
            value={project.project_status || 'draft'}
            onValueChange={handleStatusChange}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className="w-40 h-9 text-xs bg-gray-50 border-gray-200 hover:bg-white transition-colors">
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
          <div className="flex items-center space-x-3">
            {/* Botão de notas - Desktop */}
            <FloatingActionPanelRoot>
              {({ mode }) => (
                <>
                  <FloatingActionPanelTrigger title="Adicionar nota" mode="note">
                    Notas
                  </FloatingActionPanelTrigger>

                  <FloatingActionPanelContent>
                    <FloatingActionPanelForm onSubmit={(note) => saveNote(project.id, note)} className="p-4">
                      <FloatingActionPanelTextarea 
                        className="mb-3 h-28" 
                        id={`note-${project.id}`} 
                        defaultValue={project.notes || ''}
                      />
                      <div className="flex justify-end">
                        <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">
                          Salvar nota
                        </button>
                      </div>
                    </FloatingActionPanelForm>
                  </FloatingActionPanelContent>
                </>
              )}
            </FloatingActionPanelRoot>

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
                  Editar Projeto Completo
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-9 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <Hammer className="h-4 w-4 text-white mr-2 animate-pulse" />
              ) : null}
              <span>{isLoading ? 'Carregando...' : 'Ver projeto'}</span>
              <ChevronRight className="h-4 w-4 ml-2" />
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
