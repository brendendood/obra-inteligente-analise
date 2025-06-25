import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProjectsLogic = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { 
    projects, 
    isLoading, 
    forceRefresh: refreshProjects 
  } = useProjectsConsistency();
  
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteProject, setDeleteProject] = useState<any>(null);
  const [draggedProject, setDraggedProject] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'area'>('date');
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleDragStart = (e: React.DragEvent, project: any) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    setDraggedProject(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetProject: any) => {
    e.preventDefault();
    
    if (!draggedProject || draggedProject.id === targetProject.id) return;

    const draggedIndex = projects.findIndex(p => p.id === draggedProject.id);
    const targetIndex = projects.findIndex(p => p.id === targetProject.id);

    const newProjects = [...projects];
    const [removed] = newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, removed);

    const projectOrder = newProjects.map(p => p.id);
    localStorage.setItem('projectOrder', JSON.stringify(projectOrder));
    
    setDraggedProject(null);
    
    toast({
      title: "✅ Ordem atualizada",
      description: "A nova ordem dos projetos foi salva.",
    });
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
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    updateProject,
  };
};
