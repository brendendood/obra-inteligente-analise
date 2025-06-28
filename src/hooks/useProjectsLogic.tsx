
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjectStore } from '@/stores/projectStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

export const useProjectsLogic = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { 
    projects, 
    isLoading, 
    fetchProjects 
  } = useProjectStore();
  
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteProject, setDeleteProject] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'area'>('date');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Configurar drag & drop para projetos
  const {
    isDragging,
    getDragItemProps,
    getDropZoneProps,
    getDropIndicatorProps,
  } = useDragAndDrop({
    items: filteredProjects,
    onReorder: (reorderedProjects) => {
      setFilteredProjects(reorderedProjects);
      // Salvar nova ordem no localStorage
      const projectOrder = reorderedProjects.map(p => p.id);
      localStorage.setItem('projectOrder', JSON.stringify(projectOrder));
      
      toast({
        title: "✅ Ordem atualizada",
        description: "A nova ordem dos projetos foi salva.",
      });
    },
    keyExtractor: (project) => project.id,
  });

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🚫 PROJETOS: Redirecionando para login');
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Filtrar e ordenar projetos
  useEffect(() => {
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
    setFilteredProjects(filtered);
  }, [projects, searchTerm, sortBy]);

  const updateProject = (updatedProject: any) => {
    console.log('📝 PROJETOS: Atualizando projeto:', updatedProject.id);
    // Forçar refresh para garantir consistência
    fetchProjects();
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
      await fetchProjects();
      
      setDeleteProject(null);

      toast({
        title: "✅ Projeto excluído!",
        description: "O projeto foi removido com sucesso.",
      });
    } catch (error) {
      console.error('💥 PROJETOS: Erro ao excluir projeto:', error);
      toast({
        title: "❌ Erro ao excluir",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
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
