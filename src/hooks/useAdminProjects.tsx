
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminProject {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  project_status: string;
  project_type: string | null;
  user_name: string | null;
  file_size: number | null;
  analysis_data: any;
  city: string | null;
  state: string | null;
  total_area: number | null;
  estimated_budget: number | null;
}

export const useAdminProjects = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log('📁 ADMIN PROJECTS: Carregando projetos reais...');

      // Carregar projetos com dados dos usuários
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          user_id,
          created_at,
          updated_at,
          project_status,
          project_type,
          file_size,
          analysis_data,
          city,
          state,
          total_area,
          estimated_budget
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Carregar nomes dos usuários
      const userIds = [...new Set(projectsData?.map(p => p.user_id) || [])];
      const { data: userProfiles, error: usersError } = await supabase
        .from('user_profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      if (usersError) console.warn('⚠️ Não foi possível carregar nomes dos usuários:', usersError);

      // Combinar dados
      const enrichedProjects: AdminProject[] = (projectsData || []).map(project => {
        const userProfile = userProfiles?.find(u => u.user_id === project.user_id);
        return {
          ...project,
          user_name: userProfile?.full_name || 'Usuário não encontrado'
        };
      });

      setProjects(enrichedProjects);
      console.log('✅ ADMIN PROJECTS: Projetos carregados:', enrichedProjects.length);

    } catch (error) {
      console.error('❌ ADMIN PROJECTS: Erro ao carregar projetos:', error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar a lista de projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      console.log('📝 ADMIN PROJECTS: Atualizando status do projeto:', projectId, status);

      const { error } = await supabase
        .from('projects')
        .update({ 
          project_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      // Atualizar estado local
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, project_status: status }
          : project
      ));

      toast({
        title: "Status atualizado",
        description: "Status do projeto foi atualizado com sucesso",
      });

    } catch (error) {
      console.error('❌ ADMIN PROJECTS: Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do projeto",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      console.log('🗑️ ADMIN PROJECTS: Deletando projeto:', projectId);

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Remover do estado local
      setProjects(prev => prev.filter(project => project.id !== projectId));

      toast({
        title: "Projeto deletado",
        description: "Projeto foi removido com sucesso",
      });

    } catch (error) {
      console.error('❌ ADMIN PROJECTS: Erro ao deletar projeto:', error);
      toast({
        title: "Erro ao deletar projeto",
        description: "Não foi possível remover o projeto",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Filtrar projetos
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.user_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || project.project_status === filterStatus;
    const matchesType = filterType === 'all' || project.project_type === filterType;

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
