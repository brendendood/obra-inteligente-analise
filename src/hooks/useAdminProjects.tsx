
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectData {
  id: string;
  name: string;
  city: string;
  state: string;
  project_type: string;
  project_status: string;
  total_area: number;
  estimated_budget: number;
  created_at: string;
  user_id: string;
}

export const useAdminProjects = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error loading projects:', error);
        throw error;
      }

      if (projectsData) {
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "❌ Erro ao carregar projetos",
        description: "Não foi possível carregar os projetos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ project_status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, project_status: newStatus }
            : project
        )
      );

      toast({
        title: "✅ Status atualizado",
        description: "Status do projeto atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "❌ Erro ao atualizar status",
        description: "Não foi possível atualizar o status do projeto.",
        variant: "destructive"
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== projectId));

      toast({
        title: "✅ Projeto excluído",
        description: "Projeto excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "❌ Erro ao excluir projeto",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive"
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterType('');
  };

  // Carregar dados apenas uma vez na montagem
  useEffect(() => {
    loadProjects();
  }, []); // Dependência vazia

  // Filtrar dados localmente
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || project.project_status === filterStatus;
    const matchesType = filterType === '' || project.project_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return {
    projects: filteredProjects,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    updateProjectStatus,
    deleteProject,
    clearFilters
  };
};
