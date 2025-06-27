
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
    forceRefresh: refreshProjects,
    setCurrentProject 
  } = useProjectSync();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteProject, setDeleteProject] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'area'>('date');
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const { showControlledError, showControlledSuccess } = useNotificationControl();
  const navigate = useNavigate();

  // Sincronizar projetos locais com os do servidor
  useEffect(() => {
    console.log('🔄 PROJETOS LOGIC: Sincronizando', projects.length, 'projetos');
    setLocalProjects(projects);
  }, [projects]);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🚫 PROJETOS: Redirecionando para login');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Memoizar projetos filtrados para evitar recálculos
  const filteredProjects = useMemo(() => {
    console.log('🔍 PROJETOS: Filtrando e ordenando', localProjects.length, 'projetos');
    
    let filtered = localProjects.filter(project =>
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

    return filtered;
  }, [localProjects, searchTerm, sortBy]);

  // Configurar drag & drop para projetos
  const {
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  } = useDragAndDrop({
    items: filteredProjects,
    onReorder: (reorderedProjects) => {
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
    setLocalProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    refreshProjects();
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      console.log('🗑️ PROJETOS: Excluindo projeto:', projectId);
      
      // CORREÇÃO: Remover imediatamente da lista local
      const originalProjects = [...localProjects];
      setLocalProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Limpar projeto atual se for o que está sendo excluído
      const currentProjectId = localStorage.getItem('maden_current_project');
      if (currentProjectId && JSON.parse(currentProjectId).id === projectId) {
        setCurrentProject(null);
        localStorage.removeItem('maden_current_project');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('❌ Erro ao excluir projeto:', error);
        // Reverter em caso de erro
        setLocalProjects(originalProjects);
        throw error;
      }

      console.log('✅ Projeto excluído com sucesso');
      
      // Forçar refresh para garantir sincronização
      setTimeout(() => {
        refreshProjects();
      }, 500);
      
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

  const handleDeleteAllProjects = async () => {
    try {
      console.log('🗑️ PROJETOS: Excluindo todos os projetos');
      
      // CORREÇÃO: Limpar lista local imediatamente
      const originalProjects = [...localProjects];
      setLocalProjects([]);
      
      // Limpar projeto atual
      setCurrentProject(null);
      localStorage.removeItem('maden_current_project');
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('user_id', user?.id);

      if (error) {
        // Reverter em caso de erro
        setLocalProjects(originalProjects);
        throw error;
      }

      // Forçar refresh para garantir sincronização
      setTimeout(() => {
        refreshProjects();
      }, 500);

      showControlledSuccess(
        "✅ Todos os projetos excluídos!",
        "Todos os projetos foram removidos com sucesso."
      );
    } catch (error) {
      console.error('💥 PROJETOS: Erro ao excluir todos os projetos:', error);
      showControlledError(
        "❌ Erro ao excluir todos",
        "Não foi possível excluir os projetos.",
        'delete-all-projects-error'
      );
    }
  };

  return {
    projects: localProjects,
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
    handleDeleteAllProjects,
    updateProject,
    // Drag & Drop props
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  };
};
