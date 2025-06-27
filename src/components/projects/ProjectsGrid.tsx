
import ProjectCard from './ProjectCard';
import ProjectDeleteDialog from './ProjectDeleteDialog';
import DeleteAllDialog from './DeleteAllDialog';
import { ProjectEditDialog } from './ProjectEditDialog';
import ProjectsEmptyState from './ProjectsEmptyState';
import { DropIndicator } from '@/components/ui/DropIndicator';
import { useProjectsLogic } from '@/hooks/useProjectsLogic';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Project } from '@/types/project';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectsGridProps {
  projects: Project[];
}

export const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  const { toast } = useToast();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const {
    deleteProject,
    setDeleteProject,
    handleDeleteProject,
    updateProject,
    refreshProjects,
    // Drag & Drop
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  } = useProjectsLogic();

  const handleDeleteAllProjects = async () => {
    setIsDeletingAll(true);
    try {
      console.log('🗑️ Excluindo todos os projetos...');
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all projects

      if (error) throw error;

      // Forçar refresh após exclusão
      await refreshProjects();
      
      setShowDeleteAllDialog(false);

      toast({
        title: "✅ Todos os projetos excluídos!",
        description: `${projects.length} projetos foram removidos com sucesso.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error('💥 Erro ao excluir todos os projetos:', error);
      toast({
        title: "❌ Erro ao excluir projetos",
        description: "Não foi possível excluir todos os projetos.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (projects.length === 0) {
    return <ProjectsEmptyState />;
  }

  return (
    <>
      {/* Botão Excluir Todos no Topo */}
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          onClick={() => setShowDeleteAllDialog(true)}
          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
          disabled={isDeletingAll}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Todos os Projetos ({projects.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={project.id} className="relative group">
            {/* Drop Indicator */}
            <DropIndicator {...getDropIndicatorProps(index)} className="mb-4" />
            
            {/* Project Card Container */}
            <div
              className={`relative transition-all duration-300 ${
                isDragging ? 'select-none' : ''
              } hover:scale-[1.02] hover:shadow-lg`}
            >
              {/* Project Card with all required props */}
              <ProjectCard
                project={project}
                onDragStart={(e) => getDragItemProps(project, index).onDragStart?.(e)}
                onDragEnd={(e) => getDragItemProps(project, index).onDragEnd?.(e)}
                onDragOver={(e) => getDropZoneProps(index).onDragOver?.(e)}
                onDrop={(e) => getDropZoneProps(index).onDrop?.(e)}
                onEdit={() => {}}
                onDelete={() => setDeleteProject(project)}
                onUpdate={updateProject}
              />
            </div>
            
            {/* Drop Indicator no final */}
            {index === projects.length - 1 && (
              <DropIndicator {...getDropIndicatorProps(projects.length)} className="mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <ProjectDeleteDialog
        project={deleteProject}
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={() => {
          if (deleteProject) {
            handleDeleteProject(deleteProject.id);
          }
        }}
      />

      <DeleteAllDialog
        isOpen={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        onConfirm={handleDeleteAllProjects}
        projectCount={projects.length}
      />
    </>
  );
};
