/**
 * Project Actions Hook
 * Gerencia ações CRUD de projetos (delete, update) com toast notifications
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { Project } from '@/types/project';

export const useProjectActions = () => {
  const { toast } = useToast();
  const { fetchProjects, updateProject: storeUpdate } = useUnifiedProjectStore();
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Forçar refresh após exclusão
      await fetchProjects();
      
      setDeleteProject(null);

      toast({
        title: "✅ Projeto excluído!",
        description: "O projeto foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast({
        title: "❌ Erro ao excluir",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
    }
  };

  const updateProject = (updatedProject: Project) => {
    storeUpdate(updatedProject.id, updatedProject);
    
    // Opcional: refresh para garantir consistência
    setTimeout(() => {
      fetchProjects();
    }, 100);
  };

  return {
    deleteProject,
    setDeleteProject,
    handleDeleteProject,
    updateProject,
  };
};
