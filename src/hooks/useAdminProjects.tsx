import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminProject {
  id: string;
  user_id: string; // Adicionando user_id que estava faltando
  name: string;
  total_area: number | null;
  city: string | null;
  state: string | null;
  project_type: string | null;
  project_status: string | null;
  estimated_budget: number | null;
  created_at: string;
  updated_at: string;
  user_email: string;
  user_name: string | null;
  file_size: number | null;
  analysis_data: any;
}

export function useAdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log('🔄 ADMIN PROJECTS: Carregando projetos...');

      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          user_profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ADMIN PROJECTS: Erro ao carregar projetos:', error);
        toast({
          title: "Erro ao carregar projetos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Buscar emails dos usuários
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ ADMIN PROJECTS: Erro ao buscar auth users:', authError);
      }

      const authUsers = authData?.users || [];

      const mappedProjects: AdminProject[] = (projectsData || []).map(project => {
        const authUser = authUsers.find(u => u.id === project.user_id);
        const userProfile = Array.isArray(project.user_profiles) && project.user_profiles.length > 0
          ? project.user_profiles[0] 
          : null;

        return {
          id: project.id,
          user_id: project.user_id, // Incluindo user_id
          name: project.name,
          total_area: project.total_area,
          city: project.city,
          state: project.state,
          project_type: project.project_type,
          project_status: project.project_status || 'draft',
          estimated_budget: project.estimated_budget,
          created_at: project.created_at,
          updated_at: project.updated_at,
          user_email: authUser?.email || 'Email não encontrado',
          user_name: userProfile?.full_name || null,
          file_size: project.file_size,
          analysis_data: project.analysis_data,
        };
      });

      console.log('✅ ADMIN PROJECTS: Projetos carregados:', mappedProjects.length);
      setProjects(mappedProjects);
    } catch (error) {
      console.error('💥 ADMIN PROJECTS: Erro crítico:', error);
      toast({
        title: "Erro crítico",
        description: "Falha ao carregar dados dos projetos",
        variant: "destructive",
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

      // Atualizar localmente
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, project_status: newStatus }
          : project
      ));

      toast({
        title: "Status atualizado",
        description: `Status do projeto alterado para ${newStatus}`,
      });
    } catch (error) {
      console.error('❌ ADMIN PROJECTS: Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível alterar o status do projeto",
        variant: "destructive",
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

      // Remover localmente
      setProjects(prev => prev.filter(project => project.id !== projectId));

      toast({
        title: "Projeto excluído",
        description: "Projeto foi removido com sucesso",
      });
    } catch (error) {
      console.error('❌ ADMIN PROJECTS: Erro ao excluir projeto:', error);
      toast({
        title: "Erro ao excluir projeto",
        description: "Não foi possível remover o projeto",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterType('');
  };

  // Filtros aplicados
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.user_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || project.project_status === filterStatus;
    const matchesType = !filterType || project.project_type === filterType;

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
    clearFilters,
    refreshProjects: loadProjects,
  };
}
