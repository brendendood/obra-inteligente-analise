
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectData {
  id: string;
  name: string;
  user_id: string;
  project_type: string;
  project_status: string;
  total_area: number;
  estimated_budget: number;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
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
      
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }

      if (filterStatus) {
        query = query.eq('project_status', filterStatus);
      }

      if (filterType) {
        query = query.eq('project_type', filterType);
      }

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) throw projectsError;

      if (projectsData) {
        const userIds = [...new Set(projectsData.map(p => p.user_id))];
        
        const { data: usersData, error: usersError } = await supabase
          .from('user_profiles')
          .select('user_id, full_name')
          .in('user_id', userIds);

        if (usersError) {
          console.error('Error loading user profiles:', usersError);
        }

        const projectsWithUserInfo = projectsData.map(project => {
          const userProfile = usersData?.find(u => u.user_id === project.user_id);
          
          return {
            ...project,
            user_name: userProfile?.full_name || 'N/A'
          };
        });

        setProjects(projectsWithUserInfo);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "❌ Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos.",
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
        .update({ 
          project_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "✅ Status atualizado",
        description: "Status do projeto foi atualizado com sucesso."
      });

      loadProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "❌ Erro ao atualizar status",
        description: "Não foi possível atualizar o status do projeto.",
        variant: "destructive"
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "✅ Projeto deletado",
        description: "Projeto foi removido com sucesso."
      });

      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "❌ Erro ao deletar projeto",
        description: "Não foi possível deletar o projeto.",
        variant: "destructive"
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterType('');
  };

  useEffect(() => {
    loadProjects();
  }, [searchTerm, filterStatus, filterType]);

  return {
    projects,
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
