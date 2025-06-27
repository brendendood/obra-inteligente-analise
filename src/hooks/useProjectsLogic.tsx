
import { useState, useEffect, useMemo, useCallback } from 'react';
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

  const updateProject = useCallback((updatedProject: any) => {
    console.log('📝 PROJETOS: Atualizando projeto:', updatedProject.id);
    setLocalProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    refreshProjects();
  }, [refreshProjects]);

  const handleDeleteProject = useCallback(async (projectId: string) => {
    try {
      console.log('🗑️ PROJETOS: Excluindo projeto:', projectId);
      
      // Remover imediatamente da lista local para atualização instantânea da UI
      setLocalProjects(prev => {
        const updated = prev.filter(p => p.id !== projectId);
        console.log('✅ PROJETOS: Lista local atualizada, projetos restantes:', updated.length);
        return updated;
      });
      
      // Limpar projeto atual se for o que está sendo excluído
      const currentProjectId = localStorage.getItem('maden_current_project');
      if (currentProjectId) {
        try {
          const parsed = JSON.parse(currentProjectId);
          if (parsed.id === projectId) {
            setCurrentProject(null);
            localStorage.removeItem('maden_current_project');
            console.log('🧹 PROJETOS: Projeto atual limpo');
          }
        } catch (error) {
          console.error('❌ PROJETOS: Erro ao verificar projeto atual:', error);
        }
      }

      // Executar exclusão no backend
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('❌ Erro ao excluir projeto no backend:', error);
        // Reverter em caso de erro - recarregar projetos
        await refreshProjects();
        throw error;
      }

      console.log('✅ Projeto excluído com sucesso do backend');
      
      // Forçar refresh para garantir sincronização com o servidor
      setTimeout(async () => {
        await refreshProjects();
        console.log('🔄 PROJETOS: Sincronização pós-exclusão concluída');
      }, 1000);
      
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
  }, [setCurrentProject, refreshProjects, showControlledSuccess, showControlledError]);

  const handleDeleteAllProjects = useCallback(async () => {
    try {
      console.log('🗑️ PROJETOS: Excluindo todos os projetos');
      
      // Limpar lista local imediatamente
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
        await refreshProjects();
        throw error;
      }

      // Forçar refresh para garantir sincronização
      setTimeout(async () => {
        await refreshProjects();
      }, 1000);

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
  }, [user?.id, setCurrentProject, refreshProjects, showControlledSuccess, showControlledError]);

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
