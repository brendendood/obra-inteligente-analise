import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjectLoader } from '@/hooks/useProjectLoader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProjects: number;
  totalArea: number;
  recentProjects: number;
  timeSaved: number;
}

export const useDashboardData = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { loadUserProjects } = useProjectLoader();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArea: 0,
    recentProjects: 0,
    timeSaved: 0
  });
  const { toast } = useToast();

  const loadProjects = async () => {
    console.log('📊 Dashboard loadProjects:', { loading, isAuthenticated, userId: user?.id });
    
    if (loading) {
      console.log('⏳ Dashboard aguardando auth...');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('🚫 Dashboard: usuário não autenticado');
      setProjects([]);
      setIsLoadingProjects(false);
      return;
    }

    setIsLoadingProjects(true);
    try {
      console.log('🔄 Dashboard carregando projetos...');
      const userProjects = await loadUserProjects();
      console.log('📋 Dashboard projetos carregados:', userProjects.length);
      
      setProjects(userProjects);
      
      // Calcular estatísticas
      const totalArea = userProjects.reduce((sum: number, project: any) => {
        return sum + (project.total_area || 0);
      }, 0);

      const recentProjects = userProjects.filter((project: any) => {
        const createdAt = new Date(project.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length;

      const newStats = {
        totalProjects: userProjects.length,
        totalArea,
        recentProjects,
        timeSaved: userProjects.length * 2
      };

      setStats(newStats);
      console.log('📈 Stats calculadas:', newStats);
      
    } catch (error) {
      console.error('💥 Erro no Dashboard:', error);
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Carregar quando auth estiver pronto
  useEffect(() => {
    console.log('🎯 Dashboard useEffect triggered:', { loading, isAuthenticated });
    if (!loading) {
      loadProjects();
    }
  }, [loading, isAuthenticated, user?.id]);

  const handleDeleteAllProjects = async () => {
    try {
      console.log('Excluindo todos os projetos...');
      
      const { data: userProjects, error: fetchError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user?.id);

      if (fetchError) throw fetchError;

      if (userProjects && userProjects.length > 0) {
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('user_id', user?.id);

        if (deleteError) throw deleteError;

        console.log(`${userProjects.length} projetos excluídos com sucesso`);
        
        setProjects([]);
        setStats({
          totalProjects: 0,
          totalArea: 0,
          recentProjects: 0,
          timeSaved: 0
        });
        
        toast({
          title: "✅ Projetos excluídos!",
          description: `${userProjects.length} projeto(s) foram removidos com sucesso.`,
        });
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

  return {
    projects,
    stats,
    isLoadingProjects,
    loadProjects,
    handleDeleteAllProjects
  };
};
