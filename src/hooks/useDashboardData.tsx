
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjectsConsistency } from '@/hooks/useProjectsConsistency';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalProjects: number;
  totalArea: number;
  recentProjects: number;
  timeSaved: number;
}

export const useDashboardData = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { 
    projects, 
    isLoading: isLoadingProjects, 
    forceRefresh: refreshProjects 
  } = useProjectsConsistency();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    timeSaved: 0
  });
  const { toast } = useToast();
  const mountedRef = useRef(true);

  // Calcular estatísticas sempre que os projetos mudarem
  useEffect(() => {
    console.log('📊 DASHBOARD: Calculando stats para', projects.length, 'projetos');
    
    if (!mountedRef.current) return;

    const totalArea = projects.reduce((sum: number, project: any) => {
      return sum + (project.total_area || 0);
    }, 0);

    const recentProjects = projects.filter((project: any) => {
      const createdAt = new Date(project.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt >= weekAgo;
    }).length;

    const newStats = {
      totalProjects: projects.length,
      totalArea,
      recentProjects,
      timeSaved: projects.length * 2
    };

    console.log('📈 DASHBOARD: Stats calculadas:', newStats);
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
      console.log('🗑️ DASHBOARD: Excluindo todos os projetos do usuário:', user.id);

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
          // Forçar refresh dos projetos após exclusão
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
      console.error('💥 DASHBOARD: Erro ao excluir projetos:', error);
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
      console.log('🧹 DASHBOARD: Cleanup executado');
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
