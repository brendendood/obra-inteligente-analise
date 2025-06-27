
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalProjects: number;
  totalArea: number;
  recentProjects: number;
  processedProjects: number;
  monthlyProjects: number;
  averageArea: number;
  projectsByType: Record<string, number>;
}

export const useDashboardData = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    projects, 
    isLoading: isLoadingProjects, 
    forceRefresh: refreshProjects 
  } = useProjectsConsistency();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    processedProjects: 0,
    monthlyProjects: 0,
    averageArea: 0,
    projectsByType: {}
  });
  const { toast } = useToast();
  const mountedRef = useRef(true);

  // Calcular estatísticas sempre que os projetos mudarem
  useEffect(() => {
    if (!mountedRef.current || !projects) return;

    const totalArea = projects.reduce((sum: number, project: any) => {
      return sum + (project.total_area || 0);
    }, 0);

    const processedProjects = projects.filter((project: any) => 
      project.analysis_data && Object.keys(project.analysis_data).length > 0
    ).length;

    const recentProjects = projects.filter((project: any) => {
      const createdAt = new Date(project.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt >= weekAgo;
    }).length;

    const monthlyProjects = projects.filter((project: any) => {
      const createdAt = new Date(project.created_at);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return createdAt >= monthAgo;
    }).length;

    const averageArea = projects.length > 0 ? Math.round(totalArea / projects.length) : 0;

    // Agrupar projetos por tipo
    const projectsByType = projects.reduce((acc: Record<string, number>, project: any) => {
      const type = project.project_type || 'Não definido';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const newStats = {
      totalProjects: projects.length,
      totalArea,
      recentProjects,
      processedProjects,
      monthlyProjects,
      averageArea,
      projectsByType
    };

    setStats(newStats);
  }, [projects]);

  // Função para excluir todos os projetos
  const handleDeleteAllProjects = async () => {
    if (!user || !isAuthenticated) {
      toast({
        title: "❌ Erro de autenticação",
        description: "Você precisa estar logado para excluir projetos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: userProjects, error: fetchError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      if (userProjects && userProjects.length > 0) {
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
        
        if (mountedRef.current) {
          await refreshProjects();
          
          toast({
            title: "✅ Projetos excluídos!",
            description: `${userProjects.length} projeto(s) foram removidos com sucesso.`,
          });
        }
      } else {
        toast({
          title: "ℹ️ Nenhum projeto encontrado",
          description: "Não há projetos para excluir.",
        });
      }
    } catch (error) {
      console.error('Erro ao excluir projetos:', error);
      toast({
        title: "❌ Erro ao excluir",
        description: "Não foi possível excluir os projetos.",
        variant: "destructive",
      });
    }
  };

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    projects,
    stats,
    isLoadingProjects,
    loadProjects: refreshProjects,
    handleDeleteAllProjects,
    forceRefresh: refreshProjects
  };
};
