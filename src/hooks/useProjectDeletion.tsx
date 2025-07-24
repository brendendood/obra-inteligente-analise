
import { useState } from 'react';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types/project';

export const useProjectDeletion = () => {
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteProject = useUnifiedProjectStore(state => state.deleteProject);
  const { currentProject, setCurrentProject } = useProject();
  const { toast } = useToast();

  const confirmDelete = (project: Project) => {
    console.log('🗑️ DELETION: Projeto marcado para exclusão:', project.name);
    setProjectToDelete(project);
  };

  const cancelDelete = () => {
    console.log('❌ DELETION: Exclusão cancelada pelo usuário');
    setProjectToDelete(null);
  };

  const executeDelete = async () => {
    if (!projectToDelete) {
      console.error('❌ DELETION: Nenhum projeto selecionado para exclusão');
      return;
    }

    console.log('🔄 DELETION: Iniciando processo de exclusão atômica para:', projectToDelete.name);
    setIsDeleting(true);
    
    try {
      // Executar exclusão atômica (interface + base de dados)
      const success = await deleteProject(projectToDelete.id);
      
      if (success) {
        console.log('✅ DELETION: Projeto excluído com sucesso da interface e base de dados');
        console.log('📊 DELETION: Dashboard será automaticamente recalculado');
        
        // Se o projeto excluído era o atual, limpar contexto
        if (currentProject?.id === projectToDelete.id) {
          console.log('🧹 DELETION: Limpando projeto atual do contexto');
          setCurrentProject(null);
        }
        
        toast({
          title: "✅ Projeto excluído!",
          description: `O projeto "${projectToDelete.name}" foi removido permanentemente. Limite de projetos atualizado.`,
        });
      } else {
        console.error('❌ DELETION: Falha na exclusão - integridade comprometida');
        toast({
          title: "❌ Erro ao excluir",  
          description: "Não foi possível excluir o projeto. A integridade dos dados foi preservada.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('💥 DELETION: Erro crítico durante exclusão:', error);
      toast({
        title: "❌ Erro crítico",
        description: "Falha na exclusão. Sistema mantém integridade dos dados.",
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
