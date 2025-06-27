
import { useState } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/project';

export const useProjectDeletion = () => {
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteProject = useProjectStore(state => state.deleteProject);
  const { toast } = useToast();

  const confirmDelete = (project: Project) => {
    setProjectToDelete(project);
  };

  const cancelDelete = () => {
    setProjectToDelete(null);
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    
    try {
      const success = await deleteProject(projectToDelete.id);
      
      if (success) {
        toast({
          title: "✅ Projeto excluído!",
          description: `O projeto "${projectToDelete.name}" foi removido com sucesso.`,
        });
      } else {
        toast({
          title: "❌ Erro ao excluir",  
          description: "Não foi possível excluir o projeto. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro inesperado",
        description: "Ocorreu um erro ao excluir o projeto.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  return {
    projectToDelete,
    isDeleting,
    confirmDelete,
    cancelDelete,
    executeDelete,
  };
};
