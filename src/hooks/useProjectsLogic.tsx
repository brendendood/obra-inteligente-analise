
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjectSync } from '@/hooks/useProjectSync';
import { supabase } from '@/integrations/supabase/client';
import { useNotificationControl } from '@/hooks/useNotificationControl';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

export const useProjectsLogic = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { 
    projects, 
    isLoading, 
    forceRefresh: refreshProjects 
  } = useProjectSync();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteProject, setDeleteProject] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'area'>('date');
  const { showControlledError, showControlledSuccess } = useNotificationControl();
  const navigate = useNavigate();

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🚫 PROJETOS: Redirecionando para login');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Memoizar projetos filtrados para evitar recálculos
  const filteredProjects = useMemo(() => {
    console.log('🔍 PROJETOS: Filtrando e ordenando', projects.length, 'projetos');
    
    let filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.project_type && project.project_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'area':
          return (b.total_area || 0) - (a.total_area || 0);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    console.log('✅ PROJETOS: Filtrados e ordenados:', filtered.length, 'projetos');
    return filtered;
  }, [projects, searchTerm, sortBy]);

  // Configurar drag & drop para projetos
  const {
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  } = useDragAndDrop({
    items: filteredProjects,
    onReorder: (reorderedProjects) => {
      // Salvar nova ordem no localStorage
      const projectOrder = reorderedProjects.map(p => p.id);
      localStorage.setItem('projectOrder', JSON.stringify(projectOrder));
      
      showControlledSuccess(
        "✅ Ordem atualizada",
        "A nova ordem dos projetos foi salva."
      );
    },
    keyExtractor: (project) => project.id,
  });

  const updateProject = (updatedProject: any) => {
    console.log('📝 PROJETOS: Atualizando projeto:', updatedProject.id);
    // Forçar refresh para garantir consistência
    refreshProjects();
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      console.log('🗑️ PROJETOS: Excluindo projeto:', projectId);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Forçar refresh após exclusão
      await refreshProjects();
      
      setDeleteProject(null);

      showControlledSuccess(
        "✅ Projeto excluído!",
        "O projeto foi removido com sucesso."
      );
    } catch (error) {
      console.error('💥 PROJETOS: Erro ao excluir projeto:', error);
      showControlledError(
        "❌ Erro ao excluir",
        "Não foi possível excluir o projeto.",
        'delete-project-error'
      );
    }
  };

  return {
    projects,
    filteredProjects,
    isLoading,
    loading,
    isAuthenticated,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    deleteProject,
    setDeleteProject,
    handleDeleteProject,
    updateProject,
    // Drag & Drop props
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  };
};
